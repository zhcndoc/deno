---
last_modified: 2026-05-20
title: "模块自定义挂钩"
description: "使用与 Node.js 兼容的 module.registerHooks() API 在 Deno 中自定义模块解析和加载。创建虚拟模块、转译自定义格式并拦截导入。"
---

Deno 支持 Node.js
[`module.registerHooks()`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)
API，它允许你拦截并自定义模块的解析和加载方式。
这使得你可以在不修改导入代码的情况下，实现虚拟模块、自定义转译、模块别名以及类似
用例。`node:module` API 是 Deno 更广泛的 [Node.js 兼容性](/runtime/fundamentals/node/) 层的一部分。

这些挂钩是**同步的**，并且在与你的应用程序**同一线程**中运行。它们既适用于 ES 模块（`import`）也适用于 CommonJS
（`require()`）。

> Deno 不实现异步的 `module.register()` API。请使用
> `registerHooks()` 同时进行 CommonJS 和 ESM 自定义。

## 基本示例

```js title="main.mjs"
import { registerHooks } from "node:module";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "virtual:greet") {
      return { url: "file:///virtual_greet.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///virtual_greet.js") {
      return {
        source: 'export const msg = "hello from hooks";',
        format: "module",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

const { msg } = await import("virtual:greet");
console.log(msg); // "hello from hooks"

// 不再需要时移除挂钩
hooks.deregister();
```

```sh
deno run --allow-all main.mjs
```

## 使用 `--import` 加载挂钩

为了保持应用代码整洁——并确保在程序中的任何内容导入受其影响的模块之前就已安装挂钩——
将 `registerHooks()` 调用放在它自己的加载器文件中，并使用 `--import` 预加载它（
这是 `--preload` 的别名）。

```js title="loader.mjs"
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "virtual:greet") {
      return { url: "file:///virtual_greet.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///virtual_greet.js") {
      return {
        source: 'export const msg = "hello from loader";',
        format: "module",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
```

```js title="main.mjs"
const { msg } = await import("virtual:greet");
console.log(msg); // "hello from loader"
```

使用指向加载器的 `--import` 运行：

```sh
deno run --import ./loader.mjs main.mjs
```

