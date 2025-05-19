---
title: "Continuous integration"
description: "Guide to setting up continuous integration (CI) pipelines for Deno projects. Learn how to configure GitHub Actions workflows, run tests and linting in CI, handle cross-platform builds, and optimize pipeline performance with caching."
oldUrl: /runtime/manual/advanced/continuous_integration
---

Deno 的内置工具使得为您的项目设置持续集成（CI）管道变得简单。您可以使用相应的命令 `deno test`、`deno lint` 和 `deno fmt` 对您的代码进行 [测试](/runtime/fundamentals/testing)、[代码检查和格式化](/runtime/fundamentals/linting_and_formatting/)。此外，您还可以在管道中使用 `deno coverage` 从测试结果中生成代码覆盖率报告。

## 设置基本管道

您可以在 GitHub Actions 中为 Deno 项目设置基本管道。本页面上解释的概念在其他 CI 提供商中也适用，例如 Azure Pipelines、CircleCI 或 GitLab。

为 Deno 构建管道通常从签出代码库和安装 Deno 开始：

```yaml
name: Build

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x # 使用最新的稳定版 Deno 运行。
```

要扩展工作流程，添加您可能需要的任何 `deno` 子命令：

```yaml
# 检查代码是否按照 Deno 的默认格式化约定进行格式化。
- run: deno fmt --check

# 扫描代码中的语法错误和风格问题。如果
# 您想使用自定义的 linter 配置，可以使用 --config <myconfig> 添加配置文件。
- run: deno lint

# 运行代码库中的所有测试文件并收集代码覆盖率。示例
# 使用所有权限运行，但建议使用您的程序所需的最小权限运行（例如 --allow-read）。
- run: deno test --allow-all --coverage=cov/

# 这会从 `deno test --coverage` 中收集的覆盖率生成报告。它会
# 存储为 .lcov 文件，可以很好地与像 Codecov、Coveralls 和 Travis CI 这样的服务集成。
- run: deno coverage --lcov cov/ > cov.lcov
```

## 跨平台工作流程

作为 Deno 模块的维护者，您可能希望知道您的代码是否在今天使用的所有主要操作系统上运行正常：Linux、MacOS 和 Windows。通过运行一个并行作业的矩阵，可以实现跨平台工作流程，每个作业在不同的操作系统上运行构建：

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - run: deno test --allow-all --coverage cov/
```

:::caution

注意：GitHub Actions 在处理 Windows 风格的行结束符（CRLF）时存在一个已知 [问题](https://github.com/actions/checkout/issues/135)。这可能导致在管道中运行 `deno fmt` 时出现问题，而该管道的作业在 `windows` 上运行。为防止此情况发生，请在运行 `actions/checkout@v4` 步骤之前，将 Actions 运行器配置为使用 Linux 风格的行结束符：

```sh
git config --system core.autocrlf false
git config --system core.eol lf
```

:::

如果您正在使用实验性或不稳定的 Deno API，可以添加一个矩阵作业来运行 Deno 的金丝雀版本。这可以帮助及早发现重大更改：

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.canary }} # 如果金丝雀运行不成功，则继续
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        deno-version: [v1.x]
        canary: [false]
        include:
          - deno-version: canary
            os: ubuntu-latest
            canary: true
```

## 加速 Deno 管道

### 减少重复

在跨平台运行中，管道的某些步骤并不一定需要针对每个操作系统运行。例如，在 Linux、MacOS 和 Windows 上生成相同的测试覆盖率报告是有点冗余的。在这些情况下，您可以使用 GitHub Actions 的 `if` 条件关键字。下面的示例展示了如何仅在 `ubuntu`（Linux）运行器上运行代码覆盖率生成和上传步骤：

```yaml
- name: Generate coverage report
  if: matrix.os == 'ubuntu-latest'
  run: deno coverage --lcov cov > cov.lcov

- name: Upload coverage to Coveralls.io
  if: matrix.os == 'ubuntu-latest'
  # 可以使用任何代码覆盖率服务，Coveralls.io 这里作为示例使用。
  uses: coverallsapp/github-action@master
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }} # 由 GitHub 生成。
    path-to-lcov: cov.lcov
```

### 缓存依赖

随着项目规模的扩大，通常会包含越来越多的依赖。Deno 在测试期间会下载这些依赖，如果一个工作流程一天运行多次，这可能会变得耗时。加快速度的一个常见解决方案是缓存依赖，这样就不需要重新下载。

Deno 将依赖项存储在本地缓存目录中。在管道中，可以通过在 `denoland/setup-deno` 上启用 `cache: true` 选项来保留工作流之间的缓存。

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: denoland/setup-deno@v2
    with:
      cache: true
```

最初，当这个工作流程运行时，缓存仍然是空的，像 `deno test` 这样的命令仍然需要下载依赖项，但当作业成功时，缓存的依赖项内容会被保存，任何后续运行都可以从缓存中恢复它们，而不是重新下载。

为了演示，假设你有一个使用来自 [`@std/log`](https://jsr.io/@std/log) 的日志记录器的项目：

```json, title="deno.json"
{
  "imports": {
    "@std/log": "jsr:@std/log@0.224.5"
  }
}
```

为了增加这个版本，您可以更新依赖项，然后重新加载缓存并在本地更新锁定文件：

```console
deno install --reload --frozen=false
```

您应该在运行此操作后看到锁定文件内容的变化。当这个更改被提交并通过管道运行时，您应该看到一个新的缓存，并在随后的任何运行中使用它。

默认情况下，缓存会自动根据以下内容生成键：

- github [job_id](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_id)
- 运行器的操作系统和架构
- 项目中 `deno.lock` 文件的哈希值

可以通过 `cache-hash` 输入自定义作为缓存键一部分的默认哈希（`${{ hashFiles('**/deno.lock') }}`）。

```yaml
- uses: denoland/setup-deno@v2
  with:
    # setting `cache-hash` implies `cache: true` and will replace
    # the default cache-hash of `${{ hashFiles('**/deno.lock') }}`
    cache-hash: ${{ hashFiles('**/deno.json') }}
```