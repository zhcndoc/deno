---
title: "控制沙箱生命周期"
description: "了解如何使用 lifetime 选项控制沙箱的存活时间。"
url: /examples/sandboxes_lifetime_control/
layout: sandbox-example.tsx
---

你可以使用 lifetime 选项来控制沙箱的存活时间：

```ts
import { Sandbox } from "@deno/sandbox";

// 默认："session" - 当你关闭/释放客户端时，沙箱关闭
await using sandbox = await Sandbox.create({ lifetime: "session" });
```

支持的时间单位后缀：`s`（秒），`m`（分钟）。

示例："30s"、"5m"、"90s"。

```ts
import { Sandbox } from "@deno/sandbox";

// 基于时长：让沙箱在特定时间段内保持运行
// 当你希望脚本退出后沙箱仍然存在时非常有用
const sandbox = await Sandbox.create({ lifetime: "5m" }); // 5 分钟
const id = sandbox.id;
// 关闭沙箱的*连接*；沙箱继续运行
await sandbox.close();

// 之后，使用沙箱 ID 重新连接到同一个沙箱
const reconnected = await Sandbox.connect({ id });
await reconnected.sh`echo 'Still alive!'`;

// 你仍然可以在生命周期结束前强制终止它
await reconnected.kill();
// 此时，沙箱已无法重新连接
```

> 需要其他生命周期模式？请联系
> <a href="mailto:deploy@deno.com">deploy@deno.com</a>。