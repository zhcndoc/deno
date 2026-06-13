---
last_modified: 2026-05-20
title: "deno pack"
command: pack
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno pack"
description: "从 Deno 项目创建 npm tarball 以发布到 npm"
---

`deno pack` 命令会从 Deno 项目构建一个与 npm 兼容的 tarball（`.tgz`），因此你可以将 Deno 编写的库直接发布到 npm 注册表。它会将 TypeScript 转译为 JavaScript，生成 `.d.ts` 声明文件，重写导入标识符，并合成一个 npm 仅消费者能够理解的 `package.json`。

`deno pack` **不**等同于 `npm pack`。它是一个构建步骤，用于将 Deno/JSR 项目转换为可发布到 npm 的包——更接近于
[`deno transpile`](/runtime/reference/cli/transpile/) 与 `npm pack` 的组合。
它不会读取现有的 `package.json`，不会遵循 `.npmignore`，也不会运行 `prepublishOnly` / `prepare` 生命周期脚本。

## 快速开始

```sh
deno pack
```

`deno pack` 会从 `deno.json` 中读取包元数据（你用于发布到 JSR 的 `name`、`version`
和 `exports`），并将一个 gzipped tarball 写入当前目录。

给定如下 `deno.json`：

```json title="deno.json"
{
  "name": "@scope/my-lib",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

`deno pack` 会生成 `scope-my-lib-1.0.0.tgz`（会去掉 `@`，并将 `/`
替换为 `-`，这与 `npm pack` 的命名约定一致）。

## tarball 中包含什么

| 内容                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 一个生成的 `package.json`，其中包含 `name`、`version`、`type: "module"`、条件 `exports`（`types` / `import` / `default`），以及一个从你的 `jsr:` / `npm:` 导入中派生出的 `dependencies` 字段。 |
| 转译后的 `.js` 文件（默认带有内联 source map；传入 `--no-source-maps` 可省略）。                                                                                                      |
| 生成的 `.d.ts` 声明文件（通过与 [`deno publish`](/runtime/reference/cli/publish/) 相同的快速检查流水线生成）。                                                              |
| 如果项目根目录中存在，则包含 `README` 和 `LICENSE` 文件。                                                                                                                                    |

仅包含通过从 `exports` 可达的模块图所能访问到的文件。
像数据文件或 WASM 这类非 JS 资产，只有在被 JS/TS 导入时才会包含。如果你需要打包任意文件，请将它们作为位置参数列出：

```sh
deno pack assets/icon.svg locales/*.json
```

## 标识符重写

为了让生成的包能在 Node 和其他 npm 消费者中正常工作，`deno pack`
会在转译时重写导入：

| 在你的源码中    | 在 tarball 中      | 备注                                                 |
| --------------- | ---------------- | ---------------------------------------------------- |
| `jsr:@std/path` | `@jsr/std__path` | 消费者需要配置 JSR npm 注册表。      |
| `npm:express@4` | `express`        | 版本会移入 `package.json` 的 `dependencies` 中。 |
| `./utils.ts`    | `./utils.js`     | 仅扩展名变化——不会重组路径。              |
| `node:fs`       | `node:fs`        | 不变。                                           |

由于 JSR 导入会变成 `@jsr/...` 标识符，任何安装该已发布 tarball 的人都需要配置 JSR npm 注册表。最简单的方法是
在消费者项目中运行一次 [`npx jsr add`](https://jsr.io/docs/npm-compatibility)；这会为 `@jsr` 作用域设置好 `.npmrc` 条目。

## Deno API shim

如果你的代码使用了 `Deno.*` 全局对象，`deno pack` 会添加
[`@deno/shim-deno`](https://www.npmjs.com/package/@deno/shim-deno) 作为运行时
依赖，并注入该 shim，使包能够在 Node.js 下运行。该 shim 覆盖了能顺利映射到 Node API 的那部分 `Deno.*`——请查看该 shim 的文档以了解哪些内容被 polyfill 了。

传入 `--no-deno-shim` 可选择不使用，例如当你已经提供了自己的
抽象层，或者只打算让该包在 Deno-on-npm 下运行时。

## 发布到 npm

```sh
deno pack
npm publish ./scope-my-lib-1.0.0.tgz
```

典型的发布流程：

```sh
# 1. 提升版本号
deno bump-version patch

# 2. 构建 tarball
deno pack

# 3. 验证内容（解压后的视图）
tar -tzf scope-my-lib-1.0.0.tgz

# 4. 推送到 npm
npm publish ./scope-my-lib-1.0.0.tgz
```

对于 JSR 发布，请使用 [`deno publish`](/runtime/reference/cli/publish/)——
`deno pack` 是专门用于 npm 注册表的。

## 工作区支持

在 [workspace](/runtime/fundamentals/workspaces/) 中，`deno pack` 会针对当前工作目录中的成员运行。要从根目录打包某个特定成员：

```sh
cd packages/my-lib
deno pack
```

跨工作区的 `npm:` / `jsr:` 依赖会在生成的
`package.json` 中被重写为指向它们已发布的版本，而不是其他工作区成员——在发布 tarball 之前，请确保这些依赖已独立发布。

## 示例

### 覆盖版本

在发布一次性预发布版本而不编辑 `deno.json` 时很有用：

```sh
deno pack --set-version 2.0.0-rc.1
```

### 选择输出路径

```sh
deno pack --output dist/my-package.tgz
```

### 预览而不写入

```sh
deno pack --dry-run
```

`--dry-run` 会打印 tarball 中本来会包含的内容，但不会真正生成 tarball——很适合在 CI 中验证文件包含规则。

### 允许慢类型

[慢类型](https://jsr.io/docs/about-slow-types) 会阻止生成 `.d.ts`。
仍要打包时可传入 `--allow-slow-types`；tarball 将不包含
声明文件。

```sh
deno pack --allow-slow-types
```

### 跳过 Deno shim

```sh
deno pack --no-deno-shim
```

### 即使工作树脏也打包

```sh
deno pack --allow-dirty
```

默认情况下，当 git 工作树存在未提交更改时，`deno pack` 会拒绝打包，以便让发布可以从提交哈希复现。

### 排除文件

```sh
deno pack --ignore=tests/ --ignore='**/*.test.ts'
```

`--ignore` 接受 glob 模式。组合多个 `--ignore` 标志可添加更多
模式。

### 省略 source map

```sh
deno pack --no-source-maps
```

默认情况下，source map 会以内联方式包含在生成的 `.js` 文件中。使用
`--no-source-maps` 可将其移除——tarball 会更小，但上游调试会更困难。

## 限制

- **没有 `bin` 条目。** `deno pack` 不会合成 `package.json` 中的 `bin`
  字段。支持库发布；需要 `node` shebang 可执行文件的 CLI 工具仍然需要手工编写 npm 包。
- **没有原生插件。** 依赖原生代码或包含 `node-gyp` 构建步骤的包不在支持范围内。
- **没有 `.npmignore`。** 使用 `--ignore` 进行排除；`.gitignore` 会被遵循，用于决定哪些内容被视为项目的一部分。
- **没有生命周期脚本。** 手写 `package.json` 中的 `prepublishOnly` / `prepare` / `postinstall` 钩子不会运行，因为 `package.json` 是生成的，不是读取的。

## 何时使用 deno pack 与 deno publish

| 需求                                                | 使用                                               |
| --------------------------------------------------- | ------------------------------------------------- |
| 发布到 [JSR](https://jsr.io)                    | [`deno publish`](/runtime/reference/cli/publish/) |
| 将同一个库发布到 npm                     | `deno pack` → `npm publish ./*.tgz`               |
| 面向仅 Node 的消费者，而不强制其配置 JSR | `deno pack`（为其重写 JSR 导入）       |

一个库可以同时发布到两者——先用 `deno publish` 发布到 JSR，然后用 `deno pack` 构建并
推送 tarball 到 npm，供尚未采用 JSR 的用户使用。

## 另请参阅

- [`deno publish`](/runtime/reference/cli/publish/) — 发布到 JSR
- [`deno transpile`](/runtime/reference/cli/transpile/) — `deno pack` 在内部使用的发射步骤
- [`deno bump-version`](/runtime/reference/cli/bump_version/) — 打包前提升 `deno.json` / `package.json` 中的 `version`
- [Publishing modules](/runtime/packages/publishing/) — Deno 编写的库可以发布到哪里的概览
