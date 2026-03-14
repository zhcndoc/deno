---
tags: [recommended]
---

禁止未使用的标签。

声明但从未使用的标签很可能是开发者的错误。如果该标签是打算使用的，那么请编写代码以便使用它。否则，请删除该标签。

**无效：**

```typescript
LABEL1:
while (true) {
  console.log(42);
}

LABEL2:
for (let i = 0; i < 5; i++) {
  console.log(42);
}

LABEL3:
for (const x of xs) {
  console.log(x);
}
```

**有效：**

```typescript
LABEL1:
while (true) {
  console.log(42);
  break LABEL1;
}

LABEL2:
for (let i = 0; i < 5; i++) {
  console.log(42);
  continue LABEL2;
}

for (const x of xs) {
  console.log(x);
}
```