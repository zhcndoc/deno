---
title: "Deno Deploy 早期访问"
description: "Deno Deploy 早期访问功能指南，与 Deno Deploy Classic 的比较，以及部署的入门说明。"
---

:::info

您正在查看 Deno Deploy 早期访问的文档。寻找 Deno Deploy Classic 文档？[在这里查看](/deploy/)。

:::

Deno Deploy 早期访问是对原始 Deno Deploy 的全面改进，具有：

- 改进的 NPM 兼容性和 Web 框架支持
- 内置的 OpenTelemetry 集成
- 集成的构建系统
- 显著增强的基础设施

<a href="https://app.deno.com" class="docs-cta runtime-cta">尝试 Deno Deploy 早期访问</a>

Deno Deploy EA 在 [app.deno.com](https://app.deno.com) 提供了一个新的仪表板。在这个仪表板中，您可以创建包含 Deno Deploy EA 应用的新的 Deno Deploy EA 组织。请注意，在单个组织内，您不能混合使用 Deno Deploy EA 应用和 Deno Deploy Classic 项目。您可以通过仪表板左上角的组织选择器在 Deno Deploy EA 组织和 Deno Deploy Classic 组织之间切换。

## 与 Deno Deploy Classic 的比较

| 特性                          | Deno Deploy EA                 | Deno Deploy Classic                                                                                                                     |
| ----------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Web 界面                     | app.deno.com                   | dash.deno.com                                                                                                                           |
| 构建                          | ✅ 完全集成                    | 🟠 在 GitHub Actions 中运行，仪表板中没有实时流式日志，缓存需要手动设置，修改配置需要编辑 YAML                                       |
| 可以运行 Deno 应用            | ✅ 完全支持                    | 🟠 有限支持（无 FFI、子进程、写入权限）                                                                                                 |
| 可以运行 Node 应用            | ✅ 完全支持                    | 🟠 有限支持（无 FFI、原生插件、子进程、写入权限，以及降低的 NPM 兼容性）                                                               |
| 可以运行 Next.js/Astro/SvelteKit | ✅ 一流支持                   | 🟠 框架依赖，需手动设置                                                                                                                 |
| 一流的静态站点                | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| 环境变量                     | ✅ 不同的 dev/prod 环境变量    | 🟠 针对所有部署的一个环境变量集                                                                                                        |
| CDN 缓存                     | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| Web 缓存 API                 | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 数据库                       | ⏳ 即将推出                   | 🟠 Deno KV                                                                                                                             |
| 队列                          | ❌ 不支持                     | ✅ 支持                                                                                                                                |
| Cron                          | ❌ 不支持                     | ✅ 支持                                                                                                                                |
| 从 GitHub 部署                | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 从 CLI 部署                   | ⏳ 即将推出                   | ✅ 支持                                                                                                                                |
| 即时回滚                     | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 日志                          | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 跟踪                          | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| 指标                          | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| OpenTelemetry 导出            | ⏳ 进行中                     | ❌ 不支持                                                                                                                               |
| 区域                          | 2                              | 6                                                                                                                                     |
| 自托管区域                   | ✅ 支持                        | ❌ 不支持                                                                                                                               |

即将推出

## 入门

要开始使用 Deno Deploy 早期访问：

1. 访问 [app.deno.com](https://app.deno.com) 以访问新的仪表板
2. 创建一个新的 Deno Deploy EA 组织
3. 在组织内创建您的第一个应用
4. 连接您的 GitHub 仓库或直接从仪表板进行部署

有关特定框架的部署或配置您的应用的详细文档，请访问我们的 [指南和资源](/deploy/early-access)。