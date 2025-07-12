---
title: OpenTelemetry
description: "学习如何在 Deno 应用程序中使用 OpenTelemetry 实现可观察性。涵盖追踪、指标收集和与监控系统的集成。"
---

Deno 内置支持 [OpenTelemetry](https://opentelemetry.io/)。

> OpenTelemetry 是一组 API、SDK 和工具。使用它来对软件进行仪器化，生成、收集和导出遥测数据（指标、日志和追踪）以帮助您分析软件的性能和行为。
>
> <i>- https://opentelemetry.io/</i>

此集成让您能够使用 OpenTelemetry 的可观察性工具（如日志、指标和追踪）来监控您的 Deno 应用程序。

Deno 提供以下功能：

- 使用 OpenTelemetry 协议，将收集的指标、追踪和日志导出到服务器。
- 对 Deno 运行时进行[自动仪器化](#自动仪器化)，采集 OpenTelemetry 的指标、追踪和日志。
- [收集使用 `npm:@opentelemetry/api` 包创建的用户自定义指标、追踪和日志](#用户指标)。

## 快速开始

要启用 OpenTelemetry 集成，请设置环境变量 `OTEL_DENO=true`：

```sh
OTEL_DENO=true deno run my_script.ts
```

这将自动收集并通过 HTTP 的 Protobuf 格式（`http/protobuf`）将运行时可观察性数据导出到 `localhost:4318` 的 OpenTelemetry 端点。

:::tip

如果您还未搭建 OpenTelemetry 收集器，可以使用以下命令快速启动 [Docker 中的本地 LGTM 堆栈](https://github.com/grafana/docker-otel-lgtm/tree/main?tab=readme-ov-file)（Loki（日志）、Grafana（仪表盘）、Tempo（追踪）和 Prometheus（指标））：

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
	-e GF_PATHS_DATA=/data/grafana \
	docker.io/grafana/otel-lgtm:0.8.1
```

然后，您可以使用用户名 `admin` 和密码 `admin` 登录 Grafana 仪表盘，地址为 `http://localhost:3000`。

:::

这将自动收集并导出运行时的可观察性数据，例如 `console.log`、HTTP 请求的追踪和 Deno 运行时指标。
[了解更多关于自动仪器化的信息](#自动仪器化)。

您也可以使用 `npm:@opentelemetry/api` 包创建自己的指标、追踪和日志。
[了解更多关于用户定义的指标](#用户指标)。

## 自动仪器化

Deno 会自动收集并将部分可观察性数据导出到 OTLP 端点。

这些数据通过名为 `deno` 的内置仪器化范围导出，该范围名称为 `deno`，版本即 Deno 运行时的版本。例如，`deno:2.1.4`。

### 追踪

Deno 会自动为多种操作创建跨度，例如：

- 使用 `Deno.serve` 提供的传入 HTTP 请求。
- 使用 `fetch` 发出的传出 HTTP 请求。

#### `Deno.serve`

当您使用 `Deno.serve` 创建 HTTP 服务器时，系统会为每个传入请求创建一个跨度。该跨度在响应头发送时自动结束（而非等待响应体完全发送）。

创建的跨度名称为 `${method}`，跨度类型为 `server`。

创建跨度时自动添加如下属性：

- `http.request.method`：请求的 HTTP 方法。
- `url.full`：请求的完整 URL（等同于 `req.url`）。
- `url.scheme`：请求 URL 的协议（例如 `http` 或 `https`）。
- `url.path`：请求 URL 的路径部分。
- `url.query`：请求 URL 的查询字符串。

请求处理完成后，会添加下列属性：

- `http.response.status_code`：响应的状态码。

Deno 不会自动向跨度添加 `http.route` 属性，因为运行时无法知道路由细节，路由由用户处理函数中的逻辑决定。如需添加 `http.route`，请在处理函数中使用 `npm:@opentelemetry/api` 设置该属性，同时建议更新跨度名称以包含路由信息。

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

当您使用 `fetch` 发出请求时，系统会为该请求创建一个跨度，且在收到响应头时自动结束。

创建的跨度名称为 `${method}`，跨度类型为 `client`。

创建跨度时自动添加如下属性：

- `http.request.method`：请求的 HTTP 方法。
- `url.full`：请求的完整 URL。
- `url.scheme`：请求 URL 的协议。
- `url.path`：请求 URL 的路径部分。
- `url.query`：请求 URL 的查询字符串。

收到响应后，添加以下属性：

- `http.status_code`：响应的状态码。

### 指标

自动收集和导出的指标包括：

#### `Deno.serve` / `Deno.serveHttp`

##### `http.server.request.duration`

一个直方图，记录通过 `Deno.serve` 或 `Deno.serveHttp` 提供的传入 HTTP 请求的持续时间。测量时间为从请求接收至响应头发送的时间，不包含发送响应体的时间。单位为秒。该直方图的桶边界为：
`[0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0]`。

该指标记录以下属性：

- `http.request.method`：请求的 HTTP 方法。
- `url.scheme`：请求 URL 的协议。
- `network.protocol.version`：请求所使用的 HTTP 协议版本（例如 `1.1` 或 `2`）。
- `server.address`：服务器监听的地址。
- `server.port`：服务器监听的端口。
- `http.response.status_code`：响应状态码（请求无致命错误时）。
- `error.type`：发生的错误类型（请求处理出现错误时）。

##### `http.server.active_requests`

一个量表，统计任意时刻由 `Deno.serve` 或 `Deno.serveHttp` 正在处理的活动请求数量，即已接收但尚未发送响应头的请求数。该指标记录以下属性：

- `http.request.method`：请求的 HTTP 方法。
- `url.scheme`：请求 URL 的协议。
- `server.address`：服务器监听的地址。
- `server.port`：服务器监听的端口。

##### `http.server.request.body.size`

一个直方图，记录传入 HTTP 请求的请求体大小，单位为字节。直方图桶边界为：
`[0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]`。

记录属性：

- `http.request.method`：请求的 HTTP 方法。
- `url.scheme`：请求 URL 的协议。
- `network.protocol.version`：请求所使用的 HTTP 协议版本。
- `server.address`：服务器监听的地址。
- `server.port`：服务器监听的端口。
- `http.response.status_code`：响应状态码（无致命错误时）。
- `error.type`：错误类型（处理异常时）。

##### `http.server.response.body.size`

一个直方图，记录传入 HTTP 请求的响应体大小，单位为字节。直方图桶边界同请求体大小指标。

记录属性：

- `http.request.method`：请求的 HTTP 方法。
- `url.scheme`：请求 URL 的协议。
- `network.protocol.version`：请求所使用的 HTTP 协议版本。
- `server.address`：服务器监听的地址。
- `server.port`：服务器监听的端口。
- `http.response.status_code`：响应状态码（无致命错误时）。
- `error.type`：错误类型（处理异常时）。

### 日志

自动收集并导出的日志包括：

- 使用 `console.*` 方法（如 `console.log`、`console.error`）产生的任意日志。
- 由 Deno 运行时产生的日志，如调试日志、下载日志等。
- 导致 Deno 运行时退出的任何错误（无论来自用户代码还是运行时本身）。

在 JavaScript 代码中发生的日志会携带相关的跨度上下文（如果日志发生在活跃跨度内）。

`console` 自动仪器化可以通过环境变量 `OTEL_DENO_CONSOLE` 配置：

- `capture`：日志既会输出到 stdout/stderr，也会被导出到 OpenTelemetry。（默认）
- `replace`：日志不输出到 stdout/stderr，只有导出到 OpenTelemetry。
- `ignore`：日志只输出到 stdout/stderr，不导出到 OpenTelemetry。

## 用户指标

除自动收集的遥测数据外，您还可以使用 `npm:@opentelemetry/api` 包创建自己的指标和追踪。

您无需特别配置 `npm:@opentelemetry/api` 包以便在 Deno 中使用，Deno 会自动完成配置。无需调用 `metrics.setGlobalMeterProvider()`、
`trace.setGlobalTracerProvider()` 或 `context.setGlobalContextManager()`。所有资源配置、导出设置等均通过环境变量实现。

Deno 与版本 `1.x` 的 `npm:@opentelemetry/api` 包兼容。您既可以直接从 `npm:@opentelemetry/api@1` 导入，也可以使用 `deno add` 本地安装该包后由 `@opentelemetry/api` 导入。

```sh
deno add npm:@opentelemetry/api@1
```

在追踪和指标中，您需要为跟踪器和仪表分别命名。如果您为库做仪器化，应使用库名（如 `my-awesome-lib`）；如果为应用程序做仪器化，应使用应用名（如 `my-app`）。版本应设置为库或应用的版本。

### 追踪

要创建新跨度，先从 `npm:@opentelemetry/api` 导入 `trace` 并获取一个跟踪器：

```ts
import { trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");
```

之后使用 `tracer.startActiveSpan` 创建一个新的跨度并传入回调。需在回调中手动调用 `span.end()` 结束该跨度。

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

应在 `finally` 中调用 `span.end()` 以保证跨度结束，无论是否发生异常。异常时调用 `span.recordException` 和 `span.setStatus` 以便于记录。

在回调内部，创建的跨度是“活动跨度”，可使用 `trace.getActiveSpan()` 访问。此“活动跨度”在回调及其调用函数内使用时会作为父跨度。
[了解更多关于上下文传播的信息](#上下文传播)。

`startActiveSpan` 返回回调函数的返回值。

在跨度生命周期内，您可以调用 `setAttribute` 和 `setAttributes` 添加属性，即结构化元数据键值对。

```ts
span.setAttribute("key", "value");
span.setAttributes({ success: true, "bar.count": 42n, "foo.duration": 123.45 });
```

属性值支持字符串、数字（浮点）、大整数（限制为 u64）、布尔值，或者这些类型的数组。其它类型会被忽略。

可以用 `updateName` 方法更改跨度名称：

```ts
span.updateName("new name");
```

且可用 `setStatus` 设置跨度状态。`recordException` 用于记录生命周期内的异常，创建带堆栈跟踪和名称的事件附加到跨度。**`recordException` 不会设置状态为 `ERROR`，需手动调用 `setStatus`**。

```ts
import { SpanStatusCode } from "npm:@opentelemetry/api@1";

span.setStatus({
  code: SpanStatusCode.ERROR,
  message: "发生了一个错误",
});
span.recordException(new Error("发生了一个错误"));

// 或

span.setStatus({
  code: SpanStatusCode.OK,
});
```

跨度还可添加
[事件](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addEvent)
和
[链接](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html#addLink)。
事件是在某时间点与跨度关联的标记。链接则是对其它跨度的引用。

```ts
// 向跨度添加事件
span.addEvent("button_clicked", {
  id: "submit-button",
  action: "submit",
});

// 带时间戳的事件
span.addEvent("process_completed", { status: "success" }, Date.now());
```

事件可包含类似于跨度的可选属性。它们用于标记跨度生命周期内重要时刻，无需创建额外跨度。

您也可以用 `tracer.startSpan` 手动创建跨度，该方法返回跨度对象。此方法不会设置创建的跨度为活动跨度，故后续创建的跨度或 `console.log` 不会自动继承它。可配合 [上下文传播 API](#上下文传播) 手动将此跨度设置为活动跨度。

`tracer.startActiveSpan` 和 `tracer.startSpan` 可接受含以下任意属性的选项参数：

- `kind`：跨度类型。可为 `SpanKind.CLIENT`、`SpanKind.SERVER`、`SpanKind.PRODUCER`、`SpanKind.CONSUMER` 或 `SpanKind.INTERNAL`。默认 `SpanKind.INTERNAL`。
- `startTime`：代表跨度开始的时间，可是 `Date` 对象或 unix 毫秒数。不提供则默认为当前时间。
- `attributes`：要添加的属性对象。
- `links`：要添加的链接数组。
- `root`：布尔值，若为 `true`，跨度即为根跨度（无父跨度），即使存在活动跨度。

另外，两者在选项参数后还能接受 [上下文传播 API](#上下文传播) 的 `context` 参数。

完整追踪 API 请查阅
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.TraceAPI.html)。

### 指标

创建指标时，先从 `npm:@opentelemetry/api` 导入 `metrics`，并获取指标仪表：

```ts
import { metrics } from "npm:@opentelemetry/api@1";

const meter = metrics.getMeter("my-app", "1.0.0");
```

然后用仪表创建仪器，用于记录数值：

```ts
const counter = meter.createCounter("my_counter", {
  description: "一个简单的计数器",
  unit: "1",
});

counter.add(1);
counter.add(2);
```

记录时也可附带属性：

```ts
counter.add(1, { color: "red" });
counter.add(2, { color: "blue" });
```

:::tip

OpenTelemetry 中建议指标属性保持低基数，即属性值的唯一组合数量不宜过多。例如，用户所属洲的属性是低基数，但用户的精确经纬度则属于高基数。高基数属性可能导致指标存储与导出问题，推荐通过跨度和日志处理高基数数据。

:::

常见仪器类型：

- **计数器**：单调递增的数值，只能增加。适合计数处理请求数等。
- **上下计数器**：可增可减，适合表示活动连接数、进行中请求数。
- **仪表**：可以任意设置值，适合非累积值，如当前温度。
- **直方图**：记录数值分布。例如请求响应时间（毫秒），用于计算百分位、平均等统计。预定义桶边界默认为 `[0.0, 5.0, 10.0, 25.0, 50.0, 75.0, 100.0, 250.0, 500.0, 750.0, 1000.0, 2500.0, 5000.0, 7500.0, 10000.0]`。

还有几类可观察（异步）仪器，没有同步记录方法，而是提供回调用于异步上报值，OpenTelemetry SDK 在导出前调用回调。

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

可观察仪器包含：

- **可观察计数器**：异步观察的单调递增计数器。
- **可观察上下计数器**：异步观察的可增可减计数器。
- **可观察仪表**：异步观察的可任意设置值仪表。

完整指标 API 请参阅
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.MetricsAPI.html)。

### 实用示例

欲了解在 Deno 应用中实现 OpenTelemetry 的示例教程，请参考：

- [基本 OpenTelemetry 教程](/examples/basic_opentelemetry_tutorial/) - 简单 HTTP 服务器，实现自定义指标与追踪
- [分布式追踪教程](/examples/otel_span_propagation_tutorial/) - 展示跨服务边界追踪技术

## 上下文传播

OpenTelemetry 中，上下文传播是将上下文信息（如当前跨度）从程序一部分无须显式参数传递到另一部分的机制。

Deno 依据 TC39 关于异步上下文传播的提议，使用 `AsyncContext` 规则实现上下文传播。`AsyncContext` API 当前尚未面向 Deno 用户公开，但内部用于跨异步边界传播活跃跨度及其他上下文。

简要介绍传播机制：

- 新异步任务启动（如 Promise、定时器）时保存当前上下文。
- 其它代码可并发运行在不同上下文中。
- 当异步任务完成时恢复保存的上下文。

该机制本质上表现为：异步任务范围内的全局变量自动复制到后续启动的异步任务。

用户可通过 `npm:@opentelemetry/api@1` 的 `context` API 访问此功能：

```ts
import { context } from "npm:@opentelemetry/api@1";

// 获取当前活动上下文
const currentContext = context.active();

// 创建新的上下文并设值
const newContext = currentContext.setValue("id", 1);

// 设值不改变当前上下文
console.log(currentContext.getValue("id")); // undefined

// 在新上下文内执行
context.with(newContext, () => {
  console.log(context.active().getValue("id")); // 1

  function myFunction() {
    return context.active().getValue("id");
  }
  console.log(myFunction()); // 1

  setTimeout(() => {
    console.log(context.active().getValue("id")); // 1
  }, 10);
});

// 外部上下文未变
console.log(context.active().getValue("id")); // undefined
```

上下文 API 与跨度集成，您可以将跨度装入上下文并在上下文中执行函数：

```ts
import { context, trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("my-app", "1.0.0");

const span = tracer.startSpan("myFunction");
const contextWithSpan = trace.setSpan(context.active(), span);

context.with(contextWithSpan, () => {
  const activeSpan = trace.getActiveSpan();
  console.log(activeSpan === span); // true
});

// 记得结束跨度！
span.end();
```

完整上下文 API 请参阅
[OpenTelemetry JS API 文档](https://open-telemetry.github.io/opentelemetry-js/classes/_opentelemetry_api.ContextAPI.html)。

## 配置

通过设置环境变量 `OTEL_DENO=true` 启用 OpenTelemetry 集成。

OTLP 导出端点和协议可通过环境变量 `OTEL_EXPORTER_OTLP_ENDPOINT` 和 `OTEL_EXPORTER_OTLP_PROTOCOL` 配置。

若端点需要身份验证，可使用环境变量 `OTEL_EXPORTER_OTLP_HEADERS` 设置请求头。

指标、追踪和日志导出的端点也可用以下专用变量分别覆盖，例如：

- `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT`
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`
- `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT`

有关 OTLP 头部配置详情，请参考 [OpenTelemetry 官网](https://opentelemetry.io/docs/specs/otel/protocol/exporter/#configuration-options)。

遥测数据关联的资源属性通过环境变量 `OTEL_SERVICE_NAME` 和 `OTEL_RESOURCE_ATTRIBUTES` 配置。除 `OTEL_RESOURCE_ATTRIBUTES` 设置的属性外，自动添加：

- `service.name`：未设置 `OTEL_SERVICE_NAME` 时值为 `<unknown_service>`。
- `process.runtime.name`：`deno`。
- `process.runtime.version`：Deno 运行时版本。
- `telemetry.sdk.name`：`deno-opentelemetry`。
- `telemetry.sdk.language`：`deno-rust`。
- `telemetry.sdk.version`：Deno 版本与使用的 `opentelemetry` Rust crate 版本，通过 `-` 连接。

传播器可通过 `OTEL_PROPAGATORS` 环境变量配置，默认值为 `tracecontext,baggage`，用逗号分隔多项，目前支持：

- `tracecontext`：W3C Trace Context 格式。
- `baggage`：W3C Baggage 格式。

指标收集频率使用 `OTEL_METRIC_EXPORT_INTERVAL` 配置，默认 60000 毫秒（60 秒）。

跨度导出批处理配置参考
[OpenTelemetry 规范](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-span-processor)。

日志导出批处理配置参考
[OpenTelemetry 规范](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/#batch-log-record-processor)。

## 传播器

Deno 支持上下文传播器，用以自动跨进程边界传播追踪上下文，实现分布式追踪，跟踪请求在服务链中流转。

传播器负责在载体中编码（如 HTTP 头）并解码上下文信息（如追踪与跨度 ID），从而实现服务间追踪上下文传递。

默认支持以下传播器：

- `tracecontext`：W3C Trace Context 传播格式，是 HTTP 头传播追踪上下文的标准方式。
- `baggage`：W3C Baggage 格式，允许跨服务传递键值对。

:::note

这些传播器会自动与 Deno 的 `fetch` 和 `Deno.serve` 配合，使 HTTP 请求可以端到端自动传播追踪上下文，无需手动管理。

:::

您可以通过 `@opentelemetry/api` 包访问传播 API：

```ts
import { context, propagation, trace } from "npm:@opentelemetry/api@1";

// 从传入 HTTP 头提取上下文
function extractContextFromHeaders(headers: Headers) {
  const ctx = context.active();
  return propagation.extract(ctx, headers);
}

// 向传出 HTTP 头注入上下文
function injectContextIntoHeaders(headers: Headers) {
  const ctx = context.active();
  propagation.inject(ctx, headers);
  return headers;
}

// 示例：进行带有传播追踪上下文的 fetch 请求
async function tracedFetch(url: string) {
  const headers = new Headers();
  injectContextIntoHeaders(headers);

  return await fetch(url, { headers });
}
```

## 限制

Deno 的 OpenTelemetry 集成仍在开发中，存在以下限制：

- 追踪始终被采样（即 `OTEL_TRACE_SAMPLER=parentbased_always_on`）。
- 追踪只支持无属性的链接。
- 不支持指标采样。
- 不支持自定义日志流（仅支持 `console.log` 和 `console.error` 日志）。
- 唯一支持的导出器是 OTLP，其他导出器未支持。
- OTLP 仅支持 `http/protobuf` 和 `http/json` 协议，不支持 `grpc` 等。
- 可观察（异步）仪表采集的指标在进程退出或崩溃时不会被采集，故最后指标可能未导出。同步指标可正常导出。
- 追踪跨度不遵守环境变量中指定的 `OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT`、`OTEL_ATTRIBUTE_COUNT_LIMIT`、`OTEL_SPAN_EVENT_COUNT_LIMIT`、`OTEL_SPAN_LINK_COUNT_LIMIT`、`OTEL_EVENT_ATTRIBUTE_COUNT_LIMIT` 和 `OTEL_LINK_ATTRIBUTE_COUNT_LIMIT` 限制。
- 不尊重环境变量 `OTEL_METRIC_EXPORT_TIMEOUT`。
- 未知的 HTTP 方法不会在 `http.request.method` 跨度属性中标准化为 `_OTHER`，与 OpenTelemetry 语义约定不符。
- `Deno.serve` 的 HTTP 服务器跨度在处理程序抛出（调用 `onError`）时不会设置错误状态，错误也不通过事件附加到跨度。
- `fetch` 的 HTTP 客户端跨度中无机制添加 `http.route` 属性或更新跨度名称以包含路由信息。