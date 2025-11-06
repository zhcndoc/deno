---
title: "@std/io"
description: "使用 Reader 和 Writer 接口进行高级 I/O 操作的实用工具。"
jsr: jsr:@std/io
pkg: io
version: 0.225.2
generated: true
stability: unstable
---

<!-- 自动生成自 JSR 文档。请勿直接编辑。 -->

:::info 不稳定

此 @std 包是实验性的，其 API 可能在未做大版本升级的情况下发生变化。

:::

## 概览

<p>用于处理 Deno 的读取器、写入器和网络流的工具。</p>
<p><code>Reader</code> 和 <code>Writer</code> 接口在 Deno 中已被废弃，因此许多此类工具函数也已被废弃。建议改用网络流。</p>

```js
import { toReadableStream, toWritableStream } from "@std/io";

await toReadableStream(Deno.stdin)
  .pipeTo(toWritableStream(Deno.stdout));
```

### 添加到您的项目

```sh
deno add jsr:@std/io
```

<a href="https://jsr.io/@std/io/doc" class="docs-cta jsr-cta">查看
@std/io 中所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 小贴士

- 新代码优先使用 Web Streams。`Reader`/`Writer` 助手主要为兼容性存在，正在逐步淘汰。
- 使用 `toReadableStream`/`toWritableStream` 在不进行全部缓冲的情况下将 Deno 传统 IO 适配为流。
- 流天然支持背压；管道操作时避免手动读取循环。
- 对文本转换，可以结合使用 `TextDecoderStream`/`TextEncoderStream`。

## 示例

```ts
import { toReadableStream, toWritableStream } from "@std/io";

await toReadableStream(Deno.stdin)
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(
    new TransformStream({
      transform(chunk, ctl) {
        ctl.enqueue(chunk.toUpperCase());
      },
    }),
  )
  .pipeThrough(new TextEncoderStream())
  .pipeTo(toWritableStream(Deno.stdout));
```

<!-- custom:end -->