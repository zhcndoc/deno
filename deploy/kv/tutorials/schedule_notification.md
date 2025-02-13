---
title: "为未来日期安排通知"
oldUrl:
  - /kv/tutorials/schedule_notification/
---

一个常见的用例是使用 [队列](../manual/queue_overview.md) 来安排在未来某个时间完成的工作。为了帮助演示这一过程，我们提供了一个示例应用（在下面描述），该应用通过 [Courier API](https://www.courier.com/) 安排发送通知消息。该应用运行在 [Deno Deploy](https://deno.com/deploy) 上，利用那里的内置 KV 和队列 API 实现，配置为零。

## 下载和配置示例

⬇️
[**在这里下载或克隆完整的示例应用**](https://github.com/kwhinnery/deno_courier_example)。

您可以使用 GitHub 仓库中的
[`README` 文件](https://github.com/kwhinnery/deno_courier_example) 中的说明，自己运行和部署这个示例应用。

要运行上述示例应用，您还需要
[注册 Courier](https://app.courier.com/signup)。当然，您在应用中看到的技术同样适用于任何通知服务，从 [Amazon SNS](https://aws.amazon.com/sns/) 到
[Twilio](https://www.twilio.com)，但是 Courier 提供了一个易于使用的
通知 API，您可以用个人 GMail 账户进行测试（除了它可以做的所有其他有趣的事情）。

## 主要功能

在设置和运行项目后，我们希望您关注代码中的几个关键部分，这些部分实现了调度机制。

### 在应用启动时连接到 KV 并添加监听器

示例应用的大部分功能位于
[server.tsx](https://github.com/kwhinnery/deno_courier_example/blob/main/server.tsx)
的顶级目录中。当 Deno 应用进程启动时，它会创建一个与 Deno KV 实例的连接，并附加一个事件处理程序，该处理程序将处理从队列接收到的消息。

```ts title="server.tsx"
// 创建 Deno KV 数据库引用
const kv = await Deno.openKv();

// 创建一个队列监听器，用于处理入队消息
kv.listenQueue(async (message) => {
  /* ... 监听器的实现 ... */
});
```

### 创建和调度通知

在通过该演示应用中的表单提交新订单后，将调用 `enqueue` 函数，延迟五秒后发送通知邮件。

```ts title="server.tsx"
app.post("/order", async (c) => {
  const { email, order } = await c.req.parseBody();
  const n: Notification = {
    email: email as string,
    body: `收到订单："${order as string}"`,
  };

  // 选择未来的时间 - 目前只等待 5 秒
  const delay = 1000 * 5;

  // 将消息入队进行处理！
  kv.enqueue(n, { delay });

  // 用成功消息重定向回首页！
  setCookie(c, "flash_message", "订单创建成功！");
  return c.redirect("/");
});
```

### 在 TypeScript 中定义通知数据类型

在将数据推入或推出队列时，通常希望使用强类型对象。虽然队列消息最初是一个
[`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
TypeScript 类型，但我们可以使用
[类型保护](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) 来告诉编译器我们期望的数据形状。

以下是
[通知模块的源代码](https://github.com/kwhinnery/deno_courier_example/blob/main/notification.ts)，
我们用它来描述我们系统中通知的属性。

```ts title="notification.ts"
// 通知对象的形状
export default interface Notification {
  email: string;
  body: string;
}

// 通知对象的类型保护
export function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.email !== undefined &&
      typeof (o as Notification).email === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}
```

在 `server.tsx` 中，我们使用导出的类型保护来确保我们响应正确的消息类型。

```ts title="server.tsx"
kv.listenQueue(async (message) => {
  // 使用类型保护在消息类型错误时提前中断
  if (!isNotification(message)) return;

  // 从消息中获取相关数据，TypeScript 现在知道
  // 这是一个 Notification 接口
  const { email, body } = message;

  // 使用 Courier 创建一条电子邮件通知
  // ...
});
```

### 发送 Courier API 请求

为了按计划发送电子邮件，我们使用 Courier REST API。有关 Courier REST API 的更多信息，请参见
[他们的参考文档](https://www.courier.com/docs/reference/send/message/)。

```ts title="server.tsx"
const response = await fetch("https://api.courier.com/send", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${COURIER_API_TOKEN}`,
  },
  body: JSON.stringify({
    message: {
      to: { email },
      content: {
        title: "新订单由 Deno 提交！",
        body: "通知内容在这里",
      },
    },
  }),
});
```