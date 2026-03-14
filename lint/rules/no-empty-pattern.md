---
tags: [推荐]
---

禁止在解构中使用空模式。

在解构中，可以使用空模式，如 `{}` 或 `[]`，这些模式没有任何效果，可能与作者的意图不符。

**无效示例：**

```typescript
// 在下面的例子中，{} 和 [] 并不是对象字面量或空数组，
// 而是解构变量名的占位符
const {} = someObj;
const [] = someArray;
const {a: {}} = someObj;
const [a: []] = someArray;
function myFunc({}) {}
function myFunc([]) {}
```

**有效示例：**

```typescript
const { a } = someObj;
const [a] = someArray;

// 将解构变量默认值设为对象字面量的正确方法
const { a = {} } = someObj;

// 将解构变量默认值设为空数组的正确方法
const [a = []] = someArray;

function myFunc({ a }) {}
function myFunc({ a = {} }) {}
function myFunc([a]) {}
function myFunc([a = []]) {}
```