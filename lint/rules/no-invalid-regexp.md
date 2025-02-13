---
tags: [recommended]
---

不允许在 RegExp 构造函数中指定无效的正则表达式。

指定无效的正则表达式字面量将在编译时导致 SyntaxError，然而在 RegExp 构造函数中指定无效的正则表达式字符串则只会在运行时被发现。

**无效：**

```typescript
const invalidRegExp = new RegExp(")");
```

**有效：**

```typescript
const goodRegExp = new RegExp(".");
```
