---
title: "关键空间"
oldUrl:
  - /runtime/manual/runtime/kv/key_space/
  - /kv/manual/key_space/
  - /deploy/kv/manual/key_space/
---

<deno-admonition></deno-admonition>

Deno KV 是一个键值存储。关键空间是一个扁平的命名空间，由键+值+版本戳对组成。键是键部分的序列，允许对分层数据进行建模。值是任意的 JavaScript 对象。版本戳表示值插入/修改的时间。

## 键

Deno KV 中的键是键部分的序列，这些部分可以是 `string`、`number`、`boolean`、`Uint8Array` 或 `bigint`。

使用一系列部分，而不是一个单一的字符串可以消除分隔符注入攻击的可能性，因为没有可见的分隔符。

> 键注入攻击发生在攻击者通过将键编码方案中使用的分隔符注入到用户控制的变量中，操纵键值存储的结构，导致意外行为或未经授权的访问。例如，考虑到一个使用斜杠 (/) 作为分隔符的键值存储，键如 "users/alice/settings" 和 "users/bob/settings"。攻击者可以创建一个名为 "alice/settings/hacked" 的新用户，从而形成键 "users/alice/settings/hacked/settings"，注入分隔符并操纵键结构。在 Deno KV 中，这种注入将导致键 `["users", "alice/settings/hacked", "settings"]`，这并不有害。

在键部分之间，使用不可见的分隔符来分隔这些部分。这些分隔符永远是不可见的，但确保一个部分不会与另一个部分混淆。例如，键部分 `["abc", "def"]`、`["ab", "cdef"]`、`["abc", "", "def"]` 都是不同的键。

键是区分大小写的，并按其部分以字典序排列。第一部分是最重要的，最后一部分是最不重要的。部分的顺序由部分的类型和数值共同决定。

### 键部分排序

键部分按类型的字典序排序，在给定类型内，按其值排序。类型的排序如下：

1. `Uint8Array`
1. `string`
1. `number`
1. `bigint`
1. `boolean`

在给定类型内，排序为：

- `Uint8Array`: 数组的字节排序
- `string`: 字符串的 UTF-8 编码的字节排序
- `number`: -Infinity < -1.0 < -0.5 < -0.0 < 0.0 < 0.5 < 1.0 < Infinity < NaN
- `bigint`: 数学排序，最大负数在前，最大正数在后
- `boolean`: false < true

这意味着部分 `1.0`（一个数字）的排序在部分 `2.0`（也是一个数字）之前，但大于部分 `0n`（一个 bigint），因为 `1.0` 是一个数字，而 `0n` 是一个 bigint，类型排序优先于在类型内的值排序。

### 键示例

```js
["users", 42, "profile"]; // ID 为 42 的用户的个人资料
["posts", "2023-04-23", "comments"]; // 2023-04-23 所有帖子评论
["products", "electronics", "smartphones", "apple"]; // 电子类别中的苹果智能手机
["orders", 1001, "shipping", "tracking"]; // 订单 ID 1001 的追踪信息
["files", new Uint8Array([1, 2, 3]), "metadata"]; // 带有 Uint8Array 标识符的文件元数据
["projects", "openai", "tasks", 5]; // OpenAI 项目中 ID 为 5 的任务
["events", "2023-03-31", "location", "san_francisco"]; // 2023-03-31 在旧金山的事件
["invoices", 2023, "Q1", "summary"]; // 2023 年 Q1 发票的摘要
["teams", "engineering", "members", 1n]; // 工程团队中 ID 为 1n 的成员
```

### 通用唯一字典序可排序标识符 (ULID)

键部分排序允许时间戳和 ID 部分组成的键按时间顺序列出。通常，你可以使用以下方式生成一个键：
[`Date.now()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) 和
[`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID):

```js
async function setUser(user) {
  await kv.set(["users", Date.now(), crypto.randomUUID()], user);
}
```

连续运行多次，这将生成以下键：

```js
["users", 1691377037923, "8c72fa25-40ad-42ce-80b0-44f79bc7a09e"]; // 第一个用户
["users", 1691377037924, "8063f20c-8c2e-425e-a5ab-d61e7a717765"]; // 第二个用户
["users", 1691377037925, "35310cea-58ba-4101-b09a-86232bf230b2"]; // 第三个用户
```

