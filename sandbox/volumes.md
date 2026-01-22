---
title: "持久卷"
description: "将块存储挂载到 Deno 沙盒中，以在会话之间保持状态"
---

持久卷让你可以将区域块存储附加到沙箱中，从而使数据在进程重启和新连接之间得以保留。它们非常适合包缓存、构建产物、SQLite 数据库，或任何需要少量耐久存储但不需要将代码提升为完整 Deno Deploy 应用的工作流。

:::note

持久卷目前处于私有测试阶段。如需访问此功能，请联系
[support](mailto:support@deno.com)

:::

## 使用 `Client.volumes` 预配置存储

使用管理 Deploy 应用的相同 `Client` 类。

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();

const volume = await client.volumes.create({
  slug: "training-cache",
  region: "ord", // ord（芝加哥）或 ams（阿姆斯特丹）
  capacity: "2GB", // 接受字节数或 "1GB"/"512MB" 等样式的字符串
});

console.log(volume);
// {
//   id: "8a0f...",
//   slug: "training-cache",
//   region: "ord",
//   capacity: 2147483648,
//   used: 0
// }
```

| 字段         | 是否必需 | 详情                                                                                                                  |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `slug`       | ✅       | 在组织内唯一。Slug 会成为挂载元数据的一部分，请选择描述性强的名称。                                                   |
| `region`     | ✅       | 必须匹配可用的沙箱区域（目前为 `"ord"` 或 `"ams"`）。只有同一区域的沙箱才能挂载该卷。                                  |
| `capacity`   | ✅       | 介于 300 MB 和 20 GB 之间。支持字节数，或带有 `GB`/`MB`/`KB`（十进制）或 `GiB`/`MiB`/`KiB`（二进制）单位的字符串。 |

## 检查和搜索卷

`client.volumes.list()` 返回分页结果和辅助迭代器，`client.volumes.get()` 可按 slug 或 UUID 获取单个记录。

```tsx
const page = await client.volumes.list({ search: "training" });
for (const info of page.items) {
  console.log(
    info.slug,
    formatBytes(info.used),
    "of",
    formatBytes(info.capacity),
  );
}

const latest = await client.volumes.get("training-cache");
```

`used` 字段报告控制平面从底层集群获得的最新估算值。该值可能会比实际情况滞后几分钟，因此创建卷时请预留足够的容量。

## 在沙箱内挂载卷

调用 `Sandbox.create()` 时传入 `volumes` 映射。键为挂载路径，值为卷的 slug 或 ID。沙箱和卷**必须位于同一区域**。

```tsx
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();
const volume = await client.volumes.create({
  slug: "dataset",
  region: "ord",
  capacity: "1GB",
});

// 第一次运行时向卷中写入文件
{
  await using sandbox = await Sandbox.create({
    region: "ord",
    volumes: {
      "/data/dataset": volume.slug,
    },
    labels: { job: "prepare" },
  });

  await sandbox.fs.writeTextFile("/data/dataset/hello.txt", "Persist me!\n");
}

// 新沙箱 —— 可能在数小时之后启动 —— 可以读取同一个文件
{
  await using sandbox = await Sandbox.create({
    region: "ord",
    volumes: {
      "/data/dataset": volume.id, // ID 也可用
    },
  });

  const contents = await sandbox.fs.readTextFile("/data/dataset/hello.txt");
  console.log(contents); // "Persist me!"
}
```

挂载点表现得像普通目录。你可以创建子文件夹、写入二进制文件，或直接从卷中执行程序。

## 安全删除卷

```tsx
await client.volumes.delete("training-cache");
```

删除是一个两步过程：

1. API 会立即将卷标记为删除状态，阻止新沙箱请求挂载它，并释放该 slug 以供将来使用。
2. 后台任务将在 24 小时后从集群中移除底层块存储。此宽限期允许你在意外删除卷时联系支持。

宽限期内无法挂载或读取该卷。