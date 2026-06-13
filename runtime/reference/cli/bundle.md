---
last_modified: 2026-03-12
title: "deno bundle"
oldUrl: /runtime/manual/cli/bundler/
command: bundle
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bundle"
info: "`deno bundle` 当前是一个实验性子命令，可能会发生变化。"
---

`deno bundle` 将你的模块及其所有依赖项合并为一个单独的
JavaScript 文件，底层使用 [esbuild](https://esbuild.github.io/)。

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

有关使用 Deno 进行打包策略的更多信息，请参阅
[打包](/runtime/reference/bundling/)指南。
