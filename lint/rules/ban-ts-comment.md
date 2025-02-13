---
tags: [推荐]
---

不允许在没有注释的情况下使用 Typescript 指令。

Typescript 指令降低了编译器的有效性，这种情况应仅在特殊情况下使用。原因应在指令旁边通过注释进行说明。

**无效：**

```typescript
// @ts-expect-error
let a: number = "I am a string";
```

```typescript
// @ts-ignore
let a: number = "I am a string";
```

```typescript
// @ts-nocheck
let a: number = "I am a string";
```

**有效：**

```typescript
// @ts-expect-error: 临时解决方案（请参见票据 #422）
let a: number = "I am a string";
```

```typescript
// @ts-ignore: 临时解决方案（请参见票据 #422）
let a: number = "I am a string";
```

```typescript
// @ts-nocheck: 临时解决方案（请参见票据 #422）
let a: number = "I am a string";
```