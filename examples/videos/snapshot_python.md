---
title: "使用快照安全执行云端代码"
description: "Deno Sandbox 允许你以编程方式启动隔离的云端虚拟机。通过快照功能，你可以预先安装整个环境，然后从快照中启动，无需每次都等待安装。"
url: /examples/snapshot_python_video/
videoUrl: https://youtu.be/mASEjxpuDTM
layout: video.tsx
---

## 视频描述

Deno Sandbox 允许你以编程方式启动隔离的云端虚拟机。借助快照功能，你可以预先安装整个环境，然后从快照中启动，无需每次都等待安装。

在本视频中，我们展示了快照工作流程的完整过程：

- 创建一个云端卷并启动沙箱
- 安装 Python 及所需的包和构建工具
- 快照该卷 —— 你的环境将被冻结并可重复使用
- 从该快照即时启动新的沙箱，所有内容均已预装

作为演示，我们运行了一个实时交互式的 Mandelbrot 分形浏览器。一个完全部署在沙箱内部的 HTTP 服务器，代码从未接触宿主机。

这是安全执行 AI 生成代码、用户提交脚本或任何你想完全隔离且可复现的工作负载的基础。

## 文本记录与代码

Python 无处不在 —— 数据科学、AI、脚本、网络应用，它是大家常用的语言。但你很快会遇到一个问题。Python 环境可能非常混乱；系统 Python、虚拟环境相互冲突，还有包需要本地构建工具。它可能是个大麻烦。

现在，假设你想运行一段非自己编写的 Python 代码。也许它是 AI 生成的，或者来自用户，或者只是试验性质。你真的不想让它接触你的机器。

今天，我将向你展示如何启动一个完全隔离的云沙箱，预装好 Python。我们将在里面运行一个由 Numpy 驱动的 Mandelbrot 分形浏览器，并作为一个实时 Web 应用提供，整个过程只需约 60 行 TypeScript，你的机器一次 Python 代码也不会运行。我们开始吧。

### 初始化一个基本的 Deno 项目

```sh
deno init my-snapshot-project
cd my-snapshot-project
deno add jsr:@deno/sandbox
```

这是一个非常基础的 Deno 项目。我们唯一用到的依赖是来自 JSR 的 Deno Sandbox SDK。该 SDK 用于以编程方式创建和管理云沙箱。我们将编写两个 TypeScript 文件。

`setup_python.ts`：这段代码只运行一次，用来创建沙箱，安装 Python 和一堆有用的包，然后做快照。

`use_python.ts`：当我们想在沙箱内实际使用 Python 环境时运行的脚本。

这种两步模式是关键。重活一次做完，结果可以反复利用。和 Docker 镜像或虚拟机快照类似。它们构建可能耗时且昂贵，但使用起来便宜快速。

### 设置快照

接下来，我们看看 `setup_python.ts` 文件。我们用 Deno Sandbox SDK 创建一个客户端。

```ts title="setup_python.ts"
import { SandboxClient } from "@deno/sandbox";
const client = new SandboxClient();

async function initSandbox() {
  // ... 接下来我们会补充内容
}
```

然后，我们创建一个 10GB 容量的卷。我这里使用的是 `ord` 区域，你可以选择任何区域。区域决定了沙箱运行的位置，离你越近延迟越低。

```ts title="setup_python.ts (cont.)"
const volume = await client.volumes.create({
  region: "ord",
  slug: "fun-with-python",
  capacity: "10GB",
});
```

接下来，我们启动一个沙箱，把该卷挂载为根文件系统。这里用到了 `await using` 语法。这是 JavaScript 的显式资源管理。当此作用域结束时，沙箱会自动销毁，我们不需要额外操作清理。

```ts title="setup_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: volume.slug,
});
```

在沙箱里，我们运行安装命令。首先是 `apt-get update`，接着安装 Python 3、Python 3 pip、Python 3 虚拟环境、Python 3 开发包和构建必备工具。最后一个很重要，提供了编译器，编译带有本地扩展的包必需用它。

然后安装我们的包。包括 requests、httpx、numpy、pandas、python-dotenv。我们用了 `--break-system-packages` 标志，因为沙箱里整个系统由我们掌控，不必受 pip 通常限制。最后通过打印 Python 和 pip 版本确认一切就绪。

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

