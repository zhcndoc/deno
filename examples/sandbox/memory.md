---
title: "配置沙箱内存"
description: "了解如何配置分配给沙箱的内存"
url: /examples/sandbox_memory/
layout: sandbox-example.tsx
---

您可以使用 `memoryMb` 选项自定义分配给沙箱的内存量。这允许您为内存密集型工作负载分配更多资源，或为较轻的任务减少内存。

```ts
import { Sandbox } from "@deno/sandbox";

// 创建一个具有 1GB 内存的沙箱
await using sandbox = await Sandbox.create({ memoryMb: 1024 });
```

```ts
import { Sandbox } from "@deno/sandbox";

// 为内存密集型工作负载创建一个具有 4GB 内存的沙箱
await using sandbox = await Sandbox.create({ memoryMb: 4096 });

// 检查可用内存
const memInfo = await sandbox.deno.eval<{ total: number }>(
  "Deno.systemMemoryInfo()",
);
console.log("总内存:", memInfo.total);
```

内存限制（未来可能会变）：

- 最小：768MB
- 最大：4096MB

由于系统开销，沙箱内实际可用的内存可能会略低于配置值。

> 想要分配更多内存？请联系
> <a href="mailto:deploy@deno.com">deploy@deno.com</a>。