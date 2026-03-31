---
tags: [recommended]
---

不允许在正则表达式中使用 ASCII 控制字符。

控制字符是位于 ASCII 范围内的不可见字符，范围为 0-31。在正则表达式中使用这些字符是不常见的，通常是正则表达式中的错误。

**无效示例：**

```typescript
// 使用 ASCII (31) 回车符 (十六进制 x0d) 的例子
const pattern1 = /\x0d/;
const pattern2 = /\u000d/;
const pattern3 = new RegExp("\\x0d");
const pattern4 = new RegExp("\\u000d");
```

**有效示例：**

```typescript
// 使用 ASCII (32) 空格 (十六进制 x20) 的例子
const pattern1 = /\x20/;
const pattern2 = /\u0020/;
const pattern3 = new RegExp("\\x20");
const pattern4 = new RegExp("\\u0020");
```