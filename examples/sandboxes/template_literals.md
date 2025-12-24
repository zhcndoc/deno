---
title: "带变量插值的模板字面量命令"
description: "学习如何在沙箱中使用带变量插值的模板字面量命令。"
url: /examples/sandboxes_template_literals/
layout: sandbox-example.tsx
---

你可以在沙箱中使用带变量插值的模板字面量命令。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 变量会自动进行转义
const filename = "file with spaces.txt";
const content = "Hello, world!";
await sandbox.sh`echo ${content} > ${filename}`;

// 数组会被展开为多个参数
const files = ["file1.txt", "file2.txt", "file3.txt"];
await sandbox.sh`rm ${files}`;

// 获取 JSON 输出
const data = await sandbox.sh`echo '{"count": 42}'`.json<{ count: number }>();
console.log(data.count); // → 42
```