---
last_modified: 2026-05-20
title: "处理操作系统信号"
description: "关于在 Deno 中处理操作系统信号的教程。学习如何捕获 SIGINT 和 SIGBREAK 事件、管理信号监听器，以及在应用程序中实现优雅关闭处理程序。"
url: /examples/os_signals_tutorial/
oldUrl:
  - /runtime/manual/examples/os_signals/
  - /runtime/tutorials/os_signals/
---

> ⚠️ Windows 支持监听 `SIGINT`、`SIGBREAK`、`SIGTERM`、`SIGQUIT`、
> `SIGHUP` 和 `SIGWINCH`（除 `SIGINT`/`SIGBREAK` 外，其余都通过 libuv 的
> Windows 信号仿真机制）。

## 概念

- [Deno.addSignalListener()](https://docs.deno.com/api/deno/~/Deno.addSignalListener)
  可用于捕获和监视操作系统信号。
- [Deno.removeSignalListener()](https://docs.deno.com/api/deno/~/Deno.removeSignalListener)
  可用于停止监听信号。

## 设置操作系统信号监听器

处理操作系统信号的 API 是基于已经熟悉的
[`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
和
[`removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
API 模型化的。

> ⚠️ 请注意，监听操作系统信号并不会阻止事件循环完成，即如果没有其他挂起的异步操作，进程将退出。

你可以使用 `Deno.addSignalListener()` 函数来处理操作系统信号：

```ts title="add_signal_listener.ts"
console.log("按 Ctrl-C 触发 SIGINT 信号");

Deno.addSignalListener("SIGINT", () => {
  console.log("被中断！");
  Deno.exit();
});

// 添加一个超时以防止进程立即退出。
setTimeout(() => {}, 5000);
```

运行命令：

```shell
deno run add_signal_listener.ts
```

你可以使用 `Deno.removeSignalListener()` 函数注销之前添加的信号处理程序。

```ts title="signal_listeners.ts"
console.log("按 Ctrl-C 触发 SIGINT 信号");

const sigIntHandler = () => {
  console.log("被中断！");
  Deno.exit();
};
Deno.addSignalListener("SIGINT", sigIntHandler);

// 添加一个超时以防止进程立即退出。
setTimeout(() => {}, 5000);

// 在 1 秒后停止监听信号。
setTimeout(() => {
  Deno.removeSignalListener("SIGINT", sigIntHandler);
}, 1000);
```

运行命令：

```shell
deno run signal_listeners.ts
```

## Windows 支持

受支持的信号集合因平台而异。Windows 上的特定行为如下：

| Use case                         | Supported signals on Windows                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Deno.addSignalListener(sig, …)` | `SIGINT`, `SIGBREAK`, `SIGTERM`, `SIGQUIT`, `SIGHUP`, `SIGWINCH`                                                                   |
| `Deno.kill(pid, sig)`            | `SIGINT`, `SIGBREAK`, `SIGTERM`, `SIGQUIT`, `SIGHUP`, `SIGWINCH`, `SIGKILL`, `SIGABRT`, plus signal `0` for a process-health check |

`SIGKILL` 和 `SIGABRT` 故意**不能**通过 `addSignalListener` 注册——它们是不可捕获/致命的，这与 Unix 语义一致。在 Windows 上，可捕获的信号都会转发到 libuv 的仿真层；通过 `Deno.kill` 发送的信号最终会调用 `TerminateProcess`。
