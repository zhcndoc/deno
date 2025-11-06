---
title: "@std/front-matter"
description: "从字符串中提取 front matter"
jsr: jsr:@std/front-matter
pkg: front-matter
version: 1.0.9
generated: true
stability: stable
---

<!-- 自动生成自 JSR 文档。请勿直接编辑。 -->

## 概览

<p>从字符串中提取
<a href="https://daily-dev-tips.com/posts/what-exactly-is-frontmatter/" rel="nofollow">front matter</a>。
改编自
<a href="https://github.com/jxson/front-matter/blob/36f139ef797bd9e5196a9ede03ef481d7fbca18e/index.js" rel="nofollow">jxson/front-matter</a>。</p>
<h2 id="supported-formats">
支持的格式</h2>
<h3 id="json">
JSON</h3>

```js
import { extractJson, test } from "@std/front-matter";
import { assertEquals } from "@std/assert";

const str = '---json\n{"and": "this"}\n---\ndeno is awesome';

assertEquals(test(str), true);
assertEquals(extractJson(str), {
  frontMatter: '{"and": "this"}',
  body: "deno is awesome",
  attrs: { and: "this" },
});
```

<p><a href="https://jsr.io/@std/front-matter@1.0.9/doc/~/extractJson" rel="nofollow"><code>extract</code></a> 和 <a href="https://jsr.io/@std/front-matter@1.0.9/doc/~/test" rel="nofollow"><code>test</code></a> 支持以下
分隔符。</p>

```js
---json
{
  "and": "this"
}
---
```

```js
{
  "is": "JSON"
}
```

<h3 id="toml">
TOML</h3>

```js
import { extractToml, test } from "@std/front-matter";
import { assertEquals } from "@std/assert";

const str = "---toml\nmodule = 'front_matter'\n---\ndeno is awesome";

assertEquals(test(str), true);
assertEquals(extractToml(str), {
  frontMatter: "module = 'front_matter'",
  body: "deno is awesome",
  attrs: { module: "front_matter" },
});
```

<p><a href="https://jsr.io/@std/front-matter@1.0.9/doc/~/extractToml" rel="nofollow"><code>extract</code></a> 和 <a href="https://jsr.io/@std/front-matter@1.0.9/doc/~/test" rel="nofollow"><code>test</code></a> 支持以下
分隔符。</p>

```js
---toml
this = 'is'
---
```

```js
= toml =
parsed = 'as'
toml = 'data'
= toml =
```

```js
+++
is = 'that'
not = 'cool?'
+++
```

<h3 id="yaml">
YAML</h3>

```js
import { extractYaml, test } from "@std/front-matter";
import { assertEquals } from "@std/assert";

const str = "---yaml\nmodule: front_matter\n---\ndeno is awesome";

assertEquals(test(str), true);
assertEquals(extractYaml(str), {
  frontMatter: "module: front_matter",
  body: "deno is awesome",
  attrs: { module: "front_matter" },
});
```

<p><a href="https://jsr.io/@std/front-matter@1.0.9/doc/~/extractYaml" rel="nofollow"><code>extract</code></a> 和 <a href="https://jsr.io/@std/front-matter@1.0.9/doc/~/test" rel="nofollow"><code>test</code></a> 支持以下
分隔符。</p>

```js
---
these: are
---
```

```js
---yaml
all: recognized
---
```

```js
= yaml =
as: yaml
= yaml =
```

### 添加到你的项目

```sh
deno add jsr:@std/front-matter
```

<a href="https://jsr.io/@std/front-matter/doc" class="docs-cta jsr-cta">查看 @std/front-matter 中的全部符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 什么是 front matter？

Front matter 是放置在文件顶部的元数据，通常用于 Markdown 或其他文本文件中，提供关于文档的信息。它通常被特定的分隔符包围，例如 YAML 使用 `---`，TOML 使用 `+++`，JSON 使用 `---json`。元数据可以包括标题、作者、日期、标签等描述文件内容的属性。

## 为什么使用 @std/front-matter？

使用此包可以轻松解析和提取内容文件中的 front matter，允许你将元数据与正文内容分离。这对于静态网站生成器、博客平台和内容管理系统尤为有用，这些场景中 front matter 通常用于管理文档元数据。

## 示例

```ts
// 检测并提取 YAML front matter
import { extractYaml, test } from "@std/front-matter";

const source = `---yaml\ntitle: Hello\nauthor: Ada\n---\nContent starts here.`;

if (test(source)) {
  const { attrs, body, frontMatter } = extractYaml(source);
  // attrs: { title: "Hello", author: "Ada" }
  // body: "Content starts here."
  // frontMatter: "title: Hello\nauthor: Ada"
}
```

```ts
// JSON front matter
import { extractJson } from "@std/front-matter";

const jsonSource = `---json\n{ "tags": ["news", "deno"] }\n---\nPost body`;
const { attrs } = extractJson(jsonSource);
// attrs: { tags: ["news", "deno"] }
```

```ts
// TOML front matter
import { extractToml } from "@std/front-matter";

const tomlSource = `+++\ncategory = 'release'\n+++\nNotes...`;
const { attrs, body } = extractToml(tomlSource);
// attrs: { category: "release" }
// body: "Notes..."
```

## 小贴士

- 支持 JSON、TOML 和 YAML 分隔符——选择一种并保持一致性。
- 返回的 `attrs` 已为你解析；`body` 是剩余的内容。

<!-- custom:end -->