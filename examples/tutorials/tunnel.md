---
title: "使用 Tunnel 共享本地服务器"
description: "使用 --tunnel 选项即时暴露公共 URL"
url: /examples/tunnel_tutorial/
---

Deno 中的 `--tunnel` 标志允许你即时将本地服务器暴露到互联网。这对于测试 webhook、与同事共享工作内容，或者从不同设备访问本地服务器非常有用——例如，在移动设备上测试你的应用。

因为 Deno 的 Tunnel 功能会创建一个到你本地服务器的安全通道，所以你无需担心配置防火墙或端口转发。

我们将搭建一个简单的应用并展示如何使用 tunnel 功能公开暴露它。

## 搭建应用

你可以使用任何运行本地服务器的应用。在本教程中，我们将使用一个简单的 Svelte 应用。

首先，创建一个新的 Svelte 项目：

```sh
npx sv create svelte-app
```

选择默认选项完成提示，然后进入新创建的项目目录：

```sh
cd svelte-app
deno run dev
```

现在你应该可以在 `http://localhost:5173`（如果 5173 端口被占用则是其他端口）上本地运行一个 Svelte 应用。

## 配置 Vite 允许隧道访问

Svelte 使用的 Vite 服务器默认仅限于 localhost，因此为了让它更广泛可访问，我们需要对 `vite.config.js` 文件做一点修改。打开 `vite.config.js`，添加一个 `server` 配置，设定 `allowedHosts: true`：

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

## 使用 Deno Deploy 子命令部署你的应用

我们将使用 `deno deploy` 子命令将该项目部署到 Deno Deploy。这样做的目的是为我们创建一个项目 URL，稍后我们可以用它来分享本地服务器。

在终端运行：

```sh
deno deploy
```

按照终端提示创建一个新的 Deno Deploy 应用，可能需要登录你的 Deno Deploy 控制台，如果你属于多个组织，还需选择一个组织。

部署过程中会自动识别这是一个 Svelte 项目并设置相应配置，所以你只需在 Deno Deploy 控制台中点击 **Create App** 即可。

## 通过隧道连接到你的本地服务器

隧道功能内置于 Deno CLI 中。它启用了一些 Deno Deploy 的强大功能，但作用于你的本地服务器！

要启动隧道连接到本地服务器，在项目目录下运行：

```sh
deno run --tunnel dev
```

如果被重定向到浏览器，请使用你的 Deno Deploy 账户进行身份验证。

该命令会启动本地服务器并创建一个到它的安全隧道。几秒钟后，你应看到如下输出：

```sh
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
You are connected to https://my-app-name.myusername.deno.net
```

该公共 URL（示例中为 `https://my-app-name.myusername.deno.net`）现在可以从互联网上任何地方访问！你可以将此 URL 分享给他人访问你的本地 Svelte 应用，（类似于 ngrok 或其他隧道服务）。

你可以照常修改本地代码，修改内容将实时反映在公共 URL 上。

## 配置环境变量

隧道功能允许你从 Deno Deploy 项目中拉取环境变量。这对于本地测试依赖环境变量的功能非常有用，同时又无需共享敏感信息。

让我们编辑 Svelte 应用以显示一些环境变量，然后在 Deno Deploy 控制台中设置这些变量并在本地使用它们。

首先，添加一些 TypeScript 代码以在 Svelte 应用中读取环境变量。新建文件 `src/routes/+page.server.ts`，内容如下：

```ts title="src/routes/+page.server.ts"
import type { PageServerLoad } from "./$types.d.ts";

export const load: PageServerLoad = async () => {
  return {
    message: Deno.env.get("TUTORIAL_MESSAGE") ?? "set TUTORIAL_MESSAGE",
    username: Deno.env.get("TUTORIAL_USERNAME") ?? "Svelte developer",
    accent: Deno.env.get("TUTORIAL_ACCENT") ?? "#ff3e00",
  };
};
```

这会加载三个环境变量：`TUTORIAL_MESSAGE`、`TUTORIAL_USERNAME` 和 `TUTORIAL_ACCENT`，若未设置，则使用默认值。

接着我们修改 Svelte 页面以显示这些值：

```svelte title="src/routes/+page.svelte"
<script lang="ts">
	export let data: {
		message: string;
		username: string;
		accent: string;
	};

	const { message, username, accent } = data;
</script>

<h1>环境变量示例</h1>
<p>
    这条信息是从 <code>PUBLIC_TUTORIAL_MESSAGE</code> 读取的：<br />
    <strong style="color: {accent}">{message}</strong>
</p>
<p>
    你好 <strong style="color: {accent}">{username}</strong>！尝试编辑你的环境变量并刷新页面，你将在构建时看到值的变化。
</p>
```

最后，我们需要在 Deno Deploy 控制台设置这些环境变量。

进入你的 Deno Deploy 项目仪表盘，点击 **Settings** 标签页，然后在 **Environment Variables** 部分点击 **Create a new Environment Variable**。

点击 **+ Add Variable** 三次，添加以下变量：

| 名称               | 值                                   |
| ------------------ | ------------------------------------ |
| TUTORIAL_MESSAGE   | This message is set in Deno Deploy  |
| TUTORIAL_USERNAME  | [你的名字]                          |
| TUTORIAL_ACCENT    | #0099ff                             |

点击 **Save** 按钮保存环境变量。

现在你可以再次用隧道运行你的 Svelte 应用：

```sh
deno run --tunnel dev
```

访问本地或公共 URL 时，你都应该看到环境变量生效的效果！

你可能注意到，在 Deno Deploy 控制台创建环境变量时，有一个 **Contexts** 下拉菜单。这允许你为不同的部署上下文（例如生产环境和本地环境）设置不同的环境变量。

尝试为 `local` 上下文创建不同的值，然后用 `--tunnel` 标志运行你的应用，体验本地上下文环境变量的效果。

🦕 现在你已经知道如何使用 `--tunnel` 标志，可以安全地将本地开发服务器暴露给互联网，并轻松测试环境特定配置。为什么不接着尝试添加数据库连接呢？查看 [隧道数据库教程](/examples/tunnel_database_tutorial/)，学习如何使用隧道功能将你的本地应用连接到数据库。