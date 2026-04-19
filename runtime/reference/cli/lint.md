---
last_modified: 2026-03-12
title: "deno lint"
oldUrl:
  - /runtime/tools/linter/
  - /runtime/fundamentals/linting_and_formatting/lint-cli-ref
  - /runtime/manual/tools/lint/
  - /runtime/manual/tools/linter/
  - /runtime/reference/cli/linter/
command: lint
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno lint"
description: "运行 Deno linter 来检查您的代码错误并应用自动修复"
---

Deno 自带一个内置的 linter，用于分析您的代码中可能存在的错误、
漏洞以及风格问题。有关更广泛的概述，请参阅
[Linting and Formatting](/runtime/fundamentals/linting_and_formatting/)。

## 基本用法

检查当前目录中的所有 TypeScript 和 JavaScript 文件：

```sh
deno lint
```

检查特定文件或目录：

```sh
deno lint src/ main.ts
```

## 监视模式

当文件发生变化时自动重新检查：

```sh
deno lint --watch
```

## 在 CI 中使用

`deno lint` 在发现违规时会以非零状态码退出，因此适用于 CI 流水线：

```sh
deno lint
deno fmt --check
deno test
```

## 可用规则

Deno 的 linter 包含 100 多条规则。查看所有可用规则：

```sh
deno lint --rules
```

如需带有文档的完整列表，请访问 [lint rules](/lint/) 参考。

## 在 `deno.json` 中配置规则

在您的 `deno.json` 中自定义启用哪些规则：

```json title="deno.json"
{
  "lint": {
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

- **`tags`** — 要启用的规则集。可用标签：`recommended`、`fresh`
- **`include`** — 要启用的额外单条规则
- **`exclude`** — 即使被标签包含，也要禁用的规则

有关所有可用选项，请参阅 [Configuration](/runtime/fundamentals/configuration/#linting) 页面。

## 包含和排除文件

在 `deno.json` 中指定要检查的文件：

```json title="deno.json"
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/generated/**/*.ts"]
  }
}
```

您也可以从命令行排除文件：

```sh
deno lint --ignore=dist/,build/
```

## Lint 插件

您可以使用 [lint plugins](/runtime/reference/lint_plugins/) 通过自定义规则扩展 linter。

## 忽略指令

### 文件级别

要忽略整个文件，请在文件开头使用 `// deno-lint-ignore-file`：

```ts
// deno-lint-ignore-file

function foo(): any {
  // ...
}
```

您还可以指定忽略该文件的原因：

```ts
// deno-lint-ignore-file -- 忽略的原因

function foo(): any {
  // ...
}
```

忽略指令必须放在第一个语句或声明之前：

```ts
// 版权所有 2018-2024 Deno 作者。保留所有权利。MIT 许可证.

/**
 * 一些 JS 文档
 */

// deno-lint-ignore-file

import { bar } from "./bar.js";

function foo(): any {
  // ...
}
```

您还可以在整个文件中忽略某些诊断：

```ts
// deno-lint-ignore-file no-explicit-any no-empty

function foo(): any {
  // ...
}
```

如果存在多个 `// deno-lint-ignore-file` 指令，除了第一个以外的指令将被忽略：

```ts
// 这是有效的
// deno-lint-ignore-file no-explicit-any no-empty

// 但是这个无效
// deno-lint-ignore-file no-debugger

function foo(): any {
  debugger; // 未被忽略！
}
```

### 行级别

要忽略特定的诊断，请在有问题的行前使用 `// deno-lint-ignore <codes...>`。

```ts
// deno-lint-ignore no-explicit-any
function foo(): any {
  // ...
}

// deno-lint-ignore no-explicit-any explicit-function-return-type
function bar(a: any) {
  // ...
}
```

您必须指定要忽略的规则的名称。

您还可以指定忽略诊断的原因：

```ts
// deno-lint-ignore no-explicit-any -- 忽略的原因
function foo(): any {
  // ...
}
```

## 忽略 `ban-unused-ignore` 本身

`deno lint` 提供了 [`ban-unused-ignore` 规则](/lint/rules/ban-unused-ignore/)，
该规则会检测不再抑制某些诊断的忽略指令。当您希望发现代码重构后不再必要的忽略指令时，这非常有用。

然而，在某些情况下，您可能希望忽略 `ban-unused-ignore` 规则本身。一个典型的情况是在处理自动生成的文件时；对某些规则添加文件级忽略指令是有意义的，这样在这种情况下几乎不需要通过 `ban-unused-ignore` 检测未使用的指令。

如果您希望抑制整个文件的规则，可以像往常一样使用 `// deno-lint-ignore-file ban-unused-ignore`：

```ts
// deno-lint-ignore-file ban-unused-ignore no-explicit-any

// `no-explicit-any` 没有使用，但由于忽略了 `ban-unused-ignore`，
// 所以不会返回任何诊断
console.log(42);
```

请注意，忽略 `ban-unused-ignore` 本身仅可通过文件级别的
忽略指令实现。这意味着按行指令，例如
`// deno-lint-ignore ban-unused-ignore`，完全不起作用。如果您出于某些特殊原因想要
忽略 `ban-unused-ignore`，请务必将其作为
文件级别忽略指令添加。
