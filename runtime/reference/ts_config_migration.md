---
title: "Configuring TypeScript"
description: "A guide to TypeScript configuration in Deno. Learn about compiler options, type checking JavaScript, JSDoc support, type declarations, and configuring TypeScript for cross-platform compatibility."
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

TypeScript 提供了许多配置选项，对于刚刚开始使用 TS 的人来说可能会觉得令人生畏。Deno 旨在简化 TypeScript 的使用，而不是让您淹没在无数设置中。Deno 配置 TypeScript 以 **开箱即用**。无需额外的配置麻烦！

但是，如果您确实想更改 TypeScript 编译器选项，Deno 允许您在 `deno.json` 文件中进行更改。在命令行中提供路径，或使用默认路径。例如：

```console
deno run --config ./deno.json main.ts
```

:::note

如果您正在创建需要配置文件的库，请记住，您的所有 TS 模块的消费者也需要该配置文件。此外，配置文件中可能有使其他 TypeScript 模块不兼容的设置。

:::

## TS 编译器选项

以下是可以更改的编译器选项的表格，它们在 Deno 中的默认值以及关于该选项的其他说明：

| 选项                           | 默认值                 | 备注                                                                                                                                     |
| ------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `allowJs`                      | `true`                 | 这几乎永远不需要更改                                                                                                                   |
| `allowUnreachableCode`         | `false`                |                                                                                                                                           |
| `allowUnusedLabels`            | `false`                |                                                                                                                                           |
| `checkJs`                      | `false`                | 如果为 `true`，则会导致 TypeScript 对 JavaScript 进行类型检查                                                                              |
| `jsx`                          | `"react"`              |                                                                                                                                           |
| `jsxFactory`                   | `"React.createElement"` |                                                                                                                                           |
| `jsxFragmentFactory`           | `"React.Fragment"`      |                                                                                                                                           |
| `keyofStringsOnly`             | `false`                |                                                                                                                                           |
| `lib`                          | `[ "deno.window" ]`     | 该选项的默认值根据 Deno 中的其他设置而有所不同。如果提供，则会覆盖默认值。有关更多信息，请参见下文。                                             |
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
| `reactNamespace`               | `React`                |                                                                                                                                           |
| `strict`                       | `true`                 |                                                                                                                                           |
| `strictBindCallApply`          | `true`                 |                                                                                                                                           |
| `strictFunctionTypes`          | `true`                 |                                                                                                                                           |
| `strictPropertyInitialization`  | `true`                 |                                                                                                                                           |
| `strictNullChecks`             | `true`                 |                                                                                                                                           |
| `suppressExcessPropertyErrors` | `false`                |                                                                                                                                           |
| `suppressImplicitAnyIndexErrors` | `false`               |                                                                                                                                           |
| `useUnknownInCatchVariables`   | `true`                 |                                                                                                                                           |

