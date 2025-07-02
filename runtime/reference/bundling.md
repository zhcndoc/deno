---
title: "打包"
description: "`deno bundle` 子命令的概述，可用于生成一个单文件应用程序，由多个源文件创建以实现优化执行。"
---

:::caution

这是一个实验性功能，要求 Deno 版本为 `2.4.0` 或更高。

:::

`deno bundle` 命令输出一个包含所有依赖的单个 JavaScript 文件。

`deno bundle` 在底层由 [ESBuild](https://esbuild.github.io/) 驱动。

这个工具适合将项目部署或分发为单个优化后的 JS 文件。

## 支持的功能

- 解析并内联所有依赖
- 支持 JSX/TSX、TypeScript 和现代 JavaScript，包括
  [import 属性](/runtime/fundamentals/modules/#import-attributes) 和 CSS
- 可选的代码压缩（`--minify`）和源映射（`--sourcemap`）
- 代码拆分
- 平台目标（`--platform`，支持 Deno 和浏览器）
- 配置后支持 JSX

## 基本示例

```ts, title="main.ts"
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

打包的文件中可以使用 JSR、npm、http(s) 和本地导入，`deno bundle` 会负责收集所有源码并生成单一输出文件。

## 选项概览

| 标志                      | 说明                                                 |
| ------------------------- | ---------------------------------------------------- |
| `-o`, `--output <file>`   | 输出打包结果到指定文件                               |
| `--minify`                | 对输出进行压缩以用于生产环境                         |
| `--format <format>`       | 输出格式（默认 `esm`）                               |
| `--code-splitting`        | 启用代码拆分                                         |
| `--platform <platform>`   | 打包目标平台，`browser` 或 `deno`（默认：`deno`）   |
| `--sourcemap`             | 包含源映射（`linked`、`inline`、`external`）       |
| `--watch`                 | 监听文件变化自动重建                                 |
| `--inline-imports`        | 内联导入模块（`true` 或 `false`）                   |

---

## 为网页打包 React 页面

以 `app.jsx` 和 `index.html` 文件开始：

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