---
title: 命令行接口
description: "关于使用 Deno 命令行接口（CLI）的全面指南。学习如何运行脚本、管理权限、使用观察模式，以及通过命令行标志和选项配置 Deno 运行时行为。"
oldUrl:
  - /manual/getting_started/command_line_interface
  - /runtime/manual/getting_started/command_line_interface/
  - /runtime/fundamentals/command_line_interface/
  - /runtime/manual/tools/
---

Deno 是一个命令行程序。Deno 的命令行接口（CLI）可以用于运行脚本、管理依赖关系，甚至将你的代码编译成独立的可执行文件。到目前为止，经过这些示例，你可能已经熟悉了一些简单的命令。此页面将提供 Deno CLI 更详细的概述。

Deno CLI 具有多个子命令（如 `run`、`init` 和 `test` 等）。它们用于在 Deno 运行时环境中执行不同的任务。每个子命令都有自己的一组标志和选项（例如 --version），可以用于自定义其行为。

你可以通过在终端中运行 `deno help` 子命令或使用 `-h` 或 `--help` 标志来查看所有可用的命令和标志。

查看 [CLI 参考指南](/runtime/reference/cli/) 以获取所有可用子命令和标志的进一步文档。我们将在下面更详细地看几个命令，以查看它们如何被使用和配置。

## 示例子命令 - `deno run`

你可以通过指定其相对于当前工作目录的路径来运行本地 TypeScript 或 JavaScript 文件：

```shell
deno run main.ts
```

Deno 支持直接从 URL 运行脚本。这在快速测试或运行代码而无需先下载它时特别有用：

```shell
deno run https://docs.deno.com/examples/scripts/hello_world.ts
```

你还可以通过标准输入将脚本通过管道传递。这对于与其他命令行工具集成或动态生成脚本很有用：

```shell
cat main.ts | deno run -
```

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

## 参数和标志的顺序

_注意，任何在脚本名称之后传递的内容将作为脚本参数传递，而不是作为 Deno 运行时标志消耗。_ 这导致以下陷阱：

```shell
# 好的。我们为 net_client.ts 授予网络权限。
deno run --allow-net net_client.ts

# 不好的！--allow-net 被传递给 Deno.args，抛出网络权限错误。
deno run net_client.ts --allow-net
```

## 常见标志

某些标志可以与多个相关的子命令一起使用。我们在下面讨论这些标志。

### 观察模式

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

### 热模块替换模式

你可以使用 `--watch-hmr` 标志与 `deno run` 一起启用热模块替换模式。运行时将在不重启程序的情况下尝试就地更新程序。如果就地更新失败，程序仍然会被重启。

```sh
deno run --watch-hmr main.ts
```

当热模块替换被触发时，运行时将分派一个类型为 `hmr` 的 `CustomEvent`，在其 `detail` 对象中包含 `path` 属性。你可以监听此事件并执行任何在模块更新时需要执行的额外逻辑（例如，通过 WebSocket 连接通知浏览器）。

```ts
addEventListener("hmr", (e) => {
  console.log("HMR 触发", e.detail.path);
});
```

### 完整性标志（锁文件）

影响可以将资源下载到缓存的命令：`deno install`、`deno run`、`deno test`、`deno doc` 和 `deno compile`。

```sh
--lock <FILE>    检查指定的锁文件
--frozen[=<BOOLEAN>] 如果锁文件过期则出错
```

了解更多信息请查看
[这里](/runtime/fundamentals/modules/#integrity-checking-and-lock-files)。

### 缓存和编译标志

影响可以填充缓存的命令：`deno install`、`deno run`、`deno test`、`deno doc` 和 `deno compile`。除了上述标志，这还包括那些影响模块解析、编译配置等的标志。

```sh
--config <FILE>               加载配置文件
--import-map <FILE>           加载导入映射文件
--no-remote                   不解析远程模块
--reload=<CACHE_BLOCKLIST>    重新加载源代码缓存（重新编译 TypeScript）
--unstable                    启用不稳定的 API
```

### 运行时标志

影响执行用户代码的命令：`deno run` 和 `deno test`。这些包括上述所有内容以及以下内容。

### 类型检查标志

你可以使用以下命令对代码进行类型检查（不执行）：

```shell
> deno check main.ts
```

你还可以在执行之前使用 `--check` 参数对代码进行类型检查：

```shell
> deno run --check main.ts
```

此标志影响 `deno run`、`deno eval`、`deno repl`。下面的表格描述了各种子命令的类型检查行为。在此，“本地”意味着只有本地代码中的错误会导致类型错误，从 https URL 导入的模块（远程）可能有未报告的类型错误。（要打开所有模块的类型检查，请使用 `--check=all`。）

| 子命令         | 类型检查模式 |
| -------------- | ------------------ |
| `deno bench`   | 📁 本地           |
| `deno check`   | 📁 本地           |
| `deno compile` | 📁 本地           |
| `deno eval`    | ❌ 无            |
| `deno repl`    | ❌ 无            |
| `deno run`     | ❌ 无            |
| `deno test`    | 📁 本地           |

### 权限标志

这些在 [这里](/runtime/fundamentals/security/) 列出。

### 其他运行时标志

更多影响执行环境的标志。

```sh
--cached-only                要求远程依赖项已缓存
--inspect=<HOST:PORT>        在 host:port 上激活检查器 ...
--inspect-brk=<HOST:PORT>    在 host:port 上激活检查器并在 ... 处中断
--inspect-wait=<HOST:PORT>   在 host:port 上激活检查器并等待 ...
--location <HREF>            一些 Web API 使用的 'globalThis.location' 的值
--prompt                     如果未传递所需权限，则回退到提示
--seed <NUMBER>              随机生成 Math.random()
--v8-flags=<v8-flags>        设置 V8 命令行选项。帮助参见 ...
```