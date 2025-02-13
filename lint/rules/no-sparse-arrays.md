---
tags: []
---

不允许稀疏数组。

稀疏数组是包含 _空槽_ 的数组，这些空槽可能被处理为 `undefined` 值，或者被数组方法跳过，这可能导致意想不到的行为：

```typescript
[1, , 2].join(); // => '1,,2'
[1, undefined, 2].join(); // => '1,,2'

[1, , 2].flatMap((item) => item); // => [1, 2]
[1, undefined, 2].flatMap((item) => item); // => [1, undefined, 2]
```

**无效：**

```typescript
const items = ["foo", , "bar"];
```

**有效：**

```typescript
const items = ["foo", "bar"];
```