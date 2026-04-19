---
last_modified: 2025-12-08
title: Playgrounds
description: "无需 Git 仓库，直接从 Deno Deploy 部署并编写代码。"
---

Playground 应用可让你在不需要创建 GitHub
仓库的情况下，完全从 Deno Deploy 的 Web 仪表板中创建、编辑并部署应用程序。

Playgrounds 包含一个或多个文件（JavaScript、TypeScript、TSX、JSON 等），你可以在 playground 编辑器中直接进行编辑。

## 创建一个 playground

你可以从组织的“Applications”页面创建 playground。
点击“New Playground”按钮以创建一个基础的“Hello World” playground。
在“New Playground”按钮的下拉菜单中，你可以从其他模板创建 playground，例如 Next.js 或 Hono。

## 编辑一个 playground

要编辑一个 playground，请在组织的“Applications”页面中打开它。

playground 编辑器由五个主要部分组成：

- **代码编辑器**：位于编辑器中央区域，用于编辑当前选定文件的代码。在编辑器上方有一个显示当前文件名的导航栏，你可以点击它来进行编辑。
- **文件浏览器**：位于代码编辑器左侧。该面板会显示 playground 中的所有文件。点击任意文件即可在编辑器中打开。通过点击文件浏览器顶部的“New”图标来创建新文件。使用每个文件名旁边的删除按钮来删除文件。
- **顶部栏**：位于代码编辑器上方，包含 playground 的操作按钮。“Deploy”按钮会保存当前更改并触发构建。“Build Config”和“Env Variables”按钮会打开对应的配置抽屉。顶部栏左侧会显示 playground URL（除非该 playground 尚未部署）。
- **底部抽屉**：位于代码编辑器下方，其中包含调试工具，包括“Build Logs”（在部署期间显示构建进度），以及用于查看日志和追踪的选项卡。
- **右侧抽屉**：位于代码编辑器右侧，包含用于检查应用程序输出的工具。“Preview”选项卡会通过 iframe 显示已部署的应用程序，而“HTTP Explorer”则允许你向部署发送单独的 HTTP 请求。

当你点击“Deploy”按钮，或当编辑器失去焦点时，playground 内容会自动保存。

## 上传文件

你可以通过将包含文件和目录的 zip 文件拖拽到文件浏览器区域中，将其上传到 playground。zip 文件的内容会被解压到 playground 中，并保留目录结构。

> ⚠️ playground 编辑器不支持上传单个文件或目录。

## 使用 HTTP explorer

playground 中的 HTTP Explorer 选项卡允许你向 playground 提供服务的任意 URL 发起任意 HTTP 请求。这对于测试 API 或其他不提供网页的服务非常有用。

使用 HTTP Explorer 时，输入你想发起请求的路径和查询参数，选择 HTTP 方法（GET、POST 等），然后点击带有所选方法名称的按钮。

还可以通过点击“Set Headers”按钮来添加额外的请求头。

请求发出后，HTTP Explorer 将显示响应状态、响应头和响应正文。

要查看该请求的追踪信息，请在响应部分点击“Trace”按钮。这会在 playground 编辑器顶部打开一个抽屉，其中显示该请求的追踪信息。在这里你也可以查看请求过程中捕获到的任何 `console.log` 输出。

## 重命名一个 playground

你可以在 playground 设置页面编辑 playground slug 来重命名 playground。这会更新与该 playground 关联的默认域名，因为这些域名基于 playground slug。新的 slug 必须在组织内唯一（即不能正在被同一组织中的其他应用或 playground 使用）。

:::info

重命名后，指向 playground 的任何先前 `deno.net` URL 将不再可用。

自定义域名将继续可用，因为它们不绑定到 playground
slug。

:::

## 删除一个 playground

你可以在 playground 设置页面删除一个 playground。这将从组织中移除 playground 及其所有修订版本。所有现有部署将立即停止对外提供流量服务，并移除所有自定义域名关联。

删除后，playground 及其修订版本将不再可访问。通过 Deno Deploy UI 删除的 playground 无法恢复。

:::info

不小心删除了 playground？请在 30 天内联系 Deno 支持以恢复它。

:::

## 限制

> ⚠️ 当前无法将 Playgrounds 转移到另一个组织。
