---
title: "访问字符串和二进制输出"
description: "了解如何访问沙箱中命令的字符串和二进制输出。"
url: /examples/sandbox_access_output/
layout: sandbox-example.tsx
---

你可以访问沙箱中命令的字符串和二进制输出。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 获取字符串和二进制数据
const result = await sandbox.sh`cat binary-file.png`
  .stdout("piped");
console.log("二进制长度:", result.stdout!.length);
console.log("文本长度:", result.stdoutText!.length);

// 使用二进制数据
import fs from "node:fs";
fs.writeFileSync("output.png", result.stdout!);
```
