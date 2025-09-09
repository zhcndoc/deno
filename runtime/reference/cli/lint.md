---
title: "`deno lint`, 检查工具"
oldUrl:
  - /runtime/tools/linter/
  - /runtime/fundamentals/linting_and_formatting/lint-cli-ref
  - /runtime/manual/tools/linter/
  - /runtime/reference/cli/linter/
command: lint
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno lint"
description: "Run the Deno linter to check your code for errors and apply automated fixes"
---

## 可用规则

要查看支持的规则的完整列表，请访问 [规则列表](/lint/) 文档页面。

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

请注意，忽略 `ban-unused-ignore` 本身仅通过文件级忽略指令有效。这意味着像 `// deno-lint-ignore ban-unused-ignore` 这样的行级指令完全无效。如果您出于某些特殊原因想要忽略 `ban-unused-ignore`，请确保将其作为文件级忽略指令添加。

## 更多关于 linting 和格式化的信息

有关 Deno 中 linting 和格式化的更多信息，以及这两种工具之间的差异，请访问我们基础部分的 [Linting 和格式化](/runtime/fundamentals/linting_and_formatting/) 页面。
