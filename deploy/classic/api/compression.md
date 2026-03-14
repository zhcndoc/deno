---
title: "压缩响应体"
oldUrl:
  - /deploy/docs/compression/
  - /deploy/api/compression/
---

:::info Legacy Documentation

您正在查看 Deno Deploy Classic 的旧版文档。我们建议迁移到新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

压缩响应体以节省带宽是一种常见做法。为了减轻您的负担，我们将此功能直接构建到 Deploy 中。

Deno Deploy Classic 支持 brotli 和 gzip 压缩。当满足以下条件时，将应用压缩。

1. 对您的部署的请求具有 [`Accept-Encoding`][accept-encoding] 头，设置为 `br` (brotli) 或 `gzip`。
2. 您的部署的响应包含 [`Content-Type`][content-type] 头。
3. 提供的内容类型是可压缩的；我们使用 [这个数据库](https://github.com/jshttp/mime-db/blob/master/db.json) 来确定该内容类型是否可压缩。
4. 响应体大小大于 20 字节。

当 Deploy 压缩响应体时，它将根据所使用的压缩算法将 `Content-Encoding: gzip` 或 `Content-Encoding: br` 头设置到响应中。

### 何时跳过压缩？

Deno Deploy Classic 在以下情况下跳过压缩：


- 响应具有 [`Content-Encoding`][content-encoding] 头。
- 响应具有 [`Content-Range`][content-range] 头。
- 响应的 [`Cache-Control`][cache-control] 头具有 [`no-transform`][no-transform] 值（例如，`cache-control: public, no-transform`）。

### 我的 `Etag` 头会发生什么？

当您设置响应的 Etag 头时，如果我们对您的响应体应用了压缩，我们会将头的值转换为弱 Etag。如果它已经是弱 Etag，我们不会修改该头。

[accept-encoding]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Encoding  
[cache-control]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control  
[content-encoding]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Encoding  
[content-type]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type  
[no-transform]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control#other  
[content-range]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Range