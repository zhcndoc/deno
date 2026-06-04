---
tags: []
---

禁止使用 NodeJS 全局对象。

NodeJS 暴露了一组全局对象，这些对象与 deno（和 web）不同，因此代码不应假设它们是可用的。相反，应该根据需要从其定义模块导入对象。

此规则在 Deno 2.8 中**默认关闭**。如需启用，请将其添加到你的
`deno.json` 中：

```json
{
  "lint": {
    "rules": {
      "include": ["no-node-globals"]
    }
  }
}
```

**无效：**

```typescript
// foo.ts
const buf = Buffer.from("foo", "utf-8"); // 在 Deno 中，Buffer 不是全局对象
```

**有效：**

```typescript
// foo.ts
import { Buffer } from "node:buffer";

const foo = Buffer.from("foo", "utf-8");
```