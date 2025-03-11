---
title: "Release Schedule"
description: "Overview of Deno's release cycle and versioning process. Learn about stable releases, canary builds, and how to manage different Deno versions including upgrading to specific builds."
oldUrl: /runtime/manual/references/contributing/release_schedule/
---

`deno` CLI 的新小版本计划每 12 周发布一次。

请查看 [Deno GitHub 的里程碑](https://github.com/denoland/deno/milestones) 了解即将发布的版本。

通常在小版本发布后会有几个补丁版本（每周进行一次）；之后，新的功能合并窗口将为即将到来的小版本发布打开。

稳定版本可以在 [GitHub 发布页面](https://github.com/denoland/deno/releases) 上找到。

## Canary 渠道

除了上述稳定渠道外，Canary 版本每天多次发布（针对每次主分支上的提交）。您可以通过运行以下命令升级到最新的 Canary 版本：

```console
deno upgrade --canary
```

要更新到特定的 Canary 版本，请在 `--version` 选项中传递提交哈希：

```console
deno upgrade --canary --version=973af61d8bb03c1709f61e456581d58386ed4952
```

要切换回稳定渠道，请运行 `deno upgrade`。

Canary 版本可以从 https://dl.deno.land 下载。