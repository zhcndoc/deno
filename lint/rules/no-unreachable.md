---
tags: [推荐]
---

禁止在控制流语句之后写无法到达的代码。

因为控制流语句（`return`、`throw`、`break` 和 `continue`）
会无条件地退出代码块，所以它们后面的任何语句都无法执行。

**无效示例:**

```typescript
function foo() {
  return true;
  console.log("完成");
}
```

```typescript
function bar() {
  throw new Error("哎呀！");
  console.log("完成");
}
```

```typescript
while (value) {
  break;
  console.log("完成");
}
```

```typescript
throw new Error("哎呀！");
console.log("完成");
```

```typescript
function baz() {
  if (Math.random() < 0.5) {
    return;
  } else {
    throw new Error();
  }
  console.log("完成");
}
```

```typescript
for (;;) {}
console.log("完成");
```

**有效示例:**

```typescript
function foo() {
  return bar();
  function bar() {
    return 1;
  }
}
```