---
title: "使用 Docker 部署 Deno"
description: "了解如何使用 Docker 将 Deno 应用容器化，并将其部署到兼容的云环境中。"
url: /examples/deploying_deno_with_docker/
videoUrl: https://www.youtube.com/watch?v=VRryNeYm6yw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=16
layout: video.tsx
---

## 视频描述

看看如何使用 Docker 将 Deno 应用部署到兼容的云环境中。

## 资源

- https://github.com/denoland/deno_docker
- https://fly.io/
- https://docs.deno.com/runtime/reference/docker/

## 转录和代码

Deno 让很多事情看起来都很简单：lint、格式化、与 Node 生态系统的互操作、测试、TypeScript，但部署呢？让 Deno 在生产环境中运行有多容易？相当容易！

让我们先看看我们的应用。它是一个为我们提供树木相关信息的应用。在首页我们会看到一些文本；在 trees 路由上，我们会得到一些 JSON；在基于树木 id 的动态路由上，我们会得到那棵树的相关信息。

```ts
import { Hono } from "jsr:@hono/hono";

const app = new Hono();

interface Tree {
  id: string;
  species: string;
  age: number;
  location: string;
}

const oak: Tree = {
  id: "1",
  species: "oak",
  age: 3,
  location: "Jim's Park",
};

const maple: Tree = {
  id: "2",
  species: "maple",
  age: 5,
  location: "Betty's Garden",
};

const trees: Tree[] = [oak, maple];

app.get("/", (c) => {
  return c.text("🌲 🌳 The Trees Welcome You! 🌲 🌳");
});

app.get("/trees", (c) => {
  return c.json(trees);
});

app.get("/trees/:id", (c) => {
  const id = c.req.param("id");
  const tree = trees.find((tree) => tree.id === id);
  if (!tree) return c.json({ message: "That tree isn't here!" }, 404);
  return c.json(tree);
});

Deno.serve(app.fetch);
```

## 使用 Docker 在本地运行

请确保你的机器上已安装 Docker。在终端或命令提示符中，你可以运行 docker，如果你看到了很长的命令列表，就说明它已经安装好了。如果没有，请前往 https://www.docker.com/ 并根据你的操作系统下载。

### 测试运行 docker：

```shell
docker
```

然后运行命令，使用 Docker 在 `localhost:8000` 上启动

```shell
docker run -it -p 8000:8000 -v $PWD:/my-deno-project denoland/deno:2.0.2 run
--allow-net /my-deno-project/main.ts
```

访问运行在 `localhost:8000` 的应用

也可以通过 docker 配置文件来运行它。

```dockerfile
FROM
denoland/deno:2.0.2

# 应用监听的端口。

EXPOSE 8000

WORKDIR /app

# 尽量不要以 root 身份运行。
USER deno

# 每当工作目录中的文件发生变更时，这些步骤都会重新执行：
COPY . .

# 预编译主应用，这样每次启动/入口时都不需要重新编译。
RUN deno cache main.ts

# 预热缓存
RUN timeout 10s deno -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["run", "--allow-net", "main.ts"]
```

然后构建它

```shell
docker build -t my-deno-project .
```

从这里开始，你就可以将应用部署到你选择的托管服务提供商。我今天要使用 fly.io。

## 部署到 fly.io

如果你以前没有使用过 Fly，那么它是一个云平台，允许你部署和运行全栈应用。它们在全球多个地区运行，这使它成为一个相当不错的选择。https://fly.io/

### 安装 Fly

使用 curl 安装

```shell
curl -L https://fly.io/install.sh | sh
```

### 通过 CLI 使用 Fly 登录

```shell
fly auth login
```

这将为你打开浏览器，以便登录你的账户（或者如果你还没有账户，可以创建一个）。然后我们将使用 fly 启动应用：

```shell
flyctl launch
```

这将为应用生成一个 fly.toml 文件，你可以根据需要选择不同的设置。更重要的是，它会把它启动起来！我们只需等待过程完成，应该就能在那个地址查看我们的应用运行情况。

因此，借助 Deno，我们可以使用 Docker 将应用容器化；借助 Fly，我们可以在几分钟内将应用托管到生产环境中。

## 关于使用 Docker 的更多信息

如果你想更深入地了解 Deno 对 Docker 的支持，包括最佳实践、使用 Docker 运行测试、使用工作区等，请查看我们的 [Deno 和 Docker 参考文档](https://docs.deno.com/runtime/reference/docker/)。
