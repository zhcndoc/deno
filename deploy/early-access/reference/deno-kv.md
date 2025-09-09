---
title: Deno KV
description: 在您的应用中使用 Deno KV，为每个时间线提供一个数据库
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。寻找 Deploy Classic 文档？[请点击这里查看](/deploy/)。

:::

[Deno KV] 在 Deno Deploy EA 中被支持作为 [databases] 功能的可能数据库引擎之一，除此之外还有 PostgreSQL 等。得益于 Deno Deploy EA 新增的 [timelines] 功能，您的应用现在可以完全控制所使用的 Deno KV 数据库（一个用于生产环境，每个 git 分支一个数据库等），确保数据在所有环境中的隔离与安全。

与其他数据库引擎一样，您的代码会自动连接到适用于每个环境的正确数据库，无需进行时间线检测或手动处理数据库名称。

## 入门指南

### 添加数据库

前往您的组织仪表板，点击导航栏中的“数据库”。点击“添加数据库”，选择 Deno KV 作为数据库引擎，提供一个便于识别的名称后保存。

### 将应用连接到数据库

与其他 [databases] 引擎一样，一旦有了数据库实例，您可以将其分配给应用。在数据库实例列表中，点击对应数据库实例旁的“分配”，然后从下拉菜单中选择应用。

Deno Deploy 会自动为每个时间线创建独立的数据库。这确保您的生产数据在开发和测试过程中保持安全。您可以监控配置过程，并观察状态变更为“已连接”。如果出现任何错误，可以使用“修复”按钮重试。

## 在代码中使用 Deno KV

### 零配置需求

将数据库分配给应用后，从代码中连接数据库非常简单。Deno Deploy 会根据查询的环境自动设置到正确数据库的连接。

### 示例

以下示例展示了如何在 Deno Deploy 应用中连接 Deno KV：

```typescript
const kv = await Deno.openKv();

Deno.serve(async () => {
  const res = await kv.get<number>(["requests"]);
  const requests = res.value + 1;
  await kv.set(["requests"], requests);
  return new Response(JSON.stringify(requests));
});
```

有关 Deno KV 及其功能的详细信息，请参阅 [Deno KV 文档][Deno KV]。

## 数据分布

Deno KV 数据库会在主要区域北弗吉尼亚（us-east4）的至少三个数据中心间进行复制。写操作一旦提交，其变更会在主要区域的多数数据中心中持久存储。目前尚不支持跨区域复制。

## 常见问题解答

**问：本地开发期间数据如何存储？**

在本地开发环境中，数据存储在内存中。使用 KV API 前无需创建或分配数据库，且您的 KV 代码可在不同环境中保持一致。

**问：移除应用分配后我的数据会怎样？**

数据库中的数据会保留在服务器上。若需恢复或删除这些数据库中的数据，请[联系 Deno 支持](../support)。

**问：我可以在多个环境中使用同一个数据库吗？**

目前不支持此功能。如果您对此用例感兴趣，请[联系 Deno 支持](../support)。

**问：如何删除数据库实例？**

在数据库实例列表中点击 Deno KV 记录旁的“删除”。不同于其他数据库引擎，此操作会删除所有现有的 Deno KV 数据库及其数据。请务必在操作前备份数据。

[Deno KV]: /kv/
[databases]: ./databases.md
[timelines]: ./timelines.md