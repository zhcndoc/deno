---
last_modified: 2026-03-25
title: "Deno 中开始使用 OpenTelemetry"
description: "在 Deno 应用中设置基础的 OpenTelemetry 监测。本教程涵盖创建一个带自定义指标和跟踪的简单 HTTP 服务器，并查看遥测数据。"
url: /examples/basic_opentelemetry_tutorial/
---

OpenTelemetry 为您的应用提供强大的可观察性工具。借助 Deno 内置的 OpenTelemetry 支持，您可以轻松地对代码进行监测，收集指标、跟踪和日志。

本教程将指导您如何设置一个带有 OpenTelemetry 监测的简单 Deno 应用。

## 前提条件

- Deno 2.3 或更高版本

## 第一步：创建一个简单的 HTTP 服务器

让我们开始创建一个基础的 HTTP 服务器，模拟一个小型的网页应用：

```ts title="server.ts"
import { metrics, trace } from "npm:@opentelemetry/api@1";

// 为我们的应用创建 tracer 和 meter
const tracer = trace.getTracer("my-server", "1.0.0");
const meter = metrics.getMeter("my-server", "1.0.0");

// 创建一些指标
const requestCounter = meter.createCounter("http_requests_total", {
  description: "HTTP 请求总数",
});

const requestDuration = meter.createHistogram("http_request_duration_ms", {
  description: "HTTP 请求持续时间（毫秒）",
  unit: "ms",
});

// 启动服务器
Deno.serve({ port: 8000 }, (req) => {
  // 记录请求开始时间，以测量请求持续时间
  const startTime = performance.now();

  // 为该请求创建一个 span
  return tracer.startActiveSpan("handle_request", async (span) => {
    try {
      // 从 URL 中提取路径
      const url = new URL(req.url);
      const path = url.pathname;

      // 为 span 添加属性
      span.setAttribute("http.route", path);
      span.setAttribute("http.method", req.method);
      span.updateName(`${req.method} ${path}`);

      // 为 span 添加事件
      span.addEvent("request_started", {
        timestamp: startTime,
        request_path: path,
      });

      // 模拟一些处理时间
      const waitTime = Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      // 为 span 添加另一个事件
      span.addEvent("processing_completed");

      // 创建响应
      const response = new Response(`Hello from ${path}!`, {
        headers: { "Content-Type": "text/plain" },
      });

      // 记录指标
      requestCounter.add(1, {
        method: req.method,
        path,
        status: 200,
      });

      const duration = performance.now() - startTime;
      requestDuration.record(duration, {
        method: req.method,
        path,
      });

      span.setAttribute("request.duration_ms", duration);

      return response;
    } catch (error) {
      // 在 span 中记录错误
      if (error instanceof Error) {
        span.recordException(error);
        span.setStatus({
          code: trace.SpanStatusCode.ERROR,
          message: error.message,
        });
      }

      return new Response("内部服务器错误", { status: 500 });
    } finally {
      // 始终结束 span
      span.end();
    }
  });
});
```

该服务器功能：

1. 为应用创建 tracer 和 meter
2. 设置指标以统计请求数量并测量请求持续时间
3. 为每个请求创建带有属性和事件的 span
4. 模拟处理时间
5. 记录每个请求的指标

## 第二步：启用 OpenTelemetry 并运行服务器

使用以下命令行标志运行服务器以启用 OpenTelemetry：

```sh
OTEL_DENO=true OTEL_SERVICE_NAME=my-server deno run --allow-net server.ts
```

:::tip

要快速查看遥测输出，而无需设置收集器，您可以使用
内置的控制台导出器，它会将 span、日志和指标直接打印到
stderr：

```sh
OTEL_DENO=true OTEL_EXPORTER_OTLP_PROTOCOL=console OTEL_SERVICE_NAME=my-server deno run --allow-net server.ts
```

:::

## 第三步：创建测试客户端

让我们创建一个简单客户端，向服务器发送请求：

```ts title="client.ts"
// 向不同路径发送 10 个请求
for (let i = 0; i < 10; i++) {
  const path = ["", "about", "users", "products", "contact"][i % 5];
  const url = `http://localhost:8000/${path}`;

  console.log(`正在向 ${url} 发送请求`);

  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log(`来自 ${url} 的响应：${text}`);
  } catch (error) {
    console.error(`获取 ${url} 时出错：`, error);
  }
}
```

## 第四步：运行客户端

在另一个终端中运行客户端：

```sh
deno run --allow-net client.ts
```

## 第五步：查看遥测数据

默认情况下，Deno 会使用 OTLP 协议将遥测数据导出到 `http://localhost:4318`。您需要一个 OpenTelemetry 收集器来接收并可视化这些数据。

### 安装本地收集器

最快速的方式是使用 Docker 运行本地 LGTM 堆栈（Loki、Grafana、Tempo、Mimir）：

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
  -v "$PWD"/lgtm/grafana:/data/grafana \
  -v "$PWD"/lgtm/prometheus:/data/prometheus \
  -v "$PWD"/lgtm/loki:/data/loki \
  -e GF_PATHS_DATA=/data/grafana \
  docker.io/grafana/otel-lgtm:0.8.1
```

然后访问 http://localhost:3000 登录 Grafana（用户名：admin，密码：admin）。

在 Grafana 中，您可以：

1. 在 Tempo 中查看 **Traces（跟踪）**，查看每个请求的 span
2. 在 Mimir/Prometheus 中查看 **Metrics（指标）**，查看请求计数和持续时间
3. 在 Loki 中查看 **Logs（日志）**，查看应用的任何日志

## 理解你所看到的内容

### 跟踪（Traces）

在 Traces 视图中，您将看到：

- 服务器处理的每个 HTTP 请求的 span
- 客户端发出的每个 fetch 请求的 span
- 这些 span 之间的关联关系

点击任一 span 可查看详细信息，包括：

- 持续时间
- 属性（如 http.route、http.method 等）
- 事件（request_started、processing_completed）

### 指标（Metrics）

在 Metrics 视图中，您可以查询：

- `http_requests_total` — 统计 HTTP 请求数量的计数器
- `http_request_duration_ms` — 请求持续时间的直方图

您还可以看到内置的 Deno 指标，如：

- `http.server.request.duration`
- `http.server.active_requests`

### 日志（Logs）

在 Logs 视图中，您将看到应用程序的所有控制台日志，且带有正确的跟踪上下文。

## 故障排除

如果您在收集器中看不到数据：

1. 检查是否设置了 `OTEL_DENO=true`
2. 确认收集器正在运行且在默认端点可访问
3. 检查是否需要将 `OTEL_EXPORTER_OTLP_ENDPOINT` 设置为其他 URL
4. 查看 Deno 控制台输出中是否有错误信息

请记住，Deno 中的 OpenTelemetry 支持仍处于不稳定阶段，未来版本可能会有所变动。

🦕 本教程为希望在 Deno 中尝试 OpenTelemetry 的用户提供了一个简单的起点，无需立即深入复杂概念。

此基础示例可以通过多种方式扩展：

- 为业务逻辑添加更多自定义指标
- 为重要操作创建额外的 span
- 使用 baggage 在服务间传递上下文属性
- 基于指标阈值设置告警

欲了解更高级的用法，请参阅我们的
[分布式跟踪与上下文传播](/examples/otel_span_propagation_tutorial/)
教程。