---
last_modified: 2025-03-10
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno test"
description: "使用 Deno 内置的测试运行器运行你项目的测试"
---

Deno 附带了一个内置的测试运行器，使用
[`Deno.test()`](/api/deno/~/Deno.test) API。要了解如何编写测试，请参见
[测试基础](/runtime/fundamentals/testing/)指南。有关断言，请参见
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

运行名称匹配字符串或模式的测试：

```sh
deno test --filter "database"
deno test --filter "/^connect.*/"
```

跳过类型检查：

```sh
deno test --no-check
```

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

使用 `--reporter` 选择输出格式：

```sh
deno test --reporter=dot
deno test --reporter=tap
```

为 CI 系统写入 JUnit XML 报告：

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

有关详细信息，请参见[文档中的代码测试](/runtime/reference/documentation/)。
