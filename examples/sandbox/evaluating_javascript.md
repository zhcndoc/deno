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