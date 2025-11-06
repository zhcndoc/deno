---
title: "@std/html"
description: "用于 HTML 的函数，例如转义或反转义 HTML 实体"
jsr: jsr:@std/html
pkg: html
version: 1.0.5
generated: true
stability: stable
---

<!-- 通过 JSR 文档自动生成。请勿直接编辑。 -->

## 概述

<p>用于 HTML 任务的函数，例如转义或反转义 HTML 实体。</p>

```js
import { unescape } from "@std/html/entities";
import { assertEquals } from "@std/assert";

assertEquals(unescape("&lt;&gt;'&amp;AA"), "<>'&AA");
assertEquals(unescape("&thorn;&eth;"), "&thorn;&eth;");
```

### 添加到你的项目

```sh
deno add jsr:@std/html
```

<a href="https://jsr.io/@std/html/doc" class="docs-cta jsr-cta">查看 @std/html 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 这个包是什么？

一个实用库，用于安全地转义和反转义 HTML 实体，以防止在将用户提供的内容插入 HTML 时发生 XSS 漏洞。

## 为什么使用 @std/html？

你的应用可能需要在 HTML 中显示用户生成的内容。为了防止跨站脚本攻击 (XSS)，在将用户输入嵌入 HTML 之前，关键在于转义诸如 `<`、`>`、`&`、`"` 和 `'` 等特殊字符。

## 示例

```ts
import { escape, unescape } from "@std/html/entities";

const safe = escape(`<img src=x onerror=alert(1)>`); // &lt;img src=x onerror=alert(1)&gt;
const back = unescape("&amp;lt;b&amp;gt;ok&amp;lt;/b&amp;gt;"); // <b>ok</b>
```

## 提示

- 转义和反转义仅针对实体，不是完整的 HTML 消毒。若需移除标签/属性，请使用消毒器。
- 转义操作是幂等的；避免重复转义（例如 `&amp;amp;`）。

<!-- custom:end -->