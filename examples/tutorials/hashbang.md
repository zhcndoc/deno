---
title: "可执行脚本"
description: "Guide to creating executable scripts with Deno. Learn about hashbangs, file permissions, cross-platform compatibility, and how to create command-line tools that can run directly from the terminal."
url: /examples/hashbang_tutorial/
oldUrl:
  - /runtime/manual/examples/hashbang/
  - /runtime/tutorials/hashbang/
---

使 Deno 脚本可执行在创建小工具或用于文件操作、数据处理或从命令行运行的重复任务等任务时非常方便。可执行脚本允许您创建即席解决方案，而无需设置整个项目。

## 创建示例脚本

要使脚本可执行，请以哈希bang（有时称为 shebang）开头。它是一串字符（#!），告诉您的操作系统如何执行脚本。后面跟着应用于运行脚本的解释器的路径。

:::note

要在 Windows 上使用哈希bang，您需要安装 Windows 子系统 Linux（WSL）或使用类似 Unix 的 shell，如
[Git Bash](https://git-scm.com/downloads)。

:::

我们将创建一个简单的脚本，使用 [Deno.env](/api/deno/~/Deno.env) API 打印 Deno 安装路径。

创建一个名为 `hashbang.ts` 的文件，内容如下：

```ts title="hashbang.ts"
#!/usr/bin/env -S deno run --allow-env
const path = Deno.env.get("DENO_INSTALL");

console.log("Deno 安装路径:", path);
```

该脚本告诉系统使用 deno 运行时来运行脚本。-S 标志将命令分割成参数，并指示应将后续参数（`deno run --allow-env`）传递给 env 命令。

然后，脚本使用 `Deno.env.get()` 检索与环境变量 `DENO_INSTALL` 关联的值，并将其分配给名为 `path` 的变量。最后，它使用 `console.log()` 将路径打印到控制台。

### 执行脚本

为了执行脚本，您可能需要给予脚本执行权限，您可以使用 `chmod` 命令和 `+x` 标志（用于执行）来实现：

```sh
chmod +x hashbang.ts
```

您可以直接在命令行中执行脚本：

```sh
./hashbang.ts
```

## 在没有扩展名的文件中使用哈希bang

为了简洁，您可能希望省略脚本文件名的扩展名。在这种情况下，在脚本本身中使用 `--ext` 标志提供一个，然后您可以仅使用文件名运行脚本：

```shell title="my_script"
$ cat my_script
#!/usr/bin/env -S deno run --allow-env --ext=js
console.log("你好!");
$ ./my_script
你好!
```

🦕 现在您可以直接从命令行执行 Deno 脚本！记得为您的脚本文件设置执行权限（`chmod +x`），您就可以开始构建从简单的实用工具到复杂工具的任何东西。查看 [Deno 示例](/examples/) 获取您可以编写的脚本灵感。