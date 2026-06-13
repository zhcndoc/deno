---
last_modified: 2025-03-10
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno test"
description: "使用 Deno 内置的测试运行器运行你项目的测试"
---

Deno 自带一个内置测试运行器，使用
[`Deno.test()`](/api/deno/~/Deno.test) API。要了解如何编写测试，请参阅
[测试基础](/runtime/test/)指南。有关断言，请参阅
[`@std/assert`](/runtime/reference/std/assert/) 和
[`@std/expect`](/runtime/reference/std/expect/)。

## 运行测试

运行当前目录及其子目录中的所有测试：

```sh
deno test
```

运行特定文件中的测试：

```sh
deno test src/fetch_test.ts src/signal_test.ts
```

运行匹配 glob 模式的测试：

```sh
deno test src/*.test.ts
```

跳过类型检查：

```sh
deno test --no-check
```

## 过滤

仅运行名称与字符串或使用 `--filter` 的模式匹配的测试：

```sh
# 运行名称包含 "database" 的测试
deno test --filter "database"

# 运行名称匹配正则表达式的测试
deno test --filter "/^connect.*/"
```

用正斜杠 (`/`) 将过滤值括起来，以将其视为正则表达式，类似于 JavaScript 的正则字面量语法。过滤不会影响测试步骤：当某个测试名称与过滤条件匹配时，它的所有步骤都会运行。

若要控制最初收集哪些测试文件，可在配置文件中设置 `test.include` 和 `test.exclude`。请参阅
[包含与排除](/runtime/reference/deno_json/#include-and-exclude)。

## 权限

测试会以与 `deno run` 相同的[权限模型](/runtime/fundamentals/security/)运行。
为你的测试套件授予权限：

```sh
deno test --allow-read --allow-net
```

## 监听模式

在文件更改时自动重新运行测试：

```sh
deno test --watch
```

## 并行执行

在多个 worker 线程之间运行测试文件：

```sh
deno test --parallel
```

默认情况下，`--parallel` 使用可用 CPU 的数量。使用 `DENO_JOBS=<N>`
来控制线程数量：

```sh
DENO_JOBS=4 deno test --parallel
```

## 代码覆盖率

收集覆盖率数据并生成报告：

```sh
deno test --coverage
```

这会将原始覆盖率数据写入 `coverage/` 目录。要基于已有的覆盖率数据生成摘要，
请使用
[`deno coverage`](/runtime/reference/cli/coverage/)：

```sh
deno coverage coverage/
```

你也可以输出 `lcov` 报告以供外部工具使用：

```sh
deno coverage --lcov coverage/ > coverage.lcov
```

## 报告器

使用 `--reporter` 选择输出格式。内置了四种报告器：

- `pretty`（默认）：详细、易读的输出
- `dot`：每个测试显示一个字符，便于快速概览
- `junit`：JUnit XML 格式，供 CI 系统使用
- `tap`：[Test Anything Protocol](https://testanything.org/) 输出

```sh
deno test --reporter=dot
deno test --reporter=tap
```

在终端中保留人类可读的 `pretty` 输出的同时，将 JUnit XML 报告写入文件：

```sh
deno test --junit-path=report.xml
```

## 随机化顺序

打乱测试运行顺序，以发现测试之间隐藏的依赖关系：

```sh
deno test --shuffle
```

## 泄漏检测

追踪泄漏的异步操作、计时器或资源的来源：

```sh
deno test --trace-leaks
```

## 在文档中测试代码

将 JSDoc 和 Markdown 文件中的代码块作为测试执行：

```sh
deno test --doc
```

有关详情，请参阅[文档测试](/runtime/test/doc_tests/)。
