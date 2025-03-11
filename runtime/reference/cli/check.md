---
title: "deno check"
oldUrl: /runtime/manual/tools/check/
command: check
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno check"
description: "Download and type-check code without execution"
---

## 示例

进行类型检查而不执行。

```ts title="example.ts"
const x: string = 1 + 1n;
```

```bash
deno check example.ts
```