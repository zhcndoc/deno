---
tags: [recommended]
---

警告在忽略指令中使用未知规则代码。

我们有时需要出于某些原因抑制和忽略 lint 错误。我们可以使用 [忽略指令](/go/lint-ignore/) 来实现，指定应被忽略的规则名称，如下所示：

```typescript
// deno-lint-ignore no-explicit-any no-unused-vars
const foo: any = 42;
```

此规则检查指定规则名称的有效性（即 `deno_lint` 是否提供该规则）。

**无效：**

```typescript
// 拼写错误
// deno-lint-ignore eq-eq-e
console.assert(x == 42);

// 未知规则名称
// deno-lint-ignore UNKNOWN_RULE_NAME
const b = "b";
```

**有效：**

```typescript
// deno-lint-ignore eq-eq-eq
console.assert(x == 42);

// deno-lint-ignore no-unused-vars
const b = "b";
```