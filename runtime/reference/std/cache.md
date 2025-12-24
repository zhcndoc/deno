---
title: "@std/cache"
description: "缓存工具"
jsr: jsr:@std/cache
pkg: cache
version: 0.2.1
generated: true
stability: unstable
---

<!-- 自动生成自 JSR 文档。请不要直接编辑。 -->

:::info 不稳定

此 @std 包是实验性的，其 API 可能会在不提升主版本号的情况下发生变化。

:::

## 概述

<p>内存缓存工具，如记忆化和具有不同过期策略的缓存。</p>

```js
import { memoize, LruCache, type MemoizationCacheResult } from "@std/cache";
import { assertEquals } from "@std/assert";

const cache = new LruCache<string, MemoizationCacheResult<bigint>>(1000);

// 斐波那契函数，如果不使用记忆化，n > ~30 时会非常慢
const fib = memoize((n: bigint): bigint => {
  return n <= 2n ? 1n : fib(n - 1n) + fib(n - 2n);
}, { cache });

assertEquals(fib(100n), 354224848179261915075n);
```

### 添加到你的项目中

```sh
deno add jsr:@std/cache
```

<a href="https://jsr.io/@std/cache/doc" class="docs-cta jsr-cta">查看 @std/cache 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 什么是缓存？

缓存将最近使用或计算成本高的数据存储在内存中，以便下次可以更快地重复使用，而不是重新计算或重新获取。当计算缓慢、网络调用频繁或反复访问相同数据时，缓存非常有用。

记忆化是函数结果的缓存：给定相同的输入，返回之前计算过的输出。它适用于纯函数（无副作用），结果仅取决于输入的情况。

## 为什么使用 @std/cache？

该包提供了一个现成的 `memoize()` 辅助函数和常见的缓存类型，这样你就不必自己构建它们。

该包兼容 Deno/Node/Bun/Workers 等环境，并保持 API 简洁且可预测。

### LRU

LRU（最近最少使用）会驱逐你最长时间未使用的条目。适用于“近期的数据很可能会再次使用”的场景。适合热点工作集。

### TTL

TTL（存活时间）在固定时间后驱逐条目，无论是否访问。适用于数据快速过期的情况（例如，来自服务的配置、短期有效的令牌）。

- 根据工作负载选择驱逐策略：时间局部性用 LRU，数据新鲜度用 TTL，内存受限时用基于大小的策略。
- 记忆化缓存必须考虑参数的标识性——对象/函数需要稳定的键（例如序列化或适当时用 WeakMap）。
- 注意防止无限增长；设定合理限制并通过命中率调整容量。
- 明确处理错误/超时——缓存仅成功结果，除非失败结果也应保留。

## 示例

```ts
import { LruCache, memoize } from "@std/cache";

const cache = new LruCache<string, number>(500);
const fib = memoize(
  (n: number): number => n <= 1 ? n : fib(n - 1) + fib(n - 2),
  { cache },
);
```

<!-- custom:end -->