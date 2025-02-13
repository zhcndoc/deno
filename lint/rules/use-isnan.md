---
tags: [推荐]
---

不允许与 `NaN` 进行比较。

因为 `NaN` 在 JavaScript 中是独特的，它不等于任何东西，包括它自己，所以与 `NaN` 的比较结果是令人困惑的：

- `NaN === NaN` 或 `NaN == NaN` 的结果为 `false`
- `NaN !== NaN` 或 `NaN != NaN` 的结果为 `true`

因此，这条规则要求使用 `isNaN()` 或 `Number.isNaN()` 来判断值是否为 `NaN`。

**无效示例：**

```typescript
if (foo == NaN) {
  // ...
}

if (foo != NaN) {
  // ...
}

switch (NaN) {
  case foo:
    // ...
}

switch (foo) {
  case NaN:
    // ...
}
```

**有效示例：**

```typescript
if (isNaN(foo)) {
  // ...
}

if (!isNaN(foo)) {
  // ...
}
```