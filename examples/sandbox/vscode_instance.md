---
title: "在沙箱中提供一个 VSCode 实例"
description: "了解如何在沙箱中提供一个 VSCode 实例。"
url: /examples/sandbox_vscode_instance/
layout: sandbox-example.tsx
---

运行 `sandbox.exposeVscode()` 会在一个隔离的沙箱环境中启动一个完整的 VS Code 实例，并暴露其 URL，您可以在浏览器中打开它。当您需要一个轻量级、可丢弃的编辑器来进行演示、研讨会或远程调试时，这非常方便：您可以按需提供 VS Code，无需在本地安装任何东西，在受限的工作区内安全地实验代码，并在完成后自动拆除。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 启动一个 VSCode 实例
const vscode = await sandbox.exposeVscode();

console.log(vscode.url); // 打印正在运行实例的 URL
await vscode.status; // 等待直到它退出
```