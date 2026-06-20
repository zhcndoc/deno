---
last_modified: 2026-06-18
title: "deno bundle"
oldUrl: /runtime/manual/cli/bundler/
command: bundle
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bundle"
info: "`deno bundle` 当前是一个实验性子命令，可能会发生变化。"
---

`deno bundle` 会将你的模块及其所有依赖合并为一个
JavaScript 文件，底层使用 [esbuild](https://esbuild.github.io/)。它
适合将项目作为单个优化后的文件进行部署或分发，
但目前并不打算替代诸如 [Vite](https://vite.dev/) 或
[webpack](https://webpack.js.org/) 之类复杂或交互式的
构建工具。

## 基本用法

```sh
deno bundle -o output.js main.ts
```

如果不使用 `-o`/`--output`，bundle 会写入标准输出。然后可以使用 Deno 或其他 JavaScript 运行时来运行该输出文件：

```sh
deno run output.js
```

## 常用选项

使用 `--platform` 指定目标平台（默认为 `deno`，也可以是 `browser`），使用 `--minify` 缩减输出，并使用 `--sourcemap` 生成源映射：

```sh
deno bundle --platform=browser --minify --sourcemap -o dist/app.js main.ts
```

使用 `--code-splitting` 和输出目录将共享代码拆分为单独的 chunks：

```sh
deno bundle --code-splitting --outdir dist/ main.ts worker.ts
```

使用 `--external` 将依赖项排除在 bundle 之外：

```sh
deno bundle --external npm:sharp -o output.js main.ts
```

## 类型检查

`deno bundle` 默认不会对你的代码进行类型检查。使用 `--check` 标志启用类型检查：

```sh
# bundle 时检查本地模块的类型
deno bundle --check -o output.js main.ts

# 也检查远程模块的类型
deno bundle --check=all -o output.js main.ts
```

你也可以使用 `--no-check` 显式跳过类型检查，而
`--no-check=remote` 仅忽略来自远程模块的诊断信息。

有关在 Deno 中进行打包策略的更多信息，请参阅
[Bundling](/runtime/reference/bundling/) 指南。
