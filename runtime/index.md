---
last_modified: 2026-05-28
title: "欢迎来到 Deno"
description: "了解 Deno 的基础知识，它是一个安全的 JavaScript、TypeScript 和 WebAssembly 运行时。"
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
([/ˈdiːnoʊ/](https://ipa-reader.com/?text=%CB%88di%CB%90no%CA%8A), 发音为
`dee-no`) 是一个
[开源](https://github.com/denoland/deno/blob/main/LICENSE.md) 的 JavaScript、
TypeScript 和 WebAssembly 运行时，具有安全默认设置和出色的开发者
体验。

## 为什么选择 Deno？

- **可与你现有的 [Node.js 项目](/runtime/fundamentals/node/) 配合使用。**
  将 Deno 放入带有 `package.json` 和 `node_modules` 的仓库中即可直接运行；
  在迁移过程中，你可以混合使用 `npm:` 导入和原生 ES 模块。
- **现代模块系统。** 支持 URL 导入的 ES 模块、用于类型化包的 [JSR](https://jsr.io)
  以及 [工作区](/runtime/fundamentals/workspaces/)。
- **[以 TypeScript 为先](/runtime/fundamentals/typescript/)。** 直接运行 `.ts` 文件。
  无需 `tsc`，无需构建步骤，无需配置。
- **[默认安全](/runtime/fundamentals/security/)。** 代码在沙箱中运行，在你授予权限之前，
  不会访问文件、网络或环境。
- **完整工具链，无需额外配置。** 内置
  [格式化器](/runtime/fundamentals/linting_and_formatting/)，
  [代码检查器](/runtime/fundamentals/linting_and_formatting/)，
  [测试运行器](/runtime/fundamentals/testing/)、基准测试，以及
  [更多功能](/runtime/reference/cli/)。无需额外接入 `devDependencies`。

## 快速安装

通过以下终端命令之一在你的系统上安装 Deno 运行时：

<deno-tabs group-id="operating-systems">
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="mac" label="macOS" default>

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

[更多安装选项请见此处](/runtime/getting_started/installation/)。安装完成后，你的系统路径中应该有 `deno` 可执行文件。你可以通过运行以下命令来验证安装是否成功：

```sh
deno --version
```

## 后续步骤

安装好 Deno 之后，继续阅读入门指南的其余部分：

- [创建一个 Deno 项目](/runtime/getting_started/first_project/)
- [设置你的环境](/runtime/getting_started/setup_your_environment/)
- [使用 CLI](/runtime/getting_started/command_line_interface/)

如需了解更多安装方式（包管理器、Docker、从源码构建），
请参阅完整的[安装指南](/runtime/getting_started/installation/)。
