---
tags: [workspace]
---

确保所有依赖项都在 `deno.json` 或 `package.json` 中声明。

这有助于更好地管理依赖项，并更容易跟踪和更新依赖项。当移除依赖项时，这也有助于 Deno 清理锁定文件。

### 无效示例：

```ts
import foo from "https://deno.land/std/path/mod.ts";
import foo from "jsr:@std/path@1";
import foo from "npm:preact@10";
```

### 有效示例：

```ts
import foo from "@std/path";
```

在 `deno.json` 或 `package.json` 文件中有相应的条目：

```jsonc title="deno.json"
{
  "imports": {
    "@std/path": "jsr:@std/path@1"
  }
}
```
