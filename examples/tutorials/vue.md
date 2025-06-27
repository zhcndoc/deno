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

![Vue.js 应用运行中](./images/how-to/vue/vue.gif)

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

## 添加后端

下一步是添加一个后端 API。我们将创建一个非常简单的 API，返回关于恐龙的信息。

在你的新 vite 项目的根目录中，创建一个 `api` 文件夹。在该文件夹内，创建一个 `main.ts` 文件用来运行服务器，以及一个 `data.json` 文件来存放硬编码的数据。

复制并粘贴
[此 json 文件](https://raw.githubusercontent.com/denoland/tutorial-with-vue/refs/heads/main/api/data.json)
到 `api/data.json`。

我们将构建一个简单的 API 服务器，包含返回恐龙信息的路由。我们会使用 [`oak` 中间件框架](https://jsr.io/@oak/oak)
和 [`cors` 中间件](https://jsr.io/@tajpouria/cors) 来启用
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。

使用 `deno add` 命令将所需依赖添加到项目中：

```shell
deno add jsr:@oak/oak jsr:@tajpouria/cors
```

接下来，更新 `api/main.ts` 文件，引入所需模块并创建一个新的 `Router` 实例来定义路由：

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };

const router = new Router();
```

随后，在同一文件中定义三个路由。第一个路由在 `/` 路径下返回字符串 `Welcome to the dinosaur API`，接着设置 `/dinosaurs` 返回所有恐龙数据，最后 `/dinosaurs/:dinosaur` 根据 URL 中的名称返回特定恐龙：

```ts title="main.ts"
router
  .get("/", (context) => {
    context.response.body = "Welcome to dinosaur API!";
  })
  .get("/dinosaurs", (context) => {
    context.response.body = data;
  })
  .get("/dinosaurs/:dinosaur", (context) => {
    if (!context?.params?.dinosaur) {
      context.response.body = "No dinosaur name provided.";
    }

    const dinosaur = data.find((item) =>
      item.name.toLowerCase() === context.params.dinosaur.toLowerCase()
    );

    context.response.body = dinosaur ? dinosaur : "No dinosaur found.";
  });
```

最后，在同一文件底部，创建一个新的 `Application` 实例，使用 `app.use(router.routes())` 加载刚才定义的路由，并启动服务器监听 8000 端口：

```ts title="main.ts"
const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

你可以通过运行 `deno run --allow-env --allow-net api/main.ts` 来启动 API 服务器。我们将创建一个任务来运行此命令，并更新开发任务，确保 Vue.js 应用和 API 服务器同时运行。

在你的 `package.json` 文件中，更新 `scripts` 字段如下：

```jsonc
{
  "scripts": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    // ...
}
```

现在，如果运行 `deno task dev` 并访问 `localhost:8000`，浏览器中会显示文本 `Welcome to dinosaur API!`，访问 `localhost:8000/dinosaurs` 时，则可以看到所有恐龙的 JSON 响应。

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

通过 `deno add` 将 Vue Router 模块添加到项目中：

```shell
deno add npm:vue-router
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

这会创建一个包含两个路由的路由器：`/` 和 `/:dinosaur`。`HomePage` 组件在 `/` 路径渲染，`Dinosaur` 组件在 `/:dinosaur` 渲染。

最后，删除 `src/App.vue` 文件中全部内容，更新为仅包含 `<RouterView>` 组件：

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
      const res = await fetch("http://localhost:8000/dinosaurs");
      const dinosaurs = await res.json() as Dinosaur[];
      return { dinosaurs };
    },
  });
</script>

<template>
  <div v-for="dinosaur in dinosaurs" :key="dinosaur.name">
    <RouterLink
      :to="{ name: 'Dinosaur', params: { dinosaur: `${dinosaur.name.toLowerCase()}` } }"
    >
      {{ dinosaur.name }}
    </RouterLink>
  </div>
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
        `http://localhost:8000/dinosaurs/${this.dinosaur}`,
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
deno task dev
```

访问输出的本地主机链接，在浏览器中查看应用。点击任何一个恐龙以查看更多详情！

![Vue 应用运行中](./images/how-to/vue/vue.gif)

🦕 现在你已经学会了如何在 Deno 中使用 Vite 运行 Vue 应用，准备好构建真实项目了！如果想拓展本演示，可以考虑搭建一个后端服务器来构建后提供静态应用，然后
[将恐龙应用部署至云端](https://docs.deno.com/deploy/manual/)。