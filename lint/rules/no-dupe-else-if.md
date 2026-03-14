---
tags: [推荐]
---

不允许在 `if`/`else if` 语句中重复使用相同的条件。

当您在 `if`/`else if` 语句中重复使用一个条件时，重复的条件将永远不会被达到（除非出现不寻常的副作用），这意味着这几乎总是一个错误。

**无效：**

```typescript
if (a) {}
else if (b) {}
else if (a) {} // 上述条件的重复

if (a === 5) {}
else if (a === 6) {}
else if (a === 5) {} // 上述条件的重复
```

**有效：**

```typescript
if (a) {}
else if (b) {}
else if (c) {}

if (a === 5) {}
else if (a === 6) {}
else if (a === 7) {}
```