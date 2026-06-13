---
title: "与 Node 和 npm 的兼容性"
description: "了解如何使用 npm 模块和 Node 标准库将 Deno 集成到现有的 Node.js 项目中，而无需进行大规模重写。"
url: /examples/backward_compat_with_node_npm/
videoUrl: https://www.youtube.com/watch?v=QPLchkJ7eas&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=12
layout: video.tsx
---

## 视频描述

了解如何将 Deno 无缝集成到你现有的 Node.js 项目中。在
这段视频中，我们将通过简单的前缀来使用 Node.js 标准库和 npm 模块，保持与 CommonJS 项目的兼容性，并利用 Deno 的
功能，如依赖安装、格式化和代码检查。让你的
Node.js 项目轻松过渡，而无需进行大规模重写。

## 文字稿和代码

选择使用 Deno 并不意味着我们不能利用
Node.js 生态系统。它也不意味着我们必须从头开始重建所有的
Node.js 项目。

使用标准库或 npm 生态系统的功能，只需添加一个前缀
即可。如果你想了解更多关于 Node API 的信息，可以查看
[Node API 文档](/api/node/)。

下面是一个使用 Node 文件系统模块和 promises API 的示例：

```typescript title="main.ts"
async function readFile() {
  try {
    const data = await fs.readFile("example.txt", "utf8");
    console.log(data);
  } catch (error) {
    console.error("读取文件时出错", error);
  }
}

readFile();
```

我们读取文件，然后把数据输出到控制台。

在 Node 中，我们会从 `fs/promises` 导入 `fs`，例如：

```typescript
import fs from "fs/promises";
```

在 Deno 中，我们只需在导入前加上 Node 前缀，例如：

```typescript
import fs from "node:fs/promises";
```

然后我们运行 `deno main.ts`，并选择启用“使用 Node.js 内置
读取权限运行 Deno”。

如果我们运行 `deno main.ts` 并允许
[读取权限](/runtime/fundamentals/security/)，它就会从文件中读取内容。

将应用中的任何导入更新为使用这个 Node 标识符，将使任何使用
node.js 内置模块的代码都能工作。

Deno 甚至支持 CommonJS 项目，这感觉已经超出预期了，我觉得
这相当酷！

如果我们想在应用中使用一个 npm 模块，比如来自 Sentry 的模块，该怎么办呢。

这次我们要使用 **npm 冒号标识符**：

```typescript title="main.ts"
import * as Sentry from "npm:@sentry/node";

Sentry.init({ dsn: "https://example.com" });

function main() {
  try {
    throw new Error("This is an error");
  } catch (error) {
    Sentry.captureException(error);
    console.error("捕获到错误", error);
  }
}
```

我们将运行命令：

```sh
deno run main.ts
```

这会请求访问我们的主目录以及其他位置，然后就完成了！我们也在捕获这个错误了！这种向后兼容性非常惊人。

你正在维护现有的 Node.js 项目吗？有了 Deno 2，你也可以这样做。
你可以使用 `deno install` 来安装依赖，使用 `deno fmt` 进行
格式化，使用 `deno lint` 进行代码检查，我们甚至可以运行 `deno lint --fix` 来
自动修复任何代码检查问题。

是的，你也可以直接运行 Deno，因此对于 `package.json` 中包含的任何脚本，
只需使用 `deno task` 加上脚本名称即可，例如：

```sh
deno task dev
```

我们可以使用之前编写的所有代码，而无需改变它
或过度调整，Deno 只是让它能够正常工作！
