---
tags: []
---

不允许在同一声明语句中定义多个变量。

**无效：**

```typescript
const foo = 1, bar = "2";
```

**有效：**

```typescript
const foo = 1;
const bar = "2";
```