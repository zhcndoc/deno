---
title: "定价和限制"
description: "Deno Deploy的重要限制、服务等级预期及使用条款。"
oldUrl: /deploy/classic/pricing-and-limits/
---

请参阅 [我们的定价页面](https://deno.com/deploy/pricing)，了解所有套餐中可用功能的概览。如果您的使用场景超出了这些限制，[请联系我们](mailto:deploy@deno.com)。

在 Deno Deploy 的初始公开测试阶段不提供正常运行时间保证。对服务的访问将受到
[我们的可接受使用政策](/deploy/acceptable_use_policy)的控制。任何被我们认为违反此政策的用户，都可能面临账号被终止的风险。

## 部署的最大大小

上传资产到部署时，所有文件（源文件和静态文件）的总大小
**不应超过1GB**。

## 内存分配

应用程序的最大内存分配为 512MB。

## 上传请求限制

只要您的应用程序符合
[我们的可接受使用政策](/deploy/acceptable_use_policy)，
我们不限制您的应用程序可以处理的上传请求数量。

## TLS 代理

对于端口 443（HTTPS使用端口）的外发连接，需进行 TLS 终止。禁止使用 [Deno.connect](https://docs.deno.com/api/deno/~/Deno.connect) 连接这些端口。如果需要建立到 443 端口的 TLS 连接，请改用 [Deno.connectTls](https://docs.deno.com/api/deno/~/Deno.connectTls)。`fetch` 不受此限制。

此限制的原因是，未终止 TLS 直接连接到 443 端口的情况通常用于 TLS-over-TLS 代理，而根据 [我们的可接受使用政策](/deploy/acceptable_use_policy)，在 Deno Deploy 中禁止使用此类代理形式。