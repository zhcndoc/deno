---
title: "CPU 性能分析"
description: "使用内置 CPU 分析器对 Deno 程序进行性能分析：收集分析文件、Markdown 和 flamegraph 报告、Chrome DevTools 分析以及分析技巧。"
---

Deno 内置支持 V8 CPU 性能分析，可帮助你识别代码中的性能瓶颈。使用 `--cpu-prof` 标志在程序执行期间捕获 CPU 分析文件：

```sh
deno run --cpu-prof your_script.ts
# 或使用 deno eval
deno eval --cpu-prof "for (let i = 0; i < 1e8; i++) {}"
```

当程序退出时，Deno 会将一个 `.cpuprofile` 文件写入当前目录（例如 `CPU.1769017882255.25986.cpuprofile`）。该文件可以加载到 Chrome DevTools（Performance 选项卡）或其他 V8 分析查看器中进行分析。

## CPU 分析标志

| Flag                                 | 描述                                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `--cpu-prof`                         | 启用 CPU 分析。退出时将分析文件写入磁盘。                                                                         |
| `--cpu-prof-dir=<DIR>`               | CPU 分析文件的写入目录。默认为当前目录。会隐式启用 `--cpu-prof`。                                                 |
| `--cpu-prof-name=<NAME>`             | CPU 分析文件的文件名。默认为 `CPU.<timestamp>.<pid>.cpuprofile`。                                                  |
| `--cpu-prof-interval=<MICROSECONDS>` | 采样间隔，单位为微秒。默认值为 `1000`（1ms）。更低的值会提供更多细节，但文件也会更大。                             |
| `--cpu-prof-md`                      | 生成一个人类可读的 Markdown 报告，与 `.cpuprofile` 文件并排生成。                                                 |
| `--cpu-prof-flamegraph`              | 生成一个交互式 SVG flamegraph，与 `.cpuprofile` 文件并排生成。                                                     |

:::note

CPU 分析会报告转译后的 JavaScript 代码行号，而不是原始 TypeScript 源码。这是 V8 分析器的限制。对于 TypeScript 文件，报告中的行号可能不会与源代码直接对应。

:::

## 自定义分析输出

默认情况下，分析文件会写入当前目录，并使用自动生成的文件名。你可以控制分析文件的保存位置和方式：

```sh
# 将分析文件保存到特定目录
deno run --cpu-prof --cpu-prof-dir=./profiles your_script.ts

# 使用自定义文件名
deno run --cpu-prof --cpu-prof-name=my-profile.cpuprofile your_script.ts

# 提高采样频率以获得更多细节（默认：1000μs）
deno run --cpu-prof --cpu-prof-interval=100 your_script.ts
```

更低的 `--cpu-prof-interval` 会让每秒捕获更多样本，从而获得更细的粒度，但代价是分析文件更大。默认的 `1000` 微秒（1ms）对大多数使用场景来说是一个不错的平衡。对于你想要详细捕获的短生命周期函数，可以尝试 `100`（0.1ms）。

## 在 Chrome DevTools 中分析

要分析 `.cpuprofile` 文件：

1. 打开 Chrome DevTools（F12）
2. 转到 **Performance** 选项卡
3. 点击 **Load profile** 按钮（向上箭头图标）
4. 选择你的 `.cpuprofile` 文件

DevTools 将显示 flame chart，以及应用中时间耗费位置的详细分解。

## 示例：Markdown 报告

`--cpu-prof-md` 标志会生成一个易于阅读的 Markdown 摘要，无需将分析文件加载到 DevTools 中：

```sh
deno run -A --cpu-prof --cpu-prof-md server.js
```

这会同时创建一个 `.cpuprofile` 文件和一个 `.md` 文件，报告如下：

