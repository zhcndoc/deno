---
last_modified: 2026-06-16
title: "deno desktop"
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno desktop"
description: "从 Deno 项目构建独立的桌面应用程序"
---

:::info 即将随 Deno 2.9 发布

`deno desktop` 随 Deno v2.9.0 一同发布，目前尚未进入稳定版本。若要立即试用，请运行 `deno upgrade canary` 以安装
[`canary`](/runtime/reference/cli/upgrade/) 构建版本。该命令、配置键以及 TypeScript API 在该功能稳定之前仍可能发生变化。

:::

`deno desktop` 将一个 Deno 项目编译为一个独立的桌面应用程序。输出二进制文件会将你的代码、Deno 运行时以及渲染后端打包到每个平台一个可再分发的可执行文件中。

```sh
deno desktop main.ts
deno desktop --hmr main.ts
deno desktop --output MyApp.app main.ts
```

入口文件是可选的。直接运行 `deno desktop`（或 `deno desktop .`）会在当前目录中检测受支持的框架（Next.js、Astro、Fresh 等），并且无需任何代码改动即可构建。参见
[Frameworks](/runtime/desktop/frameworks/)。

本页介绍命令行标志。完整指南（后端、[`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow)、绑定、自动更新、DevTools 和分发）请参见 [桌面应用程序部分](/runtime/desktop/)。

## 运行时标志

`deno desktop` 接受与 [`deno run`](/runtime/reference/cli/run/) 相同的运行时和权限标志。你在编译时授予的权限会被写入编译后的二进制文件中：

```sh
deno desktop --allow-read --allow-net main.ts
```

## 后端

`--backend` 用于选择渲染引擎。它接受 `webview`（默认）或 `cef`。`raw` 后端通过 `deno.json` 中的 `desktop.backend` 字段来选择。有关取舍，请参见 [后端](/runtime/desktop/backends/)。

```sh
deno desktop --backend webview main.ts
```

## 构建输出

`--output`（`-o`）设置输出路径；其扩展名决定输出格式（`.app`、`.dmg`、`.AppImage` 等）：

```sh
deno desktop --output ./dist/MyApp.dmg main.ts
```

使用 `--icon` 设置应用图标（Windows 上为 `.ico`，macOS 上为 `.icns` 或 `.png`），并使用 `--include` / `--exclude` 将文件添加到编译后的二进制文件中或从中移除。这些也可以在 `deno.json` 中配置；参见
[配置](/runtime/desktop/configuration/)。

## 跨平台编译

`--target` 用于为其他平台构建，`--all-targets` 则一次性为所有受支持的平台构建。主机上不需要任何特定于平台的工具链：

```sh
deno desktop --target aarch64-apple-darwin main.ts
deno desktop --all-targets main.ts
```

有关支持的目标三元组和输出格式，请参见 [分发](/runtime/desktop/distribution/)。

## 开发

`--hmr` 在开发期间启用热模块替换来运行应用。参见
[热模块替换](/runtime/desktop/hmr/)。

```sh
deno desktop --hmr main.ts
```

`--inspect`、`--inspect-wait` 和 `--inspect-brk` 标志会同时将调试器附加到 Deno 运行时和渲染器。`--inspect-renderer` 会覆盖 CEF 渲染器的调试器监听地址。参见
[DevTools](/runtime/desktop/devtools/)。

## 配置

大多数设置都可以放在 `deno.json` 的 `desktop` 块中，而不是每次构建都传入：

```jsonc title="deno.json"
{
  "desktop": {
    "app": {
      "name": "MyApp",
      "identifier": "com.example.myapp",
      "icons": {
        "macos": "./icons/icon.icns",
        "windows": "./icons/icon.ico",
        "linux": "./icons/icon.png"
      }
    },
    "backend": "cef",
    "output": {
      "macos": "./dist/macos",
      "windows": "./dist/windows",
      "linux": "./dist/linux"
    },
    "release": { "baseUrl": "https://updates.example.com" },
    "errorReporting": { "url": "https://errors.example.com/report" }
  }
}
```

有关完整模式，请参见 [配置](/runtime/desktop/configuration/)。
