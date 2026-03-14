---
tags: [推荐]
---

强制在模块说明符中指定显式路径引用。

非显式说明符是模糊的，需要在每次运行时查找正确的文件路径，这会带来性能开销。

注意：此 lint 规则仅在使用 `--unstable-sloppy-imports` 时激活。

### 无效示例：

```typescript
import { add } from "./math/add";
import { ConsoleLogger } from "./loggers";
```

### 有效示例：

```typescript
import { add } from "./math/add.ts";
import { ConsoleLogger } from "./loggers/index.ts";
```