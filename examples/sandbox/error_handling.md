---
title: "错误处理"
description: "学习如何在沙箱中处理错误。"
url: /examples/sandbox_error_handling/
layout: sandbox-example.tsx
---

沙箱中的命令在非零退出时默认会抛出错误。你可以使用  
`noThrow()` 方法来手动处理错误。

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
