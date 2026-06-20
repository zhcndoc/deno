---
last_modified: 2026-06-19
title: "供应链管理"
description: "保持 Deno 依赖的确定性和安全性：锁文件纪律、最低依赖年龄、deno audit、有意的更新，以及推荐的 CI 基线。"
---

现代 JavaScript 项目从许多来源拉取代码（JSR、npm、本地
工作区）。良好的供应链管理有助于你实现四个目标：

- 确定性：每个人（以及你的 CI）运行完全相同的代码。
- 安全性：及早发现意外的上游变更或被破坏的依赖。
- 速度：你可以在选择的时机有意地更新依赖。
- 韧性：即使离线或注册表出现故障，构建也能继续工作。

本页基于
[锁文件](/runtime/packages/#lockfile-and-reproducible-installs) 和
[vendoring](/runtime/packages/#vendoring-remote-modules)，它们来自
[依赖管理指南](/runtime/packages/)。

## 核心实践

1. 有意地固定版本
   - 对于应用程序，优先使用精确版本（例如
     `jsr:@luca/cases@1.2.3`）。
   - 对于库，使用插入符号范围（`^1.2.3`）可让使用者获得
     向后兼容的修复。
   - 在生产应用中，避免使用无界（`*`）或过于宽泛的范围。
2. 提交你的 `deno.lock` 文件。
3. 在 CI / 生产环境中启用冻结锁文件（`--frozen` 或
   `"lock": { "frozen": true }`），这样新的、未知的依赖会使构建失败，
   而不是悄悄出现。
4. 当你需要密封/离线构建（`"vendor": true`）或必须在本地修补第三方代码时，
   使用 vendor。Vendoring 不会取消锁文件的需求——它与之互补。
5. 将 `jsr:` 和 `npm:` 说明符与导入映射（`imports`）条目一起使用，以
   集中管理版本。
6. 定期解除冻结并有意识地更新（例如按周或
   按迭代节奏），而不是在功能开发期间临时更新。
7. 设置一个[最低依赖年龄](#minimum-dependency-age)，这样新发布的
   版本就不能在生态系统有时间发现被破坏的发布之前进入安装流程。

## 最低依赖年龄

Deno 可以拒绝安装任何年龄低于配置值的包版本。
这是一种低成本、广覆盖的防御 npm 供应链攻击的方法：恶意版本通常会在几天内被发现并撤回，因此把安装延迟到类似的时间窗口可以捕获其中大部分。

你可以在三个地方配置相同的控制；选择最适合项目的方式：

- **`deno.json`**，应用于整个项目：

  ```jsonc title="deno.json"
  {
    "minimumDependencyAge": "P3D"
  }
  ```

- **CLI 标志**，按需应用，例如用于一次性安装或 CI 步骤：

  ```sh
  deno install --minimum-dependency-age=P3D
  ```

- **`.npmrc`**（Deno 2.8+），符合 npm 约定，在需要在 npm 和 Deno 工具之间共享同一个 `.npmrc` 时很有用。npm 设置只接受整数天数：

  ```ini title=".npmrc"
  min-release-age=3
  ```

`deno.json` 和 `--minimum-dependency-age` 接受
[ISO-8601 持续时间](https://en.wikipedia.org/wiki/ISO_8601#Durations)，例如
`P3D`（3 天）或 `PT72H`（72 小时），也接受整数（按分钟解释）、
绝对截止日期（`2025-09-16`）或 RFC3339 时间戳，或者 `0` 以禁用。该字段还支持一种对象形式，用于豁免特定包；完整结构请参见
[`minimumDependencyAge` 参考](/runtime/reference/deno_json/#minimum-dependency-age)，
而有关 Deno 读取的其他 npm 注册表选项，请参见
[`.npmrc` 配置](/runtime/fundamentals/node/#.npmrc-configuration)。

## 典型 CI 模式

在 Deno 2.8+ 中，单个命令 [`deno ci`](/runtime/reference/cli/ci/)
封装了推荐的 CI 安装流程（冻结锁文件 + 生命周期脚本）：

```sh
deno ci
```

对于较旧的 Deno 版本，或者需要手动组合这些步骤时：

```sh
# 按锁定状态精确安装（解析）依赖；如果有漂移或新依赖则失败
deno install --frozen --entrypoint main.ts

# （可选）仅使用缓存模块运行，以保证没有网络访问
deno run --cached-only main.ts
```

如果你依赖 `npm` 包（存在 `package.json`），请在 CI 中于运行测试之前包含 `deno install`
（或 `deno ci`），以便 `node_modules` 目录以确定性的方式被生成。

## 有意更新依赖

当你决定更新时：

1. 临时允许写入锁文件：添加 `--frozen=false` 或设置
   `"lock": { "frozen": false }`。
2. 修改版本（编辑 `deno.json`，使用 `deno add <specifier>@<newVersion>`，
   或使用 `deno remove` 删除）。
3. 重新运行 `deno install --entrypoint main.ts`（可选加上 `--reload`）以更新
   解析结果和完整性哈希。
4. 在你的拉取请求中审查 `deno.lock`（以及如果使用了 `vendor/`，也要审查它）的差异。
5. 重新启用冻结锁文件。

## 冻结锁文件疑难排查

你可能会遇到如下错误：

```text
error: The lockfile is frozen. Cannot add new entry for "jsr:@scope/pkg@1.3.0".
```

或者：

```text
error: Module not found in frozen lockfile: https://example.com/dependency/mod.ts
```

常见原因和修复方法：

| 症状                                                     | 原因                                           | 修复                                                                                                                         |
| -------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 需要提升版本但命令因冻结错误失败                           | 锁文件处于冻结模式                             | 重新运行时使用 `--frozen=false`（一次性）或临时设置 `"lock": { "frozen": false }`，然后更新并重新冻结                        |
| 编辑代码后出现新的传递依赖                               | 代码现在导入了锁文件中没有的内容               | 解除冻结（`--frozen=false`），并运行 `deno install --entrypoint <entry>.ts` 记录它                                          |
| 删除了导入，但锁文件仍包含旧条目                         | 锁文件是追加式的；条目会保留                   | （可选）重新生成：先把 `deno.lock` 移到一边（`mv deno.lock deno.lock.old`），运行安装以重建、比较，然后提交                  |
| 锁文件损坏 / 合并冲突                                     | 手动编辑或冲突导致 JSON 不一致                 | 删除冲突部分并重新运行安装，或者完全重新生成                                                                                  |
| 使用了 vendored 依赖但锁文件报错                         | vendor 目录与锁文件不同步                      | 重新运行 `deno install --entrypoint <entry>`（非冻结）以同步两者，然后提交                                                   |

## 安全重建检查清单

只有在必要时才完整重建整个 `deno.lock`（损坏、大规模清理）。当你需要这么做时：

1. 备份它：`cp deno.lock deno.lock.bak`。
2. 删除它：`rm deno.lock`。
3. （如果使用 vendoring）删除或移动 `vendor/` 目录。
4. 运行 `deno install --entrypoint main.ts` 以重新创建。
5. 检查新旧之间的差异，以捕获意外新增内容。

## Vendor 与锁文件

它们是互补的：

- 锁文件：记录远程以及 npm/JSR 依赖的精确解析版本 + 完整性哈希。
- Vendor 目录：将实际源代码存储在本地，以实现密封、离线且可打补丁的构建。

为了获得最大的可复现性，请同时使用两者。即使锁文件被冻结，如果远程源消失，构建也不会完全密封；vendoring 填补了这一缺口。

## 快速决策指南

| 需求                       | 使用                                           |
| -------------------------- | ---------------------------------------------- |
| 检测上游篡改               | 锁文件（提交并冻结）                           |
| 离线 / 断网构建            | `vendor: true` + 锁文件                        |
| 修补第三方代码             | Vendoring 或 `scopes` 覆盖（短期）             |
| 具有完整性保证的快速 CI    | `deno install --frozen`                        |
| 有意升级                   | 临时解除冻结，运行安装，审查差异               |

## 最低供应链基线（推荐）

```json title="deno.json"
{
  "imports": {/* 集中管理版本 */},
  "vendor": true,
  "lock": { "frozen": true }
}
```

提交 `deno.json`、`deno.lock`，以及（如果使用 vendor）整个 `vendor/`
目录。

:::tip 自动化每周依赖刷新

一个计划执行的 CI 作业：解除冻结，运行 `deno add --latest`（或手动提升
关键包版本），执行测试，并打开一个包含更新后 `deno.lock`（以及 `vendor/`）
的拉取请求，可以在保持日常构建确定性的同时，让安全补丁持续流入。

:::
