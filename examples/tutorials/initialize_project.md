---
title: "初始化一个项目"
description: "Guide to creating and structuring new Deno projects. Learn about starting a new project, task configuration, dependency management, and best practices for growing applications."
url: /examples/initialize_project_tutorial/
oldUrl:
---

虽然可以直接使用 `deno run` 运行脚本，但对于较大的项目，建议创建一个合理的目录结构。这样你可以更轻松地组织代码、管理依赖、编写脚本任务和运行测试。

通过运行以下命令初始化一个新项目：

```sh
deno init my_project
```

其中 `my_project` 是你的项目名称。你可以
[阅读更多关于项目结构的信息](/runtime/getting_started/first_project/)。

### 运行你的项目

导航到项目目录：

```sh
cd my_project
```

然后你可以直接使用 `deno task` 命令运行项目：

```sh
deno run dev
```

查看你新项目中的 `deno.json` 文件。你应该在 "tasks" 字段看到一个 `dev` 任务。

```json title="deno.json"
"tasks": {
  "dev": "deno run --watch main.ts"
},
```

`dev` 任务是一个常见任务，用于在开发模式下运行项目。正如你所看到的，它使用 `--watch` 标志运行 `main.ts` 文件，当有更改时会自动重新加载脚本。如果你打开 `main.ts` 文件并进行更改，就可以看到这一点的实际效果。

### 运行测试

在项目目录中运行：

```sh
deno test
```

这将执行项目中的所有测试。你可以阅读更多关于
[在 Deno 中测试的信息](/runtime/fundamentals/testing/)，我们将在稍后的教程中更深入地讨论测试。此时你有一个测试文件 `main_test.ts`，它测试 `main.ts` 中的 `add` 函数。

### 向你的项目添加内容

`main.ts` 文件作为应用程序的入口点。这里是你编写主要程序逻辑的地方。在开发项目时，你将从删除默认的加法程序开始，并将其替换为自己的代码。例如，如果你正在构建一个网络服务器，这里是你设置路由和处理请求的地方。

除了初始文件外，你可能还会创建其他模块（文件）来组织代码。考虑将相关功能分组成单独的文件。请记住，Deno [支持 ES 模块](/runtime/fundamentals/modules/)，因此你可以使用导入和导出语句来组织代码。

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