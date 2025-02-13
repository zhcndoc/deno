---
tags: []
---

建议使用来自 `primordials` 的冻结原语，而不是默认的全局对象。

这个 lint 规则旨在专门用于 Deno 的内部代码。普通用户无需对他们的代码运行此规则。

原语是运行时中所有内置对象的冻结集合，我们应该在 Deno 的内部使用它们，以避免原型污染的风险。此规则检测对全局原语的直接使用，并建议用 `primordials` 对象中的相应原语进行替换。

一个这样的例子是：

```javascript
const arr = getSomeArrayOfNumbers();
const evens = arr.filter((val) => val % 2 === 0);
```

该示例的第二行应该是：

```javascript
const evens = primordials.ArrayPrototypeFilter(arr, (val) => val % 2 === 0);
```

**无效：**

```javascript
const arr = new Array();

const s = JSON.stringify({});

const i = parseInt("42");

const { ownKeys } = Reflect;
```

**有效：**

```javascript
const { Array } = primordials;
const arr = new Array();

const { JSONStringify } = primordials;
const s = JSONStringify({});

const { NumberParseInt } = primordials;
const i = NumberParseInt("42");

const { ReflectOwnKeys } = primordials;
```