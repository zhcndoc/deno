---
title: 框架
description: "Deno Deploy 早期访问中支持的 JavaScript 和 TypeScript 框架的详细指南，包括 Next.js、Astro、Nuxt、SvelteKit 等。"
---

Deno Deploy 支持多种 JavaScript 和 TypeScript 框架的开箱即用。这意味着您可以在无需额外配置或设置的情况下使用这些框架。

您正在查看 Deno Deploy<sup>EA</sup> 的文档。想要查看 Deploy Classic 文档？[点击这里查看](/deploy/)。

:::

Deno Deploy<sup>EA</sup> 开箱即支持多种 JavaScript 和 TypeScript 框架。这意味着您可以在无需额外配置或设置的情况下使用这些框架。

原生支持的框架已经过测试，能在 Deno Deploy<sup>EA</sup> 上正常运行，并且在创建新应用时会被自动检测。Deno Deploy<sup>EA</sup> 会自动优化这些框架的构建和运行时配置，以达到最佳状态。

未列出的框架仍很可能可用，但可能需要您手动配置安装和/或构建命令，以及构建设置中的运行时配置。

觉得有什么框架缺失？欢迎在[Deno Deploy Discord 频道](https://discord.gg/deno)告诉我们，或[联系 Deno 支持](../support)。

## 支持的框架

### Next.js

Next.js 是用于构建全栈 Web 应用的 React 框架。您使用 React 组件构建用户界面，同时使用 Next.js 提供的额外功能和优化。

页面路由和应用路由均开箱即支持。支持 ISR、SSG、SSR 和 PPR。缓存开箱即支持，包括使用新的 `"use cache"`。

`next/image` 开箱即用。

Deno Deploy<sup>EA</sup> 上的 Next.js 始终在独立模式下构建。

支持开箱即用的追踪功能，Next.js 会自动为传入请求、路由、渲染及其他操作发出一些跨度（spans）。

### Astro

Astro 是一个用于构建内容驱动网站（如博客、营销和电商）的 Web 框架。Astro 尽可能多地利用服务器渲染而非浏览器端渲染。

对于静态 Astro 网站，使用 Deno Deploy<sup>EA</sup> 无需额外配置。

在 Deno Deploy<sup>EA</sup> 上使用 Astro 的 SSR 时，您需要安装 [@deno/astro-adapter](https://github.com/denoland/deno-astro-adapter) 包，并将您的 `astro.config.mjs` 文件配置为使用该适配器：

```bash
$ deno add npm:@deno/astro-adapter
# 或 npm install @deno/astro-adapter
# 或 yarn add @deno/astro-adapter
# 或 pnpm add @deno/astro-adapter
```

```diff title="astro.config.mjs"
  import { defineConfig } from 'astro/config';
+ import deno from '@deno/astro-adapter';
  
  export default defineConfig({
+   output: 'server',
+   adapter: deno(),
  });
```

支持 Sharp 图像优化。

支持 `astro:env` API。

### Nuxt

使用 Nuxt 轻松创建高质量 Web 应用，Nuxt 是一个开源框架，使基于 Vue.js 的全栈开发变得直观。

Nuxt 无需额外设置。

### SolidStart

SolidStart 是一个开源元框架，旨在统一组成 Web 应用的组件。它建立于 Solid 之上。

SolidStart 无需额外设置。

### SvelteKit

SvelteKit 是一个使用 Svelte 快速开发健壮且高性能 Web 应用的框架。

SvelteKit 无需额外设置。

### Fresh

Fresh 是一个面向 JavaScript 和 TypeScript 开发者的全栈现代 Web 框架。Fresh 使用 Preact 作为 JSX 渲染引擎。

Fresh 无需额外设置。

### Lume

Lume 是一个用于利用 Deno 构建快速且现代网站的静态站点生成器。

Lume 无需额外设置。

### Remix

> ⚠️ **实验性质**：Remix 目前尚未完全支持。它正在被集成进 Deno Deploy<sup>EA</sup>，某些功能可能无法按预期工作。如遇任何问题，请向 Deno 团队反馈。