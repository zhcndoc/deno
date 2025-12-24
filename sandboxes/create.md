---
title: "创建沙箱"
description: "了解如何使用静态 Sandbox.create() 方法配置沙箱，并设置运行时、网络和生命周期选项。"
---

`Sandbox.create()` 静态方法是 Deploy 边缘环境中创建隔离 Linux 微虚拟机的主要入口。它返回一个已连接的 `Sandbox` 实例，您可以使用该实例运行命令、上传文件、暴露 HTTP 端点或请求 SSH 访问。

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();
```

默认情况下，这将在最近的 Deploy 区域创建一个临时沙箱，配置为 768MB RAM，无出站网络访问，生命周期绑定于当前进程。您可以通过传入配置对象来定制该沙箱。

## 可用选项

| 选项         | 说明                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| `region`     | 例如 `ams` 或 `ord`                                                                       |
| `allowNet`   | 允许沙箱向其发送请求的主机数组。指定后，未列出的主机将不可达。                             |
| `memoryMb`   | 为内存密集型任务或资源限制，分配 768 到 4096 MB 的内存。                                  |
| `lifetime`   | 沙箱保持存活的时间长度，格式如 (m) 或 (s)，例如 `5m` 详细说明见 [lifetimes](./lifetimes) |
| `labels`     | 附加任意键值标签，有助于识别和管理沙箱                                                 |
| `env`        | 设置沙箱内的初始环境变量。秘密仍应通过 Deploy 的秘密替换机制管理。                       |

## 示例配置

### 允许向特定 API 发送出站流量

```tsx
const sandbox = await Sandbox.create({
  allowNet: ["api.openai.com", "api.stripe.com"],
});
```

### 在特定区域运行并分配更多内存

```tsx
const sandbox = await Sandbox.create({
  region: "ams",
  memoryMb: 2048,
});
```

### 保持沙箱存活以便后续检查

```tsx
const sandbox = await Sandbox.create({ lifetime: "10m" });
const id = sandbox.id;
await sandbox.close(); // 断开连接但保持虚拟机运行

// ...稍后...
const reconnected = await Sandbox.connect({ id });
```

### 提供默认环境变量

```tsx
const sandbox = await Sandbox.create({
  env: {
    NODE_ENV: "development",
    FEATURE_FLAG: "agents",
  },
});
```

## 小贴士

- 将 `allowNet` 设定尽可能严格，以防止数据外泄。
- 使用如 `agentId` 或 `customerId` 等元数据键，在 Deploy 控制面板中追踪沙箱。
- 利用 `await using`（或丢弃最后引用）自动释放沙箱。仅在需要提前终止时调用 `sandbox.kill()`。
- 对于长期运行的服务，代码稳定后建议从沙箱迁移到 Deploy 应用。