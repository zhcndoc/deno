---
last_modified: 2026-06-25
title: "deno link"
command: link
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno link"
description: "将本地 JSR 包链接到当前项目以供开发"
---

`deno link` 命令会将你的项目指向 JSR 包的本地副本，这样你就可以使用它来替代已发布版本进行开发。它相当于手动编辑 `deno.json` 中的
[`links`](/runtime/reference/deno_json/#overriding-packages) 数组的命令行版本，并且其工作流程类似于 `npm link` 或 `bun link`。

## 链接包

传入本地包目录的路径：

```sh
deno link ../my-local-pkg
```

目标必须是一个包含 `deno.json` 或带有 `name` 字段的 `package.json` 的目录，这样 Deno 才知道它对应的是哪个包。Deno 会将相对路径追加到最近的 `deno.json` 中的 `links` 数组里（如果该数组不存在则会创建），然后安装依赖。被链接的包可以通过其裸名称导入，就像工作区成员一样，因此不会添加 `imports` 条目。

再次链接相同路径不会产生额外影响。你可以在一条命令中链接多个包：

```sh
deno link ../pkg-a ../pkg-b
```

## 移除链接

使用 [`deno unlink`](/runtime/reference/cli/unlink/) 来停止使用本地
副本：

```sh
deno unlink ../my-local-pkg
```
