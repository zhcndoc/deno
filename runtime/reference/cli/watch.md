---
last_modified: 2026-06-25
title: "deno watch"
command: watch
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno watch"
description: "在带有热模块替换的监视模式下运行程序"
---

`deno watch` 命令会运行一个程序，并在其源文件发生更改时重新加载它。它是
[`deno run --watch-hmr`](/runtime/reference/cli/run/) 的简写：程序会启用热
模块替换运行，因此当发生更改时，Deno 会尽可能就地替换更新后的模块，而不是
完全重启。

## 用法

```sh
deno watch main.ts
```

这相当于：

```sh
deno run --watch-hmr main.ts
```

由于 `deno watch` 会复用 `deno run`，因此所有 `deno run` 标志都可用，包括
watch 选项：

- `--watch-hmr=<paths>` 会添加额外要监视的路径。
- `--watch-exclude=<paths>` 会排除触发重新加载的路径。
- `--no-clear-screen` 会保留之前的输出，而不是在每次重新加载时清屏。

```sh
deno watch --watch-exclude=dist/ -RN main.ts
```
