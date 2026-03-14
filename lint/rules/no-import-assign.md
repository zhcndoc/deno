---
tags: [推荐]
---

禁止重新分配导入模块绑定。

ES 模块导入绑定应被视为只读，因为在代码执行期间修改它们可能会导致运行时错误。这也会导致代码可读性差和维护困难。

**无效示例：**

```typescript
import defaultMod, { namedMod } from "./mod.js";
import * as modNameSpace from "./mod2.js";

defaultMod = 0;
namedMod = true;
modNameSpace.someExportedMember = "hello";
modNameSpace = {};
```

**有效示例：**

```typescript
import defaultMod, { namedMod } from "./mod.js";
import * as modNameSpace from "./mod2.js";

// 绑定导入的属性可以被设置
defaultMod.prop = 1;
namedMod.prop = true;
modNameSpace.someExportedMember.prop = "hello";
```