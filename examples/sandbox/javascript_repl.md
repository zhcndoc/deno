---
title: "交互式 JavaScript REPL"
description: "学习如何在沙箱中提供交互式的 Deno REPL。"
url: /examples/sandbox_javascript_repl/
layout: sandbox-example.tsx
---

REPL（读取-求值-输出循环）是一种交互式执行会话，其中你输入代码，环境读取它，进行求值，打印结果，然后保持会话活跃，以便你可以继续运行更多代码并保持状态。

`sandbox.deno.repl()` 方法可以用于在沙箱中提供交互式的 JavaScript REPL。

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