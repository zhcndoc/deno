---
last_modified: 2026-03-02
title: Cron
description: "在 Deno Deploy 中调度和管理 cron 任务，包括在代码中定义 cron 任务、执行生命周期、重试以及可观测性。"
---

Cron 任务是按定义的时间表自动运行的计划任务。您可以通过 `Deno.cron()` API 在代码中定义 cron 任务，部署您的应用，平台会发现并按计划运行它们。

## 在代码中定义 cron 任务

`Deno.cron()` 接受一个可读性强的名称、一个时间表和一个处理函数。名称用于在仪表盘和日志中标识该 cron 任务，时间表决定它何时触发，处理函数包含每次调用时要执行的代码。时间表可以是标准的[五字段 cron 表达式](https://en.wikipedia.org/wiki/Cron#UNIX-like)或结构化对象。所有时间均为 UTC — 这避免了夏令时转换时的歧义。详情请参阅[完整 API 参考](https://docs.deno.com/api/deno/~/Deno.cron)。

```typescript
Deno.cron("cleanup-old-data", "0 * * * *", () => {
  console.log("清理旧数据...");
});

Deno.cron(
  "sync-data",
  "*/15 * * * *",
  {
    backoffSchedule: [1000, 5000, 10000],
  },
  async () => {
    await syncExternalData();
  },
);
```

### 常见的时间表表达式

| 时间表                      | 表达式         |
| --------------------------- | -------------- |
| 每分钟                      | `* * * * *`    |
| 每 15 分钟                  | `*/15 * * * *` |
| 每小时                      | `0 * * * *`    |
| 每 3 小时                   | `0 */3 * * *`  |
| 每天凌晨 1 点               | `0 1 * * *`    |
| 每周三午夜                 | `0 0 * * WED`  |
| 每月第一天午夜             | `0 0 1 * *`    |

### 组织 cron 声明

您必须在模块顶层注册 cron 任务，且要在 `Deno.serve()` 启动之前。平台通过评估模块顶层代码在部署时提取 `Deno.cron()` 定义 — 这就是它发现有哪些 cron 任务存在及其时间表的方式。在请求处理器内、条件语句中或服务器启动之后注册的 cron 任务将不会被识别。

随着 cron 任务数量的增长，全部放在主入口文件可能会显得杂乱。常见做法是将 cron 处理器定义在专门的文件中，并在入口文件顶部进行导入。

```typescript title="crons.ts"
Deno.cron("cleanup-old-data", "0 * * * *", async () => {
  await deleteExpiredRecords();
});

Deno.cron("sync-data", "*/15 * * * *", async () => {
  await syncExternalData();
});
```

```typescript title="main.ts"
import "./crons.ts";

Deno.serve(handler);
```

由于 `Deno.cron()` 调用在模块顶层执行，仅导入该模块即可注册 cron 任务，无需调用或重新导出任何内容。

对于有大量 cron 任务的项目，可以使用 `crons/` 目录，里面每个文件对应一个 cron 任务或一组相关任务，并使用一个中枢文件重新导出它们：

```typescript title="crons/mod.ts"
import "./cleanup.ts";
import "./sync.ts";
```

```typescript title="main.ts"
import "./crons/mod.ts";

Deno.serve(handler);
```

### 限制

定义 cron 任务时需注意一些限制。传递给 `Deno.cron()` 的名称最长不能超过 **256 字符** — 这是出现在仪表盘和日志中的标识符，因此保持简洁是个好习惯。免费组织中，每个修订版本最多注册 **10 个 cron 任务**。如果项目需要更多，可以升级至付费计划以解除限制。

## 执行生命周期与状态

当 cron 任务到期时，会在它被注册的每个时间线独立触发。每次执行运行该时间线活动修订版中的处理函数。例如，如果 `cleanup-old-data` 任务分别在生产时间线和 `staging` 分支时间线上注册，生产时间线的执行会运行生产修订版的处理函数，staging 时间线的执行会运行 staging 修订版的处理函数。每次执行会计为一次入站 HTTP 请求。

Cron 任务执行的状态包括：

| 状态        | 颜色   | 描述                                 |
| ----------- | ------ | ------------------------------------ |
| **运行中**  | 黄色   | Cron 任务处理函数正在执行            |
| **成功**    | 绿色   | 执行成功                            |
| **错误**    | 红色   | 失败 — 悬停查看错误信息             |

平台防止重复执行：同一 cron 任务不能并发运行。如果上一次执行仍在运行，下一次预定触发将被跳过。这样避免了资源争用，确保每次执行能顺利完成。

## 重试与退避

默认情况下，失败的 cron 任务不会重试。您可以选择提供 `backoffSchedule` 数组来启用重试并精确控制每次重试的时间。

`backoffSchedule` 是一个延迟毫秒数数组，每个元素指定下一次重试前等待的时间：

- 每次执行最多 **5 次重试**
- 每次重试的最长延迟：**1 小时**（3,600,000 毫秒）
- 重试不会影响 cron 任务的计划 — 下一次预定运行仍按时执行，即使先前运行的重试仍挂起。如果重试与下一次预定运行时间重叠，后者将按照上面所述的重叠策略跳过。

示例：`backoffSchedule: [1000, 5000, 10000]` 表示重试最多 3 次，间隔分别为 1 秒、5 秒和 10 秒。

## 仪表盘

应用侧栏的 **Cron** 标签页为您提供项目中所有注册 cron 任务的概览。每条记录显示 cron 任务的时间表、最近执行情况和其所属的活动[时间线](/deploy/reference/timelines/)。当同名的 cron 任务在不同时间线以不同时间表注册时，每个不同时间表都会作为独立条目显示，方便您分别跟踪。

点击任意 cron 任务的“查看详情”可打开详情页，显示完整的执行历史。您可通过搜索栏筛选执行记录：

- **`status:<值>`** — 按状态筛选 (`ok`, `error`, `running`)
- **`timeline:<名称>`** — 按时间线名称筛选（子串匹配，大小写不敏感）

## 可观测性集成

Cron 任务执行会产生 OpenTelemetry 跟踪。点击执行历史中的“查看跟踪”进入该特定跟踪的
[可观测性](/deploy/reference/observability/) 跟踪页面。

在跟踪页面，您可以使用这些与 cron 相关的过滤条件：

- **`kind:cron`** — 仅显示 cron span
- **`cron.name:<名称>`** — 按 cron 名称过滤
- **`cron.schedule:<时间表>`** — 按时间表表达式过滤

## 时间线

Cron 任务会在生产和 git 分支的
[时间线](/deploy/reference/timelines/)上运行。平台在部署时提取 `Deno.cron()` 定义并调度执行，因此每个时间线运行其活动修订版代码中定义的 cron 任务。要添加、删除或修改 cron 任务，请更新代码并部署新修订版。回滚到先前部署时会重新注册该部署中的 cron 任务。您可以在仪表盘对应时间线页面查看当前注册的 cron 任务。
