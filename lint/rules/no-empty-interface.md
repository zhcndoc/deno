---
tags: [推荐]
---

不允许声明空接口。

一个没有成员的接口没有任何意义。此规则将捕获这些情况，视为不必要的代码或错误的空实现。

**无效：**

```typescript
interface Foo {}
```

**有效：**

```typescript
interface Foo {
  name: string;
}

interface Bar {
  age: number;
}

// 使用至少有一个扩展的空接口是允许的。

// 使用空接口将 Baz 的身份从类型更改为接口。
type Baz = { profession: string };
interface Foo extends Baz {}

// 使用空接口扩展已经存在的 Foo 声明
// 以及 Bar 接口的成员
interface Foo extends Bar {}

// 使用空接口作为联合类型
interface Baz extends Foo, Bar {}
```