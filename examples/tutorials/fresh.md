---
title: "构建一个 Fresh 应用"
description: "使用 Fresh 和 Deno 构建全栈应用的完整指南。学习如何设置项目、使用岛屿架构实现服务器端渲染、添加 API 路由，以及部署你的 TypeScript 应用。"
url: /examples/fresh_tutorial/
---

[Fresh](https://fresh.deno.dev/) 是一个面向 Deno 的全栈 Web 框架，强调使用岛屿交互的服务器端渲染。它默认不向客户端发送任何 JavaScript，使其运行极其快速且高效。Fresh 采用基于文件的路由系统，并利用 Deno 现代运行时的能力。

在本教程中，我们将构建一个简单的恐龙目录应用，演示 Fresh 的关键特性。该应用将展示恐龙列表，允许你查看单个恐龙的详细信息，并使用 Fresh 的岛屿架构添加交互组件。

你可以查看
[GitHub 上的完整应用代码仓库](https://github.com/denoland/tutorial-with-fresh)
和
[Deno Deploy 上的应用演示](https://tutorial-with-fresh.deno.deno.net/)。

:::info 部署你自己的应用

想跳过教程，立即部署完成的应用吗？点击下面的按钮，即可将完整的 Fresh 恐龙应用即时部署到 Deno Deploy。你将获得一个可实时运行的应用，可以在学习过程中自定义和修改！

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-fresh)

:::

## 创建 Fresh 项目

Fresh 提供了便捷的脚手架工具来创建新项目。在你的终端中运行以下命令：

```sh
deno run -Ar jsr:@fresh/init
```

此命令将会：

- 下载最新的 Fresh 脚手架脚本
- 创建一个名为 `my-fresh-app` 的新目录
- 设置基础的 Fresh 项目结构
- 安装所有必需的依赖

进入新项目目录：

```sh
cd my-fresh-app
```

启动开发服务器：

```sh
deno task dev
```

打开浏览器，访问 `http://localhost:5173`，即可看到你的 Fresh 应用运行起来了！

## 了解项目结构

项目包含以下关键目录和文件：

```text
my-fresh-app/
├── assets/           # 静态资源（图片、CSS 等）
├── components/       # 可重用的 UI 组件
├── islands/          # 交互式组件（岛屿）
├── routes/           # 基于文件的路由
│  └── api/           # API 路由
├── static/           # 静态资源（图片、CSS 等）
├── main.ts           # 应用入口文件
├── deno.json         # Deno 配置文件
└── README.md         # 项目文档
```

## 添加恐龙数据

为了给应用添加恐龙数据，我们将创建一个简单的数据文件，里面包含一些恐龙的 JSON 信息。在真实应用中，这些数据可能来自数据库或外部 API，但为了简单起见，我们使用静态文件。

在 `routes/api` 目录下创建一个新文件 `data.json`，并复制这里的内容：
[链接](https://github.com/denoland/tutorial-with-fresh/blob/main/routes/api/data.json)。

## 显示恐龙列表

主页将显示一个可点击的恐龙列表，用户点击后可查看详细信息。我们更新 `routes/index.tsx` 文件来获取并展示恐龙数据。

首先将文件头部的 `<title>` 改为 "Dinosaur Encyclopedia"。然后添加一些基本的 HTML 来介绍应用。

```tsx title="index.tsx"
<main>
  <h1>🦕 Welcome to the Dinosaur Encyclopedia</h1>
  <p>Click on a dinosaur below to learn more.</p>
  <div class="dinosaur-list">
    {/* Dinosaur list will go here */}
  </div>
</main>;
```

我们将创建一个新组件，用于展示列表中的每个恐龙。

## 创建组件

在 `components/LinkButton.tsx` 文件中创建以下代码：

```tsx title="LinkButton.tsx"
import type { ComponentChildren } from "preact";

export interface LinkButtonProps {
  href?: string;
  class?: string;
  children?: ComponentChildren;
}

export function LinkButton(props: LinkButtonProps) {
  return (
    <a
      {...props}
      class={"btn " +
        (props.class ?? "")}
    />
  );
}
```

该组件渲染一个看起来像按钮的样式化链接，接收 `href`、`class` 和 `children` 属性。

最后，更新 `routes/index.tsx`，导入并使用新建的 `LinkButton` 组件来显示恐龙列表。

```tsx title="index.tsx"
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import data from "./api/data.json" with { type: "json" };
import { LinkButton } from "../components/LinkButton.tsx";

export default define.page(function Home() {
  return (
    <>
      <Head>
        <title>Dinosaur Encyclopedia</title>
      </Head>
      <main>
        <h1>🦕 Welcome to the Dinosaur Encyclopedia</h1>
        <p>Click on a dinosaur below to learn more.</p>
        <div class="dinosaur-list">
          {data.map((dinosaur: { name: string; description: string }) => (
            <LinkButton
              href={`/dinosaurs/${dinosaur.name.toLowerCase()}`}
              class="btn-primary"
            >
              {dinosaur.name}
            </LinkButton>
          ))}
        </div>
      </main>
    </>
  );
});
```

## 创建动态路由

Fresh 允许我们通过基于文件的路由创建动态路由。我们将创建一个新路由来显示单个恐龙的详细信息。

在 `routes/dinosaurs/[name].tsx` 文件中，根据参数名获取恐龙数据并展示。

```tsx title="[dinosaur].tsx"
import { PageProps } from "$fresh/server.ts";
import data from "../api/data.json" with { type: "json" };
import { LinkButton } from "../../components/LinkButton.tsx";

export default function DinosaurPage(props: PageProps) {
  const name = props.params.dinosaur;
  const dinosaur = data.find((d: { name: string }) =>
    d.name.toLowerCase() === name.toLowerCase()
  );

  if (!dinosaur) {
    return (
      <main>
        <h1>Dinosaur not found</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>{dinosaur.name}</h1>
      <p>{dinosaur.description}</p>
      <LinkButton href="/" class="btn-secondary">← Back to list</LinkButton>
    </main>
  );
}
```

## 使用岛屿添加交互

Fresh 的岛屿架构允许我们给特定组件添加交互，而不向客户端发送多余的 JavaScript。我们来创建一个简单的交互组件，允许用户“收藏”某只恐龙。

在 `islands/FavoriteButton.tsx` 文件中添加以下代码：

```tsx title="FavoriteButton.tsx"
import { useState } from "preact/hooks";

export default function FavoriteButton() {
  const [favorited, setFavorited] = useState(false);

  return (
    <button
      type="button"
      className={`btn fav ${favorited ? "btn-favorited" : "btn-primary"}`}
      onClick={() => setFavorited((f) => !f)}
    >
      {favorited ? "★ Favorited!" : "☆ Add to Favorites"}
    </button>
  );
}
```

它是一个简单按钮，点击时切换收藏状态。你也可以扩展它，将收藏状态存储到数据库或本地存储，实现更完整的功能。

接着，在 `routes/dinosaurs/[dinosaur].tsx` 顶部导入该 `FavoriteButton` 岛屿：

```tsx title="[dinosaur].tsx"
import FavoriteButton from "../../islands/FavoriteButton.tsx";
```

然后在 JSX 中添加 `<FavoriteButton />` 组件，比如放在返回列表按钮前面：

```tsx title="[dinosaur].tsx"
<FavoriteButton />;
```

## 应用样式

我们已经为应用准备了一些基础样式，但你也可以在 `assets/styles.css` 文件中添加自定义 CSS。在 `routes/_app.tsx` 的 `<head>` 中添加链接引用我们的样式表：

```tsx title="_app.tsx"
<link rel="stylesheet" href="https://demo-styles.deno.deno.net/styles.css" />;
```

## 运行应用

确认你的开发服务器正在运行：

```sh
deno task dev
```

打开浏览器访问 `http://localhost:5173`，查看你的恐龙目录应用！你应该可以查看恐龙列表，点击任意一项查看细节，并能通过“收藏”按钮切换收藏状态。

## 构建与部署

默认的 Fresh 应用附带了一个使用 Vite 构建应用的 `build` 任务。你可以通过以下命令来构建生产版本：

```sh
deno run build
```

该命令会将优化后的文件输出到 `_fresh` 目录。

要运行已构建的应用，可以使用 `start` 任务，它会自动加载 `_fresh` 中的优化资源：

```sh
deno task start
```

打开浏览器，访问 `http://localhost:8000`，查看生产环境的应用。

你可以将此应用部署到你喜欢的云服务商。我们推荐使用 [Deno Deploy](https://deno.com/deploy) 进行简单快速的部署。你只需将代码推送到 GitHub，然后与 Deno Deploy 连接即可。

### 创建 GitHub 仓库

[创建一个新的 GitHub 仓库](https://github.com/new)，然后初始化并推送你的应用代码：

```sh
git init -b main
git remote add origin https://github.com/<your_github_username>/<your_repo_name>.git
git add .
git commit -am 'my fresh app'
git push -u origin main
```

### 部署到 Deno Deploy

代码在 GitHub 后，可以
[部署到 Deno Deploy<sup>EA</sup>](https://console.deno.com/)。

如果想要部署教程，可以参考
[Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

🦕 现在你拥有了一个基础的 Fresh 应用！这里有一些扩展恐龙目录的建议：

- 添加数据库（尝试 [Deno KV](https://docs.deno.com/runtime/fundamentals/kv/) 或连接到 [PostgreSQL](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)）
- 实现用户身份验证
- 增加更多交互功能如收藏或评分
- 连接外部 API 获取更多恐龙数据

Fresh 架构让你轻松构建快速、可扩展的 Web 应用，同时保持良好的开发体验。默认的服务器端渲染结合可选的客户端交互，为你提供了两者的最佳结合。