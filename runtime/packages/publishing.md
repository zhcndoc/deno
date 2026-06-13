---
title: "发布包"
description: "使用 deno publish 将 Deno 包发布到 JSR，使用 deno pack 构建与 npm 兼容的 tarball，并为你的库选择合适的注册表。"
oldUrl:
  - /runtime/manual/basics/modules/publishing_modules/
  - /runtime/manual/advanced/publishing/dnt/
  - /runtime/manual/advanced/publishing/
---

任何定义了导出的 Deno 程序都可以作为包发布，供其他开发者导入。本页介绍发布位置以及发布方式。

## 选择注册表

- **[JSR](https://jsr.io)**：推荐用于以 Deno 为优先的包的注册表。
  它可直接接受 TypeScript（无需构建步骤），会根据你的 JSDoc 注释生成文档，并向 Deno、Node.js 及其他运行时提供包。
- **[npm](https://www.npmjs.com/)**：当你的使用者主要在 Node.js 上，或需要 npm 工具链时，请发布到这里。
  使用
  [`deno pack`](/runtime/reference/cli/pack/) 从 Deno 项目构建与 npm 兼容的 tarball，或者使用 [dnt](https://github.com/denoland/dnt) 以获得更
  可配置的构建流程。
- **[deno.land/x](https://deno.com/add_module)**：用于 HTTPS
  导入的旧注册表。对于新包，建议优先使用 JSR。

## 发布到 JSR

在 `deno.json` 中为你的包指定名称、版本和入口点：

```json title="deno.json"
{
  "name": "@scope/my-package",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

名称始终带有作用域（`@scope/name`）。首次发布时，请在
[jsr.io](https://jsr.io) 上创建该作用域。

检查将要发布的内容，然后执行发布：

```sh
deno publish --dry-run   # 验证文件列表和元数据
deno publish             # 打开 jsr.io 进行身份验证，然后发布
```

`deno publish` 会在上传前对你的代码进行类型检查，并验证你的导出不依赖
于包外的任何内容。有关标志，请参阅
[`deno publish` 参考](/runtime/reference/cli/publish/)，有关作用域、版本控制、来源信息以及从 CI
发布，请参阅 [jsr.io 上的发布包](https://jsr.io/docs/publishing-packages)。

要在各个版本之间更新版本字段，你可以使用
[`deno bump-version`](/runtime/reference/cli/bump_version/)。

## 发布到 npm

[`deno pack`](/runtime/reference/cli/pack/)（Deno 2.8+）会从 Deno 优先
项目构建与 npm 兼容的 tarball：它会转译 TypeScript、生成类型
声明，并生成 npm 期望的 `package.json` 元数据。

```sh
deno pack                # 创建 tarball
npm publish ./package.tgz
```

对于较旧的设置，或需要对输出进行细粒度控制的构建
（shims、多目标、构建期间运行测试），请使用
[dnt](https://github.com/denoland/dnt)，即 Deno 到 npm 的构建工具。

## 工作区

在 [workspace](/runtime/fundamentals/workspaces/) 中，`deno publish` 会按依赖顺序发布
每个具有名称和版本的工作区成员。详细信息请参阅
[将工作区包发布到注册表](/runtime/fundamentals/workspaces/#publishing-workspace-packages-to-registries)
。

## 继续阅读

- [依赖管理](/runtime/packages/)：本页所源自的日常工作流程
- [`deno publish`](/runtime/reference/cli/publish/) 和
  [`deno pack`](/runtime/reference/cli/pack/) 参考
- [JSR 发布文档](https://jsr.io/docs/publishing-packages)
