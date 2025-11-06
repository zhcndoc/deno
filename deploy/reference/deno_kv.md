---
title: Deno KV
description: 在你的应用中使用 Deno KV，每个时间线配备专用数据库
oldUrl: /deploy/reference/deno-kv/
---

[Deno KV] 是 Deno Deploy 支持的一种键值数据库引擎选项，属于 [databases] 功能的一部分。借助 Deno Deploy 早期访问（EA）中的新功能 [timelines]，你的应用可以完全控制所使用的 Deno KV 数据库（例如，一个用于生产环境，每个 Git 分支一个），确保不同环境间的数据隔离和安全。

与其他数据库引擎类似，代码会自动连接到对应环境的正确数据库——无需手动检测时间线或命名数据库。

## 入门指南

### 添加 KV 数据库

进入你的组织面板，点击导航栏中的“Databases”。点击“Provision Database”，选择 Deno KV 作为数据库引擎，填写一个易记的名称，然后保存。

### 将应用连接到 KV 数据库

拥有数据库实例后，可以为应用分配数据库。从数据库实例列表中，点击想使用数据库旁的“Assign”，然后从下拉菜单中选择应用。

Deno Deploy 会自动为每个时间线创建独立的数据库。在开发和测试阶段，这可以保护你的生产数据安全。你可以监控配置过程，等待状态变为“Connected”。如遇错误，点击“Fix”重试。

## 在代码中使用 Deno KV

分配数据库给应用后，从代码连接非常简单。Deno Deploy 会根据当前环境设置到正确数据库的连接。

### 示例

以下是在你的 Deno Deploy 应用中连接 Deno KV 的示例：

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

## 取消分配 KV 数据库

如果你从应用中移除数据库分配，该应用将无法访问该数据库。但数据库及其数据依然保留，可以以后重新分配给其他应用或同一应用。将鼠标悬停在数据库列表中已分配应用名称上，点击“取消应用分配”图标即可取消分配。

## 数据分布

Deno KV 数据库会在主区域北弗吉尼亚（us-east4）至少三个数据中心之间进行复制。写操作一旦提交，其变更会被持久存储在主区域的数据中心法定数量内。目前不支持跨区域复制。

## 数据存储

在本地开发环境中，数据保存在内存中。你无需提前创建或分配数据库即可本地使用 KV API，且 KV 代码在各环境间保持一致。

## 删除数据库实例

在数据库实例列表中点击 Deno KV 项目旁的“Delete”。与其他数据库引擎不同，此操作会删除所有已有的 Deno KV 数据库及其数据。请务必先备份数据后再操作。

[Deno KV]: /deploy/kv/
[databases]: /deploy/reference/databases/
[timelines]: /deploy/reference/timelines/
