---
tags: [推荐]
---

不允许在构造函数中调用 `super()` 前使用 `this` 或 `super`。

在派生类的构造函数中，调用 `super()` 前访问 `this` 或 `super` 会导致 [`ReferenceError`]。为了防止这种情况，这个 lint 规则检查构造函数中在调用 `super()` 之前是否访问了 `this` 或 `super`。

[`ReferenceError`]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError

**无效:**

```typescript
class A extends B {
  constructor() {
    this.foo = 0;
    super();
  }
}

class C extends D {
  constructor() {
    super.foo();
    super();
  }
}
```

**有效:**

```typescript
class A extends B {
  constructor() {
    super();
    this.foo = 0;
  }
}

class C extends D {
  constructor() {
    super();
    super.foo();
  }
}

class E {
  constructor() {
    this.foo = 0;
  }
}
```