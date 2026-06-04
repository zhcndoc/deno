---
last_modified: 2026-05-20
title: "deno 升级"
oldUrl: /runtime/manual/tools/upgrade/
command: upgrade
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno 升级"
description: "将 Deno 升级到最新版本，或升级到指定版本"
---

## 示例

### 升级到最新版本

使用此命令且不带任何选项即可将 Deno 升级到可用的最新版本：

```sh
deno upgrade
正在检查最新版本
已找到版本
Deno 正在升级到版本 1.38.5
正在下载 https://github.com/denoland/deno/releases/download/v1.38.5/deno-x86_64-apple-darwin.zip
正在下载 100%
升级成功完成
```

### 升级到指定版本

你可以指定要升级到的特定版本：

```sh
deno upgrade --version 1.37.0
正在检查版本 1.37.0
已找到版本
Deno 正在升级到版本 1.37.0
正在下载 https://github.com/denoland/deno/releases/download/v1.37.0/deno-x86_64-apple-darwin.zip
正在下载 100%
升级成功完成
```

### 检查可用升级但不安装

使用 `--dry-run` 标志可以查看将会升级到哪个版本，而不实际进行升级：

```sh
deno upgrade --dry-run
正在检查最新版本
已找到版本
将升级到版本 1.38.5
```

## --quiet 标志

`--quiet` 标志在升级过程中抑制诊断输出。用在 `deno upgrade` 时，它将隐藏进度指示、下载信息和成功消息。

```sh
deno upgrade --quiet
```

这对于脚本环境或在 CI 流水线中想要更简洁的输出非常有用。

## 缓存下载

下载的 Deno 二进制文件会缓存到 `$DENO_DIR/dl/`。如果你之后重新安装相同版本，会重用缓存的归档文件而不是重新下载。对于 canary 版本，旧条目会自动被移除，只保留最近 10 个版本。

## 校验和验证

使用 `--checksum` 标志可以将下载的二进制文件与已知的 SHA-256 哈希值进行验证。这可以防止在 CI 环境和安全敏感的设置中遭到篡改：

```sh
deno upgrade --checksum=<sha256-hash> 2.7.0
```

SHA-256 校验和作为 `.sha256sum` 文件随发布归档一同发布在 GitHub 上：

```sh
curl -sL https://github.com/denoland/deno/releases/download/v2.7.0/deno-x86_64-unknown-linux-gnu.zip.sha256sum
```

## Delta 更新

从 Deno 2.8 开始，`deno upgrade` 在最近的稳定版本之间升级时会下载较小的二进制补丁（delta），而不是完整的发布归档。这通常会将下载量从数十兆字节减少到几兆字节。

当 delta 可用时会自动应用，无需额外开启。如果补丁缺失或验证失败，`deno upgrade` 会透明地回退到下载完整归档。

要强制进行完整下载（例如在会缓存发布归档的环境中），请传入 `--no-delta`：

```sh
deno upgrade --no-delta
```

每个 delta 补丁以及生成的二进制文件在安装前都会根据随发布一同公布的 SHA-256 校验和进行验证。

## Canary 构建

默认情况下，Deno 会从官方的 GitHub 发行版升级。你可以使用 `--canary` 构建标志来升级到最新的 canary 版本：

```sh
# 升级到最新的 canary 构建
deno upgrade --canary
```

## 从 pull request 安装构建

从 Deno 2.8 开始，`deno upgrade pr <number>` 会下载由 CI 为特定 deno PR 构建的二进制文件并安装它。当你需要在某个修复正式发布之前进行验证时，这非常有用。

```sh
# 安装由 CI 为 PR #12345 构建的二进制文件
deno upgrade pr 12345

# 也接受 `#` 前缀
deno upgrade pr '#12345'

# 写入到路径，而不是替换当前二进制文件
deno upgrade --output ./deno-test pr 12345

# 查看将要下载的内容，而不进行替换
deno upgrade --dry-run pr 12345
```

此子命令要求已安装并完成认证的 [`gh` CLI](https://cli.github.com/)。`deno upgrade` 会使用 `gh` 查找该 PR 的 CI 运行并下载匹配的 `{profile}-{os}-{arch}-deno` 制品（例如 `release-linux-x86_64-deno`），优先使用 release 构建，并在必要时回退到 debug。下载的二进制文件在替换当前可执行文件之前会先验证其可运行性。
