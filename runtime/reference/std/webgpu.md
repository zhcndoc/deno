---
title: "@std/webgpu"
description: "用于 Web GPU API 的实用工具"
jsr: jsr:@std/webgpu
pkg: webgpu
version: 0.224.9
generated: true
stability: unstable
---

<!-- 自动生成自 JSR 文档。请勿直接编辑。 -->

:::info 不稳定

此 @std 包是实验性的，其 API 可能会在不进行主版本更新的情况下发生变化。

:::

## 概述

<p>用于与
<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" rel="nofollow">WebGPU API</a>交互的实用工具。</p>

```js
import { createTextureWithData } from "@std/webgpu";

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice()!;

createTextureWithData(device, {
  format: "bgra8unorm-srgb",
  size: {
    width: 3,
    height: 2,
  },
  usage: GPUTextureUsage.COPY_SRC,
}, new Uint8Array([1, 1, 1, 1, 1, 1, 1]));
```

### 将其添加到您的项目

```sh
deno add jsr:@std/webgpu
```

<a href="https://jsr.io/@std/webgpu/doc" class="docs-cta jsr-cta">查看 @std/webgpu 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 什么是 WebGPU API？

WebGPU 是一个现代图形 API，为网页应用提供高性能的 3D 图形和计算能力。它设计为 WebGL 的继任者，提供更底层的 GPU 硬件访问和针对复杂图形与计算任务的性能提升。

## 为什么使用 @std/webgpu？

用于常见的 WebGPU 模式和实用工具，以简化配置和资源管理：

- 适配器 / 设备请求一次并重用；提前协商功能和限制可以避免运行时失败。
- 设置纹理的 `usage` 位，匹配所有预期的操作（COPY_SRC、COPY_DST、TEXTURE_BINDING、RENDER_ATTACHMENT）。
- 小规模上传时优先使用 `device.queue.writeBuffer`/`writeTexture`；大规模传输时使用过渡缓冲区。

## 示例

### 写入缓冲区

```ts
const buf = device.createBuffer({
  size: 16,
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});
device.queue.writeBuffer(buf, 0, new Uint32Array([1, 2, 3, 4]));
```

### 描述纹理格式

```ts
import { describeTextureFormat } from "@std/webgpu";

const info = describeTextureFormat("rgba8unorm");
console.log(info.sampleType); // 例如 "float"
console.log(info.allowedUsages.includes(GPUTextureUsage.RENDER_ATTACHMENT));
console.log(info.blockSize, info.blockDimensions); // 每个块的字节数和块大小
```

### 将纹理复制到缓冲区（含填充）

```ts
import {
  describeTextureFormat,
  getRowPadding,
  resliceBufferWithPadding,
} from "@std/webgpu";

const format: GPUTextureFormat = "rgba8unorm";
const size = { width: 320, height: 200 };
const tex = device.createTexture({
  format,
  size,
  usage: GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
});

// 计算满足缓冲区拷贝对齐要求的 bytesPerRow
const { blockSize, blockDimensions } = describeTextureFormat(format);
const bytesPerPixel = blockSize /
  (blockDimensions.width * blockDimensions.height);
const { padded: bytesPerRow } = getRowPadding(size.width * bytesPerPixel);
const bufferSize = bytesPerRow * size.height;

const out = device.createBuffer({
  size: bufferSize,
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
});

const encoder = device.createCommandEncoder();
encoder.copyTextureToBuffer(
  { texture: tex },
  { buffer: out, bytesPerRow, rowsPerImage: size.height },
  size,
);
device.queue.submit([encoder.finish()]);

await out.mapAsync(GPUMapMode.READ);
const padded = out.getMappedRange();
const pixels = resliceBufferWithPadding(
  new Uint8Array(padded),
  bytesPerRow,
  size,
);
// `pixels` 是紧凑排列的 RGBA 行，适合编码和保存
```

### 将渲染目标捕获到缓冲区

```ts
import { createCapture } from "@std/webgpu";

const { texture, outputBuffer } = createCapture(device, {
  size: { width: 256, height: 256 },
  format: "rgba8unorm",
});

// 将颜色附件绘制到 `texture`，然后内部复制到 `outputBuffer`
// 后续映射缓冲区读取像素数据
await outputBuffer.mapAsync(GPUMapMode.READ);
const data = new Uint8Array(outputBuffer.getMappedRange());
// 使用 `data`...
```

## 小贴士

- 使用 `if (!navigator.gpu) { ... }` 检查是否支持 WebGPU。
- 适配器 / 设备请求一次并重用；提前协商功能和限制可以避免运行时失败。
- 设置纹理的 `usage` 位，匹配所有预期的操作（COPY_SRC、COPY_DST、TEXTURE_BINDING、RENDER_ATTACHMENT）。

<!-- custom:end -->