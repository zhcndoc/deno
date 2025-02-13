---
tags: []
---

使用 JSX 子元素与 `dangerouslySetInnerHTML` 一起是无效的，因为它们将被忽略。

**无效：**

```tsx
<div dangerouslySetInnerHTML={{ __html: "<h1>hello</h1>" }}>
  <h1>这将永远不会被渲染</h1>
</div>;
```

**有效：**

```tsx
<div dangerouslySetInnerHTML={{ __html: "<h1>hello</h1>" }} />;
```