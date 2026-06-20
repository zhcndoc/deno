---
last_modified: 2026-06-17
title: "HTTP 服务"
description: "Deno.serve() 在桌面应用中如何工作：自动端口绑定、DENO_SERVE_ADDRESS 环境变量，以及向嵌入式 webview 提供本地 UI。"
---

:::info 即将登陆 Deno 2.9

`deno desktop` 随 Deno v2.9.0 一起发布，但尚未进入稳定版。要现在试用它，请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建。在该功能稳定之前，命令、配置键和 TypeScript API 仍可能发生变化。

:::

`deno desktop` 应用通过本地 HTTP 提供其 UI，并将嵌入式 webview 指向该地址。这使应用结构与普通 Deno 网站完全一致。
[`Deno.serve()`](/api/deno/~/Deno.serve) 是入口点，所有请求都会流经你的处理器，但无需管理端口，也不会暴露到远程网络。

## 工作原理

当二进制程序启动时：

1. 运行时会选择一个未使用的本地端口，并将 `DENO_SERVE_ADDRESS`
   环境变量设置为 `tcp:127.0.0.1:<port>`。
2. 你的代码调用 `Deno.serve(...)`。serve API 会读取 `DENO_SERVE_ADDRESS`
   （在此模式下由 Deno 自身设置，而不是由用户设置）并绑定到该端口，
   忽略你传入的任何端口。
3. 当监听器准备就绪后，webview 会导航到 `http://127.0.0.1:<port>`。

你编写的处理器与任何 Deno HTTP 服务器所用的一样。没有桌面专用的服务 API。

```ts title="main.ts"
Deno.serve((req) => {
  const url = new URL(req.url);
  if (url.pathname === "/api/hello") {
    return Response.json({ hello: "world" });
  }
  return new Response(HOMEPAGE, {
    headers: { "content-type": "text/html" },
  });
});

const HOMEPAGE = `<!doctype html>
<html><body>
  <h1>Hello, desktop</h1>
  <button onclick="fetch('/api/hello').then(r => r.json()).then(console.log)">
    Ping
  </button>
</body></html>`;
```

```sh
deno desktop main.ts
```

默认导出形式也同样可用：

```ts title="main.ts"
export default {
  fetch(req: Request): Response {
    return new Response("Hello!");
  },
};
```

## 为什么使用本地 HTTP？

本地 HTTP 架构以极小的开销换取了对桌面应用很重要的特性：

- **浏览器和桌面端使用同一份代码。** 首页、fetch、websocket 和
  cookies 在 `deno run` 和 `deno desktop` 中的行为完全一致。你可以在浏览器标签页中开发，并将相同代码作为桌面二进制文件发布。
- **没有特殊的模块系统。** 导入、静态资源和模块级代码都会像在 Web 服务器上一样运行。
- **框架可无缝运行。** Next.js、Astro、Fresh 以及其他框架本就附带了一个
  生产级 HTTP 服务器。`deno desktop` 会运行该服务器，并将 webview
  指向它。参见 [Frameworks](/runtime/desktop/frameworks/)。

代价是每次请求都要在 `127.0.0.1` 内多一次网络跳转。对于 UI 服务
（HTML、CSS、打包后的 JS、JSON API 响应）来说，这点开销可以忽略不计。

对于 Deno → webview 的高吞吐通信，如果开销很重要，请使用
[bindings](/runtime/desktop/bindings/)，它会完全绕过 HTTP，并通过进程内通道进行路由。

## 网络暴露

绑定地址**始终**是 `127.0.0.1`（或 `[::1]`）。即使你向
[`Deno.serve()`](/api/deno/~/Deno.serve) 传入 `0.0.0.0`，编译后的二进制文件也绝不会绑定到公共接口。其他应用以及同一台机器上的其他用户都无法访问你的服务器。

如果你需要向其他机器上的用户提供服务（一个自托管的本地服务器），
不要把 `deno desktop` 用在你技术栈的那一部分。请使用带显式地址的
`deno run`，或者构建一个单独的服务。

## 自定义端口行为

在 `deno desktop` 内部，你无法覆盖 [`Deno.serve()`](/api/deno/~/Deno.serve) 绑定的端口。这是有意为之：webview 需要导航到与运行时监听相同的端口，而运行时是该值的唯一真实来源。

如果你需要知道服务器绑定到了哪里，请读取 `DENO_SERVE_ADDRESS`。它的格式为
`tcp:127.0.0.1:<port>`，因此当你需要一个 `http://`
URL 时，可以把端口部分拆出来：

```ts
const addr = Deno.env.get("DENO_SERVE_ADDRESS")!; // "tcp:127.0.0.1:54321"
const port = addr.split(":").pop();
console.log("正在监听：", `http://127.0.0.1:${port}`);
```

## 提供多个窗口

当你创建额外的 [windows](/runtime/desktop/windows/) 时，默认情况下它们都会从同一个本地 HTTP 服务器加载。可为不同窗口使用不同路径来区分：

```ts
const port = Deno.env.get("DENO_SERVE_ADDRESS")!.split(":").pop();
const settings = new Deno.BrowserWindow();
settings.navigate(`http://127.0.0.1:${port}/settings`);
```