```md
# CPU Profile

| Duration | Samples | Interval | Functions |
| -------- | ------- | -------- | --------- |
| 833.06ms | 641     | 1000us   | 10        |

**Top 10:** `op_crypto_get_random_values` 98.5%, `(garbage collector)` 0.7%,
`getRandomValues` 0.6%, `assertBranded` 0.2%

## Hot Functions (Self Time)

| Self% |     Self | Total% |    Total | Function                      | Location          |
| ----: | -------: | -----: | -------: | ----------------------------- | ----------------- |
| 98.5% | 533.00ms |  98.5% | 533.00ms | `op_crypto_get_random_values` | [native code]     |
|  0.7% |   4.00ms |   0.7% |   4.00ms | `(garbage collector)`         | [native code]     |
|  0.6% |   3.00ms |   0.6% |   3.00ms | `getRandomValues`             | 00_crypto.js:5274 |
|  0.2% |   1.00ms |   0.2% |   1.00ms | `assertBranded`               | 00_webidl.js:1149 |

## Call Tree (Total Time)

| Total% |    Total | Self% |     Self | Function                      | Location          |
| -----: | -------: | ----: | -------: | ----------------------------- | ----------------- |
|  16.8% |  91.00ms | 16.8% |  91.00ms | `(anonymous)`                 | server.js:1       |
|   0.6% |   3.00ms |  0.6% |   3.00ms | `getRandomValues`             | 00_crypto.js:5274 |
|  98.5% | 533.00ms | 98.5% | 533.00ms | `op_crypto_get_random_values` | [native code]     |

## Function Details

## `op_crypto_get_random_values`

[native code] | 自身：98.5%（533.00ms） | 总计：98.5%（533.00ms） | 样本：533
```

该报告包括：

- **摘要**：总持续时间、样本数量、采样间隔和函数数量
- **Top 10**：最耗时函数的快速概览
- **Hot Functions**：按自身耗时排序的函数（函数自身代码中耗费的时间，不包括被调用函数）
- **Call Tree**：显示调用栈和时间分布的层级视图
- **Function Details**：按函数细分的样本计数

## 示例：交互式 flamegraph

`--cpu-prof-flamegraph` 标志会生成一个自包含、交互式的 SVG flamegraph，你可以直接在浏览器中打开，无需外部工具：

```sh
deno run --cpu-prof --cpu-prof-flamegraph your_script.ts
```

这会同时创建一个 `.cpuprofile` 文件和一个 `.svg` 文件。在任意浏览器中打开 SVG 以交互式探索分析结果：

- **Click** 任意框以缩放到该子树
- **Reset Zoom** 按钮可恢复完整视图
- **Ctrl+F** 或 **Search** 按钮用于基于正则表达式的函数搜索，并带有高亮和匹配百分比
- **Invert** 复选框可切换为 icicle graph（根在顶部）
- **Hover** 任意框可查看函数名和样本计数

flamegraph 也可与 `deno eval` 一起使用：

```sh
deno eval --cpu-prof --cpu-prof-flamegraph "for (let i = 0; i < 1e8; i++) {}"
```

## 性能分析技巧

- **分析具有代表性的工作负载**：对于 HTTP 服务器，在停止之前向服务器发送真实流量——分析文件只会捕获程序运行期间发生的内容。
- **使用自身耗时与总耗时**：在分析报告中，_自身耗时_ 是函数自身代码中花费的时间，而 _总耗时_ 包括其调用的函数所花费的时间。较高的自身耗时指向真正的瓶颈；总耗时高但自身耗时低，则表示该函数把工作委托给了某个昂贵的部分。
- **前后对比**：使用描述性的 `--cpu-prof-name` 值保存分析文件（例如 `before-optimization.cpuprofile`），这样你就可以在修改后在 DevTools 中并排比较分析结果。
- **组合输出格式**：你可以将 `--cpu-prof-md` 和 `--cpu-prof-flamegraph` 结合使用，在一次运行中获得全部三种输出（`.cpuprofile`、`.md` 和 `.svg`）：
  ```sh
  deno run --cpu-prof --cpu-prof-md --cpu-prof-flamegraph your_script.ts
  ```
- **过滤噪声**：短生命周期程序可能会显示启动开销（模块加载、JIT 编译）主导分析结果。为了获得更准确的结果，请确保你想分析的代码运行足够长，以收集有意义的样本。
