---
tags: []
---

确保 HTML 中的空元素没有任何子元素，因为这不是有效的 HTML。有关更多信息，请参阅
[`空元素` 文章在 MDN](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)。

**无效：**

```tsx
<br>foo</br>
<img src="a.jpg">foo</img>
```

**有效：**

```tsx
<br />
<img src="a.jpg" />
```