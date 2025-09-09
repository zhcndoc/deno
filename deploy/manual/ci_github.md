---
title: "CI 和 GitHub Actions"
oldUrl:
  - /deploy/docs/project/
---

Deno Deploy 的 Git 集成功能允许部署推送到 GitHub 仓库的代码更改。在生产分支上的提交将作为生产部署进行部署。所有其他分支上的提交将作为预览部署进行部署。

Git 集成有两种操作模式：

- **自动**：每次你推送时，Deno Deploy 会自动从你的仓库源拉取代码和资产，并进行部署。此模式非常快速，但不允许进行构建步骤。_这是大多数用户推荐的模式。_
- **GitHub Actions**：在此模式下，你可以从 GitHub Actions 工作流将代码和资产推送到 Deno Deploy。这允许你在部署之前执行构建步骤。

根据你的自定义部署配置，Deno Deploy 会选择合适的模式。下面，我们将更详细地介绍 **自动** 和 **GitHub Actions** 模式的不同配置。

## 自动

如果你的项目不需要任何额外的构建步骤，则系统会选择 **自动** 模式。入口文件仅仅是 Deno Deploy 将运行的文件。

## GitHub Actions

如果在 **项目配置** 的 **安装步骤** 和/或 **构建步骤** 中输入了命令，Deno Deploy 将创建一个必要的 GitHub Actions 工作流文件并推送到你的仓库。在这个工作流文件中，我们利用 `deployctl` [Github action][deploy-action] 来部署你的项目。在将其部署到 Deno Deploy 之前，你可以执行任何所需的操作，例如运行构建命令。

要配置你想要运行的预处理命令，点击选择你的 git 仓库后出现的 **显示高级选项** 按钮。然后根据需要在输入框中输入相应的值。

:::tip

例如，如果你想为 Fresh 项目启用 [提前构建]，你将在 **构建步骤** 框中输入 `deno task build`。

另请参阅 [Fresh 文档][Deploy to production]，了解如何将 Fresh 项目部署到 Deno Deploy。

:::

Deno Deploy 生成并推送到你的仓库的 GitHub Actions 工作流文件如下所示。

```yml title=".github/workflows/deploy.yml"
name: Deploy
on:
  push:
    branches: main
  pull_request:
    branches: main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    permissions:
      id-token: write # Deno Deploy 认证所需
      contents: read # 克隆仓库所需

    steps:
      - name: Clone repository
        uses: actions/checkout@v4

      - name: Install Deno
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: Build step
        run: "deno task build"

      - name: Upload to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: "<your-project-name>"
          entrypoint: "main.ts"
          root: "."
```

有关更多详细信息，请参见 [deployctl README](https://github.com/denoland/deployctl/blob/main/action/README.md)。

[fileserver]: https://jsr.io/@std/http#file-server
[ghapp]: https://github.com/apps/deno-deploy
[deploy-action]: https://github.com/denoland/deployctl/blob/main/action/README.md
[ahead-of-time builds]: https://fresh.deno.dev/docs/concepts/ahead-of-time-builds
[Deploy to production]: https://fresh.deno.dev/docs/getting-started/deploy-to-production