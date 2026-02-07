---
title: "@std/http"
description: "用于构建 HTTP 服务器的实用工具"
jsr: jsr:@std/http
pkg: http
version: 1.0.23
generated: true
stability: stable
---

<!-- 自动生成自 JSR 文档。请勿直接编辑。 -->

## 概览

<p>在 Deno 原生 HTTP 服务器之上提供用户友好的 <code>serve</code>，以及其他用于创建 HTTP 服务器和客户端的实用工具。</p>
<h2 id="file-server">
文件服务器</h2>
<p>一个用于通过 HTTP 提供本地文件的小程序。</p>

```js
deno run --allow-net --allow-read jsr:@std/http/file-server
监听于:
- 本地: http://localhost:8000
```

<p>当提供 <code>--allow-sys=networkInterfaces</code> 权限时，文件服务器还会显示可用于访问服务器的局域网地址。</p>
<h2 id="http-status-code-and-status-text">
HTTP 状态码和状态文本</h2>
<p>用于处理状态码和状态文本的辅助工具。</p>
<h2 id="http-errors">
HTTP 错误</h2>
<p>提供针对每个 HTTP 错误状态码的错误类，以及以结构化方式处理 HTTP 错误的实用函数。</p>
<h2 id="methods">
方法</h2>
<p>提供辅助函数和类型，用于安全地处理 HTTP 方法字符串。</p>
<h2 id="negotiation">
协商</h2>
<p>一组函数，可用于在响应请求时协商内容类型、编码和语言。</p>
<blockquote>
<p>注意：某些库通过分析 <code>Accept-Charset</code> 头包含字符集接受功能。该头是一个遗留头，<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset" rel="nofollow">客户端会省略，服务器应忽略</a>，因此本库不提供该功能。</p>
</blockquote>
<h2 id="user-agent-handling">
用户代理处理</h2>
<p><a href="https://jsr.io/@std/http@1.0.23/doc/~/UserAgent" rel="nofollow"><code>UserAgent</code></a> 类提供用户代理字符串解析，允许用户代理标志被语义化理解。</p>
<p>例如，集成 HTTP 请求头中的 <code>User-Agent</code>，如下示例：</p>

```js
import { UserAgent } from "@std/http/user-agent";

Deno.serve((req) => {
  const userAgent = new UserAgent(req.headers.get("user-agent") ?? "");
  return new Response(`Hello, ${userAgent.browser.name}
    on ${userAgent.os.name} ${userAgent.os.version}!`);
});
```

<h3 id="routing">
路由</h3>
<p><code>route</code> 提供了一种简便方式，根据请求路径和方法将请求路由至不同的处理器。</p>

```js
import { route, type Route } from "@std/http/unstable-route";
import { serveDir } from "@std/http/file-server";

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/about" }),
    handler: () => new Response("关于页面"),
  },
  {
    pattern: new URLPattern({ pathname: "/users/:id" }),
    handler: (_req, _info, params) => new Response(params?.pathname.groups.id),
  },
  {
    pattern: new URLPattern({ pathname: "/static/*" }),
    handler: (req: Request) => serveDir(req)
  },
  {
    method: ["GET", "HEAD"],
    pattern: new URLPattern({ pathname: "/api" }),
    handler: (req: Request) => new Response(req.method === 'HEAD' ? null : 'ok'),
  },
];

function defaultHandler(_req: Request) {
  return new Response("未找到", { status: 404 });
}

Deno.serve(route(routes, defaultHandler));
```

### 添加到你的项目

```sh
deno add jsr:@std/http
```

<a href="https://jsr.io/@std/http/doc" class="docs-cta jsr-cta">查看 @std/http 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 为什么使用 @std/http？

非常适合使用 Web Fetch API 风格构建小型、快速的 HTTP 服务器和处理器。

## 示例

一个极简服务器

```ts
import { serve } from "@std/http";

serve((_req) => new Response("Hello"), { port: 8000 });
```

条件 GET 与 ETag（304 未修改）

```ts
import { serve } from "@std/http";
import { eTag, ifNoneMatch } from "@std/http/etag";

const body = JSON.stringify({ message: "Hello, cached world" });
const etag = eTag(body);

serve((req) => {
  const inm = req.headers.get("if-none-match");
  // ifNoneMatch 传回 false 说明标签匹配 -> 响应 304
  if (!ifNoneMatch(inm, etag)) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8", ETag: etag },
  });
});
```

内容协商（HTML 与 JSON）

```ts
import { serve } from "@std/http";
import { accepts } from "@std/http/negotiation";

serve((req) => {
  const preferred = accepts(req) ?? ["*/*"];
  if (preferred.includes("application/json") || preferred.includes("*/*")) {
    return Response.json({ ok: true });
  }
  return new Response("<h1>ok</h1>", {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
```

Cookie：设置、读取与删除

```ts
import { serve } from "@std/http";
import { deleteCookie, getCookies, setCookie } from "@std/http/cookie";

serve(async (req) => {
  const url = new URL(req.url);
  const headers = new Headers();

  if (url.pathname === "/login" && req.method === "POST") {
    // 实际场景请先验证凭证
    setCookie(headers, {
      name: "sid",
      value: crypto.randomUUID(),
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60, // 1 小时
    });
    return new Response("ok", { headers });
  }

  if (url.pathname === "/me") {
    const cookies = getCookies(req.headers);
    const sid = cookies["sid"] ?? "(无)";
    return Response.json({ sid });
  }

  if (url.pathname === "/logout") {
    deleteCookie(headers, "sid", { path: "/" });
    return new Response("bye", { headers });
  }

  return new Response("未找到", { status: 404 });
});
```

使用 `serveDir` 提供静态文件和跨域资源共享（CORS）

```ts
import { serve } from "@std/http";
import { serveDir } from "@std/http/file-server";

// 需要为你的公共目录授予 --allow-read 权限
serve((req) =>
  serveDir(req, {
    fsRoot: "public",
    showDirListing: true,
    enableCors: true, // 添加基本的 Access-Control-* 头
    urlRoot: "/static",
  })
);
```

使用服务端发送事件 (SSE) 流式更新

```ts
import { serve } from "@std/http";
import { ServerSentEventStream } from "@std/http/server-sent-event-stream";

serve((_req) => {
  const { readable, writable } = new TransformStream();
  const sse = new ServerSentEventStream(writable);

  let i = 0;
  const timer = setInterval(() => {
    sse.dispatchMessage({
      event: "tick",
      id: String(i),
      data: new Date().toISOString(),
    });
    i++;
    if (i === 5) { // 发送 5 条消息后停止
      clearInterval(timer);
      sse.close();
    }
  }, 1000);

  return new Response(readable, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      "connection": "keep-alive",
    },
  });
});
```

提供单个文件服务（支持 Range 请求）

```ts
import { serve } from "@std/http";
import { serveFile } from "@std/http/file-server";

serve((req) => {
  const url = new URL(req.url);
  if (url.pathname === "/video") {
    return serveFile(req, "static/video.mp4");
  }
  return new Response("未找到", { status: 404 });
});
```

## 小贴士

- 处理器签名为 `(req: Request) => Response | Promise<Response>`。
- 与标准的 `URL`、`Headers` 和 `Request` 结合使用，方便解析与响应。

<!-- custom:end -->