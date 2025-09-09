---
title: "Node 和 npm 兼容性"
description: "关于在 Deno 中使用 Node.js 模块和 npm 包的指南。了解兼容性功能、导入 npm 包以及 Node.js 和 Deno 环境之间的差异。"
oldUrl:
  - /runtime/reference/node/
  - /runtime/manual/npm_nodejs/std_node/
  - /runtime/manual/node/
  - /runtime/manual/npm_nodejs/cdns/
  - /runtime/manual/using_deno_with_other_technologies/node/cdns/
  - /runtime/manual/node/node_specifiers
  - /runtime/manual/node/package_json
  - /runtime/manual/node/migrate/
  - /runtime/manual/references/cheatsheet/
  - /runtime/manual/node/cheatsheet/
  - /runtime/manual/node/faqs
  - /runtime/manual/node/npm_specifiers
  - /runtime/manual/node/private_registries
---

- **Deno 兼容 Node**。大多数 Node 项目可以在 Deno 中运行，几乎不需要更改！

- **Deno 支持 npm 包**。只需在导入时使用 `npm:` 说明符，Deno 会处理其余部分。

例如，在 Deno 项目中，您可以这样从 npm 导入 Hono：

```ts
import { Hono } from "npm:hono";
```

这就是你开始所需了解的全部！但是，在这两个运行时之间有一些关键差异，你可以利用这些差异在将你的 Node.js 项目迁移到 Deno 时使代码更简单、更小。

## 使用 Node 的内置模块

Deno 提供了一个兼容层，允许在 Deno 程序中使用 Node.js 的内置 API。要使用它们，您需要在任何使用这些 API 的导入语句中添加 `node:` 前缀：

```js title=main.mjs
import * as os from "node:os";
console.log(os.cpus());
```

然后通过 `deno run main.mjs` 运行，您会注意到它与在 Node.js 中运行程序时输出相同。

更新您应用程序中的任何导入以使用 `node:` 前缀，应该能使任何使用 Node 内置 API 的代码照常工作。

为了方便更新现有代码，Deno 会为未使用 `node:` 前缀的导入提供有用的提示：

```js title="main.mjs"
import * as os from "os";
console.log(os.cpus());
```

```sh
$ deno run main.mjs
error: Relative import path "os" not prefixed with / or ./ or ../
  hint: If you want to use a built-in Node module, add a "node:" prefix (ex. "node:os").
    at file:///main.mjs:1:21
```

相同的提示和其他快速修复也由 Deno LSP 在您的编辑器中提供。

<a href="/api/node/" class="docs-cta runtime-cta">探索内置的 Node API</a>

## 使用 npm 包

Deno 原生支持通过使用 `npm:` 前缀导入 npm 包。例如：

```ts title="main.js"
import * as emoji from "npm:node-emoji";

console.log(emoji.emojify(`:sauropod: :heart:  npm`));
```

可以通过以下命令运行：

```sh
$ deno run main.js
🦕 ❤️ npm
```

在执行 `deno run` 命令之前，不需要 `npm install`，也无需创建 `node_modules` 文件夹。这些包同样受到与 Deno 中其他代码相同的[权限](/runtime/fundamentals/security/)约束。

npm 前缀的格式如下：

```console
npm:<package-name>[@<version-requirement>][/<sub-path>]
```

这也允许一些可能与 `npx` 命令相似的功能。

```console
# npx allows remote execution of a package from npm or a URL
$ npx create-next-app@latest

# deno run allows remote execution of a package from various locations,
# and can scoped to npm via the `npm:` specifier.
$ deno run -A npm:create-next-app@latest
```

有关流行库的示例，请参考 [教程部分](/runtime/tutorials)。

## CommonJS 支持

CommonJS 是一种在[ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)之前就存在的模块系统。尽管我们坚定地相信 ES 模块是 JavaScript 的未来，但依然存在数以百万计的使用 CommonJS 编写的 npm 库，而 Deno 提供了对它们的全面支持。Deno 将自动确定一个包是否使用 CommonJS，并在导入时无缝工作：

