---
tags: []
---

要求 TODO 注释必须带有用户标签（`@user`）或问题引用（`#issue`）。

没有用户或问题引用的 TODO 注释会变得陈旧，并且没有简单的方法来获取更多信息。

**无效示例：**

```typescript
// TODO 改进计算引擎
export function calcValue(): number {}
```

```typescript
// TODO 改进计算引擎 (@djones)
export function calcValue(): number {}
```

```typescript
// TODO 改进计算引擎 (#332)
export function calcValue(): number {}
```

**有效示例：**

```typescript
// TODO(djones) 改进计算引擎
export function calcValue(): number {}
```

```typescript
// TODO(@djones) 改进计算引擎
export function calcValue(): number {}
```

```typescript
// TODO(#332)
export function calcValue(): number {}
```

```typescript
// TODO(#332) 改进计算引擎
export function calcValue(): number {}
```