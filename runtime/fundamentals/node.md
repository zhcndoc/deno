---
last_modified: 2026-06-15
title: "Node 和 npm 兼容性"
description: "Deno 中使用 Node.js 模块和 npm 包的指南。了解兼容性特性、导入 npm 包以及 Node.js 与 Deno 环境之间的差异。"
oldUrl:
  - /runtime/reference/node/
  - /runtime/manual/npm_nodejs/std_node/
  - /runtime/manual/node/
  - /runtime/manual/npm_nodejs/cdns/
  - /runtime/manual/using_deno_with_other_technologies/node/cdns/
  - /runtime/manual/node/node_specifiers
  - /runtime/manual/node/package_json
  - /runtime/manual/node/faqs
  - /runtime/manual/node/npm_specifiers
  - /runtime/manual/node/private_registries
---

大多数 Node.js 代码无需修改即可在 Deno 中运行。下面是一个标准的 Node
HTTP 服务器，使用 `deno` 而不是 `node` 执行：

```js title="main.mjs"
import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.end("Hello from Node-style code in Deno\n");
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000/");
});
```

```sh
$ deno run --allow-net main.mjs
Listening on http://localhost:3000/
```

先在下面的概览中找到你关心的方面，然后跳转到对应章节查看可运行示例、背后的规则，以及在它不起作用时该怎么做。

## 一览兼容性

