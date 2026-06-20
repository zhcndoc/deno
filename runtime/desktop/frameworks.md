---
last_modified: 2026-06-16
title: "框架"
description: "无需任何代码更改，即可将 Next.js、Astro、Fresh、Remix、Nuxt、SvelteKit、SolidStart、TanStack Start 和 Vite SSR 项目作为桌面应用运行。"
---

:::info 将在 Deno 2.9 中提供

`deno desktop` 随 Deno v2.9.0 发布，目前尚未进入稳定版。要立即试用，
请运行 `deno upgrade canary` 以安装
[`canary`](/runtime/reference/cli/upgrade/) 构建版本。该命令、配置键以及
TypeScript API 在该功能稳定之前仍可能发生变化。

:::

将 `deno desktop` 指向某个目录后，它会自动检测框架，选择正确的入口点，将构建输出嵌入二进制文件，并运行该框架的生产服务器（或在 `--hmr` 下运行开发服务器），同时让 webview 指向它。

```sh
# 在 Next.js / Astro / Fresh / 等项目中：
deno desktop .
```

无需代码更改，也无需特殊适配器。能作为 Web 应用运行的同一个项目，也可作为桌面应用发布。

## 检测

检测基于配置文件和 `package.json` 依赖项。匹配到的第一个结果生效。

| 框架            | 通过以下内容检测                                             |
| --------------- | ------------------------------------------------------------ |
| Next.js         | `next.config.{js,mjs,ts}`                                    |
| Astro           | `astro.config.{mjs,ts,js}`                                   |
| Fresh           | `fresh.gen.ts` 或 `_fresh/` 目录                             |
| Remix           | `package.json` 中的 `@remix-run/react` 或 `@remix-run/dev` |
| Nuxt            | `nuxt.config.{ts,js,mjs}`                                    |
| SvelteKit       | `svelte.config.{js,ts}`                                      |
| SolidStart      | `package.json` 中的 `@solidjs/start`                         |
| TanStack Start  | `package.json` 中的 `@tanstack/{react,solid}-start`         |
| Vite（SSR 模式） | `vite.config.*` 加上一个 `server.{js,ts,mjs}` 入口           |

如果都不匹配，`deno desktop` 会回退为将该路径视作脚本，这与 `deno desktop main.ts` 相同。你可以编写一个
[`Deno.serve()`](/api/deno/~/Deno.serve) 处理程序并自行提供 UI。

## 检测会做什么

当检测到框架时，CLI 会：

1. **生成一个合成入口点**，用于导入框架的生产服务器（或在 `--hmr` 下导入开发服务器）。
2. **将构建输出嵌入** 二进制文件的虚拟文件系统（VFS）中（`.next/`、`dist/`、`.output/`、`_fresh/`、`build/` 等，具体取决于框架）。
3. **在运行时自解压 VFS**，使框架代码能够在其自身工作目录的相对位置找到构建输出。Next.js 在 `.next/` 下查找，Astro 在 `dist/` 下查找，依此类推。
4. **运行框架服务器** 作为你的
   [`Deno.serve()`](/api/deno/~/Deno.serve) 处理程序。webview 会像任何其他桌面应用一样导航到绑定的端口。

在运行 `deno desktop` 之前，请先构建你的项目。它不会替你运行 `next build`、
`astro build` 之类的命令，因此请先执行框架的构建步骤。

## 各框架说明

### Next.js

```sh
cd my-next-app
npx next build         # 生成 .next/
deno desktop .
```

生产环境：导入 `next/dist/cli/next-start.js`。开发环境（在 `--hmr` 下）：
`next/dist/cli/next-dev.js`。`.next/` 目录会被嵌入。

App Router 和 Pages Router 都可正常工作。

### Astro

```sh
npm run build          # 生成 dist/
deno desktop .
```

带有 SSR 适配器的 Astro 项目会导入 `./dist/server/entry.mjs`。静态项目（无适配器）则通过 Deno 的静态文件服务器提供服务，指向 `dist/`。

这两种模式都可用；SSR 可以访问完整的 Astro 请求生命周期，静态模式启动更快。

### Fresh

```sh
deno task build        # 生成 _fresh/
deno desktop .
```

Fresh 2.x：导入 `_fresh/server.js`，并在 `--hmr` 下运行 Vite 开发服务器。Fresh 1.x：直接导入 `./main.ts`。

### Remix

```sh
npm run build
deno desktop .
```

生产环境：针对 `build/` 目录运行 `remix-serve`。开发环境（在 `--hmr` 下）：运行 `@remix-run/dev` CLI。

### Nuxt

```sh
npm run build          # 生成 .output/
deno desktop .
```

使用 Nuxt 的 Nitro 输出，位于 `.output/server/index.{ts,mjs}`。开发环境（在 `--hmr` 下）：`nuxi dev`。

### SvelteKit

```sh
npm run build
deno desktop .
```

首先查找 `.deno-deploy/server.ts`（Deno Deploy 适配器的输出），如果没有，再回退到 `.output/server/index.{ts,mjs}`（Node 适配器的输出）。开发环境：Vite 开发服务器。

如果你使用了其他适配器（`@sveltejs/adapter-static` 等），请直接用 [`Deno.serve()`](/api/deno/~/Deno.serve) 自行提供输出目录服务，而不要依赖检测。

### SolidStart 和 TanStack Start

二者底层都使用 Nitro 框架；检测会通过 `.output/server/index.*` 入口处理它们。运行 `deno desktop` 前请先构建（`npm run build`）。

### Vite SSR

带有自定义 SSR 入口（`server.ts`、`server.js`、`server.mjs`）的普通 Vite 项目，只要同时存在 `vite.config.*`，就可以配合 `deno desktop` 使用。生产环境会直接运行 SSR 入口；开发环境（在 `--hmr` 下）会以 middleware 模式运行 Vite 开发服务器。

## 强制指定框架或选择退出

没有用于强制检测的标志。若要选择退出（即在不使用检测的情况下发布框架项目），请传入一个显式脚本入口：

```sh
deno desktop ./my-server.ts
```

在 `my-server.ts` 中，你需要自行导入并启动框架。当你需要检测无法表达的启动控制时，请使用这种方式。

## 框架项目中的热重载

在 `--hmr` 下，会运行框架自身的开发服务器，webview 会直接连接到它。状态保持、快速刷新和错误覆盖层的表现都与浏览器中相同。有关框架和非框架 HMR 模式的详细信息，请参见 [HMR](/runtime/desktop/hmr/)。
