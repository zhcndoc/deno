---
title: "使用队列"
oldUrl:
  - /kv/manual/queue_overview/
---

<deno-admonition></deno-admonition>

Deno 运行时包含一个队列 API，支持异步处理大型工作负载，并确保队列消息的至少一次投递。队列可以用于在 web 应用程序中卸载任务，或安排未来某个时间的工作单元。

您将使用的主要 API 在 `Deno.Kv` 命名空间中，分别是 [ `enqueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.enqueue) 和 [ `listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue)。

## 入队消息

要将消息入队以进行处理，请在一个 [`Deno.Kv`](https://docs.deno.com/api/deno/~/Deno.Kv) 实例上使用 `enqueue` 方法。在下面的示例中，我们展示了如何入队一个通知以便发送。

```ts title="queue_example.ts"
// 描述您的消息对象的形状（可选）
interface Notification {
  forUser: string;
  body: string;
}

// 获取 KV 实例的引用
const kv = await Deno.openKv();

// 创建一个通知对象
const message: Notification = {
  forUser: "alovelace",
  body: "您有邮件！",
};

// 将消息入队以进行立即投递
await kv.enqueue(message);
```

您可以通过指定一个延迟选项（以毫秒为单位）来将消息入队以便稍后投递。

```ts
// 将消息安排在 3 天后投递
const delay = 1000 * 60 * 60 * 24 * 3;
await kv.enqueue(message, { delay });
```

如果由于某种原因您的消息未被投递，您还可以指定一个 Deno KV 键，其中将存储您的消息值。

```ts
// 配置一个键以便发送未投递消息
const backupKey = ["failed_notifications", "alovelace", Date.now()];
await kv.enqueue(message, { keysIfUndelivered: [backupKey] });

// ... 灾难降临 ...

// 获取未发送的消息
const r = await kv.get<Notification>(backupKey);
// 这是未发送的消息：
console.log("找到未发送的通知给:", r.value?.forUser);
```

## 监听消息

您可以配置一个 JavaScript 函数，通过在一个 [`Deno.Kv`](https://docs.deno.com/api/deno/~/Deno.Kv) 实例上使用 `listenQueue` 方法来处理添加到队列中的项目。

```ts title="listen_example.ts"
// 定义我们期望的队列消息的对象形状
interface Notification {
  forUser: string;
  body: string;
}

// 创建一个类型保护来检查传入消息的类型
function isNotification(o: unknown): o is Notification {
  return (
    ((o as Notification)?.forUser !== undefined &&
      typeof (o as Notification).forUser === "string") &&
    ((o as Notification)?.body !== undefined &&
      typeof (o as Notification).body === "string")
  );
}

// 获取 KV 数据库的引用
const kv = await Deno.openKv();

// 注册一个处理函数以监听值 - 此示例展示
// 您如何发送通知
kv.listenQueue((msg: unknown) => {
  // 使用类型保护 - 然后 TypeScript 编译器知道 msg 是 Notification
  if (isNotification(msg)) {
    console.log("向用户发送通知:", msg.forUser);
    // ... 做一些实际发送通知的事情！
  } else {
    // 如果消息是未知类型，可能是一个错误
    console.error("收到未知消息:", msg);
  }
});
```

## 带有 KV 原子事务的队列 API

您可以将队列 API 与 [KV 原子事务](./transactions) 结合，以在同一事务中原子地入队消息和修改键。

```ts title="kv_transaction_example.ts"
const kv = await Deno.openKv();

kv.listenQueue(async (msg: unknown) => {
  const nonce = await kv.get(["nonces", msg.nonce]);
  if (nonce.value === null) {
    // 这条消息已经被处理
    return;
  }

  const change = msg.change;
  const bob = await kv.get(["balance", "bob"]);
  const liz = await kv.get(["balance", "liz"]);

  const success = await kv.atomic()
    // 确保这条消息尚未被处理
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .sum(["processed_count"], 1n)
    .check(bob, liz) // 余额没有变化
    .set(["balance", "bob"], bob.value - change)
    .set(["balance", "liz"], liz.value + change)
    .commit();
});

// 在同一 KV 事务中修改键并入队消息！
const nonce = crypto.randomUUID();
await kv
  .atomic()
  .check({ key: ["nonces", nonce], versionstamp: null })
  .enqueue({ nonce: nonce, change: 10 })
  .set(["nonces", nonce], true)
  .sum(["enqueued_count"], 1n)
  .commit();
```

## 队列行为

### 消息投递保证

运行时保证至少一次投递。这意味着对于大多数入队消息，[ `listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) 处理程序将针对每条消息调用一次。在某些故障场景中，处理程序可能会多次调用同一消息以确保投递。重要的是要设计您的应用程序，以便能够正确处理重复消息。

您可以将队列与 [KV 原子事务](https://docs.deno.com/deploy/kv/manual/transactions) 原语结合使用，以确保您的队列处理程序 KV 更新仅针对每个消息执行一次。请参阅 [带有 KV 原子事务的队列 API](#queue-api-with-kv-atomic-transactions)。

### 自动重试

当队列消息准备投递时，`[listenQueue](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue)` 处理程序被调用以处理您的入队消息。如果您的处理程序抛出异常，运行时将自动重试调用处理程序，直到成功或达到最大重试次数。消息被认为已成功处理，一旦 [ `listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) 处理程序调用成功完成。如果处理程序在重试时持续失败，消息将被丢弃。

### 消息投递顺序

运行时尽量按照入队顺序投递消息。但是，没有严格的顺序保证。偶尔，为了确保最大吞吐量，消息可能会被无序投递。

## Deno Deploy 中的队列

Deno Deploy 提供了全球范围内、无服务器、分布式的队列 API 实现，旨在提供高可用性和高吞吐量。您可以使用它构建能够处理大工作负载的应用程序。

### 按需快速启动孤立环境

在使用 Deno Deploy 的队列时，将根据需要自动快速启动孤立环境，以在消息可用于处理时调用您的 [ `listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) 处理程序。定义 [ `listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) 处理程序是启用队列处理的唯一要求，无需其他配置。

### 队列大小限制

未投递队列消息的最大数量限制为 100,000。当队列已满时， [ `enqueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.enqueue) 方法将失败并返回错误。

### 定价细节和限制

- [ `enqueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.enqueue) 与其他 [ `Deno.Kv`](https://docs.deno.com/api/deno/~/Deno.Kv) 写入操作一样对待。 入队的消息会占用 KV 存储和写入单位。
- 通过 [ `listenQueue`](https://docs.deno.com/api/deno/~/Deno.Kv.prototype.listenQueue) 发送的消息会消耗请求和 KV 写入单位。
- 有关更多信息，请参见 [定价细节](https://deno.com/deploy/pricing)。

## 用例 

队列在许多不同场景中都很有用，但在构建 web 应用程序时您可能会看到的一些用例有：

### 卸载异步进程

有时，客户发起的任务（例如发送通知或 API 请求）可能会花费较长时间，因此您不希望让客户在返回响应之前等待该任务完成。其他时候，客户其实根本不需要响应，例如，当客户向您的应用程序发送 [webhook 请求](https://en.wikipedia.org/wiki/Webhook) 时，因此没有必要在返回响应之前等待底层任务完成。

在这些情况下，您可以将工作卸载到队列中，以保持您的 web 应用程序响应并向客户发送即时反馈。要查看此用例的实际示例，请查看我们的 [webhook 处理示例](../tutorials/webhook_processor.md)。

### 为未来调度工作

队列的另一个有用应用（以及类似这种的队列 API）是安排在未来适当时间进行的工作。也许您想在新客户下单后的一天发送通知，以便向他们发送满意度调查。您可以安排一个队列消息在 24 小时后投递，并设置一个监听器在那个时候发送出通知。

要查看安排未来发送通知的示例，请查看我们的 [通知示例](../tutorials/schedule_notification.md)。