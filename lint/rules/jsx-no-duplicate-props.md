---
tags: [recommended, react, jsx]
---

不允许重复的 JSX 属性。后面的属性将始终覆盖前面的属性，这常常会导致意想不到的结果。

**无效：**

```tsx
<div id="1" id="2" />;
<App a a />;
<App a {...b} a />;
```

**有效：**

```tsx
<div id="1" />
<App a />
<App a {...b} />
<App {...b} b />
```