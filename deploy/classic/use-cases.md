---
title: "Deno Deploy 经典用例"
---

:::info 旧版文档

您正在查看 Deno Deploy 经典版本的旧版文档。我们建议您迁移到新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

Deno 当前一些热门的用例包括：

- [中间件](#中间件)
- [API 服务器](#api-服务器)
- [完整网站](#完整网站)

## 中间件

中间件指的是在请求到达应用服务器之前和之后执行的代码片段。如果您想在请求的早期快速执行一些 JavaScript 或其他代码，您将编写中间件。通过在边缘部署您的中间件代码，Deno Deploy 经典版确保您的应用获得最佳性能。

一些示例包括：

- 设置 cookie
- 根据地理位置提供不同版本的网站
- 路径重写
- 重定向请求
- 在返回给用户之前动态更改从服务器返回的 HTML。

Deno Deploy 经典版是您目前可能用于托管中间件的其他平台的良好替代方案，例如：

- Cloudflare Workers
- AWS Lambda@Edge
- 传统负载均衡器，如 nginx
- 自定义规则

## API 服务器

Deno 也是 API 服务器的理想选择。通过“边缘”部署这些服务器，更接近使用它们的客户端，Deno Deploy 经典版能够提供比传统托管平台（如 Heroku）或甚至现代集中式托管服务（如 DigitalOcean）更低的延迟、更好的性能和更低的带宽成本。

## 完整网站

我们预见一个未来，您可以实际在边缘函数上编写整个网站。一些已经在这样做的网站示例包括：

- [博客](https://github.com/ry/tinyclouds)
- [聊天](https://github.com/denoland/showcase_chat)
- [Calendly 克隆](https://github.com/denoland/meet-me)