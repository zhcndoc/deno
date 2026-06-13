---
last_modified: 2026-03-09
title: "配置文件"
description: "Deno 项目是如何配置的：deno.json 文件、.jsonc 支持与发现方式、package.json 如何用于 Node 兼容性，以及可配置内容概览。有关每个字段，请参阅 deno.json 参考文档。"
oldUrl:
  - /runtime/manual/getting_started/configuration_file/
---

您可以使用 `deno.json` 文件来配置 Deno。该文件可用于配置 TypeScript 编译器、代码检查器、格式化工具以及其他 Deno 工具。

该配置文件支持 `.json` 和 [`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments) 扩展名。

如果在当前工作目录或父目录中检测到 `deno.json` 或 `deno.jsonc` 配置文件，Deno 将自动识别。可以使用 `--config` 标志指定不同的配置文件。

## package.json 支持

为了与 Node.js 项目兼容，Deno 也会读取现有的
`package.json`。您无需添加 `deno.json` 即可运行 Node 项目：Deno
会从 `package.json` 中解析项目依赖，您也可以使用 [`deno task`](/runtime/reference/cli/task/)
来运行其中的 `scripts`。

不过，`package.json` 不能用于配置 Deno 本身。像代码检查器、格式化工具、TypeScript 编译器选项以及
锁定文件等 Deno 特定设置，只会从 `deno.json` 中读取。当两个文件都存在时，Deno 会分别读取依赖项，并使用 `deno.json` 作为自身配置。

了解更多关于
[Deno 中的 Node 兼容性](/runtime/fundamentals/node/#node-compatibility)。

## 您可以配置的内容

`deno.json` 文件用于配置 Deno 的工具链和您的项目。每个字段都在
[配置文件（deno.json）参考](/runtime/reference/deno_json/)中有文档说明，包括：

- [依赖项和导入映射](/runtime/reference/deno_json/#dependencies)
- [任务](/runtime/reference/deno_json/#tasks)
- [代码检查](/runtime/reference/deno_json/#linting) 和
  [格式化](/runtime/reference/deno_json/#formatting)
- [锁定文件](/runtime/reference/deno_json/#lockfile) 和
  [node_modules 目录](/runtime/reference/deno_json/#node-modules-directory)
- [TypeScript 编译器选项](/runtime/reference/deno_json/#typescript-compiler-options)
- [不稳定功能标志](/runtime/reference/deno_json/#unstable-features)
- [`include` 和 `exclude`](/runtime/reference/deno_json/#include-and-exclude)
- [导出](/runtime/reference/deno_json/#exports)
- [权限](/runtime/reference/deno_json/#permissions)
- [编译选项](/runtime/reference/deno_json/#compile-config)

请参阅参考文档中的
[完整示例 deno.json 文件](/runtime/reference/deno_json/#an-example-deno.json-file)
以及用于编辑器自动补全的 [JSON schema](/runtime/reference/deno_json/#json-schema)。
