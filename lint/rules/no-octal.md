---
tags: [recommended]
---

禁止使用以 `0` 开头的数字文字表达八进制数。

八进制数可以通过以 `0` 开头的数字文字来表达，例如 `042`，但这种表达方式常常会让程序员感到困惑。这就是为什么 ECMAScript 的严格模式会对这种表达抛出 `SyntaxError`。

自 ES2015 起，另一个前缀 `0o` 作为替代方案被引入。今天的代码中强烈建议使用这个新的表达方式。

**无效：**

```typescript
const a = 042;
const b = 7 + 042;
```

**有效：**

```typescript
const a = 0o42;
const b = 7 + 0o42;
const c = "042";
```