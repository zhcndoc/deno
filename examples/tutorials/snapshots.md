---
title: "Deno 沙箱快照教程"
description: "使用只读镜像创建隔离且可复现的环境。"
url: "/examples/snapshots_tutorial/"
---

快照对于创建只读镜像非常有用，这些镜像可以用来实例化多个拥有相同基础环境的沙箱。如果你经常需要创建带有相同依赖或工具集，或者需要较长设置时间的沙箱，这很实用。

让我们来构建一个“秒开机”沙箱：我们将预装 Node.js、TypeScript 和一个 CLI 到可引导卷中，对其快照，然后启动多个继承同一环境的沙箱，而无需再次运行安装程序。

我们的步骤是：

1. 从 `builtin:debian-13` 基础镜像开始。
2. 只安装一次 Node.js 和一些全局工具。
3. 将准备好的卷快照为 `my-toolchain-snapshot`。
4. 从该快照启动新的沙箱，验证工具在沙箱启动时即可使用。

## 认证并初始化客户端

为了使用 Deno 沙箱 API，我们首先需要设置一个 Deno 沙箱访问令牌。

1. 在你的 Deno Deploy 控制台，导航至 **Sandboxes** 部分。
2. 创建一个新令牌，复制令牌值。
3. 将该令牌设置为本地环境变量 `DENO_DEPLOY_TOKEN`。

然后我们可以用 SDK 初始化客户端：

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

## 创建一个可引导的工作空间

本教程中，我们将使用 `ord` 区域，并在卷、快照及沙箱中统一使用该区域。

基于 `builtin:debian-13` 镜像创建一个新卷：

```tsx
const volume = await client.volumes.create({
  region: "ord",
  slug: "my-toolchain",
  capacity: "10GiB",
  from: "builtin:debian-13",
});

console.log(`可引导卷已准备好: ${volume.slug}`);
```

设置 `from` 参数使该卷具备引导功能。沙箱可以将其挂载为根文件系统，并直接写入更改。

## 定制镜像

我们安装 Node.js、npm 和 TypeScript 到该卷中。

```tsx
await using build = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
  labels: { job: "toolchain-build" },
});

await build.sh`sudo apt-get update`;
await build.sh`sudo apt-get install -y nodejs npm`;
await build.sh`npm install -g typescript`;
await build.fs.writeTextFile(
  "/opt/banner.txt",
  "该沙箱启动时预装了 Node.js、npm 和 TypeScript。\n",
);
```

该会话中的所有操作都会持久保存回可引导卷。

## 快照结果

卷定制好后，我们可以将其快照以便快速复用：

```tsx
const snapshot = await client.volumes.snapshot(volume.id, {
  slug: "my-toolchain-snapshot",
});

console.log(`快照已准备好: ${snapshot.slug} (${snapshot.region})`);
```

通过运行命令 `deno run -A main.ts` 在挂载可引导卷的沙箱内执行安装步骤。

你也可以用 CLI 创建快照，命令如下：

```bash
deno sandbox snapshots create my-toolchain my-toolchain-snapshot
```

快照是只读副本，可以同时支持多个沙箱。因为文件系统已预先配置，启动速度大幅提升。

## 从快照启动并使用

快照准备就绪后，我们可以启动新的沙箱，将该快照挂载为根文件系统：

```tsx
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();

await using dev = await client.sandboxes.create({
  region: "ord",
  root: snapshot.slug,
  labels: { job: "dev-shell" },
});

const nodeVersion = await dev.sh`node --version`;
const tscVersion = await dev.sh`tsc --version`;
const banner = await dev.fs.readTextFile("/opt/banner.txt");

console.log({ nodeVersion: nodeVersion.stdout, tscVersion: tscVersion.stdout });
console.log(banner);
```

该沙箱内的写操作是短暂的，会话结束后消失；但读取操作直接来自快照的文件系统，因此每个沙箱都能瞬间看到同一个精心配置的环境。

## 快照的迭代或废弃

需要更新的工具链？你可以从快照派生一个可写卷，进行修改，然后再次快照。

```tsx
const fork = await client.volumes.create({
  region: "ord",
  slug: "my-toolchain-fork",
  capacity: "10GiB",
  from: snapshot.slug,
});
```

当快照过时时，可以将其删除：

```tsx
await client.snapshots.delete(snapshot.slug);
```

🦕 现在你拥有了一个具体的工作流程，用于发布可复现环境：一次构建，快照保存，并将快照别名交给团队成员，令其几秒内启动完全配置好的沙箱。