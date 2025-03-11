---
title: "Web 平台测试"
description: "Guide to running and maintaining Web Platform Tests (WPT) in Deno. Learn how to set up the test environment, run tests, update test expectations, and contribute to Deno's web platform compatibility testing."
oldUrl: /runtime/manual/references/contributing/web_platform_tests/
---

Deno 使用自定义测试运行器进行 Web 平台测试。它可以在 `./tools/wpt.ts` 找到。

## 运行测试

> 如果您使用的是 Windows，或您的系统不支持哈希邦（hashbang），请在所有 `./tools/wpt.ts` 命令前加上 
> `deno run --unstable --allow-write --allow-read --allow-net --allow-env --allow-run`。

在第一次尝试运行 WPT 测试之前，请先运行 WPT 设置。
您必须在每次更新 `./test_util/wpt` 子模块时都运行此命令：

```shell
./tools/wpt.ts setup
```

要运行所有可用的 Web 平台测试，请运行以下命令：

```shell
./tools/wpt.ts run

# 您还可以通过指定过滤器来筛选要运行的测试文件：
./tools/wpt.ts run -- streams/piping/general hr-time
```

测试运行器将运行每个 Web 平台测试并记录其状态（失败或正常）。然后，它将把此输出与 `./tools/wpt/expectation.json` 文件中指定的每个测试的预期输出进行比较。该文件是一个嵌套的 JSON 结构，镜像了 `./test_utils/wpt` 目录。它描述了每个测试文件是否应该整体通过（所有测试通过，`true`），是否应该整体失败（测试运行器在测试外遇到异常或所有测试失败，`false`），或者它期望哪些测试失败（一个测试用例名称的字符串数组）。

## 更新启用的测试或预期

您可以通过更改 JSON 结构中每个测试文件条目的值手动更新 `./tools/wpt/expectation.json` 文件。替代的更好的选项是让 WPT 运行器运行所有测试，或一个过滤的子集，然后自动更新 `expectation.json` 文件以匹配当前现实。您可以使用 `./wpt.ts update` 命令来做到这一点。示例：

```shell
./tools/wpt.ts update -- hr-time
```

运行该命令后，`expectation.json` 文件将与运行的所有测试的当前输出匹配。这意味着在 `wpt.ts update` 后立即运行 `wpt.ts run` 应始终通过。

## 子命令

### `setup`

验证您的环境是否配置正确，或帮助您进行配置。

这将检查 python3（或 Windows 上的 `python.exe`）是否确实是 Python 3。

您可以指定以下标志来自定义行为：

```console
--rebuild
    重建清单而不是下载。这可能需要长达 3 分钟。

--auto-config
    如果未配置，自动配置 /etc/hosts（不会显示提示）。
```

### `run`

运行 `expectation.json` 中指定的所有测试。

您可以指定以下标志来自定义行为：

```console
--release
    使用 ./target/release/deno 二进制文件，而不是 ./target/debug/deno

--quiet
    禁用打印 `ok` 测试用例。

--json=<file>
    将测试结果作为 JSON 输出到指定的文件中。
```

您还可以通过在 `--` 后指定一个或多个过滤器来精确指定要运行的测试：

```console
./tools/wpt.ts run -- hr-time streams/piping/general
```

### `update`

更新 `expectation.json` 以匹配当前现实。

您可以指定以下标志来自定义行为：

```console
--release
    使用 ./target/release/deno 二进制文件，而不是 ./target/debug/deno

--quiet
    禁用打印 `ok` 测试用例。

--json=<file>
    将测试结果作为 JSON 输出到指定的文件中。
```

您还可以通过在 `--` 后指定一个或多个过滤器来精确指定要运行的测试：

```console
./tools/wpt.ts update -- hr-time streams/piping/general
```

## 常见问题解答

### 升级 wpt 子模块：

```shell
cd test_util/wpt/
git fetch origin
git checkout origin/epochs/daily
cd ../../
git add ./test_util/wpt
```

在此之后，所有贡献者都需要重新运行 `./tools/wpt.ts setup`。

由于升级 WPT 通常需要更新预期以涵盖所有类型的上游更改，最好将其作为单独的 PR 进行，而不是作为实现修复或功能的 PR 的一部分。