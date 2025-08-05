---
title: "构建一个 Vue.js 应用"
description: "一个使用 Deno 构建 Vue.js 应用的教程。学习如何设置 Vite 项目，实现组件架构，添加路由，管理状态，并创建一个全栈 TypeScript 应用。"
url: /examples/vue_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/vue/
  - /runtime/tutorials/how_to_with_npm/vue/
---

[Vue.js](https://vuejs.org/) 是一个渐进式前端 JavaScript 框架。它提供了创建动态和交互式用户界面的工具和特性。

在本教程中，我们将使用 Vite 和 Deno 构建一个简单的 Vue.js 应用。该应用将显示恐龙列表。当你点击其中一个时，它将带你到一个包含更多详细信息的恐龙页面。你可以在 [GitHub 上查看完成的应用](https://github.com/denoland/tutorial-with-vue)。

你可以在 [Deno Deploy](https://tutorial-with-vue.deno.deno.net/) 上查看该应用的实时版本。

:::info 部署你自己的

想跳过教程，立即部署完成的应用程序吗？点击下面的按钮，立即将您自己的完整 SvelteKit 恐龙应用程序部署到 Deno Deploy。您将获得一个实时的、可工作的应用程序，您可以在学习的过程中进行自定义和修改！

[![Deploy on Deno](https://deno.com/button)](https://app.deno.com/new?clone=https://github.com/denoland/tutorial-with-vue&mode=dynamic&entrypoint=api/main.ts&build=deno+task+build&install=deno+install)

:::

## 使用 Vite 和 Deno 创建 Vue.js 应用

我们将使用 [Vite](https://vitejs.dev/) 来搭建一个基本的 Vue.js 应用。在你的终端中，运行以下命令以使用 Vite 创建一个新的 .js 应用：

```shell
deno run -A npm:create-vite
```

当提示时，给你的应用命名，并从提供的框架中选择 `Vue`，将 `TypeScript` 作为变体。

创建后，`cd` 进入你的新项目并运行以下命令来安装依赖：

```shell
deno install
```

然后，运行以下命令来提供你的新 Vue.js 应用：

```shell
deno task dev
```

Deno 将运行 `package.json` 文件中的 `dev` 任务，这将启动 Vite 服务器。点击输出的本地主机链接，在浏览器中查看你的应用。

## 配置格式化工具

`deno fmt` 支持使用 
[`--unstable-component`](https://docs.deno.com/runtime/reference/cli/fmt/#formatting-options-unstable-component)
标志格式化 Vue 文件。使用命令：

```sh
deno fmt --unstable-component
```

要配置 `deno fmt` 始终格式化你的 Vue 文件，请在 `deno.json` 文件的顶层添加：

```json
"unstable": ["fmt-component"]
```

## 添加后端 API

我们将使用 Deno 和 Oak 构建一个 API 服务器。这里将提供我们的恐龙数据。

在项目的根目录下创建一个 `api` 文件夹。在该文件夹中，创建一个 `data.json`，它将包含硬编码的恐龙数据。

复制并粘贴
[此 JSON 文件](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json)
到 `api/data.json` 文件中。（如果你构建的是一个真实应用，你可能会从数据库或外部 API 获取这些数据。）

我们接下来将构建一些返回恐龙信息的 API 路由。我们需要 Oak 作为 HTTP 服务器以及
[CORS 中间件](https://jsr.io/@tajpouria/cors) 来启用
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。

通过更新 `deno.json` 文件的 imports 部分添加依赖：

```json title="deno.json"
{
  "imports": {
    "@oak/oak": "jsr:@oak/oak@^17.1.5",
    "@tajpouria/cors": "jsr:@tajpouria/cors@^1.2.1",
    "vue-router": "npm:vue-router@^4.5.1"
  }
}
```

接下来，创建 `api/main.ts`，导入所需模块并创建一个新的 `Router` 实例以定义一些路由：

```ts title="api/main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./data.json" with { type: "json" };

export const app = new Application();
const router = new Router();
```

随后，在同一文件中，我们将定义两个路由。一个是 `/api/dinosaurs` 返回所有恐龙，另一个是 `/api/dinosaurs/:dinosaur`，根据 URL 中的名称返回特定恐龙：

```ts title="api/main.ts"
router.get("/api/dinosaurs", (context) => {
  context.response.body = data;
});

router.get("/api/dinosaurs/:dinosaur", (context) => {
  if (!context?.params?.dinosaur) {
    context.response.body = "未提供恐龙名称。";
  }

  const dinosaur = data.find((item) =>
    item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
  );

  context.response.body = dinosaur ?? "未找到该恐龙。";
});
```

在同一文件底部，将我们刚定义的路由挂载到应用程序。我们还必须包括静态文件服务器，最后启动服务器监听 8000 端口：

```ts title="api/main.ts"
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

if (import.meta.main) {
  console.log("服务器监听端口 http://localhost:8000");
  await app.listen({ port: 8000 });
}
```

你还需要创建 `api/util/routeStaticFilesFrom.ts` 文件来服务静态文件：

```ts title="api/util/routeStaticFilesFrom.ts"
import { Context, Next } from "@oak/oak";

// 配置静态站点路由，以便我们可以服务
// Vite 构建输出和 public 文件夹
export default function routeStaticFilesFrom(staticPaths: string[]) {
  return async (context: Context<Record<string, object>>, next: Next) => {
    for (const path of staticPaths) {
      try {
        await context.send({ root: path, index: "index.html" });
        return;
      } catch {
        continue;
      }
    }

    await next();
  };
}
```

你可以使用命令 `deno run --allow-env --allow-net --allow-read api/main.ts` 运行 API 服务器。我们将创建一个任务来在后台运行此命令，并更新 dev 任务以同时运行 Vue 应用和 API 服务器。

更新你的 `package.json` 脚本如下：

```json title="package.json"
{
  "scripts": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    "build": "deno run -A npm:vite build",
    "server:start": "deno run -A --watch ./api/main.ts",
    "serve": "deno run build && deno run server:start",
    "preview": "vite preview"
  }
}
```

确保你的 `vite.config.ts` 包含 Deno 插件和开发代理配置：

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import deno from "@deno/vite-plugin";

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [vue(), deno()],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});
```

如果你现在运行 `npm run dev` 并访问浏览器的 `localhost:8000/api/dinosaurs`，应该能看到所有恐龙的 JSON 响应。

## 构建前端

### 入口点和路由

在 `src` 目录中，你会找到一个 `main.ts` 文件。这是 Vue.js 应用的入口点。我们的应用将有多个路由，因此需要一个路由器来处理客户端的路由。我们将使用官方的 [Vue Router](https://router.vuejs.org/)。

更新 `src/main.ts`，导入并使用路由器：

```ts
import { createApp } from "vue";
import router from "./router/index.ts";

import "./style.css";
import App from "./App.vue";

createApp(App)
  .use(router)
  .mount("#app");
```

通过更新 `deno.json` 中的导入路径，将 Vue Router 模块添加到项目中：

```json title="deno.json"
{
  "imports": {
    "@oak/oak": "jsr:@oak/oak@^17.1.5",
    "@tajpouria/cors": "jsr:@tajpouria/cors@^1.2.1",
    "vue-router": "npm:vue-router@^4.5.1"
  }
}
```

接着，在 `src` 目录中创建 `router` 文件夹，并在其中创建 `index.ts` 文件，内容如下：

```ts title="router/index.ts"
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import Dinosaur from "../components/Dinosaur.vue";

export default createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/:dinosaur",
      name: "Dinosaur",
      component: Dinosaur,
      props: true,
    },
  ],
});
```

这将创建一个包含两个路由的路由器：`/` 和 `/:dinosaur`。`HomePage` 组件渲染于 `/` 路径，`Dinosaur` 组件渲染于 `/:dinosaur` 路径。

最后，删除 `src/App.vue` 文件中的全部内容，仅保留 `<RouterView>` 组件：

```html title="App.vue"
<template>
  <RouterView />
</template>
```

### 组件

Vue.js 将前端 UI 分解为多个组件。每个组件是一个可复用的代码片段。我们将创建三个组件：主页组件、恐龙列表组件和单个恐龙组件。

每个组件文件由三部分组成：`<script>`、`<template>` 和 `<style>`。`<script>` 标签包含该组件的 JavaScript 逻辑，`<template>` 包含 HTML 结构，`<style>` 包含 CSS 样式。

在 `/src/components` 目录中，创建三个新文件：`HomePage.vue`、`Dinosaurs.vue` 和 `Dinosaur.vue`。

#### Dinosaurs 组件

`Dinosaurs` 组件将从之前搭建的 API 获取恐龙列表，并使用
[Vue Router 的 `RouterLink` 组件](https://router.vuejs.org/guide/)将它们渲染为链接。
（鉴于我们使用的是 TypeScript，不要忘记在 `<script>` 标签中添加 `lang="ts"`。）

将以下代码添加到 `Dinosaurs.vue` 文件：

```html title="Dinosaurs.vue"
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    async setup() {
      const res = await fetch("/api/dinosaurs");
      const dinosaurs = await res.json() as Dinosaur[];
      return { dinosaurs };
    },
  });
