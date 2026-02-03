---
title: "持久卷"
description: "将块存储挂载到 Deno 沙盒中，以在会话之间保持状态"
---

持久卷让你可以将区域块存储附加到沙箱中，从而使数据在进程重启和新连接之间得以保留。它们非常适合包缓存、构建产物、SQLite 数据库，或任何需要少量耐久存储但不需要将代码提升为完整 Deno Deploy 应用的工作流。

### 预配存储

持久卷目前处于私有测试阶段。如需访问此功能，请联系
[support](mailto:support@deno.com)

:::

## 使用 `Client.volumes` 预配置存储

使用管理 Deploy 应用的相同 `Client` 类。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

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

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

volume = sdk.volumes.create(
  slug="training-cache",
  region="ord",  # ord (芝加哥) 或 ams (阿姆斯特丹)
  capacity="2GB"  # 接受字节数或 "1GB"/"512MB" 样式的字符串
)

print(volume)
# {
#   "id": "8a0f...",
#   "slug": "training-cache",
#   "region": "ord",
#   "capacity": 2147483648,
#   "used": 0
# }
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

volume = await sdk.volumes.create(
  slug="training-cache",
  region="ord",  # ord (芝加哥) 或 ams (阿姆斯特丹)
  capacity="2GB"  # 接受字节数或 "1GB"/"512MB" 样式的字符串
)

print(volume)
# {
#   "id": "8a0f...",
#   "slug": "training-cache",
#   "region": "ord",
#   "capacity": 2147483648,
#   "used": 0
# }
```

</deno-tab>
</deno-tabs>

| 字段       | 是否必需 | 详情                                                                                                           |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `slug`     | ✅       | 在组织内唯一。Slug 会成为挂载元数据的一部分，请选择描述性强的名称。                                            |
| `region`   | ✅       | 必须匹配可用的沙箱区域（目前为 `"ord"` 或 `"ams"`）。只有同一区域的沙箱才能挂载该卷。                           |
| `capacity` | ✅       | 介于 300 MB 和 20 GB 之间。支持字节数，或带有 `GB`/`MB`/`KB`（十进制）或 `GiB`/`MiB`/`KiB`（二进制）单位的字符串。 |

## 检查和搜索卷

`client.volumes.list()` 返回分页结果和辅助迭代器，`client.volumes.get()` 可按 slug 或 UUID 获取单个记录。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const page = await client.volumes.list({ search: "training" });
for (const vol of page.items) {
  console.log(vol.slug, vol.used, vol.capacity);
}

const vol = await client.volumes.get("training-cache");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
page = sdk.volumes.list(search="training")
for vol in page.items:
  print(f"{vol['slug']} {vol['used']} {vol['capacity']}")

vol = sdk.volumes.get("training-cache")
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
page = await sdk.volumes.list(search="training")
async for vol in page:
  print(f"{vol['slug']} {vol['used']} {vol['capacity']}")

vol = await sdk.volumes.get("training-cache")
```

</deno-tab>
</deno-tabs>

`used` 字段报告控制平面从底层集群获得的最新估算值。该值可能会比实际情况滞后几分钟，因此创建卷时请预留足够的容量。

## 在沙箱内挂载卷

调用 `Sandbox.create()` 时传入 `volumes` 映射。键为挂载路径，值为卷的 slug 或 ID。沙箱和卷**必须位于同一区域**。

:::note

`Sandbox.create()` 和 `client.sandboxes.create()` 功能相同——根据你的代码风格选择使用即可。

:::

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

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

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

volume = sdk.volumes.create(
  slug="dataset",
  region="ord",
  capacity="1GB"
)

# 第一次运行时向卷中写入文件
with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["slug"],
  },
  labels={"job": "prepare"}
) as sandbox:
  sandbox.fs.write_text_file("/data/dataset/hello.txt", "Persist me!\n")

# 新沙箱 —— 可能数小时后启动 —— 可以读取同一个文件
with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["id"],  # ID 也可以用
  }
) as sandbox:
  contents = sandbox.fs.read_text_file("/data/dataset/hello.txt")
  print(contents)  # "Persist me!"
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

volume = await sdk.volumes.create(
  slug="dataset",
  region="ord",
  capacity="1GB"
)

# 第一次运行时向卷中写入文件
async with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["slug"],
  },
  labels={"job": "prepare"}
) as sandbox:
  await sandbox.fs.write_text_file("/data/dataset/hello.txt", "Persist me!\n")

