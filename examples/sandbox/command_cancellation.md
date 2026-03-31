---
title: "命令取消"
description: "了解如何在沙盒中取消命令。"
url: /examples/sandbox_command_cancellation/
layout: sandbox-example.tsx
---

你可以使用 `KillController` 类在沙箱中取消命令。

```ts
import { KillController, Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 启动一个长时间运行的命令
const controller = new KillController();
const cmd = sandbox.sh`sleep 30`.signal(controller.signal);
const promise = cmd.text();

// 2 秒后取消
setTimeout(() => {
  controller.kill(); // 终止进程
}, 2000);

try {
  await promise;
} catch (error) {
  console.log("命令已被取消:", error);
}
```

`KillController` 允许你向任何沙盒命令附加取消信号，这样当命令超时或用户取消操作时，可以中止长时间运行的进程。

在调用 `controller.kill()` 后，等待的调用会被拒绝；你可以捕获该拒绝来进行日志记录、清理或重试。

这种模式使沙盒自动化保持响应性，防止孤立进程无限消耗资源。