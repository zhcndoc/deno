---
last_modified: 2026-06-18
title: "TypeScript 支持"
description: "TypeScript 是 Deno 中的一等语言。无需构建步骤即可直接运行 .ts 文件，使用 deno check 进行类型检查，复用你的 tsconfig.json，并跳过你在 Node.js 下所需的工具链。"
oldUrl:
  - /runtime/manual/advanced/typescript/
  - /runtime/manual/typescript/
  - /runtime/manual/typescript/overview/
  - /runtime/manual/getting_started/typescript/
  - /manual/advanced/typescript
  - /runtime/manual/advanced/typescript/overview/
  - /runtime/fundamentals/
---

TypeScript 是 Deno 中的一等语言。把 TypeScript 放进一个文件然后运行它即可。无需安装编译器，也无需构建步骤，而且配置是可选的：如果你已经有一个 `tsconfig.json`，它可以直接使用，但开始时并不需要编写它。

```ts title="main.ts"
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("world"));
```

```sh
deno run main.ts
```

Deno 还自带类型检查器：`deno check` 扮演着 `tsc --noEmit` 的角色，默认开启严格模式。通过 [Deno 语言服务器](/runtime/getting_started/setup_your_environment/)，同样的检查器也会在你的编辑器中运行，因此当你输入时类型错误就会立即显现。

## TypeScript 在 Deno 中如何运行

Deno 将执行 TypeScript 和对其进行类型检查视为两个独立的职责：

- **执行**：当你对一个 TypeScript 文件执行 `deno run` 时，Deno 会移除类型并将生成的 JavaScript 交给 V8。这个过程很快，在进程内完成，并且会被缓存，但它不会检查类型是否正确。
- **类型检查**：`deno check`（或 `deno run --check`）会在不执行代码的情况下，使用真正的 TypeScript 编译器来检查你的代码。

这意味着，**除非你要求，否则类型错误不会阻止你的代码运行**。对整个模块图进行类型检查开销很大，因此 Deno 不会把它放在高频的编辑-运行循环中，而是让你在真正有价值的地方使用它：编辑器中（通过 Deno 语言服务器）、CI 中，以及 `deno test` 中，后者默认会进行类型检查。

有一点值得注意：Deno 不会在你的源码旁边写出 JavaScript。移除类型后的输出会进入内部缓存（你可以在 `deno info` 的输出中看到其位置，标为 "Emitted modules cache"），因此没有 `outDir`、没有 `dist/` 目录，也无需管理 source map 配置。错误堆栈仍然会直接指向你的 `.ts` 源文件。如果你确实需要磁盘上的 `.js` 文件（例如，要把库交付给运行 Node 或打包器的用户），请使用单独的工具：
[`deno transpile`](/runtime/reference/cli/transpile/) 或
[`deno pack`](/runtime/reference/cli/pack/)。

## 从 Node.js 迁移而来

如果你今天为 Node.js 编写 TypeScript，那么你的大部分工具链都有内置替代方案：

