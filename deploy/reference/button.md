---
title: 部署按钮
description: "帮助用户快速轻松地克隆代码并通过点击按钮将其部署到 Deno Deploy"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。寻找 Deploy Classic 的文档？ [点击此处查看](/deploy/)。

:::

部署按钮为用户提供了一个快捷方式，基于托管在 Git 仓库中的现有代码，在 Deno Deploy 上创建并部署新应用程序。

它提供了一个直接进入 Deno Deploy 应用创建流程的链接，并根据提供的查询参数或指定源的 `deno.json` 文件中的值填充创建流程中的设置。

指定的仓库将被克隆到用户的 GitHub 账户，并设置为新项目的源。默认情况下，新仓库为公开，但如果需要也可以设置为私有。

## 示例

下面的部署按钮演示了基于一个简单入门项目创建新应用程序的过程

[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=https://github.com/denoland/examples&path=hello-world)

## 创建并部署新应用程序

使用以下代码提供一个创建并部署新应用程序的按钮：

**Markdown**

```bash
[![Deploy on Deno](https://deno.com/button)](https://console.deno.com/new?clone=REPOSITORY_URL)
```

**HTML**

```bash
<a href="https://console.deno.com/new?clone=REPOSITORY_URL"><img src="https://deno.com/button" alt="Deploy on Deno"/></a>
```

**URL**

```bash
https://console.deno.com/new?clone=REPOSITORY_URL
```

### 参数

以下查询参数可用于配置部署按钮：

- `clone` — （必填）要克隆为新仓库并随后部署的源仓库 URL
- `path` — （可选）在源仓库中需要克隆的路径。提供此参数将创建一个以该目录为根的新仓库
- `app_directory` — （可选）新仓库中用作应用程序根目录的路径。当仓库采用 monorepo 结构时此参数非常有用。
- `install` — （可选）构建前执行的命令，用于安装依赖
- `build` — （可选）构建应用程序时执行的命令
- `predeploy` — （可选）构建完成但部署之前执行的命令