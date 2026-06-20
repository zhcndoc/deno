---
last_modified: 2026-06-18
title: "deno x"
command: x
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno x"
description: "使用 Deno 执行 npm 或 JSR 包。"
---

`deno x` 会从 npm 或 JSR 执行一个包，而不会将其永久安装。
它类似于 npm 生态系统中的 `npx`。

## 安装 `dx` 别名

为方便起见，你可以将 `deno x` 安装为一个独立的 `dx` 二进制文件，默认使用所有权限运行：

```sh
deno x --install-alias
```

然后直接使用它：

```sh
dx npm:create-vite my-app
```

你可以自定义别名名称：

```sh
deno x --install-alias=denox
```

## 基本用法

运行一个 npm 包：

```sh
deno x npm:create-vite my-app
```

运行一个 JSR 包：

```sh
deno x jsr:@std/http/file-server
```

## 将包与二进制文件分开指定

一些 npm 包会暴露多个二进制文件——例如，`typescript` 同时提供 `tsc` 和
`tsserver`。从 Deno 2.8 开始，`--package`（`-p`）可以让你
独立选择包和二进制文件，与
`npx -p <package> <binary>` 的约定一致：

```sh
# 从 typescript 包中运行 `tsc`
deno x -p typescript tsc

# 锁定包版本
deno x -p typescript@5 tsc
```

之前的形式 `deno x typescript/tsc` 仍然有效。

## 工作原理

`deno x` 会将包下载到全局缓存中（如果尚未缓存），
解析该包的二进制入口点，并执行它。该包不会被添加到你项目的
[`deno.json`](/runtime/fundamentals/configuration/) 或
`package.json` 中。

## 使用 `deno x` 编写包

`deno x` 如何找到要执行的内容取决于注册表：

- **npm 包** 通过 `package.json` 中的 `bin` 字段暴露可运行的二进制文件。`deno x npm:<package>` 会运行该包的默认二进制文件，而 `deno x -p <package> <binary>`（或 `deno x npm:<package>/<binary>`）会在一个包提供多个二进制文件时选择其中一个。要让你自己的 npm 包可运行，请像为 `npx` 那样通过 `bin` 条目发布它。
- **JSR 包** 通过让 `deno x` 指向一个在导入时会执行的导出来运行，例如 `deno x jsr:@std/http/file-server`。要让你自己的 JSR 包可运行，请将入口点作为模块导出，并用 `import.meta.main` 保护顶层副作用（这样该模块仍然可以作为库被导入），然后记录用户应运行的子路径，例如 `deno x jsr:@you/tool/cli`。

如果你希望工具作为一个永久命令可用，而不是按需运行，请使用 [`deno install`](/runtime/reference/cli/install/) 安装它，或者将其编译为独立可执行文件。完整工作流程请参见 [构建 CLI 应用](/runtime/cli_apps/)，发布到 JSR 请参见 [发布模块](/runtime/packages/publishing/)。

## 权限

执行的包将使用你指定的权限运行：

```sh
deno x --allow-read --allow-net npm:serve .
```

或者授予所有权限：

```sh
deno x -A npm:create-vite my-app
```
