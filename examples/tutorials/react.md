---
title: "使用起始模板构建 React 应用"
description: "使用 Deno 和 Vite 构建 React 应用的完整指南。学习如何从模板设置项目，实现路由，添加 API 端点，并部署你的全栈 TypeScript 应用。"
url: /examples/react_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/react/
  - /runtime/manual/basics/react/
  - /runtime/tutorials/how_to_with_npm/react/
  - /runtime/tutorials/create_react_tutorial/
---

[React](https://reactjs.org) 是最广泛使用的 JavaScript 前端库。

在本教程中，我们将使用 Deno 构建一个简单的 React 应用。该应用将展示一列恐龙。当你点击其中一只时，它会带你到一个有更多信息的恐龙页面。你可以查看 [GitHub 上的完成应用仓库](https://github.com/denoland/tutorial-with-react)，以及在 [Deno Deploy 上的应用演示](https://tutorial-with-react.deno.deno.net/)。

## 使用 Vite 创建基础 React 应用

本教程将使用 [Vite](https://vitejs.dev/) 在本地提供该应用。Vite 是一个现代 Web 项目的构建工具和开发服务器。它与 React 和 Deno 配合良好，利用 ES 模块，允许你直接导入 React 组件。

在你的终端运行以下命令，使用 typescript 模板创建一个新的 React 应用：

```sh
deno run -A npm:create-vite@latest --template react-ts
```

## 运行开发服务器

切换目录到你新创建的 react 应用并安装依赖：

```sh
cd <your_new_react_app>
deno install
```

现在你可以通过运行以下命令来提供新的 React 应用：

```sh
deno run dev
```

这将启动 Vite 服务器，点击输出中的 localhost 链接，在浏览器中查看你的应用。

## 配置项目

我们将构建一个带有 Deno 后端的全栈 React 应用。需要配置 Vite 和 Deno 以协同工作。

安装 Vite 的 deno 插件、React 类型和 Vite React 插件：

```sh
deno add npm:@deno/vite-plugin@latest npm:@types/react@latest npm:@vitejs/plugin-react@latest
```

还需要安装 Deno 的 Oak Web 框架来处理我们的 API 请求，以及 CORS 中间件允许来自 React 应用的跨域请求：

```sh
deno add jsr:@oak/oak jsr:@tajpouria/cors
```

这会将这些依赖添加到新的 `deno.json` 文件中。

在该文件中，我们还将添加一些任务，使得在开发和生产模式下运行应用更方便，同时添加配置以设置 Deno 与 React 和 Vite。将以下内容添加到你的 `deno.json` 文件：

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

我们既可以使用 `package.json` 也可以使用 `deno.json` 来管理依赖和配置，但如果你愿意，可以删除 `package.json` 文件，仅使用 `deno.json` 来配置项目，确保先将依赖从 `package.json` 迁移至 `deno.json` 的 imports。

## 添加后端 API

我们的项目将有一个提供恐龙数据的后端 API。该 API 将使用 Deno 和 Oak 构建，提供端点来获取恐龙列表和特定恐龙的详细信息，数据来源于一个 JSON 文件。在生产应用中这通常来自数据库，但本教程使用静态 JSON 文件。

在项目根目录创建一个名为 `api` 的新目录。在该目录下创建一个名为 `data.json` 的文件，并复制 [恐龙数据](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json)。

然后在 `api` 目录中创建一个名为 `main.ts` 的文件。该文件包含用于处理 API 请求的 Oak 服务器代码。首先设置导入，创建 Oak 应用和路由器：

```ts title="api/main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";
import data from "./data.json" with { type: "json" };

export const app = new Application();
const router = new Router();
```

接着定义两个主要的 API 路由：

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

最后，配置服务器中间件并启动监听：

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

服务器处理 CORS，提供 API 路由，也从 `dist`（构建后的应用）和 `public` 目录提供静态文件。

## 提供静态文件

Oak 服务器还将提供构建好的 React 应用。为此我们需要配置它从 Vite 输出构建文件的 `dist` 目录提供静态文件。我们使用 `routeStaticFilesFrom` 工具函数来实现。在 `api` 目录下新建 `util/routeStaticFilesFrom.ts` 文件，内容如下：

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

该工具函数尝试从指定路径们中提供静态文件，找不到时调用下一个中间件。它会提供 `dist` 目录中的 `index.html`，即 React 应用的入口文件。

你可以通过运行 `deno run dev`，然后在浏览器访问 `localhost:8000/api/dinosaurs` 来测试 API，查看返回的所有恐龙 JSON 数据。

## React 应用设置

### 入口文件

React 应用的入口在 `src/main.tsx`。这里不需要做任何更改，但值得注意的是，这里是 React 应用渲染入 DOM 的地方。`react-dom/client` 中的 `createRoot` 函数用于将 `App` 组件渲染入 `index.html` 中的 `root` 元素。以下是 `src/main.tsx` 中的代码：

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

该应用将有两个路由：`/` 和 `/:dinosaur`。

我们将在 `src/App.tsx` 中设置路由：

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

Vite 在端口 `3000` 提供 React 应用，API 在端口 `8000` 运行。我们需要在 `vite.config.ts` 中设置代理配置，将 API 请求转发：

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

创建一个新目录 `pages`，在其中创建两个新文件 `src/pages/index.tsx` 和 `src/pages/Dinosaur.tsx`。`Index` 页面列出所有恐龙，`Dinosaur` 页面显示特定恐龙详情。

### index.tsx

该页面从 API 获取恐龙列表，并以链接形式渲染：

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
    <main>
      <h1>🦕 Dinosaur app</h1>
      <p>Click on a dinosaur below to learn more.</p>
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

该页面从 API 获取特定恐龙的详细信息，并在段落中显示：

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

我们为你编写了 [一些基础样式](https://raw.githubusercontent.com/denoland/tutorial-with-react/refs/heads/main/src/index.css)，可以复制到 `src/index.css`。

## 运行应用

要运行应用，使用在 `deno.json` 中定义的开发任务：

```sh
deno run dev
```

该命令将执行：

1. 在端口 3000 启动 Vite 开发服务器
2. 在端口 8000 启动 API 服务器
3. 配置代理，将前端的 `/api` 请求转发到后端

在浏览器中访问 `localhost:3000`，你应该能看到恐龙应用，恐龙列表可以点击查看详情。

## 理解项目结构

让我们浏览项目中的关键文件和文件夹：

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

1. **混合依赖管理**：项目同时使用 Deno 和 npm 依赖。服务器端依赖如 Oak 使用 Deno，前端依赖通过 Vite 由 npm 管理。

2. **开发与生产环境**：开发时，Vite 在 3000 端口提供 React 应用，并代理 API 请求到 8000 端口的 Oak 服务器。生产时，Oak 服务器在 8000 端口同时提供构建好的 React 应用和 API。

3. **现代 React 模式**：应用使用 React 19，函数组件，Hooks 和 React Router 进行导航。

4. **类型安全**：尽管示例未使用独立的类型文件，在大型应用中你通常会为数据结构创建 TypeScript 接口。

你可以在 [Deno Deploy 上运行的应用版本](https://tutorial-with-react.deno.deno.net/) 看到样例。

## 构建和部署

我们设置了一个 `serve` 任务，构建 React 应用并通过 Oak 后端服务它。运行以下命令以生产模式构建和提供应用：

```sh
deno run build
deno run serve
```

这会：

1. 使用 Vite 构建 React 应用（输出到 `dist/`）
2. 启动 Oak 服务器，提供 API 和已构建的 React 应用

在浏览器中访问 `localhost:8000` 以查看生产版本的应用！

你可以将此应用部署到你喜欢的云服务。我们推荐使用 [Deno Deploy](https://deno.com/deploy) 以获得简单便捷的部署体验。你可以直接从 GitHub 部署应用，只需创建 GitHub 仓库并推送代码，然后连接到 Deno Deploy。

### 创建 GitHub 仓库

[创建一个新的 GitHub 仓库](https://github.com/new)，然后初始化并推送你的应用到 GitHub：

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'my react app'
git push -u origin main
```

### 部署到 Deno Deploy

应用上传到 GitHub 后，你可以在 Deno Deploy<sup>EA</sup> 仪表盘中部署它。
<a href="https://app.deno.com/" class="docs-cta deploy-cta deploy-button">部署我的应用</a>

有关部署应用的完整流程，请查看 [Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

🦕 现在你已准备好使用 Vite 和 Deno 脚手架搭建和开发 React 应用！你可以构建超高速的 Web 应用。我们希望你喜欢探索这些前沿工具，期待看到你的杰作！