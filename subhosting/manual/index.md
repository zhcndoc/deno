---
title: 关于子托管
oldUrl:
  - /subhosting/
  - /deploy/manual/subhosting/
---

:::warning 2026 年 7 月 20 日停止服务

subhosting v1 API 将于 2026 年 7 月 20 日关闭。请迁移到
<a href="https://api.deno.com/v2/docs">v2 API</a>。有关详细信息，请参阅
<a href="/subhosting/manual/api_migration_guide/">API 迁移指南</a>。

:::

Deno 子托管是一个强大的平台，旨在让软件即服务
（SaaS）提供商能够安全地运行其客户编写的代码。Subhosting
API 允许您以编程方式大规模部署不受信任的代码。

## 主要特点

- **易用性：** 开发者可以用通用的 JavaScript 或 TypeScript 编写代码，无需具备特定的 Deno 知识。
- **标准合规性：** Deno 支持标准的 JavaScript 和 TypeScript，并广泛集成了常用的 Web API，如 `fetch` 和 `web cache`。
- **Deno 特定高级功能：** 提供了超出典型浏览器能力的高级功能，如 `KV`（键值存储）。
- **快速部署：** Deno 的云产品旨在支持极短的部署时间，从简单应用的不到一秒，到具有众多依赖关系的复杂网站约十秒。
- **改善开发者体验：** 子托管将为您管理设置安全基础设施以在公共云中运行不受信任代码的广泛工作。

## Deno 云服务概述 - Deno Deploy 和 Deno 子托管

Deno 提供了两个不同的云服务，Deno Deploy 和 Deno 子托管，旨在利用相同的基础设施支持特定用例。

### Deno Deploy

Deno Deploy 针对个人开发者和专注于开发和迭代有限一组第一方项目的小团队进行了优化。此解决方案非常适合托管网站或应用程序，部署过程通常通过 GitHub 集成进行管理。

- 目标受众：个人开发者和小型开发团队。
- 部署集成：主要通过 GitHub 进行持续集成和交付。
- 使用案例：托管网站和应用程序。

### Deno 子托管

相比之下，Deno 子托管旨在安全管理大规模的项目和部署。它通过 API 支持不受信任的代码或函数的部署，使其适用于涉及多个最终用户贡献代码的场景。

- 目标受众：需要安全托管客户生成的、不受信任代码的 SaaS 平台。
- 部署机制：通过设计用于可扩展性和安全性的强大 API。
- 使用案例：大规模项目托管，最终用户贡献代码。

实施子托管的步骤大致如下：

1. [创建组织](./quick_start.md)并获取 REST API 的访问令牌
1. [创建项目](./planning_your_implementation.md)，然后为该项目创建您的首次部署

使用这些技术，您可以将用户代码打包为“部署”，并在 Deno 提供的 URL 或您可以自行配置的
[自定义 URL](../api/#custom-domains)上执行该代码。

## REST API 参考

subhosting v1 API 正在被 v2 API 取代。有关详细的
端点映射和迁移说明，请参阅
[API 迁移指南](/subhosting/manual/api_migration_guide/)。

- **v2 API 参考**（推荐）：
  [api.deno.com/v2/docs](https://api.deno.com/v2/docs)
- **v1 API 参考**（旧版，将于 2026 年 7 月 20 日停止服务）：
  [apidocs.deno.com](https://apidocs.deno.com)

### SDK

**v2 SDK：**

- **TypeScript/JavaScript**：
  [@deno/sandbox](https://www.npmjs.com/package/@deno/sandbox)
- **Python**： [sandbox-py](https://github.com/denoland/sandbox-py)

**v1 SDK**（旧版）：[JavaScript](https://www.npmjs.com/package/subhosting),
[Python](https://pypi.org/project/subhosting/0.0.1a0/),
[Go](https://github.com/denoland/subhosting-go)
