---
title: "部署 Classic"
oldUrl:
  - /deploy/docs/
  - /deploy/manual/hello-world/
---

:::info 旧版文档

您正在查看 Deno Deploy Classic 的旧文档。我们建议您迁移至新的 <a href="/deploy/">Deno Deploy</a> 平台。

:::

本节记录的是传统的 Deno Deploy Classic 平台（dash.deno.com）。
我们不再为 Deploy Classic 新增用户或组织。

如果您已有 Deploy Classic 项目，可以继续使用，但我们强烈建议您开始迁移至
新的 Deno Deploy 平台，网址为 [console.deno.com](https://console.deno.com)。

主要区别：

- Deploy Classic 已进入维护模式（无新功能，有限更新）。
- 新功能（增强的 Node/NPM 支持、集成构建、指标、追踪、框架预设、静态资源、改进基础设施）已在 Deno Deploy 提供。

您可以从这里开始使用新平台：
[关于 Deno Deploy 早期访问](/deploy/)。

迁移指南即将推出。与此同时，您可以设置新的 Deno Deploy 组织并重新部署应用。
如需帮助，请联系 <a href="mailto:support@deno.com">support</a>。

## 什么是 Deno Deploy Classic？

Deno Deploy Classic 是一个全球分布的无服务器 JavaScript 应用平台。您的 JavaScript、TypeScript 和 WebAssembly 代码运行于地理上靠近用户的托管服务器上，实现低延迟和更快响应。Deploy Classic 应用运行于快速、轻量的 [V8 隔离环境](https://deno.com/blog/anatomy-isolate-cloud)，而非虚拟机，基于 [Deno 运行时](/runtime/manual)。

让我们来部署您的第一个应用程序 - 这只需几分钟。

## 安装 Deno 和 `deployctl`

如果您还没有安装，可以使用以下命令之一来 [安装 Deno 运行时](/runtime/getting_started/installation)：

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

安装 Deno 后，请安装 [`deployctl`](./deployctl.md) 工具：

```sh
deno install -A jsr:@deno/deployctl --global
```

您可以通过运行以下命令来确认 `deployctl` 已正确安装：

```console
deployctl --help
```

现在，您准备好从命令行部署 Deno 脚本了！

## 编写和测试 Deno 程序

首先，创建一个项目目录，并在其中创建一个名为 `main.ts` 的文件，内容如下所示的 "Hello World" 网络服务器：

```ts title="main.ts"
Deno.serve(() => new Response("Hello, world!"));
```

您可以通过运行以下命令来测试它是否有效：

```sh
deno run --allow-net main.ts
```

您的服务器应该可以在 [localhost:8000](http://localhost:8000) 上查看。现在让我们在边缘使用 Deno Deploy 运行这段代码！

## 部署您的项目

在您刚创建的 `main.ts` 文件的目录中，运行以下命令：

```sh
deployctl deploy
```

系统会提示您授权 Deno Deploy 在 GitHub 上注册 Deno Deploy 并/或为 `deployctl` 配置访问令牌。片刻之后，您的 Hello World 服务器将部署在 Deno Deploy Classic 基础设施中，遍布全球，准备处理您期望的所有流量。

## 下一步

现在您已创建了第一个部署，您可以 [了解您可以在 Deno Deploy 上运行哪些类型的应用程序](./use-cases.md)，查看 [使用 deployctl 还可以做什么](./deployctl.md)，或者继续阅读以了解将代码部署到 Deno Deploy 的其他选项。我们非常期待看到您通过 Deno Deploy 交付的内容！

### 部署您现有的项目

导入一个项目并在边缘使用 Deno Deploy 运行它。

1. [从 Deno Deploy Classic 仪表板](https://dash.deno.com) 点击 "新建项目" 按钮。

2. 连接到您的 GitHub 帐户并选择要部署的存储库。

3. 按照屏幕上的说明部署您的现有应用程序。

   如果您的项目需要构建步骤，请使用项目配置表单创建一个 GitHub 操作以部署您的项目。为您的项目命名并从可选框架预设中选择。如果您不使用框架，可以使用表单设置您的构建选项。

4. 确认您的构建选项正确，然后点击 "部署项目" 按钮以启动新的 GitHub 操作并部署您的项目。

片刻之后，您的项目将部署到全球约 12 个数据中心，准备处理大量流量。

一旦部署成功，您可以访问成功页面上提供的 URL 来查看您新部署的项目，或者在您的仪表板中管理它。

### 从游乐场开始

[游乐场](./playgrounds.md) 是一个基于浏览器的编辑器，使您能够立即编写和运行 JavaScript 或 TypeScript 代码。这是一个很好的选择，让您开始体验 Deno 和 Deno Deploy！

从 [Deno Deploy Classic 仪表板](https://dash.deno.com) 点击 "新建游乐场" 按钮以创建一个游乐场。我们还提供了多种现成的教程，供您尝试 Deno Deploy Classic，可以点击 "学习游乐场" 或访问：\
[简单 HTTP 服务器游乐场](https://dash.deno.com/tutorial/tutorial-http)\
[使用 Deno KV 数据库游乐场](https://dash.deno.com/tutorial/tutorial-http-kv)\
[RESTful API 服务器游乐场](https://dash.deno.com/tutorial/tutorial-restful)\
[使用 WebSockets 的实时应用游乐场](https://dash.deno.com/tutorial/tutorial-websocket)\
[使用 Deno.cron 的定期任务游乐场](https://dash.deno.com/tutorial/tutorial-cron)