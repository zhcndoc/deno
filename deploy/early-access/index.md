---
title: "关于 Deno Deploy 早期访问"
description: "Deno Deploy 早期访问功能指南、与 Deploy Classic 的比较及部署入门说明。"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。寻找 Deploy Classic 文档？[点击此处查看](/deploy/)。

:::

Deno Deploy 早期访问（Deno Deploy<sup>EA</sup>）是对原始 Deploy 的彻底重构，具有以下特点：

- 改进的 NPM 兼容性和 Web 框架支持
- 内置的 OpenTelemetry 集成
- 集成的构建系统
- 显著增强的基础设施

<a href="https://console.deno.com" class="docs-cta deploy-cta">前往 Deno
Deploy<sup>EA</sup> 控制面板</a>

Deno Deploy<sup>EA</sup> 配备了一个全新的控制面板，位于
[console.deno.com](https://console.deno.com)。在该控制面板中，您可以创建新的 Deno Deploy<sup>EA</sup> 组织，该组织包含 Deno Deploy<sup>EA</sup> 应用。

在同一组织内，您不能混合使用 Deno Deploy<sup>EA</sup> 应用和 Deploy Classic 项目。您可以通过控制面板左上角的组织选择器在不同组织间切换。

## 什么是 Deno Deploy<sup>EA</sup>？

Deno Deploy 是一个用于在云端（或自行托管的基础设施上）运行 JavaScript 和 TypeScript 应用的无服务器平台。它通过 GitHub 部署等集成方式，提供应用部署和运行的管理平面。

## 与 Deploy Classic 的比较

Deno Deploy<sup>EA</sup> 是对 Deploy Classic 的完全重新设计。它拥有全新的仪表板和执行环境，使用 Deno 2.0，功能远超 Deploy Classic。下表对比了两个版本的 Deno Deploy。

| 功能                            | Deno Deploy<sup>EA</sup>       | Deploy Classic                                                                                                                          |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Web interface                   | console.deno.com               | dash.deno.com                                                                                                                           |
| Dark mode                       | ✅ 支持                       | ❌ 不支持                                                                                                                              |
| Builds                          | ✅ 完全集成                   | 🟠 运行于 GitHub Actions，无仪表盘实时日志，缓存需手动配置，修改配置需编辑 YAML 文件                                                     |
| Can run Deno apps               | ✅ 完全支持                   | 🟠 有限支持（无 FFI、子进程、写权限）                                                                                                  |
| Can run Node apps               | ✅ 完全支持                   | 🟠 有限支持（无 FFI、本地插件、子进程、写权限，且 NPM 兼容性较差）                                                                       |
| Can run Next.js/Astro/SvelteKit | ✅ 一流支持                   | 🟠 依赖框架，需手动配置                                                                                                                  |
| First class static sites        | ✅ 支持                       | ❌ 不支持                                                                                                                              |
| Environment Variables           | ✅ 不同的开发/生产环境变量    | 🟠 所有部署共用一套环境变量                                                                                                             |
| CDN caching                     | ✅ 支持                       | ❌ 不支持                                                                                                                              |
| Web Cache API                   | ✅ 支持                       | ✅ 支持                                                                                                                                |
| Databases                       | ✅ 支持                       | 🟠 仅 Deno KV                                                                                                                           |
| Queues                          | ❌ 不支持                    | ✅ 支持                                                                                                                                |
| Cron                            | ❌ 不支持                    | ✅ 支持                                                                                                                                |
| Deploy from GitHub              | ✅ 支持                       | ✅ 支持                                                                                                                                |
| Deploy from CLI                 | ✅ 支持                       | ✅ 支持                                                                                                                                |
| Instant Rollback                | ✅ 支持                       | ✅ 支持                                                                                                                                |
| Logs                            | ✅ 支持                       | ✅ 支持                                                                                                                                |
| Tracing                         | ✅ 支持                       | ❌ 不支持                                                                                                                              |
| Metrics                         | ✅ 支持                       | ❌ 不支持                                                                                                                              |
| OpenTelemetry export            | ⏳ 进行中                     | ❌ 不支持                                                                                                                              |
| Regions                         | 2                              | 6                                                                                                                                       |
| Self hostable regions           | ✅ 支持                       | ❌ 不支持                                                                                                                              |

## 如何访问 EA

要开始使用 Deno Deploy<sup>EA</sup>：

1. 访问 [console.deno.com](https://console.deno.com) 进入全新控制面板
2. 创建一个新的 Deno Deploy<sup>EA</sup> 组织
3. 在该组织中创建您的第一个应用
4. 从您的 GitHub 仓库或直接在控制面板中部署

有关详细的配置说明及框架专属指南，请参阅我们的参考文档。