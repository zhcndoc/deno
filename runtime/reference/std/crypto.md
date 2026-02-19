---
title: "@std/crypto"
description: "对 Web Crypto API 的扩展"
jsr: jsr:@std/crypto
pkg: crypto
version: 1.0.5
generated: true
stability: stable
---

<!-- 由 JSR 文档自动生成。请勿直接编辑。 -->

## 概览

<p>对
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" rel="nofollow">Web Crypto</a>
的扩展，支持更多加密 API，同时在可能时委托使用内置的 API。</p>

```js
import { crypto } from "@std/crypto/crypto";

const message = "Hello, Deno!";
const encoder = new TextEncoder();
const data = encoder.encode(message);

await crypto.subtle.digest("BLAKE3", data);
```

### 将其添加到你的项目

```sh
deno add jsr:@std/crypto
```

<a href="https://jsr.io/@std/crypto/doc" class="docs-cta jsr-cta">查看 @std/crypto 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 什么是 Web Crypto？

Web Crypto API 是一套标准的低级加密基本功能，支持在网页浏览器和类似 Deno 的环境中使用。它提供安全的方法用于哈希、加密、解密、签名和验证数据，适合需要保护敏感信息的场景。

## 为什么使用 @std/crypto？

该包提供了兼容 Web Crypto 的辅助工具和算法（例如 [BLAKE3](https://github.com/BLAKE3-team/BLAKE3/)），且 API 易于使用。适用场景包括：

- API 客户端和 SDK：签名/验证负载、计算请求校验和，或用 BLAKE3 生成缓存验证器（类似 ETag）。
- 命令行工具和构建系统：对文件和目录生成指纹，以用于缓存、构建产物完整性或变更检测。
- 边缘/无服务器应用：验证 webhook 和 JWT 部分，存储前对正文进行哈希，或进行常数时间密码比较。
- 数据管道：通过快速哈希去重二进制数据；根据内容生成稳定 ID。

## 示例

### 哈希

```ts
import { crypto } from "@std/crypto/crypto";

const data = new TextEncoder().encode("hello");
const hash = await crypto.subtle.digest("BLAKE3", data);
console.log(new Uint8Array(hash));
```

### 哈希转十六进制

```ts
import { crypto } from "@std/crypto/crypto";

const data = new TextEncoder().encode("hello");
const buf = await crypto.subtle.digest("BLAKE3", data);
console.log(new Uint8Array(buf).toHex()); // 例如 "ea..."
```

### 哈希文件（BLAKE3）

```ts
import { crypto } from "@std/crypto/crypto";

const file = await Deno.readFile("./README.md");
const buf = await crypto.subtle.digest("BLAKE3", file);
console.log(new Uint8Array(buf));
```

### 常数时间比较

```ts
import { crypto } from "@std/crypto/crypto";
import { timingSafeEqual } from "@std/crypto/timing-safe-equal";

const enc = new TextEncoder();
const a = new Uint8Array(
  await crypto.subtle.digest("BLAKE3", enc.encode("abc")),
);
const b = new Uint8Array(
  await crypto.subtle.digest("BLAKE3", enc.encode("abz")),
);

console.log(timingSafeEqual(a, b)); // false
```

### 同步哈希（脚本）

```ts
import { crypto } from "@std/crypto/crypto";

const data = new TextEncoder().encode("fast");
const buf = crypto.subtle.digestSync("BLAKE3", data);
console.log(new Uint8Array(buf));
```

### 随机字节

```ts
import { crypto } from "@std/crypto/crypto";

const iv = new Uint8Array(12);
crypto.getRandomValues(iv);
console.log(iv);
```

### AES-GCM 加密/解密（Web Crypto）

```ts
import { crypto } from "@std/crypto/crypto";

const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"],
);

const iv = crypto.getRandomValues(new Uint8Array(12));
const data = new TextEncoder().encode("secret message");

const ciphertext = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  data,
);
const plaintext = await crypto.subtle.decrypt(
  { name: "AES-GCM", iv },
  key,
  ciphertext,
);

console.log(new TextDecoder().decode(new Uint8Array(plaintext))); // "secret message"
```

## 小贴士

- 优先使用 Web Crypto 提供的基础功能；避免自行实现加密算法。
- 使用 `TextEncoder` 对输入编码，并用字节或十六进制比较结果。

<!-- custom:end -->
