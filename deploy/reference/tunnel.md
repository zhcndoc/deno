---
title: 隧道
description: "了解 Deno Deploy 的本地隧道功能，该功能允许您从互联网安全地访问本地开发服务器。"
---

Deno Deploy 的隧道功能允许您安全地将本地开发服务器暴露到互联网。这对于测试 webhook、与协作者共享您的工作，或从远程位置访问本地服务器尤为有用。

除了提供对本地服务器的安全访问外，Deno Deploy 的隧道还可以：

- 将 “本地” 上下文中的环境变量从您的 Deno Deploy 项目拉取到本地 Deno 进程。
- 将本地 Deno 进程的 Open Telemetry 跟踪、指标和日志推送到您的 Deno Deploy 应用，您可以在 Deno Deploy 控制面板中查看它们。
- 自动连接分配给您的 Deno Deploy 应用的本地开发数据库。

## 入门

要开始使用隧道功能，您需要在本地机器上安装 Deno。然后，运行本地 Deno 应用时，可通过 `--tunnel` 标志启用隧道，无论是使用 `deno task` 还是 `deno run`。例如：

```sh
deno run --tunnel -A main.ts
```

首次运行此命令时，系统会提示您进行 Deno Deploy 认证，并选择要连接隧道的 Deno Deploy 应用。认证成功后，将建立安全隧道，并为您提供一个用于转发流量到本地服务器的公共 URL。

您也可以为 `deno.json` 或 `package.json` 文件中定义的 `deno task` 命令指定 `--tunnel` 参数：

```json
{
  "tasks": {
    "dev": "astro dev"
  }
}
```

然后使用以下命令运行该任务：

```bash
deno task --tunnel dev
```

## 使用隧道

隧道建立后，任何对公共 URL 的请求都会转发到您的本地开发服务器。您可以使用此 URL 测试 webhook、与他人共享工作，或从远程位置访问本地服务器。

## 停止隧道

要停止隧道，只需终止运行您的应用程序的 Deno 进程。这将关闭安全连接，并停止将流量转发到本地服务器。

## 查看开启的隧道

Deno Deploy 应用面板中的 “隧道” 选项卡显示所有连接到您的应用的活动隧道。在此选项卡中，您可以查看每个隧道的详细信息，包括公共 URL、本地转发地址及建立时间。

## 环境变量

使用隧道功能时，您的 Deno Deploy 应用中的 “本地” 上下文环境变量会提供给您本地的 Deno 进程。这允许您在本地使用与 Deno Deploy 应用相同的配置。

您可以在应用设置的 “环境变量” 选项卡中查看和管理您的 Deno Deploy 应用的环境变量。更多信息请参见[添加、编辑和移除环境变量文档](/deploy/reference/env_vars_and_contexts/#adding%2C-editing-and-removing-environment-variables)。

## 查看跟踪和日志

使用隧道时，本地 Deno 进程的 Open Telemetry 跟踪、指标和日志会被推送到您的 Deno Deploy 应用。您可以在 Deno Deploy 应用面板的 “可观测性” 选项卡中查看这些跟踪和日志。

您可以通过在搜索栏中搜索 `context:local` 来过滤并仅查看本地进程的跟踪和日志。