---
title: "欢迎使用 Deno"
description: "学习 Deno 的基础知识，一个安全的 JavaScript、TypeScript 和 WebAssembly 运行时。"
pagination_next: /runtime/getting_started/first_project/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /manual/introduction/
  - /runtime/manual/
  - /runtime/manual/getting_started/
  - /
---

[Deno](https://deno.com)
([/ˈdiːnoʊ/](https://ipa-reader.com/?text=%CB%88di%CB%90no%CA%8A)，发音为
`dee-no`) 是一个
[开源](https://github.com/denoland/deno/blob/main/LICENSE.md) 的 JavaScript、
TypeScript 和 WebAssembly 运行时，具备安全默认设置和出色的开发者体验。它基于 [V8](https://v8.dev/),
[Rust](https://www.rust-lang.org/) 和 [Tokio](https://tokio.rs/) 构建。

## 为什么选择 Deno？

- Deno 是
  **[开箱即用支持 TypeScript](/runtime/fundamentals/typescript/)。** 无需额外配置或步骤。
- Deno 默认 **[安全](/runtime/fundamentals/security/)。** 其他运行时通常给予其执行的脚本完全访问权限，而 Deno 允许你强制执行细粒度的权限控制。
- Deno 拥有 **强大的内置工具链。** 与 Node 或浏览器 JavaScript 不同，Deno 包含一个 [标准库](/runtime/fundamentals/standard_library/)，
  以及一流的
  [代码检查/格式化工具](/runtime/fundamentals/linting_and_formatting/)，
  [测试运行器](/runtime/fundamentals/testing/) 等等。
- Deno **与 [Node 和 npm](/runtime/fundamentals/node/) 完全兼容。**
- Deno 运行 **快速且可靠**。
- **[Deno 是开源项目](https://github.com/denoland/deno)。**

## 快速安装

通过以下终端命令之一在你的系统上安装 Deno 运行时：

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

Windows PowerShell 中执行：

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

[更多安装选项请见此处](/runtime/getting_started/installation/)。安装完成后，你的系统路径中应该有 `deno` 可执行文件。你可以通过运行以下命令来验证安装是否成功：

```sh
deno --version
```

## 初学者入门

Deno 可以运行 JavaScript 和 [TypeScript](https://www.typescriptlang.org/)，无需任何额外工具或配置，
并且提供一个安全且开箱即用的运行环境。

- [创建你的第一个 Deno 项目](/runtime/getting_started/first_project/)
- [设置开发环境](/runtime/getting_started/setup_your_environment/)
- [使用命令行界面](/runtime/getting_started/command_line_interface)