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

配置 `memoryMb` 选项用于创建沙箱，可以让您根据工作负载调整资源使用。轻量级任务可以在较小的沙箱中运行以节省资源，而数据密集型脚本或编译任务则可以请求高达 4 GB 的内存，以避免内存不足的错误。

由于您可以通过 `Deno.systemMemoryInfo()` 以编程方式检查沙箱的内存，您可以根据测量到的限制来验证内存分配或调整行为。此控制有助于将沙箱容量匹配到您的需求，同时保持性能的可预测性和成本管理。

内存限制（未来可能会变）：

- 最小：768MB
- 最大：4096MB

由于系统开销，沙箱内实际可用的内存可能会略低于配置值。

> 想要分配更多内存？请联系
> <a href="mailto:deploy@deno.com">deploy@deno.com</a>。