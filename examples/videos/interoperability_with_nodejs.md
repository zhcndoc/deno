---
title: "与 Node.js 的互操作性"
url: /examples/interoperability_with_nodejs/
videoUrl: https://www.youtube.com/watch?v=mgX1ymfqPSQ&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=2
layout: video.tsx
---

## 视频描述

Deno 在其 v2.0 版本中获得了许多互操作性功能。在本视频中，我们将探讨如何使用 Node.js 内置 API、NPM 模块和 JSR 包。

## 记录与示例

[Deno 2.0](https://deno.com/blog/v2) 发布了，它非常不错。Deno 最令人惊叹的功能之一是它与其他平台（包括 Node）的互操作性。例如，我们可以使用核心 Node.js 内置 API。我们所需要做的就是在这里添加这个 Node 指定符。

```ts
import fs from "node:fs/promises";
```

Deno 还支持使用 NPM 模块。您只需在导入时添加 NPM 指定符，就可以开始使用。

```ts
import { * } as Sentry from "npm:@sentry/node";
```

我们还可以利用 [JSR](https://jsr.io)，这是一个用于 TypeScript 和 JavaScript 的开源包注册表。

```ts
import OpenAI from "jsr:@openai/openai";
```

当然，JSR 与 Deno、Node.js、bun 和 CloudFlare workers 一起工作。您甚至可以将 JSR 包安装到 Vite 和 Next.js 应用程序中。

Deno 还为我们提供了 [导入映射](https://docs.deno.com/runtime/fundamentals/modules/#differentiating-between-imports-or-importmap-in-deno.json-and---import-map-option)，这帮助我们管理依赖项。您可以从 JSR 安装一个包。导入将被添加到 `deno.json`，您甚至可以使用简写来描述这一点，以进一步简化您的代码。Deno 2.0 专注于提供一个非常稳固的开发体验。使用 Deno 新创建项目和迁移变得更加轻松。