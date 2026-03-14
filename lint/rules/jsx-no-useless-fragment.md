---
tags: [recommended, react, jsx, fresh]
---

片段仅在 JSX "块" 的顶部是必要的，并且仅在有多个子元素时需要。在其他情况下不需要片段。

**无效:**

```tsx
<></>
<><div /></>
<><App /></>
<p>foo <>bar</></p>
```

**有效:**

```tsx
<>{foo}</>
<><div /><div /></>
<>foo <div /></>
<p>foo bar</p>
```