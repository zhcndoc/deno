---
title: "访问字符串和二进制输出"
description: "了解如何访问沙箱中命令的字符串和二进制输出。"
url: /examples/sandbox_access_output/
layout: sandbox-example.tsx
---

你可以访问沙箱中命令的字符串和二进制输出。此示例展示了如何捕获命令输出，无论你的工作流程需要哪种形式：

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

通过管道传输 stdout，你可以从同一个命令获取原始的二进制缓冲区和解码后的文本视图，因此可以处理混合二进制和文本数据的文件，而不必重新运行命令。

一旦获得二进制结果，你可以将其直接传递给诸如 `fs.writeFileSync` 之类的 API，以保存沙箱内生成的文件，使数据在沙箱和主机环境之间的传输变得轻松。

当沙箱命令生成你需要以编程方式处理的文件（如图像、归档等），而不仅仅是在控制台打印时，这非常有用。