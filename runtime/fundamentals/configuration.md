---
last_modified: 2026-06-17
title: "配置文件"
description: "Deno 项目如何配置：一等公民级别的 package.json 支持、用于 Deno 自身工具链的 deno.json 文件、.jsonc 支持与自动发现机制，以及可配置内容概览。有关每个字段，请参阅 deno.json 参考。"
oldUrl:
  - /runtime/manual/getting_started/configuration_file/
---

Deno 读取两个配置文件：Node 的 `package.json` 和其自身的
`deno.json`。两者都是一等公民且都可选，因此 Deno 可以只使用其中一个，也可以同时使用两个。经验法则：

- 使用 **`package.json`** 来管理依赖和脚本。Deno 会直接读取它，
  因此大多数 Node.js 项目无需任何改动即可运行，而且你根本不需要
  `deno.json`。
- 当你想配置 Deno 自身的工具链时，例如格式化器、代码检查器、
  TypeScript 编译器或任务，请添加 **`deno.json`**。

## package.json

Deno 原生支持 `package.json`。将 Deno 指向一个现有的 Node.js
项目，它会从 `package.json` 中解析相同的 npm 依赖，并使用
[`deno task`](/runtime/reference/cli/task/) 运行项目的 `scripts`，无需
`deno.json`，也无需转换步骤：

```sh
deno install        # 安装 package.json 中的依赖
deno task <script>  # 运行 package.json 中定义的脚本
```

`package.json` 可以配置项目的依赖和脚本，但不能配置 Deno 本身。
诸如格式化器、代码检查器、TypeScript 编译器选项以及锁文件行为等 Deno 专属设置，只存在于 `deno.json` 中。
当两个文件都存在时，Deno 会从两者读取依赖，并从 `deno.json` 中获取自身配置。

这正是你能够逐步采用 Deno 的原因：在继续于 Node 上运行应用的同时，把 Deno 当作更快的替代型包管理器来使用，用 `deno task` 运行现有脚本，并在准备好时再添加一个 `deno.json` 来配置 Deno 的工具链。
[从 Node.js 迁移](/runtime/migrate/) 指南会逐步介绍每一步，而
[Deno 中的 Node 兼容性](/runtime/fundamentals/node/) 说明了运行时如何映射 Node 的 API 和模块解析。

## deno.json

`deno.json` 用于配置 Deno 本身：任务、依赖，以及 TypeScript 编译器、代码检查器和格式化器等工具。它是可选的；一个最小文件如下：

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@^1"
  },
  "fmt": {
    "lineWidth": 100
  }
}
```

它支持 `.json` 和
[`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
扩展，因此使用 `deno.jsonc` 时，你可以添加注释和尾随逗号。

Deno 会自动在你当前工作目录或其任意父目录中检测 `deno.json` 或 `deno.jsonc` 文件，这就是项目设置能够应用到其下所有文件的原因。使用 `--config` 标志可以指向其他文件。在单体仓库中，根目录下的 `deno.json` 可以定义一个
[workspace](/runtime/fundamentals/workspaces/)，其成员各自携带自己的 `deno.json`。

## 您可以配置的内容

`deno.json` 文件用于配置 Deno 的工具链和您的项目。每个字段都在
[配置文件（deno.json）参考](/runtime/reference/deno_json/)中有文档说明，包括：

- [依赖项和导入映射](/runtime/reference/deno_json/#dependencies)
- [任务](/runtime/reference/deno_json/#tasks)
- [代码检查](/runtime/reference/deno_json/#linting) 和
  [格式化](/runtime/reference/deno_json/#formatting)
- [锁文件](/runtime/reference/deno_json/#lockfile) 和
  [node_modules 目录](/runtime/reference/deno_json/#node-modules-directory)
- [TypeScript 编译器选项](/runtime/reference/deno_json/#typescript-compiler-options)
- [不稳定特性标志](/runtime/reference/deno_json/#unstable-features)
- [`include` 和 `exclude`](/runtime/reference/deno_json/#include-and-exclude)
- [导出](/runtime/reference/deno_json/#exports)
- [权限](/runtime/reference/deno_json/#permissions)
- [编译选项](/runtime/reference/deno_json/#compile-config)
- [最小依赖年龄](/runtime/reference/deno_json/#minimum-dependency-age)

请参阅参考文档中的
[完整示例 deno.json 文件](/runtime/reference/deno_json/#an-example-deno.json-file)
以及用于编辑器自动补全的 [JSON schema](/runtime/reference/deno_json/#json-schema)。
