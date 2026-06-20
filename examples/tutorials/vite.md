---
last_modified: 2026-06-13
title: "将 Vite 与 Deno 一起使用"
description: "关于使用 Vite 和 Deno 构建前端应用的分步教程。了解如何搭建项目、安装依赖、运行带热模块替换的开发服务器，以及构建用于生产环境的版本。"
url: /examples/vite_tutorial/
---

[Vite](https://vite.dev/) 是一个适用于现代前端项目的快速构建工具和开发服务器。它与 Deno 配合良好：你可以使用标准的 Vite 模板来搭建项目，而 Deno 负责运行开发服务器、管理 npm 依赖并构建生产版本，全部都无需单独安装 Node.js。

## 搭建 Vite 项目

通过 Deno 的 npm 支持使用官方 Vite 项目创建器。在一个空目录中运行它，并按照提示选择一个框架（vanilla、React、Vue、Svelte 等）和一个变体：

```sh
deno run -A npm:create-vite@latest
```

如果要跳过提示，可以直接传入目标目录和模板：

```sh
deno run -A npm:create-vite@latest . --template vanilla-ts
```

这会写入一个 `package.json`、一个 `index.html` 入口点，以及一个 `src`
目录。Deno 会将 `package.json` 中的 `scripts` 读取为任务，因此可以通过 `deno task` 使用 Vite
命令。

## 安装依赖

Vite 及其插件来自 npm。使用 Deno 安装它们，Deno 会将它们写入本地的
`node_modules` 目录：

```sh
deno install
```

```sh
开发依赖：
+ npm:typescript 6.0.3
+ npm:vite 8.0.16
```

## 运行开发服务器

启动 Vite 的开发服务器，它会通过热模块
替换来提供应用服务，因此更改会立即显示在浏览器中：

```sh
deno task dev
```

```sh
  VITE v8.0.16  ready in 120 ms

  ➜  本地:   http://localhost:5173/
```

打开该 URL，并编辑 `src/` 下的文件，即可看到页面更新，而无需完整
刷新。

## 构建用于生产环境的版本

当你准备发布时，构建经过优化的静态包：

```sh
deno task build
```

```sh
vite v8.0.16 building client environment for production...
✓ 9 modules transformed.
dist/index.html                 0.45 kB │ gzip: 0.29 kB
dist/assets/index-CsUDhMuy.css  4.10 kB │ gzip: 1.46 kB
dist/assets/index-B4vdZNPd.js   4.52 kB │ gzip: 2.02 kB
✓ built in 239ms
```

`dist` 目录包含带哈希的、经过压缩的输出，可直接部署到
[Deno Deploy](https://docs.deno.com/deploy/) 或任何静态主机。在发布之前，运行
`deno task preview` 可在本地提供该生产构建版本。
