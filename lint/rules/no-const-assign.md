---
tags: []
---

禁止修改声明为 `const` 的变量。

修改声明为 `const` 的变量将导致运行时错误。

**无效：**

```typescript
const a = 0;
a = 1;
a += 1;
a++;
++a;
```

**有效：**

```typescript
const a = 0;
const b = a + 1;

// `c` 在每次循环迭代中超出作用域，允许新的赋值
for (const c in [1, 2, 3]) {}
```