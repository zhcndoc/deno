---
last_modified: 2026-06-25
title: "错误报告"
description: "捕获未捕获的错误、未处理的拒绝以及 Rust panic，显示原生警报并将 JSON 报告 POST 到你的服务器。"
---

:::info 可在 Deno 2.9 中使用

`deno desktop` 从 Deno v2.9.0 开始可用。如果你使用的是更早的
版本，请[更新 Deno](/runtime/reference/cli/upgrade/)以使用它。

:::

`deno desktop` 应用会自动捕获：

- Deno 端代码和渲染端代码中的未捕获 JavaScript 异常。
- 未处理的 promise 拒绝。
- 运行时或渲染后端中的 Rust panic。

当其中之一发生时，运行时会显示一个带有错误消息的原生警报；如果你配置了报告 URL，则会 `POST` 一份 JSON 报告。

## 配置

在你的 `deno.json` 中设置 `desktop.errorReporting.url`：

```jsonc
{
  "desktop": {
    "errorReporting": {
      "url": "https://errors.example.com/report"
    }
  }
}
```

该 URL 必须使用 `https://` 或 `file://`。纯 `http://` 会被拒绝，因为报告会携带堆栈信息和运行时上下文，路径中的任何人都可能读取。`file://` URL 适用于本地测试：运行时会将 JSON 追加到该路径，而不是发出 HTTP 请求。

如果没有设置 `errorReporting.url`，警报仍然会出现，但不会发送报告。

## 报告格式

```json
{
  "version": 1,
  "message": "TypeError: 无法读取 null 的属性",
  "stack": "TypeError: Cannot read properties of null (reading 'foo')\n    at handler (file:///main.ts:12:14)\n    at …",
  "appVersion": "1.4.0",
  "timestamp": "2026-04-08T12:00:00.000Z",
  "platform": "darwin",
  "arch": "aarch64"
}
```

| 字段         | 类型                               | 说明                                                                               |
| ------------ | ---------------------------------- | ---------------------------------------------------------------------------------- |
| `version`    | `1`                                | 规范版本。请在服务器端检查此值。                                                    |
| `message`    | `string`                           | 错误的 `message`。                                                                 |
| `stack`      | `string`                           | 错误的 `stack`。在可能的情况下会进行源映射。                                        |
| `appVersion` | `string \| null`                   | 错误发生时的 [`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion)。            |
| `timestamp`  | ISO 8601 string                    | 捕获到错误时的 UTC 时间戳。                                                         |
| `platform`   | `"darwin" \| "windows" \| "linux"` | [`Deno.build.os`](/api/deno/~/Deno.build.os)。                                     |
| `arch`       | string                             | [`Deno.build.arch`](/api/deno/~/Deno.build.arch)。                                 |

`Content-Type` 头为 `application/json`。报告会以单次 `POST` 发送，不会重试。如果你的服务器宕机，报告就会丢失。对于高重要级别的报告，请在本地排队并在下次启动时重新发送。

## 会被报告的内容

| 来源                                         | 是否捕获？                                    |
| -------------------------------------------- | --------------------------------------------- |
| Deno 端代码中的未捕获异常                    | 是。                                           |
| Deno 端代码中的未处理拒绝                    | 是。                                           |
| 渲染端 JS 中的未捕获异常                     | 是；通过渲染器的 `error` 事件捕获。            |
| Deno 运行时中的 Rust panic                  | 是。                                           |
| 渲染后端（CEF，…）中的 Rust panic            | 是；后端会桥接这些 panic。                     |
| `console.error` / `console.warn`             | 否；这些不是错误。                             |
| 你自己通过 `try`/`catch` 处理的异常          | 否。                                           |

在 [binding](/runtime/desktop/bindings/) 处理器中抛出的错误会传播到 webview 端，并使调用它的 promise 被拒绝。它们**不会**作为未捕获错误被报告；webview 会捕获它们。若仍想报告它们，请在 binding 处理器中自行记录。

## Suppression alerts

This alert is intended to inform users when errors occur. It will trigger for every uncaught error, unhandled rejection, and panic, and there is currently no way to suppress it from user code: the runtime registers its `error` and `unhandledrejection` handlers before your code runs, so `preventDefault()` in listeners you add later will not stop the alert or reporting.

To avoid an error triggering an alert, prevent it from becoming an uncaught error: handle it in your code and binding implementations using `try`/`catch` (or local error handling):

```ts
win.bind("readFile", async (path) => {
  try {
    return await Deno.readTextFile(path);
  } catch (e) {
    reportToOwnTelemetry(e);
    return null; // handled, no alert
  }
});
```

You can still add your own `error` / `unhandledrejection` listeners to collect additional telemetry; they run after the built-in handlers and in parallel with alerts and reporting:

```ts
addEventListener("error", (e) => reportToOwnTelemetry(e.error));
addEventListener("unhandledrejection", (e) => reportToOwnTelemetry(e.reason));
```

## 服务器端示例

一个最小的报告接收器：

```ts title="server/report.ts"
Deno.serve({ port: 8080 }, async (req) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });

  const report = await req.json();
  if (report.version !== 1) {
    return new Response("不支持的版本", { status: 400 });
  }

  await Deno.writeTextFile(
    `./reports/${report.timestamp}.json`,
    JSON.stringify(report, null, 2),
  );
  return new Response(null, { status: 204 });
});
```

在生产环境中，你会将其写入数据库，或转发到合适的崩溃收集服务。

## 隐私注意事项

默认报告包含 `stack` 堆栈跟踪，其中可能包含嵌入在错误消息中的用户数据（文件名、URL、查询参数、序列化的对象字段）。如果你的应用处理敏感数据，请考虑：

- 在发送前从堆栈帧中移除参数。
- 对 [`Deno.readTextFile`](/api/deno/~/Deno.readTextFile) 调用及类似内容的 URL 进行脱敏。
- 在发送第一份报告前先询问用户（一次性的同意提示）。

这些都是应用层面的决定；内置报告器会发送其所拥有的内容，其负载无法从用户代码中被过滤。若要完全控制离开机器的数据，请不要设置 `errorReporting.url`，而是改为在 `error` / `unhandledrejection` 处理器中发送你自己的报告。
