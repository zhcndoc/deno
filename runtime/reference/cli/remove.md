---
title: "deno remove"
command: remove
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno remove"
description: "从你的项目中移除一个依赖"
---

`deno remove` 会从你的项目配置文件中移除依赖。它与 [`deno add`](/runtime/reference/cli/add/) 相反。

## 基本用法

移除一个包：

```sh
deno remove @std/path
```

一次移除多个包：

```sh
deno remove @std/path @std/assert npm:express
```

## 从哪里移除依赖

`deno remove` 会同时查看
[`deno.json`](/runtime/fundamentals/configuration/) 和 `package.json`（如果
存在），并从找到匹配依赖的那个文件中将其移除。
