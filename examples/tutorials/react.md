---
last_modified: 2025-09-29
title: "使用 Vite 构建的 React 应用"
description: "使用 Deno 和 Vite 构建 React 应用的完整指南。了解如何搭建项目、实现路由、添加 API 端点，并部署你的全栈 TypeScript 应用。"
url: /examples/react_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/react/
  - /runtime/manual/basics/react/
  - /runtime/tutorials/how_to_with_npm/react/
  - /runtime/tutorials/create_react_tutorial/
  - /deploy/tutorials/vite/
---

[React](https://reactjs.org) 是最广泛使用的 JavaScript 前端库。

在本教程中，我们将使用 Deno 构建一个简单的 React 应用。该应用会展示一列恐龙列表。点击其中一个时，会跳转到该恐龙详情页面。你可以查看
[完成版应用的 GitHub 仓库](https://github.com/denoland/tutorial-with-react)
以及
[Deno Deploy 上的应用演示](https://tutorial-with-react.deno.deno.net/)

:::info 部署你自己的应用

想跳过教程，立即部署完成版应用？点击下面按钮，立即部署一份完整的 SvelteKit 恐龙应用的副本到 Deno Deploy。你将获得一个可用的实时应用，便于你在学习过程中自定义和修改！

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-react&mode=dynamic&entrypoint=api/main.ts&build=deno+task+build&install=deno+install)

:::

## 使用 Vite 创建基础 React 应用

本教程将使用 [Vite](https://vitejs.dev/) 在本地提供服务。  
Vite 是现代 Web 项目的构建工具和开发服务器。它与 React 和 Deno 配合良好，利用 ES 模块，允许你直接导入 React 组件。

在终端中运行下面命令，使用 TypeScript 模板创建新的 React 应用：

```sh
$ deno init --npm vite my-react-app --template react-ts
```

## 运行开发服务器

切换到新创建的 React 应用目录并安装依赖：

```sh
cd <your_new_react_app>
deno install
```

现在你可以通过下面命令启动新 React 应用的服务：

```sh
deno run dev
```

这会启动 Vite 服务器，点击输出中的 localhost 链接，在浏览器中查看你的应用。

## 配置项目

我们将构建一个带有 Deno 后端的全栈 React 应用。需要配置 Vite 和 Deno 以实现协同工作。

安装 Vite 的 deno 插件、React 类型声明和 Vite React 插件：

```sh
deno add npm:@deno/vite-plugin@latest npm:@types/react@latest npm:@vitejs/plugin-react@latest
```

还需安装 Deno 的 Oak Web 框架处理 API 请求，以及 CORS 中间件允许来自 React 应用的跨域请求：

```sh
deno add jsr:@oak/oak jsr:@tajpouria/cors
```

这会将依赖写入新的 `deno.json` 文件。

我们还将在该文件中添加几个任务，方便在开发与生产模式下运行，并添加配置使 Deno 支持 React 和 Vite。将如下内容添加到你的 `deno.json` 文件：

```json
"tasks": {
    "dev": "deno run -A npm:vite & deno run server:start",
    "build": "deno run -A npm:vite build",
    "server:start": "deno run -A --watch ./api/main.ts",
    "serve": "deno run build && deno run server:start"
},
"nodeModulesDir": "auto",
"compilerOptions": {
    "types": [
        "react",
        "react-dom",
        "@types/react"
    ],
    "lib": [
        "dom",
        "dom.iterable",
        "deno.ns"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "react"
}
```

你可以同时使用 `package.json` 和 `deno.json` 来管理依赖和配置，也可以删除 `package.json`，只使用 `deno.json`，但需先把 `package.json` 中的依赖迁移到 `deno.json` 的 imports。

## 添加后端 API

我们的项目将拥有提供恐龙数据的后端 API。该 API 使用 Deno 和 Oak 构建，提供获取恐龙列表和特定恐龙详细信息的接口，数据来自一个 JSON 文件。实际生产中一般会是数据库，这里用静态 JSON 文件作为示例。

在项目根目录新建 `api` 文件夹。该目录下新建 `data.json` 文件，复制 [恐龙数据](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json) 进该文件。

接着在 `api` 目录中创建 `main.ts` 文件，含处理 API 请求的 Oak 服务器代码。先导入依赖，创建 Oak 应用和路由器：

```ts title="api/main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./data.json" with { type: "json" };

export const app = new Application();
const router = new Router();
```

然后定义两个主要 API 路由：

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

  context.response.body = dinosaur ?? "未找到恐龙。";
});
```

最后配置服务器中间件并启动监听：

```ts title="api/main.ts"
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

if (import.meta.main) {
  console.log("服务器正在 http://localhost:8000 上监听");
  await app.listen({ port: 8000 });
}
```

服务器配置了 CORS，提供 API 路由，并从 `dist`（构建产物）和 `public` 目录提供静态文件。

## 提供静态文件

Oak 服务器还会提供构建后的 React 应用。我们需要配置它从 Vite 输出的 `dist` 目录提供静态文件。这里用工具函数 `routeStaticFilesFrom` 实现。在 `api` 目录下新建 `util/routeStaticFilesFrom.ts` 文件，内容如下：

```ts title="api/util/routeStaticFilesFrom.ts"
import { Context, Next } from "jsr:@oak/oak";

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

该函数尝试从给定路径中提供静态文件，找不到时调用下一个中间件。它会提供 `dist` 目录中的 `index.html`，即 React 应用的入口。

你可以通过运行 `deno run dev`，再在浏览器访问 `localhost:8000/api/dinosaurs` 测试 API，查看返回的所有恐龙 JSON 数据。

## React 应用设置

### 入口文件

React 应用入口在 `src/main.tsx`，这里无需修改，但值得关注这里将 React 应用挂载到 DOM。`react-dom/client` 中的 `createRoot` 将 `App` 组件渲染到 `index.html` 中的 `root` 节点。以下为 `src/main.tsx` 代码：

```tsx title="src/main.tsx"
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## 添加路由

应用将有两个路由：`/` 和 `/:dinosaur`。

在 `src/App.tsx` 中设置路由：

```tsx title="src/App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index.tsx";
import Dinosaur from "./pages/Dinosaur.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:selectedDinosaur" element={<Dinosaur />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## 代理以转发 API 请求

Vite 在端口 `3000` 提供 React 应用，API 在端口 `8000`。我们需要在 `vite.config.ts` 配置代理，将 API 请求转发：

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
  plugins: [react(), deno()],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});
