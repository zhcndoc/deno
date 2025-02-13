---
title: 创建一个 Deno 项目
oldUrl: /runtime/manual/getting_started/first_steps/
---

Deno 拥有许多 [内置工具](/runtime/reference/cli/) 使您的开发体验尽可能顺畅。其中一个工具是 [项目初始化器](/runtime/reference/cli/init)，它创建一个具有基本文件结构和配置的新 Deno 项目。

虽然您可以使用 JavaScript，但 Deno 也内置支持 [TypeScript](https://www.typescriptlang.org/)，因此我们在本指南中将使用 TypeScript。如果您更愿意使用 JavaScript，可以将文件重命名为 `.js` 并删除类型注解。

## 初始化新项目

要初始化一个新的 Deno 项目，请在终端中运行以下命令：

```bash
deno init my_project
```

这将创建一个名为 `my_project` 的新目录，结构如下：

```plaintext
my_project
├── deno.json
├── main_test.ts
└── main.ts
```

创建一个 `deno.json` 文件以 [配置您的项目](/runtime/fundamentals/configuration/)，并创建两个 TypeScript 文件；`main.ts` 和 `main_test.ts`。`main.ts` 文件是您编写应用程序代码的地方，初始创建时它将包含一个简单的程序，用于将两个数字相加。`main_test.ts` 文件是您可以编写测试的地方，初始时它将包含一个用于您的加法程序的测试。

## 运行您的项目

您可以使用以下命令运行该程序：

```bash
$ deno main.ts
Add 2 + 3 = 5
```

## 运行您的测试

Deno 有一个 [内置测试运行器](/runtime/fundamentals/testing/)。您可以为您的代码编写测试，并使用 `deno test` 命令运行它们。使用以下命令在您的新项目中运行测试：

```bash
$ deno test
running 1 test from ./main_test.ts     
addTest ... ok (1ms)

ok | 1 passed | 0 failed (3ms)
```

现在您已经设置了一个基本项目，可以开始构建您的应用程序。查看我们的 [示例和教程](/examples/) 获取有关使用 Deno 构建的更多想法。

您可以 [在这里了解更多关于在 Deno 中使用 TypeScript 的信息](/runtime/fundamentals/typescript)。