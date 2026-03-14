---
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno serve"
description: "一个灵活且可配置的 Deno HTTP 服务器"
---

## 示例

这是一个如何使用声明式 fetch 创建简单 HTTP 服务器的示例：

```typescript title="server.ts"
export default {
  async fetch(_req) {
    return new Response("Hello world!");
  },
} satisfies Deno.ServeDefaultExport;
```

`satisfies Deno.ServeDefaultExport` 类型断言确保您导出的对象符合 Deno HTTP 服务器的预期接口。这提供了类型安全性和更好的编辑器自动完成功能，同时允许您保持实现的推断类型。

然后，您可以使用 `deno serve` 命令运行服务器：

```bash
deno serve server.ts
```

`fetch` 函数中的逻辑可以根据不同类型的请求进行自定义，并相应地提供内容：

```typescript title="server.ts"
export default {
  async fetch(request) {
    if (request.url.endsWith("/json")) {
      return Response.json({ hello: "world" });
    }

    return new Response("Hello world!");
  },
} satisfies Deno.ServeDefaultExport;
```