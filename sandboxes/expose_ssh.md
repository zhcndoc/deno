---
title: "暴露 SSH"
description: "如何打开安全的 SSH 访问沙箱，用于交互式调试、编辑器会话或长时间运行的进程。"
---

沙箱可以提供 SSH 凭据，方便你检查文件系统、查看日志、运行编辑器或转发端口，同时 microVM 保持在 Deploy 边缘隔离状态。

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

const { hostname, username, privateKey } = await sandbox.exposeSsh();
console.log(`ssh ${username}@${hostname}`);

// 保持进程存活，或通过 SSH 交互直到完成...
await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
```

沙箱在配置的生命周期内保持可访问。一旦你的脚本释放引用（例如 `await using` 块结束），沙箱即关闭，SSH 端点消失；如果需要立即终止，也可以调用 `sandbox.kill()`。

## 何时使用 SSH 访问

- 调试只在沙箱中失败的代理生成代码
- 使用全屏终端编辑器或远程 VS Code 编辑文件
- 无需修改应用代码即可实时流式查看日志
- 手动运行更方便的分析或检查工具

由于每个沙箱已实现隔离，开启 SSH 并不会危及其他项目或组织。

## 从你的机器连接

1. 通过 `sandbox.exposeSsh()` 请求凭据。
2. 将返回的 `privateKey`（或 `identityFile`）保存到带有 `chmod 600` 权限的临时文件。
3. 使用提供的用户名和主机名连接：

```bash
ssh -i ./sandbox-key ${username}@${hostname}
```

4. 进行常规终端操作：复制文件、运行 top、查看日志或连接运行中的进程。

:::tip

提示：结合使用 SSH 和 [端口转发](https://man.openbsd.org/ssh#LOCAL_FORWARDING) 可以访问绑定在沙箱内 `localhost` 上的开发服务器。

:::

## 安全注意事项

- 凭据一次性使用并绑定沙箱的生命周期。
- 你可控制沙箱运行时长；销毁沙箱可以立即撤销访问权限。

## 保持沙箱存活

如果沙箱关闭，SSH 通道将断开。可通过以下方式保持沙箱运行：

- 设置 `lifetime: "session"`（默认）并保持管理脚本活跃
- 创建沙箱时传入 `lifetime: "5m"`（或其他时长），使其在脚本退出后持续运行，之后通过 `Sandbox.connect({ id })` 重新连接

当代码不再引用沙箱时，会自动清理，但你也可以执行 `sandbox.kill()`（或者在 SSH 会话内直接 `exit`）随时结束。

## 示例工作流程

```tsx
import { Sandbox } from "@deno/sandbox";
import { writeTextFile } from "node:fs/promises";

await using sandbox = await Sandbox.create({ lifetime: "10m" });

// 准备应用
await sandbox.upload("./app", ".");
await sandbox.sh`deno task dev`
  .noThrow(); // 启动服务器；保持运行以便检查

// 获取 SSH 详情并写入密钥文件
const ssh = await sandbox.exposeSsh();
await writeTextFile("./sandbox-key", ssh.privateKey);
await sandbox.sh`chmod 600 sandbox-key`;

console.log(`使用以下命令连接: ssh -i sandbox-key ${ssh.username}@${ssh.hostname}`);

// 阻塞直到手动调试完成
await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
```

使用此模式可调查不稳定的构建，运行交互式 REPL，或与团队成员配对，而无需将代码部署为完整的 Deploy 应用。