---
title: "使用 FaunaDB 的 API 服务器"
oldUrl:
  - /deploy/docs/tutorial-faunadb/
---

FaunaDB 自称为 "现代应用程序的数据 API"。它是一个具有 GraphQL 接口的数据库，使您可以使用 GraphQL 与之进行交互。由于我们使用 HTTP 请求与其通信，因此不需要管理连接，这非常适合无服务器应用程序。

本教程假设您拥有 [FaunaDB](https://fauna.com) 和 Deno Deploy 账户，已安装 Deno Deploy CLI，并对 GraphQL 有一些基本了解。

- [概述](#概述)
- [构建 API 接口](#构建-api-接口)
- [使用 FaunaDB 进行持久化](#使用-faunadb-进行持久化)
- [部署 API](#部署-api)

## 概述

在本教程中，我们将构建一个小型的报价 API，提供插入和检索报价的接口。然后利用 FaunaDB 持久化这些报价。

让我们从定义 API 接口开始。

```sh
# 对端点的 POST 请求应将报价插入列表中。
POST /quotes/
# 请求的主体。
{
  "quote": "不要仅凭你收获的果实来评判每一天，而要凭你播种的种子。",
  "author": "罗伯特·路易斯·史蒂文森"
}

# 对端点的 GET 请求应返回数据库中的所有报价。
GET /quotes/
# 请求的响应。
{
  "quotes": [
    {
      "quote": "不要仅凭你收获的果实来评判每一天，而要凭你播种的种子。",
      "author": "罗伯特·路易斯·史蒂文森"
    }
  ]
}
```

现在我们了解了端点的行为，接下来就来构建它。

## 构建 API 接口

首先，创建一个名为 `quotes.ts` 的文件，并粘贴以下内容。

请阅读代码中的注释以了解发生了什么。

```ts
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";

serve({
  "/quotes": handleQuotes,
});

// 为了开始，我们将使用一个全局的报价数组。
const quotes = [
  {
    quote: "能够想象任何事物的人，就能够创造不可能。",
    author: "艾伦·图灵",
  },
  {
    quote: "任何足够先进的技术都与魔法无异。",
    author: "阿瑟·克拉克",
  },
];

async function handleQuotes(request: Request) {
  // 确保请求是 GET 请求。
  const { error } = await validateRequest(request, {
    GET: {},
  });
  // validateRequest 会在请求不符合我们定义的模式时填充错误。
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // 返回所有报价。
  return json({ quotes });
}
```

使用 [Deno CLI](https://deno.land) 运行上述程序。

```sh
deno run --allow-net=:8000 ./path/to/quotes.ts
# 正在监听 http://0.0.0.0:8000/
```

然后使用 curl 访问端点查看一些报价。

```sh
curl http://127.0.0.1:8000/quotes
# {"quotes":[
# {"quote":"能够想象任何事物的人，就能够创造不可能。", "author":"艾伦·图灵"},
# {"quote":"任何足够先进的技术都与魔法无异。","author":"阿瑟·克拉克"}
# ]}
```

让我们继续处理 POST 请求。

更新 `validateRequest` 函数，确保 POST 请求遵循提供的主体模式。

```diff
-  const { error } = await validateRequest(request, {
+  const { error, body } = await validateRequest(request, {
    GET: {},
+   POST: {
+      body: ["quote", "author"]
+   }
  });
```

通过以下代码更新 `handleQuotes` 函数以处理 POST 请求。

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

+  // 处理 POST 请求。
+  if (request.method === "POST") {
+    const { quote, author } = body as { quote: string; author: string };
+    quotes.push({ quote, author });
+    return json({ quote, author }, { status: 201 });
+  }

  return json({ quotes });
}
```

让我们通过插入一些数据进行测试。

```sh
curl --dump-header - --request POST --data '{"quote": "一个未经过测试的程序是无法工作的。", "author": "比扬·斯特劳斯特鲁普"}' http://127.0.0.1:8000/quotes
```

输出可能如下所示。

```console
HTTP/1.1 201 Created
transfer-encoding: chunked
content-type: application/json; charset=utf-8

{"quote":"一个未经过测试的程序是无法工作的。","author":"比扬·斯特劳斯特鲁普"}
```

太棒了！我们构建的 API 接口正在按预期工作。由于数据存储在内存中，重启后将会丢失。让我们使用 FaunaDB 来持久化我们的报价。

## 使用 FaunaDB 进行持久化

让我们使用 GraphQL Schema 定义我们的数据库模式。

```gql
# 我们创建一个名为 `Quote` 的新类型来表示报价及其作者。
type Quote {
  quote: String!
  author: String!
}

type Query {
  # Query 操作中的新字段，用于检索所有报价。
  allQuotes: [Quote!]
}
```

Fauna 为其数据库提供了一个 graphql 端点，并为模式中定义的数据类型生成必要的变更，例如创建、更新、删除。例如，Fauna 将生成一个名为 `createQuote` 的变更，用于在数据库中创建一个新的报价。此外，我们还定义了一个查询字段 `allQuotes`，用于返回数据库中的所有报价。

现在让我们开始编写与 Fauna 交互的代码，以便从 Deno Deploy 应用程序中访问。

要与 Fauna 交互，我们需要向它的 graphql 端点发送一个 POST 请求，带有适当的查询和参数以获取数据返回。所以让我们构建一个通用函数来处理这些事情。

```typescript
async function queryFauna(
  query: string,
  variables: { [key: string]: unknown },
): Promise<{
  data?: any;
  error?: any;
}> {
  // 从环境中获取密钥。
  const token = Deno.env.get("FAUNA_SECRET");
  if (!token) {
    throw new Error("环境变量 FAUNA_SECRET 未设置");
  }

  try {
    // 通过 POST 请求访问 Fauna 的 graphql 端点，主体为
    // 查询及其变量。
    const res = await fetch("https://graphql.fauna.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();
    if (errors) {
      // 如果有错误，返回第一个错误。
      return { data, error: errors[0] };
    }

    return { data };
  } catch (error) {
    return { error };
  }
}
```

将此代码添加到 `quotes.ts` 文件中。现在让我们更新端点以使用 Fauna。

```diff
async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
+    const { quote, author, error } = await createQuote(
+      body as { quote: string; author: string }
+    );
+    if (error) {
+      return json({ error: "无法创建报价" }, { status: 500 });
+    }

    return json({ quote, author }, { status: 201 });
  }

  return json({ quotes });
}

+async function createQuote({
+  quote,
+  author,
+}: {
+  quote: string;
+  author: string;
+}): Promise<{ quote?: string; author?: string; error?: string }> {
+  const query = `
+    mutation($quote: String!, $author: String!) {
+      createQuote(data: { quote: $quote, author: $author }) {
+        quote
+        author
+      }
+    }
+  `;
+
+  const { data, error } = await queryFauna(query, { quote, author });
+  if (error) {
+    return { error };
+  }
+
+  return data;
+}
```

现在我们已经更新了代码以插入新的报价，让我们在继续测试代码之前设置一个 Fauna 数据库。

创建一个新数据库：

1. 访问 https://dashboard.fauna.com（如有需要登录），点击 **New Database**
2. 填写 **Database Name** 字段，然后点击 **Save**。
3. 点击左侧边栏可见的 **GraphQL** 部分。
4. 创建一个以 `.gql` 结尾的文件，内容为我们上述定义的模式。

生成一个秘密以访问数据库：

1. 点击 **Security** 部分，然后点击 **New Key**。
2. 选择 **Server** 角色并点击 **Save**。复制生成的密钥。

现在让我们使用这个密钥运行应用程序。

```sh
FAUNA_SECRET=<你刚才获得的秘密> deno run --allow-net=:8000 --watch quotes.ts
# 正在监听 http://0.0.0.0:8000
```

```sh
curl --dump-header - --request POST --data '{"quote": "一个未经过测试的程序是无法工作的。", "author": "比扬·斯特劳斯特鲁普"}' http://127.0.0.1:8000/quotes
```

请注意，报价已添加到 FaunaDB 中的集合中。

让我们编写一个新函数以获取所有报价。

```ts
async function getAllQuotes() {
  const query = `
    query {
      allQuotes {
        data {
          quote
          author
        }
      }
    }
  `;

  const {
    data: {
      allQuotes: { data: quotes },
    },
    error,
  } = await queryFauna(query, {});
  if (error) {
    return { error };
  }

  return { quotes };
}
```

并用以下代码更新 `handleQuotes` 函数。

```diff
-// 为了开始，我们将使用一个全局的报价数组。
-const quotes = [
-  {
-    quote: "能够想象任何事物的人，就能够创造不可能。",
-    author: "艾伦·图灵",
-  },
-  {
-    quote: "任何足够先进的技术都与魔法无异。",
-    author: "阿瑟·克拉克",
-  },
-];

async function handleQuotes(request: Request) {
  const { error, body } = await validateRequest(request, {
    GET: {},
    POST: {
      body: ["quote", "author"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  if (request.method === "POST") {
    const { quote, author, error } = await createQuote(
      body as { quote: string; author: string },
    );
    if (error) {
      return json({ error: "无法创建报价" }, { status: 500 });
    }

    return json({ quote, author }, { status: 201 });
  }

+  // 假设请求方法为 "GET"。
+  {
+    const { quotes, error } = await getAllQuotes();
+    if (error) {
+      return json({ error: "无法获取报价" }, { status: 500 });
+    }
+
+    return json({ quotes });
+  }
}
```

```sh
curl http://127.0.0.1:8000/quotes
```

您应该会看到我们插入到数据库中的所有报价。API 的最终代码可以在 https://deno.com/examples/fauna.ts 找到。

## 部署 API

现在我们的一切都准备就绪，让我们部署您的新 API！

1. 在您的浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并链接您的 GitHub 账户。
2. 选择包含您新 API 的仓库。
3. 您可以为您的项目命名，或者允许 Deno 为您生成一个名称。
4. 在 Entrypoint 下拉菜单中选择 `index.ts`。
5. 点击 **Deploy Project** 。

为了让您的应用程序正常工作，我们需要配置其环境变量。

在您的项目成功页面或项目仪表板中，点击 **Add environmental variables**。在环境变量下，点击 **+ Add Variable**。创建一个名为 `FAUNA_SECRET` 的新变量 - 值应为我们之前创建的密钥。

点击保存变量。

在您的项目概览中，点击 **View** 以在浏览器中查看项目，并在 URL 末尾添加 `/quotes` 来查看您的 FaunaDB 中的内容。