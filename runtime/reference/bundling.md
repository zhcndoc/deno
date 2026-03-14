---
title: "打包"
description: "`deno bundle` 子命令的概述，可用于生成一个单文件应用程序，由多个源文件创建以实现优化执行。"
---

:::caution

这是一个实验性功能，要求 Deno 版本为 `2.4.0` 或更高。

:::

`deno bundle` 命令输出一个包含所有依赖的单个 JavaScript 文件。

`deno bundle` 在内部由 [ESBuild](https://esbuild.github.io/) 提供支持。

该工具适用于将项目打包或分发成单个优化的 JS 文件。

## 支持的功能

- 解析并内联所有依赖
- 支持 JSX/TSX、TypeScript 和现代 JavaScript，包括
  [导入属性](/runtime/fundamentals/modules/#import-attributes) 和 CSS
- 支持 HTML 入口点（Deno 2.5 及以上）
- 可选的代码压缩（`--minify`）和源码映射（`--sourcemap`）
- 代码拆分
- 平台目标设置（`--platform`，支持 Deno 和浏览器）
- 配置时支持 JSX

## 基本示例

```ts title="main.ts"
import chalk from "npm:chalk";

console.log(chalk.red("Hello from `deno bundle`!"));
```

```bash
$ deno bundle main.ts > bundle.js

# 或者显式指定输出文件：

$ deno bundle -o bundle.js main.ts
```

以上命令会生成一个包含所有依赖的单一 `bundle.js` 文件，成为一个自包含的应用文件：

```bash
$ deno bundle.js
Hello from `deno bundle`!
```

你可以在打包文件中使用 JSR、npm、http(s) 以及本地导入，
`deno bundle` 会负责收集所有源文件并生成单个输出文件。

## 选项概览

| 标志                     | 描述                                                  |
| ----------------------- | ---------------------------------------------------- |
| `-o`, `--output <file>` | 将打包输出写入文件                                   |
| `--outdir <dir>`        | 将打包输出写入指定目录                               |
| `--minify`              | 进行生产环境代码压缩                                 |
| `--format <format>`     | 输出格式（默认 `esm`）                               |
| `--code-splitting`      | 启用代码拆分                                        |
| `--platform <platform>` | 为 `browser` 或 `deno` 打包（默认: `deno`）         |
| `--sourcemap`           | 包含源码映射（支持 `linked`、`inline`、`external`） |
| `--watch`               | 文件更改时自动重建                                  |
| `--inline-imports`      | 内联导入模块（`true` 或 `false`）                    |

---

## 运行时 API

除了命令行工具外，您还可以使用 `Deno.bundle()` 来以编程方式打包您的 JavaScript 或 TypeScript 文件。这使得您能够将打包过程集成到构建流程和工作流中。

:::note

该 API 从 Deno v2.5 开始提供，属于实验性功能，使用时必须添加 `--unstable-bundle` 标志。

:::

### 基本用法

```ts
const result = await Deno.bundle({
  entrypoints: ["./index.tsx"],
  outputDir: "dist",
  platform: "browser",
  minify: true,
});
console.log(result);
```

### 在内存中处理输出

你也可以选择不将输出写入磁盘，而是在内存中处理打包结果：

```ts
const result = await Deno.bundle({
  entrypoints: ["./index.tsx"],
  output: "dist",
  platform: "browser",
  minify: true,
  write: false,
});

for (const file of result.outputFiles!) {
  console.log(file.text());
}
```

这种方式为将打包过程集成到各种工作流中提供了更大灵活性，比如直接从内存中提供打包文件，或对输出执行额外处理。

---

## 支持 HTML 入口点

从 Deno 2.5 起，`deno bundle` 支持以 HTML 文件作为入口点。之前仅支持 `.js`、`.ts`、`.jsx` 和 `.tsx` 文件作为入口点。

```bash
deno bundle --outdir dist index.html
```

当你使用 HTML 文件作为入口点时，`deno bundle` 会：

1. 查找 HTML 文件中的所有脚本引用
2. 打包这些脚本及其依赖
3. 更新 HTML 文件中的路径指向打包后的脚本文件
4. 打包并注入所有导入的 CSS 文件到 HTML 输出中

### 示例

假设有如下 `index.tsx` 文件：

```tsx title="index.tsx"
import { render } from "npm:preact";
import "./styles.css";

const app = (
  <div>
    <p>Hello World!</p>
  </div>
);

render(app, document.body);
```

以及一个引用该文件的 HTML 文件：

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example</title>
    <script src="./index.tsx" type="module"></script>
  </head>
</html>
```

执行 `deno bundle --outdir dist index.html` 后输出：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example</title>
    <script src="./index-2TFDJWLF.js" type="module" crossorigin></script>
    <link rel="stylesheet" crossorigin href="./index-EWSJYQGA.css">
  </head>
</html>
```

打包输出文件名包含基于内容的哈希，用于缓存破坏和指纹识别。

HTML 入口点在以上命令行工具和运行时 API 中均得到完整支持。

### 何时使用 HTML 打包

- **`deno bundle index.html`** — 非常适合对小型静态应用进行快速打包构建
- **Vite** — 适合需要更复杂生态支持的项目

两种方式在 Deno 上均可无缝使用，您可以根据工作流选择适合的方案。

---

## 为网页打包 React 页面

从 `app.jsx` 和 `index.html` 文件开始：

```jsx
import React from "npm:react";
import { createRoot } from "npm:react-dom/client";

function App() {
  return <h1>Hello, React!</h1>;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="/bundle.js"></script>
  </body>
</html>
```

现在，我们开始打包：

```bash
$ deno bundle --platform=browser app.jsx -o bundle.js
⚠️ deno bundle 是实验性功能，可能会发生变化
Bundled 9 modules in 99ms
  app.bundle.js 874.67KB
```

至此，我们准备好提供页面服务，使用
[`@std/http/file-server` 来自 JSR](https://jsr.io/@std/http/file-server) 进行服务：

```bash
$ deno run -ENR jsr:@std/http/file-server
Listening on http://127.0.0.1:8000
```

在浏览器中访问页面应显示：

![Image of serving bundled React app](./images/bundled_react.png)