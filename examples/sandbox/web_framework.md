---
title: "服务一个网页框架"
description: "创建 package.json，安装依赖，运行一个网页框架（Express），并从沙箱公开它"
url: /examples/sandbox_web_framework/
layout: sandbox-example.tsx
---

使用 Deno Sandbox，你可以创建一个 `package.json`，安装依赖，运行网页框架（例如 Express），并通过 HTTP 公开它。

此示例展示如何在沙箱内创建一个最简 Express 应用，运行在 3000 端口，并通过 `sandbox.exposeHttp()` 对外公开。

```ts
import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// 1) 在沙箱中写入 package.json 和 server.js
const PACKAGE_JSON = {
  name: "sandbox-express-demo",
  private: true,
  type: "module",
  dependencies: { express: "^4.19.2" },
};
await sandbox.fs.writeTextFile(
  "package.json",
  JSON.stringify(PACKAGE_JSON, null, 2),
);

await sandbox.fs.writeTextFile(
  "server.js",
  `import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('来自 @deno/sandbox 的 Express 你好!'));
app.get('/time', (req, res) => res.json({ now: new Date().toISOString() }));
app.listen(3000, () => console.log('监听端口 :3000'));
`,
);

// 2) 安装依赖
await sandbox.sh`deno install`;

// 3) 启动服务器
const server = await sandbox.deno.run({ entrypoint: "server.js" });

// 4) 对外发布
const publicUrl = await sandbox.exposeHttp({ port: 3000 });
console.log("公开 URL:", publicUrl); // 例如 https://<random>.sandbox.deno.net

// 从你的本地机器 fetch 以验证
const resp = await fetch(`${publicUrl}/time`);
console.log(await resp.json());

// 在你需要时保持进程活跃；完成时，关闭沙箱
// 会关闭服务器。
```