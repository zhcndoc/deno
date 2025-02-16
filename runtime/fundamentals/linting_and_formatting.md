---
title: "代码检查和格式化"
---

在理想的世界里，您的代码始终干净、一致，并且没有令人讨厌的错误。这就是 Deno 内置的代码检查和格式化工具的承诺。通过将这些功能直接集成到运行时，Deno 消除了项目中对外部依赖项和复杂配置的需求。这些内置工具快速且高效，不仅节省了时间，还确保每一行代码都遵循最佳实践。

使用 `deno fmt` 和 `deno lint`，您可以专注于编写优秀代码，知道 Deno 会提供支持。这就像有一个警觉的助手，始终保持您的代码库处于最佳状态，让您能集中精力做真正重要的事情：构建惊人的应用程序。

## 代码检查

代码检查是分析您的代码以发现潜在错误、Bug 和样式问题的过程。Deno 的内置代码检查工具 [`deno lint`](/runtime/reference/cli/linter/) 支持来自 [ESLint](https://eslint.org/) 的推荐规则集，以提供对您代码的全面反馈。这包括识别语法错误、强制编码约定和突出可能导致 Bug 的潜在问题。

要运行代码检查器，请在终端中使用以下命令：

```bash
deno lint
```

默认情况下，`deno lint` 会分析当前目录及其子目录中的所有 TypeScript 和 JavaScript 文件。如果您想仅对特定文件或目录进行检查，可以将它们作为命令的参数传递。例如：

```bash
deno lint src/
```

此命令将对 `src/` 目录中的所有文件进行代码检查。

代码检查器可以在 [`deno.json`](/runtime/fundamentals/configuration/) 文件中进行配置。您可以指定自定义规则、插件和设置，以根据您的需求定制代码检查过程。

### linting 规则

您可以在 [规则列表](/lint/) 文档页面查看和搜索可用规则及其用法。

## 格式化

格式化是自动调整代码布局以遵循一致风格的过程。Deno 的内置格式化工具 `deno fmt` 使用强大的 [dprint](https://dprint.dev/) 引擎，确保您的代码始终干净、可读且一致。

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

`deno fmt --check` 命令用于验证您的代码是否根据 Deno 的默认格式化规则进行正确格式化。它不会修改文件，而是检查文件并报告任何格式化问题。特别是在持续集成 (CI) 流水线或预提交钩子中，这对于确保代码一致性特别有用。

如果存在格式化问题，`deno fmt --check` 将列出需要格式化的文件。如果所有文件格式正确，它将简单地退出而没有任何输出。

### 在 CI 中集成

您可以将 `deno fmt --check` 添加到您的 CI 流水线中，以自动检查格式化问题。例如，在 GitHub Actions 工作流中：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno fmt --check
```

这确保任何代码更改在合并之前遵循项目的格式化标准。

### 可用选项

| 规则                | 描述                                                  | 默认值     | 可选值                  |
|---------------------|-------------------------------------------------------|------------|-------------------------|
| indent-width        | 定义缩进宽度                                         | **2**      | 数字                    |
| line-width          | 定义最大行宽                                         | **80**     | 数字                    |
| no-semicolons       | 除非必要，否则不使用分号                             | **false**  | true, false             |
| prose-wrap          | 定义文本如何换行                                    | **always** | always, never, preserve |
| single-quote        | 使用单引号                                          | **false**  | true, false             |
| unstable-component   | 启用格式化 Svelte、Vue、Astro 和 Angular 文件       |            |                         |
| unstable-sql        | 启用格式化 SQL 文件                                 |            |                         |
| use-tabs            | 使用制表符代替空格进行缩进                          | **false**  | true, false             |

格式化器可以在 [`deno.json`](/runtime/fundamentals/configuration/#formatting) 文件中进行配置。您可以指定自定义设置，以根据您的需求定制格式化过程。