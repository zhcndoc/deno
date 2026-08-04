---
last_modified: 2026-07-27
title: "桌面应用"
description: "从 Deno 项目构建自包含的桌面应用，支持框架自动检测、热重载、原生窗口、自动更新和跨平台分发。"
---

`deno desktop` 会将一个 Deno 项目（从单个 TypeScript 文件到 Next.js 应用都可以）转换为一个自包含的桌面应用。输出结果是一个可重新分发的二进制文件，它会将你的代码、Deno 运行时以及一个 Web 渲染引擎打包到适用于各个平台的 bundle 中。

:::info 在 Deno 2.9 中可用

`deno desktop` 自 Deno v2.9.0 起可用。如果你使用的是更早的版本，请[更新 Deno](/runtime/reference/cli/upgrade/)以使用它。

:::

## 为什么选择 `deno desktop`

Web 技术是全世界最广为人知的 UI 工具包。基于 Web 技术栈构建的桌面应用（Electron、Tauri、Electrobun）都能利用这一点，但它们各自也都有你不得不接受的取舍：庞大的二进制文件、平台支持缺失、没有 JavaScript 生态、没有内置的更新方案、没有框架集成。

`deno desktop` 对这些取舍有明确立场：

- **默认体积小，完全兼容 Node。** 默认的 WebView 后端使用操作系统自带的 WebView，以生成体积更小的二进制文件，同时你仍然可以通过 Deno 的 Node 兼容层使用完整的 npm 生态系统。当你需要在 macOS、Windows 和 Linux 上实现一致的渲染效果时，可以选择内置的 Chromium（CEF）后端。
- **框架自动检测。** 将 `deno desktop` 指向 Next.js、Astro、Fresh、
  Remix、React Router、Nuxt、SvelteKit、SolidStart、TanStack Start 或 Vite SSR
  项目即可运行：发布模式下运行生产服务器，在 `--hmr` 下运行支持热重载的开发服务器。大多数框架无需特殊适配器；请参阅[框架](/runtime/desktop/frameworks/)以了解各框架的具体要求。
- **使用进程内绑定，而非 IPC。** 后端与 UI 之间通过进程内通道通信，
  而不是基于套接字的 IPC。值在跨越调用边界时仍会进行编码，但
  Deno 代码与 WebView 之间无需进行跨进程往返。
- **从一台机器进行跨平台编译。** 同一台机器可以为 macOS、
  Windows 和 Linux 构建。后端会按需下载，而不是在本地构建。
- **内置二进制差分自动更新。** 发布单个 `latest.json` 清单和
  bsdiff 补丁；运行时会轮询、应用补丁，并在启动失败时自动回滚。

## 你好，桌面

创建一个单文件桌面应用：

```ts title="main.ts"
Deno.serve(() =>
  new Response("<h1>你好，桌面</h1>", {
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

## 一个完整的示例

有关使用 `deno desktop` 构建的完整、真实世界应用，请参阅
[denidian](https://github.com/bartlomieju/denidian)：这是一款 Obsidian 风格的
笔记应用，支持 Markdown 笔记、`[[wikilink]]` 交叉链接以及力导向图视图。它刻意保持小巧——仅由一个
Deno HTTP 服务器和一个原生 HTML/CSS/JS 前端组成——并涵盖了通过
[`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) 进行窗口管理、应用菜单、
`--hmr` 开发以及面向分发的打包。

## 本节内容

- [配置](/runtime/desktop/configuration/)：`deno.json` 中的 `desktop` 块。
- [后端](/runtime/desktop/backends/)：CEF、webview、raw；如何选择。
- [HTTP 服务](/runtime/desktop/serving/)：
  [`Deno.serve()`](/api/deno/~/Deno.serve) 集成和服务模型。
- [框架](/runtime/desktop/frameworks/)：Next.js、Astro、Fresh、Remix、
  Nuxt、SvelteKit 及其他框架。
- [窗口](/runtime/desktop/windows/)：
  [`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) 生命周期、多窗口、事件。
- [WebGPU 渲染](/runtime/desktop/webgpu/)：在 raw 后端上使用
  WebGPU 绘制到原生窗口。
- [绑定](/runtime/desktop/bindings/)：通过
  `bindings.<name>()` 从 webview 调用 Deno 代码。
- [菜单](/runtime/desktop/menus/)：应用程序菜单和上下文菜单。
- [托盘和 Dock](/runtime/desktop/tray_and_dock/)：系统状态图标和
  macOS Dock。
- [对话框](/runtime/desktop/dialogs/)：作为原生弹窗的 `prompt()`、`alert()`、
  `confirm()`。
- [通知](/runtime/desktop/notifications/)：通过 Web `Notification` API
  实现的原生操作系统通知。
- [热模块替换](/runtime/desktop/hmr/)：适用于框架应用和
  非框架应用的 `--hmr`。
- [DevTools](/runtime/desktop/devtools/)：同时连接到
  Deno 运行时和 webview 的统一 DevTools。
- [自动更新](/runtime/desktop/auto_update/)：
  [`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate)、清单、bsdiff、
  回滚。
- [错误报告](/runtime/desktop/error_reporting/)：捕获未捕获的
  异常和 panic。
- [分发](/runtime/desktop/distribution/)：交叉编译、输出格式、安装程序。
- [比较](/runtime/desktop/comparison/)：`deno desktop` 与
  Electron、Tauri、Electrobun、Dioxus 的关系。
- [`deno desktop` CLI 参考](/runtime/reference/cli/desktop/)：命令、
  其标志以及 `deno.json` 的 `desktop` 架构。
