---
last_modified: 2026-06-25
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

`deno remove` 会查看
[`deno.json`](/runtime/fundamentals/configuration/) 和 `package.json`（如果
存在），并从它所在的文件中移除匹配的依赖项。

移除依赖不会将其从全局缓存中删除。若要回收磁盘
空间，请参见 [`deno clean`](/runtime/reference/cli/clean/)。

## 移除全局可执行文件

传入 `--global`（或 `-g`）来移除全局安装的可执行脚本，与 [`deno uninstall --global`](/runtime/reference/cli/uninstall/) 的作用相同：

```sh
deno remove --global serve
```

全局移除只针对单个可执行文件，因此不能将 `--global`
与多个名称一起使用。使用 `--root` 来指定自定义安装根目录。
