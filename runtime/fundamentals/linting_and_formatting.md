---
title: "代码检查与格式化"
description: "Deno 内置代码质量工具的指南。学习如何使用 deno lint 和 deno fmt 命令，配置规则，集成 CI/CD 管道，并在您的项目中保持一致的代码风格。"
---

在理想的世界中，您的代码始终是干净、一致且没有令人烦恼的错误。这就是 Deno 内置的代码检查和格式化工具的承诺。通过将这些特性直接整合到运行时中，Deno 消除了对外部依赖和复杂配置的需求。这些内置工具快速且高效，不仅节省了时间，还确保每一行代码都遵循最佳实践。

使用 `deno fmt` 和 `deno lint`，您可以专注于编写出色的代码，知道 Deno 会为您保驾护航。就像有一个警惕的助手在维护您的代码库，让您能够专注于真正重要的事情：构建出色的应用程序。

## 代码检查

<a href="/lint/" type="docs-cta runtime-cta">查看所有 lint 规则</a>

代码检查是分析代码以寻找潜在错误、bug 和风格问题的过程。Deno 内置的代码检查工具 [`deno lint`](/runtime/reference/cli/linter/) 支持来自 [ESLint](https://eslint.org/) 的推荐规则集，为您的代码提供全面的反馈。这包括识别语法错误、强制编码规范以及突出可能导致 bug 的潜在问题。

要运行代码检查程序，请在终端中使用以下命令：

```bash
deno lint
```

默认情况下，`deno lint` 会分析当前目录及其子目录中的所有 TypeScript 和 JavaScript 文件。如果您想仅对特定文件或目录进行检查，可以将它们作为命令的参数传递。例如：

```bash
deno lint src/
```

此命令将对 `src/` 目录中的所有文件进行代码检查。

代码检查工具可以在 [`deno.json`](/runtime/fundamentals/configuration/#linting) 文件中进行配置。您可以指定自定义规则、插件和设置，以根据需要调整代码检查过程。

### 代码检查规则

您可以在 [规则列表](/lint/) 文档页面查看和搜索可用规则及其用法。

## 格式化

格式化是自动调整代码布局以遵循一致风格的过程。Deno 内置的格式化器 `deno fmt` 使用强大的 [dprint](https://dprint.dev/) 引擎来确保您的代码始终干净、可读且一致。

要格式化代码，只需在终端中执行以下命令：

```bash
deno fmt
```

默认情况下，`deno fmt` 会格式化当前目录及其子目录中的所有 TypeScript 和 JavaScript 文件。如果您想仅对特定文件或目录进行格式化，可以将它们作为命令的参数传递。例如：

```bash
deno fmt src/
```

此命令将格式化 `src/` 目录中的所有文件。

### 检查格式化

`deno fmt --check` 命令用于验证您的代码是否按照 Deno 的默认格式化规则正确格式化。它不会修改文件，而是检查它们并报告任何格式问题。这对于集成到持续集成（CI）管道或提交前钩子中尤其有用，以确保项目中的代码一致性。

如果存在格式问题，`deno fmt --check` 会列出需要格式化的文件。如果所有文件都已正确格式化，它将简单地退出而不输出任何内容。

### 在 CI 中集成

您可以将 `deno fmt --check` 添加到 CI 管道中，以自动检查格式问题。例如，在 GitHub Actions 工作流中：

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

这确保任何代码更改在合并之前都符合项目的格式化标准。

### 在 VS Code 中集成

要在 VS Code 中启用 Deno 作为格式化器，您需要将其设置为默认格式化工具，然后在项目根目录添加 `.vscode/settings.json` 文件，内容如下：

```json
{
  "deno.enablePaths": ["./deno.json"]
}
```

如果您的 `deno.json(c)` 文件位于项目的子目录，请提供相应的相对路径。

### 可用选项

#### `bracePosition`

定义代码块中大括号的位置

- **默认值：** `sameLine`
- **可选值：** `maintain`，`sameLine`，`nextLine`，`sameLineUnlessHanging`

#### `jsx.bracketPosition`

定义 JSX 中括号的位置

- **默认值：** `nextLine`
- **可选值：** `maintain`，`sameLine`，`nextLine`

#### `jsx.forceNewLinesSurroundingContent`

强制在 JSX 元素内容周围使用换行符

- **默认值：** `false`
- **可选值：** `true`，`false`

#### `jsx.multiLineParens`

当 JSX 元素或片段跨多行时，是否用括号包围最外层元素或片段

- **默认值：** `prefer`
- **可选值：** `never`，`prefer`，`always`

#### `indentWidth`

定义缩进宽度

- **默认值：** `2`
- **可选值：** 数字

#### `lineWidth`

定义最大行宽度

- **默认值：** `80`
- **可选值：** 数字

#### `newLineKind`

使用的换行符类型

- **默认值：** `lf`
- **可选值：** `auto`，`crlf`，`lf`，`system`

#### `nextControlFlowPosition`

定义后续控制流语句的位置

- **默认值：** `sameLine`
- **可选值：** `sameLine`，`nextLine`，`maintain`

#### `semiColons`

是否偏好使用分号

- **默认值：** `true`
- **可选值：** `true`，`false`

#### `operatorPosition`

多行表达式中运算符的位置

- **默认值：** `sameLine`
- **可选值：** `sameLine`，`nextLine`，`maintain`

#### `proseWrap`

定义如何换行文本内容

- **默认值：** `always`
- **可选值：** `always`，`never`，`preserve`

#### `quoteProps`

控制对象属性的引号使用

- **默认值：** `asNeeded`
- **可选值：** `asNeeded`，`consistent`，`preserve`

#### `singleBodyPosition`

单语句代码块中主体的位置

- **默认值：** `sameLineUnlessHanging`
- **可选值：** `sameLine`，`nextLine`，`maintain`，`sameLineUnlessHanging`

#### `singleQuote`

是否使用单引号

- **默认值：** `false`
- **可选值：** `true`，`false`

#### `spaceAround`

控制包围表达式的空格

- **默认值：** `false`
- **可选值：** `true`，`false`

#### `spaceSurroundingProperties`

控制单行对象属性周围的空白

- **默认值：** `true`
- **可选值：** `true`，`false`

#### `trailingCommas`

控制多行数组/对象中的尾随逗号

- **默认值：** `always`
- **可选值：** `always`，`never`

#### `typeLiteral.separatorKind`

定义类型字面量的分隔符类型

- **默认值：** `semiColon`
- **可选值：** `comma`，`semiColon`

#### `unstable-component`

启用格式化 Svelte、Vue、Astro 和 Angular 文件

#### `unstable-sql`

启用格式化 SQL 文件

#### `useTabs`

使用制表符代替空格进行缩进

- **默认值：** `false`
- **可选值：** `true`，`false`

#### `useBraces`

是否为 if 语句、for 语句和 while 语句使用大括号

- **默认值：** `whenNotSingleLine`
- **可选值：** `maintain`，`whenNotSingleLine`，`always`，`preferNone`

### 配置

格式化器可以在 [`deno.json`](/runtime/fundamentals/configuration/#formatting) 文件中进行配置。您可以指定自定义设置，以根据您的需求调整格式化过程。

## Deno 对其他 linter 和格式化工具的支持

### ESLint

要在您的 Deno 项目中使用 VSCode 的 ESLint 扩展，您的项目目录需要有一个 `node_modules` 文件夹，供 VSCode 扩展识别。

在您的 `deno.json` 中确保创建 `node_modules` 文件夹，以便编辑器能解析包：

```jsonc
{
  "nodeModulesDir": "auto"
}
```

（可选）运行 ESLint 命令下载它：

```sh
deno run -A npm:eslint --version
# 或者
deno run -A npm:eslint --init
```

创建一个 `eslint.config.js`：

```js
// eslint.config.js
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import"; // 示例插件

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: { globals: { Deno: "readonly" } },
    plugins: { import: importPlugin },
    rules: {
      // 例如 "import/order": "warn"
    },
  },
];
```

运行 ESLint：

```sh
deno run -A npm:eslint .
```

您也可以在 `deno.json` 中添加任务来运行 ESLint：

```json
{
  "tasks": { "eslint": "eslint . --ext .ts,.js" }
}
```

然后通过以下命令运行：

```sh
deno task eslint
```

### Prettier

要在您的 Deno 项目中使用 Prettier，您的项目目录需要有一个 `node_modules` 文件夹，供 VSCode 扩展识别。

然后安装 VSCode 的 Prettier 扩展，并将其配置为您的默认格式化工具：

在 VSCode 中：

1. 打开命令面板（使用 <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>）
2. 选择 **使用其他格式化工具格式化文档...**
3. 选择 **配置默认格式化程序...**
4. 选择 **Prettier - Code formatter**