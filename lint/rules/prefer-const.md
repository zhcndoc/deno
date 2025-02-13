---
tags: [recommended]
---

建议使用 [`const`] 声明变量，而不是 [`let`]。

自 ES2015 起，JavaScript 支持使用 [`let`] 和 [`const`] 来声明变量。如果变量使用 [`let`] 声明，那么它们变得可变；我们可以在后面为它们赋值。与此同时，如果使用 [`const`] 声明，则它们是不可变的；我们不能对它们进行重新赋值。

一般来说，为了使代码库更加健壮、可维护和可读，强烈建议在可能的情况下使用 [`const`] 而不是 [`let`]。可变变量越少，跟踪变量状态就越容易，从而在阅读代码时发生错误的可能性就越小。因此，这个 lint 规则会检查是否存在可以使用 [`const`] 替代的 [`let`] 变量。

请注意，此规则不检查 [`var`] 变量。相反，[`no-var` 规则](/lint/rules/no-var) 负责检测和警告 [`var`] 变量。

[`let`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
[`const`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
[`var`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var

**无效示例：**

```typescript
let a = 0;

let b = 0;
someOperation(b);

// 可以使用 `const` 来替代
for (let c in someObject) {}

// 可以使用 `const` 来替代
for (let d of someArray) {}

// 首先未初始化的变量然后在同一作用域中赋值是不允许的
// 因为我们可以简单地写成 `const e = 2;`
let e;
e = 2;
```

**有效示例：**

```typescript
// 未初始化的变量是允许的
let a;

let b = 0;
b += 1;

let c = 0;
c = 1;

// 首先未初始化的变量然后在同一作用域中 _赋值两次或多次_ 是允许的
// 因为我们无法使用 `const` 来表示它
let d;
d = 2;
d = 3;

const e = 0;

// `f` 通过 `f++` 进行变更
for (let f = 0; f < someArray.length; f++) {}

// 在另一个作用域中初始化（或赋值）的变量是允许的
let g;
function func1() {
  g = 42;
}

// 有条件初始化的变量是允许的
let h;
if (trueOrFalse) {
  h = 0;
}
```