---
title: "如何在 Deno 中使用 Apollo"
description: "Step-by-step tutorial on integrating Apollo GraphQL with Deno. Learn how to set up an Apollo Server, define schemas, implement resolvers, and build a complete GraphQL API using TypeScript."
url: /examples/apollo_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/apollo/
  - /runtime/manual/node/how_to_with_npm/apollo/
  - /runtime/tutorials/how_to_with_npm/apollo/
---

[Apollo Server](https://www.apollographql.com/) 是一个 GraphQL 服务器，您可以在几分钟内设置并与现有数据源（或 REST API）一起使用。然后，您可以将任何 GraphQL 客户端连接到它，以接收数据并利用 GraphQL 的好处，例如类型检查和高效获取。

我们将启动一个简单的 Apollo 服务器，使我们能够查询一些本地数据。我们只需要三个文件：

1. `schema.ts` 用于设置我们的数据模型
2. `resolvers.ts` 用于设置我们如何填充模式中的数据字段
3. 我们的 `main.ts`，服务器将在此启动

我们将开始创建它们：

```shell
touch schema.ts resolvers.ts main.ts
```

让我们逐一设置。

[查看源代码。](https://github.com/denoland/examples/tree/main/with-apollo)

## schema.ts

我们的 `schema.ts` 文件描述了我们的数据。在这种情况下，我们的数据是一系列恐龙。我们希望用户能够获取每个恐龙的名称和简短描述。在 GraphQL 语言中，这意味着 `Dinosaur` 是我们的 **类型**，而 `name` 和 `description` 是我们的 **字段**。我们还可以为每个字段定义数据类型。在这种情况下，这两个字段均为字符串。

这里也是我们使用 GraphQL 特殊 **Query** 类型描述我们允许查询的数据的地方。我们有两个查询：

- `dinosaurs` 用于获取所有恐龙的列表
- `dinosaur` 需要传入恐龙的 `name` 作为参数，并返回关于该种类恐龙的信息。

我们将在 `typeDefs` 类型定义变量中导出所有这些内容：

```tsx
export const typeDefs = `
  type Dinosaur {
    name: String
    description: String
  }

  type Query {
    dinosaurs: [Dinosaur]
    dinosaur(name: String): Dinosaur
  }
`;
```

如果我们想要写入数据，这里也是我们描述 **Mutation** 的地方。Mutation 是使用 GraphQL 写入数据的方式。由于我们在这里使用的是静态数据集，因此我们不会写入任何内容。

## resolvers.ts

解析器负责填充每个查询的数据。在这里，我们有我们的恐龙列表，解析器要做的就是 a) 如果用户请求 `dinosaurs` 查询，则将整个列表传递给客户端，或者 b) 如果用户请求 `dinosaur` 查询，则仅传递一个。

```tsx
const dinosaurs = [
  {
    name: "Aardonyx",
    description: "爬行动物演化的早期阶段。",
  },
  {
    name: "Abelisaurus",
    description: '"阿贝尔的蜥蜴" 是从一具单一的头骨重建而来的。',
  },
];

export const resolvers = {
  Query: {
    dinosaurs: () => dinosaurs,
    dinosaur: (_: any, args: any) => {
      return dinosaurs.find((dinosaur) => dinosaur.name === args.name);
    },
  },
};
```

对于后者，我们将客户端的参数传递到一个函数中，以匹配名称和我们数据集中的名称。

## main.ts

在我们的 `main.ts` 中，我们将导入 `ApolloServer` 以及 `graphql` 和我们的模式中的 `typeDefs` 与解析器：

```tsx
import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { graphql } from "npm:graphql@16.6";
import { typeDefs } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`服务器运行在: ${url}`);
```

我们将 `typeDefs` 和 `resolvers` 传递给 `ApolloServer` 以启动一个新服务器。最后，`startStandaloneServer` 是一个帮助函数，用于快速启动服务器。

## 运行服务器

现在剩下的就是运行服务器：

```shell
deno run --allow-net --allow-read --allow-env main.ts
```

您应该在终端中看到 `服务器运行在: 127.0.0.1:8000`。如果您访问该地址，您将看到 Apollo 沙盒，在那里我们可以输入我们的 `dinosaurs` 查询：

```graphql
query {
  dinosaurs {
    name
    description
  }
}
```

这将返回我们的数据集：

```graphql
{
  "data": {
    "dinosaurs": [
      {
        "name": "Aardonyx",
        "description": "爬行动物演化的早期阶段。"
      },
      {
        "name": "Abelisaurus",
        "description": "\"阿贝尔的蜥蜴\" 是从一具单一的头骨重建而来的。"
      }
    ]
  }
}
```

或者如果我们想要只获取一个 `dinosaur`：

```graphql
query {
  dinosaur(name:"Aardonyx") {
    name
    description
  }
}
```

这将返回：

```graphql
{
  "data": {
    "dinosaur": {
      "name": "Aardonyx",
      "description": "爬行动物演化的早期阶段。"
    }
  }
}
```

太棒了！

[了解有关使用 Apollo 和 GraphQL 的更多信息，请查看他们的教程](https://www.apollographql.com/tutorials/)。