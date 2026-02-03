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

使用 `sandbox.fs.upload()` 上传文件或整个目录，允许您在运行命令之前将本地资源带入沙箱环境中。
当您的工作流程依赖于现有的源文件夹、配置文件或测试数据时，这非常有用——上传完成后，沙箱可以编译、测试或处理这些内容，无需远程 Git 访问或手动复制粘贴。