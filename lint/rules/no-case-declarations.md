---
tags: [推荐]
---

在 `case` 或 `default` 子句中要求使用大括号来限制 `let`、`const`、`function` 和 `class` 的作用域。

如果 `case` 或 `default` 块中没有大括号，词法声明会在整个 switch 块中可见，但只有在被赋值时才会初始化，而这仅在达到该 case/default 时发生。这可能会导致意外错误。解决方案是确保每个 `case` 或 `default` 块用大括号包裹，以限制声明的作用域。

**无效示例：**

```typescript
switch (choice) {
  // `let`、`const`、`function` 和 `class` 在整个 switch 语句中作用域可见
  case 1:
    let a = "选择 1";
    break;
  case 2:
    const b = "选择 2";
    break;
  case 3:
    function f() {
      return "选择 3";
    }
    break;
  default:
    class C {}
}
```

**有效示例：**

```typescript
switch (choice) {
  // 以下 `case` 和 `default` 子句用大括号包裹
  case 1: {
    let a = "选择 1";
    break;
  }
  case 2: {
    const b = "选择 2";
    break;
  }
  case 3: {
    function f() {
      return "选择 3";
    }
    break;
  }
  default: {
    class C {}
  }
}
```