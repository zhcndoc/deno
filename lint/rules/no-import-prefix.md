---
tags: [workspace]
---

确保所有依赖项都在 `deno.json` 或 `package.json` 中声明。

### 无效示例：

```ts
import foo from "https://deno.land/std/path/mod.ts";
import foo from "jsr:@std/path@1";
import foo from "npm:preact@10";
```

### 有效示例：

```ts
// 在 `deno.json` 或 `package.json` 中映射
import foo from "@std/path";
```