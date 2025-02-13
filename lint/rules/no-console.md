---
tags: []
---

不允许使用 `console` 全局对象。

开发人员通常会意外地提交 `console.log` / `console.error` 语句，这些语句特别是在调试之后留下。此外，在代码中使用这些语句可能会泄露敏感信息到输出中或使控制台充满不必要的信息。此规则通过不允许使用 `console` 来帮助维护干净和安全的代码。

此规则在库中尤其有用，因为你几乎从不想将信息输出到控制台。

**无效:**

```typescript
console.log("调试信息");
console.error("调试信息");
console.debug(obj);

if (debug) console.log("调试中");

function log() {
  console.log("日志");
}
```

**有效:**

对于任何实际想要使用控制台的调用，建议通过 `deno-lint-ignore` 注释显式启用控制台。

```typescript
function logWarning(message: string) {
  // deno-lint-ignore no-console
  console.warn(message);
}
```