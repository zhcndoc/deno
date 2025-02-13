---
tags: [推荐]
---

禁止使用 `any` 类型。

使用 `any` 类型会禁用该变量周围的类型检查系统，违背了 TypeScript 提供类型安全代码的目的。此外，使用 `any` 会降低代码的可读性，因为不容易立即理解所引用的值是什么类型。对于所有类型，最好做到明确。对于无法选择更具体类型的情况，可以使用 `unknown` 作为 `any` 的更安全的替代方案。

**无效的示例：**

```typescript
const someNumber: any = "two";
function foo(): any {
  return undefined;
}
```

**有效的示例：**

```typescript
const someNumber: string = "two";
function foo(): undefined {
  return undefined;
}
```