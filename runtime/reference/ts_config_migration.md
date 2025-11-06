---
title: "配置 TypeScript"
description: "Deno 中 TypeScript 配置指南。了解编译器选项、JavaScript 的类型检查、JSDoc 支持、类型声明以及跨平台兼容性的 TypeScript 配置。"
oldUrl:
  - /runtime/manual/advanced/typescript/faqs/
  - /runtime/manual/advanced/typescript/migration/
  - /runtime/manual/advanced/typescript/configuration/
  - /runtime/manual/advanced/typescript/types/
  - /runtime/manual/typescript/types/
  - /runtime/manual/advanced/faqs/
  - /runtime/advanced/typescript/configuration/
  - /runtime/manual/typescript/typescript/faqs/
  - /runtime/fundamentals/types/
---

Deno 的灵活性体现在对 TypeScript 和 JavaScript 的平等对待。
无论您是从 JavaScript 迁移到 TypeScript，还是反之，Deno
都提供了便利功能来帮助您顺利过渡。

## JavaScript 的类型检查

您可能希望使您的 JavaScript 更加符合类型，而不必在每个地方添加类型注解。Deno 支持使用 TypeScript 类型检查器来检查 JavaScript 的类型。您可以通过向文件添加检查 JavaScript 的 pragma 来标记单个文件：

```js
// @ts-check
```

这将导致类型检查器推断 JavaScript 代码的类型信息，并将任何问题作为诊断问题提出。

您可以通过提供配置文件并将 check JS 选项设置为 `true` 来为程序中的所有 JavaScript 文件启用此功能，如下所示。然后在命令行运行时使用 `--config` 选项。

```json
{
  "compilerOptions": {
    "checkJs": true
  }
}
```

## 在 JavaScript 中使用 JSDoc

在对 JavaScript 进行类型检查或将 JavaScript 导入到 TypeScript 时，JSDoc 注释可以提供超出代码本身可以推断的额外类型信息。如果您在代码中以支持的
[TypeScript JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) 进行内联注释，Deno 将无缝支持这一点。

例如，要设置数组的类型，可以使用以下 JSDoc 注释：

```js
/** @type {string[]} */
const a = [];
```

## 跳过类型检查

您可能有正在尝试的 TypeScript 代码，其中语法有效但并不完全安全。您可以通过传递 `--no-check` 标志来绕过整个程序的类型检查。

如果您已启用 check JS，还可以通过使用 `nocheck` pragma 跳过整个文件的类型检查，包括 JavaScript：

```js
// @ts-nocheck
```

## 将 JS 文件重命名为 TS 文件

TypeScript 文件受益于 TypeScript 编译器能够对您的代码进行更彻底的安全检查。这通常被称为 _严格模式_。
当您将 `.js` 文件重命名为 `.ts` 时，您可能会看到 TypeScript 之前无法检测到的新类型错误。

## 在 Deno 中配置 TypeScript

Deno 致力于基于以下设计原则简化 TypeScript 配置：

- 对类型检查规则采用严格且现代的默认值。
- 允许省略涉及目标运行时或兼容性的设置，利用与执行环境的直接集成。
- 使用 `deno.json` 目录作用域支持项目引用。

