---
tags: [推荐]
---

禁止对受限名称的遮蔽。

以下 (a) 是全局对象的属性，或者 (b) 标识符在 JavaScript 中是“受限”名称：

- [`NaN`]
- [`Infinity`]
- [`undefined`]
- [`eval`]
- [`arguments`]

这些名称在 JavaScript 中并不是保留的，这意味着没有任何东西可以阻止人们将其他值赋值给它们（即遮蔽）。换句话说，您可以将 `undefined` 用作标识符或变量名。（有关更多详细信息，请参见 [MDN]）

[`NaN`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN
[`Infinity`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity
[`undefined`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
[`eval`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
[`arguments`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
[MDN]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined#description

```typescript
function foo() {
  const undefined = "bar";
  console.log(undefined); // 输出: "bar"
}
```

当然，像这样遮蔽很可能会让其他开发者感到困惑，应该避免这种情况。此 lint 规则会检测并发出警告。

**无效：**

```typescript
const undefined = 42;

function NaN() {}

function foo(Infinity) {}

const arguments = () => {};

try {
} catch (eval) {}
```

**有效：**

```typescript
// 如果未赋值，`undefined` 可能被遮蔽
const undefined;

const Object = 42;

function foo(a: number, b: string) {}

try {
} catch (e) {}
```