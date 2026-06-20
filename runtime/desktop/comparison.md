---
last_modified: 2026-06-18
title: "与其他工具的比较"
description: "deno desktop 在语言、引擎、进程模型、应用体积、生态，以及内置能力方面，与 Electron、Electrobun、Tauri 和 Dioxus 的对比。"
---

:::info 即将在 Deno 2.9 中推出

`deno desktop` 将随 Deno v2.9.0 发布，目前仍未进入稳定版本。要立即试用，
请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建版本。该命令、配置键以及
TypeScript API 在该功能稳定之前仍可能发生变化。

:::

`deno desktop` 是使用 Web 技术发布桌面应用的几种方式之一。下面是它与其他替代方案的对比。

## 一览

|                             | Electron               | Electrobun      | Tauri                | Dioxus           | `deno desktop`                               |
| --------------------------- | ---------------------- | --------------- | -------------------- | ---------------- | -------------------------------------------- |
| **语言**                   | JS/TS (Node.js)        | JS/TS (Bun)     | Rust + Web 前端      | Rust             | JS/TS (Deno)                                 |
| **Web 引擎**               | 内置 Chromium          | 系统 WebView    | 系统 WebView         | 系统 WebView    | 内置 CEF 或 WebView                          |
| **一致的渲染**             | 是                     | 否              | 否                   | 否               | 是（CEF）                                    |
| **进程模型**              | 多进程                 | 多进程          | 多进程               | 单进程           | 多线程（CEF）/ 进程组（WebView）             |
| **后端 ↔ UI**             | IPC                    | IPC             | IPC                  | 原生 Rust        | 进程内通道                                   |
| **应用体积**               | ~100 MB+               | ~14 MB          | ~2–10 MB             | ~5 MB            | ~40 MB / ~150 MB（CEF）                      |
| **npm / Node 兼容性**     | 是                     | 是              | 否                   | 否               | 是                                           |
| **框架自动检测**          | 否                     | 否              | 否                   | 否               | 是                                           |
| **HMR**                    | 否                     | 是              | 是（基于 Vite）      | 是（`dx serve`） | 是                                           |
| **内置自动更新**          | 完整二进制             | bsdiff          | 插件                 | 无               | bsdiff                                       |
| **内置安装器**            | 是                     | 否              | 是                   | 否               | 部分支持（DMG，AppImage）                    |
| **交叉编译**              | 是（electron-builder） | 否（仅 macOS）  | 否（需要目标 OS）    | 否               | 是（`--target`）                             |
| **macOS / Windows / Linux** | 三者都支持            | 仅 macOS        | 三者都支持           | 三者都支持       | 三者都支持                                   |
| **iOS / Android**         | 否                     | 否              | 是                   | 是               | 尚未支持                                     |

## `deno desktop` 的优势

**零配置框架支持。** 在 Next.js、Astro 或 Fresh 项目上运行 `deno desktop .` 无需适配器也无需配置：生产服务器以 release 模式运行，开发服务器则在 `--hmr` 下运行。其他工具都没有在这个层级上自动检测框架。

**可从一台机器交叉编译。** 与 `deno compile --target` 类似。Tauri 和 Dioxus 需要在本地具备目标平台才能构建（它们的工具链包含 Rust，而 Rust 必须针对目标平台编译）。Electrobun 仅在 macOS 上发布。Electron 通过 electron-builder 支持跨平台构建，但每个目标平台都需要 Node 和平台特定的签名工具。

**完整的 Node 兼容性，并且可选择后端。** Electron 同时捆绑了 Chromium 和 Node，但体积非常大。Tauri 和 Dioxus 体积小，但没有 JS 生态。`deno desktop` 默认使用操作系统的 webview（体积小，类似 Tauri），同时仍通过 Deno 提供完整的 Node 兼容层，包括处理器中的 `npm:` 导入和 `bindings`，并且在你需要一致渲染时还能打包 Chromium（CEF）。

