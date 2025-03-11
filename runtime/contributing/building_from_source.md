---
title: "Building from Source"
description: "Step-by-step guide for building Deno from source code. Learn how to set up your development environment and compile Deno for your target platform."
oldUrl:
 - /runtime/references/contributing/building_from_source/
 - /runtime/manual/references/contributing/building_from_source/
---

以下是如何从源代码构建 Deno 的说明。如果您只想使用 Deno，您可以下载预构建的可执行文件（更多信息请参阅
[`入门`]( /runtime/getting_started/installation/) 章节）。

## 克隆仓库

:::note

Deno 使用子模块，因此您必须记得使用 `--recurse-submodules` 克隆。

:::

**Linux（Debian）**/**Mac**/**WSL**：

```shell
git clone --recurse-submodules https://github.com/denoland/deno.git
```

**Windows**：

1. [启用“开发者模式”](https://www.google.com/search?q=windows+enable+developer+mode)
   （否则符号链接将需要管理员权限）。
2. 确保您使用的是 git 版本 2.19.2.windows.1 或更新版本。
3. 在检出之前设置 `core.symlinks=true`：

   ```shell
   git config --global core.symlinks true
   git clone --recurse-submodules https://github.com/denoland/deno.git
   ```

## 先决条件

### Rust

:::note

Deno 需要特定版本的 Rust。Deno 可能不支持其他版本或 Rust Nightly 版本的构建。所需的 Rust 版本在 `rust-toolchain.toml` 文件中指定。

:::

[更新或安装 Rust](https://www.rust-lang.org/tools/install)。检查 Rust 是否正确安装/更新：

```console
rustc -V
cargo -V
```

### 本机编译器和链接器

Deno 的许多组件需要本机编译器来构建优化的本机函数。

#### Linux（Debian）/WSL

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
./llvm.sh 17
apt install --install-recommends -y cmake libglib2.0-dev
```

#### Mac

Mac 用户必须安装 _XCode 命令行工具_。
（[XCode](https://developer.apple.com/xcode/) 已经包含了 _XCode 命令行工具_。运行 `xcode-select --install` 可以在不安装 XCode 的情况下安装它。）

[CMake](https://cmake.org/) 也是必需的，但不会随 _命令行工具_ 一起提供。

```console
brew install cmake
```

#### Mac M1/M2

对于 Apple aarch64 用户，需要安装 `lld`。

```console
brew install llvm lld
# 将 /opt/homebrew/opt/llvm/bin/ 添加到 $PATH
```

#### Windows

1. 获取 [VS Community 2019](https://www.visualstudio.com/downloads/) 和 "Desktop development with C++" 工具包，并确保选择以下所需工具：

   - CMake 的 Visual C++ 工具
   - Windows 10 SDK (10.0.17763.0)
   - 测试工具核心功能 - 构建工具
   - x86 和 x64 的 Visual C++ ATL
   - x86 和 x64 的 Visual C++ MFC
   - C++/CLI 支持
   - 适用于桌面的 VC++ 2015.3 v14.00 (v140) 工具集

2. 启用 "Windows 的调试工具"。
   - 转到 "控制面板" → "程序" → "程序和功能"
   - 选择 "Windows 软件开发工具包 - Windows 10"
   - → "更改" → "更改" → 选中 "Windows 的调试工具" → "更改" → "完成"。
   - 或使用：
     [Windows 的调试工具](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/)
     （注意：它将下载文件，您应该手动安装 `X64 Debuggers And Tools-x64_en-us.msi` 文件）。

### Protobuf 编译器

构建 Deno 需要 [Protocol Buffers 编译器](https://grpc.io/docs/protoc-installation/)。

#### Linux（Debian）/WSL

```sh
apt install -y protobuf-compiler
protoc --version  # 确保编译器版本是 3+
```

#### Mac

```sh
brew install protobuf
protoc --version  # 确保编译器版本是 3+
```

#### Windows

Windows 用户可以从 [GitHub](https://github.com/protocolbuffers/protobuf/releases/latest) 下载最新的二进制版本。

## Python 3

:::note

Deno 需要 [Python 3](https://www.python.org/downloads) 来运行 WPT 测试。确保 `PATH` 中存在不带后缀的 `python`/`python.exe`，并且它指向 Python 3。

:::

## 构建 Deno

构建 Deno 最简单的方法是使用预编译的 V8 版本。

_对于 WSL，请确保在 `.wslconfig` 中分配了足够的内存。建议分配至少 16GB。_

```console
cargo build -vv
```

但是，如果您正在进行较低级别的 V8 开发，或者使用没有 V8 预编译版本的平台，您可能还想从源代码构建 Deno 和 V8：

```console
V8_FROM_SOURCE=1 cargo build -vv
```

从源代码构建 V8 时，可能会有更多的依赖关系。有关 V8 构建的更多详细信息，请参见 [rusty_v8 的 README](https://github.com/denoland/rusty_v8)。

## 构建

使用 Cargo 构建：

```shell
# 构建：
cargo build -vv

# 构建错误？确保您有最新的 main 并再次尝试构建，或者如果还是不行，请尝试：
cargo clean && cargo build -vv

# 运行：
./target/debug/deno run tests/testdata/run/002_hello.ts
```

## 运行测试

Deno 有一套全面的测试套件，使用 Rust 和 TypeScript 编写。Rust 测试可以在构建过程中运行：

```shell
cargo test -vv
```

TypeScript 测试可以使用：

```shell
# 运行所有单元/测试：
target/debug/deno test -A --unstable --lock=tools/deno.lock.json --config tests/config/deno.json tests/unit

# 运行特定测试：
target/debug/deno test -A --unstable --lock=tools/deno.lock.json --config tests/config/deno.json tests/unit/os_test.ts
```

## 处理多个 crate

如果更改集跨越多个 Deno crate，您可能希望将多个 crate 一起构建。建议您将所有所需的 crate 检出到彼此旁边。例如：

```shell
- denoland/
  - deno/
  - deno_core/
  - deno_ast/
  - ...
```

然后您可以使用 [Cargo 的补丁功能](https://doc.rust-lang.org/cargo/reference/overriding-dependencies.html) 来覆盖默认依赖路径：

```shell
cargo build --config 'patch.crates-io.deno_ast.path="../deno_ast"'
```

如果您正在处理几天的更改集，您可能更愿意将补丁添加到 `Cargo.toml` 文件中（只需确保在提交更改之前将其删除）：

```sh
[patch.crates-io]
deno_ast = { path = "../deno_ast" }
```

这将从本地路径构建 `deno_ast` crate，并链接到该版本，而不是从 `crates.io` 获取。

**注意**：依赖项的版本在 `Cargo.toml` 中必须与您磁盘上的依赖项版本匹配。

使用 `cargo search <dependency_name>` 来检查版本。