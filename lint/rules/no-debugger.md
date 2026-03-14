---
tags: [推荐]
---

禁止使用 `debugger` 语句。

`debugger` 是一个用于停止 JavaScript 执行环境并在该语句处启动调试器的语句。现代调试器和工具不再需要这个语句，保留它可能会导致您的代码在生产环境中停止执行。

**无效示例：**

```typescript
function isLongString(x: string) {
  debugger;
  return x.length > 100;
}
```

**有效示例：**

```typescript
function isLongString(x: string) {
  return x.length > 100; // 在这里设置断点
}
```