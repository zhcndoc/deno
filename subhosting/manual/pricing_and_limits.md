---
title: 定价和限制
description: Deno Subhosting 定价计划、资源限制、部署限制和应用性能约束的概述。
---

:::warning 2026 年 7 月 20 日停止服务

subhosting v1 API 将于 2026 年 7 月 20 日关闭。请迁移到
<a href="https://api.deno.com/v2/docs">v2 API</a>。详情请参阅
<a href="/subhosting/manual/api_migration_guide/">API 迁移指南</a>。

:::

你可以在 Deno 网站上查看
[Deno Subhosting 可用定价计划和功能概览](https://deno.com/deploy/pricing?subhosting)。
如果你的使用场景超出了这些限制中的任何一项， [请联系我们](mailto:deploy@deno.com)。

## 部署大小

每次部署的所有源代码和资产加起来应少于 1GB。

## 部署频率

一个 subhosting 用户每小时的最大部署次数为 60 次（免费套餐）或 300 次（构建者套餐）。对于企业计划的组织，提供更高的限制。

## 每次请求的 CPU 时间

- 根据套餐，限制为 50ms 或 200ms。
- 每次请求的 CPU 时间限制是基于多个请求的平均值来设定的，并不是严格按每个请求强制执行。
- 不包括部署等待 I/O 的时间（例如，在进行 fetch() 请求时等待远程服务器的时间）

## 阻塞事件循环

程序不应阻塞事件循环超过 1 秒。

## 可用内存

最大可用内存为 512MB。