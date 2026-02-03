---
title: "沙盒生命周期"
description: "了解沙盒存活的时间，如何延长或重新连接沙盒，以及什么时候将工作提升为 Deploy 应用。"
---

沙盒是有意设计为短暂存在的。它们在毫秒内启动，完成任务后立即消失——减少不受信任代码的攻击面，并免去基础设施的维护工作。不过，你可以精确控制沙盒的存活时间，甚至在需要调试时后续重新连接。

## 默认生命周期：`"session"`

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await using sandbox = await Sandbox.create();
```

若不设置任何选项，沙盒会在脚本执行期间存活。一旦关闭 `Sandbox` 实例，微虚拟机（microVM）会关闭并释放所有资源。这样可以保持成本可预测性，防止出现孤儿基础设施。
</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create() as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create() as sandbox:
  print(f"Sandbox {sandbox.id} is ready.")
```

</deno-tab>
</deno-tabs>

默认情况下，沙盒在你的脚本执行期间存活。关闭沙盒实例后，微虚拟机关闭并释放所有资源。这样可以保持成本可控，并防止产生孤儿基础设施。

## 基于时长的生命周期

提供一个时长字符串，可以让沙盒在客户端断开连接后继续存活：

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const sandbox = await Sandbox.create({ timeout: "5m" });
const id = sandbox.id;
await sandbox.close(); // 进程现在可以退出了

// 稍后
const reconnected = await Sandbox.connect({ id });
```

支持的后缀：`s`（秒）和 `m`（分钟）。示例：`"30s"`、`"5m"`、`"90s"`。此模式适用于手动检查、SSH 调试，或当机器人需要中途恢复工作时。
</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create(timeout="5m") as sandbox:
  sandbox_id = sandbox.id
  sandbox.close()  # process can exit now

# later
with sdk.sandbox.connect(sandbox_id) as reconnected:
  print(f"Reconnected to {reconnected.id}")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(timeout="5m") as sandbox:
  sandbox_id = sandbox.id
  await sandbox.close()  # process can exit now

# later
async with sdk.sandbox.connect(sandbox_id) as reconnected:
  print(f"Reconnected to {reconnected.id}")
```

</deno-tab>
</deno-tabs>

## 长时间生命周期

如果需要更长时间的生命周期，可以使用 [`sandbox.deploy()`](./promote.md) 将基于时长的沙盒提升为 Deno Deploy 应用。

## 强制终止沙盒

- `await sandbox.kill()` 会立即停止虚拟机并释放生命周期，用于在沙盒本应自然结束之前强行销毁它。
- 杀死沙盒会使暴露的 HTTP URL、SSH 会话以及所有挂载卷失效，但当你的代码丢弃对沙盒的最后引用或配置的时长到期时，这些也会自动失效。

## 扩展沙盒生命周期

敬请期待。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const newTimeout = await sandbox.extendTimeout("30m");
console.log(`Sandbox now expires at ${newTimeout}`);
```

</deno-tab>
<deno-tab value="cli" label="CLI">

```bash
deno sandbox extend sbx_ord_abc123def456 30m
```

</deno-tab>
</deno-tabs>

所有活跃连接和进程会继续正常运行，同时沙盒的过期时间被更新。

## 相关 API

- [`Sandbox.create()`](./create.md) – 在创建时传入 `timeout` 选项。
- `Sandbox.connect({ id })` – 重新控制基于时长的沙盒。
- `Sandbox.kill()` – 提前终止。
- [`Expose HTTP`](./expose_http.md) 和 [`Expose SSH`](./expose_ssh.md) – 请注意它们的 URL/凭证随沙盒生命周期终止而失效。