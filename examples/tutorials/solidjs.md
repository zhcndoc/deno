---
title: "使用 Deno 构建 SolidJS 应用"
description: "Build a SolidJS application with Deno. Learn how to set up a project, implement reactive components, handle routing, create API endpoints with Hono, and build a full-stack TypeScript application."
url: /examples/solidjs_tutorial/
---

[SolidJS](https://www.solidjs.com/) 是一个声明式 JavaScript 库，用于
创建用户界面，强调细粒度的响应性和最小的开销。当与 Deno 的现代运行时环境相结合时，您将获得一个强大且高效的堆栈，用于构建 web 应用程序。在本教程中，
我们将构建一个简单的恐龙目录应用，演示这两种技术的关键特性。

我们将详细介绍如何使用 Deno 构建一个简单的 SolidJS 应用：

- [使用 Vite 搭建 SolidJS 应用](#scaffold-a-solidjs-app-with-vite)
- [设置 Hono 后端](#set-up-our-hono-backend)
- [创建我们的 SolidJS 前端](#create-our-solidjs-frontend)
- [后续步骤](#next-steps)

您可以直接跳到
[源代码](https://github.com/denoland/examples/tree/main/with-solidjs)
或按照下面的步骤进行操作！

## 使用 Vite 搭建 SolidJS 应用

让我们使用 [Vite](https://vite.dev/) 设置我们的 SolidJS 应用，这是一个现代的构建工具，提供了出色的开发体验，具备热模块替换和优化构建等特性。

```bash
deno init --npm vite@latest solid-deno --template solid-ts
```

我们的后端将由 [Hono](https://hono.dev/) 提供支持，我们可以通过 [JSR](https://jsr.io) 安装它。我们还将添加 `solidjs/router` 以实现客户端路由和恐龙目录页面之间的导航。

<figure>

```bash
deno add jsr:@hono/hono npm:@solidjs/router
```

<figcaption>
<a href="https://docs.deno.com/runtime/reference/cli/add/">
了解更多关于 <code>deno add</code> 和将 Deno 用作包管理器的信息。
</a>
</figcaption>
</figure>

我们还需要更新我们的 `deno.json` 文件，以包含一些任务和
`compilerOptions` 来运行我们的应用：

<figure>

```json
{
  "tasks": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net --allow-read api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    "build": "deno run -A npm:vite build",
    "serve": {
      "command": "deno task dev:api",
      "description": "运行构建，然后启动 API 服务器",
      "dependencies": ["deno task build"]
    }
  },
  "imports": {
    "@hono/hono": "jsr:@hono/hono@^4.6.12",
    "@solidjs/router": "npm:@solidjs/router@^0.14.10"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "solid-js",
    "lib": ["DOM", "DOM.Iterable", "ESNext"]
  }
}
```

<figcaption>
<a href="https://docs.deno.com/runtime/reference/cli/task/">您可以将 <code>tasks</code> 作为对象编写</a>。在这里，我们的 <code>serve</code> 命令包含一个 <code>description</code> 和 <code>dependencies</code>。
</figcaption>
</figure>

很好！接下来，让我们设置我们的 API 后端。

## 设置我们的 Hono 后端

在我们的主目录中，我们将建立一个 `api/` 目录并创建两个文件。首先，我们的恐龙数据文件，
[`api/data.json`](https://github.com/denoland/examples/blob/main/with-solidjs/api/data.json):

```jsonc
// api/data.json

[
  {
    "name": "Aardonyx",
    "description": "Sauropods 进化的早期阶段。"
  },
  {
    "name": "Abelisaurus",
    "description": "\"阿贝尔的蜥蜴\" 仅从单个头骨重建。"
  },
  {
    "name": "Abrictosaurus",
    "description": "Heterodontosaurus 的一个早期亲属。"
  },
  ...
]
```

这是我们将提取数据的地方。在完整的应用中，这些数据将来自数据库。

> ⚠️️ 在本教程中，我们是硬编码数据。但您可以连接到
> [多种数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/) 和 [甚至使用 Prisma 等 ORM](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) 与
> Deno。

其次，我们需要我们的 Hono 服务器，`api/main.ts`：

```tsx
// api/main.ts

import { Hono } from "@hono/hono";
import data from "./data.json" with { type: "json" };

const app = new Hono();

app.get("/", (c) => {
  return c.text("欢迎来到恐龙 API!");
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

  console.log(dinosaur);

  if (dinosaur) {
    return c.json(dinosaur);
  } else {
    return c.notFound();
  }
});

Deno.serve(app.fetch);
```

这个 Hono 服务器提供了两个 API 端点：

- `GET /api/dinosaurs` 获取所有恐龙，并
- `GET /api/dinosaurs/:dinosaur` 根据名称获取特定恐龙

当我们运行 `deno task dev` 时，该服务器将在 `localhost:8000` 上启动。

最后，在我们开始构建前端之前，让我们更新我们的 `vite.config.ts` 文件如下，特别是 `server.proxy`，这告知我们的 SolidJS 前端 API 端点的位置信息。

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

## 创建我们的 SolidJS 前端

在我们开始构建前端组件之前，让我们快速在 `src/types.ts` 中定义 `Dino` 类型：

```tsx
// src/types.ts
export type Dino = {
  name: string;
  description: string;
};
```

`Dino` 类型接口确保了我们整个应用的类型安全，定义了我们的恐龙数据的形状，并启用了 TypeScript 的静态类型检查。

接下来，让我们设置我们的前端以接收数据。我们将要有两个页面：

- `Index.tsx`
- `Dinosaur.tsx`

下面是 `src/pages/Index.tsx` 页面的代码：

```tsx
// src/pages/Index.tsx

import { createSignal, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import type { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = createSignal<Dino[]>([]);

  onMount(async () => {
    try {
      const response = await fetch("/api/dinosaurs");
      const allDinosaurs = (await response.json()) as Dino[];
      setDinosaurs(allDinosaurs);
      console.log("获取的恐龙:", allDinosaurs);
    } catch (error) {
      console.error("获取恐龙失败:", error);
    }
  });

  return (
    <main id="content">
      <h1>欢迎来到恐龙应用</h1>
      <p>点击下面的恐龙以了解更多信息。</p>
      <For each={dinosaurs()}>
        {(dinosaur) => (
          <A href={`/${dinosaur.name.toLowerCase()}`} class="dinosaur">
            {dinosaur.name}
          </A>
        )}
      </For>
    </main>
  );
}
```

使用 SolidJS 时，有一些关键区别于 React 需要注意：

1. 我们使用 SolidJS 特有的原语：
   - `createSignal` 来代替 `useState`
   - `createEffect` 来代替 `useEffect`
   - `For` 组件来代替 `map`
   - `A` 组件来代替 `Link`
2. SolidJS 组件使用细粒度的反应性，因此我们像调用函数一样调用信号，例如 `dinosaur()` 而不仅仅是 `dinosaur`
3. 路由由 `@solidjs/router` 处理，而不是 `react-router-dom`
4. 组件导入使用 Solid 的 [`lazy`](https://docs.solidjs.com/reference/component-apis/lazy) 进行代码拆分

`Index` 页面使用 SolidJS 的 `createSignal` 来管理恐龙列表，并在组件加载时使用 `onMount` 来获取数据。我们使用 `For` 组件，这是 SolidJS 高效渲染列表的方式，而不是使用 JavaScript 的 map 函数。来自 `@solidjs/router` 的 `A` 组件创建了指向单个恐龙页面的客户端导航链接，避免了完整页面的重新加载。

现在是单个恐龙数据页面代码在 `src/pages/Dinosaur.tsx` 中：

```tsx
// src/pages/Dinosaur.tsx

import { createSignal, onMount } from "solid-js";
import { A, useParams } from "@solidjs/router";
import type { Dino } from "../types.ts";

export default function Dinosaur() {
  const params = useParams();
  const [dinosaur, setDinosaur] = createSignal<Dino>({
    name: "",
    description: "",
  });

  onMount(async () => {
    const resp = await fetch(`/api/dinosaurs/${params.selectedDinosaur}`);
    const dino = (await resp.json()) as Dino;
    setDinosaur(dino);
    console.log("恐龙", dino);
  });

  return (
    <div>
      <h1>{dinosaur().name}</h1>
      <p>{dinosaur().description}</p>
      <A href="/">返回所有恐龙</A>
    </div>
  );
}
```

`Dinosaur` 页面展示了 SolidJS 处理动态路由的方法，通过使用 `useParams` 来访问 URL 参数。它遵循与 `Index` 页面类似的模式，使用 `createSignal` 进行状态管理和 `onMount` 进行数据获取，但专注于单个恐龙的细节。这个 `Dinosaur` 组件还展示了如何在模板中访问信号值，通过将它们作为函数调用（例如，`dinosaur().name`），这是与 React 状态管理的重要区别。

最后，为了将所有内容串联在一起，我们将更新 `App.tsx` 文件，该文件将作为组件服务于 `Index` 和 `Dinosaur` 页面。`App` 组件使用 `@solidjs/router` 配置我们的路由，定义两个主要路由：一个用于我们的恐龙列表的索引路由，以及一个用于单个恐龙页面的动态路由。路径中的 `:selectedDinosaur` 参数创建了一个动态部分，可以与 URL 中的任何恐龙名称进行匹配。

```tsx
// src/App.tsx

import { Route, Router } from "@solidjs/router";
import Index from "./pages/Index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/:selectedDinosaur" component={Dinosaur} />
    </Router>
  );
};

export default App;
```

最后，这个 `App` 组件将从我们的主索引中调用：

```tsx
// src/index.tsx

import { render } from "solid-js/web";
import App from "./App.tsx";
import "./index.css";

const wrapper = document.getElementById("root");

if (!wrapper) {
  throw new Error("未找到包装 DIV");
}

render(() => <App />, wrapper);
```

我们应用的入口点使用 SolidJS 的 `render` 函数将 App 组件挂载到 DOM 中。它包括一个安全检查，以确保根元素在尝试渲染之前存在，从而在初始化过程中提供更好的错误处理。

现在，让我们运行 `deno task dev` 同时启动前端和后端：

<figure>

<video class="w-full" alt="在 Deno Deploy 中构建 Http 服务器的教程。" autoplay muted loop playsinline src="./images/how-to/solidjs/demo.mp4"></video>

</figure>

## 后续步骤

🦕 现在您可以使用 Deno 构建和运行 SolidJS 应用！以下是一些您可以增强恐龙应用的方法：

- 添加持久化数据存储
  [使用像 Postgres 或 MongoDB 的数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
  和像 [Drizzle](https://deno.com/blog/build-database-app-drizzle) 或
  [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) 的 ORM
- 使用 SolidJS 的
  [`createContext`](https://docs.solidjs.com/reference/component-apis/create-context) 实现全局状态，在组件之间共享数据
- 使用
  [`createResource`](https://docs.solidjs.com/reference/basic-reactivity/create-resource) 的
  loading 属性添加加载状态
- 实现基于路由的代码分割，使用
  [`lazy`](https://docs.solidjs.com/reference/component-apis/lazy) 导入
- 使用 `Index` 组件提升列表渲染效率
- 将您的应用部署到
  [AWS](https://docs.deno.com/runtime/tutorials/aws_lightsail/),
  [Digital Ocean](https://docs.deno.com/runtime/tutorials/digital_ocean/)，或
  [Google Cloud Run](https://docs.deno.com/runtime/tutorials/google_cloud_run/)

SolidJS 独特的反应式原语、真实的 DOM 重新协调和 Deno 的现代运行时组合，为网络开发提供了一个极其高效的基础。在没有虚拟 DOM 开销和仅在需要的地方进行细粒度更新的情况下，您的应用可以实现最佳性能，同时保持清晰、可读的代码。