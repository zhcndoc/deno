---
title: Installation
description: "A Guide to installing Deno on different operating systems. Includes instructions for Windows, macOS, and Linux using various package managers, manual installation methods, and Docker containers."
oldUrl:
  - /runtime/manual/fundamentals/installation
  - /runtime/manual/getting_started/installation
  - /runtime/fundamentals/installation
---

Deno 可以在 macOS、Linux 和 Windows 上运行。Deno 是一个单一的二进制可执行文件。它没有外部依赖。在 macOS 上，同时提供 M1（arm64）和 Intel（x64）可执行文件。在 Linux 和 Windows 上，仅支持 x64。

## 下载和安装

[deno_install](https://github.com/denoland/deno_install) 提供了方便的脚本来下载和安装二进制文件。

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

使用 Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

使用 [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

> <small>如果通过 npm 安装，Deno 命令的启动时间会受到影响。我们建议使用 shell 安装脚本以获得更好的性能。</small>

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

使用 [vfox](https://vfox.lhan.me/):

```shell
vfox add deno

# 下载并安装 Deno 的最新版本
vfox install deno@latest

# 将 Deno 的版本设置为全局
vfox use --global deno
```

</deno-tab>
<deno-tab value="windows" label="Windows">

使用 PowerShell（Windows）:

```powershell
irm https://deno.land/install.ps1 | iex
```

使用 [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

> <small>如果通过 npm 安装，Deno 命令的启动时间会受到影响。我们建议使用 PowerShell 安装脚本以获得更好的性能。</small>

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

使用 [vfox](https://vfox.lhan.me/):

```shell
vfox add deno

# 下载并安装 Deno 的最新版本
vfox install deno@latest

# 将 Deno 的版本设置为全局
vfox use --global deno
```

</deno-tab>
<deno-tab value="linux" label="Linux">

使用 Shell:

```shell
curl -fsSL https://deno.land/install.sh | sh
```

使用 [npm](https://npmjs.com/package/deno):

```shell
npm install -g deno
```

> <small>如果通过 npm 安装，Deno 命令的启动时间会受到影响。我们建议使用 shell 安装脚本以获得更好的性能。</small>

使用 [Nix](https://nixos.org/download.html):

```shell
nix-shell -p deno
```

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

使用 [vfox](https://vfox.lhan.me/):

```shell
vfox add deno

# 下载并安装 Deno 的最新版本
vfox install deno@latest

# 将 Deno 的版本设置为全局
vfox use --global deno
```

</deno-tab>
</deno-tabs>

您也可以使用 [Cargo](https://crates.io/crates/deno) 从源代码构建和安装：

```shell
cargo install deno --locked
```

Deno 二进制文件也可以手动安装，通过在 [github.com/denoland/deno/releases](https://github.com/denoland/deno/releases) 下载 zip 文件。这些包仅包含一个可执行文件。您将需要在 macOS 和 Linux 上设置可执行位。

## Docker

有关官方 Docker 镜像的更多信息和说明：
[https://github.com/denoland/deno_docker](https://github.com/denoland/deno_docker)

## 测试您的安装

要测试您的安装，运行 `deno --version`。如果在控制台打印 Deno 版本，则表示安装成功。

使用 `deno help` 查看有关 Deno 标志和用法的帮助文本。获取 CLI 的详细指南
[这里](/runtime/getting_started/command_line_interface/)。

## 更新

要更新之前安装的 Deno 版本，您可以运行：

```shell
deno upgrade
```

或者使用 [Winget](https://github.com/microsoft/winget-cli)（Windows）:

```shell
winget upgrade DenoLand.Deno
```

这将从 [github.com/denoland/deno/releases](https://github.com/denoland/deno/releases) 获取最新版本，解压缩并用其替换您当前的可执行文件。

您也可以使用此工具安装特定版本的 Deno：

```shell
deno upgrade --version 1.0.1
```

## 从源代码构建

有关如何从源代码构建的信息可以在
[`贡献`](/runtime/contributing/building_from_source/) 章节中找到。