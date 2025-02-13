---
tags: []
---

要求所有函数都有明确的返回类型。

明确的返回类型有许多优点，包括代码更易理解和更好的类型安全。从函数的签名中可以清楚地看出返回类型（如果有的话）是什么。

**无效：**

```typescript
function someCalc() {
  return 2 * 2;
}
function anotherCalc() {
  return;
}
```

**有效：**

```typescript
function someCalc(): number {
  return 2 * 2;
}
function anotherCalc(): void {
  return;
}
```