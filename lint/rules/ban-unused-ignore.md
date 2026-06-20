---
tags: [推荐]
---

警告未使用的忽略指令。

我们有时出于某些原因不得不抑制和忽略 lint 错误，我们可以使用 [忽略指令](/go/lint-ignore/) 来实现。

然而，在某些情况下，比如重构之后，我们可能会拥有不再必要的忽略指令。这些多余的忽略指令可能会让未来的代码阅读者困惑，更糟糕的是，可能无意中掩盖未来的 lint 错误。为了防止这种情况，此规则检测未使用的多余忽略指令。

**无效:**

```typescript
// `export` 也算作一次使用，所以 `foo` 实际上并未未使用，
// 因此下面的指令并不会抑制任何内容。此规则会将其标记为多余。
// deno-lint-ignore no-unused-vars
export const foo = 42;
```

**有效:**

```typescript
// 此处该指令是多余的，因此它只是被移除了。
export const foo = 42;

// 这里该指令确实在发挥作用：`bar` 确实未被使用，因此
// `no-unused-vars` 指令是必要的，而 `ban-unused-ignore` 不会干预它。
// deno-lint-ignore no-unused-vars
const bar = 42;
```
