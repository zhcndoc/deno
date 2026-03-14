---
tags: [推荐]
---

不允许重新赋值异常参数。

一般来说，没有好的理由去重新赋值异常参数。一旦重新赋值，从那时起代码就无法再访问错误。

**无效：**

```typescript
try {
  someFunc();
} catch (e) {
  e = true;
  // 无法再访问抛出的错误
}
```

**有效：**

```typescript
try {
  someFunc();
} catch (e) {
  const anotherVar = true;
}
```