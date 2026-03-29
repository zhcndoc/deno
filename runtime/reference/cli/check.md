---
title: "deno check"
oldUrl: /runtime/manual/tools/check/
command: check
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno check"
description: "下载并进行类型检查而不执行代码"
---

`deno check` 会对你的 TypeScript（或 JavaScript）代码进行类型检查，而不会运行它。
这在 CI 流水线中或部署前很有用，可以尽早发现类型错误。
有关 Deno 中的 TypeScript 的更多信息，请参阅
[TypeScript](/runtime/fundamentals/typescript/) 指南。

## 基本用法

```sh
deno check main.ts
```

检查多个文件：

```sh
deno check src/server.ts src/utils.ts
```

## 对远程模块进行类型检查

默认情况下，只会对本地模块进行类型检查。使用 `--all` 也可以对
远程依赖进行类型检查：

```sh
deno check --all main.ts
```

## 对 JavaScript 文件进行类型检查

如果你有一个 JavaScript 项目，并且想在不为每个文件添加
`// @ts-check` 的情况下对其进行类型检查，请使用 `--check-js` 标志：

```sh
deno check --check-js main.js
```

## 在 CI 中使用

如果存在类型错误，`deno check` 会以非零状态码退出，因此它适合用于 CI 流水线：

```sh
deno check main.ts && echo "Types OK"
```

请注意，[`deno test`](/runtime/reference/cli/test/) 和
[`deno bench`](/runtime/reference/cli/bench/) 已经默认执行类型检查，因此如果你已经在运行测试，就不需要单独再执行 `deno check` 步骤。 当你想在不运行任何内容的情况下进行类型检查时，请使用 `deno check`——例如，作为 CI 中一个快速的前置步骤：

```sh
deno check main.ts
deno lint
deno test
```
