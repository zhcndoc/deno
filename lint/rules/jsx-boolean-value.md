---
tags: []
---

强制一致的 JSX 布尔值样式。传递 `true` 作为布尔值可以使用简写语法省略。

**无效:**

```tsx
const foo = <Foo isFoo={true} />;
const foo = <Foo isFoo={false} />;
```

**有效:**

```tsx
const foo = <Foo isFoo />;
const foo = <Foo isFoo={false} />;
```