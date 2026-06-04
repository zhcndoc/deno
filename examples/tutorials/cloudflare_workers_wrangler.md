---
last_modified: 2026-04-18
title: "使用 Wrangler 将 Deno 部署到 Cloudflare Workers"
description: "了解如何使用 Wrangler 将 Deno 应用程序构建并部署到 Cloudflare Workers"
url: /examples/cloudflare_workers_wrangler_tutorial/
---

Cloudflare Workers 允许你在 Cloudflare 的边缘网络上运行 JavaScript。

Wrangler 是 Cloudflare 为其开发者平台提供的官方 Node.js CLI。在本教程中，我们将使用 Deno 中的 Wrangler 部署一个 Cloudflare Worker。

Denoflare 是一款对 Deno 友好的第三方工具，保证可以在 Deno 上运行，但与 Wrangler 不同，它无法保证能够正确利用 Cloudflare 的各项功能。如果你想使用 `denoflare`，请参考
[Cloudflare Workers 教程](/examples/cloudflare_workers_tutorial/)。

## 设置 wrangler

首先，将 wrangler npm 模块添加到你的项目中。

```shell
deno add npm:wrangler
```

接下来，创建 `wrangler.json`。由于 wrangler 的初始化脚本会生成许多仅对 Node.js 必要的文件，我们将手动编写它。
因为 JSON schema 默认会引用 `node_modules`，所以我们将把它配置为引用 unpkg.com 上的 schema。

```json
{
  "$schema": "https://www.unpkg.com/wrangler/config-schema.json",
  "name": "deno-wrangler",
  "main": "src/mod.ts",
  "compatibility_date": "2026-04-18",
  "observability": {
    "enabled": true
  }
}
```

另外，更新 `deno.json`，添加调用 wrangler 功能的命令。`dev` 和 `start` 命令有所重叠，但这是为了与 wrangler 为 Node.js 环境生成的内容保持一致。

```json
{
  "tasks": {
    "deploy": "deno --allow-env --allow-run npm:wrangler deploy",
    "dev": "deno npm:wrangler dev",
    "start": "deno npm:wrangler dev",
    "cf-typegen": "deno npm:wrangler types"
  }
}
```

最后，执行 `cf-typegen` 命令，自动生成类型定义文件 `worker-configuration.d.ts`。

```shell
deno task cf-typegen
```

## 创建你的函数

现在，在 `src/mod.ts` 中创建你的 worker 脚本。它需要导出一个包含 `fetch` 处理器的对象，以满足上一节生成的 `worker-configuration.d.ts` 所定义的 Cloudflare Module Worker API。

```typescript
export default {
  async fetch(req) {
    return new Response("Hello World");
  },
} satisfies ExportedHandler<Env>;
```

## 设置构建

Wrangler 内置了由 esbuild 驱动的构建系统，但默认是为 Node.js 配置的。由于这与 Deno 的模块解析机制不兼容，你必须自行设置构建环境并配置
[自定义构建](https://developers.cloudflare.com/workers/wrangler/custom-builds/)。

首先，下载 esbuild 和官方的 Deno esbuild 插件。

```shell
deno add npm:esbuild jsr:@deno/esbuild-plugin
```

接下来，在 build.ts 中创建一个构建脚本。这将把 src/mod.ts 打包成 dist/server.js 中的单个 JavaScript 文件。

```typescript
import * as esbuild from "esbuild";
import { denoPlugin } from "@deno/esbuild-plugin";

await esbuild.build({
  entryPoints: ["src/mod.ts"],
  outfile: "dist/server.js",
  format: "esm",
  bundle: true,
  minify: true,
  treeShaking: true,
  plugins: [
    denoPlugin(),
  ],
});

await esbuild.stop();
```

然后，我们将在 `deno.json` 中设置构建脚本执行任务。

```json
{
  "tasks": {
    "build": "deno run -REW --allow-run build.ts"
  }
}
```

最后，编辑 wrangler.json，将其设置为在部署期间运行构建任务，并将输出文件配置为入口点。

```json
{
  "$schema": "https://www.unpkg.com/wrangler/config-schema.json",
  "name": "deno-wrangler",
  "main": "dist/server.js",
  "compatibility_date": "2026-04-18",
  "observability": {
    "enabled": true
  },
  "build": {
    "command": "deno task build"
  }
}
```

## 部署

完成 wrangler 配置后，你可以通过执行 `deploy` 命令，将你的 worker 部署到 Cloudflare 边缘网络。

```shell
deno task deploy
```

Wrangler 会自动运行你的 build.ts 脚本来打包应用，然后安全地将生成的 dist/server.js 文件发布到 Cloudflare Workers。完成后，Wrangler 会输出你的 worker 托管的在线 URL。
