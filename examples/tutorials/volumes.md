---
last_modified: 2026-02-03
title: "Deno Sandbox Volumes 教程"
description: "为你的 Deno 沙箱添加可读写的块存储。"
url: "/examples/volumes_tutorial/"
---

卷是耐用的、区域性的块存储设备，你可以将它们附加到 Deno
沙箱中。它们表现得像普通目录，可以读取和写入文件，这些文件会在沙箱会话之间持久保存。

在本教程中，我们将构建一个可复现的数据准备工作流：一个沙箱
下载训练工件一次，将它们写入持久卷，以后每次沙箱运行都能立即复用该缓存。

我们将：

1. 创建一个名为 `training-cache` 的区域卷。
2. 启动一个“prepare”沙箱，将文件写入该卷的 `/data/cache` 目录中。
3. 几小时后启动一个“serve”沙箱，读取相同的文件以模拟训练作业。
4. 检查使用情况并在完成后拆除全部资源。

## 身份验证并启动客户端

为了使用 Deno 沙箱 API，我们首先需要设置 Deno 沙箱访问令牌。

1. 在 Deno Deploy 控制台，导航到 **沙箱（Sandboxes）** 部分。
2. 创建新令牌，并复制令牌值。
3. 将此令牌设置为本地环境变量 `DENO_DEPLOY_TOKEN`。

然后我们可以使用 SDK 启动客户端：

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

## 为缓存配置存储

选择一个与你计划运行的沙箱匹配的区域。目前只有 `ord`
（芝加哥）支持卷。

我们将为训练缓存卷提供 2GB 的存储空间：

```tsx
const volume = await client.volumes.create({
  slug: "training-cache",
  region: "ord",
  capacity: "2GB",
});

console.log(`已创建卷 ${volume.slug} （容量 ${volume.capacity} 字节）`);
```

卷的 slug 必须在组织内唯一；响应返回 slug 和稳定的 UUID。容量字符串可以是任何介于 300MB 到 20GB 之间的十进制单位（GB/MB/KB）或二进制单位（GiB/MiB/KiB）。

## 仅填充缓存一次

假设你的训练作业需要下载大型数据集或二进制文件。

不是每次运行都拉取，`prepare` 沙箱会将它写入共享卷中。

我们将在沙箱内将卷挂载到路径 `/data/cache`：

```tsx title="main.ts"
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();

const volume = await client.volumes.create({
  slug: "training-cache",
  region: "ord",
  capacity: "2GB",
});

console.log(`已创建卷 ${volume.slug} （容量 ${volume.capacity} 字节）`);

await using sandbox = await Sandbox.create({
  region: "ord",
  volumes: {
    "/data/cache": volume.slug,
  },
  labels: { job: "prepare" },
});

await sandbox.fs.mkdir("/data/cache/datasets", { recursive: true });
await sandbox.fs.writeTextFile(
  "/data/cache/datasets/embeddings.json",
  JSON.stringify({ updatedAt: Date.now(), vectors: [1, 2, 3] }, null, 2),
);

await sandbox.fs.writeTextFile(
  "/data/cache/README.txt",
  "缓存一次，永久复用。\n",
);
```

我们创建了一个沙箱，在其中挂载了卷到 `/data/cache` 目录。然后写入了一些模拟数据集文件。

使用命令 `deno run -A main.ts` 运行此脚本以创建卷并填充数据。

## 稍后复用缓存

数小时（或部署）后，我们启动一个新的沙箱，按 slug 挂载相同卷，并读取文件。这模拟了一个跳过耗时下载步骤的可复现训练运行。

```tsx title="main2.ts"
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({
  region: "ord",
  volumes: {
    "/data/cache": "training-cache",
  },
});

const metadata = await sandbox.fs.readTextFile(
  "/data/cache/datasets/embeddings.json",
);

console.log("加载的缓存数据集：", metadata);
```

使用命令 `deno run -A main2.ts` 运行此脚本，启动新沙箱并读取缓存文件。

因为卷表现得像普通目录，你可以在挂载点直接流式传输日志，运行可执行文件或存储 SQLite 数据库。

## 缓存增长时检查使用情况

你可以列出组织中的卷并查看其当前使用情况，这在规划将来工作负载容量时非常有帮助。

```tsx
const page = await client.volumes.list({ search: "training" });
for (const vol of page.items) {
  console.log(
    `${vol.slug} 使用了 ${vol.estimatedFlattenedSize}/${vol.capacity} 字节`,
  );
}

const latest = await client.volumes.get(volume.slug);
console.log(
  `最近的使用估计：${latest?.estimatedFlattenedSize} 字节`,
);
```

遥测数据可能会比实际使用情况滞后几分钟，因此选择 `capacity` 时应留有余量。

## 实验结束时清理

完成使用后，可以删除卷以释放资源：

```tsx
await client.volumes.delete(volume.slug);
```

删除流程既是有意为之，也有保护措施：

1. 卷会立即标记为已删除，并从未来的沙箱请求中分离——其 slug 会重新可用。
2. 底层块存储会在 24 小时宽限期后销毁，如误删可联系支持。

🦕 你现在拥有了一个跨沙箱运行缓存工件的实战模式。替换成你自己的数据集、二进制文件或构建产物，加速任何需要持久存储且不离开沙箱环境的作业。