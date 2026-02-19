---
title: "生成子进程，并获取缓冲输出"
description: "学习如何生成子进程，并在沙箱中获取缓冲输出。"
url: /examples/sandboxes_spawn_subprocess/
layout: sandbox-example.tsx
---

你可以在沙箱中生成子进程，并获取缓冲输出，如下所示。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

const cwd = await sandbox.sh`pwd`;
```

对于长时间运行的进程或大量输出，可以使用 stdout/stderr 流。
