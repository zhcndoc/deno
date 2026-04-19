---
last_modified: 2026-02-24
title: "使用快照启动一个 Python 环境"
description: "创建一个沙箱，预加载 Python + 科学计算包，对其进行快照，并启动无需额外配置的沙箱来运行一个曼德尔布罗特探索器。"
url: /examples/snapshot_python_tutorial/
---

在本教程中，我们将使用 Deno Sandbox SDK 创建一个可启动的卷，
在该卷上设置开发环境并生成快照以供未来使用。
这种工作流程非常适合像 Python 这样的语言，因为环境搭建可能比较慢，
但是生成的文件系统可以在多个沙箱间重复使用。

要使用 Deno Sandbox SDK，你需要一个 Deno Deploy 账户和访问令牌。
你可以[免费注册](https://console.deno.com/deploy)，并在控制面板的 **Sandboxes** → **Overview** → **+ Create Token** 下创建访问令牌。

## 创建一个基础的 Deno 应用并安装 @deno/sandbox SDK

首先，为此项目创建一个新目录并初始化一个 Deno 应用：

```sh
deno init my-snapshot-project
cd my-snapshot-project
deno add jsr:@deno/sandbox
```

## 1. 将 Python 烘焙进可启动卷

创建一个新文件 `setup_python.ts`。该脚本将创建一个新卷，启动它，安装 Python 及一些流行库，然后对卷进行快照以便未来使用。想法是在这里完成耗时的设置工作一次，之后就可以复用快照来在几秒内启动新的沙箱。

在此文件中，我们将导入 Sandbox SDK，创建客户端并设置一个函数以初始化带有 Python 的卷：

```ts title="setup_python.ts"
import { SandboxClient } from "@deno/sandbox";
const client = new SandboxClient();

async function initSandbox() {
  // ... 接下来填写这里
}
```

在该函数内部，我们创建一个容量为 10GB 的新卷，给它一个简便引用的 slug，并指定区域：

```ts title="setup_python.ts (cont.)"
const volume = await client.volumes.create({
  region: "ord",
  slug: "fun-with-python",
  capacity: "10GB",
});
```

接着，我们启动一个沙箱，将该卷作为根文件系统。`await using` 语法确保完成后沙箱会自动清理：

```ts title="setup_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
});
```

我们使用 `apt` 和 `pip` 安装 Python 以及一些常用科学库。注意 pip 中使用了 `--break-system-packages`，因为该沙箱拥有整个系统权限，可以安全地绕过 pip 通常防止修改系统文件的保护：

```ts title="setup_python.ts (cont.)"
await sandbox.sh`sudo apt-get update -qq`;
await sandbox
  .sh`sudo apt-get install -y python3 python3-pip python3-venv python3-dev build-essential`;

await sandbox.sh`sudo pip3 install --break-system-packages \
    requests \
    httpx \
    numpy \
    pandas \
    python-dotenv`;

console.log("正在验证 Python 安装...");

await sandbox.sh`python3 --version`;
await sandbox.sh`pip3 --version`;
```

该函数的最后一步是返回 `volume.id`，以便传递给快照步骤使用：

```ts title="setup_python.ts (cont.)"
return volume.id;
```

（记得在此 return 语句后用 `}` 关闭函数。）

接下来调用该函数并对生成的卷进行快照。这样会创建一个 slug 为 `fun-with-python-snapshot` 的新快照，后续可以基于它启动沙箱：

```ts title="setup_python.ts (cont.)"
const volumeId = await initSandbox();

console.log("正在对卷进行快照...");

const snapshot = await client.volumes.snapshot(volumeId, {
  slug: "fun-with-python-snapshot",
});

console.log("已创建 Python 快照 " + snapshot.id);
```

使用带网络和环境权限运行该脚本，以便访问 Sandbox API：

```sh
deno run -N -E setup_python.ts
```

快照是只读的。所有挂载此 slug 的沙箱都会看到已安装好 Python 和上述包的文件系统。

## 直接从快照启动

创建一个新文件 `use_python.ts`。该脚本将直接从前一步创建的快照启动新沙箱，而不运行任何设置命令。这展示了如何复用快照跳过环境配置，直接运行代码。

起初，我们导入 SDK 并创建客户端，方式与前面相同：

```ts title="use_python.ts"
import { Client } from "@deno/sandbox";

const client = new Client();
```

然后创建一个新沙箱，这次我们在 `root` 字段中指定快照 slug，而非卷：

```ts title="use_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: "fun-with-python-snapshot",
  port: 8000,
  timeout: "30m",
});
```

此沙箱设置了 30 分钟超时，并开放了 8000 端口，供我们稍后 Python 应用使用。

目前我们使用一个占位字符串，将在稍后替换成真正的 Python 应用代码，并将它写入沙箱文件系统的 `/tmp/app.py`：

```ts title="use_python.ts (cont.)"
const appCode = `# Python 应用代码放在这里`;

await sandbox.fs.writeTextFile("/tmp/app.py", appCode);
```

最后，我们在后台启动 Python 应用，并打印它可访问的公共 URL。`await p.output()` 会让脚本保持运行状态，从而避免沙箱立即关闭：

```ts title="use_python.ts (cont.)"
const p = await sandbox.sh`python3 /tmp/app.py`.spawn();

console.log("\n曼德尔布罗特探索器正在运行于", sandbox.url);

await p.output();
```

现在我们用一个简单的 Python HTTP 服务器填充 `appCode`，该服务器用 numpy 绘制彩色的 ASCII 曼德尔布罗特分形。这只是个示例，用来展示我们在快照中安装的科学计算包 —— 你可以替换成任意 Python 代码！

你可以从[GitHub 仓库](https://github.com/denoland/tutorial-with-snapshot/blob/7b8e5331ab22968a7fc52dc84e1613072c7494d1/use_python.ts#L18-L131)获取该 Python 代码，并粘贴到 `use_python.ts` 中的 `appCode` 字符串里。

现在准备运行该脚本：

```sh
$ deno run -A use_python.ts
```

在浏览器打开日志输出的 URL，开始缩放吧；每个瓦片都是由你预装在快照里的 numpy 计算驱动！

## 迭代、分叉或清理快照

- 需要调整环境？从快照创建一个可写的分支，启动它，修改包，然后再次生成快照：

  ```ts
  const fork = await client.volumes.create({
    region: "ord",
    slug: "python-sandbox-fork",
    capacity: "10GB",
    from: "fun-with-python-snapshot",
  });
  ```

- 使用完快照？删除它以释放空间：

  ```ts
  await client.snapshots.delete("fun-with-python-snapshot");
  ```

🦕 通过此工作流程，你可以向团队成员、AI 代理或 CI 任务提供一个 slug，让他们几秒内启动一个预装好开发环境的沙箱。安装一次，生成快照，永远跳过环境配置。
