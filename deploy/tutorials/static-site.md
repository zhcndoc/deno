---
title: "部署静态网站"
oldUrl:
  - /deploy/docs/static-site/
---

本教程将介绍如何在 Deno Deploy 上部署一个静态网站（不含 JavaScript）。

## 步骤 1：创建静态网站

```sh
mkdir static-site
cd static-site
touch index.html
```

在你的 `index.html` 中粘贴以下 HTML：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>你好</title>
  </head>
  <body>
    <h1>你好</h1>
    <img src="image.png" alt="image" />
  </body>
</html>
```

确保在 `static-site` 目录中有一个 `image.png` 文件。

现在你已经有了一个显示“你好”的 HTML 页面并包含一个徽标。

## 步骤 2：使用 `deployctl` 部署静态网站

要在 Deno Deploy 上部署这个库，在 `static-site` 目录中运行：

```console
deployctl deploy --project=<你选择的项目名称> --entrypoint=jsr:@std/http/file-server
```

关于这些命令的进一步解释：由于这是一个静态网站，不需要执行 JavaScript。你并不是给 Deno Deploy 提供一个特定的 JavaScript 或 TypeScript 文件作为入口文件，而是给它这个外部的 `file_server.ts` 程序，它简单地将 `static-site` 目录中的所有静态文件，包括图像和 HTML 页面，上传到 Deno Deploy。这些静态资源随后会被服务。

## 步骤 3：完成！

你的静态网站现在应该已经上线了！它的 URL 会在终端输出，或者你可以在你的 [Deno 控制面板](https://dash.deno.com/projects/) 中管理你新的静态网站项目。如果你点击进入你的新项目，你将能够查看网站，配置它的名称、环境变量、自定义域名等。