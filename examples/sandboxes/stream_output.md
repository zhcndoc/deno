---
title: "将输出流传输到本地文件"
description: "了解如何在沙箱中将输出流传输到本地文件。"
url: /examples/sandboxes_stream_output/
layout: sandbox-example.tsx
---

您可以在沙箱中将输出流传输到本地文件。

`child.stdout` 是一个 Web `ReadableStream`。

在 Node 环境中，将 Node 的 `fs.WriteStream` 转换为 Web 的 `WritableStream` 以实现高效的管道传输。

```ts
import { Sandbox } from "@deno/sandbox";
import fs from "node:fs";
import { Writable } from "node:stream";

await using sandbox = await Sandbox.create();

// 在沙箱中创建一个大文件
await sandbox.writeTextFile("big.txt", "#".repeat(5_000_000));

// 将其流式传输到本地文件
const child = await sandbox.spawn("cat", {
  args: ["big.txt"],
  stdout: "piped",
});
const file = fs.createWriteStream("./big-local-copy.txt");
await child.stdout.pipeTo(Writable.toWeb(file));

const status = await child.status;
console.log("完成:", status);
```