---
last_modified: 2026-06-12
title: "使用本地和未发布的包"
description: "处理不在注册表中的代码：使用 links 字段链接本地包副本，直接从 HTTPS URL 导入（包括私有 GitHub 仓库），并了解 Deno 不支持哪些 specifier。"
url: /examples/local_unpublished_packages_tutorial/
---

并非每个依赖都存在于 JSR 或 npm 上。Deno 提供了两种受支持的方式来使用
未发布到任何地方的代码：用于本地目录的 `links` 字段，以及
用于可通过 URL 访问代码的普通 HTTPS 导入。

## 使用 `links` 链接本地包

`deno.json` 中的 `links` 字段在 Node.js 中扮演着 `npm link` 的角色：它
在开发期间用本地目录覆盖某个依赖。给定一个本地
具有 `name`、`version` 和 `exports` 的包：

```json title="greeter/deno.json"
{
  "name": "@acme/greeter",
  "version": "0.1.0",
  "exports": "./mod.ts"
}
```

```ts title="greeter/mod.ts"
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

使用 `links` 将你的应用指向它，并像导入注册表
包一样导入它：

```json title="my-app/deno.json"
{
  "links": ["../greeter"],
  "imports": {
    "@acme/greeter": "jsr:@acme/greeter@^0.1.0"
  }
}
```

```ts title="my-app/main.ts"
import { greet } from "@acme/greeter";

console.log(greet("local package"));
```

```sh
$ deno run main.ts
Hello, local package!
```

链接的目录会被使用，而不是注册表；这个包甚至不必
已经发布。对 `greeter/` 的修改会直接被获取。

:::note

`links` 仅在工作区根目录中生效。链接 npm 包也
可以工作，但需要一个 `node_modules` 目录，并且包名必须存在
于 npm 注册表中。

:::

## 直接从 HTTPS URL 导入

任何可通过 HTTPS 访问的模块都可以直接导入，包括来自
GitHub 仓库的原始文件：

```ts title="main.ts"
import { equal } from "https://raw.githubusercontent.com/denoland/std/cdf74a86680beb4ef74c95e0fd5d71c5d7841eb9/assert/equal.ts";

console.log(equal([1, 2], [1, 2]));
```

```sh
$ deno run main.ts
Download https://raw.githubusercontent.com/denoland/std/cdf74a86680beb4ef74c95e0fd5d71c5d7841eb9/assert/equal.ts
true
```

将 URL 固定到标签或提交哈希，而不是分支，这样代码就不会在你
不知情的情况下变化。

对于私有仓库，将 `DENO_AUTH_TOKENS` 设置为一个限定到该主机的个人访问令牌，例如
`DENO_AUTH_TOKENS=a1b2c3d4e5f6@raw.githubusercontent.com`；请参阅
[私有仓库](/runtime/packages/private_repositories/) 了解详情。

:::caution

只从你信任的来源通过 HTTPS 导入，并且对于
超出小型项目的任何内容，优先使用注册表。`deno add`/`deno install` 不支持
HTTPS 导入。

:::

## 不支持的内容

Deno 不支持 `package.json` 中的 git 依赖规范（`git+https:`/`git+ssh:`）或
tarball URL 依赖。此外，自 Deno 2.8 起，
`package.json` 依赖中的 `file:` 和 `link:` 条目会在 npm 解析期间被静默跳过：
它们既不起作用也不会报错。

支持的替代方案有：

- 用于本地
  目录的 [`links` 字段](/runtime/packages/#overriding-local-packages)
- 用于托管在（可能是私有）git 仓库中的代码的 HTTPS 导入
- 对你需要修补或离线构建的远程模块进行[vendoring](/runtime/packages/#vendoring-remote-modules)
- 将包发布到 [JSR](https://jsr.io) 或 npm

关于锁文件、版本范围以及依赖的其他所有内容，请参阅
[包文档](/runtime/packages/)。