然而，在某些情况下，将时间戳和 ID 表示在一个键部分中可能更直接。你可以使用一个
[通用唯一字典序可排序标识符 (ULID)](https://github.com/ulid/spec) 来做到这一点。这种标识符编码了 UTC 时间戳，字典序可排序，并且默认情况下是加密随机的：

```js
import { ulid } from "jsr:@std/ulid";

const kv = await Deno.openKv();

async function setUser(user) {
  await kv.set(["users", ulid()], user);
}
```

```js
["users", "01H76YTWK3YBV020S6MP69TBEQ"]; // 第一个用户
["users", "01H76YTWK4V82VFET9YTYDQ0NY"]; // 第二个用户
["users", "01H76YTWK5DM1G9TFR0Y5SCZQV"]; // 第三个用户
```

此外，你还可以使用 `monotonicUlid` 函数生成单调递增的 ULID：

```js
import { monotonicUlid } from "jsr:@std/ulid";

async function setUser(user) {
  await kv.set(["users", monotonicUlid()], user);
}
```

```js
// 对于同一时间戳进行严格排序，通过将最低有效随机位递增 1
["users", "01H76YTWK3YBV020S6MP69TBEQ"]; // 第一个用户
["users", "01H76YTWK3YBV020S6MP69TBER"]; // 第二个用户
["users", "01H76YTWK3YBV020S6MP69TBES"]; // 第三个用户
```

## 值

Deno KV 中的值可以是与 [结构化克隆算法][structured clone algorithm] 兼容的任意 JavaScript 值。这包括：

- `undefined`
- `null`
- `boolean`
- `number`
- `string`
- `bigint`
- `Uint8Array`
- `Array`
- `Object`
- `Map`
- `Set`
- `Date`
- `RegExp`

对象和数组可以包含上述任何类型，包括其他对象和数组。`Map` 和 `Set` 可以包含上述任何类型，包括其他 `Map` 和 `Set`。

值中的循环引用是支持的。

不支持具有非原始原型的对象（例如类实例或 Web API 对象）。函数和符号也不能被序列化。

### `Deno.KvU64` 类型

除了结构化可序列化值外，特殊值 `Deno.KvU64` 也被支持。这个对象表示一个 64 位无符号整数，以 bigint 形式表示。它可以与 `sum`、`min` 和 `max` KV 操作一起使用。它不能存储在对象或数组中。它必须作为顶级值存储。

可以通过 `Deno.KvU64` 构造函数创建：

```js
const u64 = new Deno.KvU64(42n);
```

### 值示例

```js,ignore
undefined;
null;
true;
false;
42;
-42.5;
42n;
"hello";
new Uint8Array([1, 2, 3]);
[1, 2, 3];
{ a: 1, b: 2, c: 3 };
new Map([["a", 1], ["b", 2], ["c", 3]]);
new Set([1, 2, 3]);
new Date("2023-04-23");
/abc/;

// 循环引用是支持的
const a = {};
const b = { a };
a.b = b;

// Deno.KvU64 是支持的
new Deno.KvU64(42n);
```

## 版本戳

Deno KV 键空间中的所有数据都是有版本的。每次插入或修改一个值时，会为其分配一个版本戳。版本戳是单调递增的、非顺序的、12 字节的值，表示值被修改的时间。版本戳并不表示实际时间，而是表示值被修改的顺序。

由于版本戳是单调递增的，因此可以用来判断某个值是否比另一个值更新。这可以通过比较两个值的版本戳来完成。如果版本戳 A 大于版本戳 B，则值 A 的修改时间比值 B 更新。

```js
versionstampA > versionstampB;
"000002fa526aaccb0000" > "000002fa526aacc90000"; // true
```

由单个事务修改的所有数据都被分配相同的版本戳。这意味着如果在同一原子操作中执行两个 `set` 操作，则新值的版本戳将是相同的。

版本戳用于实现乐观并发控制。原子操作可以包含检查，确保它们操作的数据的版本戳与传递给操作的版本戳匹配。如果数据的版本戳与传递给操作的版本戳不同，则事务将失败，操作将不被应用。

[结构化克隆算法]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm