---
tags: [recommended]
---

不允许在类中一个成员函数名使用多次。

在一个类中声明同名的函数两次会导致之前的声明被覆盖，从而造成意想不到的行为。

**无效:**

```typescript
class Foo {
  bar() {}
  bar() {}
}
```

**有效:**

```typescript
class Foo {
  bar() {}
  fizz() {}
}
```