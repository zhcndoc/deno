---
tags: [推荐]
---

不允许删除变量。

`delete` 用于从对象中移除一个属性。通过 `var`、`let` 和 `const` 声明的变量无法被删除（`delete` 将返回 `false`）。在严格模式下，当试图删除一个变量时会抛出语法错误。

**无效示例：**

```typescript
const a = 1;
let b = 2;
let c = 3;
delete a; // 将返回 false
delete b; // 将返回 false
delete c; // 将返回 false
```

**有效示例：**

```typescript
let obj = {
  a: 1,
};
delete obj.a; // 返回 true
```