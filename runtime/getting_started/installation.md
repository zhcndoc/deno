---
last_modified: 2026-06-01
title: 安装
description: "在不同操作系统上安装 Deno 的指南。包括使用各种包管理器、手动安装方法以及 Docker 容器在 Windows、macOS 和 Linux 上的安装说明。"
oldUrl:
  - /runtime/manual/fundamentals/installation
  - /runtime/manual/getting_started/installation
  - /runtime/fundamentals/installation
---

Deno 是一个单一二进制可执行文件，没有外部依赖。它可运行于
macOS、Linux 和 Windows，并支持 x64 和 arm64 架构。

## 下载和安装

[deno_install](https://github.com/denoland/deno_install) 提供了方便的脚本来下载和安装二进制文件。

<deno-tabs group-id="operating-systems">
<deno-tab value="linux" label="Linux">

使用 Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

使用 [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

使用 [Nix](https://nixos.org/download.html):

```shell
nix-shell -p deno
```

</deno-tab>
<deno-tab value="mac" label="macOS" default>

使用 Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

使用 [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

使用 [Homebrew](https://formulae.brew.sh/formula/deno):

```shell
brew install deno
```

使用 [MacPorts](https://ports.macports.org/port/deno/):

```shell
sudo port install deno
```

使用 [Nix](https://nixos.org/download.html):

```shell
nix-shell -p deno
```

</deno-tab>
<deno-tab value="windows" label="Windows">

**注意：** Deno 需要 Windows 10 版本 1709 或更高版本，或 Windows Server 2016 版本 1709 及以上，因为它依赖于
[IsWow64Process2](https://learn.microsoft.com/en-us/windows/win32/api/wow64apiset/nf-wow64apiset-iswow64process2) 函数。

使用 PowerShell（Windows）:

```powershell
irm https://deno.land/install.ps1 | iex
```

使用 [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

使用 [Scoop](https://scoop.sh/):

```shell
scoop install deno
```

使用 [Chocolatey](https://chocolatey.org/packages/deno):

```shell
choco install deno
```

使用 [Winget](https://github.com/microsoft/winget-cli):

```shell
winget install DenoLand.Deno
```

</deno-tab>
</deno-tabs>

> <small>如果通过 npm 安装，Deno 命令的启动时间会受到影响。为了获得更好的性能，我们建议使用官方安装脚本（shell 或 PowerShell）。</small>

Deno 不提供官方 apt 仓库。在 Debian 或 Ubuntu 上，请使用上面的 shell 安装程序作为推荐的安装方式。

### 跨平台包管理器

这些版本管理器可在 macOS、Linux 和 Windows 上运行。

使用 [asdf](https://asdf-vm.com/):

```shell
asdf plugin add deno https://github.com/asdf-community/asdf-deno.git

# 下载并安装 Deno 的最新版本
asdf install deno latest

# 将其设置为全局默认的 Deno 版本
asdf set -u deno latest

# 将其设置为本地（仅当前项目）的默认 Deno 版本
asdf set deno latest
```

使用 [vfox](https://vfox.dev/):

```shell
vfox add deno

# 下载并安装 Deno 的最新版本
vfox install deno@latest

# 将 Deno 的版本设置为全局
vfox use --global deno
```

你也可以使用 [Cargo](https://crates.io/crates/deno) 从源代码构建并安装：

```shell
cargo install deno --locked
```

## 手动下载

Deno 二进制文件也可以手动安装，只需从
[github.com/denoland/deno/releases](https://github.com/denoland/deno/releases) 下载 zip 文件。
每个发布版本都会为每个平台提供一个归档文件，其中包含一个可执行文件：

| 平台                    | 资源                                |
| --------------------------- | ------------------------------------ |
| Windows x86_64              | `deno-x86_64-pc-windows-msvc.zip`    |
| Windows ARM64               | `deno-aarch64-pc-windows-msvc.zip`   |
| macOS ARM64 (Apple Silicon) | `deno-aarch64-apple-darwin.zip`      |
| macOS x86_64 (Intel)        | `deno-x86_64-apple-darwin.zip`       |
| Linux x86_64                | `deno-x86_64-unknown-linux-gnu.zip`  |
| Linux ARM64                 | `deno-aarch64-unknown-linux-gnu.zip` |

解压归档文件，并将 `deno` 可执行文件放到 `PATH` 中的某个位置。你
需要在 macOS 和 Linux 上设置可执行位。每个资源都有一个
匹配的 `.sha256sum` 文件用于验证下载。

## Docker

有关官方 Docker 镜像的更多信息和说明：
[https://github.com/denoland/deno_docker](https://github.com/denoland/deno_docker)

## 安装位置

### 二进制文件位置

当通过 shell 或 PowerShell 脚本安装时，`deno` 二进制文件会被放置在以下默认位置：

| 平台 | 默认路径 |
| ---- | -------- |
| macOS / Linux | `$HOME/.deno/bin/deno` |
| Windows | `%USERPROFILE%\.deno\bin\deno.exe` |

在运行安装脚本之前设置 `DENO_INSTALL` 环境变量，可以覆盖安装目录。

当通过包管理器（Homebrew、Scoop 等）安装时，二进制文件位置由该包管理器管理。

### 缓存位置

下载的依赖和编译后的制品会存储在 Deno 的缓存目录中。其默认路径取决于平台：

| 平台 | 默认路径 |
| ---- | -------- |
| Linux | `$HOME/.cache/deno` |
| macOS | `$HOME/Library/Caches/deno` |
| Windows | `%LOCALAPPDATA%\deno` |

通过设置 `DENO_DIR` 环境变量可以覆盖它（参见
[环境变量](/runtime/reference/env_variables/)）。运行 `deno info` 可
打印当前正在使用的目录。

## 测试你的安装

要测试您的安装，运行 `deno --version`。如果在控制台打印 Deno 版本，则表示安装成功。

使用 `deno help` 查看有关 Deno 标志和用法的帮助文本。获取 CLI 的详细指南
[这里](/runtime/getting_started/command_line_interface/)。

### 如果您看到“command not found”

如果 `deno --version` 报告 `command not found`，说明安装目录还不在
您的 `PATH` 中。要修复此问题：

- 打开一个新的终端窗口，或者重新启动您的 shell，以便加载更新后的 `PATH`。
  这是最常见的原因——安装脚本会更新您的 shell rc 文件，但现有的 shell 会话在重新加载之前不会看到更改。
- 确认安装目录在您的 `PATH` 中。shell 安装脚本在 macOS 和 Linux 上默认使用
  `~/.deno/bin`；对于基于 npm 的安装，运行 `npm config get prefix`
  以找到包含全局 `bin` 的目录。
- 如果您自定义了安装位置，可以使用 `DENO_INSTALL` 环境变量覆盖 shell 安装脚本的
  安装根目录，此时二进制文件位于 `$DENO_INSTALL/bin/deno`。

## 更新

要更新之前安装的 Deno 版本，您可以运行：

```shell
deno upgrade
```

或使用 [Homebrew](https://formulae.brew.sh/formula/deno)（macOS）：

```shell
brew upgrade deno
```

或使用 [Scoop](https://scoop.sh/)（Windows）：

```shell
scoop update deno
```

或使用 [Chocolatey](https://chocolatey.org/packages/deno)（Windows）：

```shell
choco upgrade deno
```

或使用 [Winget](https://github.com/microsoft/winget-cli)（Windows）：

```shell
winget upgrade DenoLand.Deno
```

这将从 [github.com/denoland/deno/releases](https://github.com/denoland/deno/releases) 获取最新版本，解压缩并用其替换您当前的可执行文件。

您也可以使用此工具安装特定版本的 Deno：

```shell
deno upgrade --version 2.7.0
```

## 卸载

如果您使用 shell 或 PowerShell 安装脚本安装了 Deno，请先清除
Deno 缓存目录（`$DENO_DIR`）：

```shell
deno clean
```

然后删除 Deno 的安装目录：

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS / Linux" default>

```shell
rm -rf ~/.deno
```

最后，从您的 shell 配置文件中删除加载 Deno 环境文件的那一行
（`~/.bashrc`、`~/.zshrc`、`~/.profile` 等）。shell 安装脚本会追加
类似 `. "$HOME/.deno/env"` 的一行——请删除那一行。Fish 用户还应
额外删除 `~/.config/fish/conf.d/deno.fish`。

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
Remove-Item -Recurse -Force "$env:USERPROFILE\.deno"
```

然后通过系统设置将 Deno 的 `bin` 目录从您的 `PATH` 环境变量中移除。

</deno-tab>
</deno-tabs>

如果您是通过包管理器（Homebrew、Scoop、Chocolatey 等）安装的 Deno，
请改用该包管理器的卸载命令（例如
`brew uninstall deno`、`scoop uninstall deno`）。

## 从源代码构建

有关如何从源代码构建的信息可以在 [`从源代码构建`](https://github.com/denoland/deno/blob/main/.github/CONTRIBUTING.md#building-from-source) 指南中找到。