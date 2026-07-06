---
last_modified: 2026-06-25
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

## 运行受影响的测试

在迭代修改时，你可以只运行受其影响的测试，而不是
整个测试套件。这些都是一次性运行，不是 watch 模式。

`--changed` 会运行受 git 中已更改文件影响的测试模块。若不提供
值，它会使用工作区（已暂存、未暂存和未跟踪的文件）；传入一个
引用也可以包含自该引用与当前分支 merge-base 以来的提交：

```sh
# 受未提交更改影响的测试
deno test --changed

# 自从从 main 分支切出以来受影响的测试
deno test --changed=origin/main
```

`--related` 会运行依赖于特定源文件的测试模块，而不
查询 git：

```sh
# 导入 src/util.ts 的测试
deno test --related=src/util.ts
```

这两个标志都会将收集到的测试文件筛选为那些通过模块图
到达已更改文件或命名文件的测试文件。有关工作流以及选择如何
生效，请参阅测试指南中的
[运行受影响的测试](/runtime/test/#running-affected-tests)。

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

要在覆盖率低于目标值时使运行失败，请设置阈值（例如
`deno coverage --threshold=90`）。有关按指标配置，请参见
[coverage thresholds](/runtime/reference/cli/coverage/#coverage-thresholds)。

## 参数化测试

使用 [`Deno.test.each`](/api/deno/~/Deno.test.each) 在一组用例表上运行相同的测试主体，它会为每个用例分别注册一个独立报告的测试。有关名称模板和用例形式，请参见[参数化测试](/runtime/test/#parameterized-tests)。

## 快照测试

捕获一个值，并在每次运行时将其与存储的参考值进行比较，使用内置的 `t.assertSnapshot`，并通过 `--update-snapshots`（`-u`）进行更新。参见
[快照测试](/runtime/test/snapshots/)。

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

## 分片

使用 `--shard=<index>/<count>` 将测试套件拆分到多台机器上，其中
`index` 从 1 开始。已发现的测试文件会按稳定顺序排序，并
划分为 `<count>` 个平衡分组；运行时只执行第 `<index>` 组中的文件：

```sh
# 在 3 台机器中的第 1 台上
deno test --shard=1/3

# 在 3 台机器中的第 2 台上
deno test --shard=2/3
```

分片会在 `--shuffle` 之前应用，因此无论随机种子如何，同一个分片在
每台机器上都会运行相同的文件。

## 重试和重复

使用 `--retry` 和 `--repeats` 为整个运行设置默认的重试和重复次数：

```sh
# 每个失败的测试在报告失败前最多重新运行两次
deno test --retry=2

# 每个测试运行三次，如果任何一次运行失败则判定失败
deno test --repeats=3
```

设置了自己的 `retry` 或 `repeats` 选项的测试会覆盖该标志。有关每个测试的选项，请参见[重试和重复测试](/runtime/test/#retrying-and-repeating-tests)。

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
