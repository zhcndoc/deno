---
tags: [推荐]
---

不允许重写/重新赋值已有函数。

Javascript 允许对函数定义进行重新赋值。这通常是开发者的错误，或者编码实践不佳，因为代码的可读性和可维护性将受到影响。

**无效示例：**

```typescript
function foo() {}
foo = bar;

const a = function baz() {
  baz = "现在我是一串字符串";
};

myFunc = existingFunc;
function myFunc() {}
```

**有效示例：**

```typescript
function foo() {}
const someVar = foo;

const a = function baz() {
  const someStr = "现在我是一串字符串";
};

const anotherFuncRef = existingFunc;

let myFuncVar = function () {};
myFuncVar = bar; // 变量重新赋值，不是函数重新声明
```