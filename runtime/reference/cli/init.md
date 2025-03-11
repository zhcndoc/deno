---
title: "`deno init`，启动一个新项目"
oldUrl: /runtime/manual/tools/init/
command: init
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno init"
description: "Scaffold a new Deno project with tests and configuration"
---

## 示例

```sh
$ deno init
✅ 项目初始化完成
运行以下命令开始

  // 运行程序
  deno run main.ts

  // 运行程序并监听文件变化
  deno task dev

  // 运行测试
  deno test

$ deno run main.ts
添加 2 + 3 = 5

$ deno test
检查 file:///dev/main_test.ts
从 main_test.ts 运行 1 个测试
addTest ... ok (6ms)

ok | 1 通过 | 0 失败 (29ms)
```

`init` 子命令将创建两个文件（`main.ts` 和 `main_test.ts`）。这些文件提供了如何编写 Deno 程序和如何为其编写测试的基本示例。`main.ts` 文件导出了一个 `add` 函数，该函数将两个数字相加，而 `main_test.ts` 文件则包含了对此函数的测试。

您还可以为 `deno init` 指定一个参数，以在特定目录中初始化项目：

```sh
$ deno init my_deno_project
✅ 项目初始化完成

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

通过运行 `deno init --lib`，Deno 将引导一个准备好在 [JSR](https://jsr.io/) 上发布的项目。

```sh
$ deno init --lib
✅ 项目初始化完成

运行以下命令开始

  # 运行测试
  deno test

  # 运行测试并监听文件变化
  deno task dev

  # 发布到 JSR（干运行）
  deno publish --dry-run
```

在 `deno.json` 中，您会看到 `name`、`exports` 和 `version` 的条目已预填充。

```json
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

运行 `deno init --serve` 将引导一个与 [`deno serve`](./serve) 一起工作的 Web 服务器。

```sh
$ deno init --serve
✅ 项目初始化完成

运行以下命令开始

  # 运行服务器
  deno serve -R main.ts

  # 运行服务器并监听文件变化
  deno task dev

  # 运行测试
  deno -R test
```

您的 [`deno.json`](/runtime/fundamentals/configuration/) 文件将如下所示：

```json
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

现在，您可以通过运行 `deno task dev` 启动您的 Web 服务器，该服务器
[监听变更](/runtime/getting_started/command_line_interface/#watch-mode)。

```sh
$ deno task dev
任务 dev deno serve --watch -R main.ts
监视器进程已启动。
deno serve: 正在监听 http://0.0.0.0:8000/
```

## 生成一个库项目

您可以附加一个 `--lib` 标志，以向您的 `deno.json` 添加额外的参数，例如 "name"、"version" 和 "exports" 字段。

```sh
$ deno init my_deno_project --lib
✅ 项目初始化完成
```

生成的 `deno.json` 将如下所示：

```jsonc
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