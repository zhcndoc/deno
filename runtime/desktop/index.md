---
last_modified: 2026-06-17
title: "桌面应用"
description: "从 Deno 项目构建自包含的桌面应用，具备框架自动检测、热重载、原生窗口、自动更新以及跨平台分发能力。"
---

`deno desktop` 会将一个 Deno 项目（从单个 TypeScript 文件到 Next.js 应用都可以）转换为一个自包含的桌面应用。输出结果是一个可重新分发的二进制文件，它将你的代码、Deno 运行时以及一个 Web 渲染引擎打包到每个平台的一个 bundle 中。

:::info 即将于 Deno 2.9 提供

`deno desktop` 将随 Deno v2.9.0 一同发布，但目前尚未进入稳定版。若想现在就试用，请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建。该命令、配置键以及 TypeScript API 在该功能稳定之前仍可能发生变化。

:::

## 为什么选择 `deno desktop`

Web 技术是全世界最广为人知的 UI 工具包。基于 Web 技术栈构建的桌面应用（Electron、Tauri、Electrobun）都能利用这一点，但它们各自也都有你不得不接受的取舍：庞大的二进制文件、平台支持缺失、没有 JavaScript 生态、没有内置的更新方案、没有框架集成。

`deno desktop` 对这些取舍有明确立场：

- **默认轻量，同时完整兼容 Node。** 默认的 WebView 后端使用操作系统自带的 webview，因此二进制体积更小；同时，你仍可通过 Deno 的 Node 兼容层使用完整的 npm 生态系统。当你需要在 macOS、Windows 和 Linux 上获得完全一致的渲染效果时，可以选择内置的 Chromium（CEF）后端。
- **框架自动检测。** 将 `deno desktop` 指向 Next.js、Astro、Fresh、Remix、Nuxt、SvelteKit、SolidStart、TanStack Start 或 Vite SSR 项目即可运行：发布模式下运行生产服务器，`--hmr` 下运行带热重载的开发服务器。无需修改代码，就能把现有 Web 项目带到桌面端。
- **进程内绑定，而非 IPC。** 后端与 UI 的通信通过进程内通道进行，而不是基于 socket 的 IPC。值在跨越调用边界时仍会被编码，但你的 Deno 代码与 webview 之间不会发生跨进程往返。
- **单机跨编译。** 同一台机器可以构建 macOS、Windows 和 Linux 版本。后端会按需下载，而不是在本地构建。
- **内置基于二进制差分的自动更新。** 只需发布一个 `latest.json` 清单和 bsdiff 补丁；运行时会自动轮询、应用更新，并在启动失败时回滚。

## Hello, desktop

创建一个单文件桌面应用：

```ts title="main.ts"
Deno.serve(() =>
  new Response("<h1>Hello, desktop</h1>", {
    headers: { "content-type": "text/html" },
  })
);
```

```sh
deno desktop main.ts
```

编译后的二进制文件会打开一个窗口，并指向一个本地 HTTP 服务器，该服务器绑定到你的
[`Deno.serve()`](/api/deno/~/Deno.serve) 处理器。直接运行它：

```sh
./main      # macOS / Linux
.\main.exe  # Windows
```

[`Deno.serve()`](/api/deno/~/Deno.serve) 会自动绑定到 webview 导航所使用的地址，因此你无需传入端口或主机名。详见
[HTTP 提供服务](/runtime/desktop/serving/)。

## 本节内容

- [配置](/runtime/desktop/configuration/): `deno.json` 中的 `desktop` 配置块。
- [后端](/runtime/desktop/backends/): CEF、webview、raw；如何选择。
- [HTTP 提供服务](/runtime/desktop/serving/):
  [`Deno.serve()`](/api/deno/~/Deno.serve) 集成与服务模型。
- [框架](/runtime/desktop/frameworks/): Next.js、Astro、Fresh、Remix、
  Nuxt、SvelteKit 等。
- [窗口](/runtime/desktop/windows/):
  [`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) 生命周期、多窗口、事件。
- [绑定](/runtime/desktop/bindings/): 通过
  `bindings.<name>()` 从 webview 调用 Deno 代码。
- [菜单](/runtime/desktop/menus/): 应用菜单和上下文菜单。
- [托盘和程序坞](/runtime/desktop/tray_and_dock/): 系统状态图标和
  macOS 程序坞。
- [对话框](/runtime/desktop/dialogs/): 将 `prompt()`、`alert()`、`confirm()` 作为
  原生弹窗。
- [通知](/runtime/desktop/notifications/): 通过 Web `Notification` API 使用原生 OS 通知。
- [热模块替换](/runtime/desktop/hmr/): 面向框架应用和非框架应用的
  `--hmr`。
- [DevTools](/runtime/desktop/devtools/): 同时连接 Deno 运行时和 webview 的统一 DevTools。
- [自动更新](/runtime/desktop/auto_update/):
  [`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate)、清单、bsdiff、
  回滚。
- [错误报告](/runtime/desktop/error_reporting/): 捕获未处理的
  异常和 panic。
- [分发](/runtime/desktop/distribution/): 跨编译、输出
  格式、安装程序。
- [比较](/runtime/desktop/comparison/): `deno desktop` 与
  Electron、Tauri、Electrobun、Dioxus 的关系。
- [`deno desktop` CLI 参考](/runtime/reference/cli/desktop/): 该命令、
  其标志以及 `deno.json` 中的 `desktop` schema。
