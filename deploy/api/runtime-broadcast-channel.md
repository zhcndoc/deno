---
title: "BroadcastChannel"
oldUrl:
  - /deploy/docs/runtime-broadcast-channel/
  - /deploy/manual/runtime-broadcast-channel
---

在 Deno Deploy 中，代码在全球不同的数据中心运行，以减少延迟，能够在离客户端最近的数据中心处理请求。在浏览器中，[`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) API 允许相同源的不同标签页交换信息。在 Deno Deploy 中，BroadcastChannel API 提供了一个通信机制，用于不同实例之间的消息传递；这是一个简单的消息总线，连接全球各地的 Deploy 实例。

## 构造函数

`BroadcastChannel()` 构造函数创建一个新的 `BroadcastChannel` 实例，并连接到（或创建）提供的通道。

```ts
let channel = new BroadcastChannel(channelName);
```

#### 参数

| 名称        | 类型     | 描述                                                         |
| ----------- | -------- | ------------------------------------------------------------ |
| channelName | `string` | 用于基础广播通道连接的名称。                                |

构造函数的返回类型是一个 `BroadcastChannel` 实例。

## 属性

| 名称             | 类型                   | 描述                                                                                                  |
| ---------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `name`           | `string`               | 基础广播通道的名称。                                                                                  |
| `onmessage`      | `function` (或 `null`) | 当通道接收到新消息时执行的函数 ([`MessageEvent`][messageevent])。                                   |
| `onmessageerror` | `function` (或 `null`) | 当到达的消息无法反序列化为 JavaScript 数据结构时执行的函数。                                       |

## 方法

| 名称                   | 描述                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `close()`              | 关闭与基础通道的连接。关闭后，您将无法再向通道发送消息。                                                              |
| `postMessage(message)` | 向基础通道发送消息。消息可以是字符串、对象字面量、数字或任何类型的 [`Object`][object]。                               |

`BroadcastChannel` 继承自 [`EventTarget`][eventtarget]，这使您可以在 `BroadcastChannel` 实例上使用 `EventTarget` 的方法，如 `addEventListener` 和 `removeEventListener`。

## 示例：跨实例更新内存缓存

像 `BroadcastChannel` 这样启用的消息总线的一个用例是，在跨网络不同数据中心运行的隔离体之间更新数据的内存缓存。在下面的示例中，我们展示了如何配置一个简单的服务器，使用 `BroadcastChannel` 在所有运行的服务器实例之间同步状态。

```ts
import { Hono } from "jsr:@hono/hono";

// 内存消息缓存
const messages = [];

// 所有隔离体使用的 BroadcastChannel
const channel = new BroadcastChannel("all_messages");

// 当其他实例发送新消息时，将其加入缓存
channel.onmessage = (event: MessageEvent) => {
  messages.push(event.data);
};

// 创建一个服务器以添加和获取消息
const app = new Hono();

// 将消息添加到列表中
app.get("/send", (c) => {
  // 新消息通过包含 "message" 查询参数添加
  const message = c.req.query("message");
  if (message) {
    messages.push(message);
    channel.postMessage(message);
  }
  return c.redirect("/");
});

// 获取消息列表
app.get("/", (c) => {
  // 返回当前消息列表
  return c.json(messages);
});

Deno.serve(app.fetch);
```

您可以使用 [这个游乐场](https://dash.deno.com/playground/broadcast-channel-example) 在 Deno Deploy 上自行测试此示例。

[eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
[messageevent]: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object