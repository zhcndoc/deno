---
title: "在Deno中实现上下文传播的分布式追踪"
description: "了解如何在Deno应用程序中实现端到端的分布式追踪，自动上下文传播。本教程涵盖创建追踪服务、自动传播追踪上下文以及可视化分布式追踪。"
url: /examples/otel_span_propagation_tutorial/
---

现代应用程序通常构建为具有多个服务相互通信的分布式系统。在调试这些系统中的问题或优化性能时，能够追踪请求在不同服务之间的流动至关重要。这就是分布式追踪的用武之地。

自Deno 2.3版本以来，运行时现在自动保留跨服务边界的追踪上下文，从而简化了分布式系统中的端到端追踪。这意味着当一个服务向另一个服务发起请求时，追踪上下文会自动传播，使您能够将整个请求流视为一个单一的追踪。

## 设置分布式系统

我们的示例系统将由两个部分组成：

1. 提供API端点的服务器
2. 向服务器发送请求的客户端

### 服务器

我们将设置一个简单的HTTP服务器，该服务器以JSON消息响应GET请求：

```ts title="server.ts"
import { trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("api-server", "1.0.0");

// 使用Deno.serve创建一个简单的API服务器
Deno.serve({ port: 8000 }, (req) => {
  return tracer.startActiveSpan("process-api-request", async (span) => {
    // 为更好的上下文向span添加属性
    span.setAttribute("http.route", "/");
    span.updateName("GET /");

    // 添加一个span事件以便在追踪中查看
    span.addEvent("processing_request", {
      request_id: crypto.randomUUID(),
      timestamp: Date.now(),
    });

    // 模拟处理时间
    await new Promise((resolve) => setTimeout(resolve, 50));

    console.log("服务器：在追踪上下文中处理请求");

    // 当完成时结束span
    span.end();

    return new Response(JSON.stringify({ message: "来自服务器的问候！" }), {
      headers: { "Content-Type": "application/json" },
    });
  });
});
```

### 客户端

现在，让我们创建一个向服务器发送请求的客户端：

```ts title="client.ts"
import { SpanStatusCode, trace } from "npm:@opentelemetry/api@1";

const tracer = trace.getTracer("api-client", "1.0.0");

// 为客户端操作创建一个父span
await tracer.startActiveSpan("call-api", async (parentSpan) => {
  try {
    console.log("客户端：开始API调用");

    // 在此span中的fetch调用将自动：
    // 1. 为fetch操作创建一个子span
    // 2. 将追踪上下文注入到外发请求头中
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();

    console.log(`客户端：收到响应：${JSON.stringify(data)}`);

    parentSpan.addEvent("received_response", {
      status: response.status,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("调用API时出错：", error);
    if (error instanceof Error) {
      parentSpan.recordException(error);
    }
    parentSpan.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    parentSpan.end();
  }
});
```

## 使用OpenTelemetry进行追踪

客户端和服务器代码已经包含基本的OpenTelemetry仪器：

1. 创建tracer - 两个文件都使用 `trace.getTracer()` 创建了一个具有名称和版本的tracer。

2. 创建spans - 我们使用 `startActiveSpan()` 创建代表操作的spans。

3. 添加上下文 - 我们向spans添加属性和事件以提供更多上下文。

4. 结束spans - 我们确保在操作完成时结束spans。

## 自动上下文传播

当客户端向服务器发送请求时，魔力发生了。在客户端代码中，有一个fetch调用到服务器：

```ts
const response = await fetch("http://localhost:8000/");
```

由于此fetch调用发生在一个活动的span内，Deno会自动为fetch操作创建一个子span，并将追踪上下文注入到外发请求头中。

当服务器接收到此请求时，Deno会从请求头中提取追踪上下文，并将服务器span设置为客户端span的子span。

## 运行示例

要运行此示例，首先启动服务器，给您的otel服务命名：

```sh
OTEL_DENO=true OTEL_SERVICE_NAME=server deno run --unstable-otel --allow-net server.ts
```

然后，在另一个终端中，运行客户端，给客户端一个不同的服务名称以使观察传播更清晰：

```sh
OTEL_DENO=true OTEL_SERVICE_NAME=client deno run --unstable-otel --allow-net client.ts
```

您应该会看到：

1. 客户端记录“客户端：开始API调用”
2. 服务器记录“服务器：在追踪上下文中处理请求”
3. 客户端记录收到来自服务器的响应

## 查看追踪

要实际查看追踪，您将需要一个OpenTelemetry收集器和一个可视化工具，
[例如Grafana Tempo](/runtime/fundamentals/open_telemetry/#quick-start)。

当您可视化追踪时，您将看到：

1. 来自客户端的父span
2. 连接到一个HTTP请求的子span
3. 连接到来自服务器的span
4. 所有作为单一追踪的一部分！

例如，在Grafana中，追踪可视化可能看起来像这样：

![在Grafana中查看扩展的追踪](./images/how-to/grafana/propagation.png)

🦕 现在您了解了Deno中的分布式追踪，您可以将其扩展到具有多个服务和异步操作的更复杂的系统。

凭借Deno的自动上下文传播，在您的应用程序中实现分布式追踪从未如此简单！