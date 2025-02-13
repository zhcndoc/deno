---
tags: [推荐]
---

不允许在嵌套块中定义变量或函数。

在嵌套块中声明函数可能会导致代码可读性降低，以及由于不同 JavaScript 运行时之间的兼容性问题而产生意想不到的结果。这不适用于在嵌套块上下文中有效的命名函数或匿名函数。

在嵌套块中使用 `var` 声明的变量也可能导致代码可读性降低。由于这些变量会提升到模块根部，因此最好在模块根部声明它们以提高清晰度。请注意，使用 `let` 或 `const` 声明的变量是块作用域的，因此此规则不适用于它们。

**无效示例：**

```typescript
if (someBool) {
  function doSomething() {}
}

function someFunc(someVal: number): void {
  if (someVal > 4) {
    var a = 10;
  }
}
```

**有效示例：**

```typescript
function doSomething() {}
if (someBool) {}

var a = 10;
function someFunc(someVal: number): void {
  var foo = true;
  if (someVal > 4) {
    let b = 10;
    const fn = function doSomethingElse() {};
  }
}
```