`--import` 接受多个值，因此你可以组合加载器（例如
`--import ./aliases.mjs --import ./transpile.mjs`）。它们按给定顺序注册，
而这与它们运行顺序相反——参见
[挂钩链](#hook-chaining)。该标志适用于
[`deno run`](/runtime/reference/cli/run/),
[`deno test`](/runtime/reference/cli/test/),
[`deno bench`](/runtime/reference/cli/bench/)，以及
[`deno serve`](/runtime/reference/cli/serve/)。

## 用例

### 自定义转译

即时转换非标准文件格式：

```js
import { registerHooks } from "node:module";

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".coffee")) {
      const result = nextLoad(url, context);
      const compiled = compileCoffeeScript(result.source);
      return { source: compiled, format: "module", shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
```

### 模块别名

将导入重定向到其他模块：

```js
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    // 将 lodash 重定向到 lodash-es
    if (specifier === "lodash") {
      return nextResolve("lodash-es", context);
    }
    return nextResolve(specifier, context);
  },
});
```

### 虚拟模块

创建仅存在于内存中的模块：

```js
import { registerHooks } from "node:module";

const virtualModules = new Map([
  ["virtual:config", 'export default { debug: true, version: "1.0.0" };'],
  ["virtual:env", `export const NODE_ENV = "${process.env.NODE_ENV}";`],
]);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (virtualModules.has(specifier)) {
      return { url: `file:///virtual/${specifier}`, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    for (const [name, source] of virtualModules) {
      if (url === `file:///virtual/${name}`) {
        return { source, format: "module", shortCircuit: true };
      }
    }
    return nextLoad(url, context);
  },
});
```

### 测试时的模拟

在测试期间用模拟替换模块：

```js
import { registerHooks } from "node:module";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./database.js") {
      return { url: "file:///mock_database.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///mock_database.js") {
      return {
        source: 'export const query = () => [{ id: 1, name: "mock" }];',
        format: "module",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

// 运行测试...

hooks.deregister(); // 测试结束后清理
```

## `resolve` 挂钩

`resolve` 挂钩会拦截模块解析，将标识符映射到 URL。

```js
resolve(specifier, context, nextResolve);
```

**参数：**

| 参数          | 类型       | 描述                                           |
| ------------- | ---------- | ---------------------------------------------- |
| `specifier`   | `string`   | 正在解析的模块标识符                           |
| `context`     | `object`   | 解析上下文（见下文）                           |
| `nextResolve` | `function` | 委托给下一个挂钩或默认解析器                   |

**上下文对象：**

| 属性               | 类型       | 描述                                               |
| ------------------ | ---------- | -------------------------------------------------- |
| `conditions`       | `string[]` | 导入条件（例如，ESM 的 `["node", "import"]`）      |
| `parentURL`        | `string`   | 导入模块的 URL                                     |
| `importAttributes` | `object`   | 来自 import 语句的导入属性                         |

**返回值：**

| 属性           | 类型      | 描述                                 |
| -------------- | --------- | ------------------------------------ |
| `url`          | `string`  | 模块解析后的 URL                     |
| `shortCircuit` | `boolean` | 如果为 `true`，则跳过链中的其余挂钩 |

要么调用 `nextResolve()` 进行委托，要么返回带有
`shortCircuit: true` 的结果。你必须二者择一。

## `load` 挂钩

`load` 挂钩会拦截模块加载，为已解析的 URL 提供源代码。

```js
load(url, context, nextLoad);
```

**参数：**

| 参数      | 类型       | 描述                                         |
| --------- | ---------- | -------------------------------------------- |
| `url`     | `string`   | 已解析的模块 URL                             |
| `context` | `object`   | 加载上下文（见下文）                         |
| `nextLoad` | `function` | 委托给下一个挂钩或默认加载器                 |

**上下文对象：**

| 属性               | 类型       | 描述                                           |
| ------------------ | ---------- | ---------------------------------------------- |
| `format`           | `string`   | 模块格式提示（例如 `"module"`、`"commonjs"`）   |
| `conditions`       | `string[]` | 导入条件                                     |
| `importAttributes` | `object`   | 导入属性                                     |

**返回值：**

| 属性           | 类型                       | 描述                                      |
| -------------- | -------------------------- | ----------------------------------------- |
| `source`       | `string \| Buffer \| null` | 模块源代码                                 |
| `format`       | `string`                   | 模块格式：`"module"`、`"commonjs"`、`"json"` |
| `shortCircuit` | `boolean`                  | 如果为 `true`，则跳过链中的其余挂钩          |

## 注销挂钩

`registerHooks()` 返回一个带有 `deregister()` 方法的对象，用于移除这些
挂钩：

```js
const hooks = registerHooks({/* ... */});

// 之后，移除挂钩
hooks.deregister();
```

## 挂钩链

你可以注册多个挂钩；它们会形成一个链。挂钩按 LIFO（后注册，先调用）顺序运行，
并且每个挂钩都可以调用 `nextResolve()` /
`nextLoad()` 将控制权传递给链中的前一个挂钩：

```js
import { registerHooks } from "node:module";

// 挂钩 1：先注册，后运行
const hook1 = registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (url.includes("target.js")) {
      return {
        source: 'export default "from hook1"',
        format: "module",
        shortCircuit: true,
      };
    }
    return result;
  },
});

// 挂钩 2：后注册，先运行
const hook2 = registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context); // 调用 hook1
    if (url.includes("target.js")) {
      return {
        source: 'export default "from hook2"',
        format: "module",
        shortCircuit: true,
      };
    }
    return result;
  },
});

// 结果来自 hook2，因为它先运行（LIFO）
```

## CommonJS

挂钩也会拦截 `require()`：

```js title="main.cjs"
const { registerHooks } = require("module");

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "virtual-module") {
      return { url: "file:///virtual.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///virtual.js") {
      return {
        source: "module.exports = { value: 42 }",
        format: "commonjs",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

const mod = require("virtual-module");
console.log(mod.value); // 42

hooks.deregister();
```
