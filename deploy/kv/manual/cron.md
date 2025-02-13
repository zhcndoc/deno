---
title: "调度 cron 任务"
oldUrl:
  - /kv/manual/cron/
---

<deno-admonition></deno-admonition>

[`Deno.cron`](https://docs.deno.com/api/deno/~/Deno.cron) 接口使您能够配置以可配置的时间表执行的 JavaScript 或 TypeScript 代码，使用 [cron 语法](https://en.wikipedia.org/wiki/Cron)。在下面的示例中，我们配置一段每分钟执行一次的 JavaScript 代码。

```ts
Deno.cron("记录消息", "* * * * *", () => {
  console.log("每分钟打印一次。");
});
```

也可以使用 JavaScript 对象来定义 cron 调度。在下面的示例中，我们配置一段每小时执行一次的 JavaScript 代码。

```ts
Deno.cron("记录消息", { hour: { every: 1 } }, () => {
  console.log("每小时打印一次。");
});
```

`Deno.cron` 接受三个参数：

- 一个可读的人类名称，描述 cron 任务
- 一个 cron 调度字符串或定义调度的 JavaScript 对象，指定 cron 任务的运行时间
- 一个在给定调度上执行的函数

如果您是 cron 语法的新手，有一些第三方模块可帮助您生成 cron 调度字符串 [像这个](https://www.npmjs.com/package/cron-time-generator)。

## 重试失败的运行

失败的 cron 调用会自动按照默认重试策略进行重试。如果您想指定自定义重试策略，可以使用 `backoffSchedule` 属性来指定一个等待时间数组（以毫秒为单位），该数组用于在再次重试函数调用之前等待。在以下示例中，我们将尝试重试失败的回调三次——第一次等待一秒，第二次等待五秒，然后等待十秒。

```ts
Deno.cron("重试示例", "* * * * *", () => {
  throw new Error("Deno.cron 将重试这三次，但没有成功！");
}, {
  backoffSchedule: [1000, 5000, 10000],
});
```

## 设计和限制

在使用 `Deno.cron` 时，请注意以下一些设计细节和限制。

### 任务必须在顶层模块作用域中定义

[`Deno.cron`](https://docs.deno.com/api/deno/~/Deno.cron) 接口旨在支持基于预定义调度的静态 cron 任务定义。所有 `Deno.cron` 任务必须在模块的顶层定义。任何嵌套的 `Deno.cron` 定义（例如在 [`Deno.serve`](https://docs.deno.com/api/deno/~/Deno.serve) 处理程序内）将导致错误或被忽略。

如果您需要在 Deno 程序执行期间动态调度任务，您可以使用 [Deno Queues](./queue_overview) API。

### 时区

`Deno.cron` 调度使用 UTC 时区指定。这有助于避免因观察夏令时而造成的时区问题。

### 重叠执行

下一个计划的 cron 任务调用可能会与先前的调用重叠。如果发生这种情况，`Deno.cron` 将跳过下一个计划调用，以避免重叠执行。

### 星期几数字表示

`Deno.cron` 不使用基于 0 的星期几数字表示。相反，它使用 1-7（或 SUN-SAT）来表示从星期日到星期六。这可能与其他使用 0-6 表示法的 cron 引擎不同。

## 在 Deno Deploy 上的使用

通过 [Deno Deploy](https://deno.com/deploy)，您可以在云中的 V8 隔离环境中运行您的后台任务。在这样做时，有一些注意事项要考虑。

### 与 Deno CLI 的不同

像其他 Deno 运行时内置功能（如队列和 Deno KV）一样，`Deno.cron` 的实现在线上 Deno Deploy 中稍有不同。

#### 默认情况下 cron 的工作原理

Deno 运行时中的 `Deno.cron` 实现将执行状态保存在内存中。如果您运行多个使用 `Deno.cron` 的 Deno 程序，每个程序将有自己独立的 cron 任务集。

#### Deno Deploy 上的cron工作原理

Deno Deploy 提供了一个无服务器实现的 `Deno.cron`，旨在实现高可用性和扩展性。Deno Deploy 会在部署时自动提取您的 `Deno.cron` 定义，并使用按需隔离进行任务调度。您最新的生产部署定义了安排执行的活动 cron 任务集。要添加、删除或修改 cron 任务，只需修改代码并创建一个新的生产部署。

Deno Deploy 保证您的 cron 任务在每个计划的时间间隔内至少执行一次。这通常意味着您的 cron 处理程序每次按照计划的时间调用一次。在某些故障场景下，处理程序可能会因同一调度时间被多次调用。

### Cron 仪表板

当您进行包含 cron 任务的生产部署时，可以在您项目的 [Deploy 仪表板](https://dash.deno.com/projects) 中的 `Cron` 选项卡下查看所有 cron 任务的列表。

![Deno 仪表板中 cron 任务的列表](./images/cron-tasks.png)

### 定价

`Deno.cron` 调用的收费与针对您的部署的入站 HTTP 请求相同。有关定价的更多信息，请访问 [这里](https://deno.com/deploy/pricing)。

### 特定于部署的限制

- `Deno.cron` 仅适用于生产部署（不适用于预览部署）
- 您的 `Deno.cron` 处理程序的确切调用时间可能与计划时间相差最多一分钟

## Cron 配置示例

以下是一些常见的 cron 配置，供您参考。

```ts title="每分钟运行一次"
Deno.cron("每分钟运行一次", "* * * * *", () => {
  console.log("你好，cron！");
});
```

```ts title="每十五分钟运行一次"
Deno.cron("每十五分钟运行一次", "*/15 * * * *", () => {
  console.log("你好，cron！");
});
```

```ts title="每小时整点运行一次"
Deno.cron("每小时整点运行一次", "0 * * * *", () => {
  console.log("你好，cron！");
});
```

```ts title="每三小时运行一次"
Deno.cron("每三小时运行一次", "0 */3 * * *", () => {
  console.log("你好，cron！");
});
```

```ts title="每天凌晨 1 点运行一次"
Deno.cron("每天凌晨 1 点运行一次", "0 1 * * *", () => {
  console.log("你好，cron！");
});
```

```ts title="每周三午夜运行一次"
Deno.cron("每周三午夜运行一次", "0 0 * * WED", () => {
  console.log("你好，cron！");
});
```

```ts title="每月第一天午夜运行一次"
Deno.cron("每月第一天午夜运行一次", "0 0 1 * *", () => {
  console.log("你好，cron！");
});
```