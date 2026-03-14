---
title: "连接到数据库"
description: "Deno 中数据库连接的指南。学习如何使用 MySQL、PostgreSQL、MongoDB、SQLite、Firebase、Supabase 以及流行的 ORM 来构建基于 TypeScript 的数据驱动应用。"
url: /examples/connecting_to_databases_tutorial/
oldUrl:
  - /runtime/tutorials/connecting_to_databases/
---

应用程序通常会从数据库中存储和检索数据。Deno
支持连接到多种数据库管理系统。

Deno 支持多种第三方模块，让你可以连接到 SQL 和
NoSQL 数据库，包括 MySQL、PostgreSQL、MongoDB、SQLite、Firebase 和
Supabase。

你可以在 [JSR](https://jsr.io/@db) 上找到实用的数据库连接模块，
并且 Deno 通过使用
[npm 标识符](/runtime/fundamentals/node/#using-npm-packages) 支持许多 npm 包。

## SQLite

SQLite 是一个自包含、无服务器、零配置且支持事务的
SQL 数据库引擎。它是应用程序本地存储的热门选择。

你可以使用多个模块在 Deno 中连接 SQLite，包括
内置的 [`node:sqlite` 模块](/api/node_sqlite/) 和
JSR 上的 [sqlite](https://jsr.io/@db/sqlite) 模块。

要在你的 Deno 应用中使用 [sqlite](https://jsr.io/@db/sqlite) 模块连接 SQLite：

```sh
deno add jsr:@db/sqlite
```

然后，从模块导入 `Database` 类并创建一个新的数据库实例。你就可以对数据库执行 SQL 查询：

```ts title="main.ts"
import { Database } from "@db/sqlite";

const db = new Database("test.db");

const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
console.log(version);

db.close();
```

此模块依赖于 Deno FFI，因此你需要带上
`--allow-ffi` 标志运行你的脚本：

```sh
deno run --allow-ffi main.ts
```

## MySQL

你可以使用 [mysql npm 模块](https://www.npmjs.com/package/mysql) 连接到 MySQL 数据库。用 npm 标识符安装模块：

```sh
deno add npm:mysql
```

然后，导入 `mysql` 模块并创建与你的 MySQL 数据库的连接：

```ts
import mysql from "mysql";

// 最简连接配置（根据需要编辑或使用环境变量）
const connection = mysql.createConnection({
  host: Deno.env.get("MYSQL_HOST") || "localhost",
  port: Number(Deno.env.get("MYSQL_PORT") || "3306"),
  user: Deno.env.get("MYSQL_USER") || "root",
  password: Deno.env.get("MYSQL_PASSWORD") || "",
  database: Deno.env.get("MYSQL_DATABASE") || "test",
});

connection.connect((err) => {
  if (err) {
    console.error("连接错误:", err);
    return;
  }
  console.log("已连接！");
  connection.query("SELECT VERSION() AS version", (err, results) => {
    if (err) {
      console.error("查询错误:", err);
    } else {
      console.log("MySQL 版本:", results[0].version);
    }
    connection.end();
  });
});
```

## Postgres

PostgreSQL 是一个强大且开源的对象关系型数据库系统。你可以使用多个模块在 Deno 中连接 PostgreSQL，包括
[pg](https://www.npmjs.com/package/pg) 或
[postgresjs](https://www.npmjs.com/package/postgres)。

用 npm 标识符安装模块：

```sh
deno add npm:pg
```

首先，从 `pg` 模块导入 `Client` 类并创建一个新的客户端实例。然后通过传递连接详情的对象连接数据库：

```ts
import { Client } from "pg";

// 连接配置（编辑或使用环境变量）
const client = new Client({
  host: Deno.env.get("PGHOST") || "localhost",
  port: Number(Deno.env.get("PGPORT") || "5432"),
  user: Deno.env.get("PGUSER") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "postgres",
  database: Deno.env.get("PGDATABASE") || "postgres",
});

async function main() {
  try {
    await client.connect();
    console.log("已连接！");
    const res = await client.query("SELECT version() AS version");
    console.log("Postgres 版本:", res.rows[0].version);
  } catch (err) {
    console.error("连接/查询错误:", err);
  } finally {
    await client.end();
  }
}

main();
```

## MongoDB

MongoDB 是一个流行的 NoSQL 数据库，以灵活的 JSON 类文档格式存储数据。你可以使用官方的
[MongoDB Node.js](https://www.npmjs.com/package/mongodb) 驱动连接 MongoDB，
或者使用来自 JSR 的 [Mongo db driver](https://jsr.io/@db/mongo)。

导入 MongoDB 驱动，设置连接配置，然后连接 MongoDB 实例：

```ts title="main.js"
import { MongoClient } from "mongodb";

const url = "mongodb://mongo:mongo@localhost:27017"; // 用户名:密码@主机:端口
const client = new MongoClient(url);
const dbName = "myProject";

await client.connect();
console.log("成功连接到服务器");

const db = client.db(dbName);
const collection = db.collection("documents");

const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }]);
console.log("插入的文档 =>", insertResult);

await client.close();
```

## Firebase

Firebase 是由 Google 开发的移动和网页应用平台。它提供多种服务，包括 NoSQL 数据库、认证和托管。

连接 Firebase，你可以使用 Firebase 提供的官方 npm 模块，需要更新你的 `deno.json` 告诉 Deno 使用 `node_modules` 目录，并在安装时允许脚本执行：

```json title="deno.json"
"nodeModulesDir": auto
```

```sh
deno add npm:firebase --allow-scripts
```

然后从 Firebase 模块导入所需函数，初始化你的应用和服务：

```js
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

// 替换为你的 Firebase 配置（从 Firebase 控制台获取）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 示例：写入和读取文档
async function demo() {
  const ref = doc(db, "demo", "testdoc");
  await setDoc(ref, { hello: "world", time: Date.now() });
  const snap = await getDoc(ref);
  console.log("文档数据:", snap.data());
}

demo().catch(console.error);
```

## Supabase

Supabase 是一个开源的 Firebase 替代品，提供一套帮助你构建和扩展应用的工具和服务。它提供托管的 PostgreSQL 数据库、认证、实时订阅和存储。

连接 Supabase，你可以使用
[@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js) npm 模块。

首先，用 npm 标识符安装模块：

```sh
deno add npm:@supabase/supabase-js --allow-scripts
```

然后，从模块导入 `createClient` 函数并创建一个新的 Supabase 客户端实例。你需要你的 Supabase 项目 URL 和 API 密钥，详见项目设置：

```ts
import { createClient } from "@supabase/supabase-js";

const url = Deno.env.get("SUPABASE_URL") ??
  "https://YOUR-PROJECT.ref.supabase.co";
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(url, key);

async function main() {
  const { data, error } = await supabase
    .from("demo")
    .insert({ message: `Hello @ ${new Date().toISOString()}` })
    .select()
    .maybeSingle();

  if (error) {
    console.error("插入失败:", error.message);
    console.error(
      "提示：如果这是 RLS 错误，要么禁用 'demo' 上的 RLS，要么添加允许匿名插入的策略。",
    );
    return;
  }

  console.log("插入的行:", data);
}

if (import.meta.main) main();
```

## ORM

对象关系映射 (ORM) 将你的数据模型定义为类，你可以将其实例持久化到数据库。你可以通过这些类的实例读取和写入数据库的数据。

Deno 支持多种 ORM，包括 Prisma、Drizzle 和 Kysely。

🦕 现在您可以将您的 Deno 项目连接到数据库，您将能够处理持久数据，执行 CRUD 操作并开始构建更复杂的应用程序。