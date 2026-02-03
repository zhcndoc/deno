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
const filename = "带空格的文件.txt";
const content = "你好，世界！";
await sandbox.sh`echo ${content} > ${filename}`;

// 数组会被展开为多个参数
const files = ["file1.txt", "file2.txt", "file3.txt"];
await sandbox.sh`rm ${files}`;

// 获取 JSON 输出
const data = await sandbox.sh`echo '{"count": 42}'`.json<{ count: number }>();
console.log(data.count); // → 42
```

插入到模板字面量中的变量会自动进行转义，因此即使是带空格的文件名等复杂值也可以传递，而不必担心引用或注入问题。

数组会自动展开成多个参数，使批量操作（例如删除多个文件）简洁明了，无需手动拼接。你还可以链式调用诸如 `.json()` 的辅助函数，将命令输出直接解析为类型化的数据结构，避免脆弱的字符串解析，并保持结果的强类型。