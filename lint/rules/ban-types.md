---
tags: [推荐]
---

禁止使用原始包装对象（例如 `String` 这个对象是 `string` 原始类型的包装），以及不明确的 `Function` 类型和误解的 `Object` 类型。

原始包装对象的使用情况非常少见，更多的情况是使用原始类型时出现错误。你也不能将原始包装对象赋值给原始类型，这会导致后续的类型问题。作为参考，[TypeScript 手册] 也表示我们不应使用这些包装对象。

[TypeScript 手册]: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#number-string-boolean-symbol-and-object

对于 `Function`，最好明确指定整个函数签名，而不是使用模糊的 `Function` 类型，这样不会给你提供函数的类型安全。

最后，`Object` 和 `{}` 意味着“任何非空值”，而不是“任何对象类型”。`object` 是表示“任何对象类型”的不错选择。

**无效：**

```typescript
let a: Boolean;
let b: String;
let c: Number;
let d: Symbol;
let e: Function;
let f: Object;
let g: {};
```

**有效：**

```typescript
let a: boolean;
let b: string;
let c: number;
let d: symbol;
let e: () => number;
let f: object;
let g: Record<string, never>;
```