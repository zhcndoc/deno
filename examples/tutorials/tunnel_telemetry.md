---
title: "使用隧道功能进行本地遥测"
description: "使用 Deno 的隧道功能从本地开发服务器发送遥测数据"
url: /examples/tunnel_telemetry_tutorial/
---

Deno 的隧道功能允许你将本地开发服务器安全地暴露到互联网。这对于将[Open Telemetry](https://opentelemetry.io/)数据从本地服务器发送到 Deno Deploy 的遥测监控服务非常有用，可帮助你在开发过程中调试和监控应用程序。

在本教程中，我们将向你展示如何使用 `--tunnel` 标志和 Deno Deploy，通过最小的设置在本地项目中查看跨度（span）和日志数据。

## 设置应用

你可以使用任何运行本地服务器的应用程序。本教程中，我们将使用一个简单的 Svelte 应用。如果你已经有本地服务器应用，可以跳转到[#使用 `--tunnel` 标志运行本地应用](#使用--tunnel-标志运行本地应用)。

首先，创建一个新的 Svelte 项目：

```sh
npx sv create svelte-app
```

在提示中选择默认选项，然后进入新项目目录：

```sh
cd svelte-app
deno run dev
```

你现在应该有一个在本地运行的 Svelte 应用，地址为 `http://localhost:5173`（如果端口 5173 已被占用，则可能是其它端口）。

## 设置 Vite 以支持隧道功能

Svelte 使用的 Vite 服务器默认只允许 localhost 访问，为了让它更广泛地可用，我们需要对 `vite.config.js` 文件做小幅修改。打开 `vite.config.js`，添加一个 `server` 配置段，设置 `allowedHosts: true`：

```js title="vite.config.js"
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    allowedHosts: true,
  },
});
```

## 使用 Deno Deploy 子命令部署应用

要使用隧道功能，需要先部署应用，这样 Deno 才能为你提供一个可进行隧道连接的 URL。你可以通过 Deno Deploy 子命令部署你的应用：

```sh
deno deploy
```

按照提示创建新项目或选择已有项目。部署完成后，你会收到一个项目 URL。

## 使用 `--tunnel` 标志运行本地应用

现在你可以用 `--tunnel` 标志运行本地开发服务器，这会通过安全隧道将本地服务器暴露到互联网。

```sh
deno run --tunnel dev
```

在浏览器里打开返回的隧道 URL，你应该可以看到本地的 Svelte 应用正在运行。任何由本地服务器生成的遥测数据现在都会发送到 Deno Deploy 的遥测监控服务。

## 遥测数据示例

你可以在 `+page.server.ts` 文件中添加一些示例遥测数据，来看它们的效果。添加一个向 `https://example.com` 的 fetch 请求和一些控制台日志：

```ts title="+page.server.ts"
console.log("这是服务器端页面模块。");

export const load = async ({ fetch }) => {
  // 用于示范的基础服务器端 fetch
  const response = await fetch("https://example.com");
  const exampleHtml = await response.text();

  return {
    exampleHtml,
  };
};
```

当你通过隧道 URL 访问你的应用时，这个 fetch 请求将被发出，我们也能在 Deno Deploy 的遥测数据中看到它。具体步骤如下：

1. 打开浏览器开发者工具的网络标签，查找对隧道 URL 的 GET 请求。
2. 查看响应头，找到 `x-deno-trace-id` 头，它包含该请求的跟踪 ID。
3. 复制这个跟踪 ID。
4. 进入你的 Deno Deploy 控制台，导航到你的应用并点击 **Traces** 标签。
5. 将跟踪 ID 粘贴到搜索栏，找到对应请求的跟踪记录。

现在你可以深入查看跟踪详情，看到遥测数据。你应该能看到对隧道 URL 的 GET 请求和对 `https://example.com` 的 fetch 请求，这些都是从你的本地开发服务器捕获的，无需额外配置！

你还可以点击跟踪旁的 **查看日志** 按钮，查看特定请求产生的日志。如果你看到一个路径为 `/` 的跟踪记录，日志中会显示我们之前控制台输出的 "这是服务器端页面模块。"。

🦕 JavaScript 拥有单线程事件循环和异步函数，项目中很可能存在大量日志和跟踪。Deno Deploy 的遥测工具旨在帮助你探索和调试异常或性能问题，因此如果看到大量数据也不必担心！请利用筛选和搜索功能，帮你找到所需信息。