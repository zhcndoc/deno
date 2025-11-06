---
title: "@std/path"
description: "用于处理文件系统路径的实用程序"
jsr: jsr:@std/path
pkg: path
version: 1.1.2
generated: true
stability: stable
---

<!-- 自动从 JSR 文档生成。请勿直接编辑。 -->

## 概述

<p>用于处理操作系统特定文件路径的实用工具。</p>
<p>此模块中的函数会自动切换以支持当前操作系统的路径风格，
Microsoft Windows 使用 <code>windows</code> 风格，其它操作系统如 Linux、MacOS、BSD 等使用 <code>posix</code> 风格。</p>
<p>若想使用特定路径风格的函数，且不考虑当前操作系统，
请从 platform 子目录下导入相应模块。</p>
<h2 id="basic-path-operations">
基本路径操作</h2>

```js
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

// 获取路径组成部分
if (Deno.build.os === "windows") {
  assertEquals(path.basename("C:\\Users\\user\\file.txt"), "file.txt");
  assertEquals(path.dirname("C:\\Users\\user\\file.txt"), "C:\\Users\\user");
  assertEquals(path.extname("C:\\Users\\user\\file.txt"), ".txt");
} else {
  assertEquals(path.basename("/home/user/file.txt"), "file.txt");
  assertEquals(path.dirname("/home/user/file.txt"), "/home/user");
  assertEquals(path.extname("/home/user/file.txt"), ".txt");
}

// 拼接路径片段
if (Deno.build.os === "windows") {
  assertEquals(
    path.join("C:\\", "Users", "docs", "file.txt"),
    "C:\\Users\\docs\\file.txt",
  );
} else {
  assertEquals(
    path.join("/home", "user", "docs", "file.txt"),
    "/home/user/docs/file.txt",
  );
}

// 规范化路径
if (Deno.build.os === "windows") {
  assertEquals(
    path.normalize("C:\\Users\\user\\..\\temp\\.\\file.txt"),
    "C:\\Users\\temp\\file.txt",
  );
} else {
  assertEquals(
    path.normalize("/home/user/../temp/./file.txt"),
    "/home/temp/file.txt",
  );
}

// 解析绝对路径
if (Deno.build.os === "windows") {
  const resolved = path.resolve("C:\\foo", "docs", "file.txt");
  assertEquals(resolved, "C:\\foo\\docs\\file.txt");
  assertEquals(path.isAbsolute(resolved), true);
} else {
  const resolved = path.resolve("/foo", "docs", "file.txt");
  assertEquals(resolved, "/foo/docs/file.txt");
  assertEquals(path.isAbsolute(resolved), true);
}

// 获取相对路径
if (Deno.build.os === "windows") {
  assertEquals(
    path.relative("C:\\Users", "C:\\Users\\docs\\file.txt"),
    "docs\\file.txt",
  );
  assertEquals(path.relative("C:\\Users", "D:\\Programs"), "D:\\Programs");
} else {
  assertEquals(
    path.relative("/home/user", "/home/user/docs/file.txt"),
    "docs/file.txt",
  );
  assertEquals(path.relative("/home/user", "/var/data"), "../../var/data");
}
```

<h2 id="path-parsing-and-formatting">
路径解析与格式化</h2>

```js
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

if (Deno.build.os === "windows") {
  const parsedWindows = path.parse("C:\\Users\\user\\file.txt");
  assertEquals(parsedWindows.root, "C:\\");
  assertEquals(parsedWindows.dir, "C:\\Users\\user");
  assertEquals(parsedWindows.base, "file.txt");
  assertEquals(parsedWindows.ext, ".txt");
  assertEquals(parsedWindows.name, "file");

  // 从路径组成部分格式化路径（Windows）
  assertEquals(
    path.format({ dir: "C:\\Users\\user", base: "file.txt" }),
    "C:\\Users\\user\\file.txt",
  );
} else {
  const parsedPosix = path.parse("/home/user/file.txt");
  assertEquals(parsedPosix.root, "/");
  assertEquals(parsedPosix.dir, "/home/user");
  assertEquals(parsedPosix.base, "file.txt");
  assertEquals(parsedPosix.ext, ".txt");
  assertEquals(parsedPosix.name, "file");

  // 从路径组成部分格式化路径（POSIX）
  assertEquals(
    path.format({ dir: "/home/user", base: "file.txt" }),
    "/home/user/file.txt",
  );
}
```

<h2 id="url-conversion">
URL 转换</h2>

