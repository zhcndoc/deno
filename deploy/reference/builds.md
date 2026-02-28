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

应用配置定义了如何将源代码转换为可部署的构建产物。

您可以在两个位置设置应用配置：

- **在源代码中**：在应用程序目录中使用 `deno.json` 或 `deno.jsonc` 文件。
- **在 Deno Deploy 仪表盘**：使用应用配置设置。

如果您同时指定了这两种方式，源代码中的设置优先于仪表盘中的设置。如果最近一次成功构建使用了源代码中的配置，则无法在仪表盘中编辑任何应用配置值。

应用目录必须通过仪表盘配置。此设置不能通过源代码配置，因为它决定了在哪里查找源代码本身。

### 在仪表盘中编辑应用配置

您可以在三个地方修改应用配置：

- 创建应用时点击“编辑构建配置”
- 在应用设置中点击构建配置部分的“编辑”
- 在失败构建页面的重试抽屉中

在创建应用时，如果您使用已识别的框架或常见构建配置，构建配置可能会自动从仓库中检测。

#### 配置选项

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

### 从源代码编辑应用配置

要从源代码配置您的应用，在应用根目录中添加一个带有 `deploy` 键的 `deno.json` 或 `deno.jsonc` 文件。如果在此键下指定了以下任何应用配置选项，整个配置将从文件中获取，而不是从仪表盘（仪表盘中指定的配置将被忽略）。

#### `deno.json` 选项

- `deploy.framework`（必填，除非设置了 `deploy.runtime`）：要使用的框架预设，例如 `nextjs` 或 `fresh`。设置此选项会自动配置框架的默认值。可用预设在[框架集成文档](./frameworks/)中列出。
- `deploy.install`（可选）：安装依赖的 shell 命令。
- `deploy.build`（可选）：构建项目的 shell 命令。
- `deploy.predeploy`（可选）：构建完成但部署前运行的 shell 命令，通常用于数据库迁移等任务。
- `deploy.runtime`（必填，除非设置了 `deploy.framework`）：应用如何提供流量的配置。应用可以是静态的或动态的，具体如下：
  - 对于动态应用：
    - `deploy.runtime.type`：必须设置为 `"dynamic"`，或省略（默认动态）。
    - `deploy.runtime.entrypoint`：要执行的 JavaScript 或 TypeScript 文件。
    - `deploy.runtime.args`（可选）：传递给应用的命令行参数。
    - `deploy.runtime.cwd`（可选）：应用运行时的工作目录。
    - `deploy.runtime.memory_limit`（可选）：应用运行时可使用的最大内存。默认 768 MB，Pro 计划下可增加至 4 GB。
  - 对于静态应用：
    - `deploy.runtime.type`：必须设置为 `"static"`。
    - `deploy.runtime.cwd`：包含静态资源的文件夹（如 `dist`、`.output`）。
    - `deploy.runtime.spa`（可选）：如果为 `true`，对未匹配静态文件的路径返回 `index.html`，而不是返回 404。
  - 对于使用框架预设的应用：
    - `deploy.runtime.memory_limit`（可选）：应用运行时可使用的最大内存。默认 768 MB，Pro 计划下可增加至 4 GB。

#### 示例

**`deno.json` 中的动态应用配置示例：**

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

**`deno.jsonc` 中的静态应用配置示例：**

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

**使用 Next.js 框架预设的配置示例（`deno.json`）：**

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

构建环境运行于 Linux，支持 x64 或 ARM64 架构。可用工具包括：

- `deno`（版本与运行时相同）
- `node`
- `npm`
- `npx`
- `yarn`（v1）
- `pnpm`
- `git`
- `tar`
- `gzip`

:::info

构建器内部所有 JavaScript 代码均通过 Deno 执行。

`node` 命令实际上是一个 shim，负责将 Node.js 的调用转换为 `deno run`。类似地，`npm`、`npx`、`yarn` 和 `pnpm` 也都是通过 Deno 而非 Node.js 运行。

:::

为“构建”上下文配置的环境变量在构建过程中可用，但来自“生产”或“开发”上下文的变量不可用。[了解更多关于环境变量](/deploy/reference/env_vars_and_contexts/)。

构建期间将额外始终提供以下环境变量：

- `CI`: `true`
- `DENO_DEPLOY`: `true` - 表示代码正在 Deno Deploy 中运行。
- `DENO_DEPLOY_ORGANIZATION_ID`：拥有该应用的组织的 ID（UUID）。
- `DENO_DEPLOY_ORGANIZATION_SLUG`：拥有该应用的组织的 slug（用于 URL 的人类可读标识符，在创建组织时设置）。
- `DENO_DEPLOY_APPLICATION_ID`：应用的 ID（UUID）。
- `DENO_DEPLOY_APPLICATION_SLUG`：应用的 slug（用于 URL 的人类可读标识符，在创建应用时设置，或之后可在应用设置中更改）。
- `DENO_DEPLOY_BUILD_ID`：当前运行的构建 ID。

构建器在构建过程中可用的资源：

- 2 个 vCPU
- 3 GB 内存（Pro 计划下可增加至 4 GB）
- 8 GB 存储空间
