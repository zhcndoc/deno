---
last_modified: 2026-05-28
title: "开始使用 Deno"
description: "安装 Deno 并构建你的第一个项目：了解为什么选择 Deno、安装、创建、运行、测试、添加依赖，以及使用内置工具链。无需构建步骤，无需配置。"
pagination_next: /runtime/getting_started/installation/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /manual/introduction/
  - /runtime/manual/
  - /runtime/manual/getting_started/
  - /
  - /runtime/getting_started/
  - /runtime/getting_started/first_project/
---

[Deno](https://deno.com)
([/ˈdiːnoʊ/](https://ipa-reader.com/?text=%CB%88di%CB%90no%CA%8A), 发音为
`dee-no`) 是一个
[开源](https://github.com/denoland/deno/blob/main/LICENSE.md) 的 JavaScript、
TypeScript 和 WebAssembly 运行时，具有安全默认设置和出色的开发者
体验。本页将带你在几分钟内从零开始完成一个可运行、可测试的项目。

## 为什么选择 Deno？

- **可与现有的 [Node.js 项目](/runtime/fundamentals/node/) 协同工作。**
  将 Deno 直接放入一个包含 `package.json` 和 `node_modules` 的仓库中，它就能直接运行；
  在迁移过程中，可以混用 `npm:` 导入和原生 ES 模块。
- **现代模块系统。** 带有 URL 导入的 ES 模块、用于类型化包的 [JSR](https://jsr.io)
  以及 [工作区](/runtime/fundamentals/workspaces/)。
- **[以 TypeScript 为先](/runtime/fundamentals/typescript/)。** 可直接运行 `.ts` 文件。
  无需 `tsc`，无需构建步骤，无需配置。
- **[默认安全](/runtime/fundamentals/security/)。** 代码运行在沙箱中，
  在你授予权限之前，无法访问文件、网络或环境。
- **完整工具链，无需额外搭建。** 内置
  [格式化器](/runtime/lint_and_format/)、[检查器](/runtime/lint_and_format/)、
  [测试运行器](/runtime/test/)、基准测试，以及
  [更多功能](/runtime/reference/cli/)。无需配置 `devDependencies`。

## 安装 Deno

使用一条命令安装运行时：

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS / Linux" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```shell title="pwsh"
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
</deno-tabs>

验证安装：

```sh
deno --version
```

有关包管理器、Docker 和其他选项，请参阅 [安装](/runtime/getting_started/installation/)。

## 创建项目

使用 [`deno init`](/runtime/reference/cli/init/) 脚手架创建一个新项目：

```sh
deno init my_project
```

这会创建一个小型、可直接运行的项目：

```plaintext
my_project
├── deno.json      # 项目配置：任务、导入、lint/fmt 设置
├── main.ts        # 基于 Deno.serve 构建的一个小型 HTTP 服务器
└── main_test.ts   # 它的测试
```

[`deno.json`](/runtime/reference/deno_json/) 是你的任务、依赖项和工具配置所在的位置。
可以把它看作一个文件中同时包含 `package.json` 和你的工具配置。

## 运行它

```sh
$ cd my_project
$ deno -N main.ts
Listening on http://localhost:8000/
```

注意 `-N`（即 `--allow-net` 的简写）。Deno
[默认安全](/runtime/fundamentals/security/)：在你授予权限之前，代码不能访问
网络、文件系统或环境。打开该 URL 查看响应。

`main.ts` 是 TypeScript，并且是直接运行的：**无需 `tsc`，无需构建步骤**。它还基于 Web 标准的
[`Deno.serve`](/api/deno/~/Deno.serve) 和 `Request`/`Response` 构建，因此你在这里学到的是平台本身，而不是某个框架。

## 测试它

项目自带测试。使用 [`deno test`](/runtime/test/) 运行它们。测试运行器是内置的，因此无需安装任何东西：

```sh
$ deno test
running 2 tests from ./main_test.ts
returns html on / ... ok (12ms)
returns json on /api ... ok (0ms)

ok | 2 passed | 0 failed (15ms)
```

## 添加依赖

使用 [`deno install`](/runtime/reference/cli/install/) 从 npm 或 [JSR](https://jsr.io) 拉取包：

```sh
deno install express            # 任意 npm 包，就像 npm install 一样
deno install jsr:@std/assert    # Deno 标准库，位于 JSR 上
```

然后导入并使用它们：

```ts
import { assertEquals } from "@std/assert";

assertEquals(1 + 1, 2);
```

## 使用内置工具链

格式化、检查等功能都随运行时附带，无需额外设置：

```sh
deno fmt     # 格式化你的代码
deno lint    # 捕获问题
deno task    # 运行在 deno.json 中定义的脚本
```

## 接下来的步骤

- **[设置你的编辑器](/runtime/getting_started/setup_your_environment/)。**
  自动补全、行内错误提示，以及保存时格式化。
- **[运行代码](/runtime/run/)。** 服务器、任务、Web API 和调试。
- **[管理包](/runtime/packages/)。** 依赖、工作区、
  发布。
- **[从 Node.js 迁移](/runtime/migrate/)。** 将现有项目迁移过来。
- **[示例和教程](/examples/)。** 关于接下来可以构建什么的灵感。
