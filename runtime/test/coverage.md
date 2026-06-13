---
title: "测试覆盖率"
description: "使用 deno test --coverage 收集覆盖率数据，并将其转换为终端摘要、HTML 报告以及供 CI 使用的 lcov 文件，可通过 deno coverage 实现。"
oldUrl:
  - /runtime/manual/basics/testing/coverage/
---

代码覆盖率会告诉你，在测试执行期间，你的代码中哪些行、分支和函数
实际运行了。Deno 内置了覆盖率功能：无需插桩步骤，也无需额外依赖。整个工作流只需两个命令：
`deno test --coverage` 收集数据，而
[`deno coverage`](/runtime/reference/cli/coverage/) 将其转换为报告。

## 收集覆盖率数据

运行测试时传入 `--coverage`：

```sh
deno test --coverage
```

这会将原始覆盖率数据写入 `coverage/` 目录，每个模块对应一个 JSON 配置文件。
这些数据直接来自 V8 JavaScript 引擎，它会在代码运行时跟踪执行情况，因此这些数字
准确反映了实际执行内容，而不是源代码重写得到的近似值。

Deno 还会在测试结果之后打印一张覆盖率摘要表，并在 coverage 目录中写入一个
`lcov.info` 文件和一个 HTML 报告。如果你只
想要原始配置文件，请传入 `--coverage-raw-data-only`。

要使用不同的目录，可以为该标志指定一个值，或者设置
`DENO_COVERAGE_DIR` 环境变量：

```sh
deno test --coverage=cov_profile
```

覆盖率数据会在多次运行之间累积。当你重命名或删除文件时，过期的
配置文件可能会残留并扭曲报告，因此在测试运行前传入 `--clean` 来清空
目录：

```sh
deno test --clean --coverage
```

### 在 deno test 之外收集覆盖率

`deno run` 接受相同的 `--coverage` 标志，这在你要测量的代码不会在测试运行器下执行时很有用：
集成脚本、工具的 CLI 调用，或从外部访问的服务器。

```sh
deno run --coverage=cov_profile main.ts
```

当测试会启动 Deno 子进程时，请改为设置 `DENO_COVERAGE_DIR` 环境
变量。子进程会继承它，因此其执行情况会被收集到
同一个目录中，并显示在合并后的报告里：

```sh
DENO_COVERAGE_DIR=cov_profile deno test --allow-run
deno coverage cov_profile
```

## 阅读报告

将 `deno coverage` 指向你收集数据所在的目录：

```sh
deno coverage coverage/
```

对于用 `deno init` 创建的新项目，它会生成一个 `main.ts` HTTP
处理程序和一个会对其进行测试的 `main_test.ts`，报告看起来如下：

```console
$ deno coverage coverage/
| 文件      | 分支 % | 函数 % | 行 % |
| --------- | ------ | ------- | ----- |
| main.ts   |     75.0 |      100.0 |   80.0 |
| 所有文件 |     75.0 |      100.0 |   80.0 |
```

每一行都会显示某个文件的三个百分比：

- **分支 %**：有多少条件路径（例如 `if`、三元运算符等的每一侧）被执行到
- **函数 %**：有多少已声明函数至少被调用过一次
- **行 %**：有多少可执行行运行过

要查看哪些行未命中，添加 `--detailed`。未覆盖的行会列在
每个文件下方：

```console
$ deno coverage --detailed coverage/
cover file:///dev/my-project/main.ts ... 80.000% (12/15)
  16 | if (import.meta.main) {
  17 |   Deno.serve(handler);
  18 | }
```

