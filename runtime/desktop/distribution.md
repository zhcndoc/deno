---
last_modified: 2026-06-25
title: "分发"
description: "从一台机器为 macOS、Windows 和 Linux 交叉编译 Deno 桌面应用，并生成各平台输出格式：.app、.dmg、.exe 目录、AppImage。"
---

:::info 可在 Deno 2.9 中使用

`deno desktop` 从 Deno v2.9.0 开始可用。如果你使用的是更早的
版本，请[更新 Deno](/runtime/reference/cli/upgrade/)以使用它。

:::

`deno desktop` 可从任何宿主机进行交叉编译。同一台机器可为 macOS
Intel、macOS arm64、Windows x86_64、Linux arm64 和 Linux x86_64 构建。后端二进制文件（CEF、WebView 等）会按需下载。

## 每个平台的输出

```sh
# 为宿主平台构建。
deno desktop main.ts

# 为特定目标构建。
deno desktop --target aarch64-apple-darwin main.ts

# 一次性为所有受支持的目标构建。
deno desktop --all-targets main.ts
```

支持的三元组：

| 三元组                      | 操作系统 | 架构         |
| --------------------------- | -------- | ------------ |
| `aarch64-apple-darwin`      | macOS    | arm64        |
| `x86_64-apple-darwin`       | macOS    | Intel        |
| `x86_64-pc-windows-msvc`    | Windows  | x86_64       |
| `aarch64-unknown-linux-gnu` | Linux    | arm64        |
| `x86_64-unknown-linux-gnu`  | Linux    | x86_64       |

CLI 会自动获取匹配的预构建 `denort` 以及匹配的预构建后端
归档文件。宿主机不需要任何平台特定的工具链。

## 输出格式

输出扩展名决定格式：

### macOS

| 输出         | 生成方式                                         |
| ------------ | ------------------------------------------- |
| `MyApp.app/` | 默认；`.app` bundle。                     |
| `MyApp.dmg`  | `hdiutil`；可拖拽到“应用程序”的磁盘映像。 |

`.app` bundle 具有标准布局：

```
MyApp.app/
  Contents/
    Info.plist
    MacOS/
      MyApp                  # 启动器
    Resources/
      icon.icns
    Frameworks/
      Chromium Embedded Framework.framework/    # CEF 后端
      …
```

默认启用自解压模式：嵌入式虚拟文件系统
（你的代码、框架构建输出、静态资源）会在首次运行时解压到磁盘，
以便 Next.js 等框架能相对于当前工作目录找到其构建输出。

### Windows

| Output      | Produced by                                           |
| ----------- | ----------------------------------------------------- |
| `MyApp/`    | 默认；带有启动器和支持文件的目录。 |
| `MyApp.msi` | Windows Installer 包（按机器安装）。      |

`MyApp/` 目录包含：

```
MyApp/
  MyApp.bat               # 启动器
  denort.dll              # Deno 运行时 + 你的代码
  *.dll                   # 渲染后端和 CEF 库
  resources.pak, locales/ # CEF 支持文件
  AppIcon.ico             # 图标（可选）
```

设置 `.msi` 输出扩展名可直接构建 Windows Installer 包。它会将应用按机器安装到 `%ProgramFiles%\<AppName>\` 下，并注册卸载程序。MSI 使用纯 Rust 编写，因此可从任何宿主机进行交叉编译（只要求目标系统是 Windows）。若要用其他方式打包该目录，可将其压缩为 zip，或交给第三方安装程序生成器，例如 Inno Setup、NSIS 或 WiX。

### Linux

| 输出              | 生成方式                                  |
| ----------------- | -------------------------------------------- |
| `my-app/`         | 默认；带有启动器脚本的应用目录。 |
| `my-app.AppImage` | 单文件便携式包。                 |
| `my-app.deb`      | Debian/Ubuntu 软件包。                       |
| `my-app.rpm`      | Fedora/RHEL 软件包。                         |

应用目录布局：

```
my-app/
  my-app                  # 启动器 shell 脚本
  libdenort.so            # Deno 运行时 + 你的代码
  *.so                    # 渲染后端和 CEF 库
  resources.pak, locales/ # CEF 支持文件
  AppIcon.png             # 图标（可选）
```

`AppImage` 是最便携的 Linux 格式：单个文件、无需安装、可在
任何现代发行版上运行。`deno desktop` 直接构建它：它会将应用目录
打包为 SquashFS 镜像，并在前面附加 AppImage Type-2 运行时，同时添加所需的
`AppRun`、`.desktop` 和图标条目。无需安装任何外部工具（没有 `appimagetool`），
并且它可从任何构建宿主机运行，因此你可以在从 macOS 或 Windows 交叉编译时
生成 Linux `.AppImage`。

设置 `.deb` 或 `.rpm` 输出扩展名可直接构建 Linux 软件包。两者都会
将应用安装到 `/usr/lib/<pkg>/` 下，将启动器符号链接到 `/usr/bin/`，
并注册 `.desktop` 条目和图标。与 `.AppImage` 一样，它们使用纯 Rust
组装，并可从任何宿主机进行交叉编译（只要求目标系统是 Linux）。

## 压缩捆绑包

传入 `--compress` 以生成自解压捆绑包。较大的负载（运行时和 UI 后端）会在分发的应用中被压缩，并在首次启动时解压到按用户划分的数据目录中，之后再次运行时会复用。这会显著缩小分发产物的体积，一个 webview hello-world 示例会从大约 66 MB 降到 19 MB，代价是首次启动时需要进行一次解压。

```sh
# 自解压的压缩捆绑包
deno desktop --compress main.ts

