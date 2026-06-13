---
title: "构建一个命令行实用工具"
description: "学习使用 Deno 的标准库构建一个命令行工具，解析标志，处理错误，并编译跨平台可执行文件。"
url: /examples/command_line_utility/
videoUrl: https://www.youtube.com/watch?v=TUxj2TS5pNo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=14
layout: video.tsx
---

## 视频描述

学习使用 Deno 的标准库构建一个命令行工具。你将了解如何解析参数、处理标志，以及如何使用实用函数提供有帮助的信息。跟着我们一起构建一个滑雪胜地信息应用，优雅地处理错误，并将脚本编译为可在多个平台上运行的可执行文件，包括 Windows、MacOS 和 Linux。到本视频结束时，你将了解如何充分利用 Deno 的特性来开发和分发你自己的 CLI 工具。

## 文字稿和代码

### Deno 标准库简介

如果你想创建一个命令行工具，你可以使用 [Deno 的标准库](https://docs.deno.com/runtime/reference/std/)。它包含数十个稳定的库以及有用的实用函数，可以覆盖在 Web 中使用 JavaScript 时许多基础内容。标准库也可以在多种运行时和环境中使用，比如 Node.js 和浏览器。

### 设置命令行工具

我们要创建一个命令行工具，然后将其编译，这样它就可以作为可执行文件在多种不同平台上使用。

创建一个名为 `main.ts` 的新文件，并解析这些参数（记住我们总是可以从 `Deno.args` 中获取它们），然后我们将把它们打印到控制台：

```typescript title="main.ts"
const location = Deno.args[0];

console.log(`Welcome to ${location}`);
```

现在如果我运行 `deno main.ts`，然后提供一个滑雪胜地的名称，比如 Aspen，它就会把它填入字符串中，例如：

```sh
deno main.ts Aspen
## Welcome to Aspen
```

### 安装和使用标准库

现在让我们安装其中一个标准库。在终端中运行：

```sh
deno add jsr:@std/cli
```

这会把 [cli 库](https://jsr.io/@std/cli) 从 Deno 标准库安装到我们的项目中，这样我们就可以使用其中一些有用的函数。

我们要使用的这个实用函数叫做 `parseArgs`。我们可以通过以下方式导入它：

```typescript
import { parseArgs } from "jsr:@std/cli/parse-args";
```

然后我们可以更新代码来使用这个函数，传入参数并去掉索引 0。此时我们的 `main.ts` 文件如下所示：

```typescript title="main.ts"
import { parseArgs } from "jsr:@std/cli/parse-args";

const args = parseArgs(Deno.args);

console.log(args);
```

让我们来试试，在终端中运行：

```sh
deno main.ts -h Hello
```

我们可以看到 `Hello` 已经被添加到我们的 args 对象中。好的，这一切都按预期工作。

### 构建滑雪胜地信息应用

现在我们的应用将是一个滑雪胜地信息应用，所以我们想先填充一些数据。我们将创建一个名为 `resorts` 的值。这是一个包含几个不同键的对象，所以我们会说 `elevation`、`snow` 和 `expectedSnowfall`。然后让我们直接复制粘贴这些，这样可以更快一些；我们将 `Aspen` 设置为 `7945`，`snow` 设置为 `packed powder`，`expectedSnowfall` 设置为 `15`。然后再添加一个，我们将 `Vail` 设置为 `8120`，然后将 `expectedSnowfall` 设为 `25`。

```typescript title="main.ts"
const resorts = {
  Whistler: {
    elevation: 2214,
    snow: "Powder",
    expectedSnowfall: "20",
  },

  Aspen: {
    elevation: 7945,
    snow: "压实粉雪",
    expectedSnowfall: 15,
  },
  Vail: {
    elevation: 8120,
    snow: "压实粉雪",
    expectedSnowfall: 25,
  },
};
```

这里我们有几个不同的滑雪胜地。最终我们希望能够通过一个命令行参数运行应用，这个参数会提供滑雪胜地名称，然后让这个 CLI 工具返回该滑雪胜地的信息。

### 处理命令行参数

那么让我们继续，给 parse args 传入另一个对象，这里我们要定义一个别名——也就是说，如果我传入 `r` 标志，我们希望把它理解为 `resort`。然后我们也在这里使用默认值，把 `resort` 的默认值设为 `Whistler`：

```typescript title="main.ts"
const args = parseArgs(Deno.args, {
  alias: {
    resort: "r",
  },
  default: {
    resort: "Whistler",
  },
});
```

接下来我们可以设置一个名为 `resortName` 的常量，并将其设为 `args.resort`。然后通过 `resorts[resortName]` 获取对应的滑雪胜地（我们一会儿会修复这个类型错误），并更新 console log：

```typescript title="main.ts"
const resortName = args.resort;
const resort = resorts[resortName];

console.log(
  `Resort: ${resortName} Elevation: ${resort.elevation} feet Snow: ${resort.snow} Expected Snowfall: ${resort.expectedSnowfall}`,
);
```

要测试这一点，我们可以使用：

```sh
deno main.ts -r Aspen
```

这会输出 Aspen 的所有详细信息。

我们也可以不带任何参数运行，这样应该会得到 Whistler 的详情，因为它被设置为默认值：

```sh
deno main.ts
```

完整名称同样适用，所以我们可以这样说：

```sh
deno main.ts --resort Veil
```

那样也应该能显示这些详情。

### 改进错误处理

如果我尝试用一个不存在的滑雪胜地运行，比如说 `Bachelor`；会出现一个错误，而且看起来不太友好。它会在试图解析时卡在这里，却找不到对应项。所以我们可以让它更友好一些：如果我们的数据集中没有与输入匹配的 `resort`，就运行一个 console error，提示
`resort name not found, try Whistler Aspen or Veil`，然后使用 `Deno.exit` 退出该进程：

```typescript title="main.ts"
if (!resort) {
  console.error(
    `Resort ${resortName} name not found. Try Whistler, Aspen, or Veil`,
  );
  Deno.exit(1);
}
```

### 修复类型

好吧，这里看起来不太对，我们可以看看 TypeScript 中的问题——它告诉我们这里隐式具有 `any` 类型，你可以查阅更多关于这个错误的信息，但我会向你展示如何修复它。将 `resortName` 的类型更新为 `resorts` 的一个键：

```typescript title="main.ts"
const resortName = args.resort as keyof typeof resorts;
```

这一步做的是提取 `args.resort` 的值，并断言它是数据中的一个有效键。

### 添加帮助信息和颜色输出

让我们再进一步：我们要说如果 `args.help`，我们就 console log，然后给用户一个小提示，告诉他们“嘿，这其实就是用法”，以便在任何时候他们请求帮助时都能看到；然后我们还要把这里的别名更新为 `help` 对应 `H`，最后我们要确保调用 `Deno.exit`，这样在完成后就会立即退出进程：

```typescript title="main.ts"
const args = parseArgs(Deno.args, {
  alias: {
    resort: "r",
    help: "h",
  },
  default: {
    resort: "Whistler",
  },
});

...

if (args.help) {
  console.log(`
    usage: ski-cli --resort <resort name>
    -h, --help    显示帮助
    -r, --resort  滑雪胜地名称（默认值：Whistler）
  `);
  Deno.exit();
}
```

你可以通过运行以下命令来测试帮助设置：

```sh
deno main.ts -h
```

接下来让我们用颜色输出结果。Deno 支持使用 `%C` 语法的 CSS。

这会将文本应用为我们传递给 `console.log()` 的第二个参数中的样式。例如，我们可以把第二个参数设为 `color:blue`：

````typescript title="main.ts"
console.log(`
    %c
    Resort: ${resortName} 
    Elevation: ${resort.elevation} feet 
    Snow: ${resort.snow} 
    Expected Snowfall: ${resort.expectedSnowfall}
    `, "color:blue"
);

Then run the program again:

```sh
deno main.ts -r Veil
````
你应该会看到所有内容都以蓝色输出。这有多酷啊？！

### 为不同平台编译工具

我也希望其他人能享受这个应用。使用 Deno 把这个工具编译成可执行文件非常简单。正如你可能想象的那样，这个命令就是 `deno compile`，后面跟上我们脚本的名称。这会将代码编译到项目中，作为一个可执行文件：

```sh
deno compile main.ts
```

你应该会在项目文件夹中看到名为 MyDenoProject 的可执行文件。现在你可以使用 `./` 来运行它，例如：

```sh
./MyDenoProject --resort Aspen
```

这对我来说真的很棒，但如果我想把它分享给其他平台呢？你只需要再次运行 `deno compile`，这一次传入一个 `--target` 标志，指定你想要编译到哪里。

假设我们想为 Windows 编译，我们会使用：

```sh
deno compile --target x86_64-pc-windows-msvc --output ski-cli-windows main.ts
```

或者为 Mac：

```sh
deno compile --target x86_64-apple-darwin --output ski-cli-macos main.ts
```

或者为 Linux：

```sh
deno compile --target x86_64-unknown-linux-gnu --output ski-cli-linux main.ts
```

你可以在 Deno 文档中查看所有[编译应用的选项](/runtime/reference/cli/compile/)。你可以为自己的特定用例使用很多不同的标志。

总结一下，我们始终可以访问 Deno 标准库，并利用其中各种有用的函数。如果我们想创建一个命令行实用工具，就像这里做的那样，我们始终可以使用这些参数访问 [`Deno` 全局命名空间](/api/deno/~/Deno)。我们可以使用标准库 CLI 包中的 parse args 函数来解析这些参数，并且可以为所有平台进行编译，这样我们的应用就能在任何地方被使用。
