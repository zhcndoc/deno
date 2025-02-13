---
title: "发布计划"
oldUrl: /runtime/manual/references/contributing/release_schedule/
---

每个月的第三个星期四都会发布一个新的次要版本的 `deno` cli。

请查看 [Deno GitHub 的里程碑](https://github.com/denoland/deno/milestones) 了解即将发布的版本。

在次要版本发布后，通常会有两个或三个修补版本（每周发布一次）；随后将开启新特性合并窗口，为即将到来的次要版本做准备。

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