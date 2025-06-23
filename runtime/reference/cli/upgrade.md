---
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

```shell
$ deno upgrade
Checking for latest version
Version has been found
Deno is upgrading to version 1.38.5
downloading https://github.com/denoland/deno/releases/download/v1.38.5/deno-x86_64-apple-darwin.zip
downloading 100%
Upgrade done successfully
```

### 升级到指定版本

你可以指定要升级到的特定版本：

```shell
$ deno upgrade --version 1.37.0
Checking for version 1.37.0
Version has been found
Deno is upgrading to version 1.37.0
downloading https://github.com/denoland/deno/releases/download/v1.37.0/deno-x86_64-apple-darwin.zip
downloading 100%
Upgrade done successfully
```

### 检查可用升级但不安装

使用 `--dry-run` 标志可以查看将会升级到哪个版本，而不实际进行升级：

```shell
$ deno upgrade --dry-run
Checking for latest version
Version has been found
Would upgrade to version 1.38.5
```

## --quiet 标志

`--quiet` 标志在升级过程中抑制诊断输出。用在 `deno upgrade` 时，它将隐藏进度指示、下载信息和成功消息。

```shell
$ deno upgrade --quiet
```

这对于脚本环境或在 CI 流水线中想要更简洁的输出非常有用。

## Canary 构建

默认情况下，Deno 会从官方的 GitHub 发行版升级。你可以使用 `--canary` 构建标志来升级到最新的 canary 版本：

```shell
# 升级到最新的 canary 构建
$ deno upgrade --canary
```