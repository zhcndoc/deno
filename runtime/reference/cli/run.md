---
last_modified: 2026-06-19
title: "deno run"
oldUrl: /runtime/manual/tools/run/
command: run
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno run"
description: "使用 Deno 运行时运行 JavaScript 或 TypeScript 程序"
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

默认情况下，Deno 会在沙箱中运行程序，无法访问磁盘、网络，也不能生成子进程。这是因为 Deno 运行时具有[默认安全](/runtime/fundamentals/security/)。你可以使用
[`--allow-*` 和 `--deny-*` 标志](/runtime/reference/permissions/)授予或拒绝所需的权限。

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

Deno 的监视器会在控制台通知你文件的变化，并在运行过程中出现错误时警告你。

同样的 `--watch` 标志也适用于
[`deno test`](/runtime/reference/cli/test/),
[`deno serve`](/runtime/reference/cli/serve/)，以及
[`deno bench`](/runtime/reference/cli/bench/)。

:::info Deno 2.8

当监视器重新启动进程时，Deno 会先发送 `SIGTERM`，这样 `unload`
事件监听器和 `process.exit` 钩子就能运行，然后在强制
终止之前等待 500 毫秒。这让优雅关闭代码有时间在重启之间刷新资源。

:::

## 运行 package.json 脚本

可以使用 [`deno task`](/runtime/reference/cli/task/) 命令执行 `package.json` 脚本。

## 从 stdin 运行代码

你可以从 stdin 管道传入代码并立即运行它：

```sh
echo "console.log('hello')" | deno run -
```

## 终止运行

要停止运行命令，使用 `ctrl + c`。