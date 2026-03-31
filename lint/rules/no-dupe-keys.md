---
tags: [推荐]
---

不允许在对象字面量中使用重复的键。

在对象字面量中多次设置相同的键会覆盖该键的其他赋值，并可能导致意外的行为。

**无效：**

```typescript
const foo = {
  bar: "baz",
  bar: "qux",
};
```

```typescript
const foo = {
  "bar": "baz",
  bar: "qux",
};
```

```typescript
const foo = {
  0x1: "baz",
  1: "qux",
};
```

**有效：**

```typescript
const foo = {
  bar: "baz",
  quxx: "qux",
};
```