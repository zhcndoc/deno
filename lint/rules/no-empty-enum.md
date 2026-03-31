---
tags: [推荐]
---

不允许声明空枚举。

一个没有成员的枚举没有任何意义。此规则将捕获这些情况，将其视为不必要的代码或错误的空实现。

**无效：**

```typescript
enum Foo {}
```

**有效：**

```typescript
enum Foo {
  ONE = "ONE",
}
```