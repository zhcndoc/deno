---
last_modified: 2026-05-28
title: 创建一个 Deno 项目
description: "逐步指南，帮助你创建第一个 Deno 项目。学习如何初始化项目、了解基本文件结构、运行 TypeScript 代码，以及使用 Deno 内置测试运行器执行测试。"
oldUrl: /runtime/manual/getting_started/first_steps/
---

在本指南中，你将创建你的第一个 Deno 项目，运行它，并执行其测试。我们将全程使用 [TypeScript](https://www.typescriptlang.org/)。如果你想改用 JavaScript，请将文件重命名为 `.js` 并移除类型注解。

## 初始化新项目

要初始化一个新的 Deno 项目，请在终端中运行以下命令：

```bash
deno init my_project
```

这将创建一个名为 `my_project` 的新目录，结构如下：

```plaintext
my_project
├── deno.json
├── main_test.ts
└── main.ts
```

[`deno.json`](/runtime/fundamentals/configuration/) 保存你的项目配置。`main.ts` 是一个基于
[`Deno.serve`](/api/deno/~/Deno.serve) 构建的小型 HTTP 服务器，而 `main_test.ts` 则包含它的测试。

## 运行你的项目

进入新的项目目录：

```bash
cd my_project
```

你可以使用以下命令运行该程序：

```bash
$ deno -N main.ts
Listening on http://localhost:8000/
```

该服务器需要网络权限，这里通过 `-N` 授予（`--allow-net` 的简写）。更多内容请参阅[安全性](/runtime/fundamentals/security/)。

在浏览器中打开该 URL 查看响应。

## 运行你的测试

使用 [`deno test`](/runtime/fundamentals/testing/) 运行测试：

```bash
$ deno test
running 2 tests from ./main_test.ts
handler returns hello ... ok (1ms)
handler returns 404 for unknown route ... ok (1ms)

ok | 2 passed | 0 failed (3ms)
```

浏览我们的[示例和教程](/examples/)，获取下一步可以构建什么的灵感。
