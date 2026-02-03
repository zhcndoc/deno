---
title: "控制沙箱超时"
description: "了解如何使用 timeout 选项控制沙箱的存活时间。"
url: /examples/sandbox_timeout_control/
layout: sandbox-example.tsx
---

你可以使用 timeout 选项来控制沙箱的存活时间：
控制超时可以让你决定沙箱在脚本结束时是否立即消失，还是保持运行一段设定的时间：

```ts
import { Sandbox } from "@deno/sandbox";

// 默认："session" - 当你关闭/释放客户端时，沙箱关闭
await using sandbox = await Sandbox.create({ timeout: "session" });
```

支持的时间单位后缀：`s`（秒），`m`（分钟）。

示例："30s"、"5m"、"90s"。

```ts
import { Sandbox } from "@deno/sandbox";

// 基于时长：让沙箱在特定时间段内保持运行
// 当你希望脚本退出后沙箱仍然存在时非常有用
const sandbox = await Sandbox.create({ timeout: "5m" }); // 5 分钟
const id = sandbox.id;
// 关闭沙箱的*连接*；沙箱继续运行
await sandbox.close();

// 之后，使用沙箱 ID 重新连接到同一个沙箱
const reconnected = await Sandbox.connect({ id });
await reconnected.sh`echo 'Still alive!'`;

// 你仍然可以在超时结束前强制终止它
await reconnected.kill();
// 此时，沙箱已无法重新连接
```

默认的 "session" 模式适合短期自动化——资源会在客户端释放时立即清理。

基于时长的超时（如 "30s"、"5m" 等）允许你关闭客户端连接，而沙箱保持状态活着，这样你可以在超时到期前重新连接（例如，查看日志、重新运行命令，或将沙箱 ID 分享给其他进程）。

## 根据需要随时延长超时

你并不局限于最初设定的时长。只要你仍持有一个 `Sandbox` 实例（无论是原始句柄还是通过 `Sandbox.connect()` 重新连接的实例），调用 `sandbox.extendTimeout()` 并传入新的时长字符串即可将关闭时间往后推。每次调用最多能延长 30 分钟，并返回一个 `Date` 表示新的关闭时间。

```ts
import { Sandbox } from "@deno/sandbox";

const sandbox = await Sandbox.create({ timeout: "5m" });

// 需要更多时间？无需中断正在运行的工作，直接延长超时。
const newExpiry = await sandbox.extendTimeout("30m");
console.log(`Sandbox now lives until ${newExpiry.toISOString()}`);
```

如果不再需要沙箱，也可以显式调用 `kill()` 提前结束它，这在任务比预期提前完成时非常有用。

> 需要其他超时模式？请联系
> <a href="mailto:deploy@deno.com">deploy@deno.com</a>。