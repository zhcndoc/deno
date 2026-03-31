---
title: "为沙箱提供 SSH 访问权限"
description: "了解如何为沙箱提供 SSH 访问权限。"
url: /examples/sandbox_ssh_access/
layout: sandbox-example.tsx
---

SSH 访问允许您通过 SSH 协议安全地连接到沙箱环境。`sandbox.create({ ssh: true })` 方法可以用来为沙箱提供 SSH 访问权限。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({ ssh: true });

// 等待 Deploy 配置 SSH 访问信息。
const creds = sandbox.ssh ?? await sandbox.exposeSsh();
if (!creds) {
  throw new Error("未为此沙箱配置 SSH 凭据");
}

const { hostname, username } = creds;
console.log(`ssh ${username}@${hostname}`);

// 通过睡眠保持进程存活，否则脚本退出时沙箱将被销毁。
await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000)); // 10 分钟
```
