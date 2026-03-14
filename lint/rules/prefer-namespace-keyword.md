---
tags: [推荐]
---

建议在声明 TypeScript 模块时使用 `namespace` 关键字而不是 `module` 关键字。

TypeScript 支持 `module` 关键字用于组织代码，但这种表述可能会导致与 ECMAScript 模块的混淆。从 TypeScript v1.5 开始，它为我们提供了替代关键字 `namespace`，鼓励我们在编写 TypeScript 时始终使用 `namespace`。更多细节请参见 [TypeScript v1.5 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-5.html#namespace-keyword)。

**无效：**

```typescript
module modA {}

declare module modB {}
```

**有效：**

```typescript
namespace modA {}

// 允许使用 "ambient modules"
// https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules
declare module "modB";
declare module "modC" {}
```