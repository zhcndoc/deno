---
last_modified: 2025-10-27
title: "TypeScript 支持"
description: "了解如何在 Deno 中使用 TypeScript。涵盖配置选项、类型检查以及编写类型安全的 Deno 应用的最佳实践。"
oldUrl:
  - /runtime/manual/advanced/typescript/
  - /runtime/manual/typescript/
  - /runtime/manual/typescript/overview/
  - /runtime/manual/getting_started/typescript/
  - /manual/advanced/typescript
  - /runtime/manual/advanced/typescript/overview/
  - /runtime/fundamentals/
---

TypeScript 是 Deno 中的一种一流语言，就像 JavaScript 或 WebAssembly 一样。您只需安装 Deno CLI，就可以运行或导入 TypeScript，而无需安装其他任何东西。凭借其内置的 TypeScript 编译器，Deno 将直接把您的 TypeScript 代码编译为 JavaScript，无需额外配置。Deno 还可以对您的 TypeScript 代码进行类型检查，无需像 `tsc` 这样的单独类型检查工具。

## 类型检查

TypeScript 的主要优势之一是它可以使您的代码类型安全，捕获开发过程中而非运行时的错误。TypeScript 是 JavaScript 的超集，这意味着语法上有效的 JavaScript 会变成 TypeScript，并发出“安全性”警告。

:::note

