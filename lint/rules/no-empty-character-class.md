---
tags: [推荐]
---

不允许在正则表达式中使用空字符类。

正则表达式字符类是一系列用方括号括起来的字符，例如 `[abc]`。如果方括号内没有任何内容，它将不会匹配任何东西，这很可能是一个拼写错误或失误。

**无效:**

```typescript
/^abc[]/.test("abcdefg"); // false，因为 `d` 不匹配空字符类
"abcdefg".match(/^abc[]/); // null
```

**有效:**

```typescript
// 没有字符类
/^abc/.test("abcdefg"); // true
"abcdefg".match(/^abc/); // ["abc"]

// 有一个有效的字符类
/^abc[a-z]/.test("abcdefg"); // true
"abcdefg".match(/^abc[a-z]/); // ["abcd"]
```