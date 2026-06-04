---
last_modified: 2026-05-14
title: "如何在 Deno 中使用 MySQL2"
description: "在 Deno 中使用 MySQL2 的分步指南。学习如何设置数据库连接、执行查询、处理事务，并使用 MySQL 的 Node.js 驱动构建数据驱动的应用程序。"
url: /examples/mysql2_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/mysql2/
  - /runtime/tutorials/how_to_with_npm/mysql2/
---

[MySQL](https://www.mysql.com/) 是在
[2022 年 Stack Overflow 开发者调查](https://survey.stackoverflow.co/2022/#most-popular-technologies-database)
中最受欢迎的数据库，并且有 Facebook、Twitter、YouTube 和 Netflix 等用户。

[在这里查看源代码。](https://github.com/denoland/examples/tree/main/with-mysql2)

你可以使用 `mysql2` node 包通过 `npm:mysql2` 在 Deno 中操作和查询 MySQL 数据库。这使我们能够使用其 Promise 包装器，并利用顶层 await。

```tsx
import mysql from "npm:mysql2@^2.3.3/promise";
```

## 连接到 MySQL

我们可以使用 `createConnection()` 方法连接到我们的 MySQL 服务器。你需要指定主机（在测试时为 `localhost`，或在生产中更可能是云数据库端点）以及用户和密码：

```tsx
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});
```

你还可以在创建连接时可选指定一个数据库。在这里，我们将使用 `mysql2` 动态创建数据库。

## 创建和填充数据库

现在你已经建立了连接，可以使用 `connection.query()` 和 SQL 命令来创建数据库和表，以及插入初始数据。

首先，我们想要生成并选择要使用的数据库：

```tsx
await connection.query("CREATE DATABASE denos");
await connection.query("use denos");
```

然后我们想要创建表：

```tsx
await connection.query(
  "CREATE TABLE `dinosaurs` (   `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,   `name` varchar(255) NOT NULL,   `description` varchar(255) )",
);
```

表创建后，我们可以填充数据：

```tsx
await connection.query(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abel's lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

现在我们有了所有数据，可以开始查询。

## 查询 MySQL

我们可以使用相同的 `connection.query()` 方法来读取数据。`mysql2/promise` 驱动会返回一个 `[rows, fields]` 元组，因此可以直接解构取出 rows：

```tsx
const [rows] = await connection.query("SELECT * FROM `dinosaurs`");
console.log(rows);
```

这会打印出表中的每一行：

```tsx
[
  {
    id: 1,
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    id: 2,
    name: "Abelisaurus",
    description: "Abels lizard has been reconstructed from a single skull.",
  },
  { id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." },
];
```

### 参数化查询

如果要根据某个值进行过滤，不要把它直接拼到 SQL 字符串里——那样很容易引入 SQL 注入漏洞。请使用带有 `?` 占位符的 `connection.execute()`。驱动会在服务器上准备语句，并将值单独绑定，因此你传入 values 数组中的任何内容都会被严格视为数据，而不会被解析为 SQL：

```tsx
const name = "Deno"; // 假设这来自用户请求
const [rows] = await connection.execute(
  "SELECT * FROM `dinosaurs` WHERE `name` = ?",
  [name],
);
console.log(rows);
```

这会返回一条匹配的记录：

```tsx
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

`?` 占位符是按位置对应的，因此 values 必须与 SQL 中占位符的顺序一致。同样的模式也适用于 `INSERT`、`UPDATE` 和 `DELETE`；`mysql2` 还会缓存每个预编译语句，因此使用不同值的重复调用在后续运行时会跳过解析步骤。

最后，我们可以关闭连接：

```tsx
await connection.end();
```

想要了解更多关于 `mysql2` 的信息，请查看他们的文档 [这里](https://github.com/sidorares/node-mysql2)。