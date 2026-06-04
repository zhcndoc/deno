---
last_modified: 2026-05-20
title: "deno eval"
oldUrl: /runtime/manual/tools/eval/
command: eval
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno eval"
description: "在命令行中执行 JavaScript 和 TypeScript 代码"
---

`deno eval` 直接从命令行执行一段代码，无需文件。与 `deno run` 不同，**`deno eval` 默认在启用所有权限的情况下运行**。

## 基本用法

```sh
deno eval "console.log('来自 Deno 的问候')"
```

TypeScript 开箱即用：

```sh
deno eval "const greeting: string = 'Hello'; console.log(greeting)"
```

## CommonJS 和 ESM 自动检测

从 Deno 2.8 开始，`deno eval` 默认使用 ESM，但当代码片段看起来像 CJS 脚本时会切换到 CommonJS。仅当片段没有 `import` / `export` 声明，并且引用了以下 CommonJS 专用绑定之一时，才会被视为 CJS：`require(`、`module.exports`、`exports.`、`__dirname` 或 `__filename`。其他情况——包括普通表达式——都会以 ESM 方式运行，这与长期以来的 `deno eval` 默认行为一致。

```sh
# 检测为 CommonJS — 使用 require()
deno eval "const path = require('path'); console.log(path.join('a', 'b'))"

# 以 ESM 运行（默认）— 没有 CJS 专用模式
deno eval "console.log(1 + 2)"

# 因为静态 import 而以 ESM 运行
deno eval "import { ok } from 'node:assert'; ok(true); console.log('ok')"
```

如果启发式判断出错——例如某个代码片段只是在字符串中提到了 `require`——请传入 `--ext=mjs` 强制使用 ESM，或传入 `--ext=cjs` 强制使用 CommonJS。

## 打印表达式结果

使用 `--print`（或 `-p`）来计算表达式并打印其结果，类似于 `node -p`：

```sh
deno eval -p "1 + 2"
# 3

deno eval -p "Deno.version"
# { deno: "2.x.x", v8: "...", typescript: "..." }
```

## 从 stdin 读取

结合管道输入可快速处理数据：

```sh
echo '{"name":"deno"}' | deno eval -p "
  const text = await new Response(Deno.stdin.readable).text();
  JSON.parse(text).name
"
```
