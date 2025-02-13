---
tags: [推荐]
---

强制所有变量至少被使用一次。

如果有声明但在任何地方未使用的变量，很可能是因为重构不完整。此 lint 规则会检测并警告这些未使用的变量。

变量 `a` 被认为是“使用过的”，如果满足以下任何条件：

- 它的值被读取，例如 `console.log(a)` 或 `let otherVariable = a;`
- 它被调用或构造，例如 `a()` 或 `new a()`
- 它被导出，例如 `export const a = 42;`

如果一个变量只是被赋值但从未被读取，那么它被视为 _“未使用”_。

```typescript
let a;
a = 42;

// `a` 从未被读取
```

如果你想故意声明未使用的变量，可以在前面加上下划线字符 `_`，比如 `_a`。此规则会忽略以 `_` 开头的变量。

**无效的：**

```typescript
const a = 0;

const b = 0; // 这个 `b` 从未被使用
function foo() {
  const b = 1; // 这个 `b` 被使用
  console.log(b);
}
foo();

let c = 2;
c = 3;

// 递归函数调用不被视为已使用，因为只有在 `d`
// 从函数体外被调用时，我们才能说 `d` 实际上
// 被调用了。
function d() {
  d();
}

// `x` 从未被使用
export function e(x: number): number {
  return 42;
}

const f = "未使用的变量";
```

**有效的：**

```typescript
const a = 0;
console.log(a);

const b = 0;
function foo() {
  const b = 1;
  console.log(b);
}
foo();
console.log(b);

let c = 2;
c = 3;
console.log(c);

function d() {
  d();
}
d();

export function e(x: number): number {
  return x + 42;
}

export const f = "被导出的变量";
```