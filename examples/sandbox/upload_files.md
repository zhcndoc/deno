---
title: "上传文件和目录"
description: "了解如何将文件和目录上传到沙箱。"
url: /examples/sandbox_upload_files/
layout: sandbox-example.tsx
---

使用 `sandbox.fs.upload(localPath, sandboxPath)` 将文件从您的机器复制到沙箱中。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 将单个文件上传到沙箱中的指定路径
await sandbox.fs.upload("./README.md", "./readme-copy.md");

// 将本地目录树上传到沙箱当前目录
await sandbox.fs.upload("./my-project", ".");
```