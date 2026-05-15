---
last_modified: 2026-03-12
title: "deno bundle"
oldUrl: /runtime/manual/cli/bundler/
command: bundle
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bundle"
info: "`deno bundle` 当前是一个实验性子命令，可能会发生变化。"
---

`deno bundle` 会将你的模块及其所有依赖项合并为一个
JavaScript 文件。

## 基本用法

```sh
deno bundle -o output.js main.ts
```

然后可以使用 Deno 或其他 JavaScript 运行时来运行输出文件：

```sh
deno run output.js
```

有关使用 Deno 进行打包策略的更多信息，请参阅
[打包](/runtime/reference/bundling/)指南。
