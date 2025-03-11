---
title: "`deno bench`，基准测试工具"
oldUrl:
 - /runtime/manual/tools/benchmarker/
 - /runtime/reference/cli/benchmarker/
command: bench
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bench"
description: "Run benchmarks using Deno's built-in bench tool."
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

```sh
deno bench url_bench.ts
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/url_bench.ts
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
URL 解析       17.29 µs/iter  (16.67 µs … 153.62 µs)  17.25 µs  18.92 µs  22.25 µs
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
cpu: Apple M1 Max
runtime: deno 1.21.0 (aarch64-apple-darwin)

file:///dev/deno/time_bench.ts
benchmark              time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------- -----------------------------
Date.now()         125.24 ns/iter (118.98 ns … 559.95 ns) 123.62 ns 150.69 ns 156.63 ns
performance.now()    2.67 µs/iter     (2.64 µs … 2.82 µs)   2.67 µs   2.82 µs   2.82 µs

summary
  Date.now()
   比 performance.now() 快 21.29 倍
```

你可以在同一个文件中指定多个组。

## 运行基准测试

要运行基准测试，调用 `deno bench` 并指定包含你的基准函数的文件。你也可以省略文件名，在这种情况下，将运行当前目录中（递归）与 glob `{*_,*.,}bench.{ts, tsx, mts, js, mjs, jsx}` 匹配的所有基准测试。如果你传递一个目录，将运行该目录中与此 glob 匹配的所有文件。

该 glob 扩展为：

- 文件名为 `bench.{ts, tsx, mts, js, mjs, jsx}`，
- 或以 `.bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件，
- 或以 `_bench.{ts, tsx, mts, js, mjs, jsx}` 结尾的文件。

```shell
# 运行当前目录及所有子目录中的所有基准测试
deno bench

# 运行 util 目录中的所有基准测试
deno bench util/

# 仅运行 my_bench.ts
deno bench my_bench.ts
```

> ⚠️ 如果您想向基准测试文件传递其他 CLI 参数，请使用 `--` 来告知 Deno 剩余的参数是脚本参数。

```shell
# 将额外参数传递给基准测试文件
deno bench my_bench.ts -- -e --foo --bar
```

`deno bench` 使用与 `deno run` 相同的权限模型，因此，例如，在基准测试期间写入文件系统时将需要 `--allow-write`。

要查看与 `deno bench` 的所有运行时选项，可以参考命令行帮助：

```shell
deno help bench
```

## 过滤

有多种选项可以过滤你正在运行的基准测试。

### 命令行过滤

基准测试可以单独运行或按组运行，使用命令行 `--filter` 选项。

过滤器标志接受一个字符串或一个模式作为值。

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

```shell
deno bench --filter "bench" benchmarks/
```

反过来，以下命令使用模式，将运行第二个和第三个基准测试。

```shell
deno bench --filter "/bench-*\d/" benchmarks/
```

_为了让 Deno 知道你想使用模式，请用正斜杠将你的过滤器括起来，就像 JavaScript 的正则表达式语法糖一样。_

### 基准定义过滤

在基准测试本身内，你有两个过滤选项。

#### 过滤掉（忽略这些基准测试）

有时你想根据某种条件忽略基准测试（例如，你只想在 Windows 上运行基准）。为此，你可以在基准定义中使用 `ignore` 布尔值。如果设置为 true，该基准将被跳过。

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

有时你可能在一个大型基准测试类中遇到性能问题，并希望专注于仅该单个基准，并暂时忽略其余基准。为此，你可以使用 `only` 选项来告诉基准测试工具仅运行设置为 true 的基准。多个基准可以设置此选项。虽然基准测试运行会报告每个基准的成功或失败，但如果任何基准标记为 `only`，则整体基准测试运行将始终失败，因为这只是一个临时措施，它几乎禁用所有基准测试。

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

要将输出作为 JSON 进行检索，请使用 `--json` 标志：

```
$ deno bench --json bench_me.js
{
  "runtime": "Deno/1.31.0 x86_64-apple-darwin",
  "cpu": "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
  "benches": [
    "origin": "file:///dev/bench_me.js",
    "group": null,
    "name": "Deno.UnsafePointerView#getUint32",
    "baseline": false,
    "result": {
      "ok": {
        "n": 49,
        "min": 1251.9348,
        "max": 1441.2696,
        "avg": 1308.7523755102038,
        "p75": 1324.1055,
        "p99": 1441.2696,
        "p995": 1441.2696,
        "p999": 1441.2696
      }
    }
  ]
}
```