---
title: "操作"
oldUrl:
  - /runtime/manual/runtime/kv/operations/
  - /kv/manual/operations/
---

<deno-admonition></deno-admonition>

Deno KV API 提供了一组可以在键空间上执行的操作。

有两个操作用于从存储中读取数据，还有五个操作用于将数据写入存储。

读取操作可以在强一致性模式或最终一致性模式下执行。强一致性模式保证读取操作会返回最近写入的值。最终一致性模式可能返回过期值，但速度更快。

写入操作始终在强一致性模式下执行。

## `get`

`get` 操作返回与给定键关联的值和版本戳。如果值不存在，get 将返回 `null` 值和版本戳。

可以使用两个 API 执行 `get` 操作。 [`Deno.Kv.prototype.get(key, options?)`][get] API，可以用来读取单个键，以及 [`Deno.Kv.prototype.getMany(keys, options?)`][getMany] API，可以用来一次读取多个键。

获取操作在所有一致性模式下都作为“快照读取”执行。这意味着在一次检索多个键时，返回的值将彼此一致。

```ts
const res = await kv.get<string>(["config"]);
console.log(res); // { key: ["config"], value: "value", versionstamp: "000002fa526aaccb0000" }

const res = await kv.get<string>(["config"], { consistency: "eventual" });
console.log(res); // { key: ["config"], value: "value", versionstamp: "000002fa526aaccb0000" }

const [res1, res2, res3] = await kv.getMany<[string, string, string]>([
  ["users", "sam"],
  ["users", "taylor"],
  ["users", "alex"],
]);
console.log(res1); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
console.log(res2); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }
console.log(res3); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
```

## `list`

`list` 操作返回与给定选择器匹配的键的列表。这些键关联的值和版本戳也会被返回。可以使用 2 个不同的选择器来过滤匹配的键。

`prefix` 选择器匹配所有以给定前缀键部分开头的键，但不包括精确匹配该键的情况。前缀选择器可以选择性地给定一个 `start` 或 `end` 键来限制返回的键的范围。`start` 键是包含的，`end` 键是不包含的。

`range` 选择器匹配所有在给定的 `start` 和 `end` 键之间的键。`start` 键是包含的，`end` 键是不包含的。

> 注意：在前缀选择器的情况下，`prefix` 键必须仅由完整（而非部分）键部分组成。例如，如果存储中存在键 `["foo", "bar"]`，则前缀选择器 `["foo"]` 将匹配它，但前缀选择器 `["f"]` 将不会。

list 操作可以选择性地给定一个 `limit` 来限制返回的键数量。

可以使用 [`Deno.Kv.prototype.list<string>(selector, options?)`][list] 方法执行列表操作。该方法返回一个 `Deno.KvListIterator`，可以用来遍历返回的键。这是一个异步迭代器，可以与 `for await` 循环一起使用。

```ts
// 返回所有用户
const iter = kv.list<string>({ prefix: ["users"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
console.log(users[2]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }

// 返回前 2 个用户
const iter = kv.list<string>({ prefix: ["users"] }, { limit: 2 });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }

// 返回在 "taylor" 之后的所有用户
const iter = kv.list<string>({ prefix: ["users"], start: ["users", "taylor"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }

// 返回在 "taylor" 之前的所有用户
const iter = kv.list<string>({ prefix: ["users"], end: ["users", "taylor"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }

// 返回 以 "a" 和 "n" 之间的字符开头的所有用户
const iter = kv.list<string>({ start: ["users", "a"], end: ["users", "n"] });
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
```

list 操作从存储中批量读取数据。可以使用 `batchSize` 选项控制每批的大小。默认批大小是 500 个键。批内的数据在单个快照读取中读取，因此值彼此一致。一致性模式适用于每批读取的数据。在批次之间，数据是一致的。批次之间的边界从 API 中是不可见的，因为迭代器返回单个键。

list 操作可以通过将 `reverse` 选项设置为 `true` 来反向执行。这将返回以字母顺序降序排列的键。`start` 和 `end` 键仍然分别是包含和不包含的，并且仍然被解释为字母顺序升序。

```ts
// 以反向顺序返回所有用户，截止到 "sam"
const iter = kv.list<string>({ prefix: ["users"], start: ["users", "sam"] }, {
  reverse: true,
});
const users = [];
for await (const res of iter) users.push(res);
console.log(users[0]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }
console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
```

