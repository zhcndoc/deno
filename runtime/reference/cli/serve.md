---
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno serve"
description: "A flexible and configurable HTTP server for Deno"
---

## 示例

这是一个如何使用声明式 fetch 创建简单 HTTP 服务器的示例：

```typescript title="server.ts"
export default {
  async fetch(_req) {
    return new Response("Hello world!");
  },
};
```

然后您可以使用 `deno serve` 命令运行服务器：

```bash
deno serve server.ts
```

`fetch` 函数中的逻辑可以根据不同类型的请求进行自定义，并相应地提供内容：

```typescript title="server.ts"
export default {
  async fetch(request) {
    if (request.url.startsWith("/json")) {
      return Response.json({ hello: "world" });
    }

    return new Response("Hello world!");
  },
};
```