---
last_modified: 2026-06-25
title: "deno list"
command: list
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno list"
description: "列出项目中声明的依赖项"
---

`deno list` 命令会打印出你的项目声明为依赖项的包。它会从你的
[`deno.json`](/runtime/fundamentals/configuration/) 中的 `imports`，
以及 `package.json` 中的 `dependencies` 和 `devDependencies` 读取这些依赖，
将每个依赖解析为当前使用的版本，并按包分组打印出来，类似于 `npm ls` 或
`pnpm list`。

它回答的问题与
[`deno info`](/runtime/reference/cli/info/) 不同：`deno info` 会从一个入口点遍历模块图，
并报告它到达的每个文件，而 `deno list` 则直接根据清单报告项目依赖于什么，
不需要入口点。

## 用法

```sh
deno list [OPTIONS] [filters...]
```

默认情况下，`deno list` 会打印直接依赖的扁平表格。可选的位置参数 `filters` 可通过包名缩小输出范围，并支持通配符和 `!` 否定，与 [`deno outdated`](/runtime/reference/cli/outdated/) 使用的匹配器相同。

## 选项

| 选项          | 描述                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `--depth <N>` | 渲染解析后的依赖树，深度为 N 层，适用于 npm 和 JSR 包（从锁文件中读取）。                              |
| `--prod`      | 仅显示生产依赖。                                                                                      |
| `--dev`       | 仅显示开发依赖。                                                                                      |
| `--recursive` | 包含每个工作区成员的依赖。                                                                           |

## 示例

列出直接依赖：

```sh
deno list
```

显示深度为两级的依赖树：

```sh
deno list --depth 2
```

仅列出名称以 `@std/` 开头的生产依赖：

```sh
deno list --prod "@std/*"
```
