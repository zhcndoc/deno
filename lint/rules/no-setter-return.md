---
tags: [推荐]
---

不允许从设置器返回值。

设置器应该用于给属性设置某个值，这意味着从设置器返回值是没有意义的。实际上，返回的值会被忽略，根本无法使用，尽管从设置器返回值不会产生错误。这就是为什么静态检查这种错误的 lint 工具是非常有益的原因。

请注意，返回时不带值是被允许的；这是一种用于从函数中提前返回的有用技巧。

**无效示例：**

```typescript
const a = {
  set foo(x: number) {
    return "something";
  },
};

class B {
  private set foo(x: number) {
    return "something";
  }
}

const c = {
  set foo(x: boolean) {
    if (x) {
      return 42;
    }
  },
};
```

**有效示例：**

```typescript
// 返回时不带值是允许的，因为它用于提前返回
const a = {
  set foo(x: number) {
    if (x % 2 == 0) {
      return;
    }
  },
};

// 不是设置器，而是获取器
class B {
  get foo() {
    return 42;
  }
}

// 不是设置器
const c = {
  set(x: number) {
    return "something";
  },
};
```