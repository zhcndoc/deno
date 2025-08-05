---
title: "Writing an HTTP Server"
description: "A guide to creating HTTP servers in Deno. Learn about the Deno.serve API, request handling, WebSocket support, response streaming, and how to build production-ready HTTP/HTTPS servers with automatic compression."
oldUrl:
- /runtime/manual/runtime/http_server_apis/
- /runtime/manual/examples/http_server/
- /runtime/tutorials/http_server/
---

HTTP 服务器是网络的支柱，使您能够访问网站、下载文件和与网络服务交互。它们监听来自客户端（例如网页浏览器）的传入请求并发送响应。

当您构建自己的 HTTP 服务器时，您可以完全控制它的行为，并根据您的特定需求进行调整。您可能会将其用于本地开发，以提供 HTML、CSS 和 JS 文件，或者构建 REST API - 拥有自己的服务器使您能够定义端点、处理请求和管理数据。

## Deno 的内置 HTTP 服务器

Deno 内置了一个 HTTP 服务器 API，使您能够编写 HTTP 服务器。 [`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) API 支持 HTTP/1.1 和 HTTP/2。

### 一个 “Hello World” 服务器

`Deno.serve` 函数接收一个处理函数，该函数将在每个传入请求时被调用，并且预计将返回一个响应（或一个解析为响应的 promise）。

以下是一个示例服务器，它对每个请求返回“Hello, World！”响应：

```ts title="server.ts"
Deno.serve((_req) => {
  return new Response("Hello, World!");
});
```

处理程序也可以返回 `Promise<Response>`，这意味着它可以是一个 `async` 函数。

要运行此服务器，您可以使用 `deno run` 命令：

```sh
deno run --allow-net server.ts
```

### 在特定端口上监听

默认情况下，`Deno.serve` 将在端口 `8000` 上监听，但可以通过将端口号作为选项包的第一个或第二个参数传入来更改此行为：

```js title="server.ts"
// 在端口 4242 上监听。
Deno.serve({ port: 4242 }, handler);

// 在端口 4242 上监听并绑定到 0.0.0.0。
Deno.serve({ port: 4242, hostname: "0.0.0.0" }, handler);
```

### 检查传入请求

大多数服务器不会对每个请求都返回相同的响应。相反，它们会根据请求的各个方面（HTTP 方法、头部、路径或主体内容）来更改其答案。

请求作为处理函数的第一个参数传递。以下是一个示例，演示如何提取请求的各个部分：

```ts
Deno.serve(async (req) => {
  console.log("方法:", req.method);

  const url = new URL(req.url);
  console.log("路径:", url.pathname);
  console.log("查询参数:", url.searchParams);

  console.log("头部:", req.headers);

  if (req.body) {
    const body = await req.text();
    console.log("主体:", body);
  }

  return new Response("Hello, World!");
});
```

:::caution

请注意，如果用户在主体完全接收之前挂断连接，`req.text()` 调用可能会失败。确保处理此情况。请注意这可能发生在所有从请求主体读取的方法中，例如 `req.json()`、`req.formData()`、`req.arrayBuffer()`、`req.body.getReader().read()`、`req.body.pipeTo()` 等。

:::

### 用真实数据响应

大多数服务器不会对每个请求都响应“Hello, World！”相反，它们可能会返回不同的头部、状态码和主体内容（甚至主体流）。

以下是一个返回带有 404 状态码、JSON 主体和自定义头部的响应的示例：

```ts title="server.ts"
Deno.serve((req) => {
  const body = JSON.stringify({ message: "未找到" });
  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
});
```

### 用流响应

响应主体也可以是流。以下是一个返回每秒重复一次“Hello, World！”的响应示例：

```ts title="server.ts"
Deno.serve((req) => {
  let timer: number;
  const body = new ReadableStream({
    async start(controller) {
      timer = setInterval(() => {
        controller.enqueue("Hello, World!\n");
      }, 1000);
    },
    cancel() {
      clearInterval(timer);
    },
  });
  return new Response(body.pipeThrough(new TextEncoderStream()), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
```

:::note

注意上面的 `cancel` 函数。当客户端挂断连接时会调用它。确保处理此情况，否则服务器将不断排队消息，最终会耗尽内存。

:::

请注意，当客户端挂断连接时，响应主体流会被“取消”。确保处理此情况。这可能会在附加到响应主体 `ReadableStream` 对象的 `WritableStream` 对象的 `write()` 调用中出现错误（例如通过 `TransformStream`）。

### HTTPS 支持

要使用 HTTPS，请在选项中传递两个额外的参数：`cert` 和 `key`。这些分别是证书和密钥文件的内容。

```js
Deno.serve({
  port: 443,
  cert: Deno.readTextFileSync("./cert.pem"),
  key: Deno.readTextFileSync("./key.pem"),
}, handler);
```

:::note

要使用 HTTPS，您需要为服务器提供有效的 TLS 证书和私钥。

:::

### HTTP/2 支持

在使用 Deno 的 HTTP 服务器 API 时，HTTP/2 支持是“自动”的。您只需创建服务器，它将无缝处理 HTTP/1 或 HTTP/2 请求。

HTTP/2 在明文下也支持预先知识。

### 自动主体压缩

HTTP 服务器具备自动压缩响应主体的功能。当响应发送到客户端时，Deno 会确定响应主体是否可以安全地进行压缩。此压缩在 Deno 的内部发生，因此速度快且高效。

目前 Deno 支持 gzip 和 brotli 压缩。如果满足以下条件，主体会自动压缩：

- 请求具有一个 [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) 头，表明请求者支持 `br`（Brotli 压缩）或 `gzip`。Deno 会遵循头部中的 [质量值](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values) 的优先级。
- 响应包含一个 [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)，被认为是可压缩的。 （该列表源自 [`jshttp/mime-db`](https://github.com/jshttp/mime-db/blob/master/db.json)，并在
  [代码中](https://github.com/denoland/deno/blob/v1.21.0/ext/http/compressible.rs)）。
- 响应主体大于 64 字节。

当响应主体被压缩时，Deno 会设置 `Content-Encoding` 头以反映编码，并确保 `Vary` 头被调整或添加，以指示哪些请求头影响了响应。

除了上述逻辑，还有一些原因使得响应 **不会** 自动压缩：

- 响应包含 `Content-Encoding` 头。这表明您的服务器已经进行了某种编码。
- 响应包含一个 [`Content-Range`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) 头。这表明您的服务器正在响应范围请求，其中字节和范围是在 Deno 内部的控制之外进行协商的。
- 响应具有一个 [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) 头，其中包含一个 [`no-transform`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other) 值。这表明您的服务器不希望 Deno 或任何下游代理修改响应。

### 提供 WebSocket 服务

Deno 可以将传入的 HTTP 请求升级为 WebSocket。这使您能够在 HTTP 服务器上处理 WebSocket 端点。

要将传入的 `Request` 升级为 WebSocket，您可以使用 `Deno.upgradeWebSocket` 函数。这返回一个包含 `Response` 和一个 Web 标准 `WebSocket` 对象的对象。返回的响应应被用于响应传入的请求。

由于 WebSocket 协议是对称的，因此 `WebSocket` 对象与可用于客户端通信的对象是相同的。有关文档，可以在 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) 上找到。

```ts title="server.ts"
Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.addEventListener("open", () => {
    console.log("一个客户端已连接!");
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
  });

  return response;
});
```

在进行 WebSocket 升级后，创建 WebSocket 的连接无法再用于 HTTP 流量。

:::note

请注意，目前 WebSocket 仅在 HTTP/1.1 上受支持。

:::

## 默认的 fetch 导出

在 Deno 中创建 HTTP 服务器的另一种方法是导出一个默认的 `fetch` 函数。[fetch API](/api/web/~/fetch) 发起 HTTP 请求以从网络中获取数据，并且内置于 Deno 运行时中。

```ts title="server.ts"
export default {
  fetch(request) {
    const userAgent = request.headers.get("user-agent") || "未知";
    return new Response(`用户代理: ${userAgent}`);
  },
} satisfies Deno.ServeDefaultExport;
```

您可以通过 `deno serve` 命令运行此文件：

```sh
deno serve server.ts
```

服务器将启动并在控制台中显示消息。打开您的浏览器并导航到 [http://localhost:8000/](http://localhost:8000/) 以查看用户代理信息。

`Deno.ServeDefaultExport` 接口定义了可以与 `deno serve` 命令一起使用的默认导出的结构。为了确保您的代码经过正确的类型检查，请确保在 `export default { ... }` 中添加 `satisfies Deno.ServeDefaultExport`。

## 在这些示例基础上构建

您可能希望在这些示例的基础上扩展，创建更复杂的服务器。Deno 推荐使用 [Oak](https://jsr.io/@oak/oak) 来构建 web 服务器。Oak 是一个用于 Deno HTTP 服务器的中间件框架，旨在表达和易于使用。它提供了一个简单的方法来创建支持中间件的 web 服务器。查看 [Oak 文档](https://oakserver.github.io/oak/) 以获取有关如何定义路由的示例。