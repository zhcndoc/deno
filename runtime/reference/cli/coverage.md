---
last_modified: 2026-06-24
title: "deno coverage"
oldUrl: /runtime/manual/tools/coverage/
command: coverage
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno 覆盖率"
description: "为您的代码生成覆盖率报告"
---

`deno coverage` 会根据从 [`deno test --coverage`](/runtime/reference/cli/test/#code-coverage) 收集的数据生成覆盖率报告。

## 包含和排除

默认情况下，覆盖率会包含本地文件系统中存在的任何代码及其导入内容。

您可以通过使用 `--include` 和 `--exclude` 选项来自定义包含和排除。

您可以通过使用 `--include` 选项并自定义正则表达式模式来扩展覆盖率，以包括不在本地文件系统上的文件。

```sh
deno coverage --include="^file:|https:"
```

默认的包含模式应足以满足大多数用例，但您可以自定义它以更具体地指定哪些文件包含在您的覆盖率报告中。

文件名中包含 `test.js`、`test.ts`、`test.jsx` 或 `test.tsx` 的文件默认被排除。

这相当于：

```sh
deno coverage --exclude="test\.(js|mjs|ts|jsx|tsx)$"
```

此默认设置可防止您的测试代码为覆盖率报告做出贡献。URL 要匹配，它必须与包含模式匹配，且不与排除模式匹配。

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
console.log("这一行被忽略");
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
  // deno-coverage-ignore-start - 由于前一个
  //                              覆盖范围没有终止，因此会记录警告。
  console.log("this code is ignored");
  // deno-coverage-ignore-stop
}
// deno-coverage-ignore-stop

// ...

// deno-coverage-ignore-start - 这条注释会被忽略，并且会记录警告，因为这个范围没有终止。
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

## 函数覆盖率

摘要表和 HTML 报告都包含一个 **函数覆盖率** 列，与分支和行列并列：

```console
---------------------------------------------
文件         | 分支 % | 行 % | 函数 %
---------------------------------------------
main.ts      |   85.7   |  92.3  |    100.0
util.ts      |   75.0   |  88.5  |     66.7
---------------------------------------------
所有文件    |   80.0   |  90.5  |     83.3
---------------------------------------------
```

函数覆盖率衡量的是在测试运行期间至少被调用过一次的已声明函数所占的百分比。同样的数据也可在 `lcov` 输出中获得。

## 覆盖率阈值

默认情况下，`deno coverage` 和 `deno test --coverage` 无论数值有多低，都会以零退出。要在 CI 中以覆盖率作为门槛，请设置一个最低阈值；当覆盖率低于该值时，命令将以非零状态退出。

将 `--threshold` 传给 `deno coverage`，并使用整数百分比。该值适用于摘要表中显示的全部三个指标：行覆盖率、分支覆盖率和函数覆盖率。

```sh
deno coverage --threshold=90
```

当你在一个步骤中同时收集并检查时，将 `--coverage-threshold` 传给 `deno test`：

```sh
deno test --coverage --coverage-threshold=90
```

要为每个指标设置不同的目标，请在 `deno.json` 中添加一个 `coverage` 部分。`thresholds` 下的每个键都是可选的，并接受小数百分比：

```json
{
  "coverage": {
    "thresholds": {
      "lines": 90,
      "branches": 80,
      "functions": 90
    }
  }
}
```

未配置阈值的指标不会被检查，因此对于没有分支的文件，`branches: 80` 也会通过。该检查会针对所有已报告文件的聚合结果运行，使用与摘要表打印的相同数值。

当你传递 CLI 标志时，它的单个值会同时应用于行、分支和函数覆盖率，并覆盖配置中为各个指标设置的任何值。若没有该标志，则使用 `deno.json` 中按指标设置的值。

## 输出格式

默认情况下，我们支持 Deno 自己的覆盖率格式 - 但您也可以输出覆盖率报告为 [lcov 格式](https://github.com/linux-test-project/lcov?tab=readme-ov-file)（一种用于描述代码覆盖率数据的标准文件格式），或以 html 格式。

```sh
deno coverage --lcov --output=cov.lcov
```

此 lcov 文件可与支持 lcov 格式的其他工具一起使用。

```sh
deno coverage --html
```

这将输出一个覆盖率报告作为 html 文件。

## 示例

从工作区的默认覆盖配置生成覆盖率报告。

```sh
deno test --coverage
deno coverage
```

从具有自定义名称的覆盖配置生成覆盖率报告。

```sh
deno test --coverage=custom_profile_name
deno coverage custom_profile_name
```

> 注意：您也可以通过 `DENO_COVERAGE_DIR` 环境变量设置覆盖目录。
>
> ```
> DENO_COVERAGE_DIR=custom_profile_name deno test
> deno coverage custom_profile_name
> ```

仅包含匹配特定模式的覆盖率 - 在这种情况下，仅包含 main.ts 的测试。

```sh
deno coverage --include="main.ts"
```

将默认覆盖配置中的测试覆盖率导出到 lcov 文件。

```sh
deno test --coverage
deno coverage --lcov --output=cov.lcov
```