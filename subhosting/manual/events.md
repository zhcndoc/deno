---
title: 部署事件
---

在部署执行的生命周期中，多个事件被记录到其执行日志中。通过使用
[部署日志 API](https://apidocs.deno.com/#get-/deployments/-deploymentId-/app_logs)，这些事件日志可以用来理解和监控您的部署行为。

## 启动

```json
"isolate start time: 96.67 ms (user time: 6.13 ms)"
```

`boot` 事件在部署成功启动并运行后被触发。它记录了自接收促使部署启动的初始请求以来，经过的时间，直到部署准备好开始处理该请求。除了整体启动时间之外，该事件还记录了在执行部署的 JavaScript 代码时花费的时间（称为“用户时间”）。

## 内存限制

```json
"Memory limit exceeded, terminated"
```

当部署因超过
[每次部署执行允许的内存限制](https://deno.com/deploy/pricing?subhosting)而被终止时，`memory-limit` 事件被触发。在某些情况下，它后面会跟随一个事件 URN，以便与由于此事件生成的任何可观察性文档进行交叉引用：

```json
"Memory limit exceeded, terminated (urn:dd-hard-memory-limit:deno:pcx8pcbpc34b:048730b1-0e1f-4df7-8f92-e64233415322)"
```

在部署被终止时，所有正在处理的请求都会收到一个 502 响应，代码为 `"MEMORY_LIMIT"`。

## CPU 时间限制

```json
"CPU time limit exceeded, see https://deno.com/deploy/docs/pricing-and-limit (urn:dd-time-limit:deno:pcx8pcbpc34b:b8c729c0-e17a-4ce1-a6df-4267cbeb6d5c)"
```

当部署因超过
[每个请求允许的 CPU 时间限制](https://deno.com/deploy/pricing?subhosting)而被终止时，`time-limit` 事件被触发。日志中包含的事件 URN 可用于与由于此事件生成的任何可观察性文档进行交叉引用。

在部署被终止时，所有正在处理的请求都会收到一个 502 响应，代码为 `"TIME_LIMIT"`。