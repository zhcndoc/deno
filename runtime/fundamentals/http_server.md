---
last_modified: 2026-05-13
title: "编写 HTTP 服务器"
description: "Deno 中创建 HTTP 服务器的指南。了解 Deno.serve API、请求处理、WebSocket 支持、响应流，以及如何使用自动压缩构建可用于生产环境的 HTTP/HTTPS 服务器。"
oldUrl:
  - /runtime/manual/runtime/http_server_apis/
  - /runtime/manual/examples/http_server/
  - /runtime/tutorials/http_server/
---

Deno 内置了一个 HTTP 服务器 API：[`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) 函数，它支持 HTTP/1.1 和 HTTP/2，并且可以与 web 标准的 `Request` 和 `Response` 对象配合使用。本文将介绍如何使用它编写服务器，从第一个处理程序开始，直到路由、静态文件、TLS、WebSocket 和关闭服务器。

## 一个“Hello World”服务器

[`Deno.serve`](/api/deno/~/Deno.serve) 函数接受一个处理函数，
该函数会在每个传入请求到达时被调用，并且预期返回一个
响应（或一个解析为响应的 promise）。

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

在[示例集](https://docs.deno.com/api/deno/~/Deno.serve)中还有更多使用 [`Deno.serve`](/api/deno/~/Deno.serve) 的示例。

## 监听特定端口

默认情况下，[`Deno.serve`](/api/deno/~/Deno.serve) 会监听端口 `8000`，
但您可以通过在选项对象中将端口号作为第一个
或第二个参数传入来更改它：

```js title="server.ts"
// 在端口 4242 上监听。
Deno.serve({ port: 4242 }, handler);

// 在端口 4242 上监听并绑定到 0.0.0.0。
Deno.serve({ port: 4242, hostname: "0.0.0.0" }, handler);
```

## 检查传入请求

大多数服务器不会对每个请求都返回相同的响应。相反，它们会根据请求的各个方面（HTTP 方法、头部、路径或主体内容）来更改其回答。

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

## 使用真实数据进行响应

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

## 以流的形式响应

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

当客户端挂断连接时，响应主体流会被“取消”。请确保处理此情况。这可能会在附加到响应主体 [`ReadableStream`](/api/web/~/ReadableStream) 对象的 [`WritableStream`](/api/web/~/WritableStream) 对象上的 `write()` 调用中表现为错误（例如通过 [`TransformStream`](/api/web/~/TransformStream)）。

## 路由请求

对于具有多个端点的服务器，请使用内置的
[`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API)
web API 来匹配 URL：

```ts
const userPattern = new URLPattern({ pathname: "/users/:id" });

Deno.serve((req) => {
  const match = userPattern.exec(req.url);
  if (match) {
    const id = match.pathname.groups.id;
    return new Response(`用户 ${id}`);
  }
  if (new URL(req.url).pathname === "/") {
    return new Response("首页");
  }
  return new Response("未找到", { status: 404 });
});
```

