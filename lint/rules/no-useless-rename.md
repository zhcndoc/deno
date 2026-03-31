---
tags: []
---

禁止无用的重命名操作，当原始名称和新名称完全相同时。这通常是重构过程中留下的，可以安全地删除。

**无效：**

```ts
import { foo as foo } from "foo";
const { foo: foo } = obj;
export { foo as foo };
```

**有效：**

```ts
import { foo as bar } from "foo";
const { foo: bar } = obj;
export { foo as bar };
```