---
title: "将 WordPress 用作无头 CMS"
oldUrl:
  - /deploy/docs/tutorial-wordpress-frontend/
---

WordPress 是世界上最受欢迎的 CMS，但在 "无头" 形式下使用，即使用自定义前端，比较困难。

在本教程中，我们将展示如何使用 Fresh，这是一个基于 Deno 构建的现代网页框架，来为无头 WordPress 创建前端。

## 步骤 1：克隆 Fresh WordPress 主题

Fresh 提供了两个现成的主题，一个用于博客，另一个用于商店前端。

### 博客

```bash
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/blog
deno task docker
```

### 商店

```bash
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/corporate
deno task docker
```

请注意，博客和商店主题对 WordPress 服务器的设置是不同的。确保您在正确的目录中运行 `deno task docker` 命令。

## 步骤 2：在同一目录中打开另一个终端并运行：

```sh
deno task start
```

## 步骤 3：访问 http://localhost:8000/

您可以通过 WordPress 控制面板管理网站的内容，地址为 http://localhost/wp-admin（用户名: `user`，密码: `password`）。

## WordPress 托管选项

在互联网上有许多托管 WordPress 的选项。许多云服务提供商
[提供](https://aws.amazon.com/getting-started/hands-on/launch-a-wordpress-website/)
[专门](https://cloud.google.com/wordpress)
[指南](https://learn.microsoft.com/en-us/azure/app-service/quickstart-wordpress)
和
[模板](https://console.cloud.google.com/marketplace/product/click-to-deploy-images/wordpress)
专门用于 WordPress。还有一些专门的 WordPress 托管服务，如 [Bluehost](https://www.bluehost.com/),
[DreamHost](https://www.dreamhost.com/),
[SiteGround](https://www.siteground.com/) 等。您可以从这些选项中选择最适合您需求的。

互联网上还有许多资源关于如何扩展您的 WordPress 实例。