| 在你的 Node.js 项目中                         | 在 Deno 中                                                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tsx`、`ts-node`，或带有类型剥离的 `node` | `deno run main.ts`                                                                                              |
| `tsc --noEmit`                                  | `deno check`                                                                                                    |
| `tsconfig.json`                                 | 可选。如果存在则会自动检测；Deno 优先的项目在 `deno.json` 中使用 `compilerOptions`                    |
| 作为 devDependency 的 `typescript`                 | 无需安装；检查器随 `deno` 二进制文件一起提供                                                  |
| `@types/node`                                   | 内置并且[可按版本覆盖](/runtime/fundamentals/node/#including-node-types)；`node:` 导入具备类型信息 |
| 带 TypeScript 插件的 ESLint + Prettier       | [`deno lint`](/runtime/reference/cli/lint/) 和 [`deno fmt`](/runtime/reference/cli/fmt/) 原生处理 `.ts` |

Node.js 开发者最常遇到的三个差异是：

**导入使用真实的文件扩展名。** 在 Deno 中你会写
`import { greet } from "./greet.ts"`，使用磁盘上文件的实际扩展名。而在 `tsc` 下，你会改为写 `./greet.js` 来导入一个名为 `greet.ts` 的文件，或者启用
[`allowImportingTsExtensions`](https://www.typescriptlang.org/tsconfig/#allowImportingTsExtensions)，而 `tsc` 只有在配合 `noEmit` 时才允许这样做。Deno 不需要这些变通方案，因为它从不输出文件。有关解析方式，包括 npm 包，请参见 [Modules](/runtime/fundamentals/modules/)。

**Deno 运行完整的 TypeScript 语言。** Node 内置的类型剥离只处理它能够擦除的语法。会生成运行时代码的特性（枚举、带有运行时值的命名空间，以及参数属性）需要 Node 的实验性 `--experimental-transform-types` 标志，而截至 Node 24 该标志仍然存在。Deno 在没有任何标志的情况下就能运行所有这些特性。

**你的大多数 `tsconfig.json` 配置的是 Deno 从不写出的输出文件。** 像 `target`、`module`、`outDir`、`esModuleInterop` 和 `sourceMap` 这样的选项会影响生成的 JavaScript，而 Deno 会把这些内容保存在内部缓存中，而不是写到磁盘上。Deno 会对这些被忽略的选项发出警告，并且配置参考中的
[迁移表](/runtime/reference/ts_config_migration/#migrating-compileroptions-from-nodejs)
会说明每一项该怎么处理。对大多数项来说，答案都是“删除它”。

如果你正在迁移整个项目，那么
[从 Node.js 迁移](/runtime/migrate/) 指南涵盖了其余部分（依赖项、
`package.json`、npm 脚本）。

## 类型检查

Deno 默认以
[严格模式](https://www.typescriptlang.org/tsconfig/#strict)进行类型检查。它
还会开启 `noImplicitOverride`，而 `tsc` 即使在 `strict` 下也默认关闭它。
[编译器选项表](/runtime/reference/ts_config_migration/#ts-compiler-options)
列出了所有默认值。

使用
[`deno check`](/runtime/reference/cli/check/) 在不运行代码的情况下检查你的代码：

```sh
# 检查整个项目
deno check

# 检查指定文件或目录
deno check main.ts
deno check src/

# 同时检查远程模块和 npm 依赖
deno check --all main.ts

# 也检查 JavaScript 文件，而无需为每个文件添加 @ts-check
deno check --check-js main.js
```

`deno check` 在出错时会以非零状态退出，因此它可以直接用于 CI。上面展示的 `--check-js`
标志在下面的
[检查 JavaScript 的类型](#type-checking-javascript) 中有说明。`deno check` 还可以检查 JSDoc 注释和 markdown 文件中的代码块；参见
[文档测试](/runtime/test/doc_tests/)。

要在执行前进行类型检查，可在 `deno run` 中添加 `--check`：

```sh
deno run --check main.ts

# 在检查中包含远程模块和 npm 包
deno run --check=all main.ts
```

使用这个标志时，类型错误会在任何代码运行前阻止进程。你可以修复错误，使用 `// @ts-expect-error` 或 `// @ts-ignore` 注释来抑制它，或者去掉这个标志。

`deno test` 和 `deno bench` 默认会进行类型检查。传入 `--no-check` 可跳过：

```sh
deno test --no-check
```

### 使用原生编译器（tsgo）更快地进行类型检查

