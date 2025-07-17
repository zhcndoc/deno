---
title: "构建一个 SvelteKit 应用"
description: "一个使用 Deno 构建 SvelteKit 应用的教程。学习如何设置 SvelteKit 项目，实现基于文件的路由，使用 load 函数管理状态，以及创建全栈 TypeScript 应用。"
url: /examples/svelte_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/svelte/
  - /runtime/tutorials/how_to_with_npm/svelte/
---

[SvelteKit](https://kit.svelte.dev/) 是一个基于 
[Svelte](https://svelte.dev/) 构建的 Web 框架，Svelte 是一个现代的前端编译器，能构建高度优化的原生 JavaScript。SvelteKit 提供了文件路由、服务端渲染和全栈能力等功能。

在本教程中，我们将使用 Deno 构建一个简单的 SvelteKit 应用。该应用会显示一组恐龙列表。点击某个恐龙，将跳转到该恐龙的详情页面。你可以在 [GitHub 上查看完成的应用](https://github.com/denoland/tutorial-with-svelte)。

你也可以在 [Deno Deploy](https://tutorial-with-svelte.deno.deno.net/) 上看到该应用的在线版本。

:::info 部署你的应用

你可以立即将此 Svelte 应用部署到 Deno Deploy。只需点击按钮！

[![Deploy on Deno](https://deno.com/button)](https://app.deno.com/new?clone=https://github.com/denoland/tutorial-with-svelte)

:::

## 使用 Deno 创建 SvelteKit 应用

我们将使用 [SvelteKit](https://kit.svelte.dev/) 来创建一个新的 SvelteKit 应用。在终端中运行下列命令创建新应用：

```shell
deno run -A npm:create-svelte
```

按提示输入你的应用名称，选择“Skeleton project”模板。被问到是否使用 TypeScript 时，选择“是，使用 TypeScript 语法”。

创建完成后，进入新项目目录并运行下列命令安装依赖：

```shell
deno install
```

然后运行下面命令启动你的 SvelteKit 应用：

```shell
deno task dev
```

Deno 会运行 `package.json` 中的 `dev` 任务，启动 Vite 开发服务器。点击输出的 localhost 链接，在浏览器中查看你的应用。

## 配置格式化工具

`deno fmt` 支持带有 
[`--unstable-component`](https://docs.deno.com/runtime/reference/cli/fmt/#formatting-options-unstable-component) 
参数的 Svelte 文件。使用命令：

```sh
deno fmt --unstable-component
```

若想让 `deno fmt` 始终格式化 Svelte 文件，在你的 `deno.json` 文件顶层添加：

```json
"unstable": ["fmt-component"]
```

## 添加后端 API

我们将使用 SvelteKit 内建的 API 能力构建 API 路由。SvelteKit 允许你通过在路由目录中创建 `+server.js` 或 `+server.ts` 文件来创建 API 终端。

在 `src/routes` 目录中创建 `api` 文件夹，在该文件夹内创建 `data.json`，用于存放硬编码的恐龙数据。

将该 [json 文件](https://github.com/denoland/tutorial-with-svelte/blob/main/src/routes/api/data.json) 复制粘贴到 `src/routes/api/data.json` 文件中。（如果是实际项目，通常会从数据库或外部 API 获取数据。）

接下来我们将构建一些返回恐龙信息的 API 路由。SvelteKit 提供简单的创建 API 端点的方式，使用服务器文件。

创建 `src/routes/api/dinosaurs/+server.ts` 处理 `/api/dinosaurs` 端点，返回全部恐龙数据：

```js title="src/routes/api/dinosaurs/+server.ts"
import { json } from "@sveltejs/kit";
import data from "../data.json" with { type: "json" };

export function GET() {
  return json(data);
}
```

然后创建 `src/routes/api/dinosaurs/[id]/+server.ts` 处理 `/api/dinosaurs/:id`，返回单个恐龙数据：

```ts title="src/routes/api/dinosaurs/[id]/+server.ts"
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import data from "../../data.json" with { type: "json" };

export const GET: RequestHandler = ({ params }) => {
  const dinosaur = data.find((item) => {
    return item.name.toLowerCase() === params.id.toLowerCase();
  });

  if (dinosaur) {
    return json(dinosaur);
  }

  return json({ error: "Not found" }, { status: 404 });
};
```

SvelteKit 会根据文件结构自动处理路由。`+server.ts` 文件定义 API 终点，而 `[id]` 文件夹创建了动态路由参数。

## 构建前端

### 基于文件的路由和数据加载

SvelteKit 使用基于文件的路由，`src/routes` 目录结构决定应用的路由。与 Vue Router 不同，你无需手动配置路由 —— SvelteKit 会基于文件自动创建路由。

在 SvelteKit 中，`+page.svelte` 文件定义页面组件，`+page.ts` 文件定义加载数据的函数，会在页面加载前执行。这样内置了服务端渲染和数据获取能力。

### 页面与组件

SvelteKit 将前端组织成页面和组件。页面由路由目录下的 `+page.svelte` 文件定义，组件是可复用的代码段，存放在项目任意位置。

每个 Svelte 组件文件包含三个可选部分：`<script>`、`<template>`（HTML）和 `<style>`。`<script>` 是 JavaScript/TypeScript 逻辑，模板是 HTML 标记，`<style>` 中是作用域 CSS。

我们将创建首页和单个恐龙详情页，并使用加载函数从 API 获取恐龙信息。

#### 首页

首页显示从 API 获取的恐龙列表。先创建 `src/routes/+page.ts` 加载恐龙数据：

```ts title="src/routes/+page.ts"
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`/api/dinosaurs`);
  const dinosaurs = await res.json();

  return { dinosaurs };
};
```

该加载函数会在服务端和客户端运行，数据传递给页面组件。`fetch` 函数由 SvelteKit 提供，兼容服务端和客户端环境。

接着修改 `src/routes/+page.svelte` 显示恐龙列表：

```html title="src/routes/+page.svelte"
<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let dinosaurs = data.dinosaurs;
</script>

<main>
  <h1>🦕 恐龙应用</h1>
  <p>点击下方恐龙了解更多信息。</p>
  {#each dinosaurs as dinosaur (dinosaur.name)}
  <a href="/{dinosaur.name.toLowerCase()}" class="dinosaur">
    {dinosaur.name}
  </a>
  {/each}
</main>
```

该代码使用 Svelte 的 [each 块](https://svelte.dev/docs/logic-blocks#each) 遍历 `dinosaurs` 数组，将每只恐龙渲染为一个链接。`{#each}` 是 Svelte 渲染列表的语法，`(dinosaur.name)` 提供每项的唯一 key。

#### 恐龙详情页

详情页显示单个恐龙信息。SvelteKit 通过方括号文件夹名称创建动态路由，`[dinosaur]` 文件夹捕获 URL 中的恐龙名称。

先创建 `src/routes/[dinosaur]/+page.ts` 加载单个恐龙数据：

```ts title="src/routes/[dinosaur]/+page.ts"
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch(`/api/dinosaurs/${params.dinosaur}`);
  const dinosaur = await res.json() as { name: string; description: string };

  if (res.status === 404) {
    return error(404, "未找到恐龙");
  }

  return { dinosaur };
};
```

该加载函数通过 `params` 对象访问 URL 参数 `dinosaur`。如果 API 返回 404，使用 SvelteKit 的 `error` 函数抛出 404 错误。

然后创建 `src/routes/[dinosaur]/+page.svelte` 显示恐龙详情：

```html title="src/routes/[dinosaur]/+page.svelte"
<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let dinosaur = data.dinosaur;
</script>

<div>
  <h1>{dinosaur.name}</h1>
  <p>{dinosaur.description}</p>
  <a href="/">🠠 返回所有恐龙</a>
</div>
```

该页面显示恐龙名和描述，并带有返回首页的链接。数据来源于加载函数，自动可用。

## 运行应用

既然已经设置好前端和后端 API 路由，我们可以运行应用。终端执行：

```shell
deno task dev
```

这会启动带有 Vite 的 SvelteKit 开发服务器。SvelteKit 会同时处理前端页面和我们创建的 API 路由，无需运行多线程服务器。

在浏览器中访问 `http://localhost:5173` 观看应用。点击恐龙查看详情！

你也可以访问 [Deno Deploy 在线版本](https://tutorial-with-svelte.deno.deno.net/)。

## 构建与部署

SvelteKit 内置构建能力。我们配置使用 Deno 适配器，优化构建以部署到兼容 Deno 的平台。执行以下命令构建生产版本：

```sh
deno task build
```

该命令会：

1. 使用 Vite 构建 SvelteKit 应用
2. 生成优化后的生产资源
3. 创建兼容 Deno 的服务端代码

构建后的应用可部署到支持 Deno 的平台，如 Deno Deploy。

你可以将应用部署到你喜欢的云服务。我们推荐使用 [Deno Deploy](https://deno.com/deploy)，简单便捷。你可以直接从 GitHub 部署，只需创建 GitHub 仓库并推送代码，然后连接到 Deno Deploy。

### 创建 GitHub 仓库

[新建一个 GitHub 仓库](https://github.com/new)，然后初始化并推送你的应用：

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'my svelte app'
git push -u origin main
```

### 部署到 Deno Deploy

应用托管在 GitHub 后，即可在 Deno Deploy<sup>EA</sup> 控制面板部署。
<a href="https://app.deno.com/" class="docs-cta deploy-cta deploy-button">部署我的应用</a>

想了解完整部署流程，请查看 [Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

🦕 现在你已经学会如何使用 Deno 适配器运行 SvelteKit 应用，准备好构建真实世界应用了！