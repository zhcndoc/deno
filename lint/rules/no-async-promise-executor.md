---
tags: [推荐]
---

要求不使用 async promise 执行器函数。

Promise 构造函数将一个执行器函数作为参数，该函数具有 `resolve` 和
`reject` 参数，可以用于控制创建的 Promise 的状态。这个函数可以是 async，但出于几个原因，通常不推荐这样做：

- 如果 async 执行器函数抛出错误，错误将会丢失，并且不会导致新构造的 Promise 被拒绝。这可能使得调试和处理某些错误变得困难。
- 如果一个 async Promise 执行器函数正在使用 await，那么这通常表明实际上并不需要使用新的 Promise 构造函数，可以重构代码以避免使用 Promise，或者可以缩小新的 Promise 构造函数的作用域，将 async 代码提取出来并改为同步执行。

**无效：**

```typescript
new Promise(async function (resolve, reject) {});
new Promise(async (resolve, reject) => {});
```

**有效：**

```typescript
new Promise(function (resolve, reject) {});
new Promise((resolve, reject) => {});
```