最后一点提供了比 `tsconfig.json` 的 [`references`](https://www.typescriptlang.org/tsconfig/#references) 和 [`extends`](https://www.typescriptlang.org/tsconfig/#extends) 字段更简洁的格式，使用 `deno.json` 工作区和根成员继承。详见关于[工作区中的类型检查](/runtime/fundamentals/workspaces/#type-checking)章节。

## `tsconfig.json` 兼容性

虽然不推荐在以 Deno 为主的项目中使用 [`tsconfig.json`](https://www.typescriptlang.org/tsconfig/) 文件，但现有的 Node.js + TypeScript 工作区仍可在 Deno 的类型检查器和语言服务器协议中开箱即用。

对包含 `deno.json` 或 `package.json` 的每个工作区目录，Deno 都会查找 `tsconfig.json` 文件。如果存在，它将被添加为“根”项目引用，并递归包含其中的引用。

与 `tsc` 类似，TSConfig 的作用域由其[根字段](https://www.typescriptlang.org/tsconfig/#root-fields)确定。如有重叠情况：

- 被引用的项目优先于引用者。
- 对于根引用，`foo/bar/tsconfig.json` 优先于 `foo/tsconfig.json`。
- 如果父目录中的 `deno.json` 含有 `compilerOptions`，则优先于任何 TSConfig。

支持以下字段：

```json title="tsconfig.json"
{
  "extends": "...",
  "files": ["..."],
  "include": ["..."],
  "exclude": ["..."],
  "references": [
    { "path": "..." }
  ],
  "compilerOptions": {
    "...": "..."
  }
}
```

除 `compilerOptions` 外，这些字段不能在 `deno.json` 中指定。

您可能在某些情况下被迫使用 `tsconfig.json`，例如当 [`include`](https://www.typescriptlang.org/tsconfig/#include) 所需的粒度无法通过 `deno.json` 工作区和目录作用域表示时。

## TS 编译器选项

以下是可更改的编译器选项列表，包括它们在 Deno 中的默认值和相关说明：

| 选项                           | 默认值                 | 备注                                                                                                                                     |
| ------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `allowUnreachableCode`         | `false`                |                                                                                                                                        |
| `allowUnusedLabels`            | `false`                |                                                                                                                                           |
| `baseUrl`                     | `"./"`                 | 用于解析 `paths` 和 `rootDirs` 中的裸模块描述符，但不会用于模块导入中的裸描述符。                                                           |
| `checkJs`                      | `false`                |                                                                                                                                        |
| `jsx`                          | `"react"`              |                                                                                                                                           |
| `jsxFactory`                   | `"React.createElement"` |                                                                                                                                           |
| `jsxFragmentFactory`           | `"React.Fragment"`      |                                                                                                                                           |
| `keyofStringsOnly`             | `false`                |                                                                                                                                           |
| `lib`                         | `[ "deno.window" ]`     | 该选项的默认值根据 Deno 中的其他设置而异。若提供此选项，则会覆盖默认设置。详见下文。                                                        |
| `module`                      | `"nodenext"`           | 支持的值包括：`["nodenext", "esnext", "preserve"]`。                                                                                    |
| `moduleResolution`            | `"nodenext"`           | 支持的值包括：`["nodenext", "bundler"]`。                                                                                               |
| `noErrorTruncation`            | `false`                |                                                                                                                                           |
| `noFallthroughCasesInSwitch`   | `false`                |                                                                                                                                           |
| `noImplicitAny`                | `true`                 |                                                                                                                                           |
| `noImplicitOverride`           | `true`                 |                                                                                                                                           |
| `noImplicitReturns`            | `false`                |                                                                                                                                           |
| `noImplicitThis`               | `true`                 |                                                                                                                                           |
| `noImplicitUseStrict`          | `true`                 |                                                                                                                                           |
| `noStrictGenericChecks`        | `false`                |                                                                                                                                           |
| `noUnusedLocals`               | `false`                |                                                                                                                                           |
| `noUnusedParameters`           | `false`                |                                                                                                                                           |
| `noUncheckedIndexedAccess`     | `false`                |                                                                                                                                           |
| `paths`                      | `{}`                   |                                                                                                                                           |
| `rootDirs`                   | `null`                  |                                                                                                                                           |
| `strict`                     | `true`                  |                                                                                                                                           |
| `strictBindCallApply`        | `true`                  |                                                                                                                                           |
| `strictFunctionTypes`        | `true`                  |                                                                                                                                           |
| `strictPropertyInitialization`| `true`                 |                                                                                                                                           |
| `strictNullChecks`           | `true`                  |                                                                                                                                           |
| `suppressExcessPropertyErrors`| `false`                 |                                                                                                                                           |
| `suppressImplicitAnyIndexErrors` | `false`             |                                                                                                                                           |
| `useUnknownInCatchVariables` | `true`                  |                                                                                                                                           |

有关完整编译器选项及其对 TypeScript 的影响，请参阅[TypeScript 手册](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

## 使用 "lib" 属性

如果您的项目需要向多个运行时（例如浏览器）发送代码，您可以通过 `compilerOptions` 中的 "lib" 属性调整默认类型。

常用内置库说明：

- `"deno.ns"` — 包含所有自定义的 `Deno` 全局命名空间 API 以及 Deno 对 `import.meta` 的扩展。通常不会与其他库或全局类型冲突。
- `"deno.unstable"` — 包含额外的不稳定 `Deno` 全局命名空间 API。
- `"deno.window"` — 这是检查 Deno 主运行时脚本时使用的“默认”库，包含 `"deno.ns"` 以及内置扩展的其他类型库。此库会与标准 TypeScript 库（如 `"dom"` 和 `"dom.iterable"`）冲突。
- `"deno.worker"` — 检查 Deno 网络工作者脚本时使用的库。更多信息见[Web 工作者的类型检查](/runtime/reference/ts_config_migration/#type-checking-web-workers)。
- `"dom.asynciterable"` — TypeScript 当前不包含 Deno 实现的 DOM 异步可迭代对象（以及多个浏览器均支持），因此我们自行实现，直至 TypeScript 支持该特性。

以下公共库默认不启用，但当编写计划在多种运行时正常工作的代码时非常有用：

- `"dom"` — TypeScript 的主要浏览器全局库。该类型定义与 `"deno.window"` 在多方面冲突，若使用 `"dom"`，建议只利用 `"deno.ns"` 公开 Deno 特定 API。
- `"dom.iterable"` — 浏览器全局库的可迭代扩展。
- `"scripthost"` — Microsoft Windows 脚本主机的库。
- `"webworker"` — 浏览器中 Web 工作者的主要库，类似 `"dom"`，它会与 `"deno.window"` 或 `"deno.worker"` 冲突，因此建议只使用 `"deno.ns"`。
- `"webworker.importscripts"` — Web 工作者中可用的 `importScripts()` API 库。
- `"webworker.iterable"` — 为 Web 工作者中的对象添加可迭代性，该特性受现代浏览器支持。

## 针对 Deno 和浏览器

若您希望编写可无缝运行于 Deno 和浏览器的代码，需在使用某环境独占的 API 之前条件性检查执行环境。典型的 `compilerOptions` 配置示例如下：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

这应允许大多数代码在 Deno 中被正确类型检查。

如果您预计会在启用 `--unstable` 标志的 Deno 中运行代码，还应将该库添加：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns",
      "deno.unstable"
    ]
  }
}
```

常见情况下，使用 TypeScript 的 `"lib"` 选项时还需包含对应的 "es" 库。而 `"deno.ns"` 和 `"deno.unstable"` 在引入时会自动包含 `"esnext"`。

:::note

如果您遇到类型错误，如 **找不到 `document` 或 `HTMLElement`**，可能是因为所用库依赖 DOM。这在设计为可运行于浏览器和服务器端的包中很常见。默认情况下，Deno 仅包含直接支持的库。假设包正确识别其运行时环境，类型检查时包含 DOM 库是“安全”的。

:::

## 类型和类型声明

Deno 采用 _无非标准模块解析_ 设计原则。TypeScript 检查文件时只关心其类型；相比之下，`tsc` 通过复杂逻辑解析类型。默认情况下，`tsc` 期望模块带有扩展名（如 `.ts`、`.d.ts`、`.js` 等）。而 Deno 处理的模块描述符均为明确带扩展名。

对于想使用已转译为 JavaScript 的 TypeScript 文件及其类型声明文件（例如 `mod.js` 和 `mod.d.ts`），Deno 会严格根据引入的请求加载 JavaScript 文件，但由于 TypeScript 还会考虑类型声明，Deno 的类型检查可能不如 TypeScript 完整。

为解决此问题，Deno 提供了两种解决方案，分别适用于不同场景：

**作为导入者：** 若您知道应应用于 JavaScript 模块的类型，可通过显式指定类型提示增强类型检查。

**作为提供者：** 若您是模块源代码或它的托管方，能够让使用此模块的人无需担心类型解析，享受类型服务。

## 导入时提供类型

当使用 JavaScript 模块，且已创建对应的类型定义（`.d.ts` 文件）或其他类型时，可以使用 `@ts-types` 注释指令指明类型文件：

```ts
// @ts-types="./coolLib.d.ts"
import * as coolLib from "./coolLib.js";
```

在此文件中使用 `coolLib` 时，`coolLib.d.ts` 中的 TypeScript 类型定义将优先于观察 JavaScript 文件。

:::note

历史上，`@ts-types` 指令曾称为 `@deno-types`。该别名仍有效，但不推荐使用。请使用 `@ts-types`。

:::

## 托管时提供类型

若您控制模块源代码或其在 Web 服务器上的托管方式，可通过两种方式告知 Deno 指定模块的类型（无需导入者额外操作）。

### @ts-self-types

若您提供 JavaScript 文件，且希望附带声明文件，可在 JS 文件中用 `@ts-self-types` 注释指明声明文件：

```js title="coolLib.js"
// @ts-self-types="./coolLib.d.ts"

// ... JavaScript 代码 ...
```

### X-TypeScript-Types 头部

Deno 支持远程模块响应头，指明该模块类型定义所在位置。例如，`https://example.com/coolLib.js` 的响应头：

```console
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./coolLib.d.ts
```

Deno 在看到此头部时，会尝试加载 `https://example.com/coolLib.d.ts` 并在类型检查原始模块时使用它。

## 使用环境或全局类型

一般建议在 Deno 中使用模块化或 UMD 类型定义，即模块显式导入其所依赖类型。模块化类型定义可以通过类型定义中的 `declare global` 表达对[全局作用域的增强](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)，例如：

```ts
declare global {
  var AGlobalString: string;
}
```

此举使得在导入类型定义后 `AGlobalString` 可在全局命名空间访问。

在某些情况下，使用第三方类型库时无法采用模块化类型定义。为此，类型检查程序提供以下包含任意类型定义的方法。

### 三斜杠指令

通过在 TS 文件（非 JS！）顶部添加三斜杠的 `types` 指令，将类型定义与代码关联，令类型检查包含该定义，例如：

```ts
/// <reference types="./types.d.ts" />
```

该引用的描述符与 Deno 中其他描述符一致解析，需带扩展名，且相对于引用模块。也可使用完整 URL：

```ts
/// <reference types="https://deno.land/x/pkg@1.0.0/types.d.ts" />
```

### 在 deno.json 中提供 "types"

另一种方式是在 `deno.json` 的 `"compilerOptions"` 中指定 `"types"` 数组，例如：

```json title="deno.json"
{
  "compilerOptions": {
    "types": [
      "./types.d.ts",
      "https://deno.land/x/pkg@1.0.0/types.d.ts",
      "/Users/me/pkg/types.d.ts"
    ]
  }
}
```

这些类型描述符与三斜杠引用类似，按 Deno 规范解析；相对地址相对于配置文件位置。运行时传递 `--config=path/to/file`，确保 Deno 使用该配置。

## 对 Web 工作者进行类型检查

Deno 在加载 Web 工作者中的 TypeScript 模块时，会自动对模块及其依赖项使用网络工作者相关库类型检查。这可能在其他环境（如使用 `deno check` 或编辑器中）造成挑战。您可通过以下方式向 Deno 指定使用网络工作者库，而非标准 Deno 库。

### 三斜杠指令

通过在工作者入口脚本顶部添加三斜杠库指令，将库设置与代码关联，例如：

```ts
/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />
```

第一条指令禁止使用默认库，避免冲突；第二条指令告知使用内置 Deno 网络工作者类型定义及依赖（如 `"esnext"`）。

此方案缺点是代码在非 Deno 平台（如 `tsc`）上可移植性差，因为 `"deno.worker"` 是 Deno 独有的库。

### 在 deno.json 中提供 "lib" 设置

您也可在 `deno.json` 中为 `"compilerOptions"` 指定 `"lib"`，如：

```json title="deno.json"
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["deno.worker"]
  }
}
```

运行相关命令时需传递 `--config path/to/file`，或在支持 Deno 语言服务器的 IDE 中设置 `deno.config`。

如果项目兼含非工作者脚本，请相应决定是否省略 `--config` 参数或配置适用于非工作者模块的配置文件。

## 重要事项

### 类型声明语义

类型声明文件（`.d.ts`）遵循与 Deno 其他文件相同的语义，即默认为模块声明（_UMD 声明_），非环境或全局声明。Deno 对环境/全局声明的处理不可预测。

此外，若类型声明文件导入其他模块（例如另一个 `.d.ts` 文件），其解析遵循 Deno 的正常导入规则。许多生成的并在线可得的 `.d.ts` 文件可能与 Deno 不兼容。

[esm.sh](https://esm.sh) 是一个默认提供类型声明的 CDN（通过 `X-TypeScript-Types` 头部）。可通过在导入 URL 后加 `?no-dts` 参数禁用，例如：

```ts
import React from "https://esm.sh/react?no-dts";
```

## JavaScript 在类型检查时的表现

当在 Deno 中将 JavaScript 代码导入 TypeScript 时，即使 `checkJs` 设置为 `false`（Deno 默认），TypeScript 编译器仍会分析 JavaScript 模块，尝试推断模块导出形状，以验证 TypeScript 文件中的导入有效性。

通常情况下，导入标准 ES 模块不会有问题。但在某些场景（如特殊打包方式或全局 UMD 模块）下，这种分析可能失败。遇到此类情况，最好采用前述的类型提示方案。

### 内部工作原理

虽然理解 Deno 内部机制非使用 TypeScript 和 Deno 的必要，但有助于理解其运作。

Deno 在执行或编译代码前，首先解析根模块生成模块图，检测所有依赖并递归获取和解析直到完整。

针对每个依赖，存在两个“槽”：代码槽和类型槽。填充模块图时，若模块为可发射成 JavaScript 的内容，填充代码槽；类型依赖（如 `.d.ts` 文件）填充类型槽。

构建模块图并进行类型检查时，Deno 启动 TypeScript 编译器，将需要作为 JavaScript 发射的模块名提供给它。TypeScript 编译器请求额外模块时，Deno 会优先提供类型槽，再提供代码槽。

这意味着，导入 `.d.ts` 模块或采用前述解决方案为 JavaScript 代码提供替代类型模块时，TypeScript 获得的即为类型模块，而非解析时的代码模块。