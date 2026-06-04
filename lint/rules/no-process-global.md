---
tags: []
---

禁止使用 NodeJS 的 `process` 全局变量。

NodeJS 和 Deno 暴露了 `process` 全局变量，但它们很难被工具进行静态分析，因此代码不应假设它们是可用的。相反，请使用 `import process from "node:process"`。

此规则在 Deno 2.8 中**默认关闭**。要启用它，请将其添加到你的
`deno.json` 中：

```json
{
  "lint": {
    "rules": {
      "include": ["no-process-global"]
    }
  }
}
```

**无效：**

```typescript
// foo.ts
const foo = process.env.FOO;
```

**有效：**

```typescript
// foo.ts
import process from "node:process";

const foo = process.env.FOO;
```