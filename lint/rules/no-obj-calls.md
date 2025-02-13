---
tags: [推荐]
---

禁止像函数一样调用内置全局对象。

以下内置对象即使看起来像构造函数，也不应该被当作函数调用：

- `Math`
- `JSON`
- `Reflect`
- `Atomics`

将这些对象作为函数调用会导致运行时错误。此规则静态地防止了这种错误使用。

**无效的：**

```typescript
const math = Math();
const newMath = new Math();

const json = JSON();
const newJSON = new JSON();

const reflect = Reflect();
const newReflect = new Reflect();

const atomics = Atomics();
const newAtomics = new Atomics();
```

**有效的：**

```typescript
const area = (radius: number): number => Math.PI * radius * radius;

const parsed = JSON.parse("{ foo: 42 }");

const x = Reflect.get({ x: 1, y: 2 }, "x");

const first = Atomics.load(foo, 0);
```