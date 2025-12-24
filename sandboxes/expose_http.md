---
title: "暴露 HTTP"
description: "了解如何从 Deno 沙箱暴露 HTTP 端点，使您能够在边缘运行 Web 服务器、API 以及预览环境。"
---

您可以在任意端口运行开发服务器、预览应用、Webhook 接收器或框架 CLI，并即时将它们发布到安全的随机 HTTPS URL。

```tsx
await sandbox.writeTextFile(
  "server.js",
  "Deno.serve(() => new Response('Hello from Sandboxes'));",
);
const runtime = await sandbox.createJsRuntime({ entrypoint: "server.js" });
const publicUrl = await sandbox.exposeHttp({ port: 8000 });
console.log(publicUrl); // https://<random>.sandbox.deno.net
```

此 URL 在沙箱生命周期内保持有效，非常适合短期的 QA 链接或代理生成的预览。

## 何时暴露 HTTP

每当您需要与团队成员、机器人或外部服务共享沙箱时，请暴露 HTTP：

- AI 生成的 Web 应用或即时演示的预览链接
- 必须能被 Stripe、GitHub 等访问的 Webhook 接收器
- 需要从浏览器检查的框架开发服务器（例如 `next dev`、`astro dev`、`deno task dev`）
- 临时 API、健康检查或可观测性探针

由于沙箱是临时性的，您无需管理 DNS 或证书。每次调用 `exposeHttp()` 都会返回一个在 `*.sandbox.deno.net` 下的唯一主机名，并自动配置 TLS。

所有访问沙箱 URL 的请求都会将 HTTP 流量转发到该沙箱。

## 步骤详解

1. **在沙箱内启动服务器。** 监听任意非特权端口（例如，`3000`、`8080`）。
2. **暴露端口：**`const url = await sandbox.exposeHttp({ port: 3000 });`
3. **共享或通过该 URL 进行请求。** 请求会经过 Deploy 的全球边缘网络，直接隧道传输到您的沙箱。

通过对每个端口调用多次 `exposeHttp()`，可同时暴露多个端口。只要沙箱保持存活，重新启动服务器后也可以复用相同的暴露 URL。

## 观察流量

通过暴露的 URL 路由的请求会与您的 Deploy 日志和跟踪一起显示。可在仪表板中：

- 按沙箱 ID 或时间范围过滤日志
- 检查请求跟踪，追踪边缘与虚拟机之间的延迟
- 如果预览表现异常，可以取消或重启沙箱

## 安全与网络

- 暴露的 URL 是长度长且随机生成的子域，极难猜测。
- TLS 终止发生在 Deploy 边缘；流量端到端加密。

## 清理与限制

- 当沙箱生命周期结束时，暴露的 URL 将停止接收流量。如有需要，可调用 `sandbox.kill()` 提前终止沙箱（及 URL）。
- 对于持久服务，应将代码升级为 Deploy 应用，而非依赖长时间运行的沙箱。

## 使用框架的完整示例

```tsx
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 安装依赖
await sandbox.writeTextFile(
  "package.json",
  JSON.stringify(
    {
      private: true,
      scripts: { dev: "next dev" },
      dependencies: {
        next: "^15.0.0",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
    },
    null,
    2,
  ),
);
await sandbox.sh`npm install`;

// 启动开发服务器
const server = await sandbox.spawn("npm", {
  args: ["run", "dev"],
  stdout: "inherit",
  stderr: "inherit",
});

// 发布它
const previewUrl = await sandbox.exposeHttp({ port: 3000 });
console.log(`预览已准备好，访问地址为 ${previewUrl}`);

await server.status; // 保持运行直到进程退出
```

此模式允许代理或开发者启动高保真预览，分享获取反馈，并通过单击 `Ctrl+C` 一键清理。