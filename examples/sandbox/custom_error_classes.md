---
title: "使用自定义错误类进行错误处理"
description: "学习如何在沙盒中使用自定义错误类处理错误。"
url: /examples/sandboxes_custom_error_classes/
layout: sandbox-example.tsx
---

你可以在沙盒中使用自定义错误类来处理错误。

```ts
import { Sandbox, SandboxCommandError } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

try {
  await sandbox.sh`exit 42`;
} catch (error) {
  if (error instanceof SandboxCommandError) {
    console.log("退出代码:", error.code); // → 42
    console.log("错误信息:", error.message);
  }
}
```
