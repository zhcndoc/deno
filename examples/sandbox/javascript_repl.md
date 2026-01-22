---
title: "交互式 JavaScript REPL"
description: "学习如何在沙箱中提供交互式的 Deno REPL。"
url: /examples/sandbox_javascript_repl/
layout: sandbox-example.tsx
---

`sandbox.deno.repl()` 方法可以用于在沙箱中提供交互式的 Deno REPL。

此示例展示了如何在沙箱中启动一个 Deno REPL 并交互式地执行代码。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 启动一个 Deno REPL
const repl = await sandbox.deno.repl();

// 交互式执行代码，保持状态
await repl.eval("const x = 42;");
await repl.eval("const y = 8;");
const result = await repl.eval("x + y");
console.log("result:", result); // 50
```