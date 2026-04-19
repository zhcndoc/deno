---
last_modified: 2026-03-12
title: "deno create"
command: create
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno create"
description: "从模板包搭建一个新项目"
---

`deno create` 命令用于从模板包搭建一个新项目。它支持提供项目模板的 [JSR](https://jsr.io/) 和 [npm](https://www.npmjs.com/) 包。

## 用法

```sh
deno create [OPTIONS] [PACKAGE] [-- [ARGS]...]
```

默认情况下，未加前缀的包名会从 JSR 解析。你可以使用 `npm:` 或 `jsr:` 前缀来明确指定，也可以使用 `--npm` / `--jsr` 标志。

## 工作原理

npm 和 JSR 的包解析方式不同：

- **npm 包** 使用 `create-` 命名约定。运行
  `deno create npm:vite` 会解析为 npm 上的 `create-vite` 包，并
  执行其主入口点。
- **JSR 包** 使用 `./create` 导出。任何 JSR 包都可以通过在其
  [`deno.json`](/runtime/fundamentals/configuration/) 中定义一个 `./create` 入口点来充当模板：

```json title="deno.json"
{
  "name": "@my-scope/my-template",
  "version": "1.0.0",
  "exports": {
    ".": "./mod.ts",
    "./create": "./create.ts"
  }
}
```

当你运行 `deno create @my-scope/my-template` 时，Deno 会查找 `./create` 导出并作为脚手架脚本执行。

## 示例

从 JSR 包创建项目：

```sh
deno create @fresh/init
```

从 npm 包创建项目：

```sh
deno create npm:vite my-app
```

使用 `--npm` 标志将未加前缀的名称当作 npm 包处理：

```sh
deno create --npm create-vite my-app
```

向模板包传递参数：

```sh
deno create @fresh/init -- --force
```

## 参数标志

- `--npm` - 将未加前缀的包名当作 npm 包处理
- `--jsr` - 将未加前缀的包名当作 JSR 包处理（默认）
- `-y, --yes` - 跳过提示，使用完全权限运行
