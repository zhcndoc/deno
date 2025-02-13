---
title: "二级索引"
oldUrl:
  - /runtime/manual/runtime/kv/secondary_indexes
  - /kv/manual/secondary_indexes
---

<deno-admonition></deno-admonition>

像 Deno KV 这样的键值存储将数据组织为键值对的集合，其中每个唯一的键都与单个值关联。这样的结构使得可以根据键轻松检索值，但不允许根据值本身进行查询。为了克服这一限制，您可以创建二级索引，它在包含（部分）该值的附加键下存储相同的值。

在使用二级索引时，保持主键与二级键之间的一致性至关重要。如果在主键处更新了一个值，但没有在二级键处更新，则通过针对二级键的查询返回的数据将是不正确的。为了确保主键和二级键始终表示相同的数据，在插入、更新或删除数据时使用原子操作。这种方法确保一组变更操作作为一个单元执行，或者全部成功或者全部失败，从而防止不一致。

## 唯一索引（一对一）

唯一索引将索引中的每个键与确切的一个主键关联。例如，当存储用户数据并通过唯一的 ID 和电子邮件地址查找用户时，可以将用户数据存储在两个单独的键下：一个用于主键（用户 ID），另一个用于二级索引（电子邮件）。这种设置允许根据用户的 ID 或电子邮件查询用户。二级索引还可以对存储中的值施加唯一性约束。在用户数据的例子中，使用该索引确保每个电子邮件地址只与一个用户关联——换句话说，确保电子邮件是唯一的。

要实现这个例子的唯一二级索引，请按照以下步骤操作：

1. 创建一个表示数据的 `User` 接口：

   ```ts
   interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

2. 定义一个 `insertUser` 函数，在主键和二级键上存储用户数据：

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byEmailKey = ["users_by_email", user.email];
     const res = await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .check({ key: byEmailKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byEmailKey, user)
       .commit();
     if (!res.ok) {
       throw new TypeError("ID 或电子邮件已存在的用户");
     }
   }
   ```

   > 该函数使用原子操作进行插入，检查没有具有相同 ID 或电子邮件的用户存在。如果违反其中任何一项约束，插入将失败且不会修改任何数据。

3. 定义一个 `getUser` 函数，根据用户 ID 检索用户：

   ```ts
   async function getUser(id: string): Promise<User | null> {
     const res = await kv.get<User>(["users", id]);
     return res.value;
   }
   ```

4. 定义一个 `getUserByEmail` 函数，通过电子邮件地址检索用户：

   ```ts
   async function getUserByEmail(email: string): Promise<User | null> {
     const res = await kv.get<User>(["users_by_email", email]);
     return res.value;
   }
   ```

   该函数使用二级键进行存储查询
   （`["users_by_email", email]`）。

5. 定义一个 `deleteUser` 函数，通过用户 ID 删除用户：

   ```ts
   async function deleteUser(id: string) {
     let res = { ok: false };
     while (!res.ok) {
       const getRes = await kv.get<User>(["users", id]);
       if (getRes.value === null) return;
       res = await kv.atomic()
         .check(getRes)
         .delete(["users", id])
         .delete(["users_by_email", getRes.value.email])
         .commit();
     }
   }
   ```

   > 该函数首先通过用户 ID 检索用户，以获取用户的电子邮件地址。这是获取用户地址的二级索引键所需的。然后执行原子操作，检查数据库中的用户未更改，并删除指向用户值的主键和二级键。如果此操作失败（用户在查询和删除之间被修改），则原子操作将中止。整个过程将重试直到删除成功。检查是必需的，以防止在检索和删除之间值被修改的竞争条件。如果更新更改了用户的电子邮件，则会发生这种竞争，因为在这种情况下二级索引发生变化。然后二级索引的删除将失败，因为删除的目标是旧的二级索引键。

## 非唯一索引（一对多）

非唯一索引是二级索引，其中单个键可以与多个主键关联，使您能够根据共享属性查询多个项目。例如，当根据用户的最爱颜色查询用户时，可以使用非唯一二级索引来实现。最爱颜色是一个非唯一属性，因为多个用户可以拥有相同的最爱颜色。

要为这个例子实现一个非唯一二级索引，请按照以下步骤操作：

1. 定义 `User` 接口：

   ```ts
   interface User {
     id: string;
     name: string;
     favoriteColor: string;
   }
   ```

2. 定义 `insertUser` 函数：

   ```ts
   async function insertUser(user: User) {
     const primaryKey = ["users", user.id];
     const byColorKey = [
       "users_by_favorite_color",
       user.favoriteColor,
       user.id,
     ];
     await kv.atomic()
       .check({ key: primaryKey, versionstamp: null })
       .set(primaryKey, user)
       .set(byColorKey, user)
       .commit();
   }
   ```

3. 定义一个函数，根据用户的最爱颜色检索用户：

   ```ts
   async function getUsersByFavoriteColor(color: string): Promise<User[]> {
     const iter = kv.list<User>({ prefix: ["users_by_favorite_color", color] });
     const users = [];
     for await (const { value } of iter) {
       users.push(value);
     }
     return users;
   }
   ```

这个例子演示了非唯一二级索引的使用，
`users_by_favorite_color`，该索引允许根据用户的最爱颜色进行查询。主键仍然是用户的 `id`。

唯一索引和非唯一索引的实现主要区别在于二级键的结构和组织。在唯一索引中，每个二级键与确切的一个主键关联，确保索引属性在所有记录中是唯一的。在非唯一索引的情况下，单个二级键可以与多个主键关联，因为索引属性可能在多个记录中共享。为了实现这一点，非唯一二级键通常以附加的唯一标识符（例如主键）作为键的一部分来构建，从而允许多个具有相同属性的记录共存，而不会发生冲突。