---
title: 基于文件的路由
url: /examples/file_based_routing_tutorial/
oldUrl:
- /examples/http-server-file-router/
- /runtime/tutorials/file_based_routing/
---

如果您使用过像 [Next.js](https://nextjs.org/) 这样的框架，您可能对基于文件的路由已不陌生 - 您在特定目录中添加一个文件，它会自动成为一个路由。本教程演示如何创建一个使用基于文件的路由的简单 HTTP 服务器。

## 路由请求

创建一个名为 `server.ts` 的新文件。这个文件将用于路由请求。
设置一个名为 `handler` 的异步函数，接受一个请求对象作为参数：

```ts title="server.ts"
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  let module;

  try {
    module = await import(`.${path}.ts`);
  } catch (_error) {
    return new Response("未找到", { status: 404 });
  }

  if (module[method]) {
    return module[method](req);
  }

  return new Response("未实现的方法", { status: 501 });
}

Deno.serve(handler);
```

`handler` 函数设置了一个路径变量，其中包含从请求 URL 中提取的路径，以及一个方法变量，包含请求方法。

接下来尝试根据路径导入一个模块。如果未找到模块，则返回404响应。

如果找到了模块，它会检查该模块是否有请求方法的处理程序。如果找到了方法处理程序，它将使用请求对象调用该方法处理程序。如果未找到方法处理程序，则返回501响应。

最后，它使用 `Deno.serve` 提供处理程序函数。

> 路径可以是任何有效的 URL 路径，例如 `/users`、`/posts` 等。对于像 `/users` 这样的路径，将导入 `./users.ts` 文件。然而，像 `/org/users` 这样的更深路径将需要 `./org/users.ts` 文件。您可以通过创建嵌套目录和文件来创建嵌套路由。

## 处理请求

在与 `server.ts` 相同的目录中创建一个名为 `users.ts` 的新文件。这个文件将用于处理对 `/users` 路径的请求。我们将使用 `GET` 请求作为示例。您可以添加更多的 HTTP 方法，如 `POST`、`PUT`、`DELETE` 等。

在 `users.ts` 中，设置一个名为 `GET` 的异步函数，接受一个请求对象作为参数：

```ts title="users.ts"
export function GET(_req: Request): Response {
  return new Response("来自 user.ts 的问候", { status: 200 });
}
```

## 启动服务器

要启动服务器，请运行以下命令：

```sh
deno run --allow-net --allow-read server.ts
```

这将在 `localhost:8080` 上启动服务器。您现在可以向 `localhost:8000/users` 发出 `GET` 请求，您应该会看到响应 `来自 user.ts 的问候`。

此命令需要 `--allow-net` 和 `--allow-read`
[权限标志](/runtime/fundamentals/security/)，以允许访问网络以启动服务器并从文件系统中读取 `users.ts` 文件。

🦕 现在您可以基于文件结构在您的应用程序中设置路由。您可以根据需要扩展此示例以添加更多路由和方法。

<small>感谢 [@naishe](https://github.com/naishe) 贡献此教程。</small>