```js title="main.js"
import react from "npm:react";
console.log(react);
```

```shell
$ deno run -E main.js
18.3.1
```

_`npm:react` 是一个 CommonJS 包。Deno 允许您像导入 ES 模块一样导入它。_

Deno 强烈建议在您的代码中使用 ES 模块，但也支持 CommonJS，具有以下限制：

**在使用 CommonJS 模块时 Deno 的权限系统仍然有效。** 可能需要提供至少 `--allow-read` 权限，因为 Deno 将探测文件系统中的 `package.json` 文件和 `node_modules` 目录，以正确解析 CommonJS 模块。

### 使用 .cjs 扩展名

如果文件扩展名为 `.cjs`，Deno 将把该模块视为 CommonJS。

```js title="main.cjs"
const express = require("express");
```

Deno 不会查看 `package.json` 文件和 `type` 选项来判断文件是 CommonJS 还是 ESM。

在使用 CommonJS 时，Deno 期望依赖项将手动安装，并且将存在一个 `node_modules` 目录。最好在您的 `deno.json` 中设置 `"nodeModulesDir": "auto"` 以确保这一点。

```shell
$ cat deno.json
{
  "nodeModulesDir": "auto"
}

$ deno install npm:express
Add npm:express@5.0.0

$ deno run -R -E main.cjs
[Function: createApplication] {
  application: {
    init: [Function: init],
    defaultConfiguration: [Function: defaultConfiguration],
    ...
  }
}
```

`-R` 和 `-E` 标志用于允许权限读取文件和环境变量。

### package.json type 选项

如果存在与该文件相邻的 `package.json` 文件，并且具有选项 `"type": "commonjs"`，Deno 将尝试将 `.js`、`.jsx`、`.ts` 和 `.tsx` 文件作为 CommonJS 加载。

```json title="package.json"
{
  "type": "commonjs"
}
```

```js title="main.js"
const express = require("express");
```

像 Next.js 的打包工具等工具将自动生成这样的 `package.json` 文件。

如果您有一个已存在的使用 CommonJS 模块的项目，可以通过向 `package.json` 文件添加 `"type": "commonjs"` 选项，使其与 Node.js 和 Deno 一起工作。

### 始终检测文件是否可能是 CommonJS

通过在 Deno >= 2.1.2 中使用 `--unstable-detect-cjs` 运行，您可以告诉 Deno 分析模块是否可能是 CommonJS。除非存在一个带有 `{ "type": "module" }` 的 _package.json_ 文件，否则该设置将生效。

在文件系统中查找 package.json 文件并分析模块以检测它是否是 CommonJS 会比不这样做耗时。因此，为了避免使用 CommonJS，Deno 默认不执行此行为。

### 手动创建 require()

替代的方法是手动创建 `require()` 函数的实例：

```js title="main.js"
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const express = require("express");
```

在这种情况下，将适用与运行 `.cjs` 文件时相同的要求——需要手动安装依赖项并授予适当的权限标志。

### require(ESM)

Deno 的 `require()` 实现支持要求 ES 模块。

这与 Node.js 中的工作方式相同，您只能 `require()` 其模块图中没有顶级 await 的 ES 模块——或者换句话说，您只能 `require()` “同步”的 ES 模块。

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

### 导入 CommonJS 模块

您还可以在 ES 模块中导入 CommonJS 文件。

```js title="greet.cjs"
module.exports = {
  hello: "world",
};
```

```js title="main.js"
import greet from "./greet.js";
console.log(greet);
```

```shell
$ deno run main.js
{
  "hello": "world"
}
```

**提示和建议**

Deno 会提供有用的提示和建议，指导您在处理 CommonJS 模块时如何编写有效代码。

例如，如果您尝试运行没有 `.cjs` 扩展名的 CommonJS 模块，或没有带有 `{ "type": "commonjs" }` 的 `package.json`，您可能会看到：

