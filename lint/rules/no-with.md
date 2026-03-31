---
tags: [推荐]
---

不允许使用 `with` 语句。

`with` 语句不被推荐，因为它可能是导致困惑的错误和兼容性问题的源头。有关更多详情，请参阅 [with - JavaScript | MDN]。

[with - JavaScript | MDN]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with

**无效示例：**

```typescript
with (someVar) {
  console.log("foo");
}
```