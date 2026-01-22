---
title: "在沙箱中提供一个 VSCode 实例"
description: "了解如何在沙箱中提供一个 VSCode 实例。"
url: /examples/sandbox_vscode_instance/
layout: sandbox-example.tsx
---

`sandbox.exposeVscode()` 方法可以用来在沙箱中提供一个 VSCode 实例。

本示例展示了如何在沙箱中启动一个 VSCode 实例，并打印正在运行实例的 URL，您可以在浏览器中打开该链接。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 启动一个 VSCode 实例
const vscode = await sandbox.exposeVscode();

console.log(vscode.url); // 打印正在运行实例的 URL
await vscode.status; // 等待直到它退出
```