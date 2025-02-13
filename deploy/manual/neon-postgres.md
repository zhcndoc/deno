---
title: "连接到 Neon Postgres"
---

本教程涵盖了如何从部署在 Deno Deploy 上的应用程序连接到 Neon Postgres 数据库。

你可以找到一个更全面的教程，该教程在 Postgres 之上构建了一个示例应用程序，[点击这里](../tutorials/tutorial-postgres)。

## 设置 Postgres

要开始，我们需要创建一个新的 Postgres 实例供我们连接。为了本教程，我们将使用 [Neon Postgres](https://neon.tech/)，因为他们提供免费的托管 Postgres 实例。如果你希望将数据库托管在其他地方，也可以这么做。

1. 访问 https://neon.tech/ 并点击 **注册**，通过电子邮件、Github、Google 或合作伙伴帐户进行注册。注册后，系统将引导你进入 Neon 控制台以创建你的第一个项目。
2. 输入项目的名称，选择 Postgres 版本，提供数据库名称，并选择区域。通常，你会选择离你的应用程序最近的区域。当你完成后，点击 **创建项目**。
3. 系统会向你展示新项目的连接字符串，你可以用来连接到数据库。保存连接字符串，通常看起来像这样：

   ```sh
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   你需要在下一步中使用连接字符串。

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目，并设置所需的环境变量：

1. 访问 [https://dash.deno.com/new](https://dash.deno.com/new)（如果你还没有登录，使用 GitHub 登录）并点击 **创建一个空项目**，在 **部署你自己的代码** 下。
2. 现在点击项目页面上的 **设置** 按钮。
3. 导航到 **环境变量** 部分并添加以下秘密。

- `DATABASE_URL` - 值应设置为你在上一步中保存的连接字符串。

![postgres_env_variable](../docs-images/neon_postgres_env_variable.png)

## 编写连接到 Postgres 的代码

要使用 [Neon 无服务器驱动程序](https://deno.com/blog/neon-on-jsr) 来读写 Postgres，首先使用 `deno add` 命令安装它：

```sh
deno add jsr:@neon/serverless
```

这将创建或更新你的 `deno.json` 文件，并添加依赖项：

```json
{
  "imports": {
    "@neon/serverless": "jsr:@neon/serverless@^0.10.1"
  }
}
```

现在你可以在代码中使用该驱动程序：

```ts
import { neon } from "@neon/serverless";

// 从环境变量 "DATABASE_URL" 获取连接字符串
const databaseUrl = Deno.env.get("DATABASE_URL")!;

// 创建 SQL 查询执行器
const sql = neon(databaseUrl);

try {
  // 创建表
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL
    )
  `;
} catch (error) {
  console.error(error);
}
```

## 将应用程序部署到 Deno Deploy

一旦你完成了应用程序的编写，就可以在 Deno Deploy 上部署它。

为此，回到你的项目页面 `https://dash.deno.com/projects/<project-name>`。

你应该会看到几个部署选项：

- [Github 集成](ci_github)
- [`deployctl`](./deployctl.md)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非你想添加构建步骤，否则我们建议你选择 GitHub 集成。

有关在 Deno Deploy 上以不同方式部署和不同配置选项的详细信息，请阅读 [这里](how-to-deploy)。