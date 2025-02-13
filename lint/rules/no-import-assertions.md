---
tags: [推荐]
---

不允许在导入属性中使用 `assert` 关键字。

ES 导入属性（以前称为导入断言）已更改为使用 `with` 关键字。使用 `assert` 的旧语法仍然被支持，但已被弃用。

**无效:**

```typescript
import obj from "./obj.json" assert { type: "json" };
import("./obj2.json", { assert: { type: "json" } });
```

**有效:**

```typescript
import obj from "./obj.json" with { type: "json" };
import("./obj2.json", { with: { type: "json" } });
```