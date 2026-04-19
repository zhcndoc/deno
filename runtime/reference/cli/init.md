---
last_modified: 2026-03-12
title: "deno init"
oldUrl: /runtime/manual/tools/init/
command: init
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno init"
description: "搭建一个带有测试和配置的全新 Deno 项目"
---

## 示例

```sh
deno init
✅ 项目已初始化
运行以下命令开始

  // 运行程序
  deno run main.ts

  // 运行程序并监听文件变化
  deno task dev

  // 运行测试
  deno test

deno run main.ts
Add 2 + 3 = 5

deno test
Check file:///dev/main_test.ts
running 1 test from main_test.ts
addTest ... ok (6ms)

ok | 1 passed | 0 failed (29ms)
```

`init` 子命令将创建两个文件（`main.ts` 和 `main_test.ts`）。这些文件提供了如何编写 Deno 程序以及如何为其编写测试的基本示例。`main.ts` 文件导出了一个 `add` 函数，该函数将两个数字相加；而 `main_test.ts` 文件则包含对该函数的测试。

你也可以为 `deno init` 指定一个参数，以在特定目录中初始化项目：

```sh
deno init my_deno_project
✅ 项目已初始化

运行以下命令开始

  cd my_deno_project

  // 运行程序
  deno run main.ts

  // 运行程序并监听文件变化
  deno task dev

  // 运行测试
  deno test
```

## 初始化一个 JSR 包

通过运行 `deno init --lib`，Deno 将引导一个可在 [JSR](https://jsr.io/) 上发布的项目。

```sh
deno init --lib
✅ 项目已初始化

运行以下命令开始

  # 运行测试
  deno test

  # 运行测试并监听文件变化
  deno task dev

  # 发布到 JSR（干运行）
  deno publish --dry-run
```

在 `deno.json` 中，你会看到 `name`、`exports` 和 `version` 的条目已预填充。

```json title="deno.json"
{
  "name": "my-lib",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "dev": "deno test --watch mod.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```

## 初始化一个 Web 服务器

运行 `deno init --serve` 将引导一个可与 [`deno serve`](./serve) 一起工作的 Web 服务器。

```sh
deno init --serve
✅ 项目已初始化

运行以下命令开始

  # 运行服务器
  deno serve -R main.ts

  # 运行服务器并监听文件变化
  deno task dev

  # 运行测试
  deno -R test
```

你的 [`deno.json`](/runtime/fundamentals/configuration/) 文件将如下所示：

```json title="deno.json"
{
  "tasks": {
    "dev": "deno serve --watch -R main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@1",
    "@std/http": "jsr:@std/http@1"
  }
}
```

现在，你可以通过运行 `deno task dev` 启动你的 Web 服务器，该服务器
[监听变更](/runtime/getting_started/command_line_interface/#watch-mode)。

```sh
deno task dev
Task dev deno serve --watch -R main.ts
Watcher Process started.
deno serve: Listening on http://0.0.0.0:8000/
```

## 初始化一个空项目

运行 `deno init --empty` 会创建一个带有基础控制台日志的空项目。

```sh
deno init --empty
✅ 项目已初始化

运行以下命令开始

  # 运行程序
  deno run main.ts

  # 运行程序并监听文件变化
  deno task dev
```

你的 [`deno.json`](/runtime/fundamentals/configuration/) 文件将如下所示：

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  }
}
```

现在，你可以通过运行 `deno task dev` 启动项目，它将[监听变更](/runtime/getting_started/command_line_interface/#watch-mode)。

```sh
deno task dev
Task dev deno run --watch main.ts
Watcher Process started.
Hello world!
```

## 生成一个库项目

你可以附加一个 `--lib` 标志，以向你的 `deno.json` 添加额外的参数，例如 `name`、`version` 和 `exports` 字段。

```sh
deno init my_deno_project --lib
✅ 项目已初始化
```

生成的 `deno.json` 如下所示：

```jsonc title="deno.json"
{
  "name": "my_deno_project",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "dev": "deno test --watch mod.ts"
  },
  "license": "MIT",
  "imports": {
    "@std/assert": "jsr:@std/assert@1"
  }
}
```