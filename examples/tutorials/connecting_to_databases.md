---
title: "连接到数据库"
description: "A guide to database connectivity in Deno. Learn how to use MySQL, PostgreSQL, MongoDB, SQLite, Firebase, Supabase, and popular ORMs to build data-driven applications with TypeScript."
url: /examples/connecting_to_databases_tutorial/
oldUrl:
  - /runtime/tutorials/connecting_to_databases/
---

应用程序通常会从数据库中存储和检索数据。Deno
支持连接到多种数据库管理系统。

Deno 社区发布了许多第三方模块，使得连接到流行的数据库如 MySQL、Postgres 和 MongoDB 变得容易。

这些模块托管在 Deno 的第三方模块网站
[deno.land/x](https://deno.land/x)。

## MySQL

[deno_mysql](https://deno.land/x/mysql) 是 Deno 的 MySQL 和 MariaDB 数据库驱动。

### 使用 deno_mysql 连接到 MySQL

首先导入 `mysql` 模块并创建一个新的客户端实例。然后通过传递一个包含连接详细信息的对象来连接到数据库：

```ts title="main.js"
import { Client } from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "dbname",
  password: "password",
});
```

连接后，您可以执行查询、插入数据和检索信息。

## Postgres

[deno-postgres](https://deno.land/x/postgres) 是一个轻量级的 PostgreSQL 驱动，旨在提升开发者体验。

### 使用 deno-postgres 连接到 Postgres

首先，从 `deno-postgres` 模块导入 `Client` 类并创建一个新的客户端实例。然后通过传递一个包含连接详细信息的对象连接到数据库：

```ts
import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "user",
  database: "dbname",
  hostname: "127.0.0.1",
  port: 5432,
  password: "password",
});
await client.connect();
```

### 使用 postgresjs 连接到 Postgres

[postgresjs](https://deno.land/x/postgresjs) 是一个功能齐全的 Postgres 客户端，可以用于 Node.js 和 Deno。

导入 `postgres` 模块并创建一个新的客户端实例。然后传递一个连接字符串作为参数连接到数据库：

```js
import postgres from "https://deno.land/x/postgresjs/mod.js";

const sql = postgres("postgres://username:password@host:port/database");
```

## MongoDB

我们建议使用
[npm 说明符](/runtime/fundamentals/node/#using-npm-packages) 来使用官方 [MongoDB 驱动程序在 npm](https://www.npmjs.com/package/mongodb)。您可以通过阅读 [官方文档](https://www.mongodb.com/docs/drivers/node/current/) 了解更多有关如何使用驱动程序的信息。在 Deno 的上下文中使用此模块时，唯一的区别是如何使用 `npm:` 说明符导入模块。

导入 MongoDB 驱动程序，设置连接配置，然后连接到 MongoDB 实例。您可以执行插入文档到集合等操作，然后再关闭连接：

```ts title="main.js"
import { MongoClient } from "npm:mongodb@6";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "myProject";

await client.connect();
console.log("成功连接到服务器");

// 获取集合的引用
const db = client.db(dbName);
const collection = db.collection("documents");

// 执行插入操作
const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }]);
console.log("插入的文档 =>", insertResult);

client.close();
```

## SQLite

在 Deno 中连接 SQLite 有多种解决方案：

### 使用 `node:sqlite` 模块连接 SQLite

_`node:sqlite` 模块已在 Deno v2.2 中添加。_

```ts
import { DatabaseSync } from "node:sqlite";
const database = new DatabaseSync("test.db");

const result = database.prepare("select sqlite_version()").get();
console.log(result);

db.close();
```

### 使用 FFI 模块连接到 SQLite

[@db/sqlite](https://jsr.io/@db/sqlite) 提供了 SQLite3 C API 的 JavaScript 绑定，使用 [Deno FFI](/api/deno/#ffi)。

```ts
import { Database } from "jsr:@db/sqlite@0.12";

const db = new Database("test.db");

const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
console.log(version);

db.close();
```

### 使用 Wasm 优化模块连接到 SQLite

[sqlite](https://deno.land/x/sqlite) 是一个针对 JavaScript 和 TypeScript 的 SQLite 模块。这个封装专门为 Deno 制作，使用编译为 WebAssembly (Wasm) 的 SQLite3 版本。

```ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("test.db");

db.close();
```

## Firebase

要使用 Deno 连接到 Firebase，首先导入 [firestore npm 模块](https://firebase.google.com/docs/firestore/quickstart) 使用 [ESM CDN](https://esm.sh/)。要了解更多关于在 Deno 中使用 npm 模块与 CDN 的信息，请参见 [使用 npm 包与 CDN](/runtime/fundamentals/modules/#https-imports)。

### 使用 firestore npm 模块连接到 Firebase

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  setDoc,
  where,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const app = initializeApp({
  apiKey: Deno.env.get("FIREBASE_API_KEY"),
  authDomain: Deno.env.get("FIREBASE_AUTH_DOMAIN"),
  projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
  storageBucket: Deno.env.get("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Deno.env.get("FIREBASE_MESSING_SENDER_ID"),
  appId: Deno.env.get("FIREBASE_APP_ID"),
  measurementId: Deno.env.get("FIREBASE_MEASUREMENT_ID"),
});
const db = getFirestore(app);
const auth = getAuth(app);
```

## Supabase

要使用 Deno 连接到 Supabase，导入 [supabase-js npm 模块](https://supabase.com/docs/reference/javascript) 与 [esm.sh CDN](https://esm.sh/)。要了解有关在 Deno 中使用 npm 模块与 CDN 的更多信息，请参见 [使用 npm 包与 CDN](/runtime/fundamentals/modules/#https-imports)。

### 使用 supabase-js npm 模块连接到 Supabase

```js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const options = {
  schema: "public",
  headers: { "x-my-custom-header": "my-app-name" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "public-anon-key",
  options,
);
```

## ORM

对象关系映射 (ORM) 将您的数据模型定义为类，这些类可以持久化到数据库中。您可以通过这些类的实例读写数据库中的数据。

Deno 支持多种 ORM，包括 Prisma 和 DenoDB。

### DenoDB

[DenoDB](https://deno.land/x/denodb) 是一个专为 Deno 设计的 ORM。

#### 连接到 DenoDB

```ts
import {
  Database,
  DataTypes,
  Model,
  PostgresConnector,
} from "https://deno.land/x/denodb/mod.ts";

const connection = new PostgresConnector({
  host: "...",
  username: "user",
  password: "password",
  database: "airlines",
});

const db = new Database(connection);
```

## GraphQL

GraphQL 是一种API查询语言，通常用于将不同的数据源组合成以客户端为中心的API。要设置一个 GraphQL API，您应当首先设置一个 GraphQL 服务器。该服务器将数据以 GraphQL API 的形式暴露，以便您的客户端应用程序可以查询数据。

### 服务器

您可以使用 [gql](https://deno.land/x/gql)，一种通用的 GraphQL HTTP 中间件，来在 Deno 中运行 GraphQL API 服务器。

#### 使用 gql 运行 GraphQL API 服务器

```ts
import { GraphQLHTTP } from "https://deno.land/x/gql/mod.ts";
import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
};

const schema = makeExecutableSchema({ resolvers, typeDefs });

Deno.serve({ port: 3000 }, async () => {
  const { pathname } = new URL(req.url);

  return pathname === "/graphql"
    ? await GraphQLHTTP<Request>({
      schema,
      graphiql: true,
    })(req)
    : new Response("未找到", { status: 404 });
});
```

### 客户端

要在 Deno 中进行 GraphQL 客户端调用，导入 [graphql npm 模块](https://www.npmjs.com/package/graphql) 与 [esm CDN](https://esm.sh/)。要了解关于在 Deno 中通过 CDN 使用 npm 模块的更多信息，请阅读 [这里](/runtime/fundamentals/modules/#https-imports)。

#### 使用 graphql npm 模块进行 GraphQL 客户端调用

```js
import { buildSchema, graphql } from "https://esm.sh/graphql";

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const rootValue = {
  hello: () => {
    return "Hello world!";
  },
};

const response = await graphql({
  schema,
  source: "{ hello }",
  rootValue,
});

console.log(response);
```

🦕 现在您可以将您的 Deno 项目连接到数据库，您将能够处理持久数据，执行 CRUD 操作并开始构建更复杂的应用程序。