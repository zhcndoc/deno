---
last_modified: 2026-06-16
title: "后端"
description: "为你的桌面应用选择一个渲染引擎：打包的 Chromium、操作系统的 webview，或原始窗口系统。了解权衡以及如何切换。"
---

:::info Deno 2.9 即将推出

`deno desktop` 随 Deno v2.9.0 一起发布，目前尚未进入稳定版。要立即试用，请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建版本。在功能稳定之前，命令、配置键以及 TypeScript API 仍可能发生变化。

:::

`deno desktop` 会在若干 Web 渲染引擎之一之上运行你的应用。`--backend`（或 `deno.json` 中的 `desktop.backend` 字段）用于选择你的应用嵌入哪个引擎。如果你不选择，`deno desktop` 默认使用 **WebView** 后端。

## 可用后端

### CEF

```sh
deno desktop --backend cef main.ts
```

**打包的 Chromium Embedded Framework。** 这与驱动 Chrome、Electron 和 Slack 的同一引擎。该框架会随你的 `.app` / 应用目录一起发布，位于 `Contents/Frameworks/` 下。

- 在 macOS、Windows 和 Linux 上呈现效果完全一致。
- 完整支持 Web 平台，包括现代 CSS、ES 模块、WebGPU 和 WebRTC。
- 二进制体积最大（仅框架本身约 150 MB）。
- 支持所有 Deno desktop 功能（DevTools、autoUpdate、tray、dock）。

当你在意跨平台一致的渲染效果，或者你需要某个只有 Chromium 提供的功能时（例如 Linux 上的 WebGPU），请选择 CEF。

### WebView（默认）

```sh
deno desktop --backend webview main.ts
```

**操作系统自带的 webview**：macOS 上是 WKWebView，Windows 上是 WebView2，Linux 上是 WebKitGTK。

- 应用体积更小（只有你的代码 + 后端适配层）。
- 渲染和功能支持会因平台与操作系统版本而异。
- 某些 Web 功能可能缺失或表现不同（Web Audio 变体、WebGPU 可用性等）。
- DevTools 不可用（目前统一的 DevTools mux 仅支持 CEF）。

当二进制体积是首要考虑，并且你的 UI 仅依赖广泛支持的 Web 功能时，选择 WebView。

### Raw

```jsonc title="deno.json"
{ "desktop": { "backend": "raw" } }
```

**没有 Web 引擎。** 提供窗口管理、输入事件、剪贴板以及原生 API 表面，但没有 webview，没有 [`Deno.serve()`](/api/deno/~/Deno.serve) 自动绑定，也没有 `bindings.<name>()` 代理。

适用于自行绘制 UI 的应用（WebGPU、Skia、自定义渲染），或作为非 Web 桌面程序的基础。`raw` 后端通过 `deno.json` 中的 `desktop.backend` 字段选择；`--backend` 标志只接受 `cef` 和 `webview`。

## 选择后端

| 需求                                              | 最佳选择  |
| ------------------------------------------------- | --------- |
| 各处渲染完全一致                                  | `cef`     |
| 尽可能小的二进制                                  | `webview` |
| 所有平台上的 WebGPU / 前沿 Web API                | `cef`     |
| 自定义 2D/3D 渲染，不使用 HTML                    | `raw`     |
| macOS 上的内部应用，且你可控制操作系统版本        | `webview` |

## 切换后端

除 `raw` 后端外，后端之间可以互换：相同的应用代码（窗口、绑定、事件、导航、JS 执行）在 CEF 和 WebView 上无需修改即可运行。

要切换，只需修改配置或传入标志：

```jsonc title="deno.json"
{ "desktop": { "backend": "webview" } }
```

```sh
deno desktop --backend webview main.ts
```

`raw` 后端没有 webview，因此任何与 Web 内容交互的 API（导航、绑定、`executeJs` 等）在使用它时都不可用。

## 后端如何获取

你无需自行构建渲染后端。Deno CLI 会自动下载预构建的后端二进制文件。下载内容会经过校验和验证，并缓存在 `<deno_dir>/` 下。

首次为新的后端 / 目标平台构建时会下载归档包（CEF 约为数百 MB）。后续构建将使用缓存。

## 交叉编译

`--target` 和 `--all-targets` 可与任何后端一起使用。CLI 会下载与目标三元组匹配的预构建后端归档包，无需本地引擎工具链。参见 [分发](/runtime/desktop/distribution/)。