**进程内绑定，而不是 IPC。** Electron / Electrobun / Tauri 都在后端与 UI 之间使用基于 socket 的 IPC。调用会被序列化、跨越进程边界，然后再反序列化。`deno desktop` 将 Deno 运行时和渲染后端运行在同一进程内，通过进程内通道通信。值在调用过程中仍会被编码为 JSON，但不存在跨进程往返。

**内置基于二进制差分的自动更新。** Electron 提供完整二进制。Tauri 的更新插件下载完整构建。Electrobun 和 `deno desktop` 都使用 `bsdiff` 补丁，但 `deno desktop` 将更新流程与运行时集成：无需单独的更新器二进制、自动回滚、清单轮询全部整合到一个 API 中。

## 其他工具的优势

**Electron：生态。** 多年的工具、打包和签名体系。几乎所有主流编辑器和聊天应用都在使用它。如果你需要成熟的插件生态（Spectron、electron-builder、autoUpdater 抽象），Electron 已经具备。

**Tauri：体积小和移动端。** Tauri 的二进制体积比 `deno desktop`（或 Electron）小一个数量级，而且 Tauri 2 支持 iOS 和 Android。如果体积或移动端优先，Tauri 更胜一筹。

**Electrobun：在 macOS 上快速迭代。** Electrobun 在 macOS 上有不错的启动速度和 HMR。如果你只发布 Mac 应用，并且使用 Bun 生态，它值得一看。

**Dioxus：纯 Rust。** 完全没有 JS 运行时。如果你从头到尾都用 Rust 编写，并且希望统一代码库，Dioxus 是不错的选择。

## `deno desktop` 目前还没有的能力

这些内容在本节相关页面中都有文档说明，但值得集中列出：

- **一步式公证。** macOS 安装包会进行代码签名（默认使用临时签名，或者使用已配置的 Developer ID 身份），但公证仍然是单独的 `notarytool` 步骤。参见
  [分发](/runtime/desktop/distribution/#code-signing)。
- **Windows MSI** 和 **Linux `.deb` / `.rpm`** 安装器输出。
- **Windows 上的自动更新。** 基于二进制差分的
  [自动更新](/runtime/desktop/auto_update/) 适用于 macOS 和 Linux；
  目前尚不支持 Windows。
- **iOS / Android** 目标平台。
- **原生剪贴板和安全存储 API**（在这些能力上线之前，请先在 webview 侧使用 Web 的 `Clipboard` API）。原生
  [通知](/runtime/desktop/notifications/) 和
  [系统托盘 / Dock](/runtime/desktop/tray_and_dock/) API _已_ 可用。
- **桌面应用的运行时权限**（即对每次文件系统 / 网络访问都进行权限提示，也就是将 Deno 的权限系统应用于桌面沙箱）。
- **应用之间共享 CEF 运行时。** 目前每个应用都会捆绑自己的一份 CEF。若采用托管的共享运行时，每个应用的二进制体积将降至几 MB。已在路线图上。

## 何时选择 `deno desktop`

- 你的代码库是 JavaScript / TypeScript，并且不想写 Rust。
- 你希望跨平台获得一致的渲染，并且能接受捆绑 Chromium 带来的二进制体积。
- 你已经有一个 Next.js / Astro / Fresh / 等 Web 应用，并希望在不改代码的情况下得到桌面版本。
- 你希望从一台机器进行交叉编译。
- 你的后端代码需要完整的 Node 兼容性（npm 包、原生模块）。
- 你希望自动更新是内置的，而不是后加的。

## 何时选择其他方案

- **Tauri**：如果二进制体积是硬性要求、你不需要 npm，而且你还需要移动端支持。
- **Electron**：如果你团队现有的工具、签名和 CI 已经围绕 Electron 构建。
- **Dioxus**：如果你从头到尾都使用 Rust 编写。
- **Electrobun**：如果你只发布 macOS，并且想留在 Bun 生态中。
