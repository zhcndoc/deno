---
title: "Stability and releases"
description: "Guide to Deno's stability guarantees and release process. Covering release channels, long-term support (LTS), unstable features, versioning policy, and how Deno maintains backward compatibility."
oldUrl:
  - /runtime/manual/runtime/stability/
  - /runtime/fundamentals/stability/
---

截至 Deno 1.0.0，`Deno` 命名空间 API 是稳定的。这意味着我们将努力使在 1.0.0 下工作的代码在未来的版本中继续正常运行。

## 发布计划、渠道和长期支持

Deno 每 12 周发布一个新的稳定小版本（例如 v2.1.0，v2.0.0）。

补丁发布包括对最新小版本的bug修复，按需发布 - 您可以期待在新小版本发布前有几个补丁发布。

### 发布渠道

Deno 提供 4 种发布渠道：

- `stable` - 上述描述的语义化小版本/补丁发布。这是**默认**的发布渠道，建议大多数用户使用。
- `lts` - 对特定稳定版本的长期支持，建议不常升级的企业用户使用。详情见下文。
- `rc` - 下一语义化小版本的候选发布。
- `canary` - 不稳定的发布，每天更改多个版本，允许尝试最新的bug修复和可能最终进入 `stable` 渠道的新特性。

### 长期支持 (LTS)

从 Deno v2.1.0（2024年11月发布）开始，Deno 提供 LTS（长期支持）渠道。

LTS 渠道是一个小版本的语义化版本，我们只维护向后兼容的 bug 修复。

| LTS release version | LTS maintenance start | LTS maintenance end |
| ------------------- | --------------------- | ------------------- |
| v2.1                | Feb 1st, 2025         | Apr 30th, 2025      |
| v2.2                | May 1st, 2025         | Oct 31st, 2025      |
| v2.4                | Nov 1st, 2025         | Apr 30th, 2026      |

在我们完善此过程的同时，我们最初保持 LTS 支持窗口较短。**LTS 发布每六个月进行一次**，根据需要提供补丁发布以修复bug。我们计划在将来将此支持窗口延长至一年。

LTS 回溯包括：

- 安全补丁
- 关键bug修复（例如，崩溃、错误计算）
- **关键**性能改进_可能_根据严重性进行回溯。

**API 更改和重大新特性将不会进行回溯。**

## 不稳定的 API

在引入新 API 时，这些 API 首先被标记为不稳定。这意味着该 API 未来可能会发生变化。在显式传递不稳定标志（如 `--unstable-kv`）之前，这些 API 并不可用。
[了解有关 `--unstable-*` 标志的更多信息](/runtime/reference/cli/unstable_flags)。

还有一些被视为不稳定的非运行时功能，这些功能被锁定在不稳定标志后面。例如，`--unstable-sloppy-imports` 标志用于在不指定文件扩展名的情况下启用代码的 `import`。

## 标准库

Deno 标准库 (https://jsr.io/@std) 基本上是稳定的。所有版本为 1.0.0 或更高的标准库模块被视为稳定。所有其他模块（0.x）被视为不稳定，未来可能会发生变化。

不推荐在生产代码中使用不稳定的标准库模块，但这是实验新特性并向 Deno 团队提供反馈的好方法。使用不稳定标准库模块不需要使用任何不稳定标志。