---
last_modified: 2025-03-10
title: "deno types"
oldUrl: /runtime/manual/tools/types/
command: types
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno types"
description: "打印 Deno 内置的 TypeScript 类型声明"
---

`deno types` 会打印所有 Deno 特有 API 的 TypeScript 类型声明。
这对需要 Deno 类型信息的编辑器和工具很有用。

## 基本用法

将类型声明打印到标准输出：

```sh
deno types
```

保存到文件以供编辑器或类型检查器使用：

```sh
deno types > deno.d.ts
```

## 何时使用

大多数带有 [Deno 扩展](/runtime/reference/vscode/) 的编辑器会自动处理类型。
如果你属于以下情况，可能需要使用 `deno types`：

- 使用不支持 Deno LSP 的编辑器
- 为构建流水线生成类型声明
- 查看当前 Deno 版本可用哪些 API
