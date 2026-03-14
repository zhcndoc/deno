---
title: "Deno 沙箱"
description: "Deno Deploy 上 Deno 沙箱微虚拟机平台的概览，包括其功能、安全模型和理想使用场景。"
---

Deno 沙箱为 Deno Deploy 带来了即时的 Linux 微虚拟机。每个沙箱启动时间不到一秒，且通过 `@deno/sandbox` SDK 完全由 API 驱动，并且一旦使用完毕立即销毁。结果是按需计算，感觉就像打开了一个终端，但拥有生产级的隔离和可观察性。

## 什么是 Deno 沙箱？

- 由 Deno Deploy 编排的独立 Linux 微虚拟机
- 设计用于运行不受信任的代码
- 即时可用；启动时间以毫秒计
- 默认是临时的，但可超出当前连接生命周期持续存在
- 可通过[卷](./volumes/)访问持久存储
- 完全由 API 驱动：可以通过代码创建、运行命令和销毁

## 理想使用场景

Deno 沙箱专注于需要生成、评估或代表不受信任用户安全执行代码的工作负载。它们适合用于：

- 需要在推理过程中运行代码的 AI 代理和协同助手
- 安全的插件或扩展系统
- 氛围编程和协作 IDE 体验
- 临时的 CI 运行器和冒烟测试
- 客户提供或用户生成的代码路径
- 即时开发服务器和预览环境

这不仅是为开发者构建的计算，更是为构建软件的软件而设。

## 运行真实工作负载

一旦 Deno 沙箱创建，就会获得完整的 Linux 环境，包括文件、进程、包管理器和后台服务：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Sandbox } from "@deno/sandbox";
await using sandbox = await Sandbox.create();
await sandbox.sh`ls -lh /`;
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

def main():
  sdk = DenoDeploy()

  with sdk.sandbox.create() as sandbox:
    process = sandbox.spawn("ls", args=["-lh"])
    process.wait()
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
from deno_sandbox import AsyncDenoDeploy

async def main():
  sdk = AsyncDenoDeploy()

  async with sdk.sandbox.create() as sandbox:
    process = await sandbox.spawn("ls", args=["-lh"])
    await process.wait()
```

</deno-tab>
</deno-tabs>

## 安全策略

配置沙箱，使其只能与批准的主机通信：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await Sandbox.create({
  allowNet: ["google.com"],
});
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandboxes.create(allowNet=["google.com"]) as sandbox:
  print(f"沙箱 {sandbox.id} 已准备好。")
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandboxes.create(allowNet=["google.com"]) as sandbox:
  print(f"沙箱 {sandbox.id} 已准备好。")
```

</deno-tab>
</deno-tabs>

秘密信息绝不会进入沙箱环境。只有当沙箱向批准的主机发出外部请求时，才会替换为真实值。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await Sandbox.create({
  allowNet: ["api.openai.com"],
  secrets: {
    OPENAI_API_KEY: {
      hosts: ["api.openai.com"],
      value: process.env.OPENAI_API_KEY,
    },
  },
});
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```python
sdk = AsyncDenoDeploy()

async with sdk.sandboxes.create(
  allowNet=["api.openai.com"],
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    }
  },
) as sandbox:
  print(f"沙箱 {sandbox.id} 已准备好。")
```

</deno-tab>
<deno-tab value="python" label="Python">

```python
sdk = DenoDeploy()

with sdk.sandboxes.create(
  allowNet=["api.openai.com"],
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    }
  },
) as sandbox:
  print(f"沙箱 {sandbox.id} 已准备好。")
```

</deno-tab>
</deno-tabs>

## 为即时、安全计算而生

开发者和 AI 系统现在期望计算即刻响应、安全且全球可访问。Deno 沙箱提供了：

- 即时启动，无需管理预热池
- 专用隔离及严格的网络出口策略
- 与 Deno Deploy 日志和跟踪并行的完整可观察性
- 每个沙箱支持区域选择、内存大小和生命周期控制
- 代码准备好生产后可无缝交接至 Deno Deploy 应用

Deno Deploy 和 Deno 沙箱共同构成单一工作流：代码被创建，在沙箱中验证安全，然后无需新基础设施或编排层即能全球部署。

## 运行时支持

Deno 沙箱 SDK 已在以下环境测试并支持：

- **Deno:** 最新稳定版本
- **Node.js:** 版本 24 及以上
- **Python:** 3.10 及以上

你可以从任何能够向 Deno Deploy API 发起 HTTPS 出站请求的环境中使用 Deno 沙箱。JavaScript SDK 可在 [jsr](https://jsr.io/@deno/sandbox) 和 [npm](https://www.npmjs.com/package/@deno/sandbox) 以 `@deno/sandbox` 名称获得（JSR 包针对 Deno 使用进行了优化）。Python SDK 可在 [PyPI](https://pypi.org/project/deno-sandbox/) 以 `deno-sandbox` 名称获得。有关直接 API 访问，请参阅 [REST API 文档](https://console.deno.com/api/v2/docs)。

:::note await using 支持

[`await using`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/await_using) 语法要求 Node.js 24 及以上版本。如果项目使用较低版本的 Node.js，请改用 try/finally 块：

```ts
import { Sandbox } from "@deno/sandbox";

const sandbox = await Sandbox.create();
try {
  // ... 使用 sandbox ...
} finally {
  await sandbox.close();
}
```

:::

## 限制

Deno 沙箱有以下限制：

- **内存：**768 MB 到 4096 MB（默认 1.2GB），每个沙箱可配置
- **CPU:** 2 vCPU
- **生命周期：**每个沙箱可配置，绑定于会话，最长 30 分钟
- **磁盘：**10 GB 临时存储
- **并发数：**每个组织限制 5 个并发沙箱（这是 Deno 沙箱预发布阶段的默认并发限制。如需更高限制，请联系 [deploy@deno.com](mailto:deploy@deno.com)。）

超出这些限制可能导致沙箱被限流或终止。

## 区域

当前支持的区域有：

- `ams` - 荷兰阿姆斯特丹
- `ord` - 美国芝加哥

创建新沙箱时，可以指定沙箱所在区域：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({ region: "ams" });
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

def main():
  sdk = DenoDeploy()

  with sdk.sandboxes.create(region="ams") as sandbox:
    print(f"沙箱 {sandbox.id} 已准备好。")
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
from deno_sandbox import AsyncDenoDeploy

async def main():
  sdk = AsyncDenoDeploy()

  async with sdk.sandboxes.create(region="ams") as sandbox:
    print(f"沙箱 {sandbox.id} 已准备好。")
```

</deno-tab>
</deno-tabs>

若未指定，沙箱将创建在默认区域。

## 了解更多

准备试用吗？请跟随 [入门指南](./getting_started) 创建你的第一个沙箱，获取访问令牌，并在 Deploy 边缘运行代码。