TypeScript 的[原生编译器](https://devblogs.microsoft.com/typescript/)，
用 Go 编写，通常比 JavaScript 的 `tsc` 快约 10 倍，已在 Deno 中通过一个不稳定标志集成。与运行独立的 `tsgo` 二进制文件不同，Deno 的集成能够理解 Deno 的模块解析和类型，因此 `jsr:` 和 `npm:` 标识符以及 `Deno` 全局对象都会像平常一样解析。

可通过 `DENO_UNSTABLE_TSGO` 环境变量或 `--unstable-tsgo` 标志为单个命令启用它：

```sh
DENO_UNSTABLE_TSGO=1 deno check main.ts
deno check --unstable-tsgo main.ts
```

或者在 `deno.json` 中为整个项目开启它：

```json title="deno.json"
{
  "unstable": ["tsgo"]
}
```

:::caution

这是一个不稳定的预览功能。原生编译器目前尚未功能完备，因此某些在默认编译器下可以通过类型检查的程序可能会报告不同的结果。暂时不要在 CI 或发布构建中依赖它，并且请[报告问题](https://github.com/denoland/deno/issues)。

:::

## 配置 TypeScript 编译器选项

Deno 的默认配置是严格且现代的，因此大多数项目完全不需要配置。当你确实想更改检查器行为时，请在 `compilerOptions` 下设置这些选项，可以放在 [`deno.json`](/runtime/fundamentals/configuration/) 中，也可以放在 `tsconfig.json` 中（参见[使用现有的 tsconfig.json](#tsconfig)）。对于 Deno 优先的项目，把它们放在 `deno.json` 中意味着只需要一个配置文件，而不是两个：

```json title="deno.json"
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

[支持的选项及其默认值完整列表](/runtime/reference/ts_config_migration/#ts-compiler-options)
在配置参考中可查看。有关 JSX 设置（React、Preact 及
其相关生态），请参见 [JSX 参考](/runtime/reference/jsx/)。

### 使用现有的 tsconfig.json {#tsconfig}

你不必为了尝试 Deno 而转换你的配置。包含 `deno.json` 或 `package.json` 的每个工作区目录都会被探测是否存在
`tsconfig.json`；如果存在，Deno 会自动将其用于类型检查和语言服务器，无需任何标志。自 Deno 2.1 起，当存在 `package.json` 时，也会自动检测 `jsconfig.json`，这对仅使用 JavaScript 的项目很有用。

例如，现有的 Node.js 项目中包含如下 `tsconfig.json`：

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "lib": ["dom", "esnext"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

会被 `deno check` 和 Deno 语言服务器自动采用。如果之后添加了一个带有自己 `compilerOptions` 的 `deno.json`，则以后者为准。与输出相关的选项会被忽略（并伴随警告），因为 Deno 不会写出输出文件。

对于 Deno 优先的项目，建议在 `deno.json` 中使用 `compilerOptions`，而不是单独的 `tsconfig.json`。有关支持的字段、优先级规则和项目引用行为，请参见
[配置 TypeScript](/runtime/reference/ts_config_migration/)。

## JavaScript 的类型检查

Deno 并行运行 JavaScript 和 TypeScript，但默认只会对
TypeScript 文件进行类型检查。将 JavaScript 文件纳入类型检查有三种方式：
在文件顶部添加 `// @ts-check` 语法指令，为整个项目启用
`compilerOptions.checkJs`，或者在命令行中传入 `--check-js`
（`deno check --check-js main.js`），即可在不修改任何配置的情况下进行一次性检查。

当文件进入检查范围后，类型检查器会标记出与 TypeScript 中相同的错误：

```js title="main.js"
// @ts-check

let x = "hello";
x = 42; // 类型 'number' 不能赋值给类型 'string'。
```

该语法指令只检查单个文件；`checkJs` 会在整个项目范围内启用它：

```json title="deno.json"
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

JavaScript 文件不能包含诸如类型注解之类的 TypeScript 语法，但你可以在
[JSDoc 注释](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)中提供同样的信息，
类型检查器会读取这些内容：

```js title="main.js"
// @ts-check

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

## 提供声明文件

当从 TypeScript 中导入一个未类型化的 JavaScript 模块时，类型检查器会假定
它导出的所有内容都是 `any`。要修复这一点，请提供一个 `.d.ts` 声明文件
（除非该 JavaScript 已经用 JSDoc 做了注解）。

与 `tsc` 的一个重要区别是：`tsc` 会自动识别与 `.js` 文件同名且位于其旁边的 `.d.ts` 文件。
**Deno 不会。** 你必须明确声明文件的位置，可以放在 JavaScript 源码中，也可以放在导入处。

### 在源码中提供类型

建议直接在 `.js` 文件中使用 `@ts-self-types` 声明类型，这样每个导入者都能免费获得这些类型：

```js title="add.js"
// @ts-self-types="./add.d.ts"

export function add(a, b) {
  return a + b;
}
```

```ts title="add.d.ts"
export function add(a: number, b: number): number;
```

### 在导入者中提供类型

如果你无法修改 JavaScript 源码，可以用 `@ts-types` 为导入添加注解：

```ts title="main.ts"
// @ts-types="./add.d.ts"
import { add } from "./add.js";
```

这也适用于没有附带类型信息的 npm 包，只需指向对应的 `@types` 包：

```ts title="main.ts"
// @ts-types="npm:@types/lodash"
import * as _ from "npm:lodash";
```

### 将类型应用到每个导入

`@ts-types` 只会为单个导入添加注解，因此如果某个包在整个项目中都会用到，
在每个导入处重复添加会很繁琐。相反，可以把 `@types` 包作为依赖添加。
当类型位于本地 `node_modules` 目录中时，Deno 会像 `tsc` 一样在每次导入该包时自动识别它们，
无需任何注解：

```sh
deno add lodash @types/lodash
```

```ts title="main.ts"
import { capitalize } from "lodash"; // 完全类型化，无需 @ts-types
```

这依赖于本地 `node_modules` 目录；当项目包含 `package.json` 时，Deno 会创建该目录，
或者你也可以在 `deno.json` 中启用它：

```jsonc title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

如果没有本地 `node_modules`（Deno 的默认全局缓存模式），这种自动解析就不会生效；
请改用上面展示的按导入添加 `@ts-types` 注解的方式。

### 为动态导入添加类型

`@ts-types` 指令只适用于静态 `import` 语句，不适用于动态 `import()`。
如果要为一个没有声明文件的模块的动态导入添加类型，请使用指向对应 `@types`
包的类型断言：

```ts title="main.ts"
const { markedTerminal } = await import(
  "npm:marked-terminal@7"
) as typeof import("npm:@types/marked-terminal@6");
```

### 为 HTTP 模块提供类型

托管 JavaScript 模块的服务器可以在 `X-TypeScript-Types` 响应头中声明一个类型文件，
Deno 会相对于模块 URL 解析它（类似 `Location` 头），并在类型检查期间使用它。
像 [esm.sh](https://esm.sh) 这样的 CDN 会为你设置这个响应头。

## 面向浏览器和 Web Worker

默认情况下，Deno 会针对 Deno 运行时的全局作用域进行类型检查（`deno.window` 库）：
[`Deno.readFile`](/api/deno/~/Deno.readFile) 存在，而 `document` 不存在。
面向其他环境的代码可以通过 `compilerOptions.lib` 切换类型库。最常见的情况是
在 Deno 和浏览器之间共享的代码：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

这会添加诸如 `document` 之类的浏览器全局对象，同时仍通过 `deno.ns`
保留 `Deno` 命名空间。对于运行在 `new Worker` 中的代码，请使用
`lib: ["deno.worker"]`（或者使用 `/// <reference lib="deno.worker" />` 指令）。
[lib 属性参考](/runtime/reference/ts_config_migration/#using-the-lib-property)
描述了可用的库、可能遇到的冲突，以及针对 worker 的专门设置。

## 扩展全局类型

在为全局 API 提供 polyfill 时，你可以使用 `declare global` 让类型检查器了解它。
请注意，Deno 2 没有 `window` 对象；全局变量位于 `globalThis` 上，因此应使用 `var` 声明它们：

```ts
declare global {
  var polyfilledAPI: () => string;
}
```

导入此声明后，`globalThis.polyfilledAPI` 就能通过类型检查。

或者，也可以把扩展内容放在 `.d.ts` 文件中，并通过三斜线指令（`/// <reference types="./global.d.ts" />`）加载，
或者在 `deno.json` 中全局加载：

```json title="deno.json"
{
  "compilerOptions": {
    "types": ["./global.d.ts"]
  }
}
```

如果普通导入就能解决问题，就避免使用全局扩展：全局变量可能导致命名冲突，使代码更难推理，而且在发布到
[JSR](https://jsr.io) 时也不受支持。

## 下一步

- 使用 Deno 语言服务器为你的编辑器设置内联类型检查。参见
  [设置你的环境](/runtime/getting_started/setup_your_environment/)。
- 阅读
  [TypeScript 配置参考](/runtime/reference/ts_config_migration/)，了解完整的编译器选项表和 `tsconfig.json` 语义。
- 使用
  [文档测试](/runtime/test/doc_tests/)对文档中的示例进行类型检查。
- 要迁移现有项目吗？从
  [从 Node.js 迁移](/runtime/migrate/)开始。
