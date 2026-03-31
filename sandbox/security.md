---
title: 安全性
description: "了解 Deno Sandbox 背后的纵深防御模型：隔离、密钥、网络控制和审计。"
---

Deno Sandbox 专为不受信任或 AI 生成的工作负载设计。每个虚拟机都是
短暂存在的，在虚拟机管理程序（hypervisor）级别隔离，并受严格的出站
策略管理。这让你能够运行任意代码，同时保障组织数据和
基础设施的安全。

## 密钥编辑和替换

密钥永远不会进入沙箱环境变量。相反，Deno Deploy
仅在沙箱发起对批准主机的出站请求时替换密钥。创建沙箱时配置密钥：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```ts
await using sandbox = await Sandbox.create({
  secrets: {
    OPENAI_API_KEY: {
      hosts: ["api.openai.com"],
      value: process.env.OPENAI_API_KEY,
    },
    ANTHROPIC_API_KEY: {
      hosts: ["api.anthropic.com"],
      value: process.env.ANTHROPIC_API_KEY,
    },
  },
});
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
import os
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create(
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    },
    "ANTHROPIC_API_KEY": {
      "hosts": ["api.anthropic.com"],
      "value": os.environ.get("ANTHROPIC_API_KEY"),
    },
  }
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
import os
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  secrets={
    "OPENAI_API_KEY": {
      "hosts": ["api.openai.com"],
      "value": os.environ.get("OPENAI_API_KEY"),
    },
    "ANTHROPIC_API_KEY": {
      "hosts": ["api.anthropic.com"],
      "value": os.environ.get("ANTHROPIC_API_KEY"),
    },
  }
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

在沙箱内部，环境变量保存的是占位符：

```bash
echo $ANTHROPIC_API_KEY
# <placeholder>
```

这确认用户代码无法读取真实密钥。这阻止了最常见的 AI 攻击路径——通过提示注入后窃取密钥，同时允许你的自动化安全调用第三方 API。

## 出站网络控制

默认情况下，Deno Sandbox 允许无限制的出站网络访问。使用
`allowNet` 选项限制流量到特定主机：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```ts
await using sandbox = await Sandbox.create({
  allowNet: ["api.openai.com", "*.anthropic.com"],
});
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create(
  allow_net=["api.openai.com", "*.anthropic.com"]
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(
  allow_net=["api.openai.com", "*.anthropic.com"]
) as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

支持的模式包括：

| 模式              | 匹配                           |
| ----------------- | ----------------------------- |
| `example.com`     | 精确主机名，任意端口           |
| `example.com:443` | 仅精确主机名的 443 端口        |
| `*.example.com`   | example.com 的任意子域         |
| `192.0.2.1`       | 精确 IPv4 地址                |
| `[2001:db8::1]`   | 精确 IPv6 地址                |

当提供了 `allowNet` 时，任何到非允许列表主机的出站请求都会被阻止。未提供 `allowNet` 时，允许所有出站请求。将它与
[密钥选项](#密钥编辑和替换)结合使用，确保即使代码被诱导调用意外端点，也不会发送凭据。

## 文件系统隔离与清理

- MicroVM 从干净的磁盘镜像启动。你上传的任何文件仅在沙箱生命周期内存在，除非你显式挂载卷。
- 当对沙箱的最后引用被释放（或调用了 `sandbox.kill()`），虚拟机被销毁且磁盘被清理，防止残留状态。
- 卷提供共享存储，但每个沙箱访问必须明确授权，且可按需挂载为只读。

## 审计和可观测性

- 每个命令、HTTP 请求和 SSH 会话都可以在 Deno Deploy 仪表盘追踪，给你代理行为的凭证和记录。
- 创建沙箱时附加元数据（如 `metadata: { owner: "agent" }`），使日志和追踪清楚显示是谁发起的活动。