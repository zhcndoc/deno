---
title: "贡献与支持"
description: "关于如何为 Deno 项目和生态系统做出贡献的指南。了解不同的 Deno 仓库、贡献方针，以及如何提交高质量的拉取请求。"
oldUrl:
  - /runtime/manual/contributing/
  - /runtime/manual/contributing/contribute
  - /runtime/manual/references/contributing/
  - /runtime/contributing/contribute/
---

我们欢迎并感谢所有对 Deno 的贡献。

本页旨在帮助您开始贡献。

## 项目

在 [`denoland`](https://github.com/denoland) 组织中，存在许多属于 Deno 生态系统的代码库。

这些代码库的类型多样，使用不同的编程语言，贡献难度也各不相同。

为了帮助您决定哪个代码库可能是开始贡献的最佳选择（或最符合您的兴趣），以下是一个简短的对比（**主要由粗体字标注的语言**）：

### [deno](https://github.com/denoland/deno)

这是提供 `deno` 命令行工具的主仓库。

语言：**Rust**、**JavaScript**、**TypeScript**

### [deno_std](https://github.com/denoland/deno_std)

Deno 的标准库。

语言：**TypeScript**、WebAssembly

### [fresh](https://github.com/denoland/fresh)

下一代网页框架。

语言：**TypeScript**、TSX

### [deno_lint](https://github.com/denoland/deno_lint)

驱动 `deno lint` 子命令的代码质量检测工具。

语言：**Rust**

### [deno_doc](https://github.com/denoland/deno_doc)

文档生成器，支撑 `deno doc` 命令，以及 https://docs.deno.com/api 和 https://jsr.io 上的参考文档。

语言：**Rust**

### [rusty_v8](https://github.com/denoland/rusty_v8)

V8 JavaScript 引擎的 Rust 绑定，非常底层且技术性强。

语言：**Rust**

### [serde_v8](https://github.com/denoland/deno_core/tree/main/serde_v8)

提供 V8 与 Rust 对象之间相互转换的库，基于 [`serde`](https://crates.io/crates/serde)。技术性较强。

语言：**Rust**

### [deno_docker](https://github.com/denoland/deno_docker)

Deno 的官方 Docker 镜像。

## 一般注意事项

- 请阅读 [风格指南](/runtime/contributing/style_guide)。

- 请勿让 [基准测试](https://deno.land/benchmarks) 变得更差。

- 在 [社区聊天室](https://discord.gg/deno) 寻求帮助。

- 如果您准备处理某个问题，请在开始工作前在该问题的讨论中提及。

- 如果您准备开发新特性，请在开始工作前创建一个问题并与其他贡献者讨论；我们欢迎所有贡献，但并非所有提案都会被采纳。我们不希望您为可能不会被接受的代码花费数小时。

- 在论坛中保持专业。我们遵守 [Rust 的行为准则](https://www.rust-lang.org/policies/code-of-conduct)(CoC)。遇到问题？请联系邮箱 [ry@tinyclouds.org](mailto:ry@tinyclouds.org)。

## 提交拉取请求

在向任何仓库提交 PR 之前，请确保完成以下事项：

1. 给 PR 起一个描述性标题。

良好的 PR 标题示例：

- fix(std/http): 修复服务器中的竞争条件
- docs(console): 更新文档字符串
- feat(doc): 处理嵌套重新导出

不佳的 PR 标题示例：

- fix #7123
- update docs
- fix bugs

2. 确保关联了相关问题，并在 PR 内容中引用。

3. 确保有覆盖变更的测试。

## 文档化 API

详细记录所有公共 API 十分重要，我们希望尽可能在代码中进行文档注释。这有助于确保代码与文档紧密结合。

### JavaScript 与 TypeScript

所有公开暴露的 API 和类型，无论是通过 `deno` 模块还是全局/`window` 命名空间，都应有 JSDoc 注释。这些注释会被解析，并提供给 TypeScript 编译器，从而方便后续使用。JSDoc 注释块位于对应语句之前，以 `/**` 开始，以 `*/` 结束。例如：

```ts
/** 一个简单的 JSDoc 注释 */
export const FOO = "foo";
```

更多内容请参见：https://jsdoc.app/

### Rust

请按照 [该指南](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html) 编写 Rust 代码中的文档注释。

## 性能分析

在贡献性能敏感部分时，进行性能分析非常有帮助，可确保改动不带来负面影响或验证优化的效果。

### 使用 Samply

[Samply](https://github.com/mstange/samply) 是一款适用于 macOS 和 Linux 的采样剖析器，与 Deno 配合良好。它可以生成火焰图，帮助你可视化 CPU 时间的分布。

```sh
# 基本用法
samply record -r 20000 deno run -A main.js
```

生成的火焰图可以帮助你识别：

- CPU 时间主要花费的位置（热点）
- 异常的函数调用
- 潜在的优化空间

在提交涉及性能改进的贡献时，附上剖析数据可以帮助团队理解和验证你的改进效果。