---
tags: []
---

要求所有函数在调用时，无论参数数量为多少，都使用自文档常量代替 `boolean` 字面量作为参数。

定义可以接受 `boolean` 作为参数的函数是很常见的。然而，传递 `boolean` 字面量作为参数可能会导致缺乏上下文，无法明确参数在被调用函数中的角色。

解决上述问题的一个简单方法是使用自文档常量，这些常量最终可以作为“命名的布尔值”，使得在函数调用的上下文中更好地理解参数的含义。

**无效示例：**

```typescript
function redraw(allViews: boolean, inline: boolean) {
  // redraw logic.
}
redraw(true, true);

function executeCommand(recursive: boolean, executionMode: EXECUTION_MODES) {
  // executeCommand logic.
}
executeCommand(true, EXECUTION_MODES.ONE);

function enableLogs(enable: boolean) {
  // enabledLogs logic.
}
enableLogs(true);
```

**有效示例：**

```typescript
function redraw(allViews: boolean, inline: boolean) {
  // redraw logic.
}
const ALL_VIEWS = true, INLINE = true;
redraw(ALL_VIEWS, INLINE);

function executeCommand(recursive: boolean, executionMode: EXECUTION_MODES) {
  // executeCommand logic.
}
const RECURSIVE = true;
executeCommand(RECURSIVE, EXECUTION_MODES.ONE);

function enableLogs(enable: boolean) {
  // enabledLogs logic.
}
const ENABLE = true;
enableLogs(ENABLE);
```