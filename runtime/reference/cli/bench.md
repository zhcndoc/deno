---
title: "`deno bench`，基准测试工具"
oldUrl:
  - /runtime/manual/tools/benchmarker/
  - /runtime/reference/cli/benchmarker/
command: bench
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bench"
description: "使用 Deno 内置的 bench 工具运行基准测试。"
---

## 快速开始

首先，创建一个文件 `url_bench.ts` 并使用 `Deno.bench()` 函数注册一个基准测试。

```ts
// url_bench.ts
Deno.bench("URL 解析", () => {
  new URL("https://deno.land");
});
```

其次，使用 `deno bench` 子命令运行基准测试。

```shell
$ deno bench url_bench.ts
Check file:///path/to/url_bench.ts
    CPU | 12th Gen Intel(R) Core(TM) i3-12100
Runtime | Deno 2.4.2 (x86_64-unknown-linux-gnu)

file:///path/to/url_bench.ts

| benchmark     | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ------------- | --------------- | ------------- | --------------------- | -------- | -------- | -------- |
| URL parsing   |        345.8 ns |     2,892,000 | (325.4 ns … 497.2 ns) | 346.9 ns | 443.2 ns | 497.2 ns |
```

## 编写基准测试

要定义一个基准测试，你需要通过调用 `Deno.bench` API 来注册它。这个 API 有多个重载，可以提供最大的灵活性，并在不同形式之间轻松切换（例如，当需要快速关注单个基准进行调试时，使用 `only: true` 选项）：

```ts
// 紧凑形式：名称和函数
Deno.bench("你好，世界 #1", () => {
  new URL("https://deno.land");
});

// 紧凑形式：命名函数。
Deno.bench(function helloWorld3() {
  new URL("https://deno.land");
});

// 较长形式：基准定义。
Deno.bench({
  name: "你好，世界 #2",
  fn: () => {
    new URL("https://deno.land");
  },
});

// 与紧凑形式相似，第二个参数是额外配置。
Deno.bench("你好，世界 #4", { permissions: { read: true } }, () => {
  new URL("https://deno.land");
});

// 与较长形式相似，第二个参数是基准函数。
Deno.bench(
  { name: "你好，世界 #5", permissions: { read: true } },
  () => {
    new URL("https://deno.land");
  },
);

// 与较长形式相似，第二个参数是命名基准函数。
Deno.bench({ permissions: { read: true } }, function helloWorld6() {
  new URL("https://deno.land");
});
```

### 异步函数

你还可以通过传递一个返回 Promise 的基准函数来基准化异步代码。为此，可以在定义函数时使用 `async` 关键字：

```ts
Deno.bench("异步你好，世界", async () => {
  await 1;
});
```

### 关键部分

有时基准测试用例需要包括设置和拆卸代码，这可能会影响基准结果。例如，如果你想测量读取小文件的时间，你需要打开文件、读取它，然后关闭它。如果文件足够小，打开和关闭文件所需的时间可能会超过读取文件本身所需的时间。

为帮助处理此类情况，你可以使用 `Deno.BenchContext.start` 和 `Deno.BenchContext.end` 来告诉基准测试工具你想要测量的关键部分。在这两个调用之间的所有部分将被排除在测量之外。

```ts
Deno.bench("foo", async (b) => {
  // 打开一个我们将要操作的文件。
  using file = await Deno.open("a_big_data_file.txt");

  // 告诉基准测试工具这是你想测量的唯一部分。
  b.start();

  // 现在让我们测量从文件中读取所有数据需要多长时间。
  await new Response(file.readable).arrayBuffer();

  // 在这里结束测量。
  b.end();
});
```

上述示例需要 `--allow-read` 标志来运行基准测试：
`deno bench --allow-read file_reading.ts`。

## 分组与基准线

在注册基准测试用例时，可以使用 `Deno.BenchDefinition.group` 选项将其分配到一个组中：

```ts
// url_bench.ts
Deno.bench("url 解析", { group: "url" }, () => {
  new URL("https://deno.land");
});
```

将多个用例分配到单个组中并比较它们的表现相对于“基准线”用例是非常有用的。

在这个示例中，我们将检查 `Date.now()` 相对于 `performance.now()` 的性能如何，为此，我们将第一个用例标记为“基准线”，使用 `Deno.BenchDefinition.baseline` 选项：

```ts
// time_bench.ts
Deno.bench("Date.now()", { group: "timing", baseline: true }, () => {
  Date.now();
});

Deno.bench("performance.now()", { group: "timing" }, () => {
  performance.now();
});
```

