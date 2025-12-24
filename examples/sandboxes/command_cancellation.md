---
title: "命令取消"
description: "了解如何在沙箱中取消命令。"
url: /examples/sandboxes_command_cancellation/
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
