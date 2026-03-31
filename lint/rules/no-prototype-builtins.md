---
tags: [推荐]
---

不允许直接使用 `Object.prototype` 的内置方法。

如果通过 `Object.create(null)` 创建对象，则这些对象没有指定原型。这可能会导致运行时错误，因为你假设对象具有来自 `Object.prototype` 的属性，并尝试调用以下方法：

- `hasOwnProperty`
- `isPrototypeOf`
- `propertyIsEnumerable`

因此，始终建议显式地从 `Object.prototype` 调用这些方法。

**无效示例：**

```typescript
const a = foo.hasOwnProperty("bar");
const b = foo.isPrototypeOf("bar");
const c = foo.propertyIsEnumerable("bar");
```

**有效示例：**

```typescript
const a = Object.prototype.hasOwnProperty.call(foo, "bar");
const b = Object.prototype.isPrototypeOf.call(foo, "bar");
const c = Object.prototype.propertyIsEnumerable.call(foo, "bar");
```