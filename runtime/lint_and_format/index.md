---
last_modified: 2026-05-17
title: "Linting and formatting"
description: "Deno 内置代码质量工具指南。了解如何使用 deno lint 和 deno fmt 命令，配置规则，与 CI/CD 流水线集成，并在项目中保持一致的代码风格。"
oldUrl:
  - /runtime/fundamentals/linting_and_formatting/
---

Deno 在 `deno` 二进制文件中自带了一个 linter 和一个 formatter。无需安装任何包，也不需要配置文件：

```sh
deno lint    # 捕获 bug 和反模式
deno fmt     # 格式化代码、markdown 和 JSON
```

这两者都很快，在本地和 CI 中的运行方式相同，并且（当你确实需要配置时）与项目其余部分一样，都在同一个 `deno.json` 中配置。

## Linting

<a href="/lint/" type="docs-cta runtime-cta">探索所有 lint 规则</a>

Linting 是分析代码中潜在错误、bug 和风格问题的过程。Deno 内置的 linter，
[`deno lint`](/runtime/reference/cli/lint/) 支持来自 [ESLint](https://eslint.org/) 的推荐规则集，
为你的代码提供全面反馈。这包括识别语法错误、强制编码约定，以及
突出可能导致 bug 的潜在问题。

要运行 linter，请在终端中使用以下命令：

```bash
deno lint
```

默认情况下，`deno lint` 会分析当前目录及其子目录中的所有 TypeScript 和 JavaScript 文件。如果你想对特定文件或目录进行 lint，可以将它们作为参数传递给命令。例如：

```bash
deno lint src/
```

此命令将对 `src/` 目录中的所有文件进行 lint。

一次发现会显示规则名称、违规代码以及提示：

```console
$ deno lint main.ts
error[require-await]: Async function 'fetchData' has no 'await' expression
 --> /project/main.ts:1:1
  |
1 | async function fetchData() {
  | ^^^^^
  = hint: Remove 'async' keyword from the function or use 'await' expression inside.

  docs: https://docs.deno.com/lint/rules/require-await

Found 1 problem
Checked 1 file
```

某些规则可以为你修复问题：运行 `deno lint --fix` 可自动应用这些修复。若要对某一行忽略某条规则，在其上方添加一个指定规则名的忽略指令：

```ts
// deno-lint-ignore require-await
async function fetchData() {
  return "data";
}
```

有关所有标志和指令形式，请参阅 [`deno lint` 参考](/runtime/reference/cli/lint/)。

可以在 [`deno.json`](/runtime/reference/deno_json/#linting) 文件中配置 linter。你可以指定自定义规则、插件和设置，以便根据需要调整 lint 流程。

### Linting rules

你可以在 [规则列表](/lint/) 文档页面中查看和搜索可用规则及其用法。

## Formatting

Formatting 是自动调整代码布局以遵循一致风格的过程。Deno 内置的 formatter `deno fmt` 使用强大的 [dprint](https://dprint.dev/) 引擎，确保你的代码始终干净、易读且一致。

要格式化你的代码，只需在终端中执行以下命令：

```bash
deno fmt
```

默认情况下，`deno fmt` 会格式化当前目录及其子目录中的所有 TypeScript 和 JavaScript 文件。如果你想格式化特定文件或目录，可以将它们作为参数传递给命令。例如：

```bash
deno fmt src/
```

此命令将格式化 `src/` 目录中的所有文件。

### 检查你的格式化

`deno fmt --check` 命令用于验证你的代码是否按照 Deno 的默认格式化规则正确格式化。它不会修改文件，而是对其进行检查并报告任何格式化问题。这对于集成到持续集成（CI）流水线或 pre-commit hooks 中特别有用，可确保整个项目中的代码一致性。

如果存在格式化问题，`deno fmt --check` 会列出需要格式化的文件。如果所有文件都已正确格式化，它将直接退出而不输出任何内容。

### 在 CI 中集成

你可以将 `deno fmt --check` 添加到 CI 流水线中，以自动检查格式化问题。例如，在 GitHub Actions 工作流中：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno fmt --check
```

这可确保任何代码更改在合并之前都符合项目的格式化标准。

### 在 VS Code 中集成

要在 VS Code 中启用 Deno 作为 formatter，请安装 [Deno 扩展](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
，并在项目根目录下添加一个 `.vscode/settings.json` 文件，将其设置为默认 formatter，并为你的项目启用该扩展：

```json
{
  "deno.enablePaths": ["./deno.json"],
  "editor.defaultFormatter": "denoland.vscode-deno",
  "editor.formatOnSave": true
}
```

如果你的 `deno.json(c)` 文件位于项目的子目录中，请改为提供正确的相对路径。

### 配置

formatter 通过你的 [`deno.json`](/runtime/reference/deno_json/#formatting) 文件中的 `fmt` 字段进行配置。有关完整设置列表及其默认值，请参阅 [所有格式化选项](/runtime/reference/deno_json/#formatting)。

## 使用其他 linter 和 formatter

Deno 内置的 [`deno lint`](#linting) 和 [`deno fmt`](#formatting) 已覆盖大多数项目，但你也可以运行流行的第三方工具，而无需全局安装它们。由于 Deno 可直接运行 npm 包，`deno run -A npm:<tool>` 可以直接运行其中任何工具，而无需单独执行 `npm install`。为了减少输入量，可以将该命令添加为 `deno.json` 中的一个 [task](/runtime/reference/deno_json/#tasks)，然后使用 `deno task` 运行它。

### ESLint

[ESLint](https://eslint.org/) 需要一个 flat config 文件 `eslint.config.js`。
使用 `npm:` 规范引用其包，以便 Deno 能够解析它们：

```js title="eslint.config.js"
import js from "npm:@eslint/js";
import globals from "npm:globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      globals: { ...globals.node, Deno: "readonly" },
    },
  },
];
```

然后在你的项目上运行它：

```sh
deno run -A npm:eslint .
```

声明 Node 和 `Deno` 全局变量可防止 `console` 等全局变量出现误报的 `no-undef` 错误。若要对 TypeScript 进行具备类型感知的 lint，请将 [typescript-eslint](https://typescript-eslint.io/) 添加到配置中。

:::note

VS Code ESLint 扩展需要一个真实的 `node_modules` 目录来解析 ESLint 及其插件。在你的 `deno.json` 中设置 `"nodeModulesDir": "auto"`，并运行 `deno install`，以便将这些包实际写入磁盘。

:::

### oxlint

[oxlint](https://oxc.rs) 是一个基于 Rust、速度很快的 linter，无需配置即可运行：

```sh
deno run -A npm:oxlint@latest
```

它会对当前目录进行 lint，并打印发现的任何问题：

```console
sample.ts:3:5: warning eslint(no-unused-vars): Variable 'unused' is declared but never used.
```

### Prettier

[Prettier](https://prettier.io/) 无需配置即可格式化你的代码：

```sh
# 报告需要格式化的文件
deno run -A npm:prettier --check .

# 就地格式化文件
deno run -A npm:prettier --write .
```

### Biome

[Biome](https://biomejs.dev/) 是一个基于 Rust 的快速 linter 和 formatter 二合一工具，同样可以零配置运行：

```sh
# lint 并检查格式化
deno run -A npm:@biomejs/biome check .

# 就地格式化文件
deno run -A npm:@biomejs/biome format --write .

# 仅 lint
deno run -A npm:@biomejs/biome lint .
```

要自定义 Biome，请使用 `deno run -A npm:@biomejs/biome init` 生成一个 `biome.json`。
