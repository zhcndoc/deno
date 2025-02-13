---
tags: [推荐]
---

不允许在函数签名中多次使用相同的参数名称。

如果你向一个函数提供多个相同名称的参数，最后一个实例将会覆盖前面的实例。这很可能是一个无意的拼写错误。

**无效：**

```typescript
function withDupes(a, b, a) {
  console.log("我是第二个a的值:", a);
}
```

**有效：**

```typescript
function withoutDupes(a, b, c) {
  console.log("我是第一个（也是唯一的）a的值:", a);
}
```