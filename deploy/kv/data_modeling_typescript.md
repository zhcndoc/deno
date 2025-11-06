---
title: "在 TypeScript 中的数据建模"
oldUrl:
  - /kv/manual/data_modeling_typescript/
  - /deploy/kv/manual/data_modeling_typescript/
---

在 TypeScript 应用程序中，通常希望创建强类型、良好文档化的对象，以包含应用程序操作的数据。使用 [接口](https://www.typescriptlang.org/docs/handbook/2/objects.html) 或 [类](https://www.typescriptlang.org/docs/handbook/2/classes.html)，您可以描述程序中对象的形状和行为。

然而，如果您使用的是 Deno KV，则需要进行一些额外的工作来持久化和检索强类型对象。在本指南中，我们将讨论在 Deno KV 中处理强类型对象的策略。

## 使用接口和类型断言

在 Deno KV 中存储和检索应用数据时，您可能想要首先使用 TypeScript 接口描述数据的形状。以下是一个对象模型，它描述了博客系统的一些关键组件：

```ts title="model.ts"
export interface Author {
  username: string;
  fullName: string;
}

export interface Post {
  slug: string;
  title: string;
  body: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
}
```

这个对象模型描述了一篇博客帖子及其相关的作者。

使用 Deno KV，您可以将这些 TypeScript 接口用作 [数据传输对象 (DTO)](https://martinfowler.com/bliki/LocalDTO.html) ——对您可能发送到 Deno KV 或从中接收的非类型对象的强类型封装。

无需任何额外工作，您可以愉快地将这些 DTO 的内容存储在 Deno KV 中。

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const a: Author = {
  username: "acdoyle",
  fullName: "Arthur Conan Doyle",
};

await kv.set(["authors", a.username], a);
```

然而，从 Deno KV 检索这个对象时，它默认不会具有与之关联的类型信息。如果您知道存储了哪个键的对象形状，您可以使用 [类型断言](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) 通知 TypeScript 编译器对象的形状。

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get(["authors", "acdoyle"]);
const ac = r.value as Author;

console.log(ac.fullName);
```

您还可以为 `get` 指定一个可选的 [类型参数](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get)：

```ts
import { Author } from "./model.ts";

const kv = await Deno.openKv();

const r = await kv.get<Author>(["authors", "acdoyle"]);

console.log(r.value.fullName);
```

对于更简单的数据结构，这个技术可能足够了。但通常，您希望或需要在创建或访问您的领域对象时应用一些业务逻辑。当这种需要出现时，您可以开发一组纯函数来操作您的 DTO。

## 使用服务层封装业务逻辑

当您应用程序的持久化需求变得更加复杂时——例如，当您需要创建 [二级索引](./secondary_indexes) 以通过不同的键查询数据，或维护对象之间的关系——您将希望创建一组函数来位于 DTO 之上，以确保传递的数据是有效的（而不仅仅是正确类型的）。

从我们上述的业务对象来看，`Post` 对象足够复杂，因此可能需要一小层代码来保存和检索对象的实例。以下是两个包裹底层 Deno KV API 的函数示例，同时返回强类型的 `Post` 接口实例。

值得注意的是，我们需要存储一个 `Author` 对象的标识符，以便稍后从 KV 检索作者信息。

```ts
import { Author, Post } from "./model.ts";

const kv = await Deno.openKv();

interface RawPost extends Post {
  authorUsername: string;
}

export async function savePost(p: Post): Promise<Post> {
  const postData: RawPost = Object.assign({}, p, {
    authorUsername: p.author.username,
  });

  await kv.set(["posts", p.slug], postData);
  return p;
}

export async function getPost(slug: string): Promise<Post> {
  const postResponse = await kv.get(["posts", slug]);
  const rawPost = postResponse.value as RawPost;
  const authorResponse = await kv.get(["authors", rawPost.authorUsername]);

  const author = authorResponse.value as Author;
  const post = Object.assign({}, postResponse.value, {
    author,
  }) as Post;

  return post;
}
```

这个薄层使用 `RawPost` 接口，扩展了实际的 `Post` 接口，以包括一些用于引用另一索引（相关的 `Author` 对象）的附加数据。

`savePost` 和 `getPost` 函数取代了直接的 Deno KV `get` 或 `set` 操作，从而可以正确地序列化和“注入”带有适当类型和关联的模型对象。