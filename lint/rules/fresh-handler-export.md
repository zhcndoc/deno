---
tags: [fresh]
---

检查命名是否正确，适用于命名的 fresh 中间件导出。

`routes/` 文件夹中的文件可以导出在任何渲染之前运行的中间件。它们应该作为名为 `handler` 的命名导出提供。此规则检查何时导出被错误地命名为 `handlers` 而不是 `handler`。

**无效：**

```js
export const handlers = {
  GET() {},
  POST() {},
};
export function handlers() {}
export async function handlers() {}
```

**有效：**

```jsx
export const handler = {
  GET() {},
  POST() {},
};
export function handler() {}
export async function handler() {}
```