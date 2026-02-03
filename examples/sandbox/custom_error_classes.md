---
title: "使用自定义错误类进行错误处理"
description: "学习如何在沙盒中使用自定义错误类处理错误。"
url: /examples/sandboxes_custom_error_classes/
layout: sandbox-example.tsx
---

你可以在沙盒中使用自定义错误类来处理错误。

Catching `SandboxCommandError` lets you differentiate sandbox command failures
from other exceptions. When the error is the `SandboxCommandError` class, you
can read structured fields such as `error.code` or format `error.message` to
decide whether to retry, escalate, or map exit codes to your own domain-specific
errors:

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

This makes it easier to build higher-level automation that reacts intelligently
to known failure modes instead of treating every thrown error the same.