# 新沙箱 —— 可能数小时后启动 —— 可以读取同一个文件
async with sdk.sandbox.create(
  region="ord",
  volumes={
    "/data/dataset": volume["id"],  # ID 也可以用
  }
) as sandbox:
  contents = await sandbox.fs.read_text_file("/data/dataset/hello.txt")
  print(contents)  # "Persist me!"
```

</deno-tab>
</deno-tabs>

挂载点表现得像普通目录。你可以创建子文件夹、写入二进制文件，或直接从卷中执行程序。

## 安全删除卷

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await client.volumes.delete("training-cache");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk.volumes.delete("training-cache")
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
await sdk.volumes.delete("training-cache")
```

</deno-tab>
</deno-tabs>

删除是一个两步过程：

1. API 会立即将卷标记为删除状态，阻止新沙箱请求挂载它，并释放该 slug 以供将来使用。  
2. 后台任务将在 24 小时后从集群中移除底层块存储。此宽限期允许你在意外删除卷时联系支持。

宽限期内无法挂载或读取该卷。

## 快照

快照是从卷创建的只读镜像。当沙箱以快照作为根目录启动时，整个文件系统被快照内容替换。你可以运行一次 `apt-get install` 或 `npm install`，创建快照，然后所有未来的沙箱启动时都会立即拥有预安装的软件。

### 创建快照的工作流程

1. 从基础镜像创建一个**可启动卷**  
2. 使用该卷作为 `root`（可写）启动沙箱  
3. 安装软件  
4. 对该卷进行快照

从快照启动的沙箱会立即启动并拥有所有预配置的软件。

当卷用 `from` 选项创建时即为**可启动**。目前唯一可用的基础镜像是 `builtin:debian-13`。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();

// 1. 创建一个可启动卷
const volume = await client.volumes.create({
  region: "ord",
  slug: "my-toolchain",
  capacity: "10GiB",
  from: "builtin:debian-13",
});

// 2. 启动沙箱，使用该卷作为根目录（可写）
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
});

// 3. 安装软件
await sandbox.sh`apt-get update && apt-get install -y nodejs npm`;
await sandbox.sh`npm install -g typescript`;

// 4. 对卷进行快照
const snapshot = await client.volumes.snapshot(volume.id, {
  slug: "my-toolchain-snapshot",
});
```

</deno-tab>
<deno-tab value="cli" label="命令行">

```bash
# 从卷创建快照
deno sandbox snapshots create my-toolchain my-toolchain-snapshot
```

</deno-tab>
</deno-tabs>

### 从快照启动

拿到快照后，可用其作为创建新沙箱时的 `root`。沙箱必须和快照位于同一区域：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: "my-toolchain-snapshot", // 快照的 slug 或 ID
});

// TypeScript 和 Node.js 已经安装好
await sandbox.sh`tsc --version`;
await sandbox.sh`node --version`;
```

</deno-tab>
</deno-tabs>

沙箱启动时，快照的文件系统作为根目录。会话期间所有写操作都是临时性的，它们不会修改快照。

### 列出快照

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const page = await client.snapshots.list();
for (const snap of page.items) {
  console.log(snap.slug, snap.region, snap.bootable);
}
```

</deno-tab>
<deno-tab value="cli" label="命令行">

```bash
$ deno sandbox snapshots list
ID                             SLUG                    REGION   ALLOCATED    BOOTABLE
snp_ord_spmbe47dysccpy277ma6   my-toolchain-snapshot   ord      217.05 MiB   TRUE
```

</deno-tab>
</deno-tabs>

### 从快照创建卷

从快照创建一个新的可写卷：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const volume = await client.volumes.create({
  region: "ord",
  slug: "my-toolchain-fork",
  capacity: "10GiB",
  from: "my-toolchain-snapshot",
});
```

</deno-tab>
</deno-tabs>

新卷包含快照内容且完全可写。你可以用它来修改快照内容然后重新创建快照。

### 删除快照

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await client.snapshots.delete("my-toolchain-snapshot");
```

</deno-tab>
<deno-tab value="cli" label="命令行">

```bash
deno sandbox snapshots delete my-toolchain-snapshot
```

</deno-tab>
</deno-tabs>

### 卷 和 快照对比

| 特性         | 卷（Volumes）                      | 快照（Snapshots）                  |
| ------------ | --------------------------------- | --------------------------------- |
| 访问权限     | 读写                              | 只读                              |
| 挂载点       | 任意路径，启动卷可用作根目录       | 仅根文件系统                      |
| 使用场景     | 缓存、数据库、安装软件             | 预安装的软件、工具链              |
| 并发使用     | 同时只能一个沙箱挂载               | 多个沙箱可以同时使用              |
| 区域         | 必须与沙箱区域匹配                 | 必须与沙箱区域匹配                |