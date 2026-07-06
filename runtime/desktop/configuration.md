---
last_modified: 2026-06-30
title: "配置"
description: "在 deno.json 中配置 deno desktop：应用元数据、图标、深度链接 URL 协议、后端选择、输出路径、错误报告，以及自动更新服务器。"
---

:::info Deno 2.9 中可用

`deno desktop` 从 Deno v2.9.0 开始可用。如果你使用的是更早的
版本，请[更新 Deno](/runtime/reference/cli/upgrade/)以使用它。

:::

`deno desktop` 的所有配置都位于 `deno.json` 中的 `desktop` 块里。大多数字段都是可选的；即使项目根本没有 `desktop` 块，也仍然可以编译，并使用合理的默认值。

## 完整示例

```jsonc title="deno.json"
{
  "name": "my-app",
  "version": "1.4.0",
  "exports": "./main.ts",
  "desktop": {
    "app": {
      "name": "我的应用",
      "identifier": "com.example.myapp",
      "icons": {
        "macos": "./icons/app.icns",
        "windows": "./icons/app.ico",
        "linux": "./icons/app.png"
      },
      "deepLinks": ["myapp"]
    },
    "backend": "cef",
    "output": {
      "macos": "./dist/MyApp.app",
      "windows": "./dist/MyApp",
      "linux": "./dist/my-app"
    },
    "macos": {
      "codesignIdentity": "Developer ID Application: Acme, Inc. (TEAMID)"
    },
    "release": {
      "baseUrl": "https://releases.example.com/my-app"
    },
    "errorReporting": {
      "url": "https://errors.example.com/report"
    }
  }
}
```

## `app`

编译进二进制文件的元数据。

### `app.name`

应用的显示名称。用于窗口标题默认值、macOS 菜单栏应用名称、Windows 任务栏提示以及 Linux `.desktop` 条目名称。若未设置，则回退到 `deno.json` 根部的 `name` 字段。

### `app.identifier`

反向 DNS 的 bundle / 应用标识符（例如 `com.example.myapp`）。用于 macOS 的 `CFBundleIdentifier`、Linux `.desktop` 文件标识符以及 Windows AppUserModelID。未设置时，会生成一个形如 `com.deno.desktop.<app-slug>` 的合成值。macOS 需要稳定的标识符才能授予通知权限，因此任何使用
[通知](/runtime/desktop/notifications/) 的应用都应设置一个真实的标识符。

### `app.icons`

按平台区分的图标路径，相对于 `deno.json`。

```jsonc
"icons": {
  "macos":   "./icons/app.icns",
  "windows": "./icons/app.ico",
  "linux":   "./icons/app.png"
}
```

对于 macOS 和 Linux，你也可以传入一个 PNG 数组，在构建时组装成多分辨率图标：

```jsonc
"icons": {
  "macos": [
    { "path": "./icons/16.png",  "size": 16  },
    { "path": "./icons/32.png",  "size": 32  },
    { "path": "./icons/128.png", "size": 128 },
    { "path": "./icons/256.png", "size": 256 },
    { "path": "./icons/512.png", "size": 512 }
  ]
}
```

`.icns`（macOS）和 `.ico`（Windows）输入会原样透传。PNG 会根据平台被组装进相应的容器中。

如果某个平台没有设置 `icons` 条目，则会使用默认的 Deno 图标。

### `app.deepLinks`

应用向操作系统注册的自定义 URL scheme（深度链接），这样打开一个
`<scheme>://...` 链接时就会路由到你的应用。每个条目都是一个不含
`://` 的纯 scheme 名称。

```jsonc
"deepLinks": ["myapp"]
```

使用上面的配置后，操作系统会将 `myapp://open/document/42` 视为属于你的
应用。如果你的应用处理多个 scheme，可以列出多个：

```jsonc
"deepLinks": ["myapp", "myapp-beta"]
```