</script>

<template>
  <span v-for="dinosaur in dinosaurs" :key="dinosaur.name">
    <RouterLink
      :to="{ name: 'Dinosaur', params: { dinosaur: `${dinosaur.name.toLowerCase()}` } }"
    >
      {{ dinosaur.name }}
    </RouterLink>
  </span>
</template>
```

此代码使用 Vue.js 的 
[v-for](https://vuejs.org/api/built-in-directives.html#v-for) 指令遍历 `dinosaurs` 数组，将每个恐龙渲染为一个 `RouterLink` 组件。`RouterLink` 的 `:to` 属性定义点击时导航的路由，`:key` 用于唯一标识每个恐龙。

#### HomePage 组件

主页组件将显示一个标题，并渲染 `Dinosaurs` 组件。将以下代码加入 `HomePage.vue`：

```html title="HomePage.vue"
<script setup lang="ts">
  import Dinosaurs from "./Dinosaurs.vue";
</script>
<template>
  <h1>欢迎来到恐龙应用！🦕</h1>
  <p>点击一个恐龙以了解更多信息</p>
  <Suspense>
    <template #default>
      <Dinosaurs />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

由于 `Dinosaurs` 组件是异步获取数据，采用 
[`Suspense` 组件](https://vuejs.org/guide/built-ins/suspense.html) 来处理加载状态。

#### Dinosaur 组件

`Dinosaur` 组件会显示特定恐龙的名称和描述，并提供返回完整列表的链接。

首先，为即将获取的数据定义类型。在 `src` 目录中创建 `types.ts` 文件，添加以下内容：

```ts title="types.ts"
type Dinosaur = {
  name: string;
  description: string;
};

type ComponentData = {
  dinosaurDetails: null | Dinosaur;
};
```

接着，更新 `Dinosaur.vue` 文件：

```html title="Dinosaur.vue"
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: { dinosaur: String },
    data(): ComponentData {
      return {
        dinosaurDetails: null,
      };
    },
    async mounted() {
      const res = await fetch(
        `/api/dinosaurs/${this.dinosaur}`,
      );
      this.dinosaurDetails = await res.json();
    },
  });
</script>

<template>
  <h1>{{ dinosaurDetails?.name }}</h1>
  <p>{{ dinosaurDetails?.description }}</p>
  <RouterLink to="/">🠠 返回所有恐龙</RouterLink>
</template>
```

此代码通过 `props` 定义名为 `dinosaur` 的属性传入组件。`mounted` 生命周期钩子根据 `dinosaur` prop 异步获取特定恐龙的详细信息，存储在 `dinosaurDetails` 数据属性中，随后在模板中渲染。

## 运行应用

现在我们已经配置好了前端和后端，可以运行应用。在终端执行：

```shell
npm run dev
```

这将同时启动端口 8000 上的 Deno API 服务器和端口 3000 上的 Vite 开发服务器。Vite 服务器将代理 API 请求到 Deno 服务器。

在浏览器中访问 `http://localhost:3000` 查看应用。点击某个恐龙以查看它的详情！

你也可以在 [Deno Deploy](https://tutorial-with-vue.deno.deno.net/) 查看应用的实时版本。

[Vue 应用演示](./images/how-to/vue/vue.gif)

```shell
deno run serve
```

此命令将构建 Vue 应用，并通过 Deno 服务器在端口 8000 提供服务。

## 构建与部署

我们已设置了 `serve` 任务，使用 Oak 后端服务器构建并提供 Vue 应用。运行以下命令以生产模式构建并提供应用：

```sh
deno run build
deno run serve
```

这将：

1. 使用 Vite 构建 Vue 应用（输出到 `dist/` 目录）
2. 启动 Oak 服务器，同时提供 API 和已构建的 Vue 应用

在浏览器中访问 `localhost:8000` 查看生产版本的应用！

你可以将此应用部署到你喜欢的云服务。我们推荐使用
[Deno Deploy](https://deno.com/deploy) 以获得简单便捷的部署体验。你可以直接从 GitHub 部署，只需创建 GitHub 仓库并推送代码，然后连接到 Deno Deploy。

### 创建 GitHub 仓库

[创建一个新的 GitHub 仓库](https://github.com/new)，然后初始化并推送你的应用代码：

```sh
git init -b main
git remote add origin https://github.com/<你的_github_用户名>/<你的仓库名>.git
git add .
git commit -am '我的 Vue 应用'
git push -u origin main
```

### 部署到 Deno Deploy

当你的应用已上传至 GitHub，即可通过 Deno Deploy<sup>EA</sup> 仪表盘部署你的应用。
<a href="https://app.deno.com/" class="docs-cta deploy-cta deploy-button">部署我的应用</a>

有关部署应用的详细步骤，请参阅
[Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

🦕 现在你已经可以使用 Vite 在 Deno 中运行 Vue 应用，准备好构建真实世界的应用了！