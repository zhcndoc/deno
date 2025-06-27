---
title: "使用 Deno 构建 Nuxt 应用"
description: "逐步指南，教你如何使用 Deno 构建 Nuxt 应用。学习如何创建完整的 Vue.js 全栈应用，实现服务器端渲染，添加 Tailwind 样式，并部署你的应用。"
url: /examples/nuxt_tutorial/
---

[Nuxt](https://nuxt.com/) 是一个框架，提供了一种直观的方式来基于 [Vue](https://vuejs.org/) 创建全栈应用。它开箱即用地提供了基于文件的路由、各种渲染选项和自动代码分割。凭借其模块化架构，Nuxt 简化了开发过程，为构建 Vue 应用提供了结构化的方法。

在本教程中，我们将使用 Deno 构建一个简单的 Nuxt 应用，展示恐龙列表，并允许您点击名称来了解每一种恐龙的更多信息：

- [搭建 Nuxt 应用](#搭建-nuxt-应用)
- [设置服务器 API 路由](#设置服务器-api-路由)
- [设置 Vue 前端](#设置-vue-前端)
- [添加 Tailwind](#添加-tailwind)
- [后续步骤](#后续步骤)

您可以在这个 [仓库](https://github.com/denoland/examples/tree/main/with-nuxt) 中找到该项目的代码。

## Scaffold a Nuxt app with Deno

我们可以使用 Deno 这样创建一个新的 Nuxt 项目：

```bash
deno -A npm:nuxi@latest init
```

我们将使用 Deno 来管理我们的包依赖，并可以从 npm 获取 Nuxt 包。这将创建一个具有以下项目结构的 nuxt-app：

```
NUXT-APP/
├── .nuxt/                   # Nuxt 构建目录
├── node_modules/            # Node.js 依赖
├── public/                  # 静态文件
│   ├── favicon.ico        
│   └── robots.txt         
├── server/                  # 服务器端代码
│   └── tsconfig.json     
├── .gitignore            
├── app.vue                  # 根 Vue 组件
├── nuxt.config.ts           # Nuxt 配置
├── package-lock.json        # NPM 锁文件
├── package.json             # 项目清单
├── README.md            
└── tsconfig.json            # TypeScript 配置
```

## 设置服务器 API 路由

让我们首先开始创建提供恐龙数据的 API 路由。

首先，我们的
[恐龙数据](https://github.com/denoland/examples/blob/main/with-nuxt/server/api/data.json)
将存放在服务器目录中，位置为 `server/api/data.json`：

```json title="server/api/data.json"
[
  {
    "name": "Aardonyx",
    "description": "在巨龙类的早期进化阶段。"
  },
  {
    "name": "Abelisaurus",
    "description": "\"阿贝尔的蜥蜴\" 是根据一具单独的头骨重建的。"
  },
  {
    "name": "Abrictosaurus",
    "description": "异齿龙的早期亲属。"
  },
  ...etc
]
```

这是我们数据来源的位置。在完整的应用程序中，这些数据将来自于数据库。

> ⚠️️ 在本教程中，我们硬编码了数据。但您可以连接
> [多种数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/) 并且 [甚至使用诸如 Prisma 的 ORM](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) 与 Deno。

该应用将有两个 API 路由。它们将提供以下内容：

- 一个用于索引页面的完整恐龙列表
- 一个用于单个恐龙页面的单个恐龙信息

它们均为 `*.get.ts` 文件，Nuxt 会自动将其转换为响应 `GET` 请求的 API 端点。
[文件命名规则决定 HTTP 方法及路由路径](https://nuxt.com/docs/guide/directory-structure/server#matching-http-method)。

初始的 `dinosaurs.get.ts` 非常简单，使用 [`defineCachedEventHandler`](https://nitro.build/guide/cache) 创建一个缓存的端点以提高性能。该处理函数简单返回我们的完整恐龙数据数组，无任何过滤：

```tsx title="server/api/dinosaurs.get.ts"
import data from "./data.json" with { type: "json" };

export default defineCachedEventHandler(() => {
  return data;
});
```

单个恐龙的 `GET` 路由则包含更多逻辑。它从事件上下文中提取名称参数，执行不区分大小写的匹配来查找请求的恐龙，并对缺少或无效的恐龙名称进行适当的错误处理。我们将创建一个 `dinosaurs` 目录，然后为传递名称参数，创建一个名为 `[name].get.ts` 的新文件：

```tsx title="server/api/dinosaurs/[name].get.ts"
import data from "../data.json";

export default defineCachedEventHandler((event) => {
  const name = getRouterParam(event, "name");

  if (!name) {
    throw createError({
      statusCode: 400,
      message: "未提供恐龙名称",
    });
  }

  const dinosaur = data.find(
    (dino) => dino.name.toLowerCase() === name.toLowerCase(),
  );

  if (!dinosaur) {
    throw createError({
      statusCode: 404,
      message: "未找到该恐龙",
    });
  }

  return dinosaur;
});
```

使用 `deno task dev` 启动服务器，然后在浏览器访问
[http://localhost:3000/api/dinosaurs](http://localhost:3000/api/dinosaurs)，你应该能看到显示所有恐龙的原始 JSON 响应！

![设置 API](./images/how-to/nuxt/nuxt-1.webp)

你也可以通过访问特定的恐龙名称来获取单个恐龙的数据，例如：
[http://localhost:3000/api/dinosaurs/aardonyx](http://localhost:3000/api/dinosaurs/aardonyx)。

![设置 API](./images/how-to/nuxt/nuxt-2.webp)

接下来，我们将设置 Vue 前端以显示索引页面及每个单独的恐龙页面。

## 设置 Vue 前端

我们想在应用中设置两个页面：

- 一个索引页面，列出所有恐龙
- 一个单个恐龙页面，展示所选恐龙的详细信息。

首先，创建索引页面。Nuxt 使用
[基于文件系统的路由](https://nuxt.com/docs/getting-started/routing)，所以我们将在根目录创建一个 `pages` 文件夹，内置一个名为 `index.vue` 的索引页面。

为了获取数据，我们将用 `useFetch` 组合函数来请求之前创建的 API 端点：

```tsx title="pages/index.vue"
<script setup lang="ts">
const { data: dinosaurs } = await useFetch("/api/dinosaurs");
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold mb-4">欢迎来到恐龙应用</h1>
    <p class="mb-4">点击下面的恐龙以了解更多信息。</p>
    <ul class="space-y-2">
      <li v-for="dinosaur in dinosaurs" :key="dinosaur.name">
        <NuxtLink
          :to="'/' + dinosaur.name.toLowerCase()"
          class="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {{ dinosaur.name }}
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
```

针对显示每个恐龙信息的页面，我们将创建一个新的动态页面，名为 `[name].vue`。该页面使用 Nuxt 的
[动态路由参数](https://nuxt.com/docs/getting-started/routing#route-parameters)，文件名中的 `[name]` 可在 JavaScript 中通过 `route.params.name` 访问。我们将使用 `useRoute` 组合函数来访问路由参数，并用 `useFetch` 根据名称参数获取特定恐龙的数据：

```tsx title="pages/[name].vue"
<script setup lang="ts">
const route = useRoute();
const { data: dinosaur } = await useFetch(
  `/api/dinosaurs/${route.params.name}`
);
</script>

<template>
  <main v-if="dinosaur">
    <h1 class="text-2xl font-bold mb-4">{{ dinosaur.name }}</h1>
    <p class="mb-4">{{ dinosaur.description }}</p>
    <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 hover:underline">
      返回所有恐龙
    </NuxtLink>
  </main>
</template>
```

接下来，我们需要将这些 Vue 组件连接在一起，以便在我们访问域根目录时能够正确渲染。让我们更新目录根部的 `app.vue` 以提供我们应用程序的根组件。我们将使用
[`NuxtLayout`](https://nuxt.com/docs/api/components/nuxt-layout) 来保持页面结构的一致性，并使用 [`NuxtPage`](https://nuxt.com/docs/api/components/nuxt-page) 用于动态页面渲染：

```tsx title="app.vue"
<template>
  <NuxtLayout>
    <div>
      <nav class="p-4 bg-gray-100">
        <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">
          恐龙百科全书
        </NuxtLink>
      </nav>

      <div class="container mx-auto p-4">
        <NuxtPage />
      </div>
    </div>
  </NuxtLayout>
</template>;
```

使用 `deno task dev` 启动服务器，并访问
[http://localhost:3000](http://localhost:3000) 查看页面效果：

<figure>

<video class="w-full" alt="使用 Deno 构建 Nuxt 应用。" autoplay muted loop playsinline src="./images/how-to/nuxt/nuxt-3.mp4"></video>

</figure>

看起来不错！

## 添加 Tailwind

正如我们所说的，我们将为这个应用程序添加一点样式。首先，我们将设置一个布局，通过 Nuxt 的布局系统提供跨所有页面的一致结构，使用
[基于插槽](https://vuejs.org/guide/components/slots) 的内容注入：

```tsx title="layouts/default.vue"
<template>
  <div>
    <slot />
  </div>
</template>;
```

在这个项目中，我们还将使用 [tailwind](https://tailwindcss.com/) 来进行一些基础设计，因此我们需要安装这些依赖：

```bash
deno install -D npm:tailwindcss npm:@tailwindcss/vite
```

接着，我们将更新 `nuxt.config.ts`。导入 Tailwind 依赖并配置 Nuxt 应用以兼容 Deno，启用开发工具，并设置 Tailwind CSS：

```tsx title="nuxt.config.ts"
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  nitro: {
    preset: "deno",
  },
  app: {
    head: {
      title: "恐龙百科全书",
    },
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
```

接下来，创建一个新的 CSS 文件 `assets/css/main.css`，添加一个导入语句 `@import`，导入 tailwind 及其工具类：

```tsx title="assets/css/main.css"
@import "tailwindcss";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 运行应用

然后，我们可以通过以下命令运行应用：

```bash
deno task dev
```

这将在 localhost:3000 启动应用：

<figure>

<video class="w-full" alt="使用 Deno 构建 Nuxt 应用。" autoplay muted loop playsinline src="./images/how-to/nuxt/nuxt-4.mp4"></video>

</figure>

我们完成了！

🦕 Nuxt 应用的下一步可能是使用 [Nuxt Auth](https://auth.nuxtjs.org/) 模块添加认证，实现 [Pinia](https://pinia.vuejs.org/) 状态管理，添加服务器端数据持久化如 [Prisma](https://docs.deno.com/examples/prisma_tutorial/) 或 [MongoDB](https://docs.deno.com/examples/mongoose_tutorial/)，以及搭建 Vitest 的自动化测试。这些功能将使应用更适合生产和大型项目。