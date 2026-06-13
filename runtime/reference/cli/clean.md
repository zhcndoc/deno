---
last_modified: 2025-03-10
title: "deno clean"
command: clean
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno clean"
description: "移除缓存的依赖以便干净地开始"
---

`deno clean` 会移除 Deno 的全局模块缓存目录。有关 Deno
如何缓存依赖的更多信息，请参阅
[模块](/runtime/fundamentals/modules/)。

## 基本用法

```sh
deno clean
```

## 试运行

在不实际删除任何内容的情况下预览将要删除的内容：

```sh
deno clean --dry-run
```

## 保留项目仍需要的内容

使用一个或多个入口点与 `--except` 一起，移除缓存中的所有内容，
但保留这些文件所需的数据：

```sh
deno clean --except main.ts
```

## 何时使用此命令

在以下情况下使用 `deno clean`：

- 解决由损坏或过期的缓存模块引起的问题
- 释放缓存依赖占用的磁盘空间
