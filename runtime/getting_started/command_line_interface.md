---
last_modified: 2026-05-28
title: 命令行界面
description: "面向 Deno 命令行界面的实用模式：传递脚本参数、运行时标志顺序、监视模式及其排除项，以及热模块替换。"
oldUrl:
  - /manual/getting_started/command_line_interface
  - /runtime/manual/getting_started/command_line_interface/
  - /runtime/fundamentals/command_line_interface/
  - /runtime/manual/tools/
---

Deno CLI 是面向 JavaScript 和 TypeScript 项目的全能工具链：
它可以运行和测试代码、进行格式化和代码检查、管理依赖、编译为
独立二进制文件，以及更多功能。每个子命令（`run`、`test`、`fmt`、
`compile` 等）都有自己的标志；运行 `deno help` 或
`deno <subcommand> --help` 查看它们。

完整的子命令和标志列表，请参阅
[CLI reference](/runtime/reference/cli/)。有关运行代码的基础知识（文件、
URL、stdin、任务、权限标志），请参阅
[Running code guide](/runtime/run/)。本页介绍那些容易让人一开始就困惑的模式：传递参数、标志顺序，以及监视模式的细节。

## 传递脚本参数

脚本参数是在从命令行运行脚本时可以传递给脚本的附加参数。这些参数可以用于根据运行时提供的输入自定义程序的行为。参数应在脚本名称 **之后** 传递。

为了测试这一点，我们可以制作一个将记录传递给它的参数的脚本：

```ts title="main.ts"
console.log(Deno.args);
```

当我们运行该脚本并传递一些参数时，它将记录这些参数到控制台：

```shell
$ deno run main.ts arg1 arg2 arg3
[ "arg1", "arg2", "arg3" ]
```

对于超出简单平面列表的情况，请使用
[`parseArgs` from `jsr:@std/cli`](https://jsr.io/@std/cli/doc/parse-args/~/parseArgs)
或
[`parseArgs` from `node:util`](https://nodejs.org/api/util.html#utilparseargsconfig) 解析参数。

## 参数和标志顺序

:::caution

在脚本名称之后传递的任何内容都会被作为脚本参数传递，而
不会被 Deno 运行时标志消耗。这是一个常见的困惑来源，因此
请仔细检查运行时标志是否出现在脚本名称 **之前**。

:::

这会导致以下陷阱：

```shell
# 好的。我们为 net_client.ts 授予网络权限。
deno run --allow-net net_client.ts

# 不好的！--allow-net 被传递给 Deno.args，抛出网络权限错误。
deno run net_client.ts --allow-net
```

## 监视模式

你可以将 `--watch` 标志提供给 `deno run`、`deno test`、`deno compile` 和 `deno fmt` 来启用内置的文件监视器。监视器在检测到源文件中的更改时启用应用程序的自动重载。在开发过程中这特别有用，因为它允许你立即看到更改的效果，而无需手动重启应用程序。

所监视的文件将取决于使用的子命令：

- 对于 `deno run`、`deno test` 和 `deno compile`，将监视入口文件及其静态导入的所有本地文件。
- 对于 `deno fmt`，将监视作为命令行参数指定的所有本地文件和目录（如果未传递特定文件/目录，则监视工作目录）。

```shell
deno run --watch main.ts
deno test --watch
deno fmt --watch
```

你可以通过提供 `--watch-exclude` 标志来排除路径或模式被监视。语法为 `--watch-exclude=path1,path2`。例如：

```shell
deno run --watch --watch-exclude=file1.ts,file2.ts main.ts
```

这将排除 file1.ts 和 file2.ts 被监视。

要排除一个模式，请记得将其用引号括起来，以防止你的 shell 展开通配符：

```shell
deno run --watch --watch-exclude='*.js' main.ts
```

### 热模块替换

`deno run` 也支持 `--watch-hmr` 标志，它会在运行中的进程中热替换已更改的
模块，而不是重启它。这会在编辑期间保留你的应用程序状态。如果热替换失败，
进程会回退到完全重启。

```shell
deno run --watch-hmr main.ts
```

#### 带原子保存的编辑器

某些编辑器使用“原子保存”（也称为安全写入），即编辑器会先将
你的更改写入临时文件，然后在每次保存时将其重命名覆盖原文件。在 Linux 上，
这会将文件替换为磁盘上的新文件，从而在第一次更改后断开 `--watch-hmr`
使用的文件监视器。其症状是热替换可以工作一次，然后就停止检测到该模块的进一步编辑。

如果遇到这种情况，请在你的编辑器中禁用原子保存：

- **Helix**: 设置 `[editor] atomic-save = false`（默认已启用）。
- **Neovim/Vim**: 设置 `:set backupcopy=yes`。

普通的 `--watch` 不受影响，因为每次更改都会触发一次完整重启，从而重新建立监视器。

## 接下来去哪里

有关本页仅略作提示的主题的更深入内容，请参阅：

- [CLI reference](/runtime/reference/cli/): 每个子命令和标志。
- [Security and permissions](/runtime/fundamentals/security/): 完整介绍 `--allow-*`
  和 `--deny-*` 标志。
- [Modules and dependencies](/runtime/fundamentals/modules/): lockfile、
  导入以及完整性检查。
- [TypeScript](/runtime/fundamentals/typescript/): Deno 何时进行类型检查以及如何
  控制它。
- [Debugging](/runtime/fundamentals/debugging/): `--inspect` 系列标志
  以及如何附加调试器。
