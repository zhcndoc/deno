---
tags: [recommended]
---

禁止不必要的非空断言。

非空断言使用 `!` 指示编译器你知道这个值不为 null。连续使用该操作符超过一次，或者与可选链操作符（`?`）结合使用是令人困惑且不必要的。

**无效示例：**

```typescript
const foo: { str: string } | null = null;
const bar = foo!!.str;

function myFunc(bar: undefined | string) {
  return bar!!;
}
function anotherFunc(bar?: { str: string }) {
  return bar!?.str;
}
```

**有效示例：**

```typescript
const foo: { str: string } | null = null;
const bar = foo!.str;

function myFunc(bar: undefined | string) {
  return bar!;
}
function anotherFunc(bar?: { str: string }) {
  return bar?.str;
}
```