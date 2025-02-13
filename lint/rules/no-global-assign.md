---
tags: [推荐]
---

禁止对原生 Javascript 对象进行赋值。

在 Javascript 中，`String` 和 `Object` 例如是原生对象。像任何对象一样，它们可以被重新赋值，但几乎永远不明智，因为这可能导致意想不到的结果和难以追踪的错误。

**无效：**

```typescript
Object = null;
undefined = true;
window = {};
```