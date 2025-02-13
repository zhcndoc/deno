---
tags: []
---

要求所有模块导出具备完全类型声明。

具备完全类型的函数参数和返回值清晰地定义了模块的输入和输出（称为模块边界）。这将使任何使用该模块的用户能够以类型安全的方式明确如何提供输入和处理输出。

**无效：**

```typescript
// 缺少返回类型（例如 void）
export function printDoc(doc: string, doubleSided: boolean) {
  return;
}

// 缺少参数类型（例如 `arg` 是字符串类型）
export const arrowFn = (arg): string => `hello ${arg}`;

// 缺少返回类型（例如 boolean）
export function isValid() {
  return true;
}
```

**有效：**

```typescript
// 带有类型的输入参数和返回值
export function printDoc(doc: string, doubleSided: boolean): void {
  return;
}

// 输入类型为字符串，返回值类型为字符串
export const arrowFn = (arg: string): string => `hello ${arg}`;

// 尽管缺少返回类型，但这仍然有效，因为它没有被导出
function isValid() {
  return true;
}
```