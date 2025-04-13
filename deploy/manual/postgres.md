---
title: "连接到 Postgres"
---

本教程介绍如何从部署在 Deno Deploy 上的应用程序连接到 Postgres 数据库。

您可以在 [这里](../tutorials/tutorial-postgres) 找到一个更全面的教程，该教程将在 Postgres 上构建一个示例应用程序。

## 设置 Postgres

> 本教程将完全集中于无加密连接到 Postgres。如果您希望使用自定义 CA 证书进行加密，请使用 [这里](https://deno-postgres.com/#/?id=ssltls-connection) 的文档。

要开始，我们需要为我们要连接的 Postgres 实例创建一个新的实例。对于本教程，我们将使用 [Supabase](https://supabase.com)，因为它们提供免费的托管 Postgres 实例。如果您希望将数据库托管在其他地方，您也可以这样做。

1. 访问 https://app.supabase.io/ 并单击 **新项目**。
2. 为您的数据库选择一个名称、密码和地区。确保保存密码，因为稍后您将需要它。
3. 单击 **创建新项目**。创建项目可能需要一些时间，请耐心等待。

## 从 Postgres 获取凭据

设置完 Postgres 数据库后，从您的 Postgres 实例中收集连接信息。

### Supabase

对于上述 Supabase 实例，要获取连接信息：

1. 导航到左侧的 **数据库** 选项卡。
2. 转到 **项目设置** >> **数据库**，并从 **连接字符串** >> **URI** 字段中复制连接字符串。这是您将用来连接数据库的连接字符串。将您之前保存的密码插入该字符串中，然后将其保存到某处 - 您稍后会需要它。

### psql

如果您使用 psql，通常可以通过运行以下命令找到连接信息：

```psql
test=# \conninfo
```

您的 Postgres 连接字符串将采用以下形式：

```sh
postgres://user:password@127.0.0.1:5432/deploy?sslmode=disable
```

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目，并设置所需的环境变量：

1. 转到 [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请用 GitHub 登录），然后在 **从命令行部署** 下点击 **+ 空项目**。
2. 现在点击项目页面上的 **设置** 按钮。
3. 导航到 **环境变量** 部分，并添加以下密钥。

- `DATABASE_URL` - 值应为您在上一步中获取的连接字符串。

![postgres_env_variable](../docs-images/postgres_env_variable.png)

## 编写连接到 Postgres 的代码

要读取/写入Postgres，请导入合适的Postgres模块，例如 [这个来自 JSR 的模块](https://jsr.io/@bartlomieju/postgres)，从环境变量中读取连接字符串，并创建一个连接池。

```ts
import { Pool } from "jsr:@bartlomieju/postgres";

// 从环境变量 "DATABASE_URL" 获取连接字符串
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// 创建一个带有三个懒惰建立的连接的数据库连接池
const pool = new Pool(databaseUrl, 3, true);

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

## 将应用程序部署到 Deno Deploy

完成应用程序的编写后，您可以将其部署到 Deno Deploy。

为此，请返回到您的项目页面，网址为 `https://dash.deno.com/projects/<project-name>`。

您应该会看到几个部署选项：

- [Github 集成](ci_github)
- [`deployctl`](./deployctl.md)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您希望添加构建步骤，否则我们建议您选择 GitHub 集成。

有关在 Deno Deploy 上以不同方式部署和不同配置选项的更多详细信息，请阅读 [这里](how-to-deploy)。