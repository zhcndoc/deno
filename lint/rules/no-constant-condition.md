---
tags: [recommended]
---

不允许在条件测试中使用常量表达式。

在条件测试中使用常量表达式通常是错误的，或者是在开发过程中引入的临时情况，并不适合用于生产环境。

**无效：**

```typescript
if (true) {}
if (2) {}
do {} while (x = 2); // 无限循环
```

**有效：**

```typescript
if (x) {}
if (x === 0) {}
do {} while (x === 2);
```