---
title: 构建
description: "Deno Deploy 中构建流程的详细说明，涵盖构建触发方式、阶段、配置选项、缓存以及构建环境。"
---

在 Deno Deploy 中，您应用程序代码的每个版本都被表示为一个修订（或构建）。当从 GitHub 部署时，修订通常与您仓库中的 git 提交一一对应。

## 构建触发

构建可以通过三种方式触发：

- **通过 UI 手动触发**：使用构建页面上的“部署默认分支”按钮，部署默认 git 分支（通常是 `main`）。下拉菜单允许您选择不同的分支。

- **通过 CLI 手动触发**：使用 `deno deploy` 命令。

- **通过 GitHub 自动触发**：当向与您的应用关联的 GitHub 仓库推送新的提交时。

## 构建阶段

一个修订在变为可用状态前会经历以下阶段：

1. **排队**：修订等待分配给构建器。
2. **准备**：构建器下载源代码并恢复可用的构建缓存。
3. **安装**：执行安装命令（如果指定），通常用来下载依赖。
4. **构建**：执行构建命令（如果指定），生成构建产物并上传到运行时基础设施。
5. **部署**：修订准备部署到每个时间线。对于每个时间线，执行以下操作：
   1. **创建数据库**：如果应用有附属数据库，确保该时间线存在数据库（必要时创建）。
   2. **预部署命令**：执行应用配置的任何预部署命令，通常用于数据库迁移等任务。
   3. **预热**：仅在“预览”时间线中，启动应用以确保其正常启动。
   4. **路由**：将新修订推广到与该时间线关联的 URL。

如果任何步骤失败，构建将进入“失败”状态并且不会接收流量。

构建日志会在构建过程中实时推送到仪表盘，构建完成后仍可在构建页面查看。

构建缓存通过重用在构建间未更改的文件来加快构建速度。对于框架预设和 `DENO_DIR` 依赖缓存，此过程是自动进行的。

您可以使用构建页面右上角的“取消”按钮取消正在运行的构建。构建会在运行 5 分钟后自动取消。

## 构建配置

App configuration defines how to convert source code into a deployable artifact.

There are two places you can set app configuration:

- **In source code**: Using a `deno.json` or `deno.jsonc` file in the
  application directory.
- **In the Deno Deploy dashboard**: Using the app configuration settings.

If you specify both options, settings in the source code take precedence over
those in the dashboard. You will be unable to edit any of the app configuration
values in the dashboard if the most recent successful build used configuration
from source code.

The application directory must be configured through the dashboard. This setting
is not configurable from source code, as it determines where to find the source
code itself.

### Editing app configuration in the dashboard

You can modify app configuration in three places:

- 创建应用时点击“编辑构建配置”
- 在应用设置中点击构建配置部分的“编辑”
- 在失败构建页面的重试抽屉中

在创建应用时，如果您使用已识别的框架或常见构建配置，构建配置可能会自动从仓库中检测。

#### Configuration options

- **应用目录**：仓库中用作应用根目录的文件夹。适用于 Monorepo。默认是仓库根目录。

- **框架预设**：针对支持的框架（如 Next.js 或 Fresh）做了优化的配置。[了解更多框架集成](./frameworks/)。

- **安装命令**：安装依赖的 shell 命令，如 `npm install` 或 `deno install`。

- **构建命令**：构建项目的 shell 命令，通常是 `package.json` 或 `deno.json` 中的任务，如 `deno task build` 或 `npm run build`。

- **预部署命令**：构建完成但部署前运行的 shell 命令，通常用于数据库迁移等任务。

- **运行时配置**：决定应用如何提供流量：
  - **动态**：用于通过服务器响应请求的应用（API 服务器、服务器渲染网站等）
    - **入口文件**：要执行的 JavaScript 或 TypeScript 文件
    - **参数**（可选）：传递给应用的命令行参数
    - **运行时工作目录**（可选）：应用运行时的工作目录
    - **运行时内存限制**（可选）：应用运行时可使用的最大内存。默认 768 MB，Pro 计划下可增加至 4 GB。
  - **静态**：用于提供预渲染静态内容的静态网站
    - **目录**：包含静态资源的文件夹（如 `dist`、`.output`）
    - **单页应用模式**（可选）：对不匹配静态文件的路径返回 `index.html`，而不是 404 错误
  - **自动**：使用框架预设时，运行时配置会自动设置。
    - **运行时内存限制**（可选）：应用运行时可使用的最大内存。默认 768 MB，Pro 计划下可增加至 4 GB。

