---
title: "使用 Vite 部署 React 应用"
oldUrl:
  - /deploy/docs/vite/
  - /deploy/manual/vite
---

本教程涵盖如何在 Deno Deploy 上部署 Vite Deno 和 React 应用。

## 第一步：创建一个 Vite 应用

让我们使用 [Vite](https://vitejs.dev/) 快速搭建一个 Deno 和 React 应用：

```sh
deno run -RWE npm:create-vite-extra@latest
```

我们将把项目命名为 `vite-project`。确保在项目配置中选择 `deno-react`。

然后，`cd` 进入新创建的项目文件夹。

## 第二步：在本地运行仓库

要查看并编辑您的新项目，可以运行：

```sh
deno run dev
```

## 第三步：使用 Deno Deploy 部署您的项目

现在我们已准备好，一起来部署您的新项目吧！

1. 在浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并链接您的 GitHub 账户。
2. 选择包含您新 Vite 项目的仓库。
3. 您可以为您的项目命名，也可以允许 Deno 为您生成一个名称。
4. 从 **框架预设** 下拉菜单中选择 **Vite**。这将填充 **入口点** 表单字段。
5. 将 **安装步骤** 保持为空。
6. 将 **构建步骤** 设置为 `deno task build`。
7. 将 **根目录** 设置为 `dist`。
8. 点击 **部署项目**。

> 注意：设置的入口点将是 `jsr:@std/http/file-server`。请注意，这不是 Vite 仓库中存在的文件。相反，它是一个外部程序。运行时，该程序将把您当前仓库 (`vite-project/dist`) 中的所有静态资源文件上传到 Deno Deploy。然后，当您导航到部署 URL 时，它将服务于本地目录。

### `deployctl`

或者，您可以直接使用 `deployctl` 将 `vite-project` 部署到 Deno Deploy。

```console
cd /dist
deployctl deploy --project=<project-name> --entrypoint=jsr:@std/http/file-server
```