---
tags: [推荐]
---

禁止不必要的布尔类型强制转换。

在某些上下文中，例如 `if`、`while` 或 `for` 语句，表达式会自动转为布尔值。因此，像双重否定 (`!!foo`) 或强制转换 (`Boolean(foo)`) 这样的技术是多余的，并且与不进行否定或强制转换得到的结果相同。

**无效：**

```typescript
if (!!foo) {}
if (Boolean(foo)) {}
while (!!foo) {}
for (; Boolean(foo);) {}
```

**有效：**

```typescript
if (foo) {}
while (foo) {}
for (; foo;) {}
```