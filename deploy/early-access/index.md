---
title: "关于 Early Access"
description: "Deno Deploy Early Access 功能指南、与 Deploy Classic 的比较及部署入门说明。"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。寻找 Deploy Classic 文档？[点击此处查看](/deploy/)。

:::

Deno Deploy Early Access（Deno Deploy<sup>EA</sup>）是对原始 Deploy 的彻底重构，具有以下特点：

- 改进的 NPM 兼容性和 Web 框架支持
- 内置的 OpenTelemetry 集成
- 集成的构建系统
- 显著增强的基础设施

<a href="https://dash.deno.com/account#early-access" class="docs-cta runtime-cta">加入 Early Access 计划</a>
<a href="https://app.deno.com" class="docs-cta deploy-cta">前往您的 Deno Deploy<sup>EA</sup> 仪表板</a>

:::note

Deno Deploy<sup>EA</sup> 处于私密测试阶段。要使用 Deno Deploy<sup>EA</sup>，您必须通过 [Deploy Classic 账户设置页面](https://dash.deno.com/account#early-access) 加入 Early Access 计划。

:::

Deno Deploy<sup>EA</sup> 带来了全新的仪表板，地址为 [app.deno.com](https://app.deno.com)。在此仪表板中，您可以创建包含 Deno Deploy<sup>EA</sup> 应用的新组织。

在单个组织内，您不能混合使用 Deno Deploy<sup>EA</sup> 应用和 Deploy Classic 项目。您可以通过仪表板左上角的组织选择器切换不同组织。

## 什么是 Deno Deploy<sup>EA</sup>？

Deno Deploy 是一个用于在云端（或自行托管的基础设施上）运行 JavaScript 和 TypeScript 应用的无服务器平台。它通过 GitHub 部署等集成方式，提供应用部署和运行的管理平面。

## 与 Deploy Classic 的比较

Deno Deploy<sup>EA</sup> 是对 Deploy Classic 的完全重新设计。它拥有全新的仪表板和执行环境，使用 Deno 2.0，功能远超 Deploy Classic。下表对比了两个版本的 Deno Deploy。

| 功能                           | Deno Deploy<sup>EA</sup>       | Deploy Classic                                                                                                                            |
| ------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Web 界面                       | app.deno.com                   | dash.deno.com                                                                                                                             |
| 暗色模式                       | ✅ 支持                       | ❌ 不支持                                                                                                                                |
| 构建流程                       | ✅ 完全集成                   | 🟠 通过 GitHub Actions 运行，仪表板无实时日志，缓存需手动设置，修改配置需编辑 YAML 文件                                                  |
| 运行 Deno 应用                 | ✅ 完全支持                   | 🟠 有限支持（不支持 FFI、子进程、写权限）                                                                                                 |
| 运行 Node 应用                 | ✅ 完全支持                   | 🟠 有限支持（不支持 FFI、本地插件、子进程、写权限，且 NPM 兼容性较差）                                                                   |
| 运行 Next.js/Astro/SvelteKit   | ✅ 一流支持                   | 🟠 依赖框架，需要手动设置                                                                                                                 |
| 一流的静态站点支持             | ✅ 支持                       | ❌ 不支持                                                                                                                                |
| 环境变量                       | ✅ 支持区分开发/生产环境变量  | 🟠 所有部署共用一套环境变量                                                                                                               |
| CDN 缓存                       | ✅ 支持                       | ❌ 不支持                                                                                                                                |
| Web Cache API                  | ✅ 支持                       | ✅ 支持                                                                                                                                |
| 数据库                         | ⏳ 即将推出                   | 🟠 Deno KV                                                                                                                              |
| 队列                           | ❌ 不支持                     | ✅ 支持                                                                                                                                |
| 定时任务                       | ❌ 不支持                     | ✅ 支持                                                                                                                                |
| 从 GitHub 部署                 | ✅ 支持                       | ✅ 支持                                                                                                                                |
| 从命令行部署                   | ⏳ 即将推出                   | ✅ 支持                                                                                                                                |
| 即时回滚                       | ✅ 支持                       | ✅ 支持                                                                                                                                |
| 日志                           | ✅ 支持                       | ✅ 支持                                                                                                                                |
| 跟踪                           | ✅ 支持                       | ❌ 不支持                                                                                                                                |
| 指标                           | ✅ 支持                       | ❌ 不支持                                                                                                                                |
| OpenTelemetry 导出            | ⏳ 开发中                     | ❌ 不支持                                                                                                                                |
| 区域数量                       | 2                              | 6                                                                                                                                       |
| 自托管区域                     | ✅ 支持                       | ❌ 不支持                                                                                                                                |

## 如何访问 EA

要开始使用 Deno Deploy<sup>EA</sup>：

1. 访问 [app.deno.com](https://app.deno.com) 进入全新仪表板
2. 创建新的 Deno Deploy<sup>EA</sup> 组织
3. 在该组织内创建您的第一个应用
4. 从 GitHub 仓库或直接通过仪表板进行部署

有关详细的配置说明和特定框架指南，请参阅我们的参考文档。