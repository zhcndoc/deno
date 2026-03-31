---
title: "事务"
oldUrl:
  - /runtime/manual/runtime/kv/transactions/
  - /kv/manual/transactions/
  - /deploy/kv/manual/transactions/
---

Deno KV 存储利用 _乐观并发控制事务_，而不是像 PostgreSQL 或 MySQL 等许多 SQL 系统那样使用 _交互式事务_。这种方法使用版本戳来表示给定键的值的当前版本，通过不使用锁的方式来管理对共享资源的并发访问。当发生读取操作时，系统除了返回相关键的值外，还会返回一个版本戳。

要执行事务，可以执行一个原子操作，该操作可以包含多个变更操作（例如设置或删除）。与这些操作一起，提供键+版本戳对作为事务成功的条件。乐观并发控制事务只有在指定的版本戳与数据库中对应键的值的当前版本匹配时才会提交。这种事务模型在允许 Deno KV 存储中的并发交互的同时，确保了数据的一致性和完整性。

由于 OCC 事务是乐观的，它们在提交时可能会失败，因为原子操作中指定的版本约束被违反。这发生在代理在读取和提交之间更新了事务中使用的键。当这种情况发生时，执行事务的代理必须重试事务。

为了说明如何在 Deno KV 中使用 OCC 事务，下面的例子展示了如何实现一个 `transferFunds(from: string, to: string, amount: number)` 函数用于账户分类账。账户分类账在键值存储中存储每个账户的余额。键前缀为 `"account"`，后跟账户标识符：`["account", "alice"]`。为每个键存储的值是一个表示账户余额的数字。

以下是实现 `transferFunds` 函数的逐步示例：

```ts
async function transferFunds(sender: string, receiver: string, amount: number) {
  if (amount <= 0) throw new Error("金额必须为正数");

  // 构造发送者和接收者账户的 KV 键。
  const senderKey = ["account", sender];
  const receiverKey = ["account", receiver];

  // 重试事务直到成功。
  let res = { ok: false };
  while (!res.ok) {
    // 读取两个账户的当前余额。
    const [senderRes, receiverRes] = await kv.getMany([senderKey, receiverKey]);
    if (senderRes.value === null) {
      throw new Error(`未找到账户 ${sender}`);
    }
    if (receiverRes.value === null) {
      throw new Error(`未找到账户 ${receiver}`);
    }

    const senderBalance = senderRes.value;
    const receiverBalance = receiverRes.value;

    // 确保发送者有足够的余额来完成转账。
    if (senderBalance < amount) {
      throw new Error(
        `账户 ${sender} 的余额不足以转账 ${amount}`,
      );
    }

    // 执行转账。
    const newSenderBalance = senderBalance - amount;
    const newReceiverBalance = receiverBalance + amount;

    // 尝试提交事务。如果事务由于检查失败而无法提交，`res` 返回一个对象，包含 `ok: false`
    // （即键的版本戳已更改）
    res = await kv.atomic()
      .check(senderRes) // 确保发送者的余额没有改变。
      .check(receiverRes) // 确保接收者的余额没有改变。
      .set(senderKey, newSenderBalance) // 更新发送者的余额。
      .set(receiverKey, newReceiverBalance) // 更新接收者的余额。
      .commit();
  }
}
```

在这个例子中，`transferFunds` 函数读取两个账户的余额和版本戳，计算转账后的新余额，并检查账户 A 是否有足够的资金。然后，它执行一个原子操作，使用版本戳约束设置新的余额。如果事务成功，循环退出。如果版本约束被违反，事务失败，循环重试事务直到成功。

## 限制

除了最大键大小为 2 KiB 和最大值大小为 64 KiB 外，Deno KV 事务 API 还有一些特定的限制：

- **每个 `kv.getMany()` 的最大键数**：10
- **每个 `kv.list()` 的最大批处理大小**：1000
- **原子操作中的最大检查数**：100
- **原子操作中的最大变更数**：1000
- **原子操作的最大总大小**：800 KiB。包括所有键和值的检查和变更，以及编码开销也算入此限制。
- **键的最大总大小**：90 KiB。包括所有键的检查和变更，以及编码开销也算入此限制。
- **每个 `kv.watch()` 的最大监视键数**：10