```js title="main.js"
module.exports = {
  hello: "world",
};
```

```shell
$ deno run main.js
error: Uncaught (in promise) ReferenceError: module is not defined
module.exports = {
^
    at file:///main.js:1:1

    info: Deno supports CommonJS modules in .cjs files, or when the closest
          package.json has a "type": "commonjs" option.
    hint: Rewrite this module to ESM,
          or change the file extension to .cjs,
          or add package.json next to the file with "type": "commonjs" option,
          or pass --unstable-detect-cjs flag to detect CommonJS when loading.
    docs: https://docs.deno.com/go/commonjs
```

## 条件导出（Conditional exports）

包的导出可以根据[解析模式进行条件判断](https://nodejs.org/api/packages.html#conditional-exports)。从 Deno ESM 模块导入满足的条件如下：

```json
["deno", "node", "import", "default"]
```

这意味着在包导出中键等于这些字符串中的任意一个时，将匹配第一个出现的条件。您可以使用 `--unstable-node-conditions` CLI 标志扩展此列表：

```shell
deno run --unstable-node-conditions development,react-server main.ts
```

```json
["development", "react-server", "deno", "node", "import", "default"]
```

## 导入类型

许多 npm 包带有类型，您可以导入这些类型并直接使用：

```ts
import chalk from "npm:chalk@5";
```

一些包不随附类型，但您可以使用 [`@ts-types`](/runtime/fundamentals/typescript) 指令指定它们的类型。例如，使用 [`@types`](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#definitelytyped--types) 包：

```ts
// @ts-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
```

**模块解析**

官方 TypeScript 编译器 `tsc` 支持不同的 [moduleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution) 设置。Deno 仅支持现代的 `node16` 解析。不幸的是，许多 npm 包在 node16 模块解析下未能正确提供类型，可能会导致 `deno check` 报告类型错误，而 `tsc` 不报告这些错误。

如果 `npm:` 导入的默认导出似乎具有错误类型（正确的类型似乎在 `.default` 属性下），很可能是该包在从 ESM 的 node16 模块解析下提供了错误的类型。您可以通过检查是否在 `tsc --module node16` 和 `package.json` 中 `"type": "module"` 时也发生错误来验证，或通过访问 [类型错误吗？](https://arethetypeswrong.github.io/) 网站（特别是在 “从 ESM 的 node16” 行）。

如果您想使用不支持 TypeScript node16 模块解析的包，您可以：

1. 在该包的问题跟踪器上打开一个问题报告。（或许可以贡献一个修复 :)）不幸的是，由于包需要支持 ESM 和 CJS 缺乏工具，默认导出需要不同的语法。参见 [microsoft/TypeScript#54593](https://github.com/microsoft/TypeScript/issues/54593)
2. 使用一个 [CDN](/runtime/fundamentals/modules/#url_imports)，该 CDN 为 Deno 支持重建包，而不是使用 `npm:` 标识。
3. 使用 `// @ts-expect-error` 或 `// @ts-ignore` 忽略您代码库中出现的类型错误。

## 包含 Node 类型

Node 附带许多内置类型，如 `Buffer`，这些类型可能在 npm 包的类型中引用。要加载这些类型，您必须向 `@types/node` 包添加类型引用指令：

```ts
/// <reference types="npm:@types/node" />
```

注意，在大多数情况下，不指定版本通常是可以的，因为 Deno 将尝试与其内部的 Node 代码保持同步，但如果必要，您可以始终覆盖使用的版本。

## 可执行的 npm 脚本

具有 `bin` 条目的 npm 包可通过以下格式的标识从命令行执行，而无需进行 `npm install`：

```console
npm:<package-name>[@<version-requirement>][/<binary-name>]
```

例如：

```sh
$ deno run --allow-read npm:cowsay@1.5.0 "Hello there!"
 ______________
< Hello there! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||

$ deno run --allow-read npm:cowsay@1.5.0/cowthink "What to eat?"
 ______________
( What to eat? )
 --------------
        o   ^__^
         o  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## node_modules

当您运行 `npm install` 时，npm 会在您的项目中创建一个 `node_modules` 目录，其中存放 `package.json` 文件中指定的依赖项。

Deno 使用 [npm 指定符](/runtime/fundamentals/node/#using-npm-packages) 将 npm 包解析到中心的全局 npm 缓存，而不是在您的项目中使用 `node_modules` 文件夹。这是理想的，因为它占用更少的空间，并保持您的项目目录整洁。

然而，可能会有一些情况下，即使您没有 `package.json`，也需要在 Deno 项目中有一个本地的 `node_modules` 目录（例如，当使用像 Next.js 或 Svelte 这样的框架或依赖于使用 Node-API 的 npm 包时）。

#### 默认 Deno 依赖行为

默认情况下，当您使用 `deno run` 命令时，Deno 不会创建 `node_modules` 目录，依赖项将安装到全局缓存中。这是针对新的 Deno 项目推荐的设置。

#### 自动创建 node_modules

如果您需要在项目中创建 `node_modules` 目录，您可以使用 `--node-modules-dir` 标志或在配置文件中使用 `nodeModulesDir: auto` 选项，告诉 Deno 在当前工作目录中创建一个 `node_modules` 目录：

```sh
deno run --node-modules-dir=auto main.ts
```

或通过配置文件：

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

自动模式会自动将依赖项安装到全局缓存，并在项目根目录创建一个本地的 node_modules 目录。对于依赖于 node_modules 目录的 npm 依赖的项目（大多数使用打包器或有 npm 依赖的 postinstall 脚本的项目），这被推荐。

#### 手动创建 node_modules

如果您的项目中有 `package.json` 文件，您可以使用手动模式，该模式需要一个安装步骤来创建您的 `node_modules` 目录：

```sh
deno install
deno run --node-modules-dir=manual main.ts
```

或通过配置文件：

```json title="deno.json"
{ "nodeModulesDir": "manual" }
```

然后您可以运行 `deno install/npm install/pnpm install` 或其他任何包管理器来创建 `node_modules` 目录。

手动模式是使用 `package.json` 的项目的默认模式。您可能会从 Node.js 项目中识别出这种工作流。它对于使用像 Next.js、Remix、Svelte、Qwik 等框架的项目，或使用 Vite、Parcel 或 Rollup 等工具的项目推荐。

:::note

我们建议您使用默认的 `none` 模式，如果在 `node_modules` 目录中获取缺少包的错误，则回退到 `auto` 或 `manual` 模式。

:::

#### Deno 1.X 的 node_modules

使用 `--node-modules-dir` 标志。

例如，给定 `main.ts`：

```ts
import chalk from "npm:chalk@5";

console.log(chalk.green("Hello"));
```

```sh
deno run --node-modules-dir main.ts
```

运行上述命令时，加上 `--node-modules-dir` 标志，将在当前目录创建一个 `node_modules` 文件夹，具有类似 npm 的文件夹结构。

## Node.js 全局对象

在 Node.js 中，有一些 [全局对象](https://nodejs.org/api/globals.html) 可用于所有程序的范围，这些对象特定于 Node.js，例如 `process` 对象。

以下是您可能在实际使用中遇到的一些全局对象以及如何在 Deno 中使用它们：

- `process` - Deno 提供了 `process` 全局，这是最常用的全局对象，在流行的 npm 包中使用广泛。它对所有代码都是可用的。然而，Deno 会通过提供 lint 警告和快速修复指导您显式从 `node:process` 模块导入它：

```js title="process.js"
console.log(process.versions.deno);
```

```shell
$ deno run process.js
2.0.0
$ deno lint process.js
error[no-process-global]: NodeJS process global is discouraged in Deno
 --> /process.js:1:13
  |
1 | console.log(process.versions.deno);
  |             ^^^^^^^
  = hint: Add `import process from "node:process";`

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

// Now you can use NodeJS namespace types
function writeToBuffer(data: string, encoding: NodeJS.BufferEncoding): Buffer {
  return Buffer.from(data, encoding);
}
```

更倾向于使用 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 或其他 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 子类。

- `__filename` - 使用 `import.meta.filename` 替代。

- `__dirname` - 使用 `import.meta.dirname` 替代。

## Node-API 插件

Deno 支持 [Node-API 插件](https://nodejs.org/api/n-api.html)，这些插件被流行的 npm 包使用，如 [`esbuild`](https://www.npmjs.com/package/esbuild)、[`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) 或 [`npm:duckdb`](https://www.npmjs.com/package/duckdb)。

您可以期望所有使用公共和文档 Node-API 的包都能正常工作。

:::info

大多数使用 Node-API 插件的包依赖于 npm “生命周期脚本”，如 `postinstall`。

虽然 Deno 支持它们，但出于安全考虑，默认情况下不执行这些脚本。请阅读 [`deno install` 文档](/runtime/reference/cli/install/) 了解更多信息。

:::

自 Deno 2.0 以来，使用 Node-API 插件的 npm 包 **仅在存在 `node_modules/` 目录时支持**。添加 `"nodeModulesDir": "auto"` 或 `"nodeModulesDir": "manual"` 设置到您的 `deno.json` 文件，或者使用 `--node-modules-dir=auto|manual` 标志运行，以确保这些包正常工作。在配置错误的情况下，Deno 会提供提示以说明如何解决此情况。

## 从 Node 迁移到 Deno

在 Deno 中运行您的 Node.js 项目是一个简单的过程。在大多数情况下，您可以期望几乎不需要更改，如果您的项目使用 ES 模块编写。

需要注意的主要几点包括：

1. 导入 Node.js 内置模块需要 `node:` 前缀：

```js
// ❌
import * as fs from "fs";
import * as http from "http";

// ✅
import * as fs from "node:fs";
import * as http from "node:http";
```

:::tip

建议无论如何在您现有项目中更改这些导入前缀。这也是在 Node.js 中导入它们的推荐方式。

:::

2. 一些 [在 Node.js 中可用的全局对象](#nodejs-global-objects) 需要显式导入，例如 `Buffer`：

```js
import { Buffer } from "node:buffer";
```

3. `require()` 仅在扩展名为 `.cjs` 的文件中可用，在其他文件中必须手动创建 `require()` 实例 [需要创建](#nodejs-global-objects)。 npm 依赖可以在不考虑文件扩展名的情况下使用 `require()`。

### 运行脚本

Deno 原生支持运行 npm 脚本，通过 [`deno task`](/runtime/reference/cli/task_runner/) 子命令（如果您从 Node.js 迁移，这类似于 `npm run script` 命令）。考虑以下有一个名为 `start` 的脚本的 Node.js 项目，它在其 `package.json` 内：

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "start": "eslint"
  }
}
```

您可以通过运行以下命令在 Deno 中执行此脚本：

```sh
deno task start
```

### 可选改进

Deno 的核心优势之一是统一的工具链，开箱即用地支持 TypeScript，和包括 linter、格式化程序以及测试运行器等工具。切换到 Deno 使您能够简化工具链，减少项目中动移动的部件数量。

**配置**

Deno 有自己的配置文件 `deno.json` 或 `deno.jsonc`，可用于[配置您的项目](/runtime/fundamentals/configuration/)。

您可以使用它来使用 `imports` 选项[定义依赖项](/runtime/fundamentals/configuration/) - 您可以逐个迁移 `package.json` 中的依赖项，或者选择在配置文件中完全不定义它们，而在代码中使用 `npm:` 前缀。

除了指定依赖项，您还可以使用 `deno.json` 定义任务、lint 和格式选项、路径映射以及其他运行时配置。

**Linting**

Deno 自带一个内置 linter，性能优先考虑。它与 ESlint 相似，虽然规则数量有限。如果您不依赖于 ESLint 插件，您可以从 `package.json` 的 `devDependencies` 部分删除 `eslint` 依赖，并改为使用 `deno lint`。

Deno 可以在几毫秒内 lint 大型项目。您可以通过运行以下命令在项目上尝试：

```sh
deno lint
```

这将对您项目中的所有文件进行 lint。 当 linter 检测到问题时，它将在您的编辑器和终端输出中显示该行。如下所示的示例：

```sh
error[no-constant-condition]: Use of a constant expressions as conditions is not allowed.
 --> /my-project/bar.ts:1:5
  |
1 | if (true) {
  |     ^^^^
  = hint: Remove the constant expression

  docs: https://docs.deno.com/lint/rules/no-constant-condition


Found 1 problem
Checked 4 files
```

许多 lint 问题可以通过传递 `--fix` 标志自动修复：

```sh
deno lint --fix
```

所有支持的 linting 规则的完整列表可以在 [https://docs.deno.com/lint/](https://docs.deno.com/lint/) 找到。要了解更多关于如何配置 linter 的信息，请查看 [deno lint 子命令](/runtime/reference/cli/linter/)。

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
  // Your test code here
});
```

```sh
deno test
```

传递 `--watch` 标志时，当导入的任何模块发生变化时，测试运行器将自动重新加载。

要了解有关测试运行器的更多信息以及如何配置它，请查看 [deno test 子命令](/runtime/reference/cli/test/) 文档。

## 私有仓库

:::caution

不要与 [私有仓库和模块](/runtime/fundamentals/modules/#private-repositories) 混淆。

:::

Deno 支持私有仓库，这允许您托管和共享自己的模块。这对于希望将其代码保持私密的组织或希望与特定人员分享代码的个人非常有用。

### 什么是私有仓库？

大型组织通常会托管自己的私有 npm 仓库，以安全地管理内部包。这些私有仓库作为存储库，通过它们组织可以发布和存储其专有或自定义包。与公共 npm 仓库不同，私有仓库仅对组织内的授权用户可访问。

### 如何在 Deno 中使用私有仓库

首先，配置您项目中的 [`.npmrc`](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc) 文件，以指向您的私有仓库。 `.npmrc` 文件必须位于项目根目录或 `$HOME` 目录中。在 `.npmrc` 文件中添加以下内容：

```sh
@mycompany:registry=http://mycompany.com:8111/
//mycompany.com:8111/:_auth=secretToken
```

将 `http://mycompany.com:8111/` 替换为您的私有仓库的实际 URL，并将 `secretToken` 替换为您的身份验证令牌。

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

## 从 Node 到 Deno 速查表

| Node.js                                | Deno                          |
| -------------------------------------- | ----------------------------- |
| `node file.js`                         | `deno file.js`                |
| `ts-node file.ts`                      | `deno file.ts`                |
| `nodemon`                              | `deno run --watch`            |
| `node -e`                              | `deno eval`                   |
| `npm i` / `npm install`                | `deno install`                |
| `npm install -g`                       | `deno install -g`             |
| `npm run`                              | `deno task`                   |
| `eslint`                               | `deno lint`                   |
| `prettier`                             | `deno fmt`                    |
| `package.json`                         | `deno.json` 或 `package.json` |
| `tsc`                                  | `deno check` ¹                |
| `typedoc`                              | `deno doc`                    |
| `jest` / `ava` / `mocha` / `tap` / 等 | `deno test`                   |
| `nexe` / `pkg`                         | `deno compile`                |
| `npm explain`                          | `deno info`                   |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                |
| `tsserver`                             | `deno lsp`                    |
| `nyc` / `c8` / `istanbul`              | `deno coverage`               |
| benchmarks                             | `deno bench`                  |

¹ 类型检查是自动进行的，TypeScript 编译器已内置在 `deno` 二进制文件中。