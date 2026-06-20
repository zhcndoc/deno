---
last_modified: 2026-01-28
title: "开始使用"
description: "启用 Deno Sandbox、创建你的第一个 microVM、运行命令、暴露服务以及管理密钥的分步指南。"
---

要使用 Deno Sandbox，你需要一个 Deno Deploy 账户。如果你还没有，
可以在 [console.deno.com](https://console.deno.com) 注册一个免费账户。

## 访问 Deno Sandbox 仪表板

1. 访问 [console.deno.com](https://console.deno.com/) 并使用你的
   Deploy 账户登录。
2. 选择或创建你想运行 Deno Sandbox 的组织。
3. 打开 **Sandboxes** 选项卡，查看现有沙箱、生命周期用量和
   访问令牌。

Deno Sandbox 和 Deno Deploy 应用共享相同的组织边界，因此你可以在这两个产品之间
复用成员、令牌和可观测性设置。

## 创建组织令牌

`@deno/sandbox` SDK 使用 `DENO_DEPLOY_TOKEN` 环境变量进行身份验证。
从 **Settings → Organization tokens** 生成它，复制其值，
并妥善保存。然后在你的本地 shell 或 CI 任务中导出它：

```bash
export DENO_DEPLOY_TOKEN=<your-token>
```

![Deno Deploy 组织令牌界面。](/sandbox/images/org-tokens.webp)

:::tip 令牌安全

请像对待任何其他生产环境密钥一样对待此令牌。如果它曾经暴露，
请从仪表板中轮换它。

:::

## 安装 SDK

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

该 SDK 可在 Deno 和 Node.js 环境中使用。

```bash
# 使用 Deno
deno add jsr:@deno/sandbox

# 使用 npm
npm install @deno/sandbox

# 使用 pnpm
pnpm install jsr:@deno/sandbox

# 使用 yarn
yarn add jsr:@deno/sandbox
```

</deno-tab>
<deno-tab value="python" label="Python">

该 SDK 适用于 `>=3.10` 版本的 Python。

```bash
# 使用 uv 安装
uv add deno-sandbox

# 或使用 pip
pip install deno-sandbox
```

</deno-tab>
</deno-tabs>

## 创建你的第一个沙箱

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx title="main.ts"
import { Sandbox } from "@deno/sandbox";
await using sandbox = await Sandbox.create();
await sandbox.sh`ls -lh /`;
```

</deno-tab>
<deno-tab value="python" label="Python">

```py title="main.py"
from deno_sandbox import DenoDeploy

def main():
  sdk = DenoDeploy()

  with sdk.sandbox.create() as sandbox:
    process = sandbox.spawn("ls", args=["-lh"])
    process.wait()

if __name__ == '__main__':
  main()
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py title="main.py"
import asyncio
from deno_sandbox import DenoDeploy

async def main():
  sdk = DenoDeploy()

  async with sdk.sandbox.create() as sandbox:
    process = await sandbox.spawn("ls", args=["-lh"])
    await process.wait()

if __name__ == '__main__':
  asyncio.run(main())
```

</deno-tab>
</deno-tabs>

## 运行你的沙箱代码

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

此代码需要访问网络，以连接到创建沙箱的 Deploy 边缘节点，并且还需要访问环境变量，
以便使用 Deploy API 进行身份验证，因此我们会在 `deno run` 命令中传入 `--allow-net`
和 `--allow-env` 标志（或者使用简写 `-EN`）。

```bash
deno -EN main.ts
```

</deno-tab>
<deno-tab value="python" label="Python">

要运行我们刚刚创建的脚本，请执行：

```bash
uv run main.py
```

</deno-tab>
</deno-tabs>

你创建的任何沙箱都会列在你的 Deno Deploy 组织的 **Sandboxes** 选项卡中。

![Deno Deploy 控制台中创建的沙箱列表。](/sandbox/images/sandbox-list.webp)

沙箱的详细信息会显示在其 **Event log** 中。

![Deno Deploy 控制台中的沙箱事件日志详情。](/sandbox/images/sandbox-event-log.webp)

## 配置你的沙箱

使用 `Sandbox.create()` 创建沙箱时，你可以使用以下选项进行配置：

- <code class="js-only">allowNet</code><code class="py-only">allow_net</code>：
  允许的出站主机可选列表。参见
  [出站网络控制](./security#outbound-network-control)。
- `secrets`：用于出站请求的密钥替换规则。参见
  [密钥隐藏与替换](./security#secret-redaction-and-substitution)。
- `region`：创建沙箱的 Deploy 区域。
- <code class="js-only">memoryMb</code><code class="py-only">memory_mb</code>：
  分配给沙箱的内存量。
- `timeout`：沙箱的超时时间。
- `labels`：用于帮助识别和管理沙箱的任意键/值标签

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await using sandbox = await Sandbox.create({
  allowNet: ["api.stripe.com", "api.openai.com"], // 可选：此沙箱可以与之通信的主机列表
  region: "ams", // 可选：选择 Deploy 区域
  memoryMb: 1024, // 可选：选择 RAM 大小（768-4096）
});
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create(
  allow_net=["api.stripe.com", "api.openai.com"],  # 可选：此沙箱可以与之通信的主机列表
  region="ams",  # 可选：选择 Deploy 区域
  memory_mb=1024,  # 可选：选择 RAM 大小（768-4096）
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  allow_net=["api.stripe.com", "api.openai.com"],  # 可选：此沙箱可以与之通信的主机列表
  region="ams",  # 可选：选择 Deploy 区域
  memory_mb=1024,  # 可选：选择 RAM 大小（768-4096）
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

## 运行命令和脚本

Deno Sandbox 提供了熟悉的文件系统和进程 API，可用于运行命令、
上传文件以及启动长时间运行的服务。

例如，你可以列出根目录中的文件：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```ts
await sandbox.sh`ls -lh /`;
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
process = sandbox.spawn("ls", args=["-lh", "/"])
process.wait()
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
process = await sandbox.spawn("ls", args=["-lh", "/"])
await process.wait()
```

</deno-tab>
</deno-tabs>

或者从本地文件系统上传一个脚本并运行它：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```ts
// 将文件上传到沙箱中的指定路径
await sandbox.fs.upload("./local-hello.ts", "./hello.ts");
const proc = await sandbox.spawn("deno", {
  args: ["run", "hello.ts"],
  stdout: "piped",
});
for await (const chunk of proc.stdout) {
  console.log(new TextDecoder().decode(chunk));
}
await proc.status;
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
# 将文件上传到沙箱中的指定路径
sandbox.fs.upload("./local-hello.py", "./hello.py")
proc = sandbox.spawn("python", args=["hello.py"], stdout="piped")
for chunk in proc.stdout:
  print(chunk.decode())
proc.wait()
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
# 将文件上传到沙箱中的指定路径
await sandbox.fs.upload("./local-hello.py", "./hello.py")
proc = await sandbox.spawn("python", args=["hello.py"], stdout="piped")
async for chunk in proc.stdout:
  print(chunk.decode())
await proc.wait()
```

</deno-tab>
</deno-tabs>

你可以在命令之间保留状态，流式传输 stdout 和 stderr，或为 agent 风格的工作流打开
交互式 REPL。

## 从 Deno Sandbox 部署

下面的代码片段演示了一个端到端工作流：它创建一个 Deploy 应用，
启动一个高内存沙箱用于更重的构建，在该 VM 内搭建并构建一个 Next.js
项目，然后调用 `sandbox.deno.deploy()` 推送编译后的工件，同时将构建日志流式输出回你的终端。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Client, Sandbox } from "@deno/sandbox";

const client = new Client();
const app = await client.apps.create();

await using sandbox = await Sandbox.create({ memoryMb: 4096 });
console.log("Created sandbox", sandbox);

await sandbox
  .sh`deno -A npm:create-next-app@latest --yes --skip-install my-app`;
await sandbox.sh`cd my-app && deno install`;
await sandbox.sh`cd my-app && deno task build`;
await sandbox.sh`cd my-app && du -sh .`;
const build = await sandbox.deno.deploy(app.slug, {
  path: "my-app",
  production: true,
  build: {
    entrypoint: "node_modules/.bin/next",
    args: ["start"],
  },
});

for await (const log of build.logs()) {
  console.log(log.message);
}
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

app = sdk.apps.create(slug="my-next-app")

with sdk.sandbox.create(memory_mb=4096) as sandbox:
  print(f"Created sandbox {sandbox.id}")

  sandbox.spawn("deno", args=["-A", "npm:create-next-app@latest", "--yes", "--skip-install", "my-app"]).wait()
  sandbox.spawn("sh", args=["-c", "cd my-app && deno install"]).wait()
  sandbox.spawn("sh", args=["-c", "cd my-app && deno task build"]).wait()

  build = sandbox.deno.deploy(
    app["slug"],
    path="my-app",
    production=True,
    entrypoint="node_modules/.bin/next",
    args=["start"],
  )

  for log in build.logs():
    print(log["message"])
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

app = await sdk.apps.create(slug="my-next-app")

async with sdk.sandbox.create(memory_mb=4096) as sandbox:
  print(f"Created sandbox {sandbox.id}")

  proc = await sandbox.spawn("deno", args=["-A", "npm:create-next-app@latest", "--yes", "--skip-install", "my-app"])
  await proc.wait()
  proc = await sandbox.spawn("sh", args=["-c", "cd my-app && deno install"])
  await proc.wait()
  proc = await sandbox.spawn("sh", args=["-c", "cd my-app && deno task build"])
  await proc.wait()

  build = await sandbox.deno.deploy(
    app["slug"],
    path="my-app",
    production=True,
    entrypoint="node_modules/.bin/next",
    args=["start"],
  )

  async for log in build.logs():
    print(log["message"])
```

</deno-tab>
</deno-tabs>

## 调整超时、清理和重新连接

- `timeout: "session"`（默认）会在脚本执行结束后销毁 VM。
- 提供诸如 `"5m"` 之类的持续时间，即使客户端断开连接，也能让沙箱保持存活。之后你可以通过 `Sandbox.connect({ id })` 重新连接以继续工作。
- 当你的代码释放最后一个引用时（或者 `await using` 块结束时），清理会自动发生。只有在你需要提前关闭 VM 时才调用 `sandbox.kill()`。

可观测性与 Deno Deploy 共享：每个沙箱的日志、跟踪和指标都会显示在 Deno Deploy 仪表板中，因此你可以像调试生产应用一样调试代理运行。
