---
last_modified: 2025-03-10
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

## 支持 CommonJS

系统会自动识别并支持 CommonJS 模块：

```sh
deno eval "const path = require('path'); console.log(path.join('a', 'b'))"
```

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
