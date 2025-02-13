---
title: "使用 Deno 构建 Qwik"
url: /examples/qwik_tutorial/
---

[Qwik](https://qwik.dev/) 是一个 JavaScript 框架，通过利用可恢复性而不是水合，提供即时加载的 Web 应用程序。在本教程中，我们将构建一个简单的 Qwik 应用程序，并使用 Deno 运行它。该应用将显示恐龙列表。当你点击其中一只恐龙时，会将你带到一个包含更多细节的恐龙页面。

我们将讨论如何使用 Deno 构建一个简单的 Qwik 应用：

- [搭建一个 Qwik 应用](#scaffold-a-qwik-app)
- [设置数据和类型定义](#setup-data-and-type-definitions)
- [构建前端](#build-the-frontend)
- [后续步骤](#next-steps)

可以直接跳转到
[源码](https://github.com/denoland/examples/tree/main/with-qwik)，或者继续往下阅读！

## 搭建一个 Qwik 应用

我们可以通过 Deno 创建一个新的 Qwik 项目，如下所示：

```bash
deno init --npm qwik@latest
```

这将指导你完成 Qwik 和 Qwik City 的设置过程。在这里，我们选择了最简单的“空应用”部署，具有 npm 依赖项。

完成后，你将拥有如下的项目结构：

```
.
├── node_modules/
├── public/
└── src/
    ├── components/
    │   └── router-head/
    │       └── router-head.tsx
    └── routes/
        ├── index.tsx
        ├── layout.tsx
        ├── service-worker.ts
        ├── entry.dev.tsx
        ├── entry.preview.tsx
        ├── entry.ssr.tsx
        ├── global.css
        └── root.tsx
├── .eslintignore
├── .eslintrc.cjs
├── .gitignore
├── .prettierignore
├── package-lock.json
├── package.json
├── qwik.env.d.ts
├── README.md
├── tsconfig.json
└── vite.config.ts
```

大部分都是我们不会触碰的样板配置。了解 Qwik 如何工作的几个重要文件包括：

- `src/components/router-head/router-head.tsx`：管理你的 Qwik 应用中不同路由的 HTML 头元素（例如标题、元标签等）。
- `src/routes/index.tsx`：应用的主要入口点和用户访问根 URL 时看到的主页。
- `src/routes/layout.tsx`：定义包裹页面的常见布局结构，使你能够维护一致的 UI 元素，如页眉和页脚。
- `src/routes/service-worker.ts`：处理渐进式 Web 应用（PWA）功能、离线缓存和应用的后台任务。
- `src/routes/entry.ssr.tsx`：控制你的应用如何进行服务器端渲染，管理初始 HTML 生成和水合过程。
- `src/routes/root.tsx`：作为应用程序的外壳的根组件，包含全局提供者和主要路由结构。

现在我们可以在应用程序中构建自己的路由和文件。

## 设置数据和类型定义

我们将首先将我们的
[恐龙数据](https://github.com/denoland/examples/blob/main/with-qwik/src/data/dinosaurs.json)
添加到新的 `./src/data` 目录中，命名为 `dinosaurs.json`：

```jsonc
// ./src/data/dinosaurs.json

{
  "dinosaurs": [
    {
      "name": "霸王龙",
      "description": "一种巨大的肉食性恐龙，拥有强大的下颚和小巧的手臂。"
    },
    {
      "name": "腕龙",
      "description": "一种巨大的草食性恐龙，拥有非常长的脖子。"
    },
    {
      "name": "迅猛龙",
      "description": "一种小型但凶猛的掠食者，通常以群体狩猎。"
    }
    // ...
  ]
}
```

这就是我们的数据将从中提取的地方。在完整的应用中，这些数据将来自数据库。

> ⚠️️ 在本教程中，我们硬编码了数据。但是你可以连接到
> [多种数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/) 和
> [甚至使用 ORM，如 Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/)与
> Deno。

接下来，让我们为我们的恐龙数据添加类型定义。我们将其放在 `./src/types.ts` 中：

```tsx
// ./src/types.ts

export type Dino = {
  name: string;
  description: string;
};
```

接下来，让我们添加 API 路由来提供这些数据。

## 添加 API 路由

首先，让我们创建一个路由，以加载主页的所有恐龙。此 API 端点使用 Qwik City 的
[`RequestHandler`](https://qwik.dev/docs/advanced/request-handling/) 创建一个 `GET` 端点，加载并返回我们的恐龙数据，并使用 json 帮助器进行适当的响应格式化。我们将在 `./src/routes/api/dinosaurs/index.ts` 中添加以下内容：

```tsx
// ./src/routes/api/dinosaurs/index.ts

import { RequestHandler } from "@builder.io/qwik-city";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const onGet: RequestHandler = async ({ json }) => {
  const dinosaurs = data;
  json(200, dinosaurs);
};
```

接下来，让我们创建一个 API 路由，以获取单个恐龙的信息。这个路由将从 URL 获取参数，并用它来在我们的恐龙数据中进行搜索。我们将以下代码添加到 `./src/routes/api/dinosaurs/[name]/index.ts`：

```tsx
// ./src/routes/api/dinosaurs/[name]/index.ts

import { RequestHandler } from "@builder.io/qwik-city";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const onGet: RequestHandler = async ({ params, json }) => {
  const { name } = params;
  const dinosaurs = data;

  if (!name) {
    json(400, { error: "未提供恐龙名称。" });
    return;
  }

  const dinosaur = dinosaurs.find(
    (dino) => dino.name.toLowerCase() === name.toLowerCase(),
  );

  if (!dinosaur) {
    json(404, { error: "未找到恐龙。" });
    return;
  }

  json(200, dinosaur);
};
```

现在 API 路由已连接并提供数据，让我们创建两个前端页面：主页和单个恐龙详情页。

## 构建前端

我们将通过更新 `./src/routes/index.tsx` 文件来创建我们的主页，使用 Qwik 的 [`routeLoader$`](https://qwik.dev/docs/route-loader/) 进行服务器端数据获取。这个 `component$` 在 SSR 期间通过 `useDinosaurs()` 加载并渲染恐龙数据：

```tsx
// ./src/routes/index.tsx

import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Dino } from "~/types";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const useDinosaurs = routeLoader$(() => {
  return data;
});

export default component$(() => {
  const dinosaursSignal = useDinosaurs();

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">欢迎来到恐龙应用</h1>
      <p class="mb-4">点击下面的恐龙以了解更多信息。</p>
      <ul class="space-y-2">
        {dinosaursSignal.value.dinosaurs.map((dinosaur: Dino) => (
          <li key={dinosaur.name}>
            <Link
              href={`/${dinosaur.name.toLowerCase()}`}
              class="text-blue-600 hover:underline"
            >
              {dinosaur.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});
```

现在我们有了主要的主页，让我们为单个恐龙信息添加一个页面。我们将使用 Qwik 的
[动态路由](https://qwik.dev/docs/routing/)，以 `[name]` 作为每个恐龙的关键字。此页面利用 `routeLoader$` 根据 URL 参数获取单个恐龙的详细信息，并内置错误处理以防无法找到恐龙。

该组件与我们的主页使用相同的 SSR 模式，但使用基于参数的数据加载，并为单个恐龙详情显示一个更简单的布局：

```tsx
// ./src/routes/[name]/index.tsx

import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import type { Dino } from "~/types";
import data from "~/data/dinosaurs.json" with { type: "json" };

export const useDinosaurDetails = routeLoader$(({ params }): Dino => {
  const { dinosaurs } = data;
  const dinosaur = dinosaurs.find(
    (dino: Dino) => dino.name.toLowerCase() === params.name.toLowerCase(),
  );

  if (!dinosaur) {
    throw new Error("未找到恐龙");
  }

  return dinosaur;
});

export default component$(() => {
  const dinosaurSignal = useDinosaurDetails();

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">{dinosaurSignal.value.name}</h1>
      <p class="mb-4">{dinosaurSignal.value.description}</p>
      <Link href="/" class="text-blue-600 hover:underline">
        返回所有恐龙
      </Link>
    </div>
  );
});
```

现在我们已经构建了我们的路由和前端组件，我们可以运行我们的应用：

```bash
deno task dev
```

这将启动应用程序，地址为 `localhost:5173`：

<figure>

<video class="w-full" alt="使用 Deno 构建的 Qwik 应用。" autoplay muted loop playsinline src="./images/how-to/qwik/demo.mp4"></video>

</figure>

完成！

## 后续步骤

🦕 现在你可以使用 Deno 构建和运行 Qwik 应用！以下是一些可以增强你恐龙应用的方法：

下一步可能是使用 Qwik 的延迟加载功能来加载恐龙图像和其他组件，或为复杂功能添加客户端状态管理。

- 添加持久数据存储
  [使用像 Postgres 或 MongoDB 的数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
  和像 [Drizzle](https://docs.deno.com/examples/drizzle_tutorial/) 或
  [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) 的 ORM
- 使用 Qwik 的延迟加载功能来处理恐龙图像和组件
- 添加客户端状态管理
- 将你的应用自托管到
  [AWS](https://docs.deno.com/runtime/tutorials/aws_lightsail/),
  [Digital Ocean](https://docs.deno.com/runtime/tutorials/digital_ocean/), 和
  [Google Cloud Run](https://docs.deno.com/runtime/tutorials/google_cloud_run/)