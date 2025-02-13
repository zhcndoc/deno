---
tags: [推荐]
---

禁止使用 `new` 操作符与内置的 `Symbol`。

`Symbol` 是通过作为函数调用来创建的，但我们有时会错误地使用 `new` 操作符进行调用。该规则检测此类错误使用 `new` 操作符的情况。

**无效：**

```typescript
const foo = new Symbol("foo");
```

**有效：**

```typescript
const foo = Symbol("foo");

function func(Symbol: typeof SomeClass) {
  // 这个 `Symbol` 不是内置的
  const bar = new Symbol();
}
```