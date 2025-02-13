---
tags: []
---

要求 `for-in` 循环包含 `if` 语句。

使用 `for-in` 循环遍历对象时，会包含通过原型链继承的属性。这种行为可能导致你的循环中出现意外的项。

**无效示例：**

```typescript
for (const key in obj) {
  foo(obj, key);
}
```

**有效示例：**

```typescript
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    foo(obj, key);
  }
}
```

```typescript
for (const key in obj) {
  if (!Object.hasOwn(obj, key)) {
    continue;
  }
  foo(obj, key);
}
```