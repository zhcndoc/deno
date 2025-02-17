---
title: "定价和限制"
---

请查看 [我们的定价页面](https://deno.com/deploy/pricing) 以获取所有计划中可用功能的概述。如果您有超出这些限制的用例，请 [与我们联系](mailto:deploy@deno.com)。

在 Deno Deploy 的初始公开测试阶段，不提供正常运行时间的保证。对服务的访问将受到 [我们可接受使用政策](/deploy/manual/acceptable-use-policy) 的控制。我们认为违反该政策的任何用户，都有可能面临账户被终止的风险。

## 部署的最大大小

在上传资源到部署时，所有文件的总大小（源文件和静态文件）**不得超过 1GB**。

## 内存分配

应用程序的最大内存分配为 512MB

## TLS 代理

对于到 443 端口（HTTPS 使用的端口）的外发连接，要求进行 TLS 终止。禁止使用 [Deno.connect](https://docs.deno.com/api/deno/~/Deno.connect) 连接这些端口。如果您需要建立到 443 端口的 TLS 连接，请改用 [Deno.connectTls](https://docs.deno.com/api/deno/~/Deno.connectTls)。`fetch` 不会受到此限制的影响。

此限制的原因是，未终止 TLS 直接连接到 443 端口的情况通常用于 TLS-over-TLS 代理，而根据 [我们可接受使用政策](/deploy/manual/acceptable-use-policy)，在 Deno Deploy 中禁止使用这种代理形式。