scheme 名称遵循
[RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986#section-3.1) 语法：
必须以 ASCII 字母开头，且其余部分可以包含字母、数字、
`+`、`-` 和 `.`。注册时名称会转换为小写。保留的
scheme `http`、`https`、`file`、`ftp`、`ws` 和 `wss` 会被拒绝，因为
将它们注册为应用处理程序会劫持正常浏览。无效或保留的 scheme 会导致
构建失败。

注册会在打包时按平台进行：

- **macOS** 会在 bundle 的 `Info.plist` 中添加一个 `CFBundleURLTypes` 条目（将你的 scheme 放在
  `CFBundleURLSchemes` 下）。这会在代码签名之前写入，因此签名仍然有效。
- **Linux** 会在 `.desktop` 条目中添加一个 `x-scheme-handler/<scheme>` MIME 类型，并确保
  `Exec=` 通过 `%u` 字段代码转发打开的 URL。
- **Windows** 对协议处理程序没有包内注册，因此
  打包器会在启动器旁边放置一个 `register-deep-links.bat`。它会写入
  指向启动器的 `HKCU\Software\Classes\<scheme>` 键。安装程序（或用户）会在安装后运行一次。

:::info 仅注册

这会将这些 scheme 注册到操作系统，以便链接被路由到你的应用。
在运行中的应用内处理打开的 URL（将 URL 传递给你的代码）会在后续版本中提供；请先声明你的 scheme，以便完成打包和操作系统注册。

:::

## `backend`

要嵌入的 Web 渲染引擎。可选 `"cef"`、`"webview"` 或 `"raw"`。默认值：`"webview"`。

```jsonc
"backend": "webview"
```

CLI 标志 `--backend` 会在单次构建中覆盖此设置，但只接受 `cef` 和 `webview`；如果要使用 `raw`，请在 `deno.json` 中设置。有关权衡和支持的目标平台，请参见
[后端](/runtime/desktop/backends/)。

## `output`

按平台区分的输出路径。

```jsonc
"output": {
  "macos":   "./dist/MyApp.app",
  "windows": "./dist/MyApp",
  "linux":   "./dist/my-app"
}
```

路径的扩展名决定生成内容：

| macOS 上的扩展名 | 输出                               |
| ---------------- | ------------------------------------ |
| `.app`           | macOS 应用程序包                    |
| `.dmg`           | DMG 磁盘映像（通过 `hdiutil` 构建） |

| Windows 上的扩展名 | 输出                                        |
| ------------------- | --------------------------------------------- |
| (无) / 目录         | 带有 `.bat` 启动器和 DLL 的应用目录         |
| `.msi`              | Windows Installer 安装包                    |

| Linux 上的扩展名 | 输出                             |
| ---------------- | ---------------------------------- |
| (无) / 目录       | 带有启动脚本的应用目录             |
| `.AppImage`        | `.AppImage` 单文件捆绑包          |
| `.deb`             | Debian/Ubuntu 软件包              |
| `.rpm`             | Fedora/RHEL 软件包               |

CLI 标志 `--output` 会在单次构建中覆盖此设置。

## `macos`

macOS 专用构建选项。

### `macos.codesignIdentity`

用于对 macOS bundle 进行签名的代码签名身份，例如
`"Developer ID Application: Acme, Inc. (TEAMID)"`，或者用 `"-"` 表示显式的
adhoc 签名。未设置时，`deno desktop` 仍会对 bundle 进行 adhoc 签名，使其具有稳定的代码身份（通知权限所需），但结果在未进一步签名的情况下不能分发。设置真实的 Developer ID 身份可生成可公证的 bundle。参见
[Distribution](/runtime/desktop/distribution/#code-signing)。

## `release`

自动更新系统的配置。

### `release.baseUrl`

发布服务器的基础 URL。运行时会获取 `<baseUrl>/latest.json`，并根据此 URL 下载补丁文件。有关完整的清单格式和补丁流程，请参见
[自动更新](/runtime/desktop/auto_update/)。

```jsonc
"release": {
  "baseUrl": "https://releases.example.com/my-app"
}
```

这是运行时自动轮询的**唯一**服务器 URL。
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) 默认使用此 URL，但可以在每次调用时覆盖。

## `errorReporting`

捕获未捕获异常、未处理的拒绝和 panic，显示原生提示，并可选择向服务器 `POST` 一份 JSON 报告。

### `errorReporting.url`

```jsonc
"errorReporting": {
  "url": "https://errors.example.com/report"
}
```

如果未设置，错误报告将处于“仅提示”模式：未捕获的错误仍会显示原生提示，但不会发送报告。

有关报告模式，请参见 [错误报告](/runtime/desktop/error_reporting/)。

## 工作目录与资源

编译后的二进制文件运行时，其当前工作目录设置为用户的 `cwd`，而不是二进制所在目录。如果你的应用需要查找相对于自身的文件（框架构建输出、静态资源），请使用 `import.meta` 或框架自身的解析方式；不要假设
[`Deno.cwd()`](/api/deno/~/Deno.cwd)。

对于框架项目，这一点会自动处理：检测到的构建输出（`.next/`、`dist/`、`_fresh/`、`.output/` 等）会被嵌入到二进制的虚拟文件系统中，并在运行时自动解压，因此框架代码可以在其自己的工作目录下找到它们。

## 校验

`deno desktop` 会在开始时对配置进行校验：

- `backend` 必须是列出的值之一。
- 图标路径必须解析到存在的文件。
- 输出路径必须可写。
- `release.baseUrl` 必须能够解析为 URL。
- `app.deepLinks` 条目必须是有效的、未保留的 URL scheme。

错误会连同出错的 `deno.json` 位置一起报告。
