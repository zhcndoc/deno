---
title: "带 Postgres 的 API 服务器"
oldUrl:
  - /deploy/docs/tutorial-postgres/
  - /deploy/manual/tutorial-postgres/
---

Postgres 是一个流行的数据库，因其灵活性和易用性而广受欢迎。本指南将向您展示如何将 Deno Deploy 与 Postgres 一起使用。

- [带 Postgres 的 API 服务器](#带-postgres-的-api-服务器)
  - [概述](#概述)
  - [设置 Postgres](#设置-postgres)
    - [Neon Postgres](#neon-postgres)
    - [Supabase](#supabase)
  - [编写并部署应用程序](#编写并部署应用程序)

## 概述

我们将构建一个简单待办列表应用程序的 API。它将有两个端点：

`GET /todos` 将返回所有待办事项的列表，`POST /todos` 将创建一个新的待办事项。

```
GET /todos
---
title: "返回所有待办事项的列表"
---
[
  {
    "id": 1,
    "title": "买面包"
  },
  {
    "id": 2,
    "title": "买大米"
  },
  {
    "id": 3,
    "title": "买香料"
  }
]

POST /todos
---
title: "创建一个新的待办事项"
---
"买牛奶"
---
title: "返回 201 状态码"
---
```

在本教程中，我们将：

- 在 [Neon Postgres](https://neon.tech/) 或 [Supabase](https://supabase.com) 上创建和设置一个 [Postgres](https://www.postgresql.org/) 实例。
- 使用 [Deno Deploy](../manual/deployctl.md) Playground 开发和部署应用程序。
- 使用 [cURL](https://curl.se/) 测试我们的应用程序。

## 设置 Postgres

> 本教程将完全专注于不加密地连接到 Postgres。如果您希望使用自定义 CA 证书进行加密，请使用 [此处](https://deno-postgres.com/#/?id=ssltls-connection) 的文档。

首先，我们需要创建一个新的 Postgres 实例以连接。对于本教程，您可以使用 [Neon Postgres](https://neon.tech/) 或 [Supabase](https://supabase.com)，因为它们都提供免费的托管 Postgres 实例。如果您希望将数据库托管在其他地方，也可以这样做。

### Neon Postgres

1. 访问 https://neon.tech/ 并点击 **注册** 通过电子邮件、Github、Google 或合作伙伴帐户注册。注册后，您将被引导到 Neon 控制台以创建第一个项目。
2. 输入项目名称，选择 Postgres 版本，提供数据库名称，并选择区域。一般来说，您会希望选择离您应用程序最近的区域。完成后，点击 **创建项目**。
3. 您将看到新项目的连接字符串，您可以用它连接到数据库。保存连接字符串，其格式类似于以下内容：

   ```sh
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Supabase

1. 访问 https://app.supabase.io/ 并点击 "新项目"。
2. 为您的数据库选择名称、密码和区域。务必保存密码，因为您稍后将需要它。
3. 点击 "创建新项目"。创建项目可能需要一段时间，请耐心等待。
4. 一旦项目创建完成，导航到左侧的 "数据库" 选项卡。
5. 转到 "连接池" 设置，从 "连接字符串" 字段中复制连接字符串。这就是您将用于连接到数据库的连接字符串。在此字符串中插入您之前保存的密码，然后将其保存在某个地方 - 稍后您将需要它。

## 编写并部署应用程序

现在我们可以开始编写应用程序了。首先，我们将在控制面板中创建一个新的 Deno Deploy Playground：在 https://dash.deno.com/projects 上按下 "新 Playground" 按钮。

这将打开 Playground 编辑器。在我们真正开始编写代码之前，我们需要将 Postgres 连接字符串放入环境变量中。为此，点击编辑器左上角的项目名称。这将打开项目设置。

在这里，您可以通过左侧导航菜单导航到 "设置" -> "环境变量" 选项卡。在 "键" 字段中输入 "DATABASE_URL"，并将连接字符串粘贴到 "值" 字段中。现在，按 "添加"。您的环境变量现在已设置。

让我们返回编辑器：为此，您可以通过左侧导航菜单转到 "概述" 选项卡，然后按 "打开 Playground"。我们先使用 `Deno.serve()` 来处理 HTTP 请求：

```ts
Deno.serve(async (req) => {
  return new Response("未找到", { status: 404 });
});
```

您现在可以使用 <kbd>Ctrl</kbd>+<kbd>S</kbd> （或 Mac 上的 <kbd>Cmd</kbd>+<kbd>S</kbd>）保存此代码。您应该看到右侧的预览页面自动刷新：现在显示 "未找到"。

接下来，让我们导入 Postgres 模块，从环境变量中读取连接字符串，并创建一个连接池。

```ts
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

// 从环境变量 "DATABASE_URL" 获取连接字符串
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// 创建一个拥有三个连接的数据库池，这些连接会在使用时建立
const pool = new postgres.Pool(databaseUrl, 3, true);
```

同样，您现在可以保存此代码，但这次您应该不会看到任何变化。我们正在创建一个连接池，但实际上我们还没有对数据库执行任何查询。在此之前，我们需要设置表模式。

我们想要存储待办事项的列表。让我们创建一个名为 `todos` 的表，包含一个自增的 `id` 列和一个 `title` 列：

```ts
const pool = new postgres.Pool(databaseUrl, 3, true);

// 连接到数据库
const connection = await pool.connect();
try {
  // 创建表
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} finally {
  // 将连接释放回连接池
  connection.release();
}
```

现在我们已经有了一个表，可以为 GET 和 POST 端点添加 HTTP 处理程序。

```ts
Deno.serve(async (req) => {
  // 解析 URL 并检查请求的端点是否为 /todos。如果不是，则返回 404 响应。
  const url = new URL(req.url);
  if (url.pathname !== "/todos") {
    return new Response("未找到", { status: 404 });
  }

  // 从数据库池中获取一个连接
  const connection = await pool.connect();

  try {
    switch (req.method) {
      case "GET": { // 这是一个 GET 请求。返回所有待办事项的列表。
        // 执行查询
        const result = await connection.queryObject`
          SELECT * FROM todos
        `;

        // 将结果编码为 JSON
        const body = JSON.stringify(result.rows, null, 2);

        // 以 JSON 格式返回结果
        return new Response(body, {
          headers: { "content-type": "application/json" },
        });
      }
      case "POST": { // 这是一个 POST 请求。创建一个新的待办事项。
        // 将请求体解析为 JSON。如果请求体解析失败、不是字符串或超过 256 个字符，返回 400 响应。
        const title = await req.json().catch(() => null);
        if (typeof title !== "string" || title.length > 256) {
          return new Response("请求错误", { status: 400 });
        }

        // 将新的待办事项插入数据库
        await connection.queryObject`
          INSERT INTO todos (title) VALUES (${title})
        `;

        // 返回 201 创建响应
        return new Response("", { status: 201 });
      }
      default: // 如果既不是 POST 也不是 GET，则返回 405 响应。
        return new Response("不允许的方法", { status: 405 });
    }
  } catch (err) {
    console.error(err);
    // 如果发生错误，返回 500 响应
    return new Response(`内部服务器错误\n\n${err.message}`, {
      status: 500,
    });
  } finally {
    // 将连接释放回连接池
    connection.release();
  }
});
```

就这样 - 应用程序完成了。通过保存编辑器来部署此代码。您现在可以向 `/todos` 端点发送 POST 请求以创建一个新的待办事项，可以通过向 `/todos` 发送 GET 请求来获取所有待办事项的列表：

```sh
$ curl -X GET https://tutorial-postgres.deno.dev/todos
[]⏎

$ curl -X POST -d '"买牛奶"' https://tutorial-postgres.deno.dev/todos

$ curl -X GET https://tutorial-postgres.deno.dev/todos
[
  {
    "id": 1,
    "title": "买牛奶"
  }
]⏎
```

一切正常 🎉

本教程的完整代码：

<iframe width="100%" height="600" src="https://embed.deno.com/playground/tutorial-postgres?layout=code-only&corp"></iframe>

作为额外的挑战，尝试添加一个 `DELETE /todos/:id` 端点来删除待办事项。[URLPattern][urlpattern] API 可以帮助您完成这个任务。

[urlpattern]: https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API