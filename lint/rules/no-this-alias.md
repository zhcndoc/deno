---
tags: [recommended]
---

不允许将变量赋值给 `this`。

在大多数情况下，通过正确使用箭头函数，可以避免将 `this` 存储在变量中，因为它们根据定义箭头函数的作用域确定 `this`。

让我们看一个具体的例子：

```typescript
const obj = {
  count: 0,
  doSomethingLater() {
    setTimeout(function () { // 这个函数在全局作用域中执行；`this` 评估为 `globalThis`
      this.count++;
      console.log(this.count);
    }, 300);
  },
};

obj.doSomethingLater();
// 打印 `NaN`，因为属性 `count` 不在全局作用域中。
```

在上面的例子中，传递给 `setTimeout` 的函数中的 `this` 评估为 `globalThis`，这导致预期的值 `1` 没有被打印。

如果您想在不使用箭头函数的情况下解决这个问题，可以将 `this` 的引用存储在另一个变量中：

```typescript
const obj = {
  count: 0,
  doSomethingLater() {
    const self = this; // 将 `this` 存储在 `self` 中
    setTimeout(function () {
      // 使用 `self` 代替 `this`
      self.count++;
      console.log(self.count);
    }, 300);
  },
};

obj.doSomethingLater();
// 打印 `1`，如预期
```

但在这种情况下，箭头函数非常有用。使用箭头函数，代码变得更加清晰和易于理解：

```typescript
const obj = {
  count: 0,
  doSomethingLater() {
    setTimeout(() => { // 使用箭头函数
      // 此处 `this` 评估为 `obj`
      this.count++;
      console.log(this.count);
    }, 300);
  },
};

obj.doSomethingLater();
// 打印 `1`，如预期
```

这个例子来自
[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。

**无效的：**

```typescript
const self = this;

function foo() {
  const self = this;
}

const bar = () => {
  const self = this;
};
```

**有效的：**

```typescript
const self = "this";

const [foo] = this;
```