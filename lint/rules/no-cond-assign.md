---
tags: [推荐]
---

禁止在条件语句中使用赋值操作符 `=`。

在条件语句中使用赋值操作符通常是因为误打了相等运算符 `==`。如果在条件语句中确实需要赋值，则此规则允许通过将赋值放入括号中来实现。

**无效：**

```typescript
let x;
if (x = 0) {
  let b = 1;
}
```

```typescript
function setHeight(someNode) {
  do {
    someNode.height = "100px";
  } while (someNode = someNode.parentNode);
}
```

**有效：**

```typescript
let x;
if (x === 0) {
  let b = 1;
}
```

```typescript
function setHeight(someNode) {
  do {
    someNode.height = "100px";
  } while ((someNode = someNode.parentNode));
}
```