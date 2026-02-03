---
title: "将输出流传输到本地文件"
description: "了解如何在沙箱中将输出流传输到本地文件。"
url: /examples/sandbox_stream_output/
layout: sandbox-example.tsx
---

您可以在沙箱中将输出流传输到本地文件。这避免了在内存中缓冲整个大型产物。

如果你在沙箱内生成了较大的文件（如下例中的 `big.txt`），你可以通过 `ReadableStream` 分块输出来传输，将 Node 的 `fs.WriteStream` 转换为 Web 的 `WritableStream`，以实现高效传输。

```ts
import { Sandbox } from "@deno/sandbox";
import fs from "node:fs";
import { Writable } from "node:stream";

await using sandbox = await Sandbox.create();

// 在沙箱中创建一个大文件
await sandbox.fs.writeTextFile("big.txt", "#".repeat(5_000_000));

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

这种模式保持内存使用量稳定，适合日志或大型二进制文件，并且允许你在主机上持久化沙箱结果，而无需临时文件或限制标准输出。