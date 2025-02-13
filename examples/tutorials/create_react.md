---
title: "使用 create-vite 构建 React 应用"
url: /examples/create_react_tutorial/
oldUrl:
- /runtime/tutorials/how_to_with_npm/create-react/
---

[React](https://reactjs.org) 是最广泛使用的 JavaScript 前端库。

在本教程中，我们将使用 Deno 构建一个简单的 React 应用。该应用将显示
一系列恐龙。当你点击其中一个时，它将带你进入一个有更多详细信息的恐龙页面。你可以在 GitHub 上查看
[完成的应用仓库](https://github.com/denoland/tutorial-with-react)

![应用演示](./images/how-to/react/react-dinosaur-app-demo.gif)

## 使用 Vite 和 Deno 创建 React 应用

本教程将使用 [create-vite](https://vitejs.dev/) 快速搭建 Deno 和 React 应用。Vite 是一个现代网页项目的构建工具和开发服务器。它与 React 和 Deno 结合良好，利用 ES 模块并允许你直接导入 React 组件。

在终端中运行以下命令以使用 TypeScript 模板创建一个新的 React 应用：

```sh
deno run -A npm:create-vite@latest --template react-ts
```

当提示时，给你的应用命名，然后 `cd` 进入新创建的项目目录。接着运行以下命令以安装依赖：

```sh
deno install
```

现在你可以通过运行以下命令来服务你新的 React 应用：

```sh
deno task dev
```

这将启动 Vite 服务器，点击输出链接以在浏览器中查看你的应用。如果你安装了
[VSCode 的 Deno 扩展](/runtime/getting_started/setup_your_environment/#visual-studio-code)，你可能会注意到编辑器高亮显示了代码中的一些错误。这是因为 Vite 创建的应用设计时考虑了 Node，因此使用了 Deno 不支持的约定（例如“懒惰导入” - 不带文件扩展名导入模块）。禁用此项目的 Deno 扩展以避免这些错误，或者尝试
[使用 deno.json 文件构建 React 应用的教程](/runtime/tutorials/how_to_with_npm/react/)。

## 添加后端

下一步是添加一个后端 API。我们将创建一个非常简单的 API，用于返回有关恐龙的信息。

在你的新项目根目录下，创建一个 `api` 文件夹。在该文件夹中，创建一个 `main.ts` 文件，将用于运行服务器，以及一个 `data.json` 文件，包含硬编码的恐龙数据。

将
[这个 JSON 文件](https://github.com/denoland/tutorial-with-react/blob/main/api/data.json)
复制并粘贴到 `api/data.json` 文件中。

我们将构建一个简单的 API 服务器，包含返回恐龙信息的路由。我们将使用 [`oak` 中间件框架](https://jsr.io/@oak/oak)
和 [`cors` 中间件](https://jsr.io/@tajpouria/cors) 来启用
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)。

使用 `deno add` 命令将所需的依赖添加到项目中：

```shell
deno add jsr:@oak/oak jsr:@tajpouria/cors
```

接下来，更新 `api/main.ts` 以导入所需模块，并创建一个新的 `Router` 实例以定义一些路由：

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };

const router = new Router();
```

之后，在同一文件中，我们将定义两个路由。一条是 `/api/dinosaurs` 用于返回所有恐龙，另一条是 `/api/dinosaurs/:dinosaur` 用于返回特定名称的恐龙：

```ts title="main.ts"
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

最后，在同一文件底部，创建一个新的 `Application` 实例，并使用 `app.use(router.routes())` 附加我们刚刚定义的路由，并开始监听在 8000 端口的服务器：

```ts title="main.ts"
const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

你可以通过 `deno run --allow-env --allow-net api/main.ts` 来运行 API 服务器。我们将创建一个任务在后台运行此命令，并更新开发任务以同时运行 React 应用和 API 服务器。

在你的 `package.json` 文件中，更新 `scripts` 字段以包含以下内容：

```jsonc
{
  "scripts": {
    "dev": "deno task dev:api & deno task dev:vite",
    "dev:api": "deno run --allow-env --allow-net api/main.ts",
    "dev:vite": "deno run -A npm:vite",
    // ...
}
```

如果你现在运行 `deno task dev` 并访问 `localhost:8000/api/dinosaurs`，在浏览器中应该能看到所有恐龙的 JSON 响应。

## 更新入口点

React 应用的入口点在 `src/main.tsx` 文件中。我们的将非常基础：

```tsx title="main.tsx"
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
```

## 添加路由

该应用将有两个路由：`/` 和 `/:dinosaur`。

我们将使用 [`react-router-dom`](https://reactrouter.com/en/main) 来构建一些路由逻辑，因此我们需要将 `react-router-dom` 依赖添加到项目中。在项目根目录下运行：

```shell
deno add npm:react-router-dom
```

更新 `/src/App.tsx` 文件以导入并使用 `react-router-dom` 的
[`BrowserRouter`](https://reactrouter.com/en/main/router-components/browser-router)
组件，并定义两个路由：

```tsx title="App.tsx"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/index";
import Dinosaur from "./pages/Dinosaur";
import "./App.css";

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

### 代理转发API请求

Vite 将在 `5173` 端口提供应用程序，而我们的 API 则在 `8000` 端口运行。因此，我们需要设置一个代理，以允许 `api/` 路径通过路由器可到达。覆盖 `vite.config.ts` 以配置代理：

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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

## 创建页面

我们将创建两个页面：`Index` 和 `Dinosaur`。`Index` 页面将列出所有的恐龙，`Dinosaur` 页面将显示特定恐龙的详细信息。

在 `src` 目录中创建一个 `pages` 文件夹，并在其中创建两个文件：`index.tsx` 和 `Dinosaur.tsx`。

### 类型

这两个页面将使用 `Dino` 类型来描述它们期望从 API 获取的数据形状，因此我们在 `src` 目录中创建一个 `types.ts` 文件：

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### index.tsx

该页面将从 API 获取恐龙列表并将其呈现为链接：

```tsx title="index.tsx"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dino } from "../types.ts";

export default function Index() {
  const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/dinosaurs/`);
      const allDinosaurs = await response.json() as Dino[];
      setDinosaurs(allDinosaurs);
    })();
  }, []);

  return (
    <main>
      <h1>欢迎使用恐龙应用</h1>
      <p>点击下面的恐龙以了解更多。</p>
      {dinosaurs.map((dinosaur: Dino) => {
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

该页面将从 API 获取特定恐龙的详细信息并在段落中呈现：

```tsx title="Dinosaur.tsx"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Dino } from "../types";

export default function Dinosaur() {
  const { selectedDinosaur } = useParams();
  const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/dinosaurs/${selectedDinosaur}`);
      const dino = await resp.json() as Dino;
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

### 为恐龙列表添加样式

由于我们在主页上显示恐龙列表，因此让我们进行一些基本格式化。将以下内容添加到 `src/App.css` 的底部，以按顺序显示我们的恐龙列表：

```css title="src/App.css"
.dinosaur {
  display: block;
}
```

## 运行应用

要运行应用，请使用你之前设置的任务

```sh
deno task dev
```

在浏览器中导航到本地 Vite 服务器 (`localhost:5173`)，你应该能看到显示的恐龙列表，你可以点击了解每一种恐龙。

![应用演示](./images/how-to/react/react-dinosaur-app-demo.gif)

## 构建和部署

此时，应用由 Vite 开发服务器提供。要在生产环境中服务该应用，你可以使用 Vite 构建应用，然后使用 Deno 服务构建的文件。为此，我们需要更新 API 服务器以服务构建的文件。我们将写一些中间件来实现这一点。在 `api` 目录中创建一个新文件夹 `util` 和一个名为 `routeStaticFilesFrom.ts` 的新文件，并添加以下代码：

```ts title="routeStaticFilesFrom.ts"
import { Next } from "jsr:@oak/oak/middleware";
import { Context } from "jsr:@oak/oak/context";

// 配置静态站点路由，以便我们可以服务
// Vite 构建输出和公共文件夹
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

该中间件将尝试从 `staticPaths` 数组中提供的路径服务静态文件。如果找不到文件，则会调用链中的下一个中间件。我们现在可以更新 `api/main.ts` 文件以使用这个中间件：

```ts title="main.ts"
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import data from "./data.json" with { type: "json" };
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";

const router = new Router();

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

  context.response.body = dinosaur ? dinosaur : "未找到恐龙。";
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/dist`,
  `${Deno.cwd()}/public`,
]));

await app.listen({ port: 8000 });
```

在你的 `package.json` 文件中添加一个 `serve` 脚本，以使用 Vite 构建该应用并然后运行 API 服务器：

```jsonc
{
  "scripts": {
    // ...
    "serve": "deno task build && deno task dev:api",
}
```

现在你可以通过运行以下命令使用 Deno 服务构建的应用：

```sh
deno task serve
```

如果你在浏览器中访问 `localhost:8000`，你应该会看到应用程序运行！

🦕 现在你可以使用 Vite 和 Deno 创建和开发 React 应用！你已准备好构建快速的网页应用。我们希望你在探索这些尖端工具时享受其中，我们迫不及待地想看到你会创作出什么！