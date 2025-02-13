---
title: "如何使用 Planetscale 与 Deno"
url: /examples/planetscale_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/planetscale/
  - /runtime/tutorials/how_to_with_npm/planetscale/
---

Planetscale 是一个与 MySQL 兼容的无服务器数据库，旨在为开发者提供工作流程，使开发者可以通过命令行创建、分支和部署数据库。

[在此处查看源码。](https://github.com/denoland/examples/tree/main/with-planetscale)

我们将使用 Planetscale 无服务器驱动程序 `@planetscale/database` 来与 Deno 配合使用。首先我们想要创建 `main.ts` 并从该包中导入连接方法：

```tsx
import { connect } from "npm:@planetscale/database@^1.4";
```

## 配置我们的连接

连接需要三种凭据：主机、用户名和密码。这些都是特定于数据库的，因此我们首先需要在 Planetscale 中创建一个数据库。您可以按照最初的说明[在这里](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide)进行操作。别担心添加模式—我们可以通过 `@planetscale/database` 来完成这一点。

一旦您创建了数据库，前往概览，点击“连接”，选择“使用 `@planetscale/database` 连接”以获取主机和用户名。然后点击“密码”创建一个新的数据库密码。一旦您拥有这三项，您可以直接输入它们，或者更好的是，将它们存储为环境变量：

```bash
export HOST=<host>
export USERNAME=<username>
export PASSWORD=<password>
```

然后使用 `Deno.env` 调用它们：

```tsx
const config = {
  host: Deno.env.get("HOST"),
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
};

const conn = connect(config);
```

如果您在仪表板中设置了环境变量，这在 Deno Deploy 上也可以工作。运行命令：

```shell
deno run --allow-net --allow-env main.ts
```

现在 `conn` 对象是一个与我们的 Planetscale 数据库的开放连接。

## 创建和填充我们的数据库表

现在您已成功建立连接，可以使用 SQL 命令通过 `conn.execute()` 创建表并插入初始数据：

```tsx
await conn.execute(
  "CREATE TABLE dinosaurs (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255) NOT NULL, description varchar(255) NOT NULL);",
);
await conn.execute(
  "INSERT INTO `dinosaurs` (id, name, description) VALUES (1, 'Aardonyx', 'An early stage in the evolution of sauropods.'), (2, 'Abelisaurus', 'Abels lizard has been reconstructed from a single skull.'), (3, 'Deno', 'The fastest dinosaur that ever lived.')",
);
```

## 查询 Planetscale

我们也可以使用同样的 `conn.execute()` 来编写查询。让我们获取所有恐龙的列表：

```tsx
const results = await conn.execute("SELECT * FROM `dinosaurs`");
console.log(results.rows);
```

结果为：

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

我们也可以通过指定恐龙名称来仅获取数据库中的一行：

```tsx
const result = await conn.execute(
  "SELECT * FROM `dinosaurs` WHERE `name` = 'Deno'",
);
console.log(result.rows);
```

这将给我们一个单行结果：

```tsx
[{ id: 3, name: "Deno", description: "The fastest dinosaur that ever lived." }];
```

您可以在他们的[文档](https://planetscale.com/docs)中了解更多关于使用 Planetscale 的信息。