```

## 创建页面

创建新目录 `pages`，再创建两个文件 `src/pages/index.tsx` 和 `src/pages/Dinosaur.tsx`。  
`Index` 页面列出所有恐龙，`Dinosaur` 页面展示单个恐龙详情。

### index.tsx

该页面从 API 获取恐龙列表，渲染成链接：

```tsx title="src/pages/index.tsx"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/dinosaurs/`);
      const allDinosaurs = await response.json();
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main id="content">
      <h1>🦕 恐龙应用</h1>
      <p>点击下方恐龙，了解详情。</p>
      {dinosaurs.map((dinosaur: { name: string; description: string }) => {
        return (
          <Link
            to={`/${dinosaur.name.toLowerCase()}`}
            key={dinosaur.name}
            className="dinosaur"
          >
            {dinosaur.name}
          </Link>
        );
      })}
    </main>
  );
}
```

### Dinosaur.tsx

该页面从 API 获取特定恐龙详情，并显示：

```tsx title="src/pages/Dinosaur.tsx"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Dinosaur() {
  const { selectedDinosaur } = useParams();
  const [dinosaur, setDino] = useState({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/dinosaurs/${selectedDinosaur}`);
      const dino = await resp.json();
      setDino(dino);
    })();
  }, [selectedDinosaur]);

  return (
    <div>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
      <Link to="/">🠠 返回所有恐龙</Link>
    </div>
  );
}
```

### 美化你的应用

我们为你编写了 [基础样式](https://raw.githubusercontent.com/denoland/tutorial-with-react/refs/heads/main/src/index.css)，可以复制到 `src/index.css`。

## 运行应用

运行应用，使用 `deno.json` 中定义的开发任务：

```sh
deno run dev
```

此命令将：

1. 在 3000 端口启动 Vite 开发服务器  
2. 在 8000 端口启动 API 服务器  
3. 配置代理，将前端 `/api` 请求转发给后端  

在浏览器访问 `localhost:3000`，你应能看到恐龙应用，点击列表查看详情。

## 理解项目结构

看看项目关键文件与目录：

```text
tutorial-with-react/
├── api/                    # 后端 API
│   ├── data.json          # 恐龙数据（700+ 种）
│   ├── main.ts            # 带 API 路由的 Oak 服务器
│   └── util/
│       └── routeStaticFilesFrom.ts
├── src/                    # React 前端
│   ├── main.tsx           # React 应用入口
│   ├── App.tsx            # 主应用及路由
│   ├── index.css          # 全局样式
│   └── pages/
│       ├── index.tsx      # 含恐龙列表的首页
│       └── Dinosaur.tsx   # 单个恐龙页面
├── public/                 # 静态资源
├── deno.json              # Deno 配置和任务
├── package.json           # Vite 的 npm 依赖
├── vite.config.ts         # 带代理的 Vite 配置
└── index.html             # HTML 模板
```

### 关键概念

1. **混合依赖管理**：项目同时使用 Deno 和 npm 依赖。服务器端依赖（如 Oak）用 Deno 管理，前端依赖则由 Vite 通过 npm 管理。

2. **开发与生产环境**：开发时，Vite 在 3000 端口提供 React 应用，并代理 API 请求到 8000 端口的 Oak 服务器。生产时，Oak 服务器在 8000 端口同时提供构建好的 React 应用和 API。

3. **现代 React 模式**：应用使用 React 18（注：React 19 尚未发布，文中应为 React 18），函数组件，Hooks 和 React Router 进行导航。

4. **类型安全**：示例中未使用独立类型文件，但大型项目里建议为数据结构创建 TypeScript 接口。

你可以在 [Deno Deploy 运行的应用](https://tutorial-with-react.deno.deno.net/) 看到示例。

## 构建和部署

我们配置了一个 `serve` 任务，构建 React 应用并由 Oak 后端提供。运行以下命令以生产模式构建和启动：

```sh
deno run build
deno run serve
```

此操作会：

1. 使用 Vite 构建 React 应用（输出到 `dist/`）  
2. 启动 Oak 服务器，提供 API 及构建后的 React 应用  

浏览器访问 `localhost:8000` 查看生产版本！

你可以将该应用部署到喜欢的云平台。推荐使用 [Deno Deploy](https://deno.com/deploy)，部署方便快捷。只需创建 GitHub 仓库并推送代码，然后连接到 Deno Deploy 即可。

### 创建 GitHub 仓库

[创建新的 GitHub 仓库](https://github.com/new)，初始化并推送应用代码：

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'my react app'
git push -u origin main
```

### 部署到 Deno Deploy

代码上传 GitHub 后，你可以
[将其部署至 Deno Deploy](https://console.deno.com/)。

完整部署流程请参考 [Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

🦕 现在你已准备好用 Vite 和 Deno 脚手架搭建和开发 React 应用！你可以构建超高速 Web 应用。希望你喜欢探索这些前沿工具，期待看到你的作品！