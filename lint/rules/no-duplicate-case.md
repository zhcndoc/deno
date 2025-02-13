---
tags: [推荐]
---

不允许在 `switch` 语句中重复使用相同的 case 子句。

当你在 `switch` 语句中重复使用一个 case 测试表达式时，重复的 case 将永远无法达到，这意味着这几乎总是一个错误。

**无效：**

```typescript
const someText = "a";
switch (someText) {
  case "a": // (1)
    break;
  case "b":
    break;
  case "a": // (1) 的重复
    break;
  default:
    break;
}
```

**有效：**

```typescript
const someText = "a";
switch (someText) {
  case "a":
    break;
  case "b":
    break;
  case "c":
    break;
  default:
    break;
}
```