标准库还提供了一个小型路由器，用于将模式和方法
对映射到处理程序：
[`@std/http` 中的 `route`](https://jsr.io/@std/http/doc/unstable-route)。对于
中间件、更大的路由树或框架便利功能，请使用
[Oak 或 Hono](/runtime/fundamentals/web_dev/)。

## 提供静态文件

要从目录中提供文件，请使用
[`@std/http` 中的 `serveDir`](https://jsr.io/@std/http/doc/file-server)：

```ts
import { serveDir } from "jsr:@std/http/file-server";

Deno.serve((req) => serveDir(req, { fsRoot: "./public" }));
```

`serveDir` 会处理内容类型、范围请求和目录遍历
保护。使用对该目录的读取权限运行它：
`deno run -N -R server.ts`。若要仅用一次命令启动一个不需要编写任何代码的文件服务器，
同一模块也可作为 CLI 使用：
`deno run -RN jsr:@std/http/file-server ./public`。

## 优雅关闭

[`Deno.serve`](/api/deno/~/Deno.serve) 会返回一个
[`HttpServer`](/api/deno/~/Deno.HttpServer)，其 `shutdown()` 方法会停止
接受新连接，同时让正在处理中的请求完成。将它与
信号监听器结合使用，以便在生产环境中实现干净退出：

```ts
const server = Deno.serve((_req) => new Response("Hello"));

Deno.addSignalListener("SIGINT", async () => {
  console.log("正在关闭");
  await server.shutdown();
});
```

您还可以通过 `signal`
选项传入一个 [`AbortSignal`](/api/web/~/AbortSignal)，以将服务器的生命周期与其他逻辑绑定。

## HTTPS 支持

要提供 HTTPS 服务，请在选项中传入 `cert` 和 `key`。这两个值都应是证书和私钥的 PEM 编码内容，而不是文件路径。

```ts title="server.ts"
Deno.serve({
  port: 8443,
  cert: Deno.readTextFileSync("./cert.pem"),
  key: Deno.readTextFileSync("./key.pem"),
}, (_req) => new Response("通过 HTTPS 的 Hello！"));
```

使用网络访问权限以及这两个文件的读取权限来运行它：

```sh
deno run --allow-net --allow-read=cert.pem,key.pem server.ts
```

对于本地开发，您可以使用 [OpenSSL](https://www.openssl.org/) 生成一个短期自签名证书：

```sh
openssl req -x509 -newkey rsa:2048 -nodes -days 1 \
  -keyout key.pem -out cert.pem \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost"
```

然后检查服务器是否有响应。`-k` 标志告诉 curl 接受自签名证书——仅在本地测试时使用：

```console
$ curl -k https://localhost:8443/
通过 HTTPS 的 Hello！
```

:::note

在生产环境中，请使用由受信任机构签发的证书，例如 [Let's Encrypt](https://letsencrypt.org/)，而不是自签名证书。运行时 API 是相同的；变化的只是 `cert` 和 `key` 的来源。

:::

## HTTP/2 支持

在使用 Deno 的 HTTP 服务器 API 时，HTTP/2 支持是“自动”的。您只需创建服务器，它将无缝处理 HTTP/1 或 HTTP/2 请求。

HTTP/2 在明文下也支持 prior knowledge（预先知识）。

## 自动主体压缩

HTTP 服务器具备自动压缩响应主体的功能。当响应发送到客户端时，Deno 会确定响应主体是否可以安全地进行压缩。此压缩在 Deno 的内部发生，因此速度快且高效。

目前 Deno 支持 gzip 和 brotli 压缩。如果满足以下条件，主体会自动压缩：

- 请求具有一个
  [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
  头，表明请求方支持 Brotli 的 `br` 或 `gzip`。Deno
  会尊重头中的
  [质量值](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values)
  偏好。
- 响应包含一个
  [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
  且该类型被认为可压缩。（列表来源于
  [`jshttp/mime-db`](https://github.com/jshttp/mime-db/blob/master/db.json)，实际列表
  位于[代码中](https://github.com/denoland/deno/blob/main/ext/http/compressible.rs)。）
- 响应主体大于 64 字节。

当响应主体被压缩时，Deno 会设置 `Content-Encoding` 头以反映编码，并确保 `Vary` 头被调整或添加，以指示哪些请求头影响了响应。

除了上述逻辑，还有一些原因使得响应 **不会** 自动压缩：

- 响应包含 `Content-Encoding` 头。这表明您的服务器已经进行了某种编码。
- 响应包含一个 [`Content-Range`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) 头。这表明您的服务器正在响应范围请求，其中字节和范围是在 Deno 内部的控制之外进行协商的。
- 响应具有一个 [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) 头，其中包含一个 [`no-transform`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other) 值。这表明您的服务器不希望 Deno 或任何下游代理修改响应。

## 提供 WebSocket

Deno 可以将传入的 HTTP 请求升级为 WebSocket。这使您能够在 HTTP 服务器上处理 WebSocket 端点。

要将传入的 [`Request`](/api/web/~/Request) 升级为 WebSocket，您可以使用
[`Deno.upgradeWebSocket`](/api/deno/~/Deno.upgradeWebSocket) 函数。此函数
会返回一个由 [`Response`](/api/web/~/Response) 和一个 Web
标准 [`WebSocket`](/api/web/~/WebSocket) 对象组成的对象。返回的响应
应当用于响应传入请求。

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

您很可能希望在这些示例基础上进行扩展，以创建更复杂的服务器。这里的一切都建立在 web 标准的 `Request`/`Response` 之上，因此它可以与生态系统中的路由库和框架组合使用——例如用于中间件和路由的 [Oak](https://jsr.io/@oak/oak) 或 [Hono](https://hono.dev)，或者一个完整的框架。有关使用 Deno 构建 web 应用的概览，请参见[Web 开发](/runtime/fundamentals/web_dev/)。
