---
tags: []
---

确保在 JSX 表达式周围一致使用花括号。

**无效：**

```tsx
const foo = <Foo foo=<div /> />;
const foo = <Foo str={"foo"} />;
const foo = <div>{"foo"}</div>;
```

**有效：**

```tsx
const foo = <Foo foo={<div />} />;
const foo = <Foo str="foo" />;
const foo = <div>foo</div>;
```