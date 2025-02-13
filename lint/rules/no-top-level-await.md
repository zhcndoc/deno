---
tags: []
---

不允许使用顶级 await 表达式。

在通过 dnt 分发 CommonJS/UMD 时，无法使用顶级 await。

**无效示例：**

```typescript
await foo();
for await (item of items) {}
```

**有效示例：**

```typescript
async function foo() {
  await task();
}
async function bar() {
  for await (item of items) {}
}
```