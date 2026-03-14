---
title: "deno check"
oldUrl: /runtime/manual/tools/check/
command: check
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno check"
description: "下载并进行类型检查而不执行代码"
---

## 示例

对 TypeScript 文件进行类型检查但不执行：

```ts title="example.ts"
const x: string = 1 + 1n;
```

```bash
deno check example.ts
```

## 对 JavaScript 文件进行类型检查

如果你有一个纯 JavaScript 项目，并想用 Deno 进行类型检查，
你可以使用 `--check-js` 标志，而不是在每个文件中添加 `// @ts-check` 注释，
或者在 `deno.json` 中设置 `compilerOptions.checkJs`：

```bash
deno check --check-js main.js
```
