---
title: "设置和获取环境变量"
description: "了解如何在沙箱中设置和获取环境变量。"
url: /examples/sandboxes_environment_variables/
layout: sandbox-example.tsx
---

你可以使用 `sandbox.env.set()` 方法在沙箱中设置环境变量。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 设置环境变量
await sandbox.env.set("API_KEY", "secret-key-123");
await sandbox.env.set("NODE_ENV", "production");

// 在脚本中使用它们
const apiKey = await sandbox.sh`echo $API_KEY`.text();
console.log("API_KEY:", apiKey.trim());
```