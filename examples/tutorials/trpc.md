---
title: "Build a Typesafe API with tRPC and Deno"
description: "A guide to building type-safe APIs with tRPC and Deno. Learn how to set up endpoints, implement RPC procedures, handle data validation, and create efficient client-server applications."
url: /examples/trpc_tutorial/
oldUrl:
  - /runtime/tutorials/trpc/
---

Deno 是一个
[一体化、零配置的工具链](https://docs.deno.com/runtime/manual/tools)
，用于编写 JavaScript 和
[TypeScript](https://docs.deno.com/runtime/fundamentals/typescript/)，
[natively supports Web Platform APIs](https://docs.deno.com/runtime/reference/web_platform_apis/)，
使其成为快速构建后端和 API 的理想选择。为了使我们的 API 更易于维护，我们可以使用 [tRPC](https://trpc.io/)，这是一个 TypeScript RPC
([远程过程调用](https://zh.wikipedia.org/wiki/%E8%BF%9C%E7%A8%8B%E8%BF%87%E7%A8%8B%E8%B0%83%E7%94%A8))
框架，它使您能够在没有模式声明或代码生成的情况下构建完全类型安全的 API。

在本教程中，我们将使用 tRPC 和 Deno 构建一个简单的类型安全 API，该 API 返回有关恐龙的信息：

- [设置 tRPC](#set-up-trpc)
- [设置服务器](#set-up-the-trpc-server)
- [设置客户端](#set-up-the-trpc-client)
- [接下来会怎样？](#whats-next)

您可以在
[这个 GitHub 仓库](https://github.com/denoland/examples/tree/main/with-trpc)
中找到本教程的所有代码。

## 设置 tRPC

要在 Deno 中开始使用 tRPC，我们需要安装所需的依赖项。由于 Deno 的 npm 兼容性，我们可以使用 tRPC 包的 npm 版本以及用于输入验证的 Zod：

```bash
deno install npm:@trpc/server@next npm:@trpc/client@next npm:zod jsr:@std/path
```

这将安装最新的 tRPC 服务器和客户端包，
[Zod](https://zod.dev/) 用于运行时类型验证，以及
[Deno 标准库的 `path`](https://jsr.io/@std/path) 工具。这些包将允许我们在客户端和服务器代码之间构建一个类型安全的 API 层。

这将在项目根目录创建一个 `deno.json` 文件，以管理 npm 和
[jsr](https://jsr.io/) 依赖项：

```tsx
{
  "imports": {
    "@std/path": "jsr:@std/path@^1.0.6",
    "@trpc/client": "npm:@trpc/client@^11.0.0-rc.593",
    "@trpc/server": "npm:@trpc/server@^11.0.0-rc.593",
    "zod": "npm:zod@^3.23.8"
  }
}
```

## 设置 tRPC 服务器

构建我们的 tRPC 应用的第一步是设置服务器。我们将通过初始化 tRPC 并创建我们的基本路由器和过程构建器来开始。这些将是定义我们的 API 端点的基础。

创建一个 `server/trpc.ts` 文件：

```tsx
// server/trpc.ts

import { initTRPC } from "@trpc/server";

/**
 * tRPC 后端的初始化
 * 每个后端只应执行一次！
 */

const t = initTRPC.create();

/**
 * 导出可重用的路由器和过程帮助程序
 * 可在整个路由器中使用
 */

export const router = t.router;
export const publicProcedure = t.procedure;
```

这初始化了 tRPC 并导出了我们将用来定义 API 端点的路由器和过程构建器。`publicProcedure` 允许我们创建不需要身份验证的端点。

接下来，我们将创建一个简单的数据层来管理我们的恐龙数据。创建一个 `server/db.ts` 文件，如下所示：

```tsx
// server/db.ts
import { join } from "@std/path";

type Dino = { name: string; description: string };

const dataPath = join("data", "data.json");

async function readData(): Promise<Dino[]> {
  const data = await Deno.readTextFile(dataPath);
  return JSON.parse(data);
}

async function writeData(dinos: Dino[]): Promise<void> {
  await Deno.writeTextFile(dataPath, JSON.stringify(dinos, null, 2));
}

export const db = {
  dino: {
    findMany: () => readData(),
    findByName: async (name: string) => {
      const dinos = await readData();
      return dinos.find((dino) => dino.name === name);
    },
    create: async (data: { name: string; description: string }) => {
      const dinos = await readData();
      const newDino = { ...data };
      dinos.push(newDino);
      await writeData(dinos);
      return newDino;
    },
  },
};
```

这创建了一个简单的基于文件的数据库，用于读取和写入恐龙数据到 JSON 文件。在生产环境中，您通常会使用一个适当的数据库，但这对于我们的演示来说效果很好。

> ⚠️️ 在本教程中，我们硬编码数据并使用基于文件的数据库。然而，您可以
> [连接到多种数据库](https://docs.deno.com/runtime/tutorials/connecting_to_databases/)
> 并使用如 [Drizzle](https://docs.deno.com/examples/drizzle) 或
> [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/) 的 ORM。

最后，我们需要提供实际数据。让我们创建一个 `./data.json` 文件，包含一些示例恐龙数据：

```tsx
// data/data.json
[
  {
    "name": "Aardonyx",
    "description": "An early stage in the evolution of sauropods."
  },
  {
    "name": "Abelisaurus",
    "description": "\"Abel's lizard\" has been reconstructed from a single skull."
  },
  {
    "name": "Abrictosaurus",
    "description": "An early relative of Heterodontosaurus."
  },
  {
    "name": "Abrosaurus",
    "description": "A close Asian relative of Camarasaurus."
  },
  ...
 ]
```

现在，我们可以创建我们的主服务器文件，定义我们的 tRPC 路由器和过程。创建一个 `server/index.ts` 文件：

```tsx
// server/index.ts

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { db } from "./db.ts";
import { publicProcedure, router } from "./trpc.ts";

const appRouter = router({
  dino: {
    list: publicProcedure.query(async () => {
      const dinos = await db.dino.findMany();
      return dinos;
    }),
    byName: publicProcedure.input(z.string()).query(async (opts) => {
      const { input } = opts;
      const dino = await db.dino.findByName(input);
      return dino;
    }),
    create: publicProcedure
      .input(z.object({ name: z.string(), description: z.string() }))
      .mutation(async (opts) => {
        const { input } = opts;
        const dino = await db.dino.create(input);
        return dino;
      }),
  },
  examples: {
    iterable: publicProcedure.query(async function* () {
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
  },
});

// 导出类型路由器类型签名，这由客户端使用。
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
```

这设置了三个主要端点：

- `dino.list`: 返回所有恐龙
- `dino.byName`: 根据名称返回特定恐龙
- `dino.create`: 创建新的恐龙
- `examples.iterable`: 演示 tRPC 对异步可迭代对象的支持

服务器已配置为在 3000 端口监听并处理所有 tRPC 请求。

虽然您现在可以运行服务器，但您将无法访问任何路由并让它返回数据。让我们修复这个问题！

## 设置 tRPC 客户端

服务器准备好后，我们可以创建一个客户端来使用类型安全地调用我们的 API。创建一个 `client/index.ts` 文件：

```tsx
// client/index.ts
/**
 * 这是客户端代码，使用来自服务器的推断类型
 */
import {
  createTRPCClient,
  splitLink,
  unstable_httpBatchStreamLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
/**
 * 我们只从服务器导入 `AppRouter` 类型 - 这在运行时不可用
 */
import type { AppRouter } from "../server/index.ts";

// 初始化 tRPC 客户端
const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: unstable_httpSubscriptionLink({
        url: "http://localhost:3000",
      }),
      false: unstable_httpBatchStreamLink({
        url: "http://localhost:3000",
      }),
    }),
  ],
});

const dinos = await trpc.dino.list.query();
console.log("Dinos:", dinos);

const createdDino = await trpc.dino.create.mutate({
  name: "Denosaur",
  description:
    "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast.",
});
console.log("Created dino:", createdDino);

const dino = await trpc.dino.byName.query("Denosaur");
console.log("Denosaur:", dino);

const iterable = await trpc.examples.iterable.query();

for await (const i of iterable) {
  console.log("Iterable:", i);
}
```

这段客户端代码演示了 tRPC 的几个关键特性：

1. **从服务器路由器的类型推断**。客户端通过导入 `AppRouter` 类型自动继承所有类型定义。这意味着您获得完整的类型支持和编译时类型检查，适用于所有 API 调用。如果您在服务器上修改过程，TypeScript 将立即标记任何不兼容的客户端用法。
2. **进行查询和变更**。该示例演示了两种类型的 API 调用：查询（`list` 和 `byName`）用于提取数据而不产生副作用，以及变更（`create`）用于修改服务器端状态的操作。客户端自动知道每个过程的输入和输出类型，从而在整个请求周期中提供类型安全。
3. **使用异步可迭代对象**。`examples.iterable` 演示了 tRPC 对使用异步可迭代对象流数据的支持。这一特性对于实时更新或分块处理大型数据集特别有用。

现在，让我们启动服务器以查看其工作情况。在我们的 `deno.json` 配置文件中，让我们创建一个新属性 `tasks`，包含以下命令：

```json
{
  "tasks": {
    "start": "deno -A server/index.ts",
    "client": "deno -A client/index.ts"
  }
  // deno.json 中的其他属性保持不变。
}
```

我们可以使用 `deno task` 列出可用的任务：

```bash
deno task
Available tasks:
- start
    deno -A server/index.ts
- client
    deno -A client/index.ts
```

现在，我们可以使用 `deno task start` 启动服务器。运行之后，我们可以使用 `deno task client` 启动客户端。您应该会看到如下输出：

```bash
deno task client
Dinos: [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods."
  },
  {
    name: "Abelisaurus",
    description: "Abel's lizard has been reconstructed from a single skull."
  },
  {
    name: "Abrictosaurus",
    description: "An early relative of Heterodontosaurus."
  },
  ...
]
Created dino: {
  name: "Denosaur",
  description: "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast."
}
Denosaur: {
  name: "Denosaur",
  description: "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast."
}
Iterable: 0
Iterable: 1
Iterable: 2
```

成功了！运行 `./client/index.ts` 显示了如何创建一个 tRPC 客户端，并使用其 JavaScript API 与数据库交互。但我们如何检查 tRPC 客户端是否从数据库推断了正确的类型呢？让我们将 `./client/index.ts` 中的代码片段修改为传递一个 `number` 而不是一个 `string` 作为 `description`：

```diff
// ...
const createdDino = await trpc.dino.create.mutate({
  name: "Denosaur",
  description:
-   "A dinosaur that lives in the deno ecosystem. Eats Nodes for breakfast.",
+   100,
});
console.log("Created dino:", createdDino);
// ...
```

当我们重新运行客户端：

```bash
deno task client
...
error: Uncaught (in promise) TRPCClientError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [
      "description"
    ],
    "message": "Expected string, received number"
  }
]
    at Function.from (file:///Users/andyjiang/Library/Caches/deno/npm/registry.npmjs.org/@trpc/client/11.0.0-rc.608/dist/TRPCClientError.mjs:35:20)
    at file:///Users/andyjiang/Library/Caches/deno/npm/registry.npmjs.org/@trpc/client/11.0.0-rc.608/dist/links/httpBatchStreamLink.mjs:118:56
    at eventLoopTick (ext:core/01_core.js:175:7)
```

tRPC 成功抛出了一个 `invalid_type` 错误，因为它期望的是 `string` 而不是 `number`。

## 接下来会怎样？

现在您对如何在 Deno 中使用 tRPC 有了基本的了解，您可以：

1. 使用 [Next.js](https://trpc.io/docs/client/nextjs) 或
   [React](https://trpc.io/docs/client/react) 构建一个实际的前端
2. [使用 tRPC 中间件为您的 API 添加身份验证](https://trpc.io/docs/server/middlewares#authorization)
3. 实施实时功能
   [使用 tRPC 订阅](https://trpc.io/docs/server/subscriptions)
4. 为更复杂的数据结构添加 [输入验证](https://trpc.io/docs/server/validators)
5. 与适当的数据库集成，如
   [PostgreSQL](https://docs.deno.com/runtime/tutorials/connecting_to_databases/#postgres)
   或使用 ORM，如 [Drizzle](https://docs.deno.com/examples/drizzle) 或
   [Prisma](https://docs.deno.com/runtime/tutorials/how_to_with_npm/prisma/)
6. 将应用程序部署到 [Deno Deploy](https://deno.com/deploy) 或
   [通过 Docker 部署到任何公共云](https://docs.deno.com/runtime/tutorials/#deploying-deno-projects)

🦕 祝您在 Deno 和 tRPC 编码时享受类型安全的乐趣！