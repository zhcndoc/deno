---
title: "Deno Deploy 上的 KV"
oldUrl:
  - /deploy/manual/kv/
  - /kv/manual/on_deploy/
---

<deno-admonition></deno-admonition>

Deno Deploy 现在提供一个内置的无服务器键值数据库，称为 Deno KV。

此外，Deno KV 也可以在 Deno 自身内部使用，利用 SQLite 作为其后端。自 Deno v1.32 起，这个功能在使用 `--unstable` 标志时可以访问。要了解更多关于 [Deno KV](/deploy/kv/manual) 的信息。

## 一致性

默认情况下，Deno KV 是一个强一致性的数据库。它提供了最严格的强一致性形式，称为 _外部一致性_，这意味着：

- **可序列化性**：这是事务的最高隔离级别。它确保多个事务的并发执行结果与这些事务按顺序逐个执行的系统状态相同。换句话说， 可序列化事务的最终结果相当于这些事务的某种顺序执行。
- **线性一致性**：这种一致性模型保证了操作（如读取和写入）看起来是瞬时的，并且实时发生。一旦写入操作完成，所有后续的读取操作将立即返回更新的值。线性一致性确保对操作的强实时排序，使得系统更可预测且更易于推理。

同时，您可以通过在单个读取操作上设置 `consistency: "eventual"` 选项来放宽一致性约束。此选项允许系统从全局副本和缓存中服务读取，以获取最小的延迟。

以下是我们主要区域的延迟数据：

| 区域                      | 延迟（最终一致性）  | 延迟（强一致性）         |
| ------------------------- | ------------------ | ------------------------ |
| 北弗吉尼亚 (us-east4)    | 7ms                | 7ms                      |
| 法兰克福 (europe-west3)  | 7ms                | 94ms                     |
| 荷兰 (europe-west4)      | 13ms               | 95ms                     |
| 加利福尼亚 (us-west2)    | 72ms               | 72ms                     |
| 香港 (asia-east2)        | 42ms               | 194ms                    |

## 分布式队列

无服务器的分布式队列在 Deno Deploy 上可用。有关更多详细信息，请参阅 [Deno Deploy 上的队列](/deploy/kv/manual/queue_overview#queues-on-deno-deploy)。

## 从 Deno Deploy 以外连接到托管数据库

您可以从 Deno Deploy 以外的 Deno 应用程序连接到您的 Deno Deploy KV 数据库。要打开一个托管数据库，请将 `DENO_KV_ACCESS_TOKEN` 环境变量设置为 Deno Deploy 个人访问令牌，并将数据库的 URL 提供给 `Deno.openKv`：

```ts
const kv = await Deno.openKv(
  "https://api.deno.com/databases/<database-id>/connect",
);
```

请查看
[文档](https://github.com/denoland/deno/tree/main/ext/kv#kv-connect)
了解远程 KV 数据库连接协议的规范。

## 数据分布

Deno KV 数据库在主要区域内的至少 3 个数据中心间进行复制。一旦写操作提交，其变更会持久存储在主要区域内的数据中心仲裁多数节点中。如果启用了跨区域复制，异步复制通常会在 5 秒内将变更传输到目标区域。

系统设计能够容忍大多数数据中心级别的故障，而不会出现停机或数据丢失。恢复点目标 (RPO) 与恢复时间目标 (RTO) 用于量化系统在不同故障模式下的弹性。RPO 表示可接受的数据最大丢失时间，RTO 表示在故障后恢复系统正常运行的最长时间。

- 主要区域内丢失一个数据中心：RPO=0（无数据丢失），RTO&lt;5秒（系统在 5 秒内恢复）
- 副本区域内丢失任意数量数据中心：RPO=0，RTO&lt;5秒
- 主要区域内丢失两个或更多数据中心：RPO&lt;60秒（数据丢失在 60 秒以内）