console.log("Verifying Python installation...");

await sandbox.sh`python3 --version`;
await sandbox.sh`pip3 --version`;

return volume.id;
```

完成后，调用 `client.volumes.snapshot` 来快照这个卷，传入卷 ID 和快照的 slug。

```ts title="setup_python.ts (cont.)"
const volumeId = await initSandbox();

console.log("Snapshotting the volume...");

const snapshot = await client.volumes.snapshot(volumeId, {
  slug: "fun-with-python-snapshot",
});

console.log("Created Python snapshot " + snapshot.id);
```

运行这个脚本时，使用 dino run 命令，开通网络和环境变量权限即可，然后就无需再运行它了。

```sh
deno run -N -E setup_python.ts
```

### 从快照启动

现在，看一下 `use_python.ts`。首先，我们从刚才创建的快照启动沙箱。无需安装步骤，快照已包含一切。设置暴露端口 8000，并设置 30 分钟超时。

```ts title="use_python.ts (cont.)"
await using sandbox = await client.sandboxes.create({
  region: "ord",
  root: "fun-with-python-snapshot",
  port: 8000,
  timeout: "30m",
});
```

然后使用 `sandbox.fs.writeTextFile` 把我们的 Python 应用代码写入沙箱文件系统的临时目录。这种方式规避了 shell 转义问题，传入的是 TypeScript 字符串。

```ts title="use_python.ts (cont.)"
const appCode = `# Python app code goes here`;

await sandbox.fs.writeTextFile("/tmp/app.py", appCode);
```

[Python 应用本身](https://github.com/denoland/tutorial-with-snapshot/blob/7b8e5331ab22968a7fc52dc84e1613072c7494d1/use_python.ts#L18-L131) 是一个自包含的 HTTP 服务器。你可以从仓库复制代码，粘贴到 `appCode` 字符串中。

```ts title="use_python.ts (cont.)"
const p = await sandbox.sh`python3 /tmp/app.py`.spawn();

console.log("\nMandelbrot Explorer running at", sandbox.url);

await p.output();
```

`sandbox.url` 返回一个公共 URL，可以访问到端口 8000。`p.output()` 使脚本保持运行。

看一下沙箱内部执行的内容。Python 应用用 NumPy 计算 Mandelbrot 集合。经典的分形，通过反复计算 z = z^2 + c，遍历复数平面上的点，统计每个点逃逸到无穷大的步数。NumPy 运算迅速，结果以颜色块字符渲染，根据逃逸时间从电蓝到绿色到深红，永不逃逸点则着实黑色。

运行 `use_python.ts` 脚本：

```sh
deno run -A use_python.ts
```

然后打开浏览器访问该 URL。

浏览器中能看到一个漂亮的交互式应用。每个导航按钮其实是带查询参数的链接，用于调整视野。当点击放大时，服务器重新计算新区域的分形并返回新页面。无 JavaScript，无 WebSocket，纯 HTTP。整个过程运行于云端一次性 Linux 虚拟机中。使用 Python、NumPy 和 Web 服务器，但都不运行在本地机器上。

这个模式的用途远不止分形。

- 如果你构建一个工具，让 Claude 或其他模型为你写 Python 代码，可以把代码运行在沙箱中，代码无法触碰你的系统、读取文件，也无法窃取你的 API 密钥。

- 如果你构建一个数据分析工具，让用户上传自己的 Python，同理。每个用户都有隔离环境，所需包预先打包入快照。

- 快照是时间静止的快照。每次用快照启动的沙箱都是一致的。无需担心“只在我电脑上能运行”或漂移问题。

- 最后，由于 NumPy 和其他包已经包含在快照，快照启动时间不足 200 毫秒，足够快速按需调用。

本演示用到的所有代码都可在[教程示例](/examples/snapshot_python_tutorial/)中找到。使用沙箱 SDK 需要 Dino deploy 账号。

如果想更进一步，当然可以用你自己的 Python 脚本替换分形，或者在设置中添加不同的包。

🦕 快照方式让你可以构建完全符合需求的环境，并无限次重复使用。
