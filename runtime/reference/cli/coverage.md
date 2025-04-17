---
title: "deno coverage"
oldUrl: /runtime/manual/tools/coverage/
command: coverage
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno coverage"
description: "Generate a coverage report for your code"
---

## 包含和排除

默认情况下，覆盖率包括您本地文件系统中存在的任何代码及其导入。

您可以通过使用 `--include` 和 `--exclude` 选项来自定义包含和排除。

您可以通过使用 `--include` 选项并自定义正则表达式模式来扩展覆盖率，以包括不在本地文件系统上的文件。

```bash
deno coverage --include="^file:|https:"
```

默认的包含模式应足以满足大多数用例，但您可以自定义它以更具体地指定哪些文件包含在您的覆盖率报告中。

文件名中包含 `test.js`、`test.ts`、`test.jsx` 或 `test.tsx` 的文件默认被排除。

这相当于：

```bash
deno coverage --exclude="test\.(js|mjs|ts|jsx|tsx)$"
```

此默认设置防止您的测试代码为您的覆盖率报告做出贡献。URL 要匹配，它必须与包含模式匹配，且不与排除模式匹配。

## 忽略代码

通过添加覆盖忽略注释，可以在生成的覆盖率报告中忽略代码。被忽略代码中的分支和行将被排除在报告之外。被忽略的分支和行不计算为覆盖行。相反，被忽略的代码行被视为空行。

要忽略整个文件，请在文件顶部添加 `// deno-coverage-ignore-file` 注释。

```ts
// deno-coverage-ignore-file

// 此文件中的所有代码被忽略
```

被忽略的文件将不会出现在覆盖率报告中。

要忽略单行，请在您想要忽略的代码上方添加 `// deno-coverage-ignore` 注释。

```ts
// deno-coverage-ignore
console.log("this line is ignored");
```

要忽略多行，请在要忽略的代码上方添加 `// deno-coverage-ignore-start` 注释，并在下方添加 `// deno-coverage-ignore-stop` 注释。

```ts
// deno-coverage-ignore-start
if (condition) {
  console.log("分支和行都被忽略");
}
// deno-coverage-ignore-stop
```

所有在 `// deno-coverage-ignore-start` 注释之后的代码会被忽略，直到 `// deno-coverage-ignore-stop` 被遇到。

每个 `// deno-coverage-ignore-start` 注释必须以 `// deno-coverage-ignore-stop` 注释结束，并且忽略的范围不能嵌套。

当这些要求没有满足时，某些行可能会在覆盖率报告中意外包含。`deno coverage` 命令会对任何无效注释记录警告。

```ts
// deno-coverage-ignore-start
if (condition) {
  // deno-coverage-ignore-start - A warning will be logged because the previous
  //                              coverage range is unterminated.
  console.log("this code is ignored");
  // deno-coverage-ignore-stop
}
// deno-coverage-ignore-stop

// ...

// deno-coverage-ignore-start - This comment will be ignored and a warning will
//                              be logged, because this range is unterminated.
console.log("this code is not ignored");
```

在覆盖注释中，只有空格可以位于覆盖指令之前。然而，任何文本可以跟随该指令。

```ts
// deno-coverage-ignore Trailing text is allowed.
console.log("This line is ignored");

// But leading text isn't. deno-coverage-ignore
console.log("This line is not ignored");
```

覆盖注释必须以 `//` 开头。以 `/*` 开头的注释不是有效的覆盖注释。

```ts
// deno-coverage-ignore
console.log("This line is ignored");

/* deno-coverage-ignore */
console.log("This line is not ignored");
```

## 输出格式

默认情况下，我们支持 Deno 自己的覆盖格式 - 但您也可以以 lcov 格式或 html 格式输出覆盖率报告。

```bash
deno coverage --lcov --output=cov.lcov
```

此 lcov 文件可与支持 lcov 格式的其他工具一起使用。

```bash
deno coverage --html
```

这将输出一个覆盖率报告作为 html 文件。

## 示例

从工作区的默认覆盖配置生成覆盖率报告。

```bash
deno test --coverage
deno coverage
```

从具有自定义名称的覆盖配置生成覆盖率报告。

```bash
deno test --coverage=custom_profile_name
deno coverage custom_profile_name
```

仅包括匹配特定模式的覆盖率 - 在这种情况下，仅包括 main.ts 的测试。

```bash
deno coverage --include="main.ts"
```

将默认覆盖配置中的测试覆盖率导出到 lcov 文件。

```bash
deno test --coverage
deno coverage --lcov --output=cov.lcov
```