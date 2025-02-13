---
tags: [推荐]
---

禁止将否定运算符 `!` 作为关系运算符的左操作数。

出现在以下运算符左操作数中的 `!` 运算符有时会由于运算符优先级而导致意外行为：

- `in` 运算符
- `instanceof` 运算符

例如，当开发者编写代码 `!key in someObject` 时，他们最有可能希望它的行为与 `!(key in someObject)` 一致，但实际上它表现得像 `(!key) in someObject`。这个 lint 规则会警告这种 `!` 运算符的使用，以减少混淆。

**无效：**

<!-- deno-fmt-ignore -->

```typescript
if (!key in object) {}
if (!foo instanceof Foo) {}
```

**有效：**

```typescript
if (!(key in object)) {}
if (!(foo instanceof Foo)) {}
if ((!key) in object) {}
if ((!foo) instanceof Foo) {}
```