# 显式选择编解码器
deno desktop --compress=xz main.ts
deno desktop --compress=zstd main.ts
```

`xz` 生成的产物更小；`zstd` 则以稍大的体积换取更快的首次启动解压速度。

## 选择输出路径

输出路径可以在三个位置设置，优先级如下：

1. `--output` CLI 标志。
2. `deno.json` 中的 `desktop.output` 字段（按平台分别设置）。
3. 默认值：项目名称，并附加对应平台的扩展名。

```sh
# 每次构建时覆盖：
deno desktop --output ./builds/MyApp-1.4.0.dmg main.ts
```

```jsonc title="deno.json"
{
  "desktop": {
    "output": {
      "macos": "./dist/macos/MyApp.app",
      "windows": "./dist/windows/MyApp",
      "linux": "./dist/linux/my-app.AppImage"
    }
  }
}
```

## 交叉编译细节

从一个操作系统交叉编译到另一个操作系统需要：

- 适用于目标平台的正确 `denort` 二进制文件。会自动从
  `github.com/denoland/deno/releases` 下载，并与你本地的 Deno 版本匹配。
- 适用于目标平台的正确后端归档文件。会自动下载，并锁定到
  你的 Deno 版本。

这两个下载内容都会进行 SHA-256 验证，并缓存到 `<deno_dir>/` 下。

交叉编译桌面应用时**不涉及 Rust 工具链**。你并不是在宿主机上编译 Rust；
你是在下载目标平台的预构建产物，并将它们与你的代码一起打包。其模式与
`deno compile --target` 相同。

图标组装（`.icns`、`.ico`）以及 Linux `.AppImage` 可在任意
宿主机上生成。唯一的例外是 macOS `.dmg`，它会调用 `hdiutil`，因此
必须在 macOS 宿主机上构建。若要从其他平台生成 `.dmg`，
请在 macOS CI 机器上构建。

## CI

一个典型的 GitHub Actions 矩阵会并行构建平台原生安装包：

```yaml title=".github/workflows/release.yml"
jobs:
  build:
    strategy:
      matrix:
        include:
          - { os: macos-14, target: aarch64-apple-darwin }
          - { os: macos-15-intel, target: x86_64-apple-darwin }
          - { os: windows-latest, target: x86_64-pc-windows-msvc }
          - { os: ubuntu-latest, target: x86_64-unknown-linux-gnu }
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2

      - run: deno desktop --target ${{ matrix.target }} main.ts

      - uses: actions/upload-artifact@v4
        with:
          name: my-app-${{ matrix.target }}
          path: dist/
```

从单一宿主机进行交叉编译（例如仅在 `ubuntu-latest` 上运行并使用
`--all-targets`）对于 bundle 和 Linux `.AppImage` 都可行。只有 macOS
`.dmg` 需要 macOS 宿主机。

## 代码签名

在 macOS 上，`deno desktop` 会为你对 bundle 进行代码签名。默认情况下它会应用
**ad-hoc** 签名（`-`），这会为应用提供稳定的代码标识，足以让操作系统授予
[通知](/runtime/desktop/notifications/)权限，但不足以在不触发 Gatekeeper 警告的情况下分发。
CEF 辅助进程的 bundle 标识符会自动与主 bundle id 保持一致。

要生成可分发、可公证的 bundle，请在 `deno.json` 中设置真实的签名身份（签名必须在 macOS 宿主机上运行，因为它会调用
`codesign(1)`）：

```jsonc title="deno.json"
{
  "desktop": {
    "app": { "identifier": "com.example.myapp" },
    "macos": {
      "codesignIdentity": "Developer ID Application: Acme, Inc. (TEAMID)"
    }
  }
}
```

使用真实身份后，bundle 会使用 Hardened Runtime 和安全时间戳进行签名。**公证仍然是单独的一步**。使用 `xcrun notarytool submit` 提交已签名的 bundle，
并附加票据。

在 Windows 上，目前请在外部对生成的可执行文件进行签名（输出目录中的后端 `.exe` 和 `denort.dll`），例如：
`signtool sign /f cert.pfx /tr <timestamp> <file>`。

## 发布后分发更新

一旦你的二进制文件交到用户手中，就通过
[`Deno.autoUpdate()`](/runtime/desktop/auto_update/) 发布更新：从你自己的服务器提供 `bsdiff` 补丁，无需应用商店。
