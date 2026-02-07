---
title: "@std/random"
description: "使用随机数生成器的各种实用工具。该包还提供了带种子的伪随机数生成器。"
jsr: jsr:@std/random
pkg: random
version: 0.1.5
generated: true
stability: unstable
---

<!-- 由 JSR 文档自动生成。请勿直接编辑。 -->

:::info 不稳定

此 @std 包是试验性的，其 API 可能会在不进行大版本更新的情况下更改。

:::

## 概览

<p>用于生成随机数的实用工具。</p>
<p>生成带固定种子数的随机整数示例：</p>

```js
import { randomIntegerBetween } from "@std/random";
import { randomSeeded } from "@std/random";
import { assertEquals } from "@std/assert";

const prng = randomSeeded(1n);

assertEquals(randomIntegerBetween(1, 10, { prng }), 3);
```

<p>生成两个值之间随机整数的示例：</p>

```js
import { randomIntegerBetween } from "@std/random";
import { randomSeeded } from "@std/random";

const prng = randomSeeded(BigInt(crypto.getRandomValues(new Uint32Array(1))[0]!));

const randomInteger = randomIntegerBetween(1, 10, { prng });
```

### 添加到您的项目

```sh
deno add jsr:@std/random
```

<a href="https://jsr.io/@std/random/doc" class="docs-cta jsr-cta">查看 @std/random 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 为什么使用 @std/random？

随机数生成对于模拟、游戏、抽样和随机算法非常有用。本包既提供了常见使用场景的便捷函数，也提供了通过种子创建可复现伪随机序列的方式。

## 示例

```ts
import { randomIntegerBetween, randomSeeded } from "@std/random";

const prng = randomSeeded(123n);
const roll = randomIntegerBetween(1, 6, { prng });
```

## 提示

- 为了实现可复现的测试和模拟，使用 `randomSeeded(seed)` 并将 PRNG 传递给辅助函数。
- 对于对安全敏感的随机数（令牌、密钥），请使用 Web Crypto API（`crypto.getRandomValues`），而不是伪随机数生成工具。
- 像 `randomIntegerBetween` 这样的分布辅助函数包括上下界；在 API 文档中说明这一点以避免越界一的混淆。

<!-- custom:end -->