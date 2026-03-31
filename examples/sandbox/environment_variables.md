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

通过 `sandbox.env.set()` 设置环境变量可以将配置和秘密保持在沙箱内部，因此脚本运行时拥有预期的上下文，而不必在源文件中硬编码值。当你需要每次运行配置（API 密钥、像 NODE_ENV 这样的模式），或者想安全地向多个命令传递凭据时，这非常有用。变量仅在沙箱会话范围内有效，并可供你在该沙箱中执行的任何命令使用。