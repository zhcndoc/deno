---
tags: [recommended, react, jsx]
---

重复同样的表达式通常是一个错误，并且会导致不必要的计算。

**无效：**

```tsx
<div {...foo} {...foo} />
<div {...foo} a {...foo} />
<Foo {...foo.bar} {...foo.bar} />
```

**有效：**

```tsx
<div {...foo} />
<div {...foo.bar} a />
<Foo {...foo.bar} />
```