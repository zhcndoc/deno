---
last_modified: 2025-03-10
title: "使用 Tanstack 和 Deno 构建应用"
description: "使用 Tanstack 和 Deno 构建应用的完整指南。学习如何实现 Query 进行数据获取，Router 进行导航，管理服务器状态，并创建类型安全的全栈应用。"
url: /examples/tanstack_tutorial/
---

[Tanstack](https://tanstack.com/) 是一套与框架无关的数据管理工具。
借助 Tanstack，开发者可以使用
[Query](https://tanstack.com/query/latest) 高效管理服务器状态，
使用 [Table](https://tanstack.com/table/latest) 创建强大的表格，
使用 [Router](https://tanstack.com/router/latest) 处理复杂路由，
并使用 [Form](https://tanstack.com/form/latest) 构建类型安全的表单。
这些工具能在 [React](/examples/react_tutorial)、[Vue](/examples/vue_tutorial)、
[Solid](/examples/solidjs_tutorial) 和其他框架中无缝协作，同时保持出色的 TypeScript 支持。

在本教程中，我们将使用
[Tanstack Query](https://tanstack.com/query/latest) 和
[Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/quick-start)
构建一个简单的应用。
该应用将展示一份恐龙列表。你点击其中一只时，会跳转到包含更多细节的恐龙详情页面。

- [从后端 API 开始](#start-with-the-backend-api)
- [创建一个由 Tanstack 驱动的前端](#create-tanstack-driven-frontend)
- [下一步](#next-steps)

你可以直接跳到
[源代码](https://github.com/denoland/examples/tree/main/with-tanstack)
或继续在下面跟着做！

## 从后端 API 开始

在我们的主目录中，先创建一个 `api/` 目录，并准备恐龙数据文件 `api/data.json`：

```jsonc
// api/data.json

[
  {
    "name": "Aardonyx",
    "description": "蜥脚类的进化早期阶段。"
  },
  {
    "name": "Abelisaurus",
    "description": "“Abel 的蜥蜴”已根据一具单独的头骨重建。"
  },
  {
    "name": "Abrictosaurus",
    "description": "异齿龙（Heterodontosaurus）的早期近亲。"
  },
  ...
]
```

这里就是我们将从中读取数据的地方。在完整应用中，这些数据
将来自数据库。

> ⚠️️ 在本教程中我们是把数据写死（hard code）的。但你可以连接
> [多种数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/) 并且
> 甚至可以使用像 [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) 这样的 ORM
> 来配合 Deno 使用。

接下来，让我们创建我们的 [Hono](https://hono.dev/) 服务器。
我们从 [JSR](https://jsr.io) 使用 `deno add` 安装 Hono：

```shell
deno add jsr:@hono/hono
```

然后，让我们创建一个 `api/main.ts` 文件，并用下面的代码来填充它。注意
我们需要导入
[`@hono/hono/cors`](https://hono.dev/docs/middleware/builtin/cors)，并定义一些关键属性，
以允许前端访问 API 路由。

```ts
// api/main.ts

import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import data from "./data.json" with { type: "json" };

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  }),
);

app.get("/", (c) => {
  return c.text("欢迎来到恐龙 API！");
});

app.get("/api/dinosaurs", (c) => {
  return c.json(data);
});

app.get("/api/dinosaurs/:dinosaur", (c) => {
  if (!c.req.param("dinosaur")) {
    return c.text("未提供恐龙名称。");
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === c.req.param("dinosaur").toLowerCase()
  );

  if (dinosaur) {
    return c.json(dinosaur);
  } else {
    return c.notFound();
  }
});

Deno.serve(app.fetch);
```

Hono 服务器提供两个 API 端点：

- `GET /api/dinosaurs` 用于获取所有恐龙，以及
- `GET /api/dinosaurs/:dinosaur` 用于按名称获取特定恐龙

在我们开始开发前端之前，先来更新一下 `deno.json` 文件中的
`deno tasks`。你的配置应该类似下面这样：

```jsonc
{
  "tasks": {
    "dev": "deno --allow-env --allow-net api/main.ts"
  }
  // ...
}
```

现在，当我们运行 `deno task dev` 时，后端服务器将会在 `localhost:8000`
启动。

## 创建一个由 Tanstack 驱动的前端

让我们创建会使用这些数据的前端。首先，我们将在当前目录中使用
TypeScript 模板，用 Vite 快速脚手架一个新的 React 应用：

```shell
deno init --npm vite@latest --template react-ts ./
```

接着，我们安装 Tanstack 相关的依赖：

```shell
deno install npm:@tanstack/react-query npm:@tanstack/react-router
```

然后，更新一下 `deno.json` 里的 `deno tasks`，以添加用于启动 Vite
服务器的命令：

```jsonc
// deno.json
{
  "tasks": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno --allow-env --allow-net api/main.ts",
    "dev:vite": "deno -A npm:vite"
  }
  // ...
}
```

接下来我们可以开始构建组件。我们的应用需要两个主要页面：

- `DinosaurList.tsx`：索引页，用于列出所有恐龙，以及
- `Dinosaur.tsx`：叶子页面，用于展示单只恐龙的信息

我们先创建一个新的 `./src/components` 目录，在其中创建文件
`DinosaurList.tsx`：

```ts
// ./src/components/DinosaurList.tsx

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

async function fetchDinosaurs() {
  const response = await fetch("http://localhost:8000/api/dinosaurs");
  if (!response.ok) {
    throw new Error("Failed to fetch dinosaurs");
  }
  return response.json();
}

export function DinosaurList() {
  const {
    data: dinosaurs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dinosaurs"],
    queryFn: fetchDinosaurs,
  });

  if (isLoading) return <div>加载中...</div>;
  if (error instanceof Error) {
    return <div>发生错误：{error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">恐龙列表</h2>
      <ul className="space-y-2">
        {dinosaurs?.map((dino: { name: string; description: string }) => (
          <li key={dino.name}>
            <Link
              to="/dinosaur/$name"
              params={{ name: dino.name }}
              className="text-blue-500 hover:underline"
            >
              {dino.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

这里使用了
[`useQuery`](https://tanstack.com/query/v4/docs/framework/react/guides/queries)
来自 **Tanstack Query**，用于自动获取并缓存恐龙数据，同时提供内置的
加载与错误状态。然后它使用
[`Link`](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent)
来自 **Tanstack Router**，来创建带类型安全路由参数的客户端导航链接。

接下来，我们在 `./src/components/` 目录下创建 `DinosaurDetail.tsx`
组件，用于展示单只恐龙的详情：

```ts
// ./src/components/DinosaurDetail.tsx

import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

async function fetchDinosaurDetail(name: string) {
  const response = await fetch(`http://localhost:8000/api/dinosaurs/${name}`);
  if (!response.ok) {
    throw new Error("Failed to fetch dinosaur detail");
  }
  return response.json();
}

export function DinosaurDetail() {
  const { name } = useParams({ from: "/dinosaur/$name" });
  const {
    data: dinosaur,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dinosaur", name],
    queryFn: () => fetchDinosaurDetail(name),
  });

  if (isLoading) return <div>加载中...</div>;
  if (error instanceof Error) {
    return <div>发生错误：{error.message}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{name}</h2>
      <p>{dinosaur?.description}</p>
    </div>
  );
}
```

同样地，这里使用 **Tanstack Query** 的 `useQuery` 来获取并缓存
单只恐龙的详情，并且
[`queryKey`](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
包含恐龙名称，以确保正确的缓存行为。此外，我们使用
[`useParams`](https://tanstack.com/router/v1/docs/framework/react/api/router/useParamsHook)
来自 **Tanstack Router**，用于安全地从 URL 中提取并为我们路由配置中定义的参数
提供类型支持。

在运行之前，我们需要将这些组件封装进一个布局（layout）中。
我们在 `./src/components/` 目录下再创建一个文件：`Layout.tsx`：

```ts
// ./src/components/Layout.tsx

export function Layout() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">恐龙百科全书</h1>
      <nav className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          首页
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
```

你可能已经注意到，新创建的布局底部附近的
[`Outlet`](https://tanstack.com/router/v1/docs/framework/react/guide/outlets)
组件。这个组件来自 **Tanstack Router**，用于渲染子路由的内容，
从而在保持一致的布局结构的同时，实现嵌套路由。

接下来，我们需要把这个布局接入 `./src/main.tsx`，它是一个重要的文件：
用于为管理服务器状态设置 Tanstack Query client，
并为处理导航设置 Tanstack Router。

```ts
// ./src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

你会注意到我们导入了
[`QueryClientProvider`](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider)，
它会把整个应用包裹起来，从而支持查询缓存与状态管理。
我们还导入了 `RouterProvider`，用于把我们定义的路由连接到 React 的渲染系统。

最后，我们需要在 `./src/` 目录下定义一个
[`routeTree.tsx`](https://tanstack.com/router/v1/docs/framework/react/guide/route-trees)
文件。这个文件使用 Tanstack Router 的类型安全路由定义，
来描述我们应用的路由结构：

```ts
// ./src/routeTree.tsx

import { RootRoute, Route } from "@tanstack/react-router";
import { DinosaurList } from "./components/DinosaurList";
import { DinosaurDetail } from "./components/DinosaurDetail";
import { Layout } from "./components/Layout";

const rootRoute = new RootRoute({
  component: Layout,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DinosaurList,
});

const dinosaurRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "dinosaur/$name",
  component: DinosaurDetail,
});

export const routeTree = rootRoute.addChildren([indexRoute, dinosaurRoute]);
```

在 `./src/routeTree.tsx` 中，我们创建了一层以 `Layout` 作为根组件的路由层级。
然后我们再配置两个子路由：它们的路径与组件——一个用于恐龙列表，
`DinosaurList`；另一个用于单只恐龙详情，并带有动态参数，
`DinosaurDetail`。

完成这些之后，我们就可以运行这个项目了：

```shell
deno task dev
```

<figure>

<video class="w-full" alt="使用 Deno 和 Tanstack 构建应用。" autoplay muted loop playsinline src="./images/how-to/tanstack/demo.mp4"></video>

</figure>

## 下一步

这只是用 Deno 和 Tanstack 进行开发的起点。你可以添加
持久化数据存储，例如
[使用像 Postgres 或 MongoDB 这样的数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
以及像 [Drizzle](https://deno.com/blog/build-database-app-drizzle) 或
[Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) 这样的 ORM。或者将你的应用部署到
[AWS](https://docs.deno.com/runtime/tutorials/aws_lightsail/),
[Digital Ocean](https://docs.deno.com/runtime/tutorials/digital_ocean/)，或
[Google Cloud Run](https://docs.deno.com/runtime/tutorials/google_cloud_run/)

你还可以使用
[Tanstack Query 的自动重新获取功能](https://tanstack.com/query/latest/docs/framework/react/examples/auto-refetching)
来添加实时更新，
针对大型恐龙列表
[实现无限滚动](https://tanstack.com/query/latest/docs/framework/react/examples/load-more-infinite-scroll)，或
通过使用 **[Tanstack Table](https://tanstack.com/table/latest)** 来
[添加复杂的筛选和排序](https://tanstack.com/table/v8/docs/guide/column-filtering)。
Deno 内置的 Web 标准、工具链以及原生 TypeScript 支持，
再加上 Tanstack 强大的数据管理能力，为构建健壮的 Web 应用打开了无数可能性。
