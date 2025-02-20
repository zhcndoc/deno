---
tags: [recommended, react, jsx]
---

确保在将可迭代对象传递给 JSX 时存在 `key` 属性。这允许框架优化元素顺序的检查。

**无效：**

```tsx
const foo = [<div>foo</div>];
const foo = [<>foo</>];
[1, 2, 3].map(() => <div />);
Array.from([1, 2, 3], () => <div />);
```

**有效：**

```tsx
const foo = [<div key="a">foo</div>];
const foo = [<Fragment key="b">foo</Fragment>];
[1, 2, 3].map((x) => <div key={x} />);
Array.from([1, 2, 3], (x) => <div key={x} />);
```