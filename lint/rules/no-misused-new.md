---
tags: [推荐]
---

禁止为接口定义 `constructor` 或为类定义 `new`

为接口指定 `constructor` 或为类定义 `new` 方法是不正确的，应避免这样做。

**无效：**

```typescript
class C {
  new(): C;
}

interface I {
  constructor(): void;
}
```

**有效：**

```typescript
class C {
  constructor() {}
}

interface I {
  new (): C;
}
```