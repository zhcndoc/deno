---
last_modified: 2026-03-12
title: "deno run"
oldUrl: /runtime/manual/tools/run/
command: run
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno run"
description: "使用 Deno 运行时从文件或 URL 运行 JavaScript 或 TypeScript 程序"
---

## 用法

运行本地文件：

```sh
deno run main.ts
```

`run` 子命令是可选的 — 你也可以直接使用 `deno <file>`：

```sh
deno main.ts
```

默认情况下，Deno 在一个沙箱中运行程序，没有访问磁盘、网络或生成子进程的能力。这是因为 Deno 运行时是 
[默认安全](/runtime/fundamentals/security/)。你可以使用
[`--allow-* 和 --deny-* 标志](/runtime/fundamentals/security/#permissions-list) 来授予或拒绝所需的权限。

### 权限示例

授予从磁盘读取和监听网络的权限：

```sh
deno run --allow-read --allow-net server.ts
```

授予从磁盘读取允许列出的文件的权限：

```sh
deno run --allow-read=/etc server.ts
```

授予所有权限 _这不推荐，应该仅用于测试_：

```sh
deno run -A server.ts
```

如果你的项目需要多个安全标志，你应该考虑使用 [`deno task`](/runtime/reference/cli/task/) 来执行它们。

## 监听文件变化

要监视文件变化并自动重启进程，使用 `--watch` 标志。Deno 内置的应用程序监视器会在文件更改时立即重启你的应用程序。

_确保在文件名之前放置标志_，例如：

```sh
deno run --allow-net --watch server.ts
```

Deno 的监视器会在控制台通知你文件的变化，并在工作时如果出现错误会警告你。

## 运行 package.json 脚本

`package.json` 脚本可以使用 [`deno task`](/runtime/reference/cli/task/) 命令执行。

## 从 stdin 运行代码

你可以从 stdin 管道传入代码并立即运行它：

```sh
echo "console.log('hello')" | deno run -
```

## 终止运行

要停止运行命令，使用 `ctrl + c`。