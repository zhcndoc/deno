---
last_modified: 2025-03-10
title: "初始化一个项目"
description: "创建并构建新的 Deno 项目的指南。了解如何启动新项目、配置任务、管理依赖以及应用程序扩展的最佳实践。"
url: /examples/initialize_project_tutorial/
oldUrl:
---

虽然可以直接使用 `deno run` 运行脚本，但对于较大的项目，建议创建一个合理的目录结构。这样你可以更轻松地组织代码、管理依赖、编写脚本任务和运行测试。

通过运行以下命令初始化一个新项目：

```sh
$ deno init my_project
✅ 项目已初始化

运行以下命令以开始使用

  cd my_project

  # 运行服务器
  deno run --allow-net main.ts

  # 运行服务器并监视文件变化
  deno task dev

  # 运行测试
  deno test
```

`my_project` 是你的项目名称。你可以
[进一步了解项目结构](/runtime/)。

### 运行你的项目

导航到项目目录：

```sh
cd my_project
```

然后你可以直接使用 `deno task` 命令运行项目：

```sh
$ deno task dev
Task dev deno run --watch --allow-net main.ts
Watcher Process started.
Listening on http://0.0.0.0:8000/ (http://localhost:8000/)
```

查看你新项目中的 `deno.json` 文件。你应该在 "tasks" 字段看到一个 `dev` 任务。

```json title="deno.json"
"tasks": {
  "dev": "deno run --watch --allow-net main.ts"
},
```

`dev` 任务是一个常见任务，用于在开发模式下运行项目。正如你所看到的，它使用 `--watch` 标志运行 `main.ts` 文件，当有更改时会自动重新加载脚本。如果你打开 `main.ts` 文件并进行更改，就可以看到这一点的实际效果。

### 运行测试

在项目目录中运行：

```sh
$ deno test
Check main_test.ts
running 2 tests from ./main_test.ts
returns html on / ... ok (11ms)
returns json on /api ... ok (0ms)

ok | 2 passed | 0 failed (13ms)
```

这将执行项目中的所有测试。你可以阅读更多关于
[Deno 中的测试](/runtime/test/) 的内容，我们会在后续教程中更深入地介绍测试。目前你有一个测试文件 `main_test.ts`，它测试 `main.ts` 中的请求处理程序。

### 向你的项目添加内容

`main.ts` 文件是你应用程序的入口点。你将在这里编写主要的程序逻辑。在开发项目时，你通常会先用自己的代码替换默认的 HTTP 服务器；它的路由和请求处理程序只是一个起点，供你在此基础上继续构建。

除了初始文件外，你还可能会创建其他模块（文件）来组织代码。考虑将相关功能分组成单独的文件。请记住，Deno [支持 ES 模块](/runtime/fundamentals/modules/)，因此你可以使用导入和导出语句来组织代码。

Deno 项目的示例文件夹结构：

```sh
my_project/
├── deno.json
├── main.ts
├── main_test.ts
├── routes/
│   ├── home.ts
│   ├── about.ts
├── services/
│   ├── user.ts
│   ├── post.ts
└── utils/
    ├── logger.ts
    ├── logger_test.ts
    ├── validator_test.ts
    └── validator.ts
```

这种结构可以保持你的项目整洁，并更容易找到和管理文件。

🦕 恭喜你！现在你知道如何用 `deno init` 创建一个全新的项目。请记住，Deno 鼓励简洁，避免复杂的构建工具。保持你的项目模块化、可测试且有条理。随着项目的发展，调整结构以适应你的需求。最重要的是，享受探索 Deno 功能的乐趣！