有关全系列编译器选项及其如何影响 TypeScript 的信息，请参阅
[TypeScript 手册](https://www.typescriptlang.org/docs/handbook/compiler-options.html)。

## 使用 "lib" 属性

如果您正在处理一个向多个运行时（如浏览器）发送代码的项目，您可以通过 `compilerOptions` 中的 "lib" 属性调整默认类型。

对用户感兴趣的内置库包括：

- `"deno.ns"` - 包含所有自定义的 `Deno` 全局命名空间 API 以及 Deno 对 `import.meta` 的扩展。通常这不会与其他库或全局类型冲突。
- `"deno.unstable"` - 包含额外的不稳定 `Deno` 全局命名空间 API。
- `"deno.window"` - 这是在检查 Deno 主运行时脚本时使用的 "默认" 库。它包括 `"deno.ns"` 以及用于内置的扩展的其他类型库。此库会与标准 TypeScript 库（如 `"dom"` 和 `"dom.iterable"`）冲突。
- `"deno.worker"` - 这是在检查 Deno 网络工作者脚本时使用的库。有关网络工作者的更多信息，请查阅
  [Web 工作者的类型检查](/runtime/reference/ts_config_migration/#type-checking-web-workers)。
- `"dom.asynciterable"` - TypeScript 当前不包括 Deno 实现的 DOM 异步可迭代对象（以及多个浏览器），因此我们自己实现了它，直到它在 TypeScript 中可用。

这些是不会默认启用但在编写计划在其他运行时中也能正常工作的代码时实用的公共库：

- `"dom"` - 包含 TypeScript 的主要浏览器全局库。类型定义在许多方面与 `"deno.window"` 冲突，因此如果使用了 `"dom"`，则考虑仅使用 `"deno.ns"` 来暴露 Deno 特定的 API。
- `"dom.iterable"` - 浏览器全局库的可迭代扩展。
- `"scripthost"` - Microsoft Windows 脚本主机的库。
- `"webworker"` - 浏览器中网络工作者的主要库。与 `"dom"` 一样，这会与 `"deno.window"` 或 `"deno.worker"` 冲突，因此考虑仅使用 `"deno.ns"` 来暴露 Deno 特定的 API。
- `"webworker.importscripts"` - 使 `importScripts()` API 在网络工作者中可用的库。
- `"webworker.iterable"` - 将可迭代添加到网络工作者中的对象的库。现代浏览器支持此功能。

## 针对 Deno 和浏览器

您可能希望编写可以无缝运行于 Deno 和浏览器中的代码。在这种情况下，您需要在使用任何独占于某一个环境的 API 之前有条件地检查执行环境。在这种情况下，典型的 `compilerOptions` 配置可能如下所示：

```json title="deno.json"
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

这应该允许大多数代码在 Deno 中被正确地类型检查。

如果您预计将在使用 `--unstable` 标志的 Deno 中运行代码，那么您还应该将该库添加到配置中：

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

通常情况下，当您在 TypeScript 中使用 `"lib"` 选项时，您还需要包括一个 "es" 库。在 `"deno.ns"` 和 `"deno.unstable"` 的情况下，它们在引入时会自动包含 `"esnext"`。

:::note

如果您遇到类型错误，例如 **找不到 `document` 或 `HTMLElement`**，则可能您使用的库依赖于 DOM。这在设计为在浏览器内和服务器端运行的包中很常见。默认情况下，Deno 仅包括直接支持的库。假设该包正确识别其在运行时所处的环境，那么使用 DOM 库进行类型检查是 "安全" 的。

:::

## 类型和类型声明

Deno 运用 _无非标准模块解析_ 的设计原则。当 TypeScript 检查一个文件时，它只关注其类型。相比之下，`tsc` 编译器使用复杂的逻辑来解析这些类型。默认情况下，`tsc` 期望带有扩展名的模糊模块描述符（例如 `.ts`、`.d.ts` 或 `.js`）。然而，Deno 处理的是明确的描述符。

这里的有趣之处在于：假设您希望使用已经转译为 JavaScript 的 TypeScript 文件及其类型定义文件（`mod.js` 和 `mod.d.ts`）。如果您将 `mod.js` 导入到 Deno，它会严格遵循您的请求并导入 JavaScript 文件。但这里有个问题：您的代码不会像 TypeScript 考虑 `mod.d.ts` 文件和 `mod.js` 文件一样得到全面的类型检查。

为了解决这个问题，Deno 提供了两种解决方案，分别适用于特定场景：

**作为导入者：** 如果您知道应该应用于 JavaScript 模块的类型，可以通过显式指定类型来增强类型检查。

**作为提供者：** 如果您是模块的提供者或宿主，则所有使用该模块的人受益于不必担心类型解析。

## 导入时提供类型

如果您正在使用一个 JavaScript 模块，并且您已经创建了类型（`.d.ts` 文件）或以其他方式获取了您想要使用的类型，您可以指示 Deno 在类型检查时使用该文件，而不是 JavaScript 文件，使用 `@ts-types` 编译提示。

例如，如果您有一个 JavaScript 模块 `coolLib.js` 和一个单独的 `coolLib.d.ts` 文件，您可以这样导入它：

```ts
// @ts-types="./coolLib.d.ts"
import * as coolLib from "./coolLib.js";
```

在对 `coolLib` 进行类型检查并在文件中使用时，`coolLib.d.ts` 的 TypeScript 类型定义将优先于查看 JavaScript 文件。

:::note

在过去，`@ts-types` 指令被称为 `@deno-types`。这个别名仍然有效，但不再推荐使用。请使用 `@ts-types`。

:::

## 托管时提供类型

如果您控制模块的源代码或其在 Web 服务器上的文件托管方式，有两种方式可以让 Deno 知道特定模块的类型（这无需导入者采取任何特别操作）。

### @ts-self-types

如果您提供一个 JavaScript 文件，并希望提供一个声明文件来包含此文件的类型，您可以在 JS 文件中指定一个 `@ts-self-types` 指令，指向声明文件。

例如，如果您制作一个 `coolLib.js` 库，并在 `coolLib.d.ts` 中编写其类型定义，`ts-self-types` 指令将如下所示：

```js title="coolLib.js"
// @ts-self-types="./coolLib.d.ts"

// ... JavaScript 的其他部分 ...
```

### X-TypeScript-Types

Deno 支持用于远程模块的头部，它指示 Deno 在何处找到给定模块的类型。例如，对 `https://example.com/coolLib.js` 的响应可能如下所示：

```console
HTTP/1.1 200 OK
Content-Type: application/javascript; charset=UTF-8
Content-Length: 648
X-TypeScript-Types: ./coolLib.d.ts
```

当看到这个头部时，Deno 会尝试检索 `https://example.com/coolLib.d.ts` 并在对原始模块进行类型检查时使用它。

## 使用环境或全局类型

总体而言，最好在 Deno 中使用模块/UMD 类型定义，模块明确导入其依赖的类型。模块化类型定义可以通过类型定义中的 `declare global` 表达
[全局作用域的增强](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html)。例如：

```ts
declare global {
  var AGlobalString: string;
}
```

这会使 `AGlobalString` 在导入类型定义时可用于全局命名空间。

在某些情况下，当利用其他现有类型库时，可能无法利用模块化类型定义。因此，在类型检查程序时，有一些方法可以包含任意类型定义。

### 三斜杠指令

此选项将类型定义与代码本身关联。通过在 TS 文件（非 JS 文件！）中的模块类型附近添加三斜杠的 `types` 指令，类型检查该文件将包括类型定义。例如：

```ts
/// <reference types="./types.d.ts" />
```

提供的描述符与 Deno 中的其他描述符一样进行解析，这意味着它需要一个扩展名，并且相对于引用它的模块。它也可以是一个完全合格的 URL：

```ts
/// <reference types="https://deno.land/x/pkg@1.0.0/types.d.ts" />
```

### 在 deno.json 中提供 "types"

另一种选择是在您的 `deno.json` 中为 `"compilerOptions"` 提供一个 `"types"` 值。例如：

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

与上面的三斜杠引用类似，提供的 `"types"` 数组中的描述符将像 Deno 中的其他描述符一样进行解析。在相对描述符的情况下，它将相对于配置文件的路径进行解析。通过指定 `--config=path/to/file` 标志确保 Deno 使用该文件。

## 对 Web 工作者进行类型检查

当 Deno 在 Web 工作者中加载 TypeScript 模块时，它将自动对模块及其依赖项进行类型检查，以确保符合 Deno 网络工作者库。这在其他上下文中（如 `deno check` 或编辑器中）可能会带来挑战。您可以通过几种方式指示 Deno 使用网络工作者库，而不是标准 Deno 库。

### 三斜杠指令

此选项将库设置与代码本身关联。通过在工作者脚本的入口文件顶部添加以下三斜杠指令，Deno 将会将其作为 Deno 网络工作者脚本进行类型检查，无论该模块如何分析：

```ts
/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />
```

第一个指令确保不使用其他默认库。如果省略此项，您将收到一些冲突的类型定义，因为 Deno 会尝试应用标准 Deno 库。第二个指令则告诉 Deno 应用内置的 Deno 网络工作者类型定义及相关依赖库（如 `"esnext"`）。

这种方法的一个缺点是，代码在其他非 Deno 平台（如 `tsc`）上的可移植性较差，因为只有 Deno 内置了 `"deno.worker"` 库。

### 在 deno.json 中提供 "lib" 设置

您可以在 `deno.json` 文件中提供 "lib" 选项来指示 Deno 使用库文件。例如：

```json title="deno.json"
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["deno.worker"]
  }
}
```

然后在运行 deno 子命令时，您需要传递 `--config path/to/file` 参数，或者如果您正在使用利用 Deno 语言服务器的 IDE，则设置 `deno.config` 设置。

如果您还有非工作者脚本，您要么需要省略 `--config` 参数，要么配置一个适合您的非工作者脚本的配置。

## 重要事项

### 类型声明语义

类型声明文件（`.d.ts` 文件）遵循与 Deno 中其他文件相同的语义。这意味着声明文件被假定为模块声明（_UMD 声明_），而不是环境/全局声明。Deno 将如何处理环境/全局声明是不可预测的。

此外，如果类型声明导入了其他内容，例如另一个 `.d.ts` 文件，它的解析遵循 Deno 的正常导入规则。对于许多生成的并可在网上获得的 `.d.ts` 文件，它们可能与 Deno 不兼容。

[esm.sh](https://esm.sh) 是一个提供默认类型声明的 CDN（通过 `X-TypeScript-Types` 头部）。通过在导入 URL 后附加 `?no-dts` 可以禁用它：

```ts
import React from "https://esm.sh/react?no-dts";
```

## JavaScript 在类型检查时的行为

当您在 Deno 中将 JavaScript 代码导入 TypeScript 时，即使您已将 `checkJs` 设置为 `false`（这是 Deno 的默认行为），TypeScript 编译器仍会分析 JavaScript 模块。它试图从该模块推断导出形状，以验证在您的 TypeScript 文件中的导入。

通常，这在导入标准 ES 模块时不会出现问题。然而，在某些情况下，TypeScript 的分析可能会失败，例如，在具有特殊打包或全局 UMD（通用模块定义）模块的情况下。面对这种情况，最好的方法是使用前面提到的某种形式的类型信息。

### 内部逻辑

虽然理解 Deno 如何在内部工作并不是使用 TypeScript 和 Deno 时的必要条件，但理解其工作原理是有帮助的。

在执行或编译任何代码之前，Deno 通过解析根模块生成一个模块图，然后检测其所有依赖，并递归检索和解析这些模块，直到获取所有依赖。

对于每个依赖项，有两个潜在的 "插槽" 被使用。一个是代码插槽，一个是类型插槽。随着模块图的填充，如果模块是可以发射到 JavaScript 的内容，则填充代码插槽，而类型依赖项，如 `.d.ts` 文件，则填充类型插槽。

当构建模块图并需要进行类型检查时，Deno 启动 TypeScript 编译器，并将需要作为 JavaScript 发射的模块的名称提供给它。在该过程中，TypeScript 编译器会请求额外的模块，而 Deno 将查看依赖的插槽，在填充类型插槽后再提供代码插槽。

这意味着当您导入一个 `.d.ts` 模块或使用上述某个解决方案为 JavaScript 代码提供替代类型模块时，提供给 TypeScript 的即是该类型模块，而不是解析模块时的代码。