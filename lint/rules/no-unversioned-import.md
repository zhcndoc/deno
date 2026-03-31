---
tags: [recommended]
---

确保内联依赖导入包含版本号。

### 不正确示例：

```ts
import foo from "npm:chalk";
import foo from "jsr:@std/path";
```

### 正确示例：

```ts
import foo from "npm:chalk@5.3.0";
import foo from "npm:chalk@^5.3.0";
import foo from "jsr:@std/path@1.0.8";
import foo from "jsr:@std/path@^1.0.8";
```