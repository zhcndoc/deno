---
title: "使用 Deno fmt 进行格式化"
url: /examples/deno_fmt/
videoUrl: https://www.youtube.com/watch?v=Ouzso9gQqnc
layout: video.tsx
---

## 视频描述

一个快速的提示和技巧集，关于
[Deno 内置格式化工具 `deno fmt`](/runtime/reference/cli/fmt/)。

大家好，我是来自 Deno 的 Andy，回到 **Deno 工具链系列** 的另一集，在这里我们深入探讨 Deno 的子命令。

今天我们将看看 `deno fmt`，我们的内置格式化工具，它是可定制的、性能优越并且灵活到适应任何工作流。让我们直接开始吧。

### 什么是 `deno fmt`？

`deno fmt` 将格式化以下文件扩展名：

- `.js`
- `.jsx`
- `.ts`
- `.tsx`
- `.json`
- `.jsonc`
- `.md`
- `.markdown`

使用 `deno fmt` 的最简单方法是从命令行运行它：

```sh
deno fmt
```

你甚至可以将字符串或文件输入到它：

```sh
echo ' console.log(    5  );' | deno fmt -
## console.log(5);
```

你还可以使用 `--check` 标志，它将检查你的代码是否被 `deno fmt` 格式化。如果没有格式化，它将返回一个非零的退出代码：

```sh
echo ' console.log(    5  );' | deno fmt --check -
## Not formatted stdin
```

这在 CI 中非常有用，当你想检查代码是否正确格式化时。

### 编辑器集成

`deno fmt` 也可以在你的编辑器中使用，比如 VS Code。可以在编辑器设置中将 `deno fmt` 设置为默认格式化工具，例如在 VS Code 中：

```json title=".vscode/settings.json"
{
  "editor.defaultFormatter": "denoland.vscode-deno",
  "editor.formatOnSave": true
}
```

你也可以设置保存时自动格式化为 true。

### 多种格式化方式

在某些情况下，有多种格式化方式，并且 Deno 允许你决定想要如何格式化。例如，一个对象可以水平或垂直格式化，这取决于你将第一个项放置在哪里。例如：

```typescript
const foo = { bar: "baz", qux: "quux" };

// 或者

const foo = {
  bar: "baz",
  qux: "quux",
};
```

数组也是如此。你可以根据第一个项的位置选择水平或垂直格式化。例如：

```typescript
const foo = ["bar", "baz", "qux"];

// 或者

const foo = [
  "bar",
  "baz",
  "qux",
];
```

### 移除转义引号

`deno fmt` 还可以减少字符串中的转义字符。例如， 如果你有一个包含转义引号的字符串，`deno fmt` 将移除它们：

<!-- deno-fmt-ignore-start -->
```typescript
console.log("hello \"world\"");
```
<!-- deno-fmt-ignore-end -->

将会格式化为：

```typescript
console.log('hello "world"');
```

### 忽略行或文件

如果你想让 `deno fmt` 跳过一行或一个文件怎么办？你可以使用 `//deno-fmt-ignore` 注释来告诉 `deno fmt` 跳过下一行，例如：

```typescript
console.log("This   line    will  be  formatted");

// deno-fmt-ignore
console.log("This   line  will  not be    formatted");
```

要让 `deno fmt` 跳过一个文件，可以在文件顶部使用 `// deno-fmt-ignore-file` 注释来忽略它。或者，你可以在你的 `deno.json` 配置文件的 `fmt` 字段下使用：

```json
{
  "fmt": {
    "exclude": ["main.ts", "*.json"]
  }
}
```

### 格式化 markdown

`deno fmt` 也适用于 markdown 文件。你可以选择如何格式化散文，通过将选项 `"proseWrap"` 设置为 `always`、`never` 或 `preserve`，例如：

```json
{
  "fmt": {
    "proseWrap": "always"
  }
}
```

如果你用两个 `1` 开始编号列表，`deno fmt` 也可以格式化带有编号的列表，例如：

```markdown title="list.md"
1. First
1. Second
1. Third
1. Fourth
1. Fifth
```

格式化工具将自动将列表格式化为所有的 `1`，但当你渲染它时，它会正确显示编号列表！

如果这样做很奇怪，你也可以先写下 `1` 然后写下 `2`，运行 `deno fmt`，这样将会为你正确编号其余的列表。

`deno fmt` 也会格式化你 markdown 中的 JavaScript 和 TypeScript 代码块。它甚至可以在 markdown 中格式化 markdown！

### 格式化选项

让我们看看
[在 `deno fmt` 中可用的所有选项](/runtime/reference/cli/fmt/#formatting-options)。
注意，所有这些选项在 CLI 中都有相应的标志。

```json
{
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 2,
    "semiColons": false,
    "singleQuote": true,
    "proseWrap": "always",
    "exclude": ["**/logs.json"]
  }
}
```

- `--use-tabs`
- `--line-width <line-width>`
- `--indent-width <indent-width>`
- `--no-semicolons`
- `--single-quote`
- `--prose-wrap <prose-wrap>`
- `--ignore=<ignore>`

### `deno fmt` 的性能

`deno fmt` 非常快，尤其是在随后的运行中由于缓存，默认启用缓存。下面是我们对 Deno 标准库进行的第一次运行。让我们再运行一次！系统时间显示第二次运行快了三分之一。如果我们更新文件并再次运行，依然很快，因为 `deno fmt` 只检查更改的文件。让我们将其与 `Prettier`（一款流行的 Node 格式化工具）进行比较，我们将启用缓存标志运行 Prettier。即便是在第二次运行时，`deno fmt` 的速度几乎快了 20 倍！