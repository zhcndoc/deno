---
last_modified: 2026-04-29
title: "deno bump-version"
command: bump-version
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bump-version"
description: "在 deno.json 或 package.json 中提升项目的版本字段"
---

`deno bump-version` 命令会更新你项目配置文件中的 `version` 字段，类似于 `npm version`。如果存在，它会读取并写入 `deno.json(c)` 中的 `version` 字段；否则会回退到 `package.json`。

:::caution

`deno bump-version` 仍处于实验阶段，可能会发生变化。

:::

## 用法

```sh
deno bump-version [increment]
```

`increment` 参数用于选择版本提升方式：

| 增量         | 示例                  |
| ------------ | --------------------- |
| `patch`      | `1.4.6` → `1.4.7`     |
| `minor`      | `1.4.6` → `1.5.0`     |
| `major`      | `1.4.6` → `2.0.0`     |
| `prepatch`   | `1.4.6` → `1.4.7-0`   |
| `preminor`   | `1.4.6` → `1.5.0-0`   |
| `premajor`   | `1.4.6` → `2.0.0-0`   |
| `prerelease` | `1.4.7-0` → `1.4.7-1` |

如果省略 `increment`，则会打印当前版本，并且配置文件保持不变。

如果配置文件中没有 `version` 字段且提供了增量，则版本默认从 `0.1.0` 开始。

如果当前目录中既找不到 `deno.json` 也找不到 `package.json`，该命令将以错误退出。

## 示例

发布一个补丁版本：

```sh
deno bump-version patch
```

发布一个新的次版本：

```sh
deno bump-version minor
```

在预发布版本上继续迭代：

```sh
deno bump-version prerelease
```

打印当前版本而不修改文件：

```sh
deno bump-version
```

提升版本后，请将更新后的配置文件作为发布流程的一部分提交。要将提升后的版本发布到 JSR，请参阅
[`deno publish`](/runtime/reference/cli/publish/)；要生成 npm tarball，请参阅
[`deno pack`](/runtime/reference/cli/pack/)。

## 工作区模式

当在 [workspace](/runtime/fundamentals/workspaces/) 根目录运行时，
`deno bump-version` 会一次性作用于每个成员包，而不是只处理根配置：

- 相同的增量会应用到每个成员的 `version` 字段。
- 工作区根配置以及任何
  [导入映射](/runtime/reference/deno_json/#dependencies) 中的 `jsr:` 版本约束会原地重写，
  以便跨包引用保持与提升后的版本匹配。
- 没有 `version` 字段的成员将保持不变。

```sh
# 在工作区根目录：将每个成员从 1.4.6 提升到 1.4.7
deno bump-version patch
```

这样可以避免以前工作区发布时需要逐个更新每个成员的 `deno.json`/`package.json` 以及根导入映射的手动协调步骤。

## 从 Conventional Commits 推导版本提升

在工作区中运行不带 `increment` 参数的 `deno bump-version` 时，
会切换为根据
[Conventional Commits](https://www.conventionalcommits.org/) 在基准引用和当前分支之间推导每个包的版本提升。每个成员的提升都会独立根据触及其内部文件的提交计算（遵循作用域提交和通配符 `*`
作用域），并将提升后的版本写回成员配置以及任何导入映射约束。

推导规则如下：

- `fix:` 和其他补丁级别类型 → `patch`。
- `feat:` → `minor`。
- 在正文中标记了 `BREAKING CHANGE:`，或在类型后带有 `!` 的提交
  （例如 `feat!:`）→ `major`。
- 对于仍处于 `0.x.y` 的包，SemVer 规则会更保守地应用：破坏性变更会产生
  `minor` 提升而不是 `major`，而 `feat:` 会产生 `patch`。
- 预发布版本（`-0`、`-1`，等等）会得到 `prerelease` 增量。
- 自基准引用以来对包版本所做的任何手动编辑都被视为权威结果并会被跳过——该工具不会覆盖刻意选择的版本。

```sh
# 根据 `main` 和当前分支之间的提交推导版本提升
deno bump-version --base=main
```

### 选择范围

当默认范围（自最新标签以来的当前分支）不是你想要的时，两个标志可以固定比较范围：

- `--base=<ref>` — 用作比较基准的引用。通常是发布分支或标签
  （`--base=main`、`--base=v1.4.7`）。
- `--start=<ref>` — 更改集开始的位置引用。默认为 `--base` 和 `HEAD` 之间的合并基点。

```sh
# 基于 v1.4.7 与当前分支之间的提交进行提升
deno bump-version --base=v1.4.7

# 基于两个显式引用之间的提交进行提升
deno bump-version --base=v1.4.7 --start=release/1.5
```

### `--dry-run`

传入 `--dry-run` 可打印计划中的更改——哪些包会提升、旧/新版本对，以及重写后的 `jsr:` 约束——而不向磁盘写入任何内容：

```sh
deno bump-version --base=main --dry-run
```

这非常适合用于 CI 检查（“这个分支会产生我们预期的提升吗？”），也适合在本地提交前预览发布结果。
