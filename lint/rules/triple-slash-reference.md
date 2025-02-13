---
tags: []
---

禁止使用某些三斜杠指令，优先使用 ES6 风格导入声明。

TypeScript 的 `///` 三斜杠引用是一种指示其他模块的类型在文件中可用的方法。一般不鼓励使用三斜杠引用类型指令，优先使用 ECMAScript 模块导入。该规则报告使用 `/// <reference path="..." />`、`/// <reference types="..." />` 或 `/// <reference lib="..." />` 指令的情况。

**无效：**

```typescript
/// <reference types="foo" />
import * as foo from "foo";
```

**有效：**

```typescript
import * as foo from "foo";
```