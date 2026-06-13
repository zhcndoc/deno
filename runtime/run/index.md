---
title: "运行代码"
description: "使用 Deno 运行 JavaScript 和 TypeScript：默认安全的权限模型、运行文件、URL 和 stdin、监听模式，以及项目任务。"
---

Deno 直接运行 JavaScript 和 TypeScript（无需构建步骤、无需配置），并置于一个安全沙箱之后，只有在你请求时才会授予访问权限。本页将介绍代码实际如何运行：权限、启动方式、监听模式，以及任务。

## 运行文件

将 Deno 指向一个文件。TypeScript 可直接运行：

```sh
deno run main.ts
```

`deno run` 是显式的，但你可以对文件或任务省略 `run`，Deno 会自行判断：

```sh
deno main.ts          # 与 `deno run main.ts` 相同
```

## 权限：默认安全

这部分与 Node 不同。代码在沙箱中运行，**默认无法访问网络、文件系统、环境变量或子进程**，直到你授予它权限。尝试在没有权限的情况下读取文件的脚本会停止并询问，或者在禁用提示时失败。

使用 `--allow-*` 标志授予访问权限（每个都有简写形式），并将范围缩小到恰好所需的内容：

```sh
deno run --allow-net main.ts                     # 网络    (-N)
deno run --allow-read=./data main.ts             # 文件系统 (-R)，限定范围
deno run -N=api.example.com -E main.ts           # 组合，简写形式
```

使用 `--deny-*` 来排除例外，或者使用 `-A` / `--allow-all` 完全跳过沙箱。这在受信任的环境中很方便，但也放弃了这些保证。有关每个标志，请参见 [Permissions](/runtime/reference/permissions/)，有关其背后的模型，请参见 [Security](/runtime/fundamentals/security/)。

## 从 URL 或 stdin 运行

Deno 可以直接从 URL 运行代码（适合一次性工具和安装器），也可以从 stdin 运行：

```sh
deno run https://example.com/script.ts
echo 'console.log(1 + 1)' | deno run -
```

远程代码和其他代码一样会被沙箱隔离：除非你授予权限，否则它不会获得任何权限。

## 使用 watch 模式在更改时重新加载

添加 `--watch` 后，只要它依赖的某个文件发生变化，Deno 就会重新运行你的程序。无需 `nodemon`，无需额外依赖：

```sh
deno run --watch main.ts
```

`deno test`、`deno fmt` 等也支持 `--watch`。关于监听哪些内容、排除路径以及热模块替换，请参见 [CLI patterns page](/runtime/getting_started/command_line_interface/#watch-mode)。

## 运行项目任务

在 `deno.json` 中定义可重复使用的命令，并使用 [`deno task`](/runtime/reference/cli/task/) 运行它们，它相当于 `npm run`：

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --watch --allow-net main.ts",
    "start": "deno run --allow-net main.ts"
  }
}
```

```sh
deno task dev
```

任务可以运行其他任务、设置环境变量，并且可跨平台工作。

## 快速尝试代码

对于实验，可以直接求值一个表达式，或者打开 REPL：

```sh
deno eval "console.log(Deno.version)"
deno repl
```

## 进一步了解

- **[编写 HTTP 服务器](/runtime/fundamentals/http_server/)。** 使用 Web 标准的 [`Deno.serve`](/api/deno/~/Deno.serve) 处理请求。
- **[Web 开发](/runtime/fundamentals/web_dev/)。** 使用 Fresh、Next.js、Astro 和 Web 标准 API 构建应用。
- **[Web 平台 API](/runtime/reference/web_platform_apis/)。** `fetch`、`Request`/`Response`、流、Web Crypto，以及 Deno 实现的其他浏览器全局对象。
- **[调试](/runtime/fundamentals/debugging/)。** 连接 Chrome DevTools 或你编辑器的调试器。
- **[deno run 参考](/runtime/reference/cli/run/)。** 详细了解每个标志。
