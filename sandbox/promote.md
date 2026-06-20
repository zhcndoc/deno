---
last_modified: 2026-01-28
title: "将 Deno Sandbox 升级为 Deploy 应用"
description: "了解如何将 sandbox 升级为完整的 Deno Deploy 应用以用于生产。"
---

有时，Deno Sandbox 会验证一个概念或原型，而它应该作为一流的 Deno Deploy 应用继续存在。你无需在其他地方重建代码库，而是可以直接使用 `sandbox.deno.deploy()` 将 sandbox 升级。

## 临时计算 vs Deploy 应用

| Aspect        | Deno Sandbox                             | Deno Deploy Apps                       |
| ------------- | ---------------------------------------- | -------------------------------------- |
| 生命周期      | 几秒到几分钟                             | 始终在线，受管理的发布                 |
| 控制平面      | 通过 SDK 以编程方式                      | Dashboard + CI/CD                      |
| 使用场景      | Agent、预览、不受信任的代码             | 生产 API、长期运行的服务               |
| 状态          | 临时（需要时使用卷）                     | 通过 KV、数据库实现持久部署           |
| 暴露方式      | 每个 sandbox 使用 `exposeHttp()`/`exposeSsh()` | 自定义域名、TLS、内置路由          |

先在 sandbox 中开始，以便快速迭代。一旦代码库稳定并且需要 24/7 可用性，就将它升级为 Deploy 应用，由系统为你管理构建、发布和可观测性。

## 使用 `sandbox.deno.deploy()` 进行升级

当 sandbox 验证了概念后，你可以无需在别处重建，就把它变成一个始终在线的 Deploy 应用。`sandbox.deno.deploy()` 会快照当前文件系统，保留网络策略，并为应用配置持久 URL、可观测性和团队访问权限。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await using sandbox = await Sandbox.create({ timeout: "10m" });
// ...构建或搭建你的服务...

const app = await sandbox.deno.deploy("ai-preview", {
  entrypoint: "server.ts",
});
console.log(`已升级为 Deploy 应用 ${app.slug}`);
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()

with sdk.sandbox.create(timeout="10m") as sandbox:
  # ...构建或搭建你的服务...

  build = sandbox.deno.deploy("ai-preview", entrypoint="server.ts")
  print(f"已升级为 Deploy 应用，修订版 ID: {build.id}")
```

</deno-tab>
<deno-tab value="python-async" label="Python (Async)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()

async with sdk.sandbox.create(timeout="10m") as sandbox:
  # ...构建或搭建你的服务...

  build = await sandbox.deno.deploy("ai-preview", entrypoint="server.ts")
  print(f"已升级为 Deploy 应用，修订版 ID: {build.id}")
```

</deno-tab>
</deno-tabs>

升级的原因：

- 将 sandbox 实验持续运行起来，为客户流量提供生产级 SLA。
- 让 TLS、自定义域名、回滚和流量分割由系统为你处理。
- 通过 Deploy UI 在团队内共享可观测性（日志/追踪/指标）。
- 替代脆弱的手动交接；确切的 sandbox 状态会成为已部署的修订版。

将 sandbox 用于快速、临时的工作，然后在代码应作为受管理服务长期运行时调用 `sandbox.deno.deploy()`。
