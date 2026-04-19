---
last_modified: 2026-03-20
title: "关于 Deno Deploy"
description: "Deno Deploy 功能指南，与 Deploy Classic 的对比，以及部署入门说明。"
---

<div class="sm:flex sm:flex-row md:flex-col lg:flex-row xl:fle sm:gap-6 md:gap-0 lg:gap-8">
   <img src="/deno-deploy.svg" alt="Deno Deploy 标志" class="max-w-20 md:max-w-32" />
      <p class="text-lg text-foreground-secondary mt-6">Deno 的云服务为在全球规模上部署和运行 JavaScript 与 TypeScript 应用提供了强大的平台。<br /><a href="https://console.deno.com" class="docs-cta deploy-cta mt-2">Deno
部署控制台</a></p>

</div>

## 什么是 Deno Deploy？

Deno Deploy 是一个无服务器平台，用于在云端（或在您自己的基础设施上自托管）运行 JavaScript 和 TypeScript 应用。它提供了一个管理层，可以通过内置的 CI 或通过 GitHub Actions 等集成来部署和运行应用。

Deno Deploy 配备了一个易于使用的控制台，地址为 [console.deno.com](https://console.deno.com)。在这里，您可以创建和托管新的应用，创建和管理 Deno Deploy 组织，以及管理和查看您的数据库和应用遥测数据。

## 与 Deploy Classic 的对比

Deno Deploy 是对 Deploy Classic 的全面重构。它拥有全新的控制台，以及基于 Deno 2.0 的更加强大的执行环境。下表对比了两者的功能差异。

| 功能                            | Deno Deploy                    | Deploy Classic                                                                                                                          |
| ------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 网页界面                         | console.deno.com               | dash.deno.com                                                                                                                           |
| 深色模式                         | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| 构建                             | ✅ 完全集成                    | 🟠 在 GitHub Actions 中运行，控制台中没有实时流式日志，缓存需要手动设置，更改配置需要编辑 YAML |
| 可运行 Deno 应用                  | ✅ 完全支持                    | 🟠 有限支持（不支持 FFI、子进程、写入权限）                                                                                             |
| 可运行 Node 应用                  | ✅ 完全支持                    | 🟠 有限支持（不支持 FFI、原生扩展、子进程、写入权限，并且 NPM 兼容性较差）                                                            |
| 可运行 Next.js/Astro/SvelteKit    | ✅ 一等支持                    | 🟠 依赖框架，需要手动设置                                                                                                               |
| 一等静态站点                      | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| 环境变量                          | ✅ 区分开发/生产环境变量       | 🟠 所有部署共用一套环境变量                                                                                                             |
| CDN 缓存                          | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| Web Cache API                     | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 数据库                            | ✅ 支持                        | 🟠 Deno KV                                                                                                                              |
| 队列                             | ❌ 不支持                      | ✅ 支持                                                                                                                                |
| Cron                            | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 从 GitHub 部署                    | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 从 CLI 部署                      | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 即时回滚                          | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 日志                             | ✅ 支持                        | ✅ 支持                                                                                                                                |
| 链路追踪                        | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| 指标                             | ✅ 支持                        | ❌ 不支持                                                                                                                               |
| OpenTelemetry 导出            | ⏳ 开发中                    | ❌ 不支持                                                                                                                               |
| 区域                             | 2                              | 6                                                                                                                                       |
| 支持自托管区域                   | ✅ 支持                        | ❌ 不支持                                                                                                                               |

:::warning Deploy Classic 将于 2026 年 7 月 20 日停止服务

Deno Deploy Classic（dash.deno.com）以及 subhosting v1 API 将于
2026 年 7 月 20 日关闭。详情请参阅
<a href="/deploy/migration_guide/">迁移指南</a>。

:::

## 如何访问 Deno Deploy

开始使用 Deno Deploy：

1. 访问 [console.deno.com](https://console.deno.com) 进入新的控制台
2. 创建一个新的 Deno Deploy 组织
3. 在该组织内创建您的第一个应用
4. 从 GitHub 仓库或直接通过控制台进行部署

有关详细配置说明和特定框架的指南，请参阅我们的参考文档。
