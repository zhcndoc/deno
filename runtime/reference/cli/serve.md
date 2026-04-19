---
last_modified: 2025-05-01
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

## 默认导出结构

该文件必须导出一个默认对象，该对象满足
[`Deno.ServeDefaultExport`](/api/deno/~/Deno.ServeDefaultExport)。该对象包含
两个属性：

```typescript
export interface ServeDefaultExport {
  fetch: ServeHandler;
  onListen?: (localAddr: Deno.Addr) => void;
}
```

### `fetch`（必需）

`fetch` 处理器接收一个标准的
[`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 以及一个携带连接元数据的
[`ServeHandlerInfo`](/api/deno/~/Deno.ServeHandlerInfo) 对象：

```typescript
type ServeHandler = (
  request: Request,
  info: ServeHandlerInfo,
) => Response | Promise<Response>;

interface ServeHandlerInfo {
  remoteAddr: Deno.Addr; // 连接的远程地址
  completed: Promise<void>; // 在请求完成时解析
}
```

如果处理器抛出错误，错误会被隔离到该请求——服务器会继续提供服务。

### `onListen`（可选）

当服务器开始监听时会调用一次。如果省略，将记录默认消息到控制台。

```typescript title="server.ts"
export default {
  fetch(request, info) {
    const { hostname, port } = info.remoteAddr as Deno.NetAddr;
    console.log(`${request.method} ${request.url} from ${hostname}:${port}`);

    return new Response("Hello, World!", {
      headers: { "content-type": "text/plain" },
    });
  },

  onListen({ hostname, port }) {
    console.log(`Server running at http://${hostname}:${port}/`);
  },
} satisfies Deno.ServeDefaultExport;
```

默认导出对象上的任何其他属性都会被静默忽略。如果缺少 `fetch`，
则不会启动服务器。如果 `fetch` 或 `onListen` 存在但不是函数，
将抛出 `TypeError`。

## 路由请求

使用请求 URL 将请求路由到不同的处理器：

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

当文件发生更改时自动重启服务器：

```sh
deno serve --watch server.ts
```

## 权限

`deno serve` 会自动允许服务器监听，无需 `--allow-net`。其他权限（例如文件读取）必须显式授予：

```sh
deno serve --allow-read server.ts
```
