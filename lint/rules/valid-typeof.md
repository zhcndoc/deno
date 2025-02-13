---
tags: [recommended]
---

将 `typeof` 运算符的使用限制为一组特定的字符串字面量。

当与一个值一起使用时，`typeof` 运算符返回以下字符串之一：

- `"undefined"`
- `"object"`
- `"boolean"`
- `"number"`
- `"string"`
- `"function"`
- `"symbol"`
- `"bigint"`

此规则不允许在使用 `typeof` 运算符时与除这些字符串字面量之外的任何内容进行比较，因为这很可能表示字符串中的打字错误。该规则还不允许将 `typeof` 操作的结果与任何非字符串字面量值进行比较，例如 `undefined`，这可能表示错误地使用了关键字而不是字符串。这也包括与字符串变量进行比较，即使它们包含上述值之一，因为这无法得到保证。对此的例外是比较两个 `typeof` 操作的结果，因为这些都保证返回上述字符串之一。

**无效：**

```typescript
// 打字错误
typeof foo === "strnig";
typeof foo == "undefimed";
typeof bar != "nunber";
typeof bar !== "fucntion";

// 与非字符串字面量比较
typeof foo === undefined;
typeof bar == Object;
typeof baz === anotherVariable;
typeof foo == 5;
```

**有效：**

```typescript
typeof foo === "undefined";
typeof bar == "object";
typeof baz === "string";
typeof bar === typeof qux;
```