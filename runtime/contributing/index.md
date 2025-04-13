---
title: "Contributing and support"
description: "Guide to contributing to the Deno project and ecosystem. Learn about different Deno repositories, contribution guidelines, and how to submit effective pull requests."
oldUrl:
  - /runtime/manual/contributing/
  - /runtime/manual/contributing/contribute
  - /runtime/manual/references/contributing/
  - /runtime/contributing/contribute/
---

我们欢迎并感谢所有对 Deno 的贡献。

本页旨在帮助您开始贡献。

## 项目

在 [`denoland`](https://github.com/denoland) 组织中，有众多的代码库是 Deno 生态系统的一部分。

这些代码库的范围各异，使用不同的编程语言，并且在贡献方面的难度也有所不同。

为了帮助您决定哪个代码库可能是开始贡献的最佳选择（和/或符合您的兴趣），以下是一个简短的比较（**代码库主要由粗体字标出的语言构成**）：

### [deno](https://github.com/denoland/deno)

这是提供 `deno` CLI 的主要代码库。

如果您想修复一个错误或向 `deno` 添加一个新特性，这就是您要贡献的代码库。

一些系统，包括大量的 Node.js 兼容层，是用 JavaScript 和 TypeScript 模块实现的。如果您想进行第一次贡献，这些模块是一个很好的起点。

[这里](https://node-test-viewer.deno.dev/results/latest) 是 Node.js 测试用例的列表，包括成功的和失败的案例。审查这些可以提供对兼容性层如何在实践中工作的宝贵见解，以及在哪里可能需要改进。它们还可以作为识别贡献最有影响力的领域的有用指南。

在迭代这些模块时，建议在您的 `cargo` 标志中包括 `--features hmr`。这是一个特殊的开发模式，其中 JS/TS 源在运行时读取，而不包括在二进制文件中。这意味着如果它们被更改，二进制文件无需重建。

要使用下面的命令，您需要首先按照 [此处](building_from_source) 的描述在系统上安装必要的工具。

```sh
# cargo build
cargo build --features hmr

# cargo run -- run hello.ts
cargo run --features hmr -- run hello.ts

# cargo test integration::node_unit_tests::os_test
cargo test --features hmr integration::node_unit_tests::os_test
```

还请记得在编辑器设置中引用此功能标志。对于 VSCode 用户，将以下内容合并到您的工作区文件中：

```jsonc
{
  "settings": {
    "rust-analyzer.cargo.features": ["hmr"],
    // 添加对解析内部 `ext:*` 模块的支持
    "deno.importMap": "tools/core_import_map.json"
  }
}
```

要在 VSCode 中使用开发版本的 LSP：

1. 安装并启用
   [Deno VSCode 扩展](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
2. 更新您的 VSCode 设置并将 `deno.path` 指向您的开发二进制文件：

```jsonc
// .vscode/settings.json
{
  "deno.path": "/path/to/your/deno/target/debug/deno"
}
```

语言：**Rust**, **JavaScript**, **TypeScript**

### [deno_std](https://github.com/denoland/deno_std)

Deno 的标准库。

语言：**TypeScript**, WebAssembly

### [fresh](https://github.com/denoland/fresh)

下一代网页框架。

语言：**TypeScript**, TSX

### [deno_lint](https://github.com/denoland/deno_lint)

驱动 `deno lint` 子命令的代码检查工具。

语言：**Rust**

### [deno_doc](https://github.com/denoland/deno_doc)

文档生成器，驱动 `deno doc` 子命令，以及 https://docs.deno.com/api 和 https://jsr.io 上的参考文档。

语言：**Rust**

### [rusty_v8](https://github.com/denoland/rusty_v8)

V8 JavaScript 引擎的 Rust 绑定。非常技术性和底层。

语言：**Rust**

### [serde_v8](https://github.com/denoland/deno_core/tree/main/serde_v8)

提供 V8 与 Rust 对象之间的双射层的库。基于 [`serde`](https://crates.io/crates/serde) 库。非常技术性和底层。

语言：**Rust**

### [deno_docker](https://github.com/denoland/deno_docker)

Deno 的官方 Docker 镜像。

## 一般注意事项

- 请阅读 [风格指南](/runtime/contributing/style_guide)。

- 请不要使 [基准测试](https://deno.land/benchmarks) 变得更差。

- 在 [社区聊天室](https://discord.gg/deno) 中寻求帮助。

- 如果您将要处理一个问题，请在开始工作之前在问题的评论中提到这一点。

- 如果您将要处理一个新特性，请在开始工作之前创建一个问题并与其他贡献者讨论；我们欢迎所有贡献，但并不是所有提议的特性都会被接受。我们不希望您花费数小时工作于可能不会被接受的代码。

- 请在论坛中保持专业。我们遵循 [Rust 的行为准则](https://www.rust-lang.org/policies/code-of-conduct) (CoC)。遇到问题？请邮件联系 [ry@tinyclouds.org](mailto:ry@tinyclouds.org)。

## 提交拉取请求

在向任何代码库提交 PR 之前，请确保完成以下事项：

1. 给 PR 一个描述性的标题。

良好的 PR 标题示例：

- fix(std/http): 修复服务器中的竞争条件
- docs(console): 更新文档字符串
- feat(doc): 处理嵌套重新导出

不好的 PR 标题示例：

- fix #7123
- update docs
- fix bugs

2. 确保有相关问题并在 PR 文本中引用它。
3. 确保有覆盖更改的测试。

## 向 [`deno`](https://github.com/denoland/deno) 提交 PR

除了上述事项外，请确保：

> 要使用下面的命令，您需要首先按照 [此处](building_from_source) 的描述在系统上安装必要的工具。

1. `cargo test` 通过 - 这将运行 `deno` 的完整测试套件，包括单元测试、集成测试和 Web 平台测试。

1. 运行 `./tools/format.js` - 这将格式化所有代码以符合代码库中的一致风格。

1. 运行 `./tools/lint.js` - 这将使用 `clippy`（用于 Rust）和 `dlint`（用于 JavaScript）检查常见错误和问题。

## 向 [`deno_std`](https://github.com/denoland/deno_std) 提交 PR

除了上述事项外，请确保：

1. 您编写的所有代码都使用 `TypeScript`（即，不要使用 `JavaScript`）。

1. `deno test --unstable --allow-all` 通过 - 这将运行标准库的完整测试套件。

1. 在代码库的根目录中运行 `deno fmt` - 这将格式化所有代码以符合代码库中的一致风格。

1. 运行 `deno lint` - 这将检查 TypeScript 代码中的常见错误。

## 向 [`fresh`](https://github.com/denoland/fresh) 提交 PR

首先，请确保 [安装 Puppeteer](https://github.com/lucacasonato/deno-puppeteer#installation)。
然后，请确保运行 `deno task ok` 并成功通过。

## 文档 API

文档所有公共 API 是很重要的，我们希望能与代码内联。这有助于确保代码与文档紧密结合在一起。

### JavaScript 和 TypeScript

所有公开的 API 和类型，无论是通过 `deno` 模块还是全局/`window` 命名空间，都应具有 JSDoc 文档。此文档会被解析并提供给 TypeScript 编译器，因此很容易向下游提供。JSDoc 块位于适用语句的前面，并以 `/**` 开头，以 `*/` 结束。例如：

```ts
/** 一个简单的 JSDoc 注释 */
export const FOO = "foo";
```

更多信息请见：https://jsdoc.app/

### Rust

使用 [这份指南](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html) 在 Rust 代码中编写文档注释。