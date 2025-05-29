---
title: "TCP 套接字和 TLS"
oldUrl:
  - /deploy/docs/sockets/
---

Deno Deploy 支持出站 TCP 和 TLS 连接。这些 API 允许您与 Deploy 一起使用如 PostgreSQL、SQLite、MongoDB 等数据库。

需要了解如何服务 TCP 的相关信息？请查阅 [`Deno.serve`](/api/deno/~/Deno.serve) 的文档，其中包括对 [TCP 选项](/api/deno/~/Deno.ServeTcpOptions) 的支持说明。

## `Deno.connect`

建立出站 TCP 连接。

函数定义与
[Deno](https://docs.deno.com/api/deno/~/Deno.connect) 相同，唯一的限制是
`transport` 选项只能为 `tcp`，并且 `hostname` 不能是 localhost 或为空。

```ts
function Deno.connect(options: ConnectOptions): Promise<Conn>
```

### 示例

```js
async function handler(_req) {
  // 与 example.com 建立 TCP 连接
  const connection = await Deno.connect({
    port: 80,
    hostname: "example.com",
  });

  // 发送原始 HTTP GET 请求。
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // 从连接中读取 15 字节。
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // 将字节作为纯文本返回。
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

Deno.serve(handler);
```

## `Deno.connectTls`

建立出站 TLS 连接。

函数定义与 
[Deno](https://docs.deno.com/api/deno/~/Deno.connectTls) 相同，唯一的限制是 `hostname` 不能是 localhost 或为空。

```ts
function Deno.connectTls(options: ConnectTlsOptions): Promise<Conn>
```

### 示例

```js
async function handler(_req) {
  // 与 example.com 建立 TLS 连接
  const connection = await Deno.connectTls({
    port: 443,
    hostname: "example.com",
  });

  // 发送原始 HTTP GET 请求。
  const request = new TextEncoder().encode(
    "GET / HTTP/1.1\nHost: example.com\r\n\r\n",
  );
  const _bytesWritten = await connection.write(request);

  // 从连接中读取 15 字节。
  const buffer = new Uint8Array(15);
  await connection.read(buffer);
  connection.close();

  // 将字节作为纯文本返回。
  return new Response(buffer, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
}

Deno.serve(handler);
```