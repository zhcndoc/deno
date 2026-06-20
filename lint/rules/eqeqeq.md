---
tags: []
---

强制使用类型安全的相等运算符 `===` 和 `!==` 代替更容易出错的 `==` 和 `!=` 运算符。

`===` 和 `!==` 确保比较的值不仅相同且类型相同。另一方面，`==` 和 `!=` 在值比较之前会进行类型转换，这可能导致意外的结果。例如 `5 == "5"` 是 `true`，而 `5 === "5"` 是 `false`。

**无效：**

```typescript
if (a == 5) {}
if ("hello world" != input) {}
```

**有效：**

```typescript
if (a === 5) {}
if ("hello world" !== input) {}
```

此规则没有配置选项。如果你有意针对某个特定比较使用 `==` 或
`!=`（例如使用 `value != null` 来同时匹配 `null`
和 `undefined`），可以在该行使用忽略指令来抑制此规则：

```typescript
// deno-lint-ignore eqeqeq
if (value != null) {}
```
