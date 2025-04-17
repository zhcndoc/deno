---
title: "Deno KV 快速入门"
oldUrl:
  - /kv/
  - /kv/manual/
  - /runtime/manual/runtime/kv/
---

**Deno KV** 是一个
[键值数据库](https://en.wikipedia.org/wiki/Key%E2%80%93value_database)
直接构建在 Deno 运行时中，提供在
[`Deno.Kv` 命名空间](https://docs.deno.com/api/deno/~/Deno.Kv) 中可用。它可以用于许多类型的数据存储用例，但在存储简单数据结构时表现出色，这些数据结构受益于非常快速的读取和写入。Deno KV 可在 Deno CLI 和 [Deno Deploy](./on_deploy) 上使用。

:::caution

Deno KV is still in development and may change. To use it, you must pass the
`--unstable-kv` flag to Deno.

:::

让我们来了解 Deno KV 的关键特性。

## 打开数据库

在你的 Deno 程序中，可以使用
[`Deno.openKv()`](https://docs.deno.com/api/deno/~/Deno.openKv) 获取对 KV 数据库的引用。你可以传入一个可选的文件系统路径，以确定你希望存储数据库的位置，否则将根据你的脚本的当前工作目录为你创建一个。

```ts
const kv = await Deno.openKv();
```

## 创建、更新和读取键值对

Deno KV 中的数据以键值对的形式存储，类似于 JavaScript 对象字面量的属性或
[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)。
[键](./key_space) 由 JavaScript 类型的数组表示，如 `string`、`number`、`bigint` 或 `boolean`。值可以是任意 JavaScript 对象。在这个例子中，我们创建了一个表示用户 UI 偏好的键值对，并使用
[`kv.set()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.set) 保存它。

```ts
const kv = await Deno.openKv();

const prefs = {
  username: "ada",
  theme: "dark",
  language: "en-US",
};

const result = await kv.set(["preferences", "ada"], prefs);
```

一旦设置了键值对，你可以使用 [`kv.get()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get) 从数据库中读取它：

```ts
const entry = await kv.get(["preferences", "ada"]);
console.log(entry.key);
console.log(entry.value);
console.log(entry.versionstamp);
```

`get` 和 `list` [操作](./operations) 都返回一个
[KvEntry](https://docs.deno.com/api/deno/~/Deno.KvEntry) 对象，具有以下属性：

- `key` - 用于设置值的数组键
- `value` - 为此键设置的 JavaScript 对象
- `versionstamp` - 用于确定键是否已更新的生成值。

`set` 操作也用于更新已存在的对象。当键的值被更新时，它的 `versionstamp` 将更改为一个新的生成值。

## 列出多个键值对

为了获取有限数量的键的值，您可以使用
[`kv.getMany()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.getMany)。传入多个键作为参数，您将收到一个每个键的值数组。请注意，**如果给定的键没有值，值和版本戳可以是 `null`**。

```ts
const kv = await Deno.openKv();
const result = await kv.getMany([
  ["preferences", "ada"],
  ["preferences", "grace"],
]);
result[0].key; // ["preferences", "ada"]
result[0].value; // { ... }
result[0].versionstamp; // "00000000000000010000"
result[1].key; // ["preferences", "grace"]
result[1].value; // null
result[1].versionstamp; // null
```

通常，从所有具有给定前缀的键中检索键值对列表是很有用的。这种操作可以使用
[`kv.list()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.list) 完成。在这个例子中，我们获取了共享 `"preferences"` 前缀的键值对列表。

```ts
const kv = await Deno.openKv();
const entries = kv.list({ prefix: ["preferences"] });
for await (const entry of entries) {
  console.log(entry.key); // ["preferences", "ada"]
  console.log(entry.value); // { ... }
  console.log(entry.versionstamp); // "00000000000000010000"
}
```

返回的键按键前缀后下一个组件的字典顺序排序。因此，具有以下键的 KV 对将按此顺序通过 `kv.list()` 返回：

- `["preferences", "ada"]`
- `["preferences", "bob"]`
- `["preferences", "cassie"]`

读取操作可以在
[**强一致性或最终一致性模式**](./operations) 下执行。强一致性模式保证读取操作将返回最近写入的值。最终一致性模式可能返回过时的值，但速度较快。相比之下，写入始终在强一致性模式下执行。

## 删除键值对

你可以使用
[`kv.delete()`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.delete) 从数据库中删除一个键。如果未找到给定键的值，则不执行任何操作。

```ts
const kv = await Deno.openKv();
await kv.delete(["preferences", "alan"]);
```

## 原子事务

Deno KV 能够执行 [原子事务](./transactions)，这使你能够有条件地同时执行一个或多个数据操作。在下面的示例中，我们只有在尚未创建喜好对象的情况下才会创建一个新的喜好对象。

```ts
const kv = await Deno.openKv();

const key = ["preferences", "alan"];
const value = {
  username: "alan",
  theme: "light",
  language: "en-GB",
};

const res = await kv.atomic()
  .check({ key, versionstamp: null }) // `null` 版本戳表示 '没有值'
  .set(key, value)
  .commit();
if (res.ok) {
  console.log("喜好尚不存在。已插入!");
} else {
  console.error("喜好已存在。");
}
```

在 Deno KV 中了解更多关于事务的信息 [这里](./transactions)。

## 通过二级索引改进查询

[二级索引](./secondary_indexes) 通过多个键存储相同的数据，允许更简单地查询所需的数据。假设我们需要能够通过用户名和电子邮件访问用户偏好。为此，你可以提供一个函数，该函数包装保存偏好的逻辑以创建两个索引。

```ts
const kv = await Deno.openKv();

async function savePreferences(prefs) {
  const key = ["preferences", prefs.username];

  // 设置主键
  const r = await kv.set(key, prefs);

  // 将二级键的值设置为主键
  await kv.set(["preferencesByEmail", prefs.email], key);

  return r;
}

async function getByUsername(username) {
  // 和之前一样使用...
  const r = await kv.get(["preferences", username]);
  return r;
}

async function getByEmail(email) {
  // 先通过电子邮件查找键，再进行第二次查找以获取实际数据
  const r1 = await kv.get(["preferencesByEmail", email]);
  const r2 = await kv.get(r1.value);
  return r2;
}
```

了解更多关于 [二级索引的手册信息](./secondary_indexes)。

## 监听 Deno KV 的更新

你也可以使用 `kv.watch()` 监听 Deno KV 的更新，它将会发出你提供的键的新的值或多个值。在下面的聊天示例中，我们监听键 `["last_message_id", roomId]` 的更新。我们检索 `messageId`，然后使用 `kv.list()` 从 `seen` 和 `messageId` 中获取所有的新消息。

```ts
let seen = "";
for await (const [messageId] of kv.watch([["last_message_id", roomId]])) {
  const newMessages = await Array.fromAsync(kv.list({
    start: ["messages", roomId, seen, ""],
    end: ["messages", roomId, messageId, ""],
  }));
  await websocket.write(JSON.stringify(newMessages));
  seen = messageId;
}
```

了解更多关于 [使用 Deno KV 监听的内容](./operations#watch)。

## 生产使用

Deno KV 可在 [Deno Deploy](./on_deploy) 上用于实时应用程序。在生产环境中，Deno KV 由
[FoundationDB](https://www.foundationdb.org/) 支持，后者是苹果创建的开源键值存储。

**运行使用 KV 的 Deno 程序在 Deploy 上无须额外配置** - 当你的代码需要时，会为你提供新的 Deploy 数据库。了解更多关于 Deno KV 在 Deno Deploy 上的信息 [这里](./on_deploy)。

## 测试

默认情况下，[`Deno.openKv()`](https://docs.deno.com/api/deno/~/Deno.openKv)
根据运行调用它的脚本的路径创建或打开一个持久存储。这通常不适合测试，因为测试需要在多次连续运行时产生相同的行为。

要测试使用 Deno KV 的代码，可以使用特殊参数 `":memory:"` 创建一个短暂的 Deno KV 数据存储。

```ts
async function setDisplayName(
  kv: Deno.Kv,
  username: string,
  displayname: string,
) {
  await kv.set(["preferences", username, "displayname"], displayname);
}

async function getDisplayName(
  kv: Deno.Kv,
  username: string,
): Promise<string | null> {
  return (await kv.get(["preferences", username, "displayname"]))
    .value as string;
}

Deno.test("Preferences", async (t) => {
  const kv = await Deno.openKv(":memory:");

  await t.step("可以设置 displayname", async () => {
    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, null);

    await setDisplayName(kv, "example", "Exemplary User");

    const displayName = await getDisplayName(kv, "example");
    assertEquals(displayName, "Exemplary User");
  });
});
```

这可行是因为 Deno KV 在本地开发时由 SQLite 支持。就像内存 SQLite 数据库一样，多个短暂的 Deno KV 存储可以同时存在而互不干扰。有关特殊数据库寻址模式的更多信息，请参见
[SQLite 文档中的相关主题](https://www.sqlite.org/inmemorydb.html)。

## 下一步

到这里，你刚刚开始接触 Deno KV。确保查看我们关于 [Deno KV 键空间](./key_space) 的指南，以及 [这里](../tutorials/index.md) 的一系列 [教程和示例应用程序]。