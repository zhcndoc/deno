---
title: OpenTelemetry
description: "学习如何在 Deno 应用程序中使用 OpenTelemetry 实现可观察性。涵盖追踪、指标收集和与监控系统的集成。"
---

:::caution

OpenTelemetry 的 Deno 集成仍在开发中，可能会发生变化。
要使用它，您必须将 `--unstable-otel` 标志传递给 Deno。

:::

Deno 内置支持 [OpenTelemetry](https://opentelemetry.io/)。

> OpenTelemetry 是一组 API、SDK 和工具。使用它来对软件进行仪器化，生成、收集和导出遥测数据（指标、日志和追踪）以帮助您分析软件的性能和行为。
>
> <i>- https://opentelemetry.io/</i>

此集成使您能够使用 OpenTelemetry 可观察性工具监控您的 Deno 应用程序，使用日志、指标和追踪等工具。

Deno 提供以下功能：

- 使用 OpenTelemetry 协议将收集的指标、追踪和日志导出到服务器。
- 对 Deno 运行时进行 [自动仪器化](#auto-instrumentation)，以生成 OpenTelemetry 指标、追踪和日志。
- 收集使用 `npm:@opentelemetry/api` 包创建的 [用户定义的指标、追踪和日志](#user-metrics)。

## 快速开始

要启用 OpenTelemetry 集成，请使用 `--unstable-otel` 标志运行您的 Deno 脚本，并设置环境变量 `OTEL_DENO=true`：

```sh
OTEL_DENO=true deno run --unstable-otel my_script.ts
```

这将自动收集并导出运行时可观察性数据到 `localhost:4318` 的 OpenTelemetry 端点，使用 Protobuf 通过 HTTP（`http/protobuf`）。

:::tip

如果您尚未设置 OpenTelemetry 收集器，可以使用以下命令开始搭建 [Docker 中的本地 LGTM 堆栈](https://github.com/grafana/docker-otel-lgtm/tree/main?tab=readme-ov-file)（Loki（日志）、Grafana（仪表板）、Tempo（追踪）和 Prometheus（指标））：

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
	-e GF_PATHS_DATA=/data/grafana \
	docker.io/grafana/otel-lgtm:0.8.1
```

然后，您可以使用用户名 `admin` 和密码 `admin` 访问 Grafana 仪表板，地址为 `http://localhost:3000`。

:::

这将自动收集和导出运行时可观察性数据，例如 `console.log`、HTTP 请求的追踪和 Deno 运行时的指标。
[了解更多关于自动仪器化的信息](#auto-instrumentation)。

您还可以使用 `npm:@opentelemetry/api` 包创建自己的指标、追踪和日志。
[了解更多关于用户定义的指标](#user-metrics)。

## 自动仪器化

Deno 会自动收集并将一些可观察性数据导出到 OTLP 端点。

这些数据以 Deno 运行时的内置仪器化范围导出。该范围的名称为 `deno`。Deno 运行时的版本是 `deno` 仪器化范围的版本。（例如，`deno:2.1.4`）。

### 追踪

Deno 会自动为各种操作创建跨度，例如：

- 使用 `Deno.serve` 提供的传入 HTTP 请求。
- 使用 `fetch` 发出的传出 HTTP 请求。

#### `Deno.serve`

当您使用 `Deno.serve` 创建 HTTP 服务器时，会为每个传入请求创建一个跨度。该跨度在响应头发送时自动结束（而不是在响应体完成发送时）。

创建的跨度的名称为 `${method}`。跨度类型为 `server`。

以下属性在创建时会自动添加到跨度中：

- `http.request.method`: 请求的 HTTP 方法。
- `url.full`: 请求的完整 URL（如 `req.url` 所报告）。
- `url.scheme`: 请求 URL 的方案（例如，`http` 或 `https`）。
- `url.path`: 请求 URL 的路径。
- `url.query`: 请求 URL 的查询字符串。

请求处理后，将添加以下属性：

- `http.response.status_code`: 响应的状态代码。

Deno 不会自动向跨度添加 `http.route` 属性，因为运行时并不知道路由，而是由用户处理函数中的路由逻辑确定。如果您想向跨度添加 `http.route` 属性，可以在您的处理函数中使用 `npm:@opentelemetry/api` 添加。在这种情况下，您还应更新跨度名称以包含路由。

```ts
import { trace } from "npm:@opentelemetry/api@1";

const INDEX_ROUTE = new URLPattern({ pathname: "/" });
const BOOK_ROUTE = new URLPattern({ pathname: "/book/:id" });

Deno.serve(async (req) => {
  const span = trace.getActiveSpan();
  if (INDEX_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/");
    span.updateName(`${req.method} /`);

    // 处理首页路由
  } else if (BOOK_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/book/:id");
    span.updateName(`${req.method} /book/:id`);

    // 处理图书路由
  } else {
    return new Response("未找到", { status: 404 });
  }
});
```

#### `fetch`

当您使用 `fetch` 发出 HTTP 请求时，会为该请求创建一个跨度。该跨度在收到响应头时自动结束。

创建的跨度的名称为 `${method}`。跨度类型为 `client`。

以下属性在创建时会自动添加到跨度中：

- `http.request.method`: 请求的 HTTP 方法。
- `url.full`: 请求的完整 URL。
- `url.scheme`: 请求 URL 的方案。
- `url.path`: 请求 URL 的路径。
- `url.query`: 请求 URL 的查询字符串。

收到响应后，将添加以下属性：

- `http.status_code`: 响应的状态代码。

### 指标

自动收集和导出的指标包括：

#### `Deno.serve` / `Deno.serveHttp`

##### `http.server.request.duration`

一个直方图，记录通过 `Deno.serve` 或 `Deno.serveHttp` 提供的传入 HTTP 请求的持续时间。测量的时间是从接收到请求到发送响应头的时间。这不包括发送响应体的时间。该指标的单位为秒。直方图的桶为
`[0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0]`。

此指标记录以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `network.protocol.version`: 用于请求的 HTTP 协议版本（例如，`1.1` 或 `2`）。
- `server.address`: 服务器正在监听的地址。
- `server.port`: 服务器正在监听的端口。
- `http.response.status_code`: 响应的状态代码（如果请求未遭遇致命错误）。
- `error.type`: 发生的错误类型（如果请求处理遇到错误）。

##### `http.server.active_requests`

一个量表，记录在任何给定时刻由 `Deno.serve` 或 `Deno.serveHttp` 处理的活动请求的数量。这是已接收但尚未响应的请求数量（尚未发送响应头）。该指标记录如下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `server.address`: 服务器正在监听的地址。
- `server.port`: 服务器正在监听的端口。

##### `http.server.request.body.size`

一个直方图，记录通过 `Deno.serve` 或 `Deno.serveHttp` 提供的传入 HTTP 请求的请求体大小。该指标的单位为字节。直方图的桶为
`[0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]`。

此指标记录以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `network.protocol.version`: 用于请求的 HTTP 协议版本（例如，`1.1` 或 `2`）。
- `server.address`: 服务器正在监听的地址。
- `server.port`: 服务器正在监听的端口。
- `http.response.status_code`: 响应的状态代码（如果请求未遭遇致命错误）。
- `error.type`: 发生的错误类型（如果请求处理遇到错误）。

##### `http.server.response.body.size`

一个直方图，记录通过 `Deno.serve` 或 `Deno.serveHttp` 提供的传入 HTTP 请求的响应体大小。该指标的单位为字节。直方图的桶为
`[0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]`。

此指标记录以下属性：

- `http.request.method`: 请求的 HTTP 方法。
- `url.scheme`: 请求 URL 的方案。
- `network.protocol.version`: 用于请求的 HTTP 协议版本（例如，`1.1` 或 `2`）。
- `server.address`: 服务器正在监听的地址。
- `server.port`: 服务器正在监听的端口。
- `http.response.status_code`: 响应的状态代码（如果请求未遭遇致命错误）。
- `error.type`: 发生的错误类型（如果请求处理遇到错误）。

### 日志

自动收集和导出的日志包括：

- 使用 `console.*` 方法创建的任何日志，例如 `console.log` 和 `console.error`。
- Deno 运行时生成的任何日志，例如调试日志、`Downloading` 日志等。
- 任何导致 Deno 运行时退出的错误（无论是用户代码还是运行时本身）。

来自 JavaScript 代码引发的日志将带有相关的跨度上下文，如果日志发生在活动的跨度内部。

`console` 自动仪器化可以使用环境变量 `OTEL_DENO_CONSOLE` 进行配置：

- `capture`: 日志被发出到 stdout/stderr，并且也会与 OpenTelemetry 一起导出。（默认）
- `replace`: 日志仅与 OpenTelemetry 一起导出，而不发出到 stdout/stderr。
- `ignore`: 日志仅发出到 stdout/stderr，不会与 OpenTelemetry 一起导出。

## 用户指标

除了自动收集的遥测数据，您还可以使用 `npm:@opentelemetry/api` 包创建自己的指标和追踪。

您不需要配置 `npm:@opentelemetry/api` 包以在 Deno 中使用它。当传递 `--unstable-otel` 标志时，Deno 会自动设置 `npm:@opentelemetry/api` 包。无需调用 `metrics.setGlobalMeterProvider()`、`trace.setGlobalTracerProvider()` 或 `context.setGlobalContextManager()`。所有资源、导出设置等的配置都是通过环境变量完成的。

Deno 与版本 `1.x` 的 `npm:@opentelemetry/api` 包配合使用。您可以直接从 `npm:@opentelemetry/api@1` 导入，或者可以使用 `deno add` 本地安装该包并从 `@opentelemetry/api` 导入。

```sh
deno add npm:@opentelemetry/api@1
```

对于追踪和指标，您需要分别定义跟踪器和仪表的名称。如果您正在对库进行仪器化，则应以库的名称命名跟踪器或仪表（例如 `my-awesome-lib`）。如果您正在对应用程序进行仪器化，则应以应用程序的名称命名跟踪器或仪表（例如 `my-app`）。跟踪器或仪表的版本应设置为库或应用程序的版本。

### 追踪

要创建一个新的跨度，首先从 `npm:@opentelemetry/api` 导入 `trace` 对象并创建一个新的跟踪器：

```ts
import { trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");
```

然后，使用 `tracer.startActiveSpan` 方法创建一个新的跨度并传递一个回调函数。您必须通过调用返回的跨度对象的 `end` 方法手动结束跨度。

```ts
function myFunction() {
  return tracer.startActiveSpan("myFunction", (span) => {
    try {
      // 执行 myFunction 的工作
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: trace.SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

应在 `finally` 块中调用 `span.end()`，以确保即使发生错误也能结束跨度。`span.recordException` 和 `span.setStatus` 也应在 `catch` 块中调用，以记录发生的任何错误。

在回调函数内部，创建的跨度是“活动跨度”。您可以使用 `trace.getActiveSpan()` 获取活动跨度。创建的“活动跨度”将用作在回调函数（或从回调函数调用的任何函数）内部创建的任何跨度的父跨度。
[了解更多关于上下文传播的信息](#context-propagation)。

`startActiveSpan` 方法返回回调函数的返回值。

在跨度的生命周期内，可以向其添加属性。属性是表示跨度的结构化元数据的键值对。可以使用跨度对象上的 `setAttribute` 和 `setAttributes` 方法添加属性。

```ts
span.setAttribute("key", "value");
span.setAttributes({ success: true, "bar.count": 42n, "foo.duration": 123.45 });
```

属性的值可以是字符串、数字（浮点）、大整数（限制为 u64）、布尔值或任意这些类型的数组。如果属性值不是这些类型之一，将被忽略。

可以使用跨度对象上的 `updateName` 方法更新跨度的名称。

```ts
span.updateName("new name");
```

可以使用跨度对象上的 `setStatus` 方法设置跨度的状态。`recordException` 方法用于记录在跨度的生命周期内发生的异常。`recordException` 创建一个带有异常堆栈跟踪和名称的事件，并将其附加到跨度。**`recordException` 不会将跨度状态设置为 `ERROR`，您必须手动执行该操作。**

```ts
import { SpanStatusCode } from "npm:@opentelemetry/api@1";

span.setStatus({
  code: SpanStatusCode.ERROR,
  message: "发生了一个错误",
});
span.recordException(new Error("发生了一个错误"));

// 或者

span.setStatus({
  code: SpanStatusCode.OK,
});
```

跨度还可以有
[事件](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addEvent)
和
[链接](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addLink)
被添加到它们。事件是在时间点与跨度相关联的。
链接是对其他跨度的引用。

```ts
// 向跨度添加事件
span.addEvent("button_clicked", {
  id: "submit-button",
  action: "submit",
});

// 添加带时间戳的事件
span.addEvent("process_completed", { status: "success" }, Date.now());
```

事件可以包括类似于跨度的可选属性。它们用于标记跨度生命周期内的重要时刻，而无需创建单独的跨度。

跨度也可以使用 `tracer.startSpan` 手动创建，该方法返回一个跨度对象。此方法不会将创建的跨度设置为活动跨度，因此它不会自动用作后续创建的任何跨度或任何 `console.log` 调用的父跨度。可以使用 [上下文传播 API](#context-propagation) 手动将跨度设置为回调的活动跨度。

`tracer.startActiveSpan` 和 `tracer.startSpan` 都可以接受一个包含以下任意属性的可选参数：

- `kind`: 跨度的类型。可以是 `SpanKind.CLIENT`、`SpanKind.SERVER`、`SpanKind.PRODUCER`、`SpanKind.CONSUMER` 或 `SpanKind.INTERNAL`。默认为 `SpanKind.INTERNAL`。
- `startTime`: 表示跨度开始时间的 `Date` 对象，或表示自 Unix 纪元以来的毫秒数。如果未提供，将使用当前时间。
- `attributes`: 一个包含要添加到跨度的属性的对象。
- `links`: 一个要添加到跨度的链接数组。
- `root`: 一个布尔值，指示该跨度是否应为根跨度。如果 `true`，则该跨度将没有父跨度（即使存在活动跨度）。

在选项参数之后，`tracer.startActiveSpan` 和 `tracer.startSpan` 还可以接受来自
[上下文传播 API](#context-propagation) 的 `context` 对象。

在
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.TraceAPI.html) 中了解完整的追踪 API。

### 指标

要创建一个指标，首先从 `npm:@opentelemetry/api` 导入 `metrics` 对象并创建一个新的仪表：

```ts
import { metrics } from "npm:@opentelemetry/api@1";

const meter = metrics.getMeter("my-app", "1.0.0");
```

然后，可以从仪表创建仪器并用于记录值：

```ts
const counter = meter.createCounter("my_counter", {
  description: "一个简单的计数器",
  unit: "1",
});

counter.add(1);
counter.add(2);
```

每次记录也可以有相关的属性：

```ts
counter.add(1, { color: "red" });
counter.add(2, { color: "blue" });
```

:::tip

在 OpenTelemetry 中，指标属性通常应具有较低的基数。这意味着属性值的唯一组合不应太多。例如，拥有一个属性表示用户所在的洲可能是好的，但拥有一个属性表示用户的确切纬度和经度则基数过高。高基数属性可能会导致指标存储和导出的问题，应尽量避免。对于高基数数据，请使用跨度和日志。

:::

可以使用仪表创建几种类型的仪器：

- **计数器**：计数器是单调递增值。计数器只能是正数。它们可用于始终增加的值，例如处理的请求数量。

- **上下计数器**：上下计数器是一个既可以增加又可以减少的值。上下计数器可用于可以增加和减少的值，例如活动连接数或进行中的请求数。

- **仪表**：仪表是可以设置为任何值的值。它们用于不随时间“累积”的值，而是在任何给定时间具有特定值的值，例如当前温度。

- **直方图**：直方图是以值的分布记录的值。直方图可用于表示不仅是单个数字的值，而是数字的分布，例如请求的响应时间（以毫秒为单位）。直方图可用于计算百分位数、平均值和其他统计数据。它们有一组预定义的边界，定义了将值放入其中的桶。默认情况下，边界为 `[0.0, 5.0, 10.0, 25.0, 50.0, 75.0, 100.0, 250.0, 500.0, 750.0, 1000.0, 2500.0, 5000.0, 7500.0, 10000.0]`。

还有几种可观察的仪器类型。这些仪器没有同步记录方法，而是返回一个可以调用以记录值的回调。当 OpenTelemetry SDK 准备记录值时，例如在导出之前，将调用该回调。

```ts
const counter = meter.createObservableCounter("my_counter", {
  description: "一个简单的计数器",
  unit: "1",
});
counter.addCallback((res) => {
  res.observe(1);
  // 或者
  res.observe(1, { color: "red" });
});
```

有三种类型的可观察仪器：

- **可观察计数器**：可观察计数器是可以异步观察的计数器。它可用于始终增加的值，例如处理的请求数量。
- **可观察上下计数器**：可观察上下计数器是一个可以增加和减少的值，可以异步观察。上下计数器可用于可以增加和减少的值，例如活动连接数或进行中的请求数。
- **可观察仪表**：可观察仪表是可以设置为任何值并可以异步观察的值。它们用于不随时间“累积”的值，而是在任何给定时间具有特定值的值，例如当前温度。

在 [OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.MetricsAPI.html) 中了解完整的指标 API。

## 上下文传播

在 OpenTelemetry 中，上下文传播是将一些上下文信息（例如当前跨度）从应用程序的一部分传递到另一部分的过程，而不必将其显式作为参数传递给每个函数。

在 Deno 中，上下文传播是使用 `AsyncContext` 的规则进行的，这是 TC39 关于异步上下文传播的提议。`AsyncContext` API 目前尚未向 Deno 用户开放，但它在内部用于在异步边界跨越时传播活动跨度和其他上下文信息。

以下是 `AsyncContext` 传播工作原理的快速概述：

- 当启动新的异步任务时（例如 Promise 或定时器），当前上下文被保存。
- 然后，可以在与异步任务不同的上下文中并发执行其他代码。
- 当异步任务完成时，保存的上下文被恢复。

这意味着异步上下文传播本质上表现得像是一个范围限于当前异步任务的全局变量，并自动复制到从当前任务启动的任何新异步任务。

`npm:@opentelemetry/api@1` 中的 `context` API 向用户公开此功能。其工作方式如下：

```ts
import { context } from "npm:@opentelemetry/api@1";

// 获取当前活动的上下文
const currentContext = context.active();

// 您可以创建一个新的上下文并添加一个值
const newContext = currentContext.setValue("id", 1);

// 调用 setValue 不会更改当前上下文
console.log(currentContext.getValue("id")); // undefined

// 您可以在新上下文内部运行一个函数
context.with(newContext, () => {
  // 此块中的任意代码将运行在新上下文中
  console.log(context.active().getValue("id")); // 1

  // 此上下文也可在从此块调用的任何函数中使用
  function myFunction() {
    return context.active().getValue("id");
  }
  console.log(myFunction()); // 1

  // 并且它也可在从这里调度的任何异步回调中使用
  setTimeout(() => {
    console.log(context.active().getValue("id")); // 1
  }, 10);
});

// 在外部，上下文仍然相同
console.log(context.active().getValue("id")); // undefined
```

上下文 API 还与跨度集成。例如，要在特定跨度的上下文中运行某个函数，可以将跨度添加到上下文中，然后在该上下文中运行该函数：

```ts
import { context, trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");

const span = tracer.startSpan("myFunction");
const contextWithSpan = trace.setSpan(context.active(), span);

context.with(contextWithSpan, () => {
  const activeSpan = trace.getActiveSpan();
  console.log(activeSpan === span); // true
});

// 别忘了结束跨度！
span.end();
```

在 [OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.ContextAPI.html) 中了解完整的上下文 API。

## 配置

可以通过设置 `OTEL_DENO=true` 环境变量启用 OpenTelemetry 集成。

OTLP 导出的端点和协议可以使用环境变量 `OTEL_EXPORTER_OTLP_ENDPOINT` 和 `OTEL_EXPORTER_OTLP_PROTOCOL` 进行配置。

如果端点需要身份验证，可以使用环境变量 `OTEL_EXPORTER_OTLP_HEADERS` 配置头。

可以为指标、追踪和日志分别使用特定环境变量覆盖端点，例如：

- `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT`
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`
- `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT`

有关可用于配置 OTLP 导出的头的更多信息，请 [查看 OpenTelemetry 网站](https://opentelemetry.io/docs/specs/otel/protocol/exporter/#configuration-options)。

与遥测数据相关联的资源可以使用 `OTEL_SERVICE_NAME` 和 `OTEL_RESOURCE_ATTRIBUTES` 环境变量进行配置。除了通过 `OTEL_RESOURCE_ATTRIBUTES` 环境变量设置的属性外，还有以下属性会自动设置：

- `service.name`: 如果未设置 `OTEL_SERVICE_NAME`，则值设置为 `<unknown_service>`。
- `process.runtime.name`: `deno`
- `process.runtime.version`: Deno 运行时的版本。
- `telemetry.sdk.name`: `deno-opentelemetry`
- `telemetry.sdk.language`: `deno-rust`
- `telemetry.sdk.version`: Deno 运行时的版本，加上 Deno 使用的 `opentelemetry` Rust crate 的版本，以 `-` 分隔。

传播者可以使用 `OTEL_PROPAGATORS` 环境变量配置。
默认值为 `tracecontext,baggage`。可以通过逗号分隔指定多个传播者。当前支持的传播者有：

- `tracecontext`: W3C Trace Context 传播格式
- `baggage`: W3C Baggage 传播格式

指标收集频率可以使用 `OTEL_METRIC_EXPORT_INTERVAL` 环境变量进行配置。默认值为 `60000` 毫秒（60 秒）。

跨度导出器批处理可以使用在 [OpenTelemetry 规范](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-span-processor) 中描述的批跨度处理器环境变量进行配置。

日志导出器批处理可以使用在 [OpenTelemetry 规范](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-log-record-processor) 中描述的批日志记录处理器环境变量进行配置。

## 传播者

Deno 支持上下文传播者，这使得跨进程边界自动传播追踪上下文，支持分布式追踪，使您能够跟踪请求在不同服务中流动的过程。

传播者负责将上下文信息（如追踪和跨度 ID）编码到载体格式（如 HTTP 头）中并从中解码。这使得追踪上下文能够在服务边界之间传递。

默认情况下，Deno 支持以下传播者：

- `tracecontext`: W3C Trace Context 传播格式，这是通过 HTTP 头传播追踪上下文的标准方式。
- `baggage`: W3C Baggage 传播格式，允许在服务边界之间传递键值对。

:::note

这些传播者自动与 Deno 的 `fetch` API 和 `Deno.serve` 配合使用，使 HTTP 请求跨越的端到端追踪成为可能，无需手动管理上下文。

:::

您可以通过 `@opentelemetry/api` 包访问传播 API：

```ts
import { context, propagation, trace } from "npm:@opentelemetry/api@1";

// 从传入的头部提取上下文
function extractContextFromHeaders(headers: Headers) {
  const ctx = context.active();
  return propagation.extract(ctx, headers);
}

// 向传出的头部注入上下文
function injectContextIntoHeaders(headers: Headers) {
  const ctx = context.active();
  propagation.inject(ctx, headers);
  return headers;
}

// 示例：发出一个传播追踪上下文的 fetch 请求
async function tracedFetch(url: string) {
  const headers = new Headers();
  injectContextIntoHeaders(headers);

  return await fetch(url, { headers });
}
```

## 限制

虽然 Deno 的 OpenTelemetry 集成正在开发中，但存在一些限制需注意：

- 追踪总是被采样（即 `OTEL_TRACE_SAMPLER=parentbased_always_on`）。
- 追踪仅支持没有属性的链接。
- 不支持指标示例。
- 不支持自定义日志流（例如，非 `console.log` 和 `console.error` 的日志）。
- 唯一支持的导出器是 OTLP - 其他导出器不受支持。
- 仅支持 `http/protobuf` 和 `http/json` 协议用于 OTLP。其他协议如 `grpc` 不受支持。
- 从可观察（异步）仪表收集的指标不会在进程退出/崩溃时收集，因此最后的指标值可能不会被导出。同步指标会在进程退出/崩溃时导出。
- 在追踪跨度中，不遵守 `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT`、`OTEL_ATTRIBUTE_COUNT_LIMIT`、`OTEL_SPAN_EVENT_COUNT_LIMIT`、`OTEL_SPAN_LINK_COUNT_LIMIT`、`OTEL_EVENT_ATTRIBUTE_COUNT_LIMIT` 和 `OTEL_LINK_ATTRIBUTE_COUNT_LIMIT` 环境变量中指定的限制。
- 不尊重环境变量 `OTEL_METRIC_EXPORT_TIMEOUT`。
- 未知的 HTTP 方法在 `http.request.method` 跨度属性中不会标准化为 `_OTHER`，这与 OpenTelemetry 语义约定不符。
- `Deno.serve` 的 HTTP 服务器跨度没有设置 OpenTelemetry 状态，如果处理程序抛出（即调用 `onError`），则该跨度将没有错误状态设置，且错误将不会通过事件附加到跨度。
- 在 `fetch` 的 HTTP 客户端跨度中没有机制添加 `http.route` 属性，或更新跨度名称以包含路由。