> 注意：在上述示例中，我们将 `start` 键设置为 `["users", "sam"]`，即使返回的第一个键是 `["users", "taylor"]`。这是因为 `start` 和 `end` 键始终以字母顺序升序评估，即使在以反向顺序执行列表操作时（返回的键按字母顺序降序）。

## `set`

`set` 操作在存储中设置键的值。如果键不存在，则创建该键。如果键已经存在，则其值将被覆盖。

可以使用 [`Deno.Kv.prototype.set(key, value)`][set] 方法执行 `set` 操作。该方法返回一个 `Promise`，解析为一个 `Deno.KvCommitResult` 对象，其中包含提交的 `versionstamp`。

set 操作始终在强一致性模式下执行。

```ts
const res = await kv.set(["users", "alex"], "alex");
console.log(res.versionstamp); // "00a44a3c3e53b9750000"
```

## `delete`

`delete` 操作从存储中删除一个键。如果该键不存在，则操作为无效操作。

可以使用 [`Deno.Kv.prototype.delete(key)`][delete] 方法执行 `delete` 操作。

删除操作始终在强一致性模式下执行。

```ts
await kv.delete(["users", "alex"]);
```

## `sum`

`sum` 操作原子地将一个值添加到存储中的一个键。如果该键不存在，则创建该键并设置为该值得和。如果该键已经存在，则其值将被添加到和中。

`sum` 操作只能作为原子操作的一部分执行。可以使用 [`Deno.AtomicOperation.prototype.mutate({ type: "sum", value })`][mutate] 方法将和变换添加到原子操作中。

sum 操作只能在类型为 `Deno.KvU64` 的值上执行。操作数和存储中的值必须都是类型为 `Deno.KvU64`。

如果键的新值大于 `2^64 - 1` 或小于 `0`，sum 操作将回绕。例如，如果存储中的值是 `2^64 - 1` 而操作数是 `1`，那么新值将为 `0`。

sum 操作始终在强一致性模式下执行。

```ts
await kv.atomic()
  .mutate({
    type: "sum",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `min`

`min` 操作原子地将键设置为其当前值和给定值中的最小值。如果该键不存在，则用给定值创建该键。如果该键已经存在，则其值将被设置为其当前值和给定值中的最小值。

`min` 操作只能作为原子操作的一部分执行。可以使用 [`Deno.AtomicOperation.prototype.mutate({ type: "min", value })`][mutate] 方法将最小值变换添加到原子操作中。

min 操作只能在类型为 `Deno.KvU64` 的值上执行。操作数和存储中的值必须都是类型为 `Deno.KvU64`。

min 操作始终在强一致性模式下执行。

```ts
await kv.atomic()
  .mutate({
    type: "min",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `max`

`max` 操作原子地将键设置为其当前值和给定值中的最大值。如果该键不存在，则用给定值创建该键。如果该键已经存在，则其值将被设置为其当前值和给定值中的最大值。

`max` 操作只能作为原子操作的一部分执行。可以使用 [`Deno.AtomicOperation.prototype.mutate({ type: "max", value })`][mutate] 方法将最大值变换添加到原子操作中。

max 操作只能在类型为 `Deno.KvU64` 的值上执行。操作数和存储中的值必须都是类型为 `Deno.KvU64`。

max 操作始终在强一致性模式下执行。

```ts
await kv.atomic()
  .mutate({
    type: "max",
    key: ["accounts", "alex"],
    value: new Deno.KvU64(100n),
  })
  .commit();
```

## `watch`

`watch` 操作接受一个键的数组，并返回一个 [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)，当任何被观察的键更改其 `versionstamp` 时，会发出一个新值。发出的值是一个
[Deno.KvEntryMaybe](https://docs.deno.com/api/deno/~/Deno.KvEntryMaybe) 对象的数组。

请注意，返回的流不会返回被观察的键的每个中间状态，而是让您与键的最新状态保持同步。这意味着如果一个键被快速多次修改，您可能不会收到每次变化的通知，而是会收到该键的最新状态。

```ts
const db = await Deno.openKv();

const stream = db.watch([["foo"], ["bar"]]);
for await (const entries of stream) {
  entries[0].key; // ["foo"]
  entries[0].value; // "bar"
  entries[0].versionstamp; // "00000000000000010000"
  entries[1].key; // ["bar"]
  entries[1].value; // null
  entries[1].versionstamp; // null
}
```

[get]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.get
[getMany]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.getMany
[list]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.list
[set]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.set
[delete]: https://docs.deno.com/api/deno/~/Deno.Kv.prototype.delete
[mutate]: https://docs.deno.com/api/deno/~/Deno.AtomicOperation.prototype.mutate