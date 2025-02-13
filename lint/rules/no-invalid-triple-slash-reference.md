---
tags: [recommended]
---

警告三斜杠引用指令的错误用法。

Deno 支持 `types`、`path`、`lib` 和 `no-default-lib` 的三斜杠引用指令。此 lint 规则检查是否存在无效或格式不正确的指令，因为这很可能是一个错误。

此外，请注意，仅允许在 JavaScript 文件中使用 `types` 指令。该指令用于告诉 TypeScript 编译器与某个 JavaScript 文件对应的类型定义文件的位置。然而，即使在 v1.10 之前的 Deno 手册中（例如 [v1.9.2]），也有错误的说法称在这种情况下应该使用 `path` 指令。实际上，应该使用 `types` 指令。有关更多细节，请参阅 [最新手册]。因此，该规则还会检测在 JavaScript 文件中使用 `types` 以外的指令，并建议将其替换为 `types` 指令。

[v1.9.2]: https://deno.land/manual@v1.9.2/typescript/types#using-the-triple-slash-reference-directive  
[最新手册]: https://deno.land/manual/typescript/types#using-the-triple-slash-reference-directive

**无效：**

_JavaScript_

```javascript
/// <reference path="./mod.d.ts" />
/// <reference no-default-lib="true" />
/// <reference foo="bar" />

// ... 剩余的 JavaScript ...
```

_TypeScript_

```typescript
/// <reference foo="bar" />

// ... 剩余的 TypeScript ...
```

**有效：**

_JavaScript_

```javascript
/// <reference types="./mod.d.ts" />
/// <reference lib="es2017.string" />

// ... 剩余的 JavaScript ...
```

_TypeScript_

```typescript
/// <reference types="./mod.d.ts" />
/// <reference path="./mod.d.ts" />
/// <reference lib="es2017.string" />
/// <reference no-default-lib="true" />

// ... 剩余的 TypeScript ...
```