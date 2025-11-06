---
title: "@std/collections"
description: "用于数组和对象等集合类型的常用任务的纯函数"
jsr: jsr:@std/collections
pkg: collections
version: 1.1.3
generated: true
stability: stable
---

<!-- 由 JSR 文档自动生成。请勿直接编辑。 -->

## 概览

<p>用于数组和对象等集合类型的常用任务的纯函数。</p>
<p>灵感来源于
<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/" rel="nofollow">Kotlin 的 Collections</a>
包和 <a href="https://lodash.com/" rel="nofollow">Lodash</a>。</p>

```js
import { intersect, pick, sample } from "@std/collections";
import { assertArrayIncludes, assertEquals } from "@std/assert";

const lisaInterests = ["Cooking", "Music", "Hiking"];
const kimInterests = ["Music", "Tennis", "Cooking"];

assertEquals(intersect(lisaInterests, kimInterests), ["Cooking", "Music"]);

assertArrayIncludes(lisaInterests, [sample(lisaInterests)]);

const cat = { name: "Lulu", age: 3, breed: "Ragdoll" };

assertEquals(pick(cat, ["name", "breed"]), { name: "Lulu", breed: "Ragdoll" });
```

### 添加到你的项目中

```sh
deno add jsr:@std/collections
```

<a href="https://jsr.io/@std/collections/doc" class="docs-cta jsr-cta">查看 @std/collections 中的所有
符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 什么是集合类型？

集合类型是包含多个值的数据结构，如数组和对象。它们允许你将相关数据分组在一起，并对它们执行操作，比如过滤、转换和聚合。

该包提供了一些小型且专注的函数，用于操作这些类型，使你能从简单的构建块组合成复杂操作。

## 为什么使用 @std/collections？

collections 包提供了一些小型且纯净的辅助函数（intersect、pick、groupBy、partition），可以替代引入大型工具库。

## 示例

### distinct 和 distinctBy

```ts
import { distinct, distinctBy } from "@std/collections";

const tags = ["a", "b", "a", "c"];
console.log(distinct(tags)); // ["a", "b", "c"]

const people = [
  { id: 1, name: "Alice" },
  { id: 1, name: "Alice v2" },
  { id: 2, name: "Bob" },
];
console.log(distinctBy(people, (p) => p.id));
// [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
```

### 映射记录：mapValues, mapKeys

```ts
import { mapKeys, mapValues } from "@std/collections";

const rec = { a: 1, b: 2 };
console.log(mapValues(rec, (v) => v * 2)); // { a: 2, b: 4 }
console.log(mapKeys(rec, (k) => k.toUpperCase())); // { A: 1, B: 2 }
```

### 深度合并嵌套对象

```ts
import { deepMerge } from "@std/collections/deep-merge";

const a = { cfg: { retries: 2, mode: "fast" } };
const b = { cfg: { retries: 3 } };
console.log(deepMerge(a, b));
// { cfg: { retries: 3, mode: "fast" } }
```

### 滑动窗口（带选项）

```ts
import { slidingWindows } from "@std/collections";

console.log(slidingWindows([1, 2, 3, 4], 3));
// [[1,2,3],[2,3,4]]

console.log(slidingWindows([1, 2, 3, 4, 5], 3, { step: 2, partial: true }));
// [[1,2,3],[3,4,5],[5]]
```

### 按派生键排序

```ts
import { sortBy } from "@std/collections";

const items = [{ v: 2 }, { v: 5 }, { v: 1 }];
console.log(sortBy(items, (i) => i.v));
// [{ v: 1 }, { v: 2 }, { v: 5 }]
console.log(sortBy(items, (i) => i.v, { order: "desc" }));
// [{ v: 5 }, { v: 2 }, { v: 1 }]
```

### 分割对象条目

```ts
import { partitionEntries } from "@std/collections";

const user = { id: 1, name: "Sam", active: true, score: 42 };
const [numbers, rest] = partitionEntries(
  user,
  ([, v]) => typeof v === "number",
);
// numbers: { id: 1, score: 42 }
// rest: { name: "Sam", active: true }
```

### 生成连接字符串

```ts
import { joinToString } from "@std/collections";

console.log(
  joinToString([1, 2, 3], { prefix: "[", separator: ", ", suffix: "]" }),
);
// "[1, 2, 3]"
```

## 使用小贴士

- 函数均为纯函数且以数据优先；不会修改你的输入。
- 优先使用这些基本函数，以保持依赖轻量和代码清晰。

<!-- custom:end -->