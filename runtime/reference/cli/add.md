---
title: "deno add"
command: add
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno add"
description: "使用 Deno 添加和管理项目依赖"
---

`deno add` 命令将依赖项添加到项目的配置文件中。
它是 [`deno install [PACKAGES]`](/runtime/reference/cli/install/#deno-install-packages) 的别名。

## 示例

从 JSR 和 npm 添加包：

```sh
deno add @std/path npm:express
```

默认情况下，依赖项以插入符号 (`^`) 版本范围添加。使用
`--save-exact` 锁定到确切版本：

```sh
deno add --save-exact @std/path
```

这会保存没有 `^` 前缀的依赖项（例如，`1.0.0` 而不是 `^1.0.0`）。

将无前缀的包名视为 npm 包：

```sh
deno add --npm express
```

## 依赖项存储位置

如果你的项目中有 `package.json`，npm 包将被添加到
`package.json` 中的 `dependencies`。否则，所有包将被添加到
`deno.json` 的 `imports` 字段中。
