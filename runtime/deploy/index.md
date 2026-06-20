---
last_modified: 2026-06-18
title: "部署你的应用"
description: "在生产环境中运行 Deno 应用的方式：托管的 Deno Deploy 平台、容器和 Docker、云与无服务器提供商，以及自托管一个独立二进制文件。"
---

一旦你的应用在本地运行起来，你就有几种方式将它部署到生产环境中。
总体来说，你可以让托管平台替你运行它，或者在你自己可控的基础设施上运行它。
本页会介绍这些选项，并指向各自的指南。

## 选择一种方案

- **想要最低的运维开销？** 使用
  [Deno Deploy](#deno-deploy-managed-platform)，这是专为
  Deno 构建的托管平台。
- **已经有容器基础设施，或者希望在不同云之间具备可移植性？**
  交付一个 [容器镜像](#containers-and-docker)。
- **面向特定云或无服务器提供商？** 跳转到
  [平台指南](#cloud-and-serverless-platforms)。
- **想要一个无需安装运行时的单一自包含产物？**
  [编译为独立二进制文件](#self-hosting-the-runtime)，并在任何
  机器上运行它。

## Deno Deploy（托管平台）

[Deno Deploy](/deploy/) 是 Deno 的无服务器平台。你推送代码，它会
处理构建、TLS、全球分发和扩缩容，并且对 Deno 和 Node 应用，以及
Next.js、Astro 和 SvelteKit 等框架提供一流支持。它还提供集成的可观测性、
定时任务，以及内置的键值数据库。

- [开始使用 Deno Deploy](/deploy/getting_started/)
- [使用 `deno deploy` 命令进行部署](/examples/deploy_command_tutorial/)

## 容器和 Docker

容器为你提供了一个可移植的产物，你可以在任何主机、编排器或云上运行它。
Deno 在多个变体中发布官方镜像。

- [Deno 和 Docker](/runtime/reference/docker/) 涵盖 Dockerfile、多阶段
  构建、Docker Compose、工作区以及生产最佳实践。

## 云和无服务器平台

将 Deno 应用部署到特定提供商的分步指南：

- [AWS Lambda](/examples/aws_lambda_tutorial/) 用于无服务器函数
- [AWS Lightsail](/examples/aws_lightsail_tutorial/) 用于基于容器的 VM
  托管
- [AWS ECS Fargate](/examples/aws_ecs_fargate_tutorial/) 用于无服务器
  容器
- [Google Cloud Run](/examples/google_cloud_run_tutorial/) 用于无服务器
  容器
- [DigitalOcean](/examples/digital_ocean_tutorial/) 用于容器托管
- [Kinsta](/examples/kinsta_tutorial/) 用于托管式应用托管
- [Cloudflare Workers](/examples/cloudflare_workers_tutorial/)，或
  [使用 Wrangler](/examples/cloudflare_workers_wrangler_tutorial/)，用于边缘

在示例中浏览
[部署 Deno 项目](/examples/#deploying-deno-projects) 下的所有这些内容。

## 自托管运行时

如果你想自己在 VM 或裸金属上运行，有两种路径：

- 使用 `deno compile` [编译独立二进制文件](/runtime/reference/cli/compile/)。其结果会将你的代码和运行时打包到一个单一的
  可执行文件中，不依赖外部依赖项，你可以将其复制到服务器上并直接
  运行。
- 在主机上 [安装 Deno](/runtime/getting_started/installation/)，并使用
  [`deno serve`](/runtime/reference/cli/serve/) 运行你的应用，以获得一个
  可用于生产的 HTTP 服务器，通常位于 systemd 等进程管理器之后。

## 生产环境注意事项

无论你选择哪种方案，以下几点都适用：

- **[权限](/runtime/fundamentals/security/)。** 仅授予应用所需的访问权限
  （`--allow-net`、`--allow-read` 等），而不是使用全部权限运行。
- **[环境变量](/runtime/reference/env_variables/)。** 通过环境来配置
  密钥和按环境划分的设置，而不是将它们硬编码进去。
- **[可观测性](/runtime/fundamentals/open_telemetry/)。** Deno 内置
  对 OpenTelemetry 的支持，可用于跟踪、指标和日志。
- **[持续集成](/runtime/reference/continuous_integration/)。** 在部署之前运行
  测试、代码检查和格式化检查。
