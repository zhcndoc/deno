---
last_modified: 2026-06-15
title: "监视模式与 HMR"
description: "Deno 内置文件监视器：使用 --watch 在更改时重新运行代码，控制监视内容，并通过 --watch-hmr 热替换模块。"
---

Deno 内置了文件监视器，因此在编辑时你不需要 `nodemon` 或任何其他外部工具来重新加载程序。本页将介绍会被监视的内容、如何排除路径，以及热模块替换。

## 监视模式

你可以为 `deno run`、`deno test` 和 `deno fmt` 提供 `--watch` 标志，以启用内置文件监视器。该监视器会在检测到源文件发生变化时自动重新加载你的应用程序。这在开发过程中尤其有用，因为它可以让你无需手动重启应用程序，就能立即看到更改的效果。

```shell
deno run --watch main.ts
deno test --watch
deno fmt --watch
```

被监视的文件将取决于所使用的子命令：

- 对于 `deno run` 和 `deno test`，会监视入口点以及入口点静态导入的所有本地文件。
- 对于 `deno fmt`，会监视作为命令行参数指定的所有本地文件和目录（如果没有传入特定的文件/目录，则监视工作目录）。

你可以通过提供 `--watch-exclude` 标志来从监视中排除路径或模式。语法是 `--watch-exclude=path1,path2`。例如：

```shell
deno run --watch --watch-exclude=file1.ts,file2.ts main.ts
```

这将使 file1.ts 和 file2.ts 不被监视。

要排除某个模式，请记得将其用引号括起来，以防止你的 shell 展开 glob：

```shell
deno run --watch --watch-exclude='*.js' main.ts
```

## 热模块替换

`deno run` 还支持 `--watch-hmr` 标志，它会在运行中的进程中热替换已更改的模块，而不是重启进程。这样可以在编辑过程中保留应用程序的状态。如果热替换失败，进程会回退为完整重启。

```shell
deno run --watch-hmr main.ts
```

### 带原子保存的编辑器

某些编辑器使用“原子保存”（也称为安全写入），即编辑器会将你的更改写入临时文件，然后在每次保存时将其重命名覆盖原文件。在 Linux 上，这会把磁盘上的文件替换为一个新文件，这可能会在第一次更改后使 `--watch-hmr` 使用的文件监视器失去连接。其表现是热替换只会生效一次，然后就停止检测该模块后续的编辑。

如果你遇到这种情况，请在编辑器中禁用原子保存：

- **Helix**：设置 `[editor] atomic-save = false`（默认启用）。
- **Neovim/Vim**：设置 `:set backupcopy=yes`。

普通的 `--watch` 不受影响，因为每次更改都会触发完整重启，从而重新建立监视器。
