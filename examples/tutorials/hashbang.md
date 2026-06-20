---
last_modified: 2026-06-17
title: "可执行脚本"
description: "使用 Deno 创建可执行脚本的指南。了解 hashbang、文件权限、跨平台兼容性，以及如何创建可直接从终端运行的命令行工具。"
url: /examples/hashbang_tutorial/
oldUrl:
  - /runtime/manual/examples/hashbang/
  - /runtime/tutorials/hashbang/
---

在创建小型工具、进行文件操作、数据处理，或执行需要从命令行运行的重复任务时，使 Deno 脚本可执行会非常方便。可执行脚本让您无需搭建整个项目，就能创建即用型解决方案。

## 创建示例脚本

要让脚本可执行，请以哈希 bang（有时称为 shebang）开头。它是一串字符（#!），用于告诉操作系统如何执行脚本。其后跟着用于运行该脚本的解释器路径。

:::note

要在 Windows 上使用哈希 bang，您需要安装 Windows 子系统 Linux（WSL）或使用类似 Unix 的 shell，例如
[Git Bash](https://git-scm.com/downloads)。

:::

我们将创建一个简单的命令行问候程序，它从 [Deno.args](/api/deno/~/Deno.args) 中读取第一个参数，并在未提供参数时回退到默认值。这几乎是每个 Deno CLI 工具的起始形态。

创建一个名为 `hashbang.ts` 的文件，内容如下：

```ts title="hashbang.ts"
#!/usr/bin/env -S deno run
const name = Deno.args[0] ?? "world";

console.log(`Hello, ${name}!`);
```

第一行就是哈希 bang。它会告诉系统使用 `/usr/bin/env` 运行该文件，随后由它在您的 `PATH` 中找到 `deno`，并在脚本上调用 `deno run`。`-S` 标志会将 `deno run` 拆分为单独的参数，从而使 `env` 能正确处理；如果没有 `-S`，整个字符串会作为一个参数名传入，`env` 将无法找到名为 `deno run` 的程序。这里没有 `--allow-*` 标志，因为脚本只读取 `Deno.args`，这始终可用。只有当脚本尝试使用受沙箱限制的 API 时，Deno 才会提示权限请求。

:::note

`-S` 标志是 GNU coreutils 和 BSD/macOS `env` 提供的扩展。它不是 POSIX 的一部分，因此在提供更精简 `env` 的系统上（例如某些嵌入式或 BusyBox 环境）hashbang 可能无法工作。在这些系统上，请改为使用 `deno run script.ts` 显式运行脚本。

:::

`Deno.args` 是命令行中脚本名后面的参数数组。`Deno.args[0]` 是第一个参数；当未提供参数时，`?? "world"` 会替换为 `"world"`。

### 执行脚本

在直接运行文件之前，先使用 `chmod` 为其添加可执行权限（每个文件只需执行一次）：

```sh
chmod +x hashbang.ts
```

现在从命令行调用它。没有参数时会使用默认值；传入一个名字时，则会向该名字问候：

```console
$ ./hashbang.ts
Hello, world!
$ ./hashbang.ts Ada
Hello, Ada!
```

## 在没有扩展名的文件中使用哈希 bang

为了简洁，您可能希望省略脚本文件名的扩展名。在这种情况下，请在脚本本身中使用 `--ext` 标志提供一个扩展名，然后就可以仅使用文件名运行脚本：

```shell title="my_script"
$ cat my_script
#!/usr/bin/env -S deno run --allow-env --ext=js
console.log("你好!");
$ ./my_script
你好!
```

🦕 现在您可以直接从命令行执行 Deno 脚本！记得为脚本文件设置执行权限（`chmod +x`），然后就可以开始构建从简单实用工具到复杂工具的各种内容了。请查看 [Deno 示例](/examples/) 获取您可以编写的脚本灵感。