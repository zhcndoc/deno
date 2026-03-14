---
tags: [recommended]
---

不允许重新声明具有相同名称的变量、函数和参数。

JavaScript 允许我们使用 `var` 重新声明具有相同名称的变量，但不应使用重新声明，因为这会使变量难以追踪。

此外，这条 lint 规则也不允许使用 `let` 或 `const` 进行重新声明，尽管 ESLint 是允许的。这是有益的，因为我们可以在实际运行代码之前发现语法错误。

至于函数和参数，JavaScript 只是将这些视为运行时错误，运行时抛出 `SyntaxError`。静态检测这种错误也是有益的。

**无效:**

```typescript
var a = 3;
var a = 10;

let b = 3;
let b = 10;

const c = 3;
const c = 10;

function d() {}
function d() {}

function e(arg: number) {
  var arg: number;
}

function f(arg: number, arg: string) {}
```

**有效:**

```typescript
var a = 3;
function f() {
  var a = 10;
}

if (foo) {
  let b = 2;
} else {
  let b = 3;
}
```