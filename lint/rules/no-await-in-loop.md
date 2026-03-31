---
tags: []
---

在 for 循环体中未使用 `await`。

Async 和 await 在 Javascript 中用于提供并行执行。如果在 for 循环中的每个元素都使用 `await` 进行等待，那么这就 negates 了使用 async/await 的好处，因为在当前元素完成之前，循环中的其他元素无法被处理。

一种常见的解决方案是重构代码，使循环体异步运行并捕获生成的 promises。循环结束后，可以一次性 await 所有的 promises。

**无效示例：**

```javascript
async function doSomething(items) {
  const results = [];
  for (const item of items) {
    // 数组中的每个项都在等待前一个项完成
    results.push(await someAsyncProcessing(item));
  }
  return processResults(results);
}
```

**有效示例：**

```javascript
async function doSomething(items) {
  const results = [];
  for (const item of items) {
    // 异步启动所有项的处理...
    results.push(someAsyncProcessing(item));
  }
  // ...然后在循环后等待它们完成
  return processResults(await Promise.all(results));
}
```