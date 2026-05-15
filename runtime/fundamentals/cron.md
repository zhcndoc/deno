---
last_modified: 2026-05-13
title: "Cron"
description: "使用 Deno.cron() 运行时 API 在 Deno 中安排重复任务，这是一个通过 --unstable-cron 启用的不稳定功能。"
---

[`Deno.cron()`](/api/deno/~/Deno.cron) 是 Deno 的一个运行时 API，用于安排
JavaScript 或 TypeScript 代码按重复计划运行，计划使用
[cron 语法](https://en.wikipedia.org/wiki/Cron#UNIX-like) 表示。它随 Deno
本身一起发布，因此在本地运行的相同代码无需修改即可部署。

[`Deno.cron`](/api/deno/~/Deno.cron) 目前是一个不稳定的 API。要在本地使用
`deno run`，请启用
[`--unstable-cron`](/runtime/reference/cli/unstable_flags/#--unstable-cron) 标志
（或将 `"cron"` 添加到
[`unstable`](/runtime/fundamentals/configuration/#unstable-features) 数组中，
位于 `deno.json`）。

```sh
deno run --unstable-cron main.ts
```

<a href="/api/deno/~/Deno.cron" class="docs-cta runtime-cta">Deno.cron API
参考</a>

## 定义一个 cron 任务

[`Deno.cron()`](/api/deno/~/Deno.cron) 接受一个可读名称、一个计划，
以及一个处理函数。名称用于在日志中标识 cron 任务，计划
决定处理函数何时触发，所有时间均使用 UTC。

```ts
Deno.cron("log-a-message", "* * * * *", () => {
  console.log("This runs once a minute.");
});
```

计划可以是标准的 5 字段 cron 表达式，也可以是结构化对象：

```ts
Deno.cron("hourly-task", { hour: { every: 1 } }, () => {
  console.log("This runs once an hour.");
});
```

cron 任务必须在模块顶层注册，并且要在任何服务器启动之前完成。
嵌套在请求处理器、条件语句或回调中的定义不会被识别。

## 重试和退避

默认情况下，失败的处理函数调用不会重试。传入 `backoffSchedule`
（一个毫秒延迟数组）即可在失败时重试：

```ts
Deno.cron(
  "retry-example",
  "* * * * *",
  { backoffSchedule: [1000, 5000, 10000] },
  () => {
    throw new Error("Will be retried up to three times.");
  },
);
```

## 在生产环境中运行 cron 任务

[`Deno.cron`](/api/deno/~/Deno.cron) 在 Deno CLI 中将执行状态保存在内存中，
这意味着每个进程都会维护自己独立的一组 cron 任务。
对于生产工作负载，[Deno Deploy](/deploy/reference/cron/) 在此运行时 API 之上构建：
它会在部署时发现你的 [`Deno.cron()`](/api/deno/~/Deno.cron)
定义，安排并调用它们，处理重试，并在仪表板中展示运行情况——这样你就
不需要自己维持一个长期运行的进程。
