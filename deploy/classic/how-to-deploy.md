---
title: "使用 GitHub 集成进行部署"
---

:::info 旧文档

您正在查看 Deno Deploy Classic 的旧文档。我们推荐迁移到新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

部署更复杂项目的最简单方法是通过我们的 GitHub 集成。
这允许您将 Deno Deploy Classic 项目链接到一个 GitHub 仓库。
每当您推送到该仓库时，您的更改将会自动部署。

通过 GitHub 集成，您可以添加一个 GitHub Action，该动作在您的部署过程中定义一个构建步骤。

有关更多详细信息，请参见 [GitHub 集成页面](ci_github)。

### 使用 [`deployctl`](./deployctl.md) 从命令行进行部署

`deployctl` 是一个命令行工具，用于将您的代码部署到 Deno Deploy。使用 `deployctl` 可以控制比上述自动 GitHub 集成更多的部署细节。

有关更多详细信息，请参见 [deployctl 页面](./deployctl.md)。

### 使用 playground 进行部署

部署一些代码最简单的方法是通过 Deno Deploy Classic playground。

有关更多详细信息，请参见 [playground 页面](playgrounds)。