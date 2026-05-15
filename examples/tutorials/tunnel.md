---
last_modified: 2026-05-14
title: "通过 Tunnel 共享你的本地服务器"
description: "使用 --tunnel 选项即时暴露一个公共 URL"
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

`--tunnel` 标志内置于 Deno CLI 中。它会从一个公共的 Deno Deploy URL 打开一条安全的 HTTPS 隧道到你本地机器上运行的服务器，因此请求会像发送到已部署应用一样到达你的本地进程。公共 URL 绑定到你在上一步创建的 Deploy 项目；每次重新启动隧道时它都保持不变，这使得你可以安全地将它粘贴到 webhook 配置中，或与同事共享，而无需在每次会话时提供一个新的 URL。

`--tunnel` 可用于任何运行长时间服务的子命令，因此你可以将它与 `deno run`、`deno task` 或 `deno serve` 配合使用。在本教程中，我们将为 Svelte 的 `dev` 任务建立隧道：

```sh
deno run --tunnel dev
```

第一次运行时，浏览器会打开，以便你使用 Deno Deploy 账户进行身份验证；后续运行会复用缓存的凭据。几分钟后，你应该会看到类似如下的输出：

```console
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
You are connected to https://my-app-name.myusername.deno.net
```

现在，这个公共 URL（本例中的 `https://my-app-name.myusername.deno.net`）可以从互联网上任何地方访问：你可以把它分享给同事，指向一个 webhook，或者在另一网络下用手机打开它来测试移动端布局。你对本地代码所做的更改会实时反映到公共 URL 上，就像本地开发一样。

要停止隧道，请在终端中按 `Ctrl+C`。公共 URL 会离线，直到你再次启动隧道。Deno Deploy 上该项目的已部署版本不会受到影响，`--tunnel` 只会在本地命令运行期间转发流量。

:::tip

如果你想暴露不同的本地端口（例如运行在 `localhost:8000` 的后端，而不是 Vite 开发服务器），可以针对监听该端口的文件运行 `deno serve --tunnel`。隧道总是会转发到 Deno 命令启动的那个服务器。

:::

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
  这条消息从 <code>PUBLIC_TUTORIAL_MESSAGE</code> 读取：<br />
  <strong style="color: {accent}">{message}</strong>
</p>
<p>
  你好，<strong style="color: {accent}">{username}</strong>！试着编辑你的环境变量并刷新页面，看看值如何在构建时发生变化。
</p>
```

最后，我们需要在 Deno Deploy 控制台设置这些环境变量。

进入你的 Deno Deploy 项目仪表盘，点击 **Settings** 标签页，然后在 **Environment Variables** 部分点击 **Create a new Environment Variable**。

点击 **+ Add Variable** 三次，添加以下变量：

| 名称               | 值                                   |
| ------------------ | ------------------------------------ |
| TUTORIAL_MESSAGE   | 此消息已在 Deno Deploy 中设置        |
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