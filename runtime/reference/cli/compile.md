---
title: "`deno compile`，独立可执行文件"
oldUrl:
  - /runtime/manual/tools/compile/
  - /runtime/manual/tools/compiler/
  - /runtime/reference/cli/compiler/
command: compile
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno compile"
description: "Compile your code into a standalone executable"
---

## 标志

与 [`deno install`](/runtime/reference/cli/install/) 一样，执行脚本时使用的运行时标志必须在编译时指定。这包括权限标志。

```sh
deno compile --allow-read --allow-net jsr:@std/http/file-server
```

[脚本参数](/runtime/getting_started/command_line_interface/#passing-script-arguments) 可以部分嵌入。

```console
deno compile --allow-read --allow-net jsr:@std/http/file-server -p 8080

./file_server --help
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

```shell
deno compile --include calc.ts --include better_calc.ts main.ts
```

## 包含数据文件或目录

从 Deno 2.1 开始，您可以通过 `--include <path>` 标志在可执行文件中包含文件或目录。

```shell
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

## Worker

与不可静态分析的动态导入类似，默认情况下，`[workers](../web_platform_apis/#web-workers)` 的代码不会包含在编译后的可执行文件中。有两种方法可以包含 workers：

1. 使用 `--include <path>` 标志包含工作代码。

```shell
deno compile --include worker.ts main.ts
```

2. 使用可静态分析的导入导入工作模块。

```ts
// main.ts
import "./worker.ts";
```

```shell
deno compile main.ts
```

## 代码签名

### macOS

默认情况下，在 macOS 上，编译后的可执行文件将使用临时签名签名，等同于运行 `codesign -s -`：

```shell
$ deno compile -o main main.ts
$ codesign --verify -vv ./main

./main: 磁盘上的有效
./main: 满足其指定要求
```

您可以在对可执行文件进行代码签名时指定签名身份，就像您对任何其他 macOS 可执行文件所做的那样：

```shell
codesign -s "Developer ID Application: Your Name" ./main
```

有关 macOS 上代码签名和公证的更多信息，请参考 [官方文档](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution)。

### Windows

在 Windows 上，可以使用 `SignTool.exe` 工具对编译后的可执行文件进行签名。

```shell
$ deno compile -o main.exe main.ts
$ signtool sign /fd SHA256 main.exe
```

## 在可执行文件中不可用

- [Web 存储 API](/runtime/reference/web_platform_apis/#web-storage)
- [Web 缓存](/api/web/~/Cache)
