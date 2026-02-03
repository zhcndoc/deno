---
title: "评估 JavaScript"
description: "了解如何在沙箱中评估 JavaScript 代码。"
url: /examples/sandbox_evaluating_javascript/
layout: sandbox-example.tsx
---

你可以使用 `eval` 函数在沙箱中评估 JavaScript 代码。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

const result = await sandbox.deno.eval(`
  const a = 1;
  const b = 2;
  a + b;
`);
console.log("result:", result);
```

调用 `sandbox.deno.eval()` 允许你直接在沙箱的 Deno 运行时中运行任意 JavaScript 代码片段，而无需编写文件或调用外部命令。这在你想快速原型化逻辑、运行小型计算或检查沙箱环境时非常有用。适用于动态脚本或探索性调试，当创建完整模块显得过于繁琐时。