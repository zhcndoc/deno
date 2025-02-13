---
tags: [推荐]
---

禁止通过 `window` 对象使用 Web APIs。

在大多数情况下，全局变量 `window` 如同 `globalThis`。例如，你可以像 `window.fetch(..)` 这样调用 `fetch` API，而不是使用 `fetch(..)` 或 `globalThis.fetch(..)`。然而，在 Web Workers 中，`window` 是不可用的，而是可以使用 `self`、`globalThis`，或者不使用任何前缀。因此，为了在 Web Workers 和其他上下文之间实现兼容，强烈建议不要通过 `window` 访问全局属性。

一些 API，包括 `window.alert`、`window.location` 和 `window.history`，可以用 `window` 来调用，因为这些 API 在 Workers 中不被支持或有不同的含义。换句话说，这个 lint 规则只会对完全可以用 `self`、`globalThis` 或不使用前缀来替代的 `window` 使用进行投诉。

**无效：**

```typescript
const a = await window.fetch("https://deno.land");

const b = window.Deno.metrics();
```

**有效：**

```typescript
const a1 = await fetch("https://deno.land");
const a2 = await globalThis.fetch("https://deno.land");
const a3 = await self.fetch("https://deno.land");

const b1 = Deno.metrics();
const b2 = globalThis.Deno.metrics();
const b3 = self.Deno.metrics();

// `alert` 允许使用 `window` 调用，因为它在 Workers 中不被支持
window.alert("🍣");

// `location` 也被允许
window.location.host;
```