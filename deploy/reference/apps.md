---
title: 应用程序
description: "Deno Deploy 早期访问中管理应用程序的指南，包括应用创建、配置、GitHub 集成和部署选项。"
---

应用程序是在组织内提供流量服务的网络服务。每个应用程序都包含一系列修订历史（之前的版本），通常在使用 GitHub 集成时对应于 Git 提交。

应用程序通过 slug 进行标识，该 slug 必须在组织内唯一，并用于默认域名。

## 创建应用程序

可以通过 [Deno Deploy 仪表盘](https://console.deno.com) 或使用 [`deno deploy` CLI](/runtime/reference/cli/deploy/) 从命令行创建应用程序。

### 使用仪表盘

要从 Web 仪表盘创建应用程序：

1. 在应用程序概览页面点击“+ New App”按钮
2. 选择要部署的 GitHub 仓库
3. 配置应用程序 slug（名称）
4. 设置构建配置
5. 添加所需的环境变量

构建配置决定了应用程序在部署过程中的构建方式。每次向关联仓库推送时，或手动点击“Deploy Default Branch”时，都会自动触发构建。有关详细的构建配置信息，请参阅 [Builds 文档](/deploy/reference/builds/)。

您可以在创建应用程序时通过点击“Edit Environment Variables”添加环境变量。有关环境变量的更多详情，请参阅 [Environment Variables and Contexts](/deploy/reference/env_vars_and_contexts/) 文档。

### 使用 CLI

您也可以使用命令行通过 `deno deploy create` 创建应用程序。不带参数运行时会启动一个交互式向导，逐步引导您完成每一步：

```bash
deno deploy create
```

对于 CI/CD 流水线或脚本，请提供参数以完全跳过向导：

```bash
deno deploy create \
  --org my-org \
  --app my-api \
  --source local \
  --framework-preset fresh \
  --build-timeout 5 \
  --build-memory-limit 1024 \
  --region us
```

您也可以创建从 GitHub 仓库部署的应用程序：

```bash
deno deploy create \
  --org my-org \
  --app my-app \
  --source github \
  --owner my-github-org \
  --repo my-repo \
  --framework-preset astro \
  --build-timeout 10 \
  --build-memory-limit 2048 \
  --region global
```

有关完整的参数和选项列表，请参阅 [`deno deploy create` CLI 参考](/runtime/reference/cli/deploy/#create-application)。

## 重命名应用程序

可以通过编辑应用设置页面上的应用 slug 来重命名应用程序。这将更新与应用关联的默认域名，因为它们基于应用 slug。新的 slug 必须在组织内唯一（即不能被同一组织中的其他应用或 playground 使用）。

:::warning

任何之前指向该应用的 `deno.net` URL 在重命名后都将不再可用。

自定义域名将继续正常工作，因为它们不依赖于应用 slug。

:::

## 删除应用程序

可以在应用设置页面删除应用程序。这将从组织中移除该应用及其所有修订版本。所有现有部署将立即停止提供流量，且所有自定义域名关联将被移除。

删除后，该应用及其修订版本将不再可访问，也不会再提供任何流量。已删除的应用无法通过 Deno Deploy UI 恢复。

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。想查看 Deploy Classic 文档？[请点击这里](/deploy/)。

:::

应用程序是在组织内提供流量服务的网络服务。每个应用程序包含一系列修订历史（之前的版本），通常对应于使用 GitHub 集成时的 Git 提交。

应用程序通过一个 slug 来标识，该 slug 必须在组织内唯一，并用于默认域名。

## 创建应用程序

创建应用程序步骤：

1. 在组织页面点击“+ 创建应用程序”按钮
2. 选择要部署的 GitHub 仓库
3. 配置应用程序 slug（名称）
4. 设置构建配置
5. 添加所需的环境变量

> ⚠️ 目前，应用程序必须在创建时关联一个 GitHub 仓库。

构建配置决定了应用在部署过程中的构建方式。每次向关联的仓库推送代码时，或手动点击“部署默认分支”时，都会自动触发构建。有关详细的构建配置信息，请参阅[构建文档](/deploy/early-access/reference/builds/)。

您可以在创建应用时通过点击“编辑环境变量”添加环境变量。更多关于环境变量的详情，请参见[环境变量与上下文](/deploy/early-access/reference/env-vars-and-contexts/)文档。

## 重命名应用程序

可以通过编辑应用设置页面上的应用 slug 来重命名应用程序。这将更新与应用关联的默认域名，因为它们基于应用 slug。新的 slug 必须在组织内唯一（即同一组织内的其他应用或游乐场中不能使用）。

:::warning

重命名后，之前指向该应用的所有 `deno.net` URL 将失效。

自定义域名将继续正常工作，因为它们不依赖于应用 slug。

:::

## 删除应用程序

可以在应用设置页面删除应用程序。此操作将从组织中删除该应用及其所有修订版本。所有现有部署将立即停止服务，且所有自定义域名关联将被移除。

删除后，该应用及其修订将不再可访问，也不再服务任何流量。通过 Deno Deploy UI 无法恢复已删除的应用。

:::info

误删应用？请在 30 天内联系 Deno 支持以恢复。

:::

## 限制

> ⚠️ 目前应用程序无法转移到其他组织。

## GitHub 集成

GitHub 集成支持从 GitHub 仓库自动部署应用。每次向仓库推送时，都会触发应用的新构建。根据提交的分支，构建将部署到不同的[时间线](/deploy/early-access/reference/timelines/)。

应用程序在创建时与 GitHub 仓库关联。但创建后也可以解除关联，并可选择关联新的 GitHub 仓库。此操作可以在应用设置页面完成。

GitHub 仓库下拉菜单仅显示已经通过 Deno Deploy GitHub 应用授权的账户。您可以通过点击用户或组织下拉菜单中的“+ 添加另一个 GitHub 账户”按钮，或在仓库下拉菜单中点击“配置 GitHub 应用权限”按钮，授权新的组织或仓库。此操作会重定向您到 GitHub，以授权 Deno Deploy GitHub 应用访问所选 GitHub 账户或组织。授权完成后，您将被重定向回应用设置页面，此时可以选择新授权的 GitHub 仓库。

### GitHub 事件集成

每当 Deno Deploy 从 GitHub 仓库构建应用时，会在构建开始和结束时向该仓库发送 [`repository_dispatch`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#repository_dispatch) 事件。这允许您根据构建状态触发 GitHub Actions 工作流。

Deno Deploy 会发送以下事件：

| 事件名称                          | 描述                                                      |
| -------------------------------- | --------------------------------------------------------- |
| `deno_deploy.build.enqueued`     | 触发构建排队时发送，即当向仓库推送时。                   |
| `deno_deploy.build.cancelled`    | 构建被取消时发送，可能是手动取消或超时导致。              |
| `deno_deploy.build.failed`       | 构建失败时发送。                                          |
| `deno_deploy.build.routed`       | 构建成功完成且流量已路由至该构建时发送。                  |

事件的负载结构遵循以下 TypeScript 类型定义：

```ts
interface DenoDeployBuildEventPayload {
  app: {
    /** Deno Deploy 应用的 UUID。 */
    id: string;
    /** Deno Deploy 应用的 slug（名称）。 */
    slug: string;
  };
  organization: {
    /** 包含该应用的 Deno Deploy 组织的 UUID。 */
    id: string;
    /** 包含该应用的 Deno Deploy 组织的 slug（名称）。 */
    slug: string;
  };
  revision: {
    /** 正在构建的修订版本 ID。 */
    id: string;
    /** 可在 Deno Deploy 仪表盘查看修订版本及构建状态的 URL。 */
    html_url: string;
    /** 正在构建的 Git 提交 SHA。 */
    git: { sha: string };
    /** 如果构建成功，修订版本可访问的预览 URL。 */
    preview_url: string | null;
  };
}
```

您可以在 GitHub Actions 工作流中通过添加 `repository_dispatch` 触发器来接收这些事件。例如：

```yaml
on:
  repository_dispatch:
    types: [deno_deploy.build.routed] # 监听成功构建事件

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: 测试 preview_url
        run: |
          echo "Deno Deploy 应用可通过 ${{ github.event.client_payload.revision.preview_url }} 访问"
          curl -I ${{ github.event.client_payload.revision.preview_url }}
```