**Deno 默认在 `strict mode` 下对 TypeScript 进行类型检查**，TypeScript 核心团队
[建议将严格模式作为合理的默认值](https://www.typescriptlang.org/play/?#example/new-compiler-defaults)。

:::

Deno 允许您使用 [`deno check`](/runtime/reference/cli/check/) 子命令对代码进行类型检查（而不执行它）：

```shell
# 检查当前目录/模块
deno check

# 检查特定的 TypeScript 文件
deno check module.ts

# 在检查中包含远程模块和 npm 包
deno check --all module.ts

# 检查 JSDoc 注释中的代码片段
deno check --doc module.ts

# 检查 markdown 文件中的代码片段
deno check --doc-only markdown.md
```

:::note

类型检查可能会花费大量时间，尤其是在您对代码库进行大量更改时。Deno 优化了类型检查，但这仍然是有成本的。因此，**默认情况下，TypeScript 模块在执行之前不会进行类型检查**。

:::

在使用 `deno run` 命令时，Deno 将跳过类型检查并直接运行代码。如果您希望在执行代码之前对模块进行类型检查，可以使用 `--check` 标志与 `deno run` 一起使用：

```shell
deno run --check module.ts
# 也可以对远程模块和 npm 包进行类型检查
deno run --check=all module.ts
```

当 Deno 在使用此标志时遇到类型错误时，过程将在执行代码之前退出。

为了避免这种情况，您需要：

- 解决问题
- 使用 `// @ts-ignore` 或 `// @ts-expect-error` 指令来忽略错误
- 或者完全跳过类型检查

在测试您的代码时，类型检查默认是启用的。如果您希望跳过类型检查，可以使用 `--no-check` 标志：

```shell
deno test --no-check
```

## 与 JavaScript 一起使用

Deno 运行 JavaScript 和 TypeScript 代码。不过，在类型检查期间，Deno 默认只会检查 TypeScript 文件的类型。如果您也想检查 JavaScript 文件的类型，可以在文件顶部添加 `// @ts-check` 预置指令，或者在您的
[`deno.json`](/runtime/fundamentals/configuration/) 文件中添加 `compilerOptions.checkJs`。

```ts title="main.js"
// @ts-check

let x = "hello";
x = 42; // 类型 'number' 不能赋值给类型 'string'。
```

```json title="deno.json"
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

在 JavaScript 文件中，您不能使用 TypeScript 语法，例如类型注解或导入类型。不过，您可以使用 [TSDoc](https://tsdoc.org/) 注释向 TypeScript 编译器提供类型信息。

```ts title="main.js"
// @ts-check

/**
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

## 提供声明文件

在从 TypeScript 代码导入未标注类型的 JavaScript 模块时，您可能需要为 JavaScript 模块提供类型信息。如果 JavaScript 使用 TSDoc 注释进行了注解，则不需要此操作。如果没有此额外的类型信息（以 `.d.ts` 声明文件的形式），TypeScript 将假定从 JavaScript 模块导出的所有内容都是 `any` 类型。

`tsc` 会自动识别与 `js` 文件同级且具有相同基本名称的 `d.ts` 文件。**Deno 并不这样做。**您必须在 `.js` 文件（源文件）或 `.ts` 文件（导入者）中显式指定 `.d.ts` 文件的位置。

### 在源文件中提供类型

在 `.js` 文件中指定 `.d.ts` 文件应该是首选，因为这样使得从多个 TypeScript 模块使用 JavaScript 模块变得更容易：您无需在每个导入 JavaScript 模块的 TypeScript 模块中指定 `.d.ts` 文件。

```ts title="add.js"
// @ts-self-types="./add.d.ts"

export function add(a, b) {
  return a + b;
}
```

```ts title="add.d.ts"
export function add(a: number, b: number): number;
```

### 在导入者中提供类型

如果您无法修改 JavaScript 源代码，可以在导入 JavaScript 模块的 TypeScript 模块中指定 `.d.ts` 文件。

```ts title="main.ts"
// @ts-types="./add.d.ts"
import { add } from "./add.js";
```

这对于不提供类型信息的 NPM 包也很有用：

```ts title="main.ts"
// @ts-types="npm:@types/lodash"
import * as _ from "npm:lodash";
```

### 为 HTTP 模块提供类型

通过 HTTP 托管 JavaScript 模块的服务器也可以在 HTTP 头中提供这些模块的类型信息。Deno 将在对模块进行类型检查时使用此信息。

```http
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./add.d.ts
```

`X-TypeScript-Types` 头指定提供 JavaScript 模块类型信息的 `.d.ts` 文件的位置。它是相对于 JavaScript 模块的 URL 进行解析的，类似于 `Location` 头。

## 浏览器和 web worker 的类型检查

默认情况下，Deno 对 TypeScript 模块进行类型检查，就好像它们在 Deno 运行时的主线程中运行一样。然而，Deno 还支持浏览器的类型检查、web worker 的类型检查，以及在使用 SSR（服务器端渲染）与 Deno 时结合的浏览器-Deno 环境的类型检查。

这些环境具有不同的全局对象和可用的 API。Deno 提供了这些环境的类型定义，形式为库文件。这些库文件由 TypeScript 编译器使用，以提供这些环境中可用的全局对象和 API 的类型信息。

通过 `deno.json` 配置文件中的 `compilerOptions.lib` 选项或通过 TypeScript 文件中的 `/// <reference lib="..." />` 注释，可以更改加载的库文件。建议使用 `deno.json` 配置文件中的 `compilerOptions.lib` 选项来指定要使用的库文件。

要启用对 **浏览器环境** 的类型检查，您可以在 `deno.json` 配置文件的 `compilerOptions.lib` 选项中指定 `dom` 库文件：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom"]
  }
}
```

这将启用浏览器环境的类型检查，为 `document` 等全局对象提供类型信息。不过，这也会禁用 Deno 特定 API 的类型信息，例如
[`Deno.readFile`](/api/deno/~/Deno.readFile)。

要启用对 **浏览器和 Deno 环境** 的组合类型检查，例如在使用 Deno 进行 SSR 时，您可以在 `deno.json` 配置文件的 `compilerOptions.lib` 选项中指定 `dom` 和 `deno.ns`（Deno 命名空间）库文件：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "deno.ns"]
  }
}
```

这将同时启用浏览器和 Deno 环境的类型检查，为 `document` 等全局对象以及 [`Deno.readFile`](/api/deno/~/Deno.readFile) 等 Deno 特定 API 提供类型信息。

要启用对 **Deno 中 web worker 环境** 的类型检查（即用 `new Worker` 运行的代码），您可以在 `deno.json` 的 `compilerOptions.lib` 选项中指定 `deno.worker` 库文件：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["deno.worker"]
  }
}
```

要在 TypeScript 文件中指定要使用的库文件，您可以使用 `/// <reference lib="..." />` 注释：

```ts
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
```

## 使用 `tsconfig.json` 配置 TypeScript {#tsconfig}

虽然 Deno 默认使用 `deno.json` 进行 TypeScript 配置，但它也支持 `tsconfig.json`，以兼容现有的 Node.js 和 TypeScript 项目，从而更便于逐步采用 Deno。每个包含 `deno.json` 或 `package.json` 的工作区目录都会查找 `tsconfig.json`——如果存在，Deno 会自动在类型检查和语言服务器中使用它，无需额外标志。自 Deno 2.1 起，在存在 `package.json` 时也会自动检测 `jsconfig.json`，这对于仅使用 JavaScript 的项目很有用。

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

在运行 `deno check` 或使用 Deno 语言服务器时，它会被自动识别。如果之后添加了带有自身 `compilerOptions` 的 `deno.json`，则以后者为准。

:::tip

对于以 Deno 为先的项目，建议使用 `deno.json` 中的 `compilerOptions`，而不是单独的 `tsconfig.json`。有关支持字段、优先级规则和编译器选项默认值的完整列表，请参阅
[配置 TypeScript](/runtime/reference/ts_config_migration/)。

:::

## 扩展全局类型

Deno 支持 TypeScript 中的环境（ambient）或全局类型。当填充全局对象或用附加属性扩展全局作用域时，这非常有用。**您应该尽可能避免使用环境或全局类型**，因为它们会导致命名冲突，并使您更难理解代码。在发布到 JSR 时也不支持它们。

要在 Deno 中使用环境或全局类型，您可以使用 `declare global` 语法，或加载一个扩展了全局作用域的 `.d.ts` 文件。

### 使用 declare global 扩展全局作用域

您可以在项目中导入的任何 TypeScript 文件中使用 `declare global` 语法，以将附加属性扩展到全局作用域。例如：

```ts
declare global {
  interface Window {
    polyfilledAPI(): string;
  }
}
```

这使得在导入类型定义时全局可用 `polyfilledAPI` 函数。

### 使用 .d.ts 文件扩展全局作用域

您还可以使用 `.d.ts` 文件扩展全局作用域。例如，您可以创建一个包含以下内容的 `global.d.ts` 文件：

```ts
interface Window {
  polyfilledAPI(): string;
}
```

然后您可以在您的 TypeScript 中通过 `/// <reference types="./global.d.ts" />` 加载此 `.d.ts` 文件。这将用 `polyfilledAPI` 函数扩展全局作用域。

或者，您可以在 `deno.json` 配置文件中的 `compilerOptions.types` 数组中指定 `.d.ts` 文件：

```json
{
  "compilerOptions": {
    "types": ["./global.d.ts"]
  }
}
```

这也会使用 `polyfilledAPI` 函数扩展全局作用域。

## 配置 TypeScript 编译器选项

Deno 默认开箱即用地使用严格且现代的 TypeScript 默认值，因此大多数项目都不需要任何配置。当您确实需要自定义编译器行为时，请在
[`deno.json`](/runtime/fundamentals/configuration/) 中使用 `compilerOptions` 字段：

```json title="deno.json"
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

请参阅
[受支持的编译器选项完整列表](/runtime/reference/ts_config_migration/#ts-compiler-options)。

## 在 Deno 中使用 `tsconfig.json`

如果您正在将 TypeScript 项目从 Node.js 迁移过来，现有的 `tsconfig.json` 文件可以直接与 Deno 的类型检查器和 LSP 一起使用。Deno 会自动发现同时包含
`deno.json` 或 `package.json` 的目录中的 `tsconfig.json` 文件。

```
my-project/
├── deno.json
├── tsconfig.json       # ← 自动发现
├── src/
│   └── main.ts
└── packages/
    └── lib/
        ├── package.json
        └── tsconfig.json  # ← 也会被发现
```

Deno 支持标准的 `tsconfig.json` 字段：`extends`、`files`、
`include`、`exclude`、`references` 和 `compilerOptions`。

:::note

对于以 Deno 为先的项目，建议使用 `deno.json` 中的 `compilerOptions`，而不是单独的
`tsconfig.json`。`tsconfig.json` 的兼容性主要是为了简化现有 Node.js 项目的迁移。

:::

### 优先级规则

当 `deno.json` 和 `tsconfig.json` 同时存在时：

1. 父级 `deno.json` 中的 `compilerOptions` 优先于任何 `tsconfig.json`。
2. `tsconfig.json` 的引用优先于其引用者。
3. 对于根引用，层级更深的 `tsconfig.json` 优先（例如 `foo/bar/tsconfig.json` 优先于 `foo/tsconfig.json`）。

有关 `tsconfig.json` 兼容性、编译器选项和库配置的完整细节，请参阅
[配置 TypeScript](/runtime/reference/ts_config_migration/) 参考文档。