```js
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

// 在文件 URL 和路径之间转换
if (Deno.build.os === "windows") {
  assertEquals(
    path.fromFileUrl("file:///C:/Users/user/file.txt"),
    "C:\\Users\\user\\file.txt",
  );
  assertEquals(
    path.toFileUrl("C:\\Users\\user\\file.txt").href,
    "file:///C:/Users/user/file.txt",
  );
} else {
  assertEquals(
    path.fromFileUrl("file:///home/user/file.txt"),
    "/home/user/file.txt",
  );
  assertEquals(
    path.toFileUrl("/home/user/file.txt").href,
    "file:///home/user/file.txt",
  );
}
```

<h2 id="path-properties">
路径属性</h2>

```js
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

// 检查路径是否为绝对路径
if (Deno.build.os === "windows") {
  assertEquals(path.isAbsolute("C:\\Users"), true);
  assertEquals(path.isAbsolute("\\\\Server\\share"), true);
  assertEquals(path.isAbsolute("C:relative\\path"), false);
  assertEquals(path.isAbsolute("..\\relative\\path"), false);
} else {
  assertEquals(path.isAbsolute("/home/user"), true);
  assertEquals(path.isAbsolute("./relative/path"), false);
  assertEquals(path.isAbsolute("../relative/path"), false);
}

// 转换为命名空间路径（仅 Windows 特有）
if (Deno.build.os === "windows") {
  assertEquals(
    path.toNamespacedPath("C:\\Users\\file.txt"),
    "\\\\?\\C:\\Users\\file.txt",
  );
  assertEquals(
    path.toNamespacedPath("\\\\server\\share\\file.txt"),
    "\\\\?\\UNC\\server\\share\\file.txt",
  );
} else {
  // 在 POSIX 上，toNamespacedPath 返回原路径不变
  assertEquals(
    path.toNamespacedPath("/home/user/file.txt"),
    "/home/user/file.txt",
  );
}
```

<h2 id="glob-pattern-utilities">
Glob 模式工具</h2>

```js
import * as path from "@std/path";
import { assertEquals } from "@std/assert";

// 检查字符串是否为 Glob 模式
assertEquals(path.isGlob("*.txt"), true);

// 将 Glob 模式转换为正则表达式
const pattern = path.globToRegExp("*.txt");
assertEquals(pattern.test("file.txt"), true);

// 拼接多个 Glob 模式
if (Deno.build.os === "windows") {
  assertEquals(path.joinGlobs(["src", "**\\*.ts"]), "src\\**\\*.ts");
} else {
  assertEquals(path.joinGlobs(["src", "**/*.ts"]), "src/**/*.ts");
}

// 规范化 Glob 模式
if (Deno.build.os === "windows") {
  assertEquals(path.normalizeGlob("src\\..\\**\\*.ts"), "**\\*.ts");
} else {
  assertEquals(path.normalizeGlob("src/../**/*.ts"), "**/*.ts");
}
```

<p>针对 POSIX 特定函数：</p>

```js
import { fromFileUrl } from "@std/path/posix/from-file-url";
import { assertEquals } from "@std/assert";

assertEquals(fromFileUrl("file:///home/foo"), "/home/foo");
```

<p>针对 Windows 特定函数：</p>

```js
import { fromFileUrl } from "@std/path/windows/from-file-url";
import { assertEquals } from "@std/assert";

assertEquals(fromFileUrl("file:///home/foo"), "\\home\\foo");
```

<p>用于处理 URL 的函数可在
<a href="https://github.com/denoland/std/blob/HEAD/./doc/posix/~" rel="nofollow">@std/path/posix</a> 中找到。</p>

### 添加到你的项目

```sh
deno add jsr:@std/path
```

<a href="https://jsr.io/@std/path/doc" class="docs-cta jsr-cta">查看 @std/path 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 何时使用 @std/path

任何构建、规范化或检查文件路径的场合都适用。它处理 POSIX 和 Windows 之间的差异，使你的代码可移植。

## 示例

```ts
import { basename, dirname, extname, join, resolve } from "@std/path";

const file = join("content", "posts", "hello.md");
console.log(dirname(file)); // content/posts
console.log(basename(file)); // hello.md
console.log(extname(file)); // .md
console.log(resolve(".", "assets")); // 绝对路径
```

## 提示

- 优先使用 `join` 而非字符串拼接。
- 在文件 URL 和路径之间转换时使用 `fromFileUrl`/`toFileUrl`。
- 针对操作系统逻辑，导入 `@std/path/posix` 或 `@std/path/windows`。

<!-- custom:end -->