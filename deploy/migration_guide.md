---
last_modified: 2026-03-19
title: "从 Deploy Classic 迁移到 Deno Deploy"
description: "指导将应用从 Deno Deploy Classic（dash.deno.com）迁移到新的 Deno Deploy（console.deno.com），包括子托管 API 迁移。"
---

Deno Deploy Classic（dash.deno.com）和 subhosting v1 API（apidocs.deno.com）
将于 **2026 年 7 月 20 日** 停止服务。本指南介绍如何将您的
应用程序和 API 集成迁移到新的
[Deno Deploy](https://console.deno.com) 平台。如果您正在从
subhosting v1 API 迁移，请参阅
[subhosting API 迁移指南](/subhosting/manual/api_migration_guide/)。

## 创建新组织

新的 Deno Deploy 使用独立的账号系统。开始使用：

1. 前往 [console.deno.com](https://console.deno.com) 并登录
2. 创建一个新组织（如果您还没有）——这是在部署任何应用程序之前
   必需的
3. 根据需要邀请团队成员加入您的组织

**您在 dash.deno.com 上的 Deploy Classic 项目不会自动
转移。** 您需要创建新应用并重新部署。

## 创建并部署您的应用

在新的 Deno Deploy 控制台中，在您的组织内创建一个新应用。您
可以通过 GitHub 集成或 CLI 进行部署。

### GitHub 集成

在控制台中的应用设置里连接您的 GitHub 仓库。新的
Deploy 已完全集成构建流程——不再需要 GitHub Actions YAML 配置。
构建日志会直接在控制台中实时流式显示。

### CLI 部署

`deployctl` CLI 也将逐步停用。请改用 `deno deploy`
子命令：

```sh
deno deploy
```

有关详细设置说明，请参阅
[入门指南](/deploy/getting_started/)。

## 环境变量

Deploy Classic 为所有部署使用同一组环境变量。
新的 Deploy 支持分别设置 **生产**、**开发** 和 **构建**
上下文。

请检查您的环境变量，并在新控制台中应用设置下进行配置。有关详细信息，请参阅
[环境变量和上下文](/deploy/reference/env_vars_and_contexts/)。

## 自定义域名

迁移自定义域名：

1. 在控制台中将域名添加到您的新 Deploy 应用
2. 为 TLS 证书签发配置 `_acme-challenge` CNAME 记录
3. 更新您的 DNS 记录（CNAME 或 ANAME）指向新的 Deploy
4. 在从 Deploy Classic 中移除该域名之前，最多允许 48 小时用于
   DNS 传播

有关逐步操作说明，请参阅
[自定义域名迁移教程](/examples/migrate_custom_domain_tutorial/)。

## HTTP server API

Deploy Classic 支持来自 `deno.land/std` HTTP
模块的 `serve()` 函数（例如 `https://deno.land/std@0.170.0/http/server.ts`）。新的 Deploy
**不支持** 这种遗留的 `serve()` 函数。

请更新您的代码，改用内置的
[`Deno.serve()`](https://docs.deno.com/api/deno/~/Deno.serve) API：

```diff
- import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
-
- serve(() => new Response("hello, world"));
+ Deno.serve(() => new Response("hello, world"));
```

自 Deno 1.35 起，`Deno.serve()` 一直是推荐的 HTTP 服务器 API，且性能更佳。如果您的应用使用旧版标准库 `serve()`，
请在迁移到新 Deploy 之前先更新。

如果您部署了使用旧版 `serve()` 函数的代码到新 Deploy，它
会在部署的 **预热阶段** 失败，并出现 **超时错误**。如果遇到此错误，请检查您的入口点或任何依赖项是否在使用标准库 `serve()`。
某些较旧版本的第三方库可能在内部依赖遗留的 `serve()` 函数——在这种情况下，请将该库升级到使用 `Deno.serve()` 的版本。

## Cron jobs

新的 Deploy 上的 `Deno.cron()` API 工作方式相同。您现有的 cron
任务代码应可直接运行，无需修改。有关详细信息，请参阅
[cron 参考](/deploy/reference/cron/)。

## 队列

Deno 队列（`Deno.Kv.enqueue()` / `Deno.Kv.listenQueue()`）在新的
Deno Deploy 上**不受支持**。如果您的应用依赖队列，您需要采用替代方案——例如，
外部消息队列服务或基于数据库的任务队列。

## KV 数据库

新的 Deploy 提供 Deno KV，但您现有的 KV 数据不会
自动迁移。请联系 [support@deno.com](mailto:support@deno.com)
寻求迁移 KV 数据库的帮助。

有关 KV 在新平台上的工作方式，包括按上下文隔离数据库的信息，请参阅
[Deploy 上的 Deno KV](/deploy/reference/deno_kv/)。

## Subhosting API 迁移

位于 `apidocs.deno.com` 的 subhosting v1 API 将与 Deploy
Classic 一同于 2026 年 7 月 20 日停止服务。请将您的集成迁移到
[v2 API](https://api.deno.com/v2/docs)。

v2 API 在架构上有重大变化——项目变为应用，部署变为修订，
每个应用代表一个可部署的单一服务。有关详细的端点映射、请求/响应
变化，以及标签和层等新功能，请参阅
[subhosting API 迁移指南](/subhosting/manual/api_migration_guide/)。

v2 API 的官方 SDK：

- **TypeScript/JavaScript**：
  [@deno/sandbox](https://www.npmjs.com/package/@deno/sandbox)
- **Python**: [deno-sandbox](https://pypi.org/project/deno-sandbox/)

## 区域

Deploy Classic 在 6 个区域提供服务。新的 Deploy 目前有 2 个区域，
并且可以在您自己的基础设施上自托管额外区域。如果您的应用对延迟敏感并依赖特定区域，请
提前做好相应规划。

## 新功能

新的 Deploy 包含 Deploy Classic 中没有的几个功能：

- **完整的 Deno 2.0 运行时** — FFI、子进程、文件系统写入权限，以及
  改进的 npm 兼容性
- **集成构建** — 构建步骤在 Deno Deploy 上运行，并实时流式传输
  日志，无需 GitHub Actions YAML
- **一流的框架支持** — Next.js、Astro、SvelteKit、Fresh 等
  可开箱即用
- **CDN 缓存** — 内置边缘缓存，支持 `Cache-Control` 头和
  程序化缓存失效
- **可观测性** — 控制台中的日志、追踪和指标
- **静态站点支持** — 可直接部署静态站点
- **独立的开发/生产环境** — 不同上下文使用不同的环境变量和
  数据库

如果您有任何问题或需要帮助，请联系
[support@deno.com](mailto:support@deno.com)。
