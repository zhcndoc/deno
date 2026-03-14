---
tags: [推荐]
---

禁止使用空的块语句。

空的块语句是合法的，但通常表示某些内容被遗漏，从而可能降低代码的可读性。此规则忽略仅包含注释的块语句。此规则也忽略空的构造函数和函数体（包括箭头函数）。

**无效：**

```typescript
if (foo) {}

while (foo) {}

switch (foo) {}

try {
  doSomething();
} catch (e) {
} finally {
}
```

**有效：**

```typescript
if (foo) {
  // 空
}

while (foo) {
  /* 空 */
}

try {
  doSomething();
} catch (e) {
  // 无论错误如何，继续
}

try {
  doSomething();
} finally {
  /* 无论错误如何，继续 */
}
```