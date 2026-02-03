---
title: "错误处理"
description: "学习如何在沙箱中处理错误。"
url: /examples/sandbox_error_handling/
layout: sandbox-example.tsx
---

明确处理沙箱命令失败可以为你提供可预测的恢复路径：

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 命令在非零退出时默认抛出错误
try {
  await sandbox.sh`exit 1`;
} catch (error) {
  console.log("命令失败：", error);
}

// 使用 noThrow() 手动处理错误
const result = await sandbox.sh`exit 1`.noThrow();
console.log("退出码：", result.status.code); // → 1
console.log("成功：", result.status.success); // → false
```

Deno 沙箱命令在任何非零退出时都会抛出错误，因此将它们包裹在 try/catch 中，
可以让你显示清晰的错误信息或触发备用逻辑，而不是导致整个工作流崩溃。

当你想在不抛出错误的情况下检查失败时，`.noThrow()` 会返回完整的状态对象，
你可以基于 `status.code` 或 `status.success` 进行分支，记录诊断信息，或重试特定命令而不丢失上下文。
这种模式对于健壮的自动化来说至关重要，因为命令可能因用户输入、临时的网络问题或缺少依赖项而失败。