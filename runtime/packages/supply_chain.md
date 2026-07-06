---
last_modified: 2026-06-25
title: "供应链管理"
description: "保持 Deno 依赖项的确定性和安全性：锁文件规范、最小依赖年龄、发布信任策略、deno audit、有意更新，以及推荐的 CI 基线。"
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
   - 对于应用，优先使用精确版本（例如
     `jsr:@luca/cases@1.2.3`）。
   - 对于库，使用插入符范围（`^1.2.3`）可让使用者获得
     向后兼容的修复。
   - 在生产应用中避免使用无限制（`*`）或过于宽泛的范围。
2. 提交你的 `deno.lock` 文件。
3. 在 CI / 生产环境中启用冻结的锁文件（`--frozen` 或
   `"lock": { "frozen": true }`），这样新的、未见过的依赖会使构建失败，
   而不是悄无声息地出现。
4. 当你需要密封/离线构建（`"vendor": true`）时，或者当你
   必须在本地修补第三方代码时，使用 vendor。vendoring 并不会取消对
   锁文件的需求——它只是对其的补充。
5. 使用带有 import map（`imports`）条目的 `jsr:` 和 `npm:` 说明符，
   以集中管理版本。
6. 定期解除冻结并有意识地更新（例如按周或
   按 sprint 节奏），而不是在特性开发期间临时更新。
7. 设置一个[最低依赖年龄](#minimum-dependency-age)，以便刚发布的
   版本在生态系统有时间发现受损发布之前，不能进入安装流程。
8. 开启一个[发布信任策略](#publishing-trust-policy)，这样以比你
   已锁定版本更弱的方法发布的某个版本会被拒绝，
   而不是被静默接受。

## 最低依赖年龄

Deno 拒绝安装早于所配置年龄的包版本。这是一种低成本、覆盖面广的防护，用于抵御 npm 供应链攻击：恶意版本通常会在几天内被发现并撤回，因此将安装延迟同样一段时间，能拦截其中大部分。

自 Deno 2.9 起，此功能默认开启，窗口为 24 小时，因此即使不做任何配置，最近一天发布的版本也会被跳过。下面的设置可以更改该窗口或将其关闭（将年龄设为 `0`）。

你可以在多个位置配置同样的控制项；选择最适合项目的方式即可：

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

## 发布信任策略

当最小依赖年龄延迟新版本时，发布信任策略会查看一个版本是**如何**被发布的，并拒绝悄悄接受比你已经锁定的更弱的发布方式。

npm 的完整包元数据记录了每个版本的发布方式。Deno 从中读取三种信号：

- **受信任发布（OIDC）** - 该版本是通过 npm 的 OIDC 受信任发布者流程从 CI 发布的，没有使用长期有效的 token。
- **来源证明（Provenance attestation）** - 该版本附带了签名的 SLSA 来源证明，将其关联到源代码提交和构建（使用 `--provenance` 发布）。
- **分阶段发布（Staged publishing）** - 在版本变为可安装之前，维护者通过实时 2FA 挑战批准了该版本。

Deno 将这些信号归并为单一信任级别，从低到高如下：

| 信任级别                         | 信号                                              |
| ------------------------------- | ------------------------------------------------- |
| 纯净                           | 没有发布信任信号                                   |
| 来源证明                       | 仅有来源证明                                        |
| 受信任发布                     | 仅有 OIDC 受信任发布者                               |
| 受信任发布 + 来源证明          | 以上两者都有                                         |
| 分阶段                         | 人工批准的分阶段发布（排名高于所有其他级别）         |

分阶段发布排名最高，因为有人通过实时 2FA 挑战批准了它。这个顺序与 pnpm 的 `trustPolicy: no-downgrade` 相对应。

这样做的动机是供应链安全：如果维护者的 token 被盗，攻击者就可以使用比你一直信任的发布版本更弱的发布方式来发布新版本。`no-downgrade` 策略会把这种静默降级变成硬错误。

在 `.npmrc` 中启用它：

```ini title=".npmrc"
trust-policy=no-downgrade
```

其行为如下：

- Deno 会在 `deno.lock` 中为每个 npm 条目记录解析得到的信任级别（一个 `trust` 字段，若版本为纯净则省略）。该记录的级别会成为下一次解析的基线。
- 启用 `no-downgrade` 后，Deno 会拒绝解析任何候选版本中信任级别低于该包锁定基线的版本，并会获取完整的 packument，以便这些信号可用。
- 基线是锁文件中为某个包记录的最高信任级别，因此随着你锁定更高信任级别的版本，保护也会增强。第一次锁定某个包时，没有先前的基线可供比较。
- 该策略默认关闭。现有锁文件在你开启它之前不会受影响，并且除 `no-downgrade` 之外的任何值都会让它保持关闭。

## 常见的 CI 模式

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

## Vendor and lock files

They are complementary:

- Lock file: records the exact resolved versions of remote and npm/JSR dependencies + integrity hashes.
- Vendor directory: stores the actual source code locally to enable sealed, offline, and patchable builds.

For maximum reproducibility, use both together. Even if the lock file is frozen, the build is not fully sealed if a remote source disappears; vendoring fills that gap.

## 快速决策指南

| 需要                               | 使用                                            |
| ---------------------------------- | ---------------------------------------------- |
| 检测上游篡改                      | 锁文件（提交并冻结）                             |
| 离线 / 气隙构建                   | `vendor: true` + 锁文件                         |
| 修补第三方代码                    | 供货或 `scopes` 覆盖（短期）                    |
| 具有完整性的快速 CI               | `deno install --frozen`                        |
| 有意升级                          | 临时解冻，运行安装，审查差异                    |
| 阻止发布信任降级                  | 在 `.npmrc` 中设置 `trust-policy=no-downgrade` |

## Minimum supply chain baseline (recommended)

```json title="deno.json"
{
  "imports": {/* centralized version management */},
  "vendor": true,
  "lock": { "frozen": true }
}
```

Commit `deno.json`, `deno.lock`, and, if using vendor, the entire `vendor/`
directory.

:::tip Automate weekly dependency refreshes

A scheduled CI job: unfreeze, run `deno add --latest` (or manually bump
critical package versions), run tests, and open a pull request containing the updated `deno.lock` (and `vendor/`),
which can keep daily builds deterministic while allowing security patches to flow in continuously.

:::
