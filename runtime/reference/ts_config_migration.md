---
last_modified: 2026-06-19
title: "配置 TypeScript"
description: "Deno 中 TypeScript 配置指南。了解编译器选项、JavaScript 类型检查、JSDoc 支持、类型声明，以及用于跨平台兼容性的 TypeScript 配置。"
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

本页介绍 Deno 中高级 TypeScript 配置，包括编译器选项、`tsconfig.json` 兼容性以及库目标设置。有关在 Deno 中使用 TypeScript 的入门说明，请参阅
[TypeScript 支持](/runtime/fundamentals/typescript/)。

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

## 从 Node.js 迁移 compilerOptions

典型的 Node.js `tsconfig.json` 中的大部分内容都是用于配置编译输出和模块互操作。Deno 直接运行 TypeScript，且从不生成 JavaScript，因此这些选项大多不起作用，可以删除。Deno 会在 `tsconfig.json` 中出现被忽略的选项时发出警告；将剩余选项移动到 `deno.json` 的 `compilerOptions` 中可消除该警告。

| 您在 `tsconfig.json` 中的选项                         | 在 Deno 中                                                                                                                                    |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `target`, `outDir`, `outFile`, `rootDir`                | 删除。Deno 不会生成输出：代码直接在最新的 V8 上运行，而 `deno check` 只进行类型检查，不产生输出。                                                   |
| `declaration`, `declarationMap`, `emitDeclarationOnly`  | 删除。不会生成输出。使用 [`deno doc`](/runtime/reference/cli/doc/) 生成 API 文档。                                                                |
| `sourceMap`, `inlineSourceMap`, `inlineSources`         | 删除。堆栈跟踪会自动映射到您的 TypeScript 源代码。                                                                                              |
| `esModuleInterop`, `allowSyntheticDefaultImports`       | 删除。Deno 原生支持 ESM，并在运行时处理 CommonJS 互操作。                                                                                        |
| `importHelpers`, `noEmitHelpers`, `downlevelIteration`  | 删除。不会发生降级，因此不会生成辅助代码。                                                                                                      |
| `resolveJsonModule`                                     | 删除。改为使用属性导入 JSON：`import data from "./data.json" with { type: "json" }`.                                                           |
| `skipLibCheck`                                          | 删除。Deno 默认不会对依赖进行类型检查（`deno check --all` 可显式启用）。                                                                           |
| `module`, `moduleResolution`                            | 通常删除。Deno 的默认值为 `nodenext`；支持的值列在下表中。                                                                                          |
| `lib`, `types`                                          | 通常删除。Deno 的默认值已覆盖其运行时；仅在跨运行时代码中保留 `lib`（参见[“lib” 属性](#using-the-lib-property)）。                                   |
| `strict`, `noImplicit*`, `noUnused*`, other check flags | 保留您需要的选项，放在 `deno.json` 的 `compilerOptions` 中。注意 Deno 的默认值已经是严格模式（见下表）。                                          |
| `paths`, `baseUrl`                                      | 如有需要，可保留用于类型时路径映射，或者替换为 [导入映射](/runtime/fundamentals/modules/)，后者在运行时也有效。                                     |

## TS 编译器选项

以下是可更改的编译器选项列表，包括它们在 Deno 中的默认值和相关说明：

| 选项                           | 默认值                 | 备注                                                                                                                                     |
| ------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `allowUnreachableCode`          | `false`                |                                                                                                                                           |
| `allowUnusedLabels`            | `false`                |                                                                                                                                           |
| `baseUrl`                      | `"./"`                 | 用于解析 `paths` 和 `rootDirs` 中的裸模块描述符，但不会用于模块导入中的裸描述符。                                                           |
| `checkJs`                      | `false`                |                                                                                                                                           |
| `jsx`                          | `"react"`              |                                                                                                                                           |
| `jsxFactory`                   | `"React.createElement"`|                                                                                                                                           |
| `jsxFragmentFactory`          | `"React.Fragment"`     |                                                                                                                                           |
| `keyofStringsOnly`             | `false`                |                                                                                                                                           |
| `lib`                         | `[ "deno.window" ]`    | 该选项的默认值根据 Deno 中的其他设置而异。若提供此选项，则会覆盖默认设置。详见下文。                                                        |
| `module`                      | `"nodenext"`           | 支持的值包括：`["nodenext", "esnext", "preserve"]`。                                                                                    |
| `moduleResolution`            | `"nodenext"`           | 支持的值包括：`["nodenext", "bundler"]`。                                                                                               |
| `noErrorTruncation`            | `false`                |                                                                                                                                           |
| `noFallthroughCasesInSwitch`  | `false`                |                                                                                                                                           |
| `noImplicitAny`                | `true`                 |                                                                                                                                           |
| `noImplicitOverride`           | `true`                 |                                                                                                                                           |
| `noImplicitReturns`            | `false`                |                                                                                                                                           |
| `noImplicitThis`               | `true`                 |                                                                                                                                           |
| `noImplicitUseStrict`          | `true`                 |                                                                                                                                           |
| `noStrictGenericChecks`        | `false`                |                                                                                                                                           |
| `noUncheckedIndexedAccess`     | `false`                |                                                                                                                                           |
| `noUnusedLocals`               | `false`                |                                                                                                                                           |
| `noUnusedParameters`           | `false`                |                                                                                                                                           |
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

如果您的代码使用了受 `--unstable-*` 标志之一保护的 API，
也将 `deno.unstable` 库一并加入：

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

有关为 JavaScript 模块提供类型声明的信息（使用
`@ts-types`、`@ts-self-types`、`X-TypeScript-Types` 头部，以及 `.d.ts` 文件），
请参阅
[提供声明文件](/runtime/fundamentals/typescript/#providing-declaration-files)
中的 TypeScript 基础指南。

有关使用 `declare global` 或 `.d.ts`
文件扩展全局类型的信息，请参阅
[扩展全局类型](/runtime/fundamentals/typescript/#augmenting-global-types)。

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

如果您也有非工作者脚本，可考虑使用
[工作区](/runtime/fundamentals/workspaces/)，以便每个工作区成员
都能拥有各自的 `compilerOptions`。

## 重要事项

### 类型声明语义

类型声明文件（`.d.ts`）遵循与 Deno 其他文件相同的语义，即默认为模块声明（_UMD 声明_），非环境或全局声明。Deno 对环境/全局声明的处理不可预测。

此外，若类型声明文件导入其他模块（例如另一个 `.d.ts` 文件），其解析遵循 Deno 的正常导入规则。许多生成的并在线可得的 `.d.ts` 文件可能与 Deno 不兼容。

使用来自 [esm.sh](https://esm.sh) 等 CDN 的 HTTPS 导入时，默认会提供类型声明（通过 `X-TypeScript-Types` 头部）。可在导入 URL 后追加 `?no-dts` 来禁用。请注意，对于大多数使用场景，推荐使用 `npm:` 标识符来导入 npm 包。

## JavaScript 在类型检查时的表现

当在 Deno 中将 JavaScript 代码导入 TypeScript 时，即使 `checkJs` 设置为 `false`（Deno 默认），TypeScript 编译器仍会分析 JavaScript 模块，尝试推断模块导出形状，以验证 TypeScript 文件中的导入有效性。

通常情况下，导入标准 ES 模块不会有问题。但在某些场景（如特殊打包方式或全局 UMD 模块）下，这种分析可能失败。遇到此类情况，最好采用前述的类型提示方案。

### 内部工作原理

虽然理解 Deno 内部机制非使用 TypeScript 和 Deno 的必要，但有助于理解其运作。

Deno 在执行或编译代码前，首先解析根模块生成模块图，检测所有依赖并递归获取和解析直到完整。

针对每个依赖，存在两个“槽”：代码槽和类型槽。填充模块图时，若模块为可发射成 JavaScript 的内容，填充代码槽；类型依赖（如 `.d.ts` 文件）填充类型槽。

构建模块图并进行类型检查时，Deno 启动 TypeScript 编译器，将需要作为 JavaScript 发射的模块名提供给它。TypeScript 编译器请求额外模块时，Deno 会优先提供类型槽，再提供代码槽。

这意味着，导入 `.d.ts` 模块或采用前述解决方案为 JavaScript 代码提供替代类型模块时，TypeScript 获得的即为类型模块，而非解析时的代码模块。
