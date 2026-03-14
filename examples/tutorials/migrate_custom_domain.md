---
title: "将自定义域从 Deploy Classic 迁移到 Deno Deploy"
description: "了解如何将您的自定义域从 Deploy Classic 迁移到 Deno Deploy"
url: /examples/migrate_custom_domain_tutorial/
---

如果您之前在 Deploy Classic 上设置了自定义域，并且想将其迁移到 Deno Deploy，请按照以下步骤操作：

## 将您的域添加到 Deno Deploy

1. 访问 [Deno Deploy 控制台](https://dash.deno.com)，并导航到您想关联自定义域的项目。

2. 点击 **“Settings”** 标签。

3. 在“Production Domains”下，点击 **“+ Add Domain”**。

4. 输入您的自定义域（例如，`test.mywebsite.com`），选择您是只想添加基础 URL 还是基础 URL 和通配符，然后点击 **“Save”**。

这将启动 DNS 记录配置，可能需要几分钟时间。

系统将显示需要添加到您的 DNS 提供商的 DNS 记录。

## 申请 TLS 证书

在您的 DNS 提供商设置中，更新您域的 DNS 记录，包含提供的 `_acme-challenge` CNAME 记录。这是 Deno Deploy 验证您的域并申请 TLS 证书所必需的。

![DNS Records modal](/deploy/images/dns_config.png)

一旦 DNS 记录生效，点击 **“Verify DNS and provision certificate”** 按钮申请新的 TLS 证书。

## 更新 DNS 记录

在您的 DNS 提供商设置中，删除域名的任何现有 CNAME/A/AAAA 记录，并用 Deno Deploy 提供的 CNAME 或 ANAME 记录替换。

由于 DNS 传播延迟，此过程可能需要一些时间。请允许最多 48 小时以使更改生效，之后再从 Deploy Classic 中移除该域。