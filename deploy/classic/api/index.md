---
title: "API 参考"
sidebar_title: "概述"
pagination_next: /deploy/api/runtime-broadcast-channel
oldUrl:
  - /deploy/docs/runtime-api/
  - /deploy/manual/runtime-api/
  - /deploy/api/runtime-api/
---

:::info 旧版本文档

您正在查看 Deno Deploy Classic 的旧版本文档。我们建议您迁移至新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

这是 Deno Deploy Classic 上可用的运行时 API 参考。此 API 与标准
[runtime API](/runtime/manual/runtime) 非常相似，但由于 Deno Deploy Classic 是无服务器环境，
某些 API 并不以相同的方式提供。

请使用文档的这一部分来探索 Deno Deploy 上可用的 API。

### Web APIs

- [`console`](https://developer.mozilla.org/zh-CN/docs/Web/API/console)
- [`atob`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/atob)
- [`btoa`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/btoa)
- [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
  - `fetch`
  - `Request`
  - `Response`
  - `URL`
  - `File`
  - `Blob`
- [TextEncoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoder)
- [TextDecoder](https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoder)
- [TextEncoderStream](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoderStream)
- [TextDecoderStream](https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoderStream)
- [Performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
- [Web Crypto API](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto)
  - `randomUUID()`
  - `getRandomValues()`
  - [SubtleCrypto](https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto)
- [WebSocket API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [Timers](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
  (`setTimeout`, `clearTimeout`, 和 `setInterval`)
- [Streams API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API)
  - `ReadableStream`
  - `WritableStream`
  - `TransformStream`
- [URLPattern API](https://developer.mozilla.org/zh-CN/docs/Web/API/URLPattern)
- [Import Maps](https://docs.deno.com/runtime/manual/basics/import_maps/)
  - 注意：`import maps` 目前仅可以通过
    [deployctl](https://github.com/denoland/deployctl) 或
    [deployctl GitHub Action](https://github.com/denoland/deployctl/blob/main/action/README.md)
    工作流使用。

### Deno APIs

> 注意：仅提供 Deno 的稳定 API 在 Deploy 中。

- [`Deno.env`](https://docs.deno.com/api/deno/~/Deno.env) - 与
  环境变量（机密）进行交互。
  - `get(key: string): string | undefined` - 获取环境变量的值。
  - `toObject(): { [key: string]: string }` - 将所有环境变量作为对象获取。
- [`Deno.connect`](https://docs.deno.com/api/deno/~/Deno.connect) - 连接到
  TCP 套接字。
- [`Deno.connectTls`](https://docs.deno.com/api/deno/~/Deno.connectTls) -
  使用 TLS 连接到 TCP 套接字。
- [`Deno.startTls`](https://docs.deno.com/api/deno/~/Deno.startTls) - 从现有的 TCP 连接开始 TLS
  握手。
- [`Deno.resolveDns`](https://docs.deno.com/api/deno/~/Deno.resolveDns) - 进行
  DNS 查询。
- 文件系统 API
  - [`Deno.cwd`](https://docs.deno.com/api/deno/~/Deno.cwd) - 获取当前
    工作目录。
  - [`Deno.readDir`](https://docs.deno.com/api/deno/~/Deno.readDir) - 获取
    目录列表。
  - [`Deno.readFile`](https://docs.deno.com/api/deno/~/Deno.readFile) - 读取一个
    文件到内存中。
  - [`Deno.readTextFile`](https://docs.deno.com/api/deno/~/Deno.readTextFile) -
    读取一个文本文件到内存中。
  - [`Deno.open`](https://docs.deno.com/api/deno/~/Deno.open) - 打开一个文件以
    进行流式读取。
  - [`Deno.stat`](https://docs.deno.com/api/deno/~/Deno.stat) - 获取文件系统
    条目信息。
  - [`Deno.lstat`](https://docs.deno.com/api/deno/~/Deno.lstat) - 不跟随符号链接，
    获取文件系统条目信息。
  - [`Deno.realPath`](https://docs.deno.com/api/deno/~/Deno.realPath) - 在解析符号链接后获取
    文件的真实路径。
  - [`Deno.readLink`](https://docs.deno.com/api/deno/~/Deno.readLink) - 获取给定符号链接的
    目标路径。

## 未来支持

在未来，这些 API 也将被添加：

- [Cache API](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)
- UDP API：
  - `Deno.connectDatagram` 用于出站的 UDP 套接字。
- 使用 `Deno.createHttpClient` 来定制 `fetch` 选项。

## 限制

与 Deno CLI 一样，我们不按 ECMA Script 附录 B 中的规定实现 `__proto__` 对象字段。