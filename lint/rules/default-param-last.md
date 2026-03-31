---
tags: []
---

强制默认参数在函数签名中位于最后。

具有默认值的参数本质上是可选的，但不能在函数调用中省略而不将函数输入映射到不同的参数，这会导致混淆和错误。将它们指定为最后一个参数允许在不改变其他参数语义的情况下省略它们。

**无效：**

```typescript
function f(a = 2, b) {}
function f(a = 5, b, c = 5) {}
```

**有效：**

```typescript
function f() {}
function f(a) {}
function f(a = 5) {}
function f(a, b = 5) {}
function f(a, b = 5, c = 5) {}
function f(a, b = 5, ...c) {}
function f(a = 2, b = 3) {}
```