---
tags: [recommended]
---

不允许没有 `yield` 的生成器函数。

JavaScript 提供了生成器函数，表示为 `function*`，我们可以在中间暂停并稍后恢复函数执行。在这些点上，我们使用 `yield` 关键字。换句话说，创建不包含 `yield` 关键字的生成器函数是没有意义的，因为这样的函数可以作为普通函数来编写。

**无效：**

```typescript
function* f1() {
  return "f1";
}
```

**有效：**

```typescript
function* f1() {
  yield "f1";
}

// 允许生成器函数为空体
function* f2() {}

function f3() {
  return "f3";
}
```