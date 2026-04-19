---
last_modified: 2025-10-02
title: "使用 Next.js 构建应用"
description: "使用 Deno 构建 Next.js 应用的循序渐进指南。学习如何搭建项目、创建 API 路由、实现服务端渲染，以及构建完整的全栈 TypeScript 应用。"
url: /examples/next_tutorial/
oldUrl:
  - /runtime/tutorials/how_to_with_npm/next/
---

[Next.js](https://nextjs.org/) 是一个用于构建服务器端渲染应用的流行框架。它基于 React 构建，并开箱即用提供了许多功能。

在本教程中，我们将使用 Deno 运行一个
[简单的 Next.js 应用](https://tutorial-with-next.deno.deno.net/)。该应用会展示一个恐龙列表。当你点击其中一个时，会跳转到对应恐龙的详情页面。

你可以查看
[GitHub 上的完整应用代码](https://github.com/denoland/tutorial-with-next/tree/main)。

:::info 部署你自己的应用

想跳过教程，立即部署完成的应用？点击下面按钮，立刻将完整的 SvelteKit 恐龙应用副本部署到 Deno Deploy。你将获得一个可运行、可自定义、可修改的实时代码！

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-next)

:::

## 使用 Deno 创建一个 Next.js 应用

Next 提供了一个 CLI 工具，可以快速创建新的 Next.js 应用。在终端运行以下命令，使用 Deno 创建新的 Next.js 应用：

```sh
deno run -A npm:create-next-app@latest
```

当提示时，选择默认选项以创建带有 TypeScript 的新 Next.js 应用。

Next.js 的一些依赖仍然依赖 `Object.prototype.__proto__`，并且需要 CommonJS 模块支持。为让 Deno 兼容 Next.js，请更新你的 `deno.json` 文件，使用以下配置：

```json deno.json
{
  "unstable": [
    "bare-node-builtins",
    "detect-cjs",
    "node-globals",
    "unsafe-proto",
    "sloppy-imports"
  ]
}
```

现在你可以运行你的新的 Next.js 应用：

```sh
deno task dev
```

这会使用 Deno 启动 Next.js 开发服务器。`deno task dev` 命令会在启动时带上必要的标志，以启用对 CommonJS 的 Next.js 开发服务器支持。

访问 [http://localhost:3000](http://localhost:3000) 在浏览器中查看应用。

## 添加后台服务

下一步是添加后台 API。我们将创建一个非常简单的 API，用于返回关于恐龙的信息。

我们会使用 Next.js 内置的
[API 路由处理](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
来设置恐龙 API。Next.js 使用基于文件系统的路由，文件夹结构直接定义路由。

我们将定义三个路由：第一个 `/api` 路由返回字符串 `欢迎来到恐龙 API`，然后 `/api/dinosaurs` 返回所有恐龙的数据，最后 `/api/dinosaurs/[dinosaur]` 根据 URL 中的名称返回特定恐龙。

### /api/

在新项目的 `src/app` 文件夹中创建一个 `api` 文件夹，在该文件夹中创建 `route.ts` 文件，用于处理 `/api` 路由。

将以下代码复制粘贴到 `api/route.ts` 文件中：

```ts title="route.ts"
export function GET() {
  return Response.json("welcome to the dinosaur API");
}
```

此代码定义了一个简单的路由处理器，返回包含字符串 `welcome to the dinosaur API` 的 JSON 响应。

### /api/data.json

在 `api` 文件夹中，创建一个 `data.json` 文件，并填入硬编码的恐龙数据。将
[这个 JSON 文件](https://raw.githubusercontent.com/denoland/deno-vue-example/main/api/data.json)
复制粘贴到 `data.json` 文件中。

### /api/dinosaurs

在 `api` 文件夹中，创建一个名为 `dinosaurs` 的文件夹，并在其中创建一个 `route.ts` 文件来处理 `/api/dinosaurs` 请求。该路由将读取 `data.json` 文件，并返回所有恐龙的 JSON 数据：

```ts title="route.ts"
import data from "./data.json" with { type: "json" };

export function GET() {
  return Response.json(data);
}
```

### /api/dinosaurs/[dinosaur]

对于最后一个路由 `/api/dinosaurs/[dinosaur]`，在 `dinosaurs` 目录中创建一个 `[dinosaur]` 文件夹。在其中创建 `route.ts` 文件。该文件将读取 `data.json`，根据 URL 中的名称查找对应恐龙并以 JSON 返回：

```ts title="route.ts"
import data from "../../data.json" with { type: "json" };

type RouteParams = { params: Promise<{ dinosaur: string }> };

export const GET = async (_request: Request, { params }: RouteParams) => {
  const { dinosaur } = await params;

  if (!dinosaur) {
    return Response.json("未提供恐龙名称。");
  }

  const dinosaurData = data.find((item) =>
    item.name.toLowerCase() === dinosaur.toLowerCase()
  );

  return Response.json(dinosaurData ? dinosaurData : "未找到该恐龙。");
};
```

现在，如果你运行应用并访问
`http://localhost:3000/api/dinosaurs/brachiosaurus`，应该就能看到关于腕龙的详细信息。

## 构建前端

现在我们已经设置了后台 API，接下来构建前端页面以展示恐龙数据。

### 定义恐龙类型

首先，我们添加一个类型定义，用于描述恐龙数据结构。在 `app` 目录中创建 `types.ts` 文件，并添加以下代码：

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### 更新首页

修改 `app` 目录中的 `page.tsx` 文件，从我们的 API 获取恐龙数据，并以链接列表的形式显示。

在 Next.js 中，如果有客户端代码，需要在文件顶部添加 `"use client"` 指令。然后导入该页面需要的模块，并导出用于渲染页面的默认函数：

```tsx title="page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "./types";
import Link from "next/link";

export default function Home() {
}
```

在 `Home` 函数体内，定义一个状态变量用于存储恐龙数据，并在组件挂载时使用 `useEffect` 钩子从 API 拉取数据：

```tsx title="page.tsx"
const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

useEffect(() => {
  (async () => {
    const response = await fetch(`/api/dinosaurs`);
    const allDinosaurs = await response.json() as Dino[];
    setDinosaurs(allDinosaurs);
  })();
}, []);
```

接着，在 `Home` 函数体内返回一个链接列表：每个链接指向对应的恐龙页面：

```tsx title="page.tsx"
return (
  <main id="content">
    <h1>Welcome to the Dinosaur app</h1>
    <p>Click on a dinosaur below to learn more.</p>
    <ul>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <li key={dinosaur.name}>
            <Link href={`/${dinosaur.name.toLowerCase()}`}>
              {dinosaur.name}
            </Link>
          </li>
        );
      })}
    </ul>
  </main>
);
```

### 创建恐龙详情页面

在 `app` 目录下创建名为 `[dinosaur]` 的文件夹，并在其中创建 `page.tsx` 文件。该文件将从 API 获取特定恐龙详情并进行渲染。

和首页类似，我们添加客户端代码的导入，并导出默认函数，同时将入参进行类型标注：

```tsx title="[dinosaur]/page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "../types";
import Link from "next/link";

type RouteParams = { params: Promise<{ dinosaur: string }> };

export default function Dinosaur({ params }: RouteParams) {
}
```

在 `Dinosaur` 函数中，获取 URL 中选定的恐龙名称，定义状态变量用于存储恐龙信息，并在挂载时通过 `useEffect` 钩子从 API 获取数据：

```tsx title="[dinosaur]/page.tsx"
const selectedDinosaur = params.then((params) => params.dinosaur);
const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

useEffect(() => {
  (async () => {
    const resp = await fetch(`/api/dinosaurs/${await selectedDinosaur}`);
    const dino = await resp.json() as Dino;
    setDino(dino);
  })();
}, []);
```

最后，在组件中返回用于展示恐龙名称及描述的元素：

```tsx title="[dinosaur]/page.tsx"
return (
  <main id="content">
    <h1>{dinosaur.name}</h1>
    <p>{dinosaur.description}</p>
    <Link href="/">🠠 返回所有恐龙</Link>
  </main>
);
```

### 添加样式

为应用添加基础样式以使界面更美观。更新 `app/globals.css` 文件，并使用
[此文件中的样式](https://raw.githubusercontent.com/denoland/tutorial-with-next/refs/heads/main/src/app/globals.css)。

## 运行应用

现在，你可以用 `deno run dev` 启动应用，然后在浏览器访问 `http://localhost:3000` 查看恐龙列表。点击恐龙即可看到更详细的信息！

## 部署应用

既然你的 Next.js 应用已经运行起来，你可以使用 Deno Deploy<sup>EA</sup> 将其部署到线上。

最佳体验是直接从 GitHub 部署，并自动设置持续部署。先创建一个 GitHub 仓库并上传应用。

[创建新的 GitHub 仓库](https://github.com/new)，然后初始化并推送应用：

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'my next app'
git push -u origin main
```

当你的应用部署到 GitHub 后，你就可以
[部署到 Deno Deploy<sup>EA</sup>](https://console.deno.com/)。

想了解部署详情，请查看 
[Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

🦕 现在你可以使用 Deno 构建并运行一个 Next.js 应用了！如果想进一步扩展，你可以考虑
[添加数据库](/runtime/tutorials/connecting_to_databases/) 来替代 `data.json` 文件，或尝试
[编写测试](/runtime/fundamentals/testing/) 以确保应用稳定，为生产环境做好准备。