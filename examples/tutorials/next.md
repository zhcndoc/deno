---
title: "构建一个 Next.js 应用"
url: /examples/next_tutorial/
oldUrl:
  - /runtime/tutorials/how_to_with_npm/next/
---

[Next.js](https://nextjs.org/) 是一个流行的框架，用于构建
服务器端渲染的应用。它构建基于 React，并且提供了许多开箱即用的功能。

在本教程中，我们将构建一个简单的 Next.js 应用并使用 Deno 运行它。
该应用将展示一个恐龙列表。当你点击其中一个时，它会带你
到一个包含更多细节的恐龙页面。

![应用的演示](./images/how-to/next/dinoapp.gif)

首先验证你安装了最新版本的 Deno，你需要至少 Deno 1.46.0：

```sh
deno --version
```

## 使用 Deno 创建一个 Next.js 应用

Next 提供了一个 CLI 工具，可快速构建一个新的 Next.js 应用。在你的终端
中运行以下命令来使用 Deno 创建一个新的 Next.js 应用：

```sh
deno run -A npm:create-next-app@latest
```

当被提示时，选择默认选项以使用 TypeScript 创建新的 Next.js 应用。

然后，`cd` 进入新创建的项目文件夹，并运行以下命令
安装依赖

```sh
deno install
```

Next.js 有一些依赖项仍然依赖于 `Object.prototype.__proto__`，所以你需要允许它。在一个新的 `deno.json` 文件中，添加以下行：

```json deno.json
{
  "unstable": ["unsafe-proto"]
}
```

现在你可以提供你的新 Next.js 应用：

```sh
deno task dev
```

这将启动 Next.js 服务器，点击输出链接到本地地址以在浏览器中查看
你的应用。

## 添加后端

下一步是添加一个后端 API。我们将创建一个非常简单的 API，它
返回关于恐龙的信息。

我们将使用 Next.js 的
[内置 API 路由处理器](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
来设置我们的恐龙 API。Next.js 使用基于文件系统的路由，其中文件夹结构直接定义路由。

我们将定义三个路由，第一个路由在 `/api` 将返回字符串
`欢迎来到恐龙 API`，然后我们将设置 `/api/dinosaurs` 来返回所有
恐龙，最后 `/api/dinosaur/[dinosaur]` 将根据 URL 中的名称返回特定
的恐龙。

### /api/

在新项目的 `app` 文件夹中，创建一个 `api` 文件夹。在该文件夹中，
创建一个 `route.ts` 文件，用于处理对 `/api/` 的请求。

将以下代码复制并粘贴到 `api/route.ts` 文件中：

```ts title="route.ts"
export async function GET() {
  return Response.json("欢迎来到恐龙 API");
}
```

这段代码定义了一个简单的路由处理器，它返回一个包含字符串 `欢迎来到恐龙 API` 的 JSON 响应。

### /api/dinosaurs

在 `api` 文件夹中，创建一个名为 `dinosaurs` 的文件夹。在该文件夹中，创建一个 `data.json` 文件，用于包含硬编码的恐龙数据。复制并粘贴
[这个 JSON 文件](https://raw.githubusercontent.com/denoland/deno-vue-example/main/api/data.json)
到 `data.json` 文件中。

在 `dinosaurs` 目录中创建一个 `route.ts` 文件，用于处理对 `/api/dinosaurs` 的请求。在这个路由中，我们将读取 `data.json` 文件并
将恐龙作为 JSON 返回：

```ts title="route.ts"
import data from "./data.json" with { type: "json" };

export async function GET() {
  return Response.json(data);
}
```

### /api/dinosaurs/[dinosaur]

对于最后一个路由 `/api/dinosaurs/[dinosaur]`，我们将在 `dinosaurs` 目录中创建一个名为 `[dinosaur]` 的文件夹。在其中，创建一个 `route.ts`
文件。在这个文件中，我们将读取 `data.json` 文件，找到 URL 中名称对应的恐龙，并将其作为 JSON 返回：

```ts title="route.ts"
import { NextRequest } from "next/server";
import data from "../data.json" with { type: "json" };

type RouteParams = { params: Promise<{ dinosaur: string }> };

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const { dinosaur } = await params;

  if (!dinosaur) {
    return Response.json("未提供恐龙名称。");
  }

  const dinosaurData = data.find((item) =>
    item.name.toLowerCase() === dinosaur.toLowerCase()
  );

  return Response.json(dinosaurData ? dinosaurData : "未找到该恐龙。");
};
```

现在，如果你运行应用并访问
`http://localhost:3000/api/dinosaurs/brachiosaurus`，你应该能看到
关于腕龙的详细信息。

## 构建前端

现在我们已经设置了后端 API，让我们构建前端展示
恐龙数据。

### 定义恐龙类型

首先我们将设置一个新的类型，以定义恐龙数据的形状。在
`app` 目录中，创建一个 `types.ts` 文件，并添加以下代码：

```ts title="types.ts"
export type Dino = { name: string; description: string };
```

### 更新主页

我们将更新 `app` 目录中的 `page.tsx` 文件，以从我们的 API 中获取恐龙
数据并将其显示为链接列表。

要在 Next.js 中执行客户端代码，我们需要在文件顶部使用
`use Client` 指令。然后我们将导入在此页面中需要的模块，并导出将
渲染该页面的默认函数：

```tsx title="page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "./types";
import Link from "next/link";

export default function Home() {
}
```

在 `Home` 函数的主体内，我们将定义一个状态变量以存储
恐龙数据，并使用 `useEffect` 钩子在组件挂载时从 API 获取数据：

```tsx title="page.tsx"
const [dinosaurs, setDinosaurs] = useState<Dino[]>([]);

useEffect(() => {
  (async () => {
    const response = await fetch(`/api/dinosaurs`);
    const allDinosaurs = await response.json() as Dino[];
    setDinosaurs(allDinosaurs);
  })();
}, []);
```

在这一段之后，还在 `Home` 函数的主体内，我们将返回一个链接列表，每个链接指向对应恐龙的页面：

```tsx title="page.tsx"
return (
  <main>
    <h1>欢迎来到恐龙应用</h1>
    <p>点击下面的恐龙以了解更多。</p>
    <ul>
      {dinosaurs.map((dinosaur: Dino) => {
        return (
          <li key={dinosaur.name}>
            <Link href={`/${dinosaur.name.toLowerCase()}`}>
              {dinosaur.name}
            </Link>
          </li>
        );
      })}
    </ul>
  </main>
);
```

### 创建恐龙页面

在 `app` 目录中，创建一个名为 `[dinosaur]` 的新文件夹。在此文件夹中创建一个 `page.tsx` 文件。此文件将从 API 中获取特定恐龙的详情并在页面上呈现。

与主页类似，我们将需要客户端代码，并导入我们需要的模块并导出一个默认函数。我们将参数传递给该函数并为此设置一个类型：

```tsx title="[dinosaur]/page.tsx"
"use client";

import { useEffect, useState } from "react";
import { Dino } from "../types";
import Link from "next/link";

type RouteParams = { params: Promise<{ dinosaur: string }> };

export default function Dinosaur({ params }: RouteParams) {
}
```

在 `Dinosaur` 函数的主体内，我们将从请求中获取选定的恐龙，设置一个状态变量以存储恐龙数据，并编写一个 `useEffect` 钩子以在组件挂载时从 API 获取数据：

```tsx title="[dinosaur]/page.tsx"
const selectedDinosaur = params.then((params) => params.dinosaur);
const [dinosaur, setDino] = useState<Dino>({ name: "", description: "" });

useEffect(() => {
  (async () => {
    const resp = await fetch(`/api/dinosaurs/${await selectedDinosaur}`);
    const dino = await resp.json() as Dino;
    setDino(dino);
  })();
}, []);
```

最后，在 `Dinosaur` 函数主体内部，我们将返回一个包含恐龙名称和描述的段落元素：

```tsx title="[dinosaur]/page.tsx"
return (
  <main>
    <h1>{dinosaur.name}</h1>
    <p>{dinosaur.description}</p>
    <Link href="/">🠠 返回所有恐龙</Link>
  </main>
);
```

## 运行应用

现在你可以使用 `deno task dev` 运行应用并访问 `http://localhost:3000`
在浏览器中查看恐龙列表。点击恐龙以查看更多
详细信息！

![应用的演示](./images/how-to/next/dinoapp.gif)

🦕 现在你可以使用 Deno 构建和运行一个 Next.js 应用！为了进一步构建你的应用，你可以考虑
[添加数据库](/runtime/tutorials/connecting_to_databases/) 来替换你的 `data.json` 文件，或者考虑
[编写一些测试](/runtime/fundamentals/testing/) 以确保你的应用可靠，具备生产准备。