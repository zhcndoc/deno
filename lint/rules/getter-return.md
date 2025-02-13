---
tags: [推荐]
---

要求所有属性获取器函数返回一个值。

获取器函数返回属性的值。如果函数不返回值，则违反了此合同。

**无效:**

```typescript
let foo = {
  get bar() {},
};

class Person {
  get name() {}
}
```

**有效:**

```typescript
let foo = {
  get bar() {
    return true;
  },
};

class Person {
  get name() {
    return "alice";
  }
}
```