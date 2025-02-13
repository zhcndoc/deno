---
tags: []
---

禁止将文字量作为异常抛出。

仅`throw` `Error`对象本身或使用`Error`对象作为基类的自定义异常对象被认为是一种良好的实践。`Error`对象的根本好处在于它们自动跟踪它们的构建和来源位置。

**无效示例：**

```typescript
throw "error";
throw 0;
throw undefined;
throw null;
```

**有效示例：**

```typescript
throw new Error("error");
```