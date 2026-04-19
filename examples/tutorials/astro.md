---
last_modified: 2025-09-29
title: "使用 Deno 构建 Astro"
description: "使用 Astro 和 Deno 构建 Web 应用的分步教程。了解如何搭建项目脚手架、创建动态页面、实现 SSR，并使用 Deno 的 Node.js 兼容性部署你的 Astro 站点。"
url: /examples/astro_tutorial/
---

[Astro](https://astro.build/) 是一个专注于内容驱动型网站的现代 Web 框架，采用 Islands 架构，默认情况下不会向客户端发送任何 JavaScript。你可以查看[GitHub 上的完整应用](https://github.com/denoland/tutorial-with-astro)。

你可以在 [Deno Deploy](https://tutorial-with-astro.deno.deno.net/) 上看到该应用的在线版本。

:::info 部署你自己的应用

想跳过教程，立即部署完整的 Astro 恐龙应用？点击以下按钮，立即将完整的 Astro 恐龙应用副本部署到 Deno Deploy。你将获得一个可在线运行、可自定义并修改的应用，边学边用！

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/tutorial-with-astro)

:::

## 创建一个 Astro 项目

Astro 提供了一个 CLI 工具，可快速生成新的 Astro 项目。在你的终端运行以下命令，使用 Deno 创建一个新的 Astro 项目。

```sh
deno init --npm astro@latest
```

在本教程中，我们选择“Empty”模板，方便从零开始搭建，然后安装依赖。

此操作将为我们搭建一个基础的 Astro 项目结构，包括一个 `package.json` 文件，以及存放应用代码的 `src` 目录。

## 启动 Astro 服务器

我们可以使用 `dev` 任务启动本地 Astro 开发服务器。在终端切换到新项目目录，运行：

```sh
deno task dev
```

这将启动 Astro 开发服务器，监视文件改动并自动刷新浏览器页面。你会看到服务器运行在 `http://localhost:4321` 的提示信息。

在浏览器访问该 URL，你应该看到一个非常基础的 Astro 欢迎页面。

## 构建应用架构

现在我们已搭建好基础 Astro 项目，接下来构建应用架构。我们将创建几个目录以组织代码，并设置基础路由。创建以下目录结构：

```text
src/
    ├── data/
    ├── lib/
    └── pages/
        └── index.astro
```

## 添加恐龙数据

在 `data` 目录下新建一个名为 `data.json` 的文件，用于存放硬编码的恐龙数据。

复制以下[这个 json 文件](https://raw.githubusercontent.com/denoland/tutorial-with-astro/refs/heads/main/src/data/data.json)内容，粘贴到 `data.json` 文件中。（如果是实际项目，你可能会从数据库或外部 API 拉取这些数据。）

## 设置业务逻辑

接着，我们创建一个 `lib` 目录，放置业务逻辑代码。在这里我们创建 `dinosaur-service.ts` 文件，包含用于获取恐龙数据的函数。新建 `src/lib/dinosaur-service.ts` 并写入如下代码：

```ts title="src/lib/dinosaur-service.ts"
// 简单的恐龙数据处理工具函数
import dinosaursData from "../data/data.json";

export interface Dinosaur {
  name?: string;
  description: string;
}

export class DinosaurService {
  private static dinosaurs: Dinosaur[] = dinosaursData;

  // 获取所有有名称的恐龙（过滤掉无名恐龙）
  static getNamedDinosaurs(): Dinosaur[] {
    return this.dinosaurs.filter((dino) => dino.name);
  }

  // 根据恐龙名称创建 URL 友好的 slug
  static createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // 根据 slug 获取恐龙数据
  static getDinosaurBySlug(slug: string): Dinosaur | undefined {
    return this.dinosaurs.find((dino) => {
      if (!dino.name) return false;
      return this.createSlug(dino.name) === slug;
    });
  }

  // 获取带 slug 的恐龙数据列表以用作链接
  static getDinosaursWithSlugs() {
    return this.getNamedDinosaurs().map((dino) => ({
      ...dino,
      slug: this.createSlug(dino.name!),
    }));
  }
}

export default DinosaurService;
```

该文件定义了一个 `DinosaurService` 类，包含获取所有恐龙、创建 URL 友好 slug 和根据 slug 获取恐龙数据的方法。

## 更新首页使用服务

现在可以更新 `index.astro` 页面，调用 `DinosaurService` 获取恐龙数据并渲染为链接列表。更新 `src/pages/index.astro` 文件内容如下：

```jsx title="src/pages/index.astro"
---
import DinosaurService from '../lib/dinosaur-service';
import '../../styles/index.css';

// 获取带 slug 的所有恐龙，用于创建链接
const dinosaursWithSlugs = DinosaurService.getDinosaursWithSlugs();
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>恐龙目录</title>
	</head>
	<body>
		<h1>🦕 恐龙目录</h1>
		<p>点击任意恐龙名称了解更多信息！</p>
		
		<div class="dinosaur-list">
			{dinosaursWithSlugs.map((dinosaur) => (
				<a href={`/dinosaur/${dinosaur.slug}`} class="dinosaur-link">
					{dinosaur.name}
				</a>
			))}
		</div>
	</body>
</html>
```

我们导入了 `DinosaurService`，然后遍历恐龙数据，创建指向单个恐龙页面的链接。

## 创建单个恐龙详情页

接下来为每只恐龙创建独立页面。在 `src/pages` 目录中创建一个 `dinosaurs` 文件夹，在该文件夹内创建名为 `[slug].astro` 的文件，内容如下：

```jsx title="src/pages/dinosaurs/[slug].astro"
---
import DinosaurService from '../../lib/dinosaur-service';
import '../../styles/index.css';

export async function getStaticPaths() {
    const dinosaursWithSlugs = DinosaurService.getDinosaursWithSlugs();
    
    return dinosaursWithSlugs.map((dinosaur) => ({
        params: { slug: dinosaur.slug },
        props: { dinosaur }
    }));
}

const { dinosaur } = Astro.props;
---

<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content={Astro.generator} />
        <title>{dinosaur.name} - 恐龙目录</title>
        <meta name="description" content={dinosaur.description} />
		<link rel="stylesheet" href="https://demo-styles.deno.deno.net/styles.css">
    </head>
    <body class="dinosaur">
        <main>
            <h1>🦕 {dinosaur.name}</h1>
            
            <div class="info-card">
                <p>{dinosaur.description}</p>
            </div>
            
            <a href="/" class="btn-secondary">返回目录</a>
        </main>
    </body>
</html>
```

该文件使用 `getStaticPaths` 生成所有恐龙的静态路由路径，`Astro.props` 会携带当前 slug 对应的恐龙数据，我们在页面中进行渲染。

## 添加样式

你可以在 `src/styles/index.css` 文件中为应用添加个性化样式。该文件在 `index.astro` 和 `[slug].astro` 文件中都被导入，因此所添加的样式会应用于这两个页面。

## 构建和部署

Astro 内置了用于生产构建的命令：

```sh
deno run build
```

此命令将：

- 在 `dist` 目录中生成每个页面对应的静态 HTML 文件。
- 优化你的资源文件（CSS、JavaScript、图片等），适配生产环境。

你可以将该应用部署到你喜欢的云提供商。我们推荐使用 [Deno Deploy](https://deno.com/deploy)，体验简单便捷。你可以直接从 GitHub 部署，只需新建一个 GitHub 仓库，推送代码后连接到 Deno Deploy 即可。

### 创建 GitHub 仓库

[创建一个新的 GitHub 仓库](https://github.com/new)，然后初始化并推送你的项目：

```sh
git init -b main
git remote add origin https://github.com/<你的_github_用户名>/<你的仓库名>.git
git add .
git commit -am 'initial commit'
git push -u origin main
```

### 部署到 Deno Deploy

代码托管至 GitHub 后，你可以在 [Deno Deploy<sup>EA</sup> 控制面板](https://console.deno.com/) 上进行部署。

如果想了解部署流程，请查看 [Deno Deploy 教程](/examples/deno_deploy_tutorial/)。

🦕 现在，你可以使用 Deno 搭建并开发一个 Astro 应用！你可以继续扩展该应用，比如添加用户认证、数据库，甚至 CMS。我们期待看到你基于 Astro 和 Deno 创造的精彩项目！