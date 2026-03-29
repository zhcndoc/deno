---
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno serve"
description: "一个灵活且可配置的 Deno HTTP 服务器"
---

`deno serve` 使用 [`Deno.serve()`](/api/deno/~/Deno.serve) 将一个文件作为 HTTP 服务器运行。该文件必须导出一个带有 `fetch` 处理器的默认对象。有关构建 HTTP 服务器的完整指南，请参阅 [编写 HTTP 服务器](/runtime/fundamentals/http_server/)。

## 基本用法

```typescript title="server.ts"
export default {
  fetch(_req: Request) {
    return new Response("Hello world!");
  },
} satisfies Deno.ServeDefaultExport;
```

```sh
deno serve server.ts
```

默认情况下，服务器监听 **8000** 端口。可以使用 `--port` 覆盖它：

```sh
deno serve --port=3000 server.ts
```

## 路由请求

`fetch` 处理器接收一个标准的
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。
使用 URL 进行路由：

```typescript title="server.ts"
export default {
  fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok" });
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies Deno.ServeDefaultExport;
```

## 绑定到主机名

默认情况下，`deno serve` 监听 `0.0.0.0`。使用 `--host` 绑定到特定接口：

```sh
deno serve --host=127.0.0.1 server.ts
```

## 水平扩展

跨多个 CPU 核心运行多个服务器实例，以获得更好的吞吐量：

```sh
deno serve --parallel server.ts
```

## 监视模式

在文件发生更改时自动重启服务器：

```sh
deno serve --watch server.ts
```

## 权限

`deno serve` 会自动允许服务器监听，无需 `--allow-net`。其他权限（如文件读取）必须显式授予：

```sh
deno serve --allow-read server.ts
```