| 方面                                            | 状态                                                  | 详情                                                                                   |
| ----------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `node:` 内置模块                                | 支持；几乎每个模块都已实现                             | [使用 Node 内置模块](#use-a-node-built-in-module)                                       |
| npm 包                                           | 支持，通过 `npm:` 标识符或 `package.json`             | [使用 npm 包](#using-npm-packages)                                                       |
| Node 全局对象（`process`、`Buffer`、`__dirname`） | 支持；其中一些需要显式导入                              | [使用 Node 全局对象](#use-node-globals-like-process-and-buffer)                         |
| `package.json`（依赖、脚本、`type`）             | 支持：依赖、`deno task` 脚本、`type`                   | [运行现有的 Node 项目](#run-an-existing-node-project)                                    |
| CommonJS（`require()`、`.cjs`）                  | 支持；模块类型检测在一种情况下有所不同                   | [CommonJS 支持](#commonjs-support)                                                      |
| `node_modules` 布局                              | 可选；三种模式，隔离或提升式布局                         | [控制 node_modules](#control-node_modules)                                              |
| 原生插件（Node-API）                              | 支持，但需要本地 `node_modules` 和 `--allow-ffi`       | [使用带原生插件的包](#use-packages-with-native-addons)                                   |
| `.npmrc` 和注册表                                | 支持：私有注册表、认证令牌、mTLS                         | [私有注册表](#private-registries), [.npmrc 配置](#.npmrc-configuration)                  |

截至 Deno 2.8，**Node 自身测试套件中超过 75% 已通过** Deno 测试，覆盖了几乎所有 `node:` 模块。大多数纯 JavaScript 的 npm 包无需修改即可工作。需要诚实说明的是：某些 API 只是部分实现，带原生插件的包需要本地 `node_modules` 目录，而且少数工具假定 npm 精确的磁盘布局。下面各节会逐一介绍这些情况。

你可以在
[node-test-viewer.deno.dev](https://node-test-viewer.deno.dev/) 跟踪当前状态，并浏览
[受支持的 Node.js API 列表](/runtime/reference/node_apis/)。

## 使用 npm 包

要使用来自 npm 的包，请使用 `npm:` 前缀导入并运行文件：

```ts title="main.js"
import * as emoji from "npm:node-emoji";

console.log(emoji.emojify(`:sauropod: :heart:  npm`));
```

```sh
$ deno run main.js
🦕 ❤️ npm
```

Deno 会在首次运行时下载该包并将其存储在全局缓存中，因此你的项目目录保持干净。完整的标识符格式为：

```console
npm:<包名>[@<版本要求>][/<子路径>]
```

需要了解的一些规则：

- npm 包在与代码其余部分相同的
  [权限系统](/runtime/fundamentals/security/) 下运行。
  如果某个包读取文件或环境变量，请授予 `-R` 或 `-E`（或者
  回答权限提示）。
- 你可以在 `package.json` 或 `deno.json` 的 `imports` 映射中声明依赖，
  而不是直接在代码中写 `npm:` 标识符。参见
  [运行现有的 Node 项目](#run-an-existing-node-project)。
- 如果某个包因 `node_modules` 中缺少文件而报错，它期望存在本地
  `node_modules` 目录。参见
  [控制 node_modules](#control-node_modules)。

有关常用库的示例，请参阅
[教程部分](/runtime/tutorials)。

## 使用 Node 内置模块

Deno 通过兼容层提供 Node 的内置 API。使用 `node:` 前缀导入它们：

```js title="main.mjs"
import * as os from "node:os";
console.log(os.cpus());
```

用 `deno run main.mjs` 运行它，你会得到与在 Node.js 中运行该程序相同的输出。将应用中的任何导入更新为使用 `node:` 标识符，应该就能让任何使用 Node 内置模块的代码像在 Node.js 中一样工作。

`node:module` 内置模块包含
[`registerHooks()`](/runtime/reference/loader_hooks/) API，你可以用它在程序内部自定义模块解析和加载。

**裸导入也可以工作。** 自 Deno 2.9 起，匹配 Node
内置模块的标识符即使没有前缀也会解析到它，因此 `import * as os from "os"`
无需前缀和标志即可运行。在 2.9 之前，裸形式会报错，除非你传入
`--unstable-bare-node-builtins`。不过仍然建议使用明确的 `node:`
形式：它更明确，也是 Deno LSP 快速修复会插入的形式，而且在 Node.js 中也能工作。`deno.json` 的 `imports` 条目或同名的 `package.json` 依赖仍然会优先于内置模块，而 `node_modules` 中的包不再会遮蔽它，这与 Node.js 一致。

<a href="/api/node/" class="docs-cta runtime-cta">探索 Node 内置 API</a>

## 使用 Node 全局对象如 process 和 Buffer

Node.js 定义了许多
[全局对象](https://nodejs.org/api/globals.html)，供所有程序使用。以下是你在实际项目中最常遇到的那些对象在 Deno 中的对应方式：

| Node 全局对象               | 在 Deno 中                                 | 该怎么做                                   |
| ---------------------------- | ---------------------------------------- | ----------------------------------------- |
| `process`                    | 处处可用                                    | 直接使用，或从 `node:process` 导入        |
| `Buffer`                     | 在你自己的代码中不是全局对象                  | 从 `node:buffer` 导入                    |
| `__filename`                 | 未定义                                      | 使用 `import.meta.filename`              |
| `__dirname`                  | 未定义                                      | 使用 `import.meta.dirname`                |
| `require()`                  | 在 CommonJS 文件中可用                       | 参见 [CommonJS 支持](#commonjs-support)   |
| `setTimeout` / `setInterval` | 可用；自 Deno 2.8 起采用 Node 语义            | 直接使用                                   |

各项说明如下：

- `process` 目前是 npm 包中最常用的全局对象，所有代码都可使用。若想优先使用显式的 `node:process` 导入，请启用
  [`no-process-global`](/lint/rules/no-process-global/) lint 规则（自 Deno 2.8 起默认关闭）；`deno lint` 随后会标记对该全局对象的使用：

  ```js title="process.js"
  console.log(process.versions.deno);
  ```

  ```shell
  $ deno run process.js
  2.8.3
  $ deno lint process.js
  error[no-process-global]: NodeJS process global is discouraged in Deno
   --> /process.js:1:13
    |
  1 | console.log(process.versions.deno);
    |             ^^^^^^^
    = hint: Add `import process from "node:process";`

    docs: https://docs.deno.com/lint/rules/no-process-global

如果您想使用不支持 TypeScript node16 模块解析的包，您可以：

  Found 1 problem (1 fixable via --fix)
  Checked 1 file
  ```

- `Buffer` 需要从 `node:buffer` 模块中显式导入：

  ```js title="buffer.js"
  import { Buffer } from "node:buffer";

  const buf = new Buffer(5, "0");
  ```

  对于需要 Node.js 特定类型（如 `BufferEncoding`）的 TypeScript 用户，
  使用 `@types/node` 时可以通过 `NodeJS` 命名空间获得这些类型：

  ```ts title="buffer-types.ts"
  /// <reference types="npm:@types/node" />

  // 现在你可以使用 NodeJS 命名空间类型
  function writeToBuffer(
    data: string,
    encoding: NodeJS.BufferEncoding,
  ): Buffer {
    return Buffer.from(data, encoding);
  }
  ```

  更推荐使用
  [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
  或其他
  [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
  子类。

- `setTimeout` / `setInterval`：从 Deno 2.8 开始，全局定时器函数返回的是 Node.js [`Timeout`](https://nodejs.org/api/timers.html#class-timeout)
  对象，而不是数字，这与 Node.js 语义一致。返回的对象暴露了 `.ref()`、`.unref()`、`.refresh()` 和 `.hasRef()` 等方法。它仍然可以通过（`Symbol.toPrimitive`）转换为数字，因此将定时器 ID 存为数字或传递给 `clearTimeout`/`clearInterval` 的现有代码仍可按原样工作。

  ```ts
  const t = setTimeout(() => {}, 1000);
  t.unref(); // 不要让这个定时器保持事件循环存活
  clearTimeout(t);
  ```

## 运行现有的 Node 项目

Deno 能理解 `package.json`，因此典型的 Node 项目只需两个命令即可运行：一个用于安装，一个用于执行。

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "start": "node main.js"
  },
  "dependencies": {
    "chalk": "^5"
  }
}
```

```js title="main.js"
import chalk from "chalk";
console.log(chalk.green("ready"));
```

```sh
$ deno install
$ deno run -R -E main.js
ready
```

`deno install` 会读取 `package.json` 并创建 `node_modules` 目录，因此像 `"chalk"` 这样的裸导入可以像在 Node 中一样解析。`-R` 和 `-E` 标志授予解析 `node_modules`（以及 chalk 的颜色检测）所需的读取和环境访问权限。

`package.json` 中哪些内容会被沿用：

- **依赖项**：其中声明的依赖会由 `deno install` 安装，并且可以通过裸标识符导入。
- **脚本**：通过 `deno task` 运行，类似 `npm run`：`deno task start` 会执行 `start` 脚本。脚本在 Deno 内置的跨平台 shell 中执行，而 `node_modules/.bin` 中安装的 CLI 工具（测试运行器、打包器、linter）会自动解析。命令本身仍然会运行它们所指定的可执行文件，因此调用 `node` 的脚本会运行 Node。
- **字段**：像 `"type"` 这样的字段在解析模块时会被尊重（参见
  [CommonJS 支持](#commonjs-support)）。

带有 `package.json` 的项目默认使用手动 `node_modules` 模式，这就是为什么需要显式执行 `deno install` 步骤。[控制 node_modules](#control-node_modules) 这一节介绍了其他方案。

**如果它不起作用：** 如果你在安装前就运行，Deno 会直接指出修复方法：

```sh
$ deno run -R -E main.js
error: Could not resolve "chalk", but found it in a package.json. Deno expects the node_modules/ directory to be up to date. Did you forget to run `deno install`?
    at file:///my-app/main.js:1:19
```

运行 `deno install`（或设置 `"nodeModulesDir": "auto"` 以跳过显式安装步骤）然后重试。

如需完整检查清单、可选工具链改进，以及 Node 到 Deno 的命令速查表，请参阅
[从 Node.js 迁移到 Deno 指南](/runtime/migrate/)。

## 运行 npm CLI 工具

您可以直接运行 npm CLI 工具（带有 `bin` 条目的包），方式与使用 `npx` 类似：

```sh
$ deno run -R -E npm:cowsay@1.5.0 "Hello there!"
 ______________
< 你好呀！ >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

该指定符格式接受一个子路径，用于在一个包包含多个二进制文件时选择特定的二进制：

```console
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

例如，`deno run -R -E npm:cowsay@1.5.0/cowthink` 会运行同一包中的 `cowthink` 二进制。脚手架工具的工作方式也相同；以下这组命令是等价的：

```console
# npx 允许从 npm 或 URL 远程执行包
$ npx create-next-app@latest

# deno run 允许从多个位置远程执行包，
# 并且可以通过 `npm:` 指定符将范围限定到 npm。
$ deno run -A npm:create-next-app@latest
```

**如果它不能工作：** 读取文件或环境变量的工具会在权限提示处停止（或在 CI 中失败）。请授予该工具所需的特定权限；对于需要广泛访问权限的可信脚手架工具，也可以使用 `-A`。

## CommonJS 支持

Deno 默认支持 CommonJS 模块。下面是一个带有 npm 依赖的 `.cjs` 文件的最小可运行配置：

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

```js title="main.cjs"
const express = require("express");
```

```shell
$ deno install npm:express
Dependencies:
+ npm:express 5.2.1

$ deno run -R -E main.cjs
[Function: createApplication] {
  application: {
    init: [Function: init],
    defaultConfiguration: [Function: defaultConfiguration],
    ...
  }
}
```

这个方案由两个要求驱动。CommonJS 解析期望依赖项安装在本地 `node_modules` 目录中，而 `"nodeModulesDir": "auto"` 可以确保这一点（参见
[控制 node_modules](#control-node_modules)）。此外，Deno 的权限系统也适用于 CommonJS 代码：您通常需要 `-R`（`--allow-read`）和 `-E`（`--allow-env`），因为 Deno 会探测 `package.json` 文件和 `node_modules` 目录来解析 CommonJS 模块。

### Deno 如何判断一个文件是 CommonJS

如果文件扩展名是 `.cjs`，Deno 会在不查看 `package.json` 的情况下将该模块视为 CommonJS。

如果旁边有一个带有 `"type": "commonjs"` 选项的 `package.json` 文件，或者在带有 `package.json` 的项目中沿目录树向上查找时找到了这样的文件，Deno 也会尝试将 `.js`、`.jsx`、`.ts` 和 `.tsx` 文件作为 CommonJS 加载：

```json title="package.json"
{
  "type": "commonjs"
}
```

```js title="main.js"
const express = require("express");
```

像 Next.js 的打包器等工具会自动生成这样的 `package.json` 文件。如果您已有一个使用 CommonJS 模块的现有项目，只需在 `package.json` 文件中添加 `"type": "commonjs"` 选项，就可以让它同时在 Node.js 和 Deno 中工作。

除此之外，Deno 不会分析模块内容来检测 CommonJS，因为在文件系统上查找 `package.json` 文件并分析模块以检测它是否为 CommonJS，比不这样做要花费更长时间，而且这样做也会抑制 CommonJS 的使用。您可以在 Deno >= 2.1.2 中使用 `--unstable-detect-cjs` 标志来启用此检测。除非存在 `package.json` 文件且其内容为 `{ "type": "module" }`，否则此检测都会生效。

### 在 ES 模块中调用 require()

您可以手动创建 `require()` 函数的实例：

```js title="main.js"
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
```

在这种情况下，适用的要求与运行 `.cjs` 文件时相同：依赖项需要手动安装，并且要提供适当的权限标志。

### 混用 CommonJS 和 ES 模块

Deno 的 `require()` 实现支持 `require` ES 模块。这与 Node.js 中的行为相同：您只能 `require()` 那些在其模块图中没有顶层 `await` 的 ES 模块。换句话说，您只能 `require()` “同步”的 ES 模块。

```js title="greet.js"
export function greet(name) {
  return `Hello ${name}`;
}
```

```js title="esm.js"
import { greet } from "./greet.js";

export { greet };
```

```js title="main.cjs"
const esm = require("./esm");
console.log(esm);
console.log(esm.greet("Deno"));
```

```shell
$ deno run -R main.cjs
[Module: null prototype] { greet: [Function: greet] }
Hello Deno
```

反过来也可以。您可以在 ES 模块中导入 CommonJS 文件：

```js title="greet.cjs"
module.exports = {
  hello: "world",
};
```

```js title="main.js"
import greet from "./greet.cjs";
console.log(greet);
```

```shell
$ deno run main.js
{ hello: "world" }
```

**如果它不能工作：** 当 Deno 发现某个文件看起来像 CommonJS 但没有按 CommonJS 加载时，会给出提示。将一个在 `"type": "module"` 项目中使用 `require` 的 `.js` 文件加载时，错误信息本身就会给出修复方法：

```sh
$ deno run main.js
error: Uncaught (in promise) ReferenceError: require is not defined
const os = require("node:os");
           ^
    at file:///my-app/main.js:1:12

    info: Deno supports CommonJS modules in .cjs files, or when the closest
          package.json has a "type": "commonjs" option.
    hint: Rewrite this module to ESM,
          or change the file extension to .cjs,
          or add package.json next to the file with "type": "commonjs" option,
          or pass --unstable-detect-cjs flag to detect CommonJS when loading.
    docs: https://docs.deno.com/go/commonjs
```

每当您看到关于 `module` 或 `require` 未定义的错误时，以下四种修复方式之一都适用：

- 将代码重写为 ESM
- 将文件扩展名改为 `.cjs`
- 添加一个附近的 `package.json`，内容为 `{ "type": "commonjs" }`
- 使用 `--unstable-detect-cjs` 运行

## 控制 node_modules

当您运行 `npm install` 时，npm 会在项目中创建一个 `node_modules` 目录，用于存放 `package.json` 文件中指定的依赖项。默认情况下，Deno 会从一个中心化的全局缓存中解析 npm 包，而不会创建 `node_modules` 目录。这样可以节省空间，让项目目录保持整洁，也是新 Deno 项目的推荐配置。

不过，在某些情况下，即使您没有 `package.json`，也可能需要在 Deno 项目中使用本地 `node_modules` 目录（例如使用 Next.js 或 Svelte 等框架，或者依赖使用 Node-API 的 npm 包时）。

### 选择 node_modules 模式

| 模式   | 何时使用                                     | 如何启用                                        |
| ------ | -------------------------------------------- | ----------------------------------------------- |
| none   | 大多数 Deno 项目；保持仓库干净               | 默认；无需操作                                  |
| auto   | 工具/打包器需要 node_modules；使用 Node-API  | `deno.json` 配置 `"nodeModulesDir": "auto"` 或 `--node-modules-dir=auto` |
| manual | 已有 package.json，喜欢显式安装步骤          | `deno.json` 配置 `"nodeModulesDir": "manual"` + 运行安装命令 |

:::note

我们建议您使用默认的 `none` 模式；如果您遇到关于 `node_modules` 目录中缺少包的错误，再退回到 `auto` 或 `manual` 模式。

:::

### 自动创建 node_modules

如果您需要项目中的 `node_modules` 目录，可以按命令单独使用 `--node-modules-dir=auto` 标志，或在配置文件中使用 `"nodeModulesDir": "auto"` 选项，让 Deno 在当前工作目录中创建 `node_modules` 目录：

```sh
deno run --node-modules-dir=auto main.ts
```

或

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

自动模式会将依赖项自动安装到全局缓存中，并在项目根目录创建本地 `node_modules` 目录。对于依赖 `node_modules` 目录的 npm 依赖项目，这是推荐配置：主要是使用打包器的项目，或包含带有 postinstall 脚本的 npm 依赖的项目。

### 手动创建 node_modules

当项目有 `package.json` 时，可以启用手动模式，需要执行安装步骤来创建本地 `node_modules`：

```sh
deno install
deno run --node-modules-dir=manual main.ts
```

或

```json title="deno.json"
{ "nodeModulesDir": "manual" }
```

手动模式默认适用于使用 `package.json` 的项目。适合 Next.js、Remix、Svelte、Qwik 等框架项目，或使用 Vite、Parcel、Rollup 工具的项目。

### 选择布局：isolated 与 hoisted

当存在本地 `node_modules` 目录时，Deno 可以采用两种布局方式。默认的（**isolated**）会将每个包安装到一个内容寻址的 `.deno/` 目录中，并通过符号链接将其暴露出来，因此每个包只能看到自己声明的依赖项。这与 pnpm 的布局类似。

```text
node_modules/
├── .deno/chalk@5.6.2/node_modules/chalk/   ← 真实文件
└── chalk -> .deno/chalk@5.6.2/node_modules/chalk
```

某些 npm 工具，以及任何在 `node_modules` 中查找扁平解析兄弟依赖的包，都会假定使用 npm 和 Yarn classic 所采用的 **hoisted** 布局。Deno 2.8 新增了 hoisted 模式
([denoland/deno#32788](https://github.com/denoland/deno/pull/32788))，您可以通过 `deno.json` 中的 `nodeModulesLinker` 选择启用。hoisted 链接器要求使用手动管理的 `node_modules` 目录，因此请将 `nodeModulesDir` 设置为 `manual`：

```json title="deno.json"
{
  "nodeModulesDir": "manual",
  "nodeModulesLinker": "hoisted"
}
```

或者作为一次性的 CLI 标志（同样需要 `--node-modules-dir=manual`）：

```sh
deno install --node-modules-dir=manual --node-modules-linker=hoisted
```

在 hoisted 模式下，每个包中最常被依赖的版本会被放置在 `node_modules/` 顶层，而冲突的版本则嵌套在需要它们的依赖项下方，就像 npm 一样：

```text
node_modules/
├── chalk/         ← 真实文件
├── express/
├── ms/            ← 已提升：最常需要的版本
└── debug/
    └── node_modules/
        └── ms/    ← 嵌套：另一个版本
```

除非您依赖的工具要求使用 hoisted 布局，否则请继续使用默认的 isolated 模式。isolated 模式能够捕捉到 hoisted 布局会隐藏的虚假依赖。

## 使用带有原生插件的包

以下是您可能在实际使用中遇到的一些全局对象，以及如何在 Deno 中使用它们：

- `process` - Deno 提供了 `process` 全局，这是最常用的全局对象，在流行的 npm 包中使用广泛。它对所有代码都是可用的。然而，Deno 会通过提供 lint 警告和快速修复，指导您显式从 `node:process` 模块导入它：

```js title="process.js"
console.log(process.versions.deno);
```

```shell
$ deno run process.js
2.0.0
$ deno lint process.js
error[no-process-global]: 在 Deno 中不鼓励使用 NodeJS 的 process 全局对象
 --> /process.js:1:13
  |
1 | console.log(process.versions.deno);
  |             ^^^^^^^
  = hint: 添加 `import process from "node:process";`

  docs: https://docs.deno.com/lint/rules/no-process-global


Found 1 problem (1 fixable via --fix)
Checked 1 file
```

- `require()` - 请参见 [CommonJS 支持](#commonjs支持)

- `Buffer` - 要使用 `Buffer` API，必须显式从 `node:buffer` 模块导入：

```js title="buffer.js"
import { Buffer } from "node:buffer";

const buf = new Buffer(5, "0");
```

对于需要 Node.js 特定类型如 `BufferEncoding` 的 TypeScript 用户，使用 `@types/node` 时，这些类型可以通过 `NodeJS` 命名空间获取：

```ts title="buffer-types.ts"
/// <reference types="npm:@types/node" />

// 现在您可以使用 NodeJS 命名空间类型
function writeToBuffer(data: string, encoding: NodeJS.BufferEncoding): Buffer {
  return Buffer.from(data, encoding);
}
```

更推荐使用 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 或其他 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 子类。

- `__filename` - 使用 `import.meta.filename` 替代。

- `__dirname` - 使用 `import.meta.dirname` 替代。

## Node-API 插件

Deno 支持 [Node-API 插件](https://nodejs.org/api/n-api.html)，这些插件被流行的 npm 包使用，如 [`esbuild`](https://www.npmjs.com/package/esbuild)、[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) 或 [`npm:duckdb`](https://www.npmjs.com/package/duckdb)。

您可以期望所有使用公共和文档 Node-API 的包都能正常工作。

截至 Deno 2.0，使用 Node-API addon 的 npm 包在存在本地 `node_modules/` 目录时受支持。请在 `deno.json` 中配置 `"nodeModulesDir": "auto" | "manual"`，或使用 `--node-modules-dir=auto|manual` 运行。并且，与所有原生 FFI 一样，请传递 `--allow-ffi` 以授予显式权限。请查看[安全性和权限](/runtime/reference/permissions/#ffi-(foreign-function-interface))。

**如果它不起作用：** 许多 addon 依赖 npm 生命周期脚本（例如 `postinstall`）来构建或下载它们的原生绑定，而出于安全原因，Deno 默认不会运行这些脚本。安装此类包时会向您发出警告：

```sh
$ deno install npm:duckdb
╭ Warning
│
│  Ignored build scripts for packages:
│  npm:duckdb@1.4.4
│
│  Run "deno approve-scripts" to run build scripts.
╰─
```

忽略该警告后，addon 会在运行时失败，因为安装脚本从未获取的原生绑定缺失：

```sh
$ deno run -R -E --allow-ffi main.mjs
error: Uncaught (in promise) Error: Cannot find module '/my-app/node_modules/.deno/duckdb@1.4.4/node_modules/duckdb/lib/binding/duckdb.node'
```

解决方法是允许该特定包的脚本（或者运行交互式的 `deno approve-scripts` 命令）：

```sh
$ deno install --allow-scripts=npm:duckdb
Initialize duckdb@1.4.4: running 'install' script

$ deno run -R -E --allow-ffi main.mjs
[ { answer: 42 } ]
```

[`deno install` 文档](/runtime/reference/cli/install/)完整介绍了生命周期脚本选项。

## 控制包导出条件

包导出可以基于[解析模式](https://nodejs.org/api/packages.html#conditional-exports)进行条件化。来自 Deno ESM 模块的导入所满足的条件如下：

```json
["deno", "node", "import", "module-sync", "default"]
```

这意味着，包导出中键名等于这些字符串中任意一个的第一个条件将被匹配。对于 `require()` 解析，包括 `createRequire()`，条件如下：

```json
["require", "node", "module-sync", "default"]
```

Deno 在分析通过 `require()` 重新导出的 CommonJS 模块时，也会应用 `module-sync`。

您可以使用 `--conditions` CLI 标志扩展导入条件列表：

```shell
deno run --conditions development,react-server main.ts
```

```json
[
  "development",
  "react-server",
  "deno",
  "node",
  "import",
  "module-sync",
  "default"
]
```

## 获取 Node 和 npm 类型定义

从 Deno 2.8 开始，`deno check` 和 LSP 会在每次类型检查中默认包含 `lib.node`，因此像 `Buffer`、`NodeJS.Timeout` 和 `process` 这样的 Node 全局类型无需任何配置即可解析：

```ts
// 2.8+: 无需额外设置即可进行类型检查
const buf: Buffer = Buffer.from("hello");
const t: NodeJS.Timeout = setTimeout(() => {}, 0);
```

内置的 `lib.node` 会跟踪与 Deno 在 `process.versions.node` 中报告的 Node 版本相匹配的 `@types/node` 主版本。如果您需要固定某个特定的 `@types/node` 版本（例如与项目标准化的 Node 版本保持一致），可以将其作为显式依赖项添加：

```jsonc title="deno.json"
{
  "imports": {
    "@types/node": "npm:@types/node@^22"
  }
}
```

在 2.8 之前的版本中，或者如果您选择不使用 `lib.node`，您仍然可以通过引用指令加载这些类型：

```ts
/// <reference types="npm:@types/node" />
```

同样的指令还允许您在自己的签名中使用 `NodeJS` 命名空间中的类型，例如 `BufferEncoding`：

```ts title="buffer-types.ts"
/// <reference types="npm:@types/node" />

// 现在您可以使用 NodeJS 命名空间类型
function writeToBuffer(data: string, encoding: NodeJS.BufferEncoding): Buffer {
  return Buffer.from(data, encoding);
}
```

### npm 包的类型

许多 npm 包自带类型，您可以直接导入并在类型中使用它们：

```ts
import chalk from "npm:chalk@5";
```

有些包不自带类型，但您可以使用 [`@ts-types`](/runtime/fundamentals/typescript) 指令指定它们的类型。例如，使用一个 [`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types) 包：

```ts
// @ts-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

### 当包的类型看起来不对时

官方 TypeScript 编译器 `tsc` 支持不同的 [moduleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution) 设置。Deno 仅支持现代的 `node16` 解析。不幸的是，许多 npm 包在 `node16` 模块解析下无法正确提供类型，这可能导致 `deno check` 报告类型错误，而 `tsc` 不会报告。

如果 `npm:` 导入中的默认导出看起来类型不正确（而正确的类型似乎可以在 `.default` 属性下获得），那么最有可能的情况是，该包在面向 ESM 的导入上，针对 `node16` 模块解析提供了错误的类型。您可以通过检查该错误是否也会在 `tsc --module node16` 且 `package.json` 中设置 `"type": "module"` 时出现，或者通过查看 [Are the types wrong?](https://arethetypeswrong.github.io/) 网站来验证这一点（尤其是 "node16 from ESM" 这一行）。

如果您想使用一个不支持 TypeScript 的 `node16` 模块解析的包，您可以：

1. 在该包的 issue 跟踪器上就此问题提交 issue。（也许还可以贡献一个修复 :)（不过遗憾的是，目前缺少让包同时支持 ESM 和 CJS 的工具，因为默认导出需要不同的语法。另见 [microsoft/TypeScript#54593](https://github.com/microsoft/TypeScript/issues/54593)）
2. 使用一个 [CDN](/runtime/fundamentals/modules/#url_imports)，它会为 Deno 支持重新构建这些包，而不是使用 `npm:` 标识符。
3. 使用 `// @ts-expect-error` 或 `// @ts-ignore` 忽略代码库中的类型错误。

Deno 有自己的配置文件 `deno.json` 或 `deno.jsonc`，可用于[配置您的项目](/runtime/fundamentals/configuration/)。

您可以使用它通过 `imports` 选项[定义依赖项](/runtime/fundamentals/configuration/)——您可以逐个迁移 `package.json` 中的依赖项，或者选择在配置文件中完全不定义它们，而在代码中使用 `npm:` 前缀。

除了指定依赖项，您还可以使用 `deno.json` 定义任务、lint 和格式选项、路径映射以及其他运行时配置。

**Lint 检查**

Deno 自带一个内置 linter，性能优先考虑。它与 ESlint 类似，虽然规则数量有限。如果您不依赖于 ESLint 插件，您可以从 `package.json` 的 `devDependencies` 部分删除 `eslint` 依赖，并改为使用 `deno lint`。

Deno 可以在几毫秒内 lint 大型项目。您可以通过运行以下命令在项目上尝试：

```sh
deno lint
```

这将对您项目中的所有文件进行 lint。当 linter 检测到问题时，它将在您的编辑器和终端输出中显示该行。如下所示的示例：

```sh
error[no-constant-condition]: 不允许将常量表达式用作条件。
 --> /my-project/bar.ts:1:5
  |
1 | if (true) {
  |     ^^^^
  = hint: 删除该常量表达式

  docs: https://docs.deno.com/lint/rules/no-constant-condition


Found 1 problem
Checked 4 files
```

许多 lint 问题可以通过传递 `--fix` 标志自动修复：

```sh
deno lint --fix
```

所有支持的 lint 规则的完整列表可以在 [https://docs.deno.com/lint/](https://docs.deno.com/lint/) 找到。要了解更多关于如何配置 linter 的信息，请查看 [deno lint 子命令](/runtime/reference/cli/linter/)。

**格式化**

Deno 配备了一个 [内置格式化工具](/runtime/reference/cli/formatter/)，可以选择根据 Deno 风格指南格式化您的代码。您可以取代将 `prettier` 添加到 `devDependencies`，而是使用 Deno 的内置零配置代码格式化器 `deno fmt`。

您可以通过运行以下命令在项目上运行格式化程序：

```sh
deno fmt
```

如果在 CI 中使用 `deno fmt`，也可以传递 `--check` 参数，当检测到格式不正确的代码时使格式化程序退出并显示错误。

```sh
deno fmt --check
```

格式化规则可以在您的 `deno.json` 文件中配置。要了解有关如何配置格式化程序的更多信息，请查看 [deno fmt 子命令](/runtime/reference/cli/formatter/)。

**测试**

Deno 鼓励为您的代码编写测试，并提供一个内置的测试运行器，使编写和运行测试变得容易。测试运行器与 Deno 紧密集成，因此您不需要额外的配置就能使 TypeScript 或其他功能正常工作。

```ts title="my_test.ts"
Deno.test("my test", () => {
  // 你的测试代码写在这里
});
```

```sh
deno test
```

传递 `--watch` 标志时，当导入的任何模块发生变化时，测试运行器将自动重新加载。

要了解有关测试运行器的更多信息以及如何配置它，请查看 [deno test 子命令](/runtime/reference/cli/test/) 文档。

## 私有仓库

:::caution

请勿与 [private repositories and modules](/runtime/packages/private_repositories/) 混淆。

:::

Deno 支持私有仓库，这允许您托管和共享自己的模块。这对于希望将其代码保持私密的组织或希望与特定人员分享代码的个人非常有用。

### 什么是私有仓库？

大型组织通常会托管自己的私有 npm 仓库，以安全地管理内部包。这些私有仓库作为存储库，通过它们组织可以发布和存储其专有或自定义包。与公共 npm 仓库不同，私有仓库仅对组织内的授权用户可访问。

### 如何在 Deno 中使用私有仓库

首先，配置您项目中的 [`.npmrc`](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc) 文件，以指向您的私有仓库。 `.npmrc` 文件必须位于项目根目录或 `$HOME` 目录中。在 `.npmrc` 文件中添加以下内容：

```sh
@mycompany:registry=http://mycompany.com:8111/
//mycompany.com:8111/:_authToken=secretToken
```

请将 `http://mycompany.com:8111/` 替换为您的私有 registry 的实际 URL，并将 `secretToken` 替换为您的身份验证令牌。`_authToken` 是标准的 bearer token 形式；也支持使用旧版 `_auth` 凭据的 registry（请参见下方 `.npmrc` 功能列表）。

然后，更新您的 `deno.json` 或 `package.json` 以指定您私有包的导入路径。例如：

```json title="deno.json"
{
  "imports": {
    "@mycompany/package": "npm:@mycompany/package@1.0.0"
  }
}
```

或者如果您正在使用 `package.json`：

```json title="package.json"
{
  "dependencies": {
    "@mycompany/package": "1.0.0"
  }
}
```

现在您可以在 Deno 代码中导入您的私有包：

```typescript title="main.ts"
import { hello } from "@mycompany/package";

console.log(hello());
```

并通过以下命令运行：

```sh
deno run main.ts
```

### `.npmrc` 配置

除了上面的基本 registry / token 设置之外，Deno 还会读取其他几个 `.npmrc`
字段。最可能相关的是：

- **双向 TLS 身份验证**（Deno 2.8+）：`certfile` 和 `keyfile` 指向
  用于在 registry 需要 mTLS 时对客户端进行身份验证的 PEM 文件。

  ```ini title=".npmrc"
  //registry.mycompany.com/:certfile=/etc/deno/client.crt
  //registry.mycompany.com/:keyfile=/etc/deno/client.key
  ```

- **`_auth` 条目上的 `email`**（Deno 2.8+）：某些传统的本地部署 registry
  需要在 auth token 之外再提供一个 `email`。

  ```ini title=".npmrc"
  //registry.mycompany.com/:_auth=secretToken
  //registry.mycompany.com/:email=ci@mycompany.com
  ```

- **`min-release-age`**（Deno 2.8+）：拒绝安装早于配置年龄阈值的包版本。对所有安装来说，这是一种有用的默认供应链防护。同样的控制也可以通过 CLI 标志 `--minimum-dependency-age` 以及 `deno.json` 中的 `minimumDependencyAge` 字段使用。完整说明请参见 [Minimum dependency age](/runtime/packages/supply_chain/#minimum-dependency-age)。

  ```ini title=".npmrc"
  min-release-age=3
  ```

- **`NPM_CONFIG_REGISTRY` 环境变量**：覆盖 `.npmrc` 中设置的 registry，与 npm 的优先级规则一致（在 CI 中很方便，当您想在不编辑已提交的 `.npmrc` 的情况下重定向安装时）。

### 发布包中的 `file:` 和 `link:` 依赖

某些已发布的 npm 包会意外地在其 `package.json` 中带上一个 `file:` 或 `link:` 说明符，
指向发布者机器上的某个路径：

```jsonc title="some-package/package.json"
{
  "dependencies": {
    "lodash": "^4.17.0",
    "local-helpers": "file:../local-helpers"
  }
}
```

从 Deno 2.8 开始，在解析 npm 元数据时会静默跳过这些 `file:` 和 `link:` 条目，因此带有多余本地路径依赖的包可以正常安装，而不会因 “Invalid version requirement” 错误而失败。
