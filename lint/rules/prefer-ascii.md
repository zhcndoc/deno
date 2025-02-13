---
tags: []
---

确保代码完全使用 ASCII 字符编写。

V8，Deno 依赖的 JavaScript 引擎，提供了一种方法，使字符串在 V8 的堆外分配内存。特别是，如果字符串只由单字节字符组成，V8 可以通过 [`v8::String::ExternalOneByteStringResource`] 更有效地处理它们。为了在 Deno 的内部利用这个 V8 特性，这条规则检查代码中的所有字符是否为 ASCII。

[`v8::String::ExternalOneByteStringResource`]: https://v8.github.io/api/head/classv8_1_1String_1_1ExternalOneByteStringResource.html

也就是说，您可以将此 lint 规则用于 Deno 的内部 JavaScript 代码之外的其他用途。如果您想确保代码库仅由 ASCII 字符组成（例如，出于某种原因想要禁止非 ASCII 标识符），那么这条规则将非常有帮助。

**无效：**

```typescript
const π = Math.PI;

// 字符串文字也会被检查
const ninja = "🥷";

function こんにちは(名前: string) {
  console.log(`こんにちは、${名前}さん`);
}

// “注释”也会被检查
// ^        ^
// |        U+201D
// U+201C
```

**有效：**

```typescript
const pi = Math.PI;

const ninja = "ninja";

function hello(name: string) {
  console.log(`Hello, ${name}`);
}

// "注释"也会被检查
```