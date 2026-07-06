---
last_modified: 2026-06-25
title: "deno compile"
oldUrl:
  - /runtime/manual/tools/compile/
  - /runtime/manual/tools/compiler/
  - /runtime/reference/cli/compiler/
command: compile
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno compile"
description: "将您的代码编译为独立可执行文件"
---

## 标志

与 [`deno install`](/runtime/reference/cli/install/) 一样，执行脚本时使用的运行时标志必须在编译时指定。这包括权限标志。

```sh
deno compile --allow-read --allow-net jsr:@std/http/file-server
```

[脚本参数](/runtime/run/#passing-script-arguments) 可以部分嵌入。

```sh
deno compile --allow-read --allow-net jsr:@std/http/file-server -p 8080

./file_server --help
```

## 框架检测

从 Deno 2.8 开始，`deno compile .`（或 `deno compile <directory>`）会检测常见的 Web 框架，并生成一个知道如何启动它们的入口点。检测到的构建脚本会先运行，因此编译后的二进制文件始终包含最新构建。

支持的框架：

- Next.js
- Astro
- Fresh (1.x 和 2.x)
- Remix
- SvelteKit
- Nuxt
- SolidStart
- TanStack Start
- Vite (SSR, plus SPA/MPA projects served as static output)

```sh
# 在 Next.js / Astro / Fresh / 等项目中
deno compile .

# 或指向某个特定应用目录
deno compile ./apps/web
```

生成的入口点使用 `import.meta.dirname`，因此框架资源路径可以在编译后的二进制文件内部，正确地相对于 [虚拟文件系统](#including-data-files-or-directories) 解析。

如果项目不匹配任何受支持的框架，`deno compile` 将报错退出。

## 监听模式

传递 `--watch` 可在编译图中的文件发生变化时重新构建可执行文件：

```sh
deno compile --watch main.ts
```

使用 `--watch-exclude` 可防止特定路径触发重建，并使用
`--no-clear-screen` 可在两次重建之间保留终端输出：

```sh
deno compile --watch --watch-exclude=./dist --no-clear-screen main.ts
```

## 交叉编译

您可以使用 `--target` 标志为其他平台进行交叉编译二进制文件。

```
# 为 Apple Silicon 进行交叉编译
deno compile --target aarch64-apple-darwin main.ts

# 为 Windows 进行交叉编译并添加图标
deno compile --target x86_64-pc-windows-msvc --icon ./icon.ico main.ts
```

### 支持的目标

Deno 支持针对所有目标的交叉编译，而不管主机平台。

| 操作系统 | 架构      | 目标                          |
| -------- | --------- | ----------------------------- |
| Windows  | x86_64    | `x86_64-pc-windows-msvc`      |
| macOS    | x86_64    | `x86_64-apple-darwin`         |
| macOS    | ARM64     | `aarch64-apple-darwin`        |
| Linux    | x86_64    | `x86_64-unknown-linux-gnu`    |
| Linux    | ARM64     | `aarch64-unknown-linux-gnu`   |

## denort 二进制文件

`deno compile` 将您的程序嵌入到 `denort`（“Deno 运行时”）中：这是一个精简版的 Deno 构建，仅包含运行已编译程序所需的内容，不包含任何工具子命令。使用 `denort` 作为基础而不是完整的 `deno` 二进制文件，是编译后的可执行文件更小的原因。

第一次为某个给定的 Deno 版本和目标进行编译时，Deno 会从 `dl.deno.land` 下载匹配的 `denort-<target>.zip` 并将其缓存到 `DENO_DIR` 中。这也是交叉编译的工作方式：使用 `--target` 编译会获取该平台的 `denort`。后续的编译会复用缓存的二进制文件，并且可以离线运行。

要使用自定义的或本地构建的运行时作为基础，请将 `DENORT_BIN` 环境变量设置为其路径。Deno 也会自动识别放在 `deno` 可执行文件旁边的 `denort` 二进制文件。

## 图标

可以通过在目标为 Windows 时使用 `--icon` 标志来为可执行文件添加图标。图标必须为 `.ico` 格式。

```
deno compile --icon icon.ico main.ts

# 带有图标的交叉编译
deno compile --target x86_64-pc-windows-msvc --icon ./icon.ico main.ts
```

## 动态导入

默认情况下，可静态分析的动态导入（在 `import("...")` 调用表达式中包含字符串字面量的导入）会被包含在输出中。

```ts
// calculator.ts 及其依赖将包含在二进制文件中
const calculator = await import("./calculator.ts");
```

但不可静态分析的动态导入则不会：

```ts
const specifier = condition ? "./calc.ts" : "./better_calc.ts";
const calculator = await import(specifier);
```

要包含不可静态分析的动态导入，请指定 `--include <path>` 标志。

```sh
deno compile --include calc.ts --include better_calc.ts main.ts
```

## 包含数据文件或目录

从 Deno 2.1 开始，您可以通过 `--include <path>` 标志在可执行文件中包含文件或目录。

```sh
deno compile --include names.csv --include data main.ts
```

然后通过 `import.meta.dirname` 相对于当前模块的目录路径读取文件：

```ts
// main.ts
const names = Deno.readTextFileSync(import.meta.dirname + "/names.csv");
const dataFiles = Deno.readDirSync(import.meta.dirname + "/data");

// 在这里使用 names 和 dataFiles
```

请注意，这目前仅适用于文件系统上的文件，不适用于远程文件。

`--include` 会将嵌入的 `.js` 和 `.ts` 文件视为模块图的根，因此会解析并转译它们。若要按原样嵌入文件，而不进行任何模块解析，请改用 `--include-as-is`。对于已处理过、并且作为 Deno 模块会解析失败的预构建前端打包产物（例如 Vite 或 webpack 输出），这是正确的选择：

```sh
deno compile --include-as-is ./dist main.ts
```

### 在 `deno.json` 中配置 `include` / `exclude`

可以在 `deno.json` 中以声明式方式设置 `--include` 和 `--exclude` 路径，这样您就不必在每次调用 `deno compile` 时重复指定它们：

```jsonc title="deno.json"
{
  "compile": {
    "include": ["names.csv", "data", "worker.ts"],
    "exclude": ["data/secrets", "**/*.test.ts"]
  }
}
```

CLI 标志会与配置合并：`--include` 和 `--exclude` 会追加到 `deno.json` 中的列表，而不是替换它们。更多详情请参阅配置指南中的 [Compile config](/runtime/reference/deno_json/#compile-config) 部分，包括如何在同一块中声明 `permissions`。

## Worker

与不可静态分析的动态导入类似，默认情况下，`[worker](../web_platform_apis/#web-workers)` 的代码不会包含在编译后的可执行文件中。有两种方法可以包含 worker：

1. 使用 `--include <path>` 标志包含 worker 代码。

```sh
deno compile --include worker.ts main.ts
```

2. 使用可静态分析的导入导入 worker 模块。

```ts
// main.ts
import "./worker.ts";
```

```sh
deno compile main.ts
```

## 打包依赖

:::caution

`--bundle` 是实验性功能，可能会发生变化。某些动态模式
尚不受支持（参见下面的 [限制](#limitations)）。

:::

默认情况下，`deno compile` 会将解析后的整个 `node_modules` 树嵌入到
可执行文件中。对于包含大量 npm 依赖的项目，这可能会使二进制文件变大
并且启动变慢。`--bundle` 标志会先通过打包器处理您的入口文件，然后再嵌入，
因此最终进入二进制文件的只会是程序实际用到的代码。

```sh
deno compile --bundle main.ts
```

对于纯 ESM 依赖树，树摇会移除所有未使用内容，npm 负载会被完全丢弃，从而生成一个小得多的二进制文件。当命中 CommonJS 包或原生插件（`.node`）时，相关包会被嵌入，以便它们在运行时仍可工作，但未命中的包仍会被排除。

`--bundle` 可以自动识别若干真实世界中的模式：

- **CommonJS 和原生插件** — 会检测 CJS 依赖和 `.node` 原生插件，并嵌入提供它们的包。
- **Workers** — 会发现 `new Worker(new URL("./worker.ts", import.meta.url), ...)` 调用，每个 worker 都会单独打包并与主包一起嵌入。
- **`package.json` 读取** — 在运行时读取自身 `package.json` 的包（例如为了报告版本号）会自动包含该文件。

### 压缩打包结果

将 `--bundle` 与 `--minify` 结合使用，可以压缩打包后的输出。这会同时减小嵌入包的大小和运行时内存使用，但代价是堆栈跟踪可读性降低。

```sh
deno compile --bundle --minify main.ts
```

`--minify` 只有与 `--bundle` 结合使用时才有意义。

### 限制

由于打包依赖于对代码进行静态分析，无法追踪的模式会从二进制文件中移除：

- 对不是字符串字面量的标识符执行动态 `require()` / `import()`。
- 使用计算得到的 URL 启动的 workers，或从传递依赖而不是您自己的源代码中启动的 workers。

如果您的程序依赖这些内容，请将其保持为可静态分析，使用 [`--include`](#including-data-files-or-directories) 添加所需文件，或者在不使用 `--bundle` 的情况下编译。

## Self-Extracting Executables

By default, compiled executables serve embedded files through a virtual file system in memory. The `--self-extracting` flag changes this behavior so that the binary extracts all embedded files to disk on first run and uses real file system operations at runtime.

```sh
deno compile --self-extracting main.ts
```

This is very useful in scenarios where code needs real files on disk, such as native plugins or native code that reads relative files.

The extraction directory is chosen in order of priority:

1. `<exe_dir>/.<exe_name>/<hash>/` (adjacent to the compiled binary)
2. Platform data directory fallback:
   - Linux: `$XDG_DATA_HOME/<exe_name>/<hash>` or
     `~/.local/share/<exe_name>/<hash>`
   - macOS: `~/Library/Application Support/<exe_name>/<hash>`
   - Windows: `%LOCALAPPDATA%\<exe_name>\<hash>`

Files are extracted only once — subsequent runs reuse the directory if it already exists and the hash matches.

### Trade-offs

Self-extracting mode provides broader compatibility, but there are some trade-offs:

- **Initial startup cost**: The first run takes longer because files must be extracted.
- **Disk usage**: Extracted files take up additional disk space.
- **Memory usage**: Memory usage is higher because embedded contents can no longer be referenced as static data.
- **Tampering risk**: Users or other code may modify the extracted files on disk.

## 代码签名

### macOS

默认情况下，在 macOS 上，编译后的可执行文件将使用临时签名进行签名，等同于运行 `codesign -s -`：

```sh
deno compile -o main main.ts
codesign --verify -vv ./main

./main: 磁盘上的有效
./main: 满足其指定要求
```

您可以在对可执行文件进行代码签名时指定签名身份，就像您对任何其他 macOS 可执行文件所做的那样：

```sh
codesign -s "Developer ID Application: Your Name" ./main
```

有关 macOS 上代码签名和公证的更多信息，请参考 [官方文档](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution)。

### Windows

在 Windows 上，可以使用 `SignTool.exe` 工具对编译后的可执行文件进行签名。

```sh
deno compile -o main.exe main.ts
signtool sign /fd SHA256 main.exe
```

## 可执行文件中的持久化存储

编译后的二进制文件会被视为一个独立应用，因此基于源的
存储会在平台的应用数据目录中跨运行持久化
（Windows 上为 `%LOCALAPPDATA%`，macOS 上为 `~/Library/Application Support`，
Linux 上为 `$XDG_DATA_HOME`）：

- [`localStorage`](/runtime/reference/web_platform_apis/#web-storage) 和
  [Web Cache API](/api/deno/~/Cache) 会在该目录中读写。
- 不带路径调用的 [`Deno.openKv()`](/api/deno/~/Deno.openKv) 会在此处打开一个
  持久化数据库，而不是回退到内存数据库。

每个编译后的应用都会根据其标识获得自己的位置，因此不同应用不会共享存储。
这个标识来自 `--app-name` 标志，它会在编译时被写入，并在未指定时回退到输出文件名：

```sh
deno compile --app-name my-app main.ts
```

由于决定目录的是名称（而不是模块路径），因此即使你重命名二进制文件，存储也会
在多次运行之间保持稳定；使用相同 `--app-name` 构建的两个二进制文件会共享同一个存储，
而不同名称的应用则彼此隔离。使用不同的 `--app-name` 重新编译会启动一个全新的存储。