```shell
$ deno bench time_bench.ts
    CPU | 12th Gen Intel(R) Core(TM) i3-12100
Runtime | Deno 2.4.2 (x86_64-unknown-linux-gnu)

file:///path/to/time_bench.ts

| benchmark           | time/iter (avg) |        iter/s |      (min … max)      |      p75 |      p99 |     p995 |
| ------------------- | --------------- | ------------- | --------------------- | -------- | -------- | -------- |

group timing
| Date.now()          |         44.2 ns |    22,630,000 | ( 42.3 ns …  73.4 ns) |  44.0 ns |  54.1 ns |  55.1 ns |
| performance.now()   |         59.9 ns |    16,700,000 | ( 56.0 ns …  94.8 ns) |  60.7 ns |  76.6 ns |  79.5 ns |

summary
  Date.now()
     1.35x faster than performance.now()
```

你可以在同一个文件中指定多个组。

## 运行基准测试

要运行基准测试，请使用包含基准函数的文件作为参数调用 `deno bench`。你也可以省略文件名，这时会运行当前目录（递归）下所有匹配通配符 `{*_,*.,}bench.{ts, tsx, mts, js, mjs, jsx}` 的基准测试。如果你传入一个目录，则该目录中所有匹配该通配符的文件都会被运行。

该通配符匹配：

- 名称为 `bench.{ts, tsx, mts, js, mjs, jsx}` 的文件，
- 或以 `.bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件，
- 或以 `_bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件

```bash
# 运行当前目录及所有子目录中的所有基准测试
deno bench

# 运行 util 目录中的所有基准测试
deno bench util/

# 仅运行 my_bench.ts
deno bench my_bench.ts
```

> ⚠️ 如果你想向基准测试文件传递其他 CLI 参数，请使用 `--` 来告知 Deno 剩余的参数是脚本参数。

```bash
# 向基准测试文件传递额外参数
deno bench my_bench.ts -- -e --foo --bar
```

`deno bench` 使用与 `deno run` 相同的权限模型，例如，在基准测试期间写入文件系统时，将需要 `--allow-write`。

要查看与 `deno bench` 相关的所有运行时选项，可以参考命令行帮助：

```bash
deno help bench
```

## 过滤

有多种方式可以过滤你正在运行的基准测试。

### 命令行过滤

基准测试可以单独运行或按组运行，通过命令行的 `--filter` 选项实现。

`--filter` 接受字符串或模式作为值。

假设有以下基准测试：

```ts
Deno.bench({
  name: "my-bench",
  fn: () => {/* 基准函数零 */},
});
Deno.bench({
  name: "bench-1",
  fn: () => {/* 基准函数一 */},
});
Deno.bench({
  name: "bench2",
  fn: () => {/* 基准函数二 */},
});
```

此命令将运行所有这些基准测试，因为它们都包含单词“bench”。

```bash
deno bench --filter "bench" benchmarks/
```

反之，以下命令使用模式，会运行第二个和第三个基准测试。

```bash
deno bench --filter "/bench-*\d/" benchmarks/
```

_为了让 Deno 知道你想使用正则表达式模式，请用斜杠将你的过滤器括起来，就像 JavaScript 的正则表达式字面量语法一样。_

### 基准定义过滤

在基准测试本身内，有两种过滤选项。

#### 过滤掉（忽略这些基准测试）

有时你想根据某种条件跳过基准测试（例如，只想在 Windows 上运行基准）。为此，可以在基准定义中设置 `ignore` 布尔值。如果为 true，该基准测试将被跳过。

```ts
Deno.bench({
  name: "基准 Windows 特性",
  ignore: Deno.build.os !== "windows",
  fn() {
    // 执行 Windows 特性
  },
});
```

#### 过滤进（仅运行这些基准测试）

有时你可能遇到性能问题，只想聚焦于单个基准测试，暂时忽略其余基准。为此，可以使用 `only` 选项，让基准测试工具仅运行设置为 true 的基准。多个基准可以设置此选项。虽然基准测试运行会报告每个基准的成功或失败，但如果任何基准标记为 `only`，则整体基准测试运行将始终以失败告终，因为这是一个临时措施，几乎禁用所有其他基准测试。

```ts
Deno.bench({
  name: "仅关注此基准",
  only: true,
  fn() {
    // 基准复杂内容
  },
});
```

## JSON 输出

要以 JSON 格式检索输出，请使用 `--json` 标志：

```shell
$ deno bench my_bench.ts --json
{
  "version": 1,
  "runtime": "Deno/2.4.2 x86_64-unknown-linux-gnu",
  "cpu": "12th Gen Intel(R) Core(TM) i3-12100",
  "benches": [
    {
      "origin": "file:///path/to/my_bench.ts",
      "group": null,
      "name": "Test",
      "baseline": false,
      "results": [
        {
          "ok": {
            "n": 51,
            "min": 946.7129,
            "max": 3024.3281,
            "avg": 1241.3926823529412,
            "p75": 1174.9718,
            "p99": 3024.3281,
            "p995": 3024.3281,
            "p999": 3024.3281,
            "highPrecision": false,
            "usedExplicitTimers": false
          }
        }
      ]
    }
  ]
}
```