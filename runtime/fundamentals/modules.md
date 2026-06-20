---
last_modified: 2026-06-19
title: "Modules"
description: "了解 Deno 的 ECMAScript 模块系统如何工作：导入本地和第三方模块、导入属性、导入映射，以及支持的导入类型，例如 Wasm 和 data URL。"
oldUrl:
  - /runtime/manual/basics/modules/
  - /runtime/manual/basics/modules/module_metadata/
  - /runtime/manual/linking_to_external_code
  - /runtime/manual/basics/import_maps/
---

Deno 使用
[ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
作为其主要模块系统，这是 JavaScript 的官方标准。你可以使用标准的 `import` 和 `export` 语句在文件之间共享
代码，并直接运行它，无需打包器或构建步骤。这与浏览器使用的模块系统相同，因此你编写的代码在不同环境中都具有可移植性。

Deno 也支持运行 Node 较旧的 CommonJS 模块（`require` 和 `module.exports`），
因此现有的 npm 包和 Node 项目无需转换即可工作。这两种
系统都得到了完整支持并且可以互操作，但新代码推荐使用 ECMAScript 模块；只有在依赖项或
现有项目仍在使用 CommonJS 时才优先考虑它。

Deno 会根据文件扩展名和最近的
`package.json` 来决定文件使用哪种系统：`.mjs` 文件始终是 ES 模块，`.cjs` 文件始终是
CommonJS，而 `.js` 和 `.ts` 文件默认被视为 ES 模块，除非某个
`package.json` 设置了 `"type": "commonjs"`。本页其余部分介绍 ES
模块；有关 `require`、模块解析以及 ESM/CommonJS 互操作的工作方式，请参见
[CommonJS 支持](/runtime/fundamentals/node/#commonjs-support)。

## 导入模块

在这个示例中，`add` 函数是从本地的 `calc.ts` 模块导入的。

```ts title="calc.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

```ts title="main.ts"
// 从与此文件相邻的 `calc.ts` 模块导入
import { add } from "./calc.ts";

console.log(add(1, 2)); // 3
```

你可以在包含 `main.ts` 和 `calc.ts` 的目录中运行此示例，只需执行 `deno run main.ts`。

使用 ECMAScript 模块时，本地导入规范必须始终包含完整的文件扩展名，不能省略。

```ts title="example.ts"
// 错误：缺少文件扩展名
import { add } from "./calc";

// 正确：包含文件扩展名
import { add } from "./calc.ts";
```

## 动态导入

上面的 `import` 语句是静态的：说明符是一个字符串字面量，并且
模块会在你的代码运行之前加载。你也可以按需使用
`import()` 函数加载模块，它会返回该模块命名空间的 promise：

```ts title="main.ts"
const { add } = await import("./calc.ts");

console.log(add(1, 2)); // 3
```

由于 `import()` 在运行时执行，说明符可以被计算，模块
只有在调用执行时才会被获取和求值。这对于按条件加载
代码，或将很少使用的功能排除在启动路径之外很有用：

```ts
if (Deno.args.includes("--greet")) {
  const { greet } = await import("./greet.ts");
  greet();
}
```

当动态 `import()` 的说明符是字符串字面量时，它属于静态
模块图的一部分，并且无需额外权限即可加载。若其说明符是在运行时计算的，
则会在执行时接受权限系统检查：本地
路径需要 `--allow-read`，远程 URL 需要 `--allow-import`。详见
[安全性](/runtime/fundamentals/security/)。

## 导入元数据

在任何模块中，`import.meta` 都会暴露当前模块的信息
以及相对于它解析路径的辅助方法：

```ts title="main.ts"
console.log(import.meta.url); // file:///path/to/main.ts
console.log(import.meta.main); // true if this is the entry module
console.log(import.meta.filename); // /path/to/main.ts (local modules only)
console.log(import.meta.dirname); // /path/to (local modules only)
console.log(import.meta.resolve("./data.json")); // resolves a specifier to a URL
```

`import.meta.main` 是一种常见做法，可让文件既能作为入口点运行，
也能作为可导入的库：

```ts title="server.ts"
export function createServer() {/* ... */}

// 仅在直接运行时启动服务器，而不是在被导入时。
if (import.meta.main) {
  createServer();
}
```

对于远程模块，`filename` 和 `dirname` 的值为 `undefined`。如需完整
讲解，请参见
[模块元数据教程](/examples/module_metadata_tutorial/)。

## 导入属性

Deno 支持 `with { type: "json" }` 导入属性语法来导入 JSON 文件：

```ts
import data from "./data.json" with { type: "json" };

console.log(data.property); // 将 JSON 数据作为对象访问
```

从 Deno 2.4 开始，也可以导入 `text` 和 `bytes` 模块。

```ts
import text from "./log.txt" with { type: "text" };

console.log(typeof text === "string");
// true
console.log(text);
// 来自文本文件的问候
```

:::info `text` 导入

在 Deno 2.8 中已稳定，并且不再需要标志。

:::

```ts
import bytes from "./image.png" with { type: "bytes" };

console.log(bytes instanceof Uint8Array);
// true
console.log(bytes);
// Uint8Array(12) [
//    72, 101, 108, 108, 111,
//    44,  32,  68, 101, 110,
//   111,  33
// ]
```

:::info `bytes` 导入

仍处于实验阶段。可使用 `--unstable-raw-imports` CLI 标志或
[`deno.json`](/runtime/fundamentals/configuration/) 中的
`unstable.raw-import` 选项启用。

:::

## 延迟模块求值

从 Deno 2.8 开始，支持
[TC39 延迟模块求值提案](https://github.com/tc39/proposal-defer-import-eval)。
`import defer` 语法会加载一个模块（包括其依赖项），但在你第一次从命名空间读取某个属性之前，**不会**执行其顶层代码：

```ts title="main.ts"
import defer * as expensive from "./expensive.ts";

console.log("startup is fast: expensive.ts has not run yet");


// 触碰任意属性都会触发同步求值
console.log(expensive.value);
```

可用它来推迟那些只在特定条件下才需要的模块成本；例如，CLI 工具中的错误路径代码，或那些初始化开销较大的功能开关实现。

该提案目前仍处于 TC39 Stage 3，因此该语法被视为实验性，未来可能会变化。标准的 `import` 仍然是正确的默认选择。

## WebAssembly 模块

Deno 支持直接导入 Wasm 模块：

```ts
import { add } from "./add.wasm";

console.log(add(1, 2));
```

要了解更多信息，请访问 [WebAssembly 部分](/runtime/reference/wasm/#wasm-modules)

## 数据 URL 导入

Deno 支持导入数据 URL，这使您能够导入不在单独文件中的内容。这对于测试、原型设计或当您需要以编程方式生成模块时非常有用。

您可以使用 `data:` URL 方案动态创建模块：

```ts
// 从数据 URL 导入一个简单的 JavaScript 模块
import * as module from "data:application/javascript;base64,ZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAiSGVsbG8gZnJvbSBkYXRhIFVSTCI7";
console.log(module.message); // 输出：来自数据 URL 的 Hello

// 你也可以使用非 base64 格式
const plainModule = await import(
  "data:application/javascript,export function greet() { return 'Hi there!'; }"
);
console.log(plainModule.greet()); // 输出：Hi there!

// 带有文本内容的简单示例
const textModule = await import(
  "data:text/plain,export default '这是纯文本'"
);
console.log(textModule.default); // 输出：这是纯文本
```

数据 URL 格式遵循以下模式：

```sh
data:[<媒体类型>][;base64],<数据>
```

对于 JavaScript 模块，请使用 `application/javascript` 作为媒体类型。

TypeScript 也支持 `application/typescript`。此功能特别适用于在隔离环境中测试模块以及在测试期间创建模拟模块。

在 Deno 中处理第三方模块时，请使用与本地代码相同的 `import` 语法。第三方模块通常从远程注册中心导入，并以 `jsr:` 或 `npm:` 开头。

```ts title="main.ts"
import { camelCase } from "jsr:@luca/cases@1.0.0";
import { say } from "npm:cowsay@1.6.0";
```

Deno 推荐使用 [JSR](https://jsr.io)，这是一个现代的 JavaScript 注册中心，用于第三方模块。在那里，你将找到许多文档完善的 ES 模块供你的项目使用，包括
[Deno 标准库](/runtime/reference/std/)。

你可以
[在这里阅读更多关于 Deno 对 npm 包支持的内容](/runtime/fundamentals/node/#using-npm-modules)。

## 管理第三方模块和库

在多个文件中导入模块时，输入完整版本说明符的模块名称可能会变得繁琐。您可以通过在 `deno.json` 文件中使用 `imports` 字段来集中管理远程模块。我们称这个 `imports` 字段为 **导入映射**，它基于 [导入映射标准]。

[导入映射标准]: https://html.spec.whatwg.org/multipage/webappapis.html#import-maps

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0",
    "cowsay": "npm:cowsay@^1.6.0"
  }
}
```

使用重新映射的说明符，代码看起来更加简洁：

```ts title="main.ts"
import { camelCase } from "@luca/cases";
import { say } from "cowsay";
```

重新映射后的名称可以是任何有效的说明符。这是 Deno 中一个非常强大的功能，可以重新映射任何内容。了解更多请参见
[配置依赖部分](/runtime/reference/deno_json/#dependencies)。

## 区分 `deno.json` 中的 `imports` 或 `importMap` 和 `--import-map` 选项

根据 [导入映射标准]，每个模块需要两个条目：一个是模块说明符本身，另一个是带尾随 `/` 的说明符。这是因为该标准仅允许每个模块说明符有一个条目，而尾随的 `/` 表示该说明符指向一个目录。例如，在使用 `--import-map import_map.json` 选项时，`import_map.json` 文件必须为每个模块包含两个条目（注意这里使用 `jsr:/@std/async` 而非 `jsr:@std/async`）：

```json title="import_map.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0",
    "@std/async/": "jsr:/@std/async@^1.0.0/"
  }
}
```

`deno.json` 中 `importMap` 字段引用的 `import_map.json` 文件行为与使用 `--import-map` 选项完全相同，对每个包含的模块条目要求相同。

相比之下，`deno.json` 扩展了导入映射标准。当你在 `deno.json` 中使用 `imports` 字段或通过 `importMap` 字段引用 `import_map.json` 文件时，只需要指定模块说明符而不带尾随 `/`：

```json title="deno.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0"
  }
}
```

## 管理依赖

现在你已经了解了 Deno 如何解析和导入模块，请参阅
[依赖管理指南](/runtime/packages/)，了解日常任务：
使用 `deno add` / `deno
remove` 添加和删除包、固定版本、
覆盖和供应依赖项、锁文件和完整性检查、供应链管理、发布你自己的模块，以及使用私有注册中心。

## 从命令行更新版本

你不必手动编辑 `deno.json` 中的版本号。要将
依赖项移动到更新的版本，请运行
[`deno outdated`](/runtime/reference/cli/outdated/) 查看哪些版本落后，然后使用
`deno outdated --update` 进行升级：

```sh
deno outdated            # 列出有更新版本可用的依赖项
deno outdated --update   # 在 deno.json 中更新它们
```

要在发布之间递增你自己包的 `version` 字段，请使用
[`deno bump-version`](/runtime/reference/cli/bump_version/)：

```sh
deno bump-version patch  # 1.4.6 -> 1.4.7（另外还有：minor、major 或 prerelease）
```
