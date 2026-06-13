---
last_modified: 2026-05-20
title: "deno why"
command: why
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno why"
description: "通过显示其依赖链来解释为什么某个包会被安装"
---

`deno why` 命令通过打印从项目的直接依赖到所查询包的每一条路径，来解释为什么某个特定包会出现在你的依赖树中。它读取
[锁文件](/runtime/packages/#lockfile-and-reproducible-installs)，因此无论你使用哪种 node_modules / npm 解析器模式，都可以工作，而且不会接触网络。

它与 [`deno add`](/runtime/reference/cli/add/) 和
[`deno remove`](/runtime/reference/cli/remove/) 配合使用：一旦你知道某个传递依赖为什么会出现在你的树中，就可以决定是否移除那个把它引入进来的直接依赖。

## 用法

```sh
deno why <package>
```

`<package>` 是一个 npm 或 JSR 包名，也可以可选地用 `@<version>` 锁定版本：

| 形式            | 含义                                         |
| --------------- | -------------------------------------------- |
| `ms`            | 树中所有版本的 `ms`                          |
| `ms@2.0.0`      | 仅 `2.0.0` 版本                              |
| `@std/path`     | 通过裸名称指定的 JSR 包                      |
| `jsr:@std/path` | 通过完整标识符指定的 JSR 包                  |
| `npm:express`   | 强制使用 npm 查找（当名称冲突时很有用）       |

## 示例

### 单个包的多条路径

```sh
$ deno why ms
ms@2.0.0
  npm:express@^4.18.0 > debug@2.6.9 > ms@2.0.0
  npm:express@^4.18.0 > body-parser@1.20.4 > debug@2.6.9 > ms@2.0.0
  npm:express@^4.18.0 > finalhandler@1.3.2 > debug@2.6.9 > ms@2.0.0

ms@2.1.3
  npm:express@^4.18.0 > send@0.19.2 > ms@2.1.3
```

当同一个包以多个版本出现时，每个版本都会显示在自己的块中——这对于诊断导致 `node_modules` 膨胀的重复依赖很有帮助。

### 锁定到单个版本

```sh
$ deno why ms@2.1.3
ms@2.1.3
  npm:express@^4.18.0 > send@0.19.2 > ms@2.1.3
```

### JSR 包

```sh
$ deno why @std/path
@std/path@1.0.6
  @scope/my-lib@^1.0.0 > @std/path@1.0.6
  @std/fs@^1.0.16 > @std/path@1.0.6
```

Deno 2.8+ 中添加的 JSR 包的解析方式与 npm 包相同——你可以传入裸名称（`@std/path`）或完整标识符（`jsr:@std/path`）。

### 工作区成员

在 [workspace](/runtime/fundamentals/workspaces/) 中，每个成员的直接依赖都会作为输出中的根节点出现，因此由某个包引入的传递依赖可以清楚地归属于该包。

## 退出码

| 退出码   | 含义                                                                                 |
| -------- | -------------------------------------------------------------------------------------- |
| `0`       | 在解析后的树中找到了该包——至少打印出了一条依赖路径。                                  |
| 非零      | 该包不在解析后的树中，或者参数格式不正确。                                             |

非零退出码是用于在 CI 中检查某个包 _没有_ 被引入的简便方式。例如，要断言 `left-pad` 永远不会进入你的树：

```sh
# 如果 left-pad 可达，则构建失败
! deno why left-pad
```

## 常见陷阱

- **“Package not found”，但你 _知道_ 它在运行时会被用到。** `deno why`
  报告的是锁文件里的内容，而不是代码中 _导入_ 的内容。如果你已经添加了一个 `npm:` 或 `jsr:` 标识符，但还没有运行 `deno install`（或任何会触发解析的子命令），那么该包暂时不会出现。
- **解析取决于工作区模式。** 仅被某个工作区成员使用的包，如果你的工作区使用按成员分别生成的锁文件，那么从另一个成员的目录运行时可能不会显示出来。为了查看完整情况，请从工作区根目录运行 `deno why`。
