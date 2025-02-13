---
title: OpenTelemetry
---

:::caution

Deno 的 OpenTelemetry 集成仍在开发中，可能会发生变化。
使用它时，您必须将 `--unstable-otel` 标志传递给 Deno。

:::

Deno 内置支持 [OpenTelemetry](https://opentelemetry.io/)。

> OpenTelemetry 是一组 API、SDK 和工具。使用它来进行仪器化，
> 生成、收集和导出遥测数据（指标、日志和跟踪），以帮助您分析软件的性能和行为。
>
> <i>- https://opentelemetry.io/</i>

此集成使您能够使用 OpenTelemetry 可观察性工具监控 Deno 应用程序，
使用日志、指标和跟踪等工具。

Deno 提供以下功能：

- 使用 OpenTelemetry 协议将收集到的指标、跟踪和日志导出到服务器。
- [Deno 运行时的自动仪器化](#auto-instrumentation)，提供 OpenTelemetry 指标、跟踪和日志。
- [收集用户定义的指标、跟踪和日志](#user-metrics)，通过 `npm:@opentelemetry/api` 包创建。

## 快速开始

要启用 OpenTelemetry 集成，请使用 `--unstable-otel` 标志运行 Deno 脚本，并设置环境变量 `OTEL_DENO=true`：

```sh
OTEL_DENO=true deno run --unstable-otel my_script.ts
```

这将自动收集并导出运行时可观察性数据到 `localhost:4318` 的 OpenTelemetry 端点，使用 Protobuf 通过 HTTP (`http/protobuf`)。

:::tip

如果您还没有设置 OpenTelemetry 收集器，可以通过运行以下命令开始使用
[本地 LGTM 堆栈的 Docker](https://github.com/grafana/docker-otel-lgtm/tree/main?tab=readme-ov-file)
（Loki（日志）、Grafana（仪表板）、Tempo（跟踪）和 Mimir（指标））：

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
	-e GF_PATHS_DATA=/data/grafana \
	docker.io/grafana/otel-lgtm:0.8.1
```

然后，您可以通过用户名 `admin` 和密码 `admin` 在 `http://localhost:3000` 访问 Grafana 仪表板。

:::

这将自动收集并导出运行时可观察性数据，如 `console.log`、HTTP 请求的跟踪和 Deno 运行时的指标。
[了解更多关于自动仪器化的信息](#auto-instrumentation)。

您还可以使用 `npm:@opentelemetry/api` 包创建自己的指标、跟踪和日志。
[了解更多关于用户定义的指标](#user-metrics)。

## 自动仪器化

Deno 自动收集并将一些可观察性数据导出到 OTLP 端点。

这些数据以 Deno 运行时的内置仪器化范围导出。
该范围名称为 `deno`。Deno 运行时的版本是 `deno` 仪器化范围的版本（例如 `deno:2.1.4`）。

### 跟踪

Deno 自动为各种操作创建跨度，例如：

- 通过 `Deno.serve` 提供的传入 HTTP 请求。
- 使用 `fetch` 发出的传出 HTTP 请求。

#### `Deno.serve`

当您使用 `Deno.serve` 创建 HTTP 服务器时，将为每个传入请求创建一个跨度。该跨度在响应头发送时自动结束（而不是响应体发送完成时结束）。

创建的跨度名称为 `${method}`。跨度类型为 `server`。

创建时会自动添加以下属性到跨度：

- `http.request.method`: 请求的 HTTP 方法。
- `url.full`: 请求的完整 URL（如 `req.url` 所报告）。
- `url.scheme`: 请求 URL 的协议（例如 `http` 或 `https`）。
- `url.path`: 请求 URL 的路径。
- `url.query`: 请求 URL 的查询字符串。

在请求处理后，会添加以下属性：

- `http.status_code`: 响应的状态码。

Deno 不会自动将 `http.route` 属性添加到跨度，因为路由在运行时并不为所知，而是根据用户的处理函数中的路由逻辑确定。如果您想将 `http.route` 属性添加到跨度，可以在处理函数中使用 `npm:@opentelemetry/api` 来实现。在这种情况下，您还应该更新跨度名称以包括路由。

```ts
import { trace } from "npm:@opentelemetry/api@1";

const INDEX_ROUTE = new URLPattern({ pathname: "/" });
const BOOK_ROUTE = new URLPattern({ pathname: "/book/:id" });

Deno.serve(async (req) => {
  const span = trace.getActiveSpan();
  if (INDEX_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/");
    span.updateName(`${req.method} /`);

    // 处理索引路由
  } else if (BOOK_ROUTE.test(req.url)) {
    span.setAttribute("http.route", "/book/:id");
    span.updateName(`${req.method} /book/:id`);

    // 处理书本路由
  } else {
    return new Response("未找到", { status: 404 });
  }
});
```

#### `fetch`

当您使用 `fetch` 发出 HTTP 请求时，将为该请求创建一个跨度。
该跨度在收到响应头时自动结束。

创建的跨度名称为 `${method}`。跨度类型为 `client`。

创建时会自动添加以下属性到跨度：

- `http.request.method`: 请求的 HTTP 方法。
- `url.full`: 请求的完整 URL。
- `url.scheme`: 请求 URL 的协议。
- `url.path`: 请求 URL 的路径。
- `url.query`: 请求 URL 的查询字符串。

在收到响应后，会添加以下属性：

- `http.status_code`: 响应的状态码。

### 指标

以下指标会自动收集和导出：

_尚未定义_

### 日志

以下日志会自动收集和导出：

- 使用 `console.*` 方法（如 `console.log` 和 `console.error`）创建的任何日志。
- Deno 运行时生成的任何日志，例如调试日志、`Downloading` 日志等。
- 导致 Deno 运行时退出的任何错误（包括用户代码和运行时本身的错误）。

如果日志发生在活动跨度内，来自 JavaScript 代码的日志将与相关的跨度上下文一起导出。

`console` 的自动仪器化可以通过 `OTEL_DENO_CONSOLE` 环境变量进行配置：

- `capture`: 日志被发送到 stdout/stderr，并且也与 OpenTelemetry 一起导出。（默认值）
- `replace`: 日志仅与 OpenTelemetry 一起导出，而不会发送到 stdout/stderr。
- `ignore`: 日志仅发送到 stdout/stderr，并且不会与 OpenTelemetry 一起导出。

## 用户指标

除了自动收集的遥测数据外，您还可以使用 `npm:@opentelemetry/api` 包创建自己的指标和跟踪。

您不需要配置 `npm:@opentelemetry/api` 包以便与 Deno 一起使用。当传递 `--unstable-otel` 标志时，Deno 会自动设置 `npm:@opentelemetry/api` 包。无需调用 `metrics.setGlobalMeterProvider()`、`trace.setGlobalTracerProvider()` 或 `context.setGlobalContextManager()`。所有资源、导出器设置等的配置通过环境变量完成。

Deno 适配 `npm:@opentelemetry/api` 包的 `1.x` 版本。您可以直接从 `npm:@opentelemetry/api@1` 导入，也可以使用 `deno add` 本地安装该包并从 `@opentelemetry/api` 导入。

```sh
deno add npm:@opentelemetry/api@1
```

对于跟踪和指标，您需要分别为追踪器和计量器定义名称。如果您正在对库进行仪器化，您应该将追踪器或计量器命名为该库的名称（例如 `my-awesome-lib`）。如果您正在对应用程序进行仪器化，您应该将追踪器或计量器命名为该应用程序的名称（例如 `my-app`）。追踪器或计量器的版本应设置为库或应用程序的版本。

### 跟踪

要创建新的跨度，首先从 `npm:@opentelemetry/api` 导入 `trace` 对象，并创建一个新的追踪器：

```ts
import { trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");
```

然后，使用 `tracer.startActiveSpan` 方法创建新的跨度，并传递一个回调函数。您必须通过调用由 `startActiveSpan` 返回的跨度对象上的 `end` 方法手动结束跨度。

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

`span.end()` 应该在 `finally` 块中调用，以确保即使发生错误也能结束跨度。`span.recordException` 和 `span.setStatus` 也应该在 `catch` 块中被调用，以记录发生的错误。

在回调函数内部，创建的跨度是“活动跨度”。您可以使用 `trace.getActiveSpan()` 获取活动跨度。这个“活动跨度”将被用作在回调函数内创建的任何跨度（无论是手动创建的，还是由运行时自动创建的）的父跨度。
[了解更多关于上下文传播的信息](#context-propagation)。

`startActiveSpan` 方法返回回调函数的返回值。

在跨度的生命周期内，可以向其添加属性。属性是表示跨度结构化元数据的键值对。可以使用跨度对象上的 `setAttribute` 和 `setAttributes` 方法添加属性。

```ts
span.setAttribute("key", "value");
span.setAttributes({ success: true, "bar.count": 42n, "foo.duration": 123.45 });
```

属性的值可以是字符串、数字（浮点数）、大整型（限制为 u64）、布尔值或这些类型的数组。如果属性值不属于这些类型，它将被忽略。

可以使用跨度对象上的 `updateName` 方法更新跨度的名称。

```ts
span.updateName("新名称");
```

可以使用跨度对象上的 `setStatus` 方法设置跨度的状态。`recordException` 方法可用于记录在跨度的生命周期内发生的异常。`recordException` 创建一个包含异常堆栈跟踪和名称的事件，并将其附加到跨度上。**`recordException` 不会将跨度状态设置为 `ERROR`，您必须手动执行此操作。**

```ts
import { SpanStatusCode } from "npm:@opentelemetry/api@1";

span.setStatus({
  code: SpanStatusCode.ERROR,
  message: "发生错误",
});
span.recordException(new Error("发生错误"));

// 或者

span.setStatus({
  code: SpanStatusCode.OK,
});
```

跨度还可以添加
[事件](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addEvent)
和
[链接](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addLink) 。事件是在与跨度相关的时间点。链接是对其他跨度的引用。

还可以使用 `tracer.startSpan` 手动创建跨度，该方法返回一个跨度对象。此方法不会将创建的跨度设置为活动跨度，因此它不会自动作为任何后续创建的跨度或任何 `console.log` 调用的父跨度。可以通过使用 [上下文传播 API](#context-propagation) 手动将跨度设置为活动跨度。

`tracer.startActiveSpan` 和 `tracer.startSpan` 都可以使用一个可选的选项包，包含以下任意属性：

- `kind`：跨度的类型。可以是 `SpanKind.CLIENT`、`SpanKind.SERVER`、`SpanKind.PRODUCER`、`SpanKind.CONSUMER` 或 `SpanKind.INTERNAL`。默认为 `SpanKind.INTERNAL`。
- `startTime`：表示跨度开始时间的 `Date` 对象，或表示 Unix 纪元以来的毫秒数的数字。如果未提供，将使用当前时间。
- `attributes`: 包含要添加到跨度的属性的对象。
- `links`: 要添加到跨度的链接数组。
- `root`: 一个布尔值，指示跨度是否应该是根跨度。如果为 `true`，则该跨度将没有父跨度（即使存在活动跨度）。

在选项包之后，`tracer.startActiveSpan` 和 `tracer.startSpan` 还可以接受来自 [上下文传播 API](#context-propagation) 的 `context` 对象。

在
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.TraceAPI.html) 中了解有关完整追踪 API 的更多信息。

### 指标

要创建一个指标，首先从 `npm:@opentelemetry/api` 导入 `metrics` 对象，并创建一个新的计量器：

```ts
import { metrics } from "npm:@opentelemetry/api@1";

const meter = metrics.getMeter("my-app", "1.0.0");
```

然后，可以从计量器创建一个仪器，并用其记录值：

```ts
const counter = meter.createCounter("my_counter", {
  description: "一个简单的计数器",
  unit: "1",
});

counter.add(1);
counter.add(2);
```

每次记录也可以具有相关属性：

```ts
counter.add(1, { color: "red" });
counter.add(2, { color: "blue" });
```

:::tip

在 OpenTelemetry 中，指标属性通常应具有低基数。这意味着不应有太多唯一的属性值组合。例如，用户所在的大陆的属性可能是可以接受的，但用户的确切纬度和经度属性则基数过高。高基数的属性可能会造成指标存储和导出的困难，应该避免。使用跨度和日志处理高基数数据。

:::

可以使用计量器创建几种类型的仪器：

- **计数器**：计数器是一个单调递增的值。计数器只能是正值。它们可用于始终递增的值，例如处理的请求数。

- **UpDownCounter**：上下计数器是一个可以增加和减少的值。上下计数器可用于可以增加和减少的值，例如活动连接数或正在进行的请求数。

- **仪表**：仪表是可以设置为任意值的值。它们用于在任意给定时间具有特定值的值，例如当前温度。

- **直方图**：直方图是以值的分布形式记录的值。直方图可用于不仅是单个数字的值，而是数字的分布，例如以毫秒为单位的请求响应时间。直方图可用于计算百分位数、平均值和其他统计数据。它们具有定义要放入的桶的预定义边界。默认情况下，边界为 `[0.0, 5.0, 10.0, 25.0, 50.0, 75.0, 100.0, 250.0, 500.0, 750.0, 1000.0, 2500.0, 5000.0, 7500.0, 10000.0]`。

还有几种类型的可观察仪器。这些仪器没有同步记录方法，而是返回一个可以调用以记录值的回调。当 OpenTelemetry SDK 准备好记录一个值时，例如在导出之前，将调用该回调。

```ts
const counter = meter.createObservableCounter("my_counter", {
  description: "一个简单的计数器",
  unit: "1",
});
counter.addCallback((res) => {
  res.observe(1);
  // 或
  res.observe(1, { color: "red" });
});
```

有三种类型的可观察仪器：

- **ObservableCounter**：可观察计数器是可以异步观察的计数器。它可用于始终递增的值，例如处理的请求数。
- **ObservableUpDownCounter**：可观察上下计数器是一个值，可以同时增加和减少，并且可以被异步观察。上下计数器可用于可以增加和减少的值，例如活动连接数或正在进行的请求数。
- **ObservableGauge**：可观察仪表是可以设置为任何值的值，并且可以被异步观察。它们用于在任意给定时间具有特定值的值，例如当前温度。

了解有关完整指标 API 的更多信息，请参考
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.MetricsAPI.html)。

## 上下文传播

在 OpenTelemetry 中，上下文传播是将某些上下文信息（例如当前跨度）从应用程序的一部分传递到另一部分的过程，而不必将其明确地作为参数传递给每个函数。

在 Deno 中，上下文传播使用 `AsyncContext` 的规则进行，`AsyncContext` 是 TC39 提案，用于异步上下文传播。`AsyncContext` API 尚未在 Deno 中向用户公开，但它在内部用于在异步边界之间传播活动跨度和其他上下文信息。

以下是 AsyncContext 传播工作的快速概述：

- 当启动新的异步任务时（例如 promise 或定时器），当前上下文会被保存。
- 然后可以与异步任务并发执行一些其他代码，使用不同的上下文。
- 当异步任务完成时，将恢复保存的上下文。

这意味着异步上下文传播本质上表现得像一个作用于当前异步任务的全局变量，并且会自动复制到从该当前任务启动的任何新异步任务。

`npm:@opentelemetry/api@1` 中的 `context` API 将此功能公开给用户。工作方式如下：

```ts
import { context } from "npm:@opentelemetry/api@1";

// 获取当前活动上下文
const currentContext = context.active();

// 您可以创建一个新上下文，并添加一个值
const newContext = currentContext.setValue("id", 1);

// 调用 setValue 不会改变当前上下文
console.log(currentContext.getValue("id")); // undefined

// 您可以在新上下文中运行一个函数
context.with(newContext, () => {
  // 此代码块中的任何代码将以新上下文运行
  console.log(context.active().getValue("id")); // 1

  // 此上下文在从此块调用的任何函数中也可用
  function myFunction() {
    return context.active().getValue("id");
  }
  console.log(myFunction()); // 1

  // 也可在此处安排的任何异步回调中使用
  setTimeout(() => {
    console.log(context.active().getValue("id")); // 1
  }, 10);
});

// 在外部，上下文仍然是相同的
console.log(context.active().getValue("id")); // undefined
```

上下文 API 也与跨度集成。例如，要在特定跨度的上下文中运行一个函数，可以将跨度添加到上下文中，然后在该上下文中运行该函数：

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

了解有关完整上下文 API 的更多信息，请参考
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.ContextAPI.html)。

## 配置

通过设置 `OTEL_DENO=true` 环境变量，可以启用 OpenTelemetry 集成。

OTLP 导出器的端点和协议可以使用 `OTEL_EXPORTER_OTLP_ENDPOINT` 和 `OTEL_EXPORTER_OTLP_PROTOCOL` 环境变量进行配置。

如果端点需要身份验证，可以使用 `OTEL_EXPORTER_OTLP_HEADERS` 环境变量配置头。

还可以通过使用特定的环境变量独立覆盖指标、跟踪和日志的端点，例如：

- `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT`
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`
- `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT`

有关可以用来配置 OTLP 导出器的头部的更多信息，请[参见 OpenTelemetry 网站](https://opentelemetry.io/docs/specs/otel/protocol/exporter/#configuration-options)。

与遥测数据关联的资源可以通过 `OTEL_SERVICE_NAME` 和 `OTEL_RESOURCE_ATTRIBUTES` 环境变量进行配置。除了通过 `OTEL_RESOURCE_ATTRIBUTES` 环境变量设置的属性外，以下属性会自动设置：

- `service.name`: 如果 `OTEL_SERVICE_NAME` 未设置，则该值设置为 `<unknown_service>`。
- `process.runtime.name`: `deno`
- `process.runtime.version`: Deno 运行时的版本。
- `telemetry.sdk.name`: `deno-opentelemetry`
- `telemetry.sdk.language`: `deno-rust`
- `telemetry.sdk.version`: Deno 运行时的版本，加上 Deno 正在使用的 `opentelemetry` Rust crate 的版本，以 `-` 分隔。

可以使用 `OTEL_METRIC_EXPORT_INTERVAL` 环境变量配置指标收集频率。默认值为 `60000` 毫秒（60 秒）。

可以使用批量跨度处理器环境变量配置跨度导出器的批处理，这些变量在
[OpenTelemetry 规范](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-span-processor) 中描述。

可以使用批量日志记录处理器环境变量配置日志导出器的批处理，这些变量在
[OpenTelemetry 规范](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-log-record-processor) 中描述。

## 限制

虽然 Deno 的 OpenTelemetry 集成正在开发中，但需要注意一些限制：

- 跟踪总是会被采样（即 `OTEL_TRACE_SAMPLER=parentbased_always_on`）。
- 跟踪不支持事件和链接。
- 在 `Deno.serve` 和 `fetch` 中上下文的自动传播不受支持。
- 不支持指标示例。
- 不支持自定义日志流（例如，非 `console.log` 和 `console.error` 的日志）。
- 只支持 OTLP 导出器 - 不支持其他导出器。
- 仅支持 `http/protobuf` 和 `http/json` 协议用于 OTLP。不支持其他协议，例如 `grpc`。
- 观察（异步）仪表的指标在进程退出/崩溃时不会被收集，因此最后的指标值可能不会被导出。同步指标在进程退出/崩溃时会导出。
- `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT`、 `OTEL_ATTRIBUTE_COUNT_LIMIT`、 `OTEL_SPAN_EVENT_COUNT_LIMIT`、 `OTEL_SPAN_LINK_COUNT_LIMIT`、 `OTEL_EVENT_ATTRIBUTE_COUNT_LIMIT` 和 `OTEL_LINK_ATTRIBUTE_COUNT_LIMIT` 环境变量中指定的限制不适用于跟踪跨度。
- `OTEL_METRIC_EXPORT_TIMEOUT` 环境变量不被尊重。
- 不认识的 HTTP 方法在 `http.request.method` 跨度属性中不会被标准化为 `_OTHER`，这与 OpenTelemetry 的语义约定相符。
- `Deno.serve` 的 HTTP 服务器跨度没有设置 OpenTelemetry 状态，如果处理程序抛出错误（即调用 `onError`），则该跨度不会设置错误状态，且错误不会通过事件附加到跨度。
- 没有机制将 `http.route` 属性添加到 `fetch` 的 HTTP 客户端跨度，或更新跨度名称以包含路由。
