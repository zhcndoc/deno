---
last_modified: 2026-06-11
title: "在 GitHub Actions 中运行 Deno"
description: "为 Deno 项目设置 GitHub Actions 工作流：使用 setup-deno 安装 Deno、缓存依赖、运行 fmt、lint 和 test、使用冻结的 lockfile 进行安装，并在多个 Deno 版本之间进行测试。"
url: /examples/deno_github_actions_tutorial/
---

Deno 将格式化器、代码检查器和测试运行器打包在 `deno` 二进制文件中，因此 CI
流水线只需要安装 Deno 并运行相应的子命令即可。

## 一个最小化的工作流

[`denoland/setup-deno`](https://github.com/denoland/setup-deno) action
会在运行器上安装 Deno。此工作流会在每次 push 和 pull request 时检查格式、执行 lint 并运行测试：

```yaml title=".github/workflows/ci.yml"
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x # 最新稳定版 Deno
          cache: true # 在多次运行之间缓存依赖

      - run: deno ci # 从 lockfile 安装依赖

      - run: deno fmt --check
      - run: deno lint
      - run: deno test --allow-all
```

`deno-version` 接受诸如 `v2.x` 这样的 semver 范围、精确版本或
`canary`。

## 使用冻结的 lockfile 进行安装

`deno ci` 类似于 `npm ci`：它大致等同于删除 `node_modules`
并运行 `deno install --frozen`，但如果缺少 `deno.lock` 会报错，
并且如果 `deno.json` 或 `package.json` 发生变化但没有刷新锁文件，
它也会失败。这样可以在问题进入生产环境之前捕捉到“版本已提升但忘记提交
lockfile”的错误。

:::note

`deno ci` 需要已提交的 `deno.lock`。如果你的仓库还没有它，
请先在本地运行 `deno install` 并提交生成的 lockfile。

:::

## 缓存如何工作

启用 `cache: true` 时，action 会保存并恢复 `DENO_DIR`，也就是 Deno 存放已下载依赖项的目录。缓存键包含 job id、
运行器的操作系统和架构，以及所有 `deno.lock` 文件的哈希
（`${{ hashFiles('**/deno.lock') }}`），因此只有当 lockfile 发生变化时缓存才会失效。第一次运行会下载所有内容并保存缓存；
后续运行则会恢复缓存，而不是重新下载。

如果想用别的内容作为缓存键，请设置 `cache-hash`（这会隐式
启用 `cache: true`）：

```yaml
- uses: denoland/setup-deno@v2
  with:
    cache-hash: ${{ hashFiles('**/deno.json') }}
```

## 跨 Deno 版本测试

为了尽早发现破坏性变更，可以使用矩阵在稳定版和 canary 上运行同一个任务：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    continue-on-error: ${{ matrix.deno-version == 'canary' }}
    strategy:
      matrix:
        deno-version: [v2.x, canary]
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: ${{ matrix.deno-version }}
          cache: true
      - run: deno test --allow-all
```

`continue-on-error` 可以防止 canary 失败导致整个工作流失败。

对于跨平台矩阵、覆盖率上传以及其他 CI 提供商，请参见
[持续集成](/runtime/reference/continuous_integration/)。
