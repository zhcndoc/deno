---
title: "简单的 HTTP 服务器"
oldUrl:
  - /deploy/docs/tutorial-http-server/
---

在本教程中，我们将构建一个 HTTP 服务器，响应所有传入的 HTTP 请求，返回 `Hello, world!` 和 `200 OK` HTTP 状态。我们将使用 Deno Deploy 实验室来部署和编辑这个脚本。

## 步骤 1：编写 HTTP 服务器脚本

一个简单的 HTTP 服务器可以通过以下一行代码在 Deno 中编写，使用 [`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve):

```js title="一行代码的 HTTP 服务器"
Deno.serve(() => new Response("Hello, world!"));
```

虽然这种类型的服务器在入门时非常有用，但 `Deno.serve` 也支持更高级的用法
([API 参考文档](https://docs.deno.com/api/deno/~/Deno.serve))。下面是一个更复杂的服务器示例，利用了其他 API 特性。

```ts title="更复杂的 Hello World 服务器"
Deno.serve({
  onListen: ({ port }) => {
    console.log("Deno 服务器正在 *: ", port 监听);
  },
}, (req: Request, conn: Deno.ServeHandlerInfo) => {
  // 获取有关传入请求的信息
  const method = req.method;
  const ip = conn.remoteAddr.hostname;
  console.log(`${ip} 刚刚进行了 HTTP ${method} 请求.`);

  // 返回一个 web 标准的 Response 对象
  return new Response("Hello, world!");
});
```

## 步骤 2：将脚本部署到 Deno Deploy

1. 通过访问 [你的 Deno 仪表板](https://dash.deno.com/account/overview)，并点击 **新建实验室** 按钮来创建一个新的实验室项目。
2. 在下一屏幕上，将上面的代码（短示例或长示例）复制到屏幕左侧的编辑器中。
3. 点击顶部工具栏右侧的 **保存并部署** 按钮（或按 <kbd>Ctrl</kbd>+<kbd>S</kbd>）。

你可以在实验室编辑器右侧的预览窗格中预览结果。

你会看到，如果你更改脚本（例如 `Hello, World!` -> `Hello, Galaxy!`）然后重新部署，预览将自动更新。预览窗格顶部显示的 URL 可用于从任何地方访问已部署的页面。

即使在实验室编辑器中，脚本也会在我们的全球网络中部署。这样可以确保快速和可靠的性能，无论用户位于何处。