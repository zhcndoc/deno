---
tags: [推荐]
---

需要将 `deno-lint-ignore` 注解与一个或多个规则名称。

忽略所有规则可能会掩盖意外或未来的问题。因此，您需要明确指定要忽略的规则。

**无效:**

```typescript
// deno-lint-ignore
export function duplicateArgumentsFn(a, b, a) {}
```

**有效:**

```typescript
// deno-lint-ignore no-dupe-args
export function duplicateArgumentsFn(a, b, a) {}
```