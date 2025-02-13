---
title: "基础 Fresh 站点"
oldUrl:
  - /deploy/docs/fresh/
---

本教程将介绍如何在 Deno Deploy 上部署一个 Fresh 应用程序。

Fresh 是一个为 Deno 构建的Web框架，类似于 Node 的 Express。

## **步骤 1:** 创建 Fresh 应用程序

```sh
deno run -A -r https://fresh.deno.dev fresh-site
```

要在本地运行此应用程序：

```sh
deno task start
```

您可以编辑 `routes/index.js` 来修改应用程序。

## **步骤 2:** 创建一个新的 Github 仓库并链接您本地的 Fresh 应用程序。

1. 创建一个新的 Github 仓库并记录 git 仓库的远程 URL
2. 从您的本地 `fresh-site`，初始化 git 并推送到新的远程仓库：

   ```sh
   git init
   git add .
   git commit -m "第一次提交"
   git remote add origin <remote-url>
   git push origin main
   ```

## **步骤 3:** 部署到 Deno Deploy

1. 访问
   [https://dash.deno.com/new_project](https://dash.deno.com/new_project)。
2. 连接您的 GitHub 账户并选择您的仓库。
3. 在表单中填写各项值：
   - 为您的项目命名
   - 从“框架预设”选项中选择 `Fresh`
   - 将生产分支设置为 `main`
   - 选择 `main.ts` 作为入口文件
4. 点击“部署项目”以启动 Deno Deploy。
5. 部署完成后，您可以在项目仪表盘中提供的 URL 查看您的新项目。