这里测试直接导入并调用了 `handler` 函数，但从未启动
服务器，因此 `main.ts` 底部的 `import.meta.main` 代码块是
从未运行的代码。这正是值得采取行动的洞见：要么测试
缺失的路径，要么[有意将其排除](#ignore-code-in-the-report)。

## 生成 HTML 报告

对于超过几份文件的项目，HTML 报告更容易
浏览。它会将摘要表显示为可点击的文件树，每个源
文件按行渲染，未覆盖的代码会高亮显示：

```sh
deno coverage --html coverage/
```

这会将报告写入 `coverage/html/`。在浏览器中打开 `coverage/html/index.html` 即可
查看。

## 为 CI 导出 lcov

大多数覆盖率服务和编辑器扩展都支持
[lcov 格式](https://github.com/linux-test-project/lcov)。使用
`--lcov` 导出：

```sh
deno coverage --lcov --output=coverage.lcov coverage/
```

如果不使用 `--output`，lcov 报告会写入 stdout。在 GitHub Actions
工作流中，生成该文件并将其上传到你的覆盖率服务，例如
使用 Codecov action：

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: denoland/setup-deno@v2
  - run: deno test --coverage
  - run: deno coverage --lcov --output=coverage.lcov coverage/
  - uses: codecov/codecov-action@v5
    with:
      files: coverage.lcov
```

## 强制执行覆盖率阈值

`deno coverage` 会报告覆盖率，但没有内置标志可在覆盖率
低于目标值时使其失败。通常有两种方式来按覆盖率设置门槛：

1. 让你的覆盖率服务来做这件事。Codecov、Coveralls 以及类似服务可以在覆盖率下降
   或低于配置目标时使拉取请求状态检查失败，并且它们会跟踪长期趋势。
2. 在 CI 中自行检查 lcov 文件。每个文件的记录都包含 `LF`（找到的行数）和 `LH`（命中的行数），
   因此将它们相加即可得到整体行覆盖率：

```sh
deno coverage --lcov coverage/ > coverage.lcov
awk -F: '/^LF/ {lf += $2} /^LH/ {lh += $2}
  END {pct = 100 * lh / lf; printf "line coverage: %.1f%%\n", pct;
  exit (pct < 80)}' coverage.lcov
```

当行覆盖率低于 80% 时，`awk` 脚本会以非零状态退出，从而使
CI 步骤失败。

## 选择显示哪些文件

默认情况下，报告会包含你的本地代码及其导入项（匹配
`^file:` 的 URL），并排除名称中包含 `test.js`、`test.mjs`、`test.ts`、
`test.jsx` 或 `test.tsx` 的任何内容，这样你的测试文件就不会抬高
数字。可通过 `--include` 和 `--exclude` 正则选项进行调整。只有当文件
匹配 include 模式且不匹配 exclude 模式时，它才会出现在报告中：

```sh
# 仅报告 main.ts
deno coverage --include="main.ts" coverage/

# 还包括通过 https 获取的远程模块
deno coverage --include="^file:|https:" coverage/
```

## 在报告中忽略代码

有些代码是有意未测试的：平台特定的回退、调试辅助工具，
或者像上面的 `import.meta.main` 示例那样的入口代码块。用
覆盖率忽略注释标记它，之后它会被当作空白行处理，而不是
计入未覆盖：

```ts
// deno-coverage-ignore
console.log("这一行会被忽略");

// deno-coverage-ignore-start
if (import.meta.main) {
  Deno.serve(handler);
}
// deno-coverage-ignore-stop
```

要将整个文件从报告中移除，请在文件顶部放置 `// deno-coverage-ignore-file`。
每个 `-start` 注释都需要一个匹配的 `-stop`，并且范围
不能嵌套。完整规则请参阅参考文档中的
[忽略代码](/runtime/reference/cli/coverage/#ignoring-code)。

## 继续阅读

- [Deno 中的测试](/runtime/test/)：测试运行器、断言和模拟
- [`deno coverage` 参考](/runtime/reference/cli/coverage/)：所有标志和
  忽略注释规则
- [`deno test` 参考](/runtime/reference/cli/test/)：所有测试运行器
  选项，包括覆盖率收集
