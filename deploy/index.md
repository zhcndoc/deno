---
title: "关于 Deno Deploy"
description: "Deno Deploy 功能指南、与 Deploy Classic 的对比以及部署入门指南。"
---

<div class="lg:flex lg:flex-row lg:gap-8">
   <img src="/deno-deploy.svg" alt="Deno Deploy 标志" style="max-width: 120px" />
      <p class="text-lg text-foreground-secondary mt-6">Deno 的云服务提供强大的平台，用于在全球范围内部署和运行 JavaScript 和 TypeScript 应用。<a href="https://console.deno.com" class="docs-cta deploy-cta mt-2">前往 Deno Deploy 控制台</a></p>

</div>

## 什么是 Deno Deploy？

Deno Deploy 是一个无服务器平台，用于在云端（或在您自己的基础设施上自托管）运行 JavaScript 和 TypeScript 应用。它提供了一个管理层，可以通过内置的 CI 或通过 GitHub Actions 等集成来部署和运行应用。

Deno Deploy 配备了一个易于使用的控制台，地址为 [console.deno.com](https://console.deno.com)。在这里，您可以创建和托管新的应用，创建和管理 Deno Deploy 组织，以及管理和查看您的数据库和应用遥测数据。

## 与 Deploy Classic 的对比

Deno Deploy 是对 Deploy Classic 的全面重构。它拥有全新的控制台，以及基于 Deno 2.0 的更加强大的执行环境。下表对比了两者的功能差异。

| 功能                           | Deno Deploy                  | Deploy Classic                                                                                                                           |
| ------------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 网页界面                       | console.deno.com            | dash.deno.com                                                                                                                            |
| 暗黑模式                       | ✅ 支持                      | ❌ 不支持                                                                                                                               |
| 构建                           | ✅ 完全集成                  | 🟠 在 GitHub Actions 中运行，面板无实时日志，缓存需手动设置，更改配置需要编辑 YAML                                                       |
| 支持运行 Deno 应用             | ✅ 完全支持                  | 🟠 有限支持（无 FFI、子进程、写权限）                                                                                                    |
| 支持运行 Node 应用             | ✅ 完全支持                  | 🟠 有限支持（无 FFI、原生插件、子进程、写权限，且 NPM 兼容性受限）                                                                        |
| 支持运行 Next.js/Astro/SvelteKit | ✅ 一流支持                 | 🟠 依赖框架，需要手动配置                                                                                                                |
| 一流的静态站点支持             | ✅ 支持                      | ❌ 不支持                                                                                                                               |
| 环境变量                       | ✅ 区分开发/生产环境变量       | 🟠 单套环境变量适用于所有部署                                                                                                            |
| CDN 缓存                      | ✅ 支持                      | ❌ 不支持                                                                                                                               |
| Web Cache API                 | ✅ 支持                      | ✅ 支持                                                                                                                                |
| 数据库                         | ✅ 支持                      | 🟠 Deno KV                                                                                                                              |
| 队列                           | ❌ 不支持                    | ✅ 支持                                                                                                                                |
| 定时任务                       | ❌ 不支持                    | ✅ 支持                                                                                                                                |
| GitHub 部署                   | ✅ 支持                      | ✅ 支持                                                                                                                                |
| 命令行部署                   | ✅ 支持                      | ✅ 支持                                                                                                                                |
| 即时回滚                     | ✅ 支持                      | ✅ 支持                                                                                                                                |
| 日志                           | ✅ 支持                      | ✅ 支持                                                                                                                                |
| 追踪                           | ✅ 支持                      | ❌ 不支持                                                                                                                               |
| 指标                           | ✅ 支持                      | ❌ 不支持                                                                                                                               |
| OpenTelemetry 导出           | ⏳ 进行中                     | ❌ 不支持                                                                                                                               |
| 节点（区域）                  | 2                           | 6                                                                                                                                      |
| 支持自托管节点                | ✅ 支持                      | ❌ 不支持                                                                                                                               |

## 如何访问 Deno Deploy

开始使用 Deno Deploy：

1. 访问 [console.deno.com](https://console.deno.com) 进入新的控制台
2. 创建一个新的 Deno Deploy 组织
3. 在该组织内创建您的第一个应用
4. 从 GitHub 仓库或直接通过控制台进行部署

有关详细配置说明和特定框架的指南，请参阅我们的参考文档。
