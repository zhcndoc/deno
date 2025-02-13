---
tags: [推荐]
---

不允许隐式穿透 case 语句。

没有 `break` 的 case 语句将执行其主体，然后继续执行下一个 case 或 default 块的代码。虽然这有时是出于故意，但很多时候开发者忘记添加 break 语句，原本只打算执行单个 case 语句。此规则强制要求你要么在每个 case 语句末尾加上 break 语句，要么添加一个明确的注释表明穿透是故意的。穿透注释必须包含 `fallthrough`、`falls through` 或 `fall through` 之一。

**无效示例：**

```typescript
switch (myVar) {
  case 1:
    console.log("1");

  case 2:
    console.log("2");
}
// 如果 myVar = 1，则输出 `1` 和 `2`。这是故意的吗？
```

**有效示例：**

```typescript
switch (myVar) {
  case 1:
    console.log("1");
    break;

  case 2:
    console.log("2");
    break;
}
// 如果 myVar = 1，则仅输出 `1`

switch (myVar) {
  case 1:
    console.log("1");
    /* falls through */
  case 2:
    console.log("2");
}
// 如果 myVar = 1，故意输出 `1` 和 `2`
```