- **构建超时**：构建过程允许的最长时间。默认 5 分钟，Pro 计划下可增加至 15 分钟。

- **构建内存**：分配给构建过程的内存大小。默认 3 GB，Pro 计划下可增加至 4 GB。

### Editing app configuration from source code

To configure your application from source code, add a `deno.json` or
`deno.jsonc` file to the root of your application directory with a `deploy` key.
If any of the following app configuration options are specified under this key,
the entire configuration will be sourced from the file instead of the dashboard
(any configuration specified in the dashboard will be ignored).

#### `deno.json` options

- `deploy.framework` (required unless `deploy.runtime` is set): The framework
  preset to use, such as `nextjs` or `fresh`. Setting this option automatically
  configures defaults for the framework. Available presets are listed in the
  [framework integrations docs](./frameworks/).
- `deploy.install` (optional): Shell command to install dependencies.
- `deploy.build` (optional): Shell command to build the project.
- `deploy.predeploy` (optional): Shell command to run after the build is
  complete but before deployment, typically for tasks like database migrations.
- `deploy.runtime` (required unless `deploy.framework` is set): Configuration
  for how the app serves traffic. The app can either be static or dynamic, as
  defined below:
  - For dynamic apps:
    - `deploy.runtime.type`: Must be set to `"dynamic"`, or omitted (dynamic is
      the default).
    - `deploy.runtime.entrypoint`: The JavaScript or TypeScript file to execute.
    - `deploy.runtime.args` (optional): Command-line arguments to pass to the
      application.
    - `deploy.runtime.cwd` (optional): The working directory for the application
      at runtime.
    - `deploy.runtime.memory_limit` (optional): The maximum amount of memory the
      application can use at runtime. Defaults to 768 MB, can be increased to 4
      GB on the Pro plan.
  - For static apps:
    - `deploy.runtime.type`: Must be set to `"static"`.
    - `deploy.runtime.cwd`: Folder containing static assets (e.g., `dist`,
      `.output`).
    - `deploy.runtime.spa` (optional): If `true`, serves `index.html` for paths
      that don't match static files instead of returning 404 errors.
  - For apps using a framework preset:
    - `deploy.runtime.memory_limit` (optional): The maximum amount of memory the
      application can use at runtime. Defaults to 768 MB, can be increased to 4
      GB on the Pro plan.

#### Examples

**Example dynamic app configuration from `deno.json`:**

```jsonc
{
  "deploy": {
    "install": "npm install",
    "build": "npm run build",
    "predeploy": "deno run --allow-net --allow-env migrate.ts",
    "runtime": {
      "type": "dynamic",
      "entrypoint": "./app/server.js",
      "args": ["--port", "8080"],
      "cwd": "./app"
    }
  }
}
```

**Example static app configuration from `deno.jsonc`:**

```jsonc
{
  "deploy": {
    "install": "npm install",
    "build": "npm run build",
    "runtime": {
      "type": "static",
      "cwd": "./public",
      "spa": true
    }
  }
}
```

**Example framework preset configuration with Next.js from `deno.json`:**

```jsonc
{
  "deploy": {
    "framework": "nextjs",
    "install": "npm install",
    "build": "npm run build"
  }
}
```

## 构建环境

构建环境在 Linux 上运行，支持 x64 或 ARM64 架构。可用工具包括：

- `deno`（与运行时版本相同）
- `node`
- `npm`
- `npx`
- `yarn`（v1）
- `pnpm`
- `git`
- `tar`
- `gzip`

:::info

构建器内部所有 JavaScript 代码均使用 Deno 执行。

`node` 命令实际上是一个 shim，负责将 Node.js 的调用转换为 `deno run`。类似地，`npm`、`npx`、`yarn` 和 `pnpm` 也都是通过 Deno 而非 Node.js 运行。

:::

为“构建”上下文配置的环境变量在构建过程中可用，但来自“生产”或“开发”上下文的变量不可用。[了解更多关于环境变量](/deploy/reference/env_vars_and_contexts/)。

构建器在构建期间可用的存储空间为 8 GB。
