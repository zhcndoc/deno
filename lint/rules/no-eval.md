---
tags: []
---

不允许使用 `eval`。

`eval` 是一个潜在危险的函数，它可能会使你的代码面临多种安全漏洞。除了速度慢之外，`eval` 通常还可以通过更好的解决方案来避免使用。

**无效：**

```typescript
const obj = { x: "foo" };
const key = "x";
const value = eval("obj." + key);
```

**有效：**

```typescript
const obj = { x: "foo" };
const value = obj[key];
```