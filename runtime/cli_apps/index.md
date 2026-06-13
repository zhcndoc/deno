---
title: "构建 CLI 应用"
description: "使用 Deno 构建命令行工具：读取参数和 stdin，提示用户，设置退出码，编译为单个自包含可执行文件，并分发你的工具。"
---

Deno 是发布命令行工具的绝佳方式。你的工具只是 TypeScript，因此
运行它不需要构建步骤。准备分发时，`deno compile` 会将其转换为单个自包含的可执行文件，
在未安装 Deno 的情况下也能运行。

## 读取命令行参数

原始参数可通过 [`Deno.args`](/api/deno/~/Deno.args) 获取。对于实际工具，
请使用 [`@std/cli`](https://jsr.io/@std/cli) 进行解析，它可以处理标志、选项和默认值：

```ts title="greet.ts"
import { parseArgs } from "jsr:@std/cli/parse-args";

const flags = parseArgs(Deno.args, {
  string: ["name"],
  default: { name: "world" },
});

console.log(`Hello, ${flags.name}!`);
```

```sh
$ deno run greet.ts --name=Deno
Hello, Deno!
```

## 从 stdin 读取并检测 TTY

好的 CLI 工具可以与管道组合使用。[`Deno.stdin`](/api/deno/~/Deno.stdin)
将标准输入暴露为符合 Web 标准的 `ReadableStream`，因此读取所有
管道输入并将其作为文本处理的最简单方法是将其包装在 `Response` 中：

```ts
const input = await new Response(Deno.stdin.readable).text();
```

当你的工具两种方式都可用时，请使用
[`Deno.stdin.isTerminal()`](/api/deno/~/Deno.stdin.isTerminal) 来判断
stdin 是交互式终端还是管道，并据此分支处理。这也是工具决定是否输出颜色和进度条（交互式）
或纯粹的机器可读输出（管道）的方式。这里，当没有管道输入时，工具会回退为向用户询问：

```ts title="count.ts"
let input: string;

if (Deno.stdin.isTerminal()) {
  input = prompt("输入一些文本：") ?? "";
} else {
  input = await new Response(Deno.stdin.readable).text();
}

console.log(`获取到 ${input.trim().length} 个字符`);
```

```sh
$ echo "hello from a pipe" | deno run count.ts
获取到 17 个字符
$ deno run count.ts
输入一些文本： hi
获取到 2 个字符
```

读取 stdin 不需要任何权限标志。

如果你正在移植 Node.js CLI，或者使用会读取输入的 npm 库，
Node 风格的 `process.stdin`（来自 `node:process` 或 `process` 全局对象）在 Deno 中也同样可用，
因此那段代码无需修改即可运行。

## 提示用户

对于简单的交互式输入，Deno 提供了浏览器全局函数 `prompt()`、
`confirm()` 和 `alert()`。它们会阻塞直到用户回应（执行会暂停在那一行，直到输入到来前不会运行其他内容），
并且不需要导入或权限：

```ts title="setup.ts"
const name = prompt("项目名称：", "my-app");
const ok = confirm(`创建 ${name}？`);
if (!ok) Deno.exit(1);
console.log(`正在创建 ${name}...`);
```

如果需要更高级的功能，请使用 [`@std/cli`](https://jsr.io/@std/cli)。除了
参数解析之外，它还包含旋转加载器、进度条和选择提示。这些内容位于以 `unstable-`
为前缀的模块中，因此它们的 API 可能仍会变化。`Spinner` 类会在你的工具运行时显示一条动画状态行：

```ts title="spin.ts"
import { Spinner } from "jsr:@std/cli/unstable-spinner";

const spinner = new Spinner({ message: "正在下载..." });
spinner.start();
await new Promise((resolve) => setTimeout(resolve, 2000));
spinner.stop();
console.log("完成");
```

```sh
deno run spin.ts
```

## 使用正确的代码退出

Shell、脚本和 CI 系统都依赖你的工具的退出码：零表示
成功，其他任何值都表示失败。[`Deno.exit()`](/api/deno/~/Deno.exit)
会立即以给定代码终止进程：

```ts
if (Deno.args.length === 0) {
  console.error("用法：check <file>...");
  Deno.exit(2);
}
```

由于 [`Deno.exit()`](/api/deno/~/Deno.exit) 会立即停止进程，
像刷新日志或 `finally` 块之类的待处理工作都不会运行。当你想要
记录失败但继续执行时，请改用
[`Deno.exitCode`](/api/deno/~/Deno.exitCode)。进程会继续运行，
自然结束，然后以你设置的代码退出。这是适用于
linter 和批处理工具的正确模式，它们应该报告每个问题，而不是
在第一个问题处停止：

```ts title="check.ts"
for (const file of Deno.args) {
  try {
    await Deno.lstat(file);
  } catch {
    console.error(`缺失：${file}`);
    Deno.exitCode = 1;
  }
}
console.log("检查完成");
```

```sh
$ deno run --allow-read check.ts real.txt nope.txt
缺失：nope.txt
检查完成
$ echo $?
1
```

对于非零代码，除“失败”之外没有固定含义，但常见的
约定是：`1` 表示你的工具检查出的错误，`2` 表示
诸如缺少参数之类的用法错误。

## 编译为单个可执行文件

[`deno compile`](/runtime/reference/cli/compile/) 会将你的程序和
Deno 运行时打包成一个二进制文件：没有 `node_modules`，用户也无需安装步骤。

```sh
deno compile greet.ts
./greet --name=Deno
```

使用 `--output` 为二进制文件命名。如果你的工具需要权限，请使用常规的 `--allow-*` 标志
将其预先写入，这样运行时就不会再提示：

```sh
deno compile --output greet greet.ts
```

## 将资源嵌入二进制文件

即使你的工具需要模板、单词列表或默认配置等数据，单文件可执行程序也应保持单文件。
传入 `--include` 可将文件或目录打包进二进制文件：

```sh
deno compile --include names.csv --output greet greet.ts
```

运行时，通过 `import.meta.dirname` 按相对于模块目录的路径读取嵌入文件：

```ts
const names = Deno.readTextFileSync(import.meta.dirname + "/names.csv");
```

同样的代码在开发过程中使用 `deno run` 以及在编译后的
二进制文件中都能正常工作，不受用户从哪里运行它的影响。关于目录包含以及如何在 `deno.json` 中
一次性配置路径，请参见
[包含数据文件](/runtime/reference/cli/compile/#including-data-files-or-directories)。

## 为其他平台交叉编译

使用 `--target` 为不同于你当前平台的平台构建，这样你就可以从一台机器
为 Windows、macOS 和 Linux 分发二进制文件：

```sh
deno compile --target x86_64-pc-windows-msvc --output greet.exe greet.ts
deno compile --target aarch64-apple-darwin --output greet greet.ts
```

完整的目标列表覆盖了 Linux、macOS 和 Windows 的 x86_64 与 ARM 构建；请参见
[支持的目标](/runtime/reference/cli/compile/#supported-targets)。如果你将二进制文件
分发给最终用户，也可以对其进行签名，以便操作系统信任你的工具；关于 macOS 和
Windows 的步骤，请参见
[代码签名](/runtime/reference/cli/compile/#code-signing)。

## 从源代码安装工具

要在你自己的机器上将脚本作为命令使用（无需编译），
可以使用 [`deno install`](/runtime/reference/cli/install/) 将其全局安装：

```sh
deno install --global --name greet greet.ts
greet --name=Deno
```

## 进一步了解

- **[deno compile](/runtime/reference/cli/compile/)。** 所有目标、标志、资源
  嵌入、图标和代码签名。
- **[deno install](/runtime/reference/cli/install/)。** 安装工具和
 依赖项。
- **[@std/cli](https://jsr.io/@std/cli)。** 参数解析、旋转加载器、进度
  条和交互式提示。
- **[Deno API reference](/api/deno/)。** `Deno` 命名空间上的所有内容，
  包括 stdin、退出码和文件 API。
- **[Permissions](/runtime/reference/permissions/)。** 精确选择你的
  编译后工具可以访问的内容。
