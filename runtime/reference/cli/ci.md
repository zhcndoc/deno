---
last_modified: 2026-05-20
title: "deno ci"
command: ci
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno ci"
description: "面向 CI 环境的可复现安装"
---

`deno ci` 为 CI 环境执行可复现安装，行为类似于
`npm ci`。当你需要一个单一、可搜索的命令，并且能保证只安装 lockfile 记录的内容时，请在 CI 脚本和 Dockerfile 中使用它——没有漂移，没有残留状态，没有意外。

```sh
deno ci
```

## 它的作用

`deno ci` 大致等同于：

```sh
rm -rf node_modules
deno install --frozen
```

但具有更严格的错误处理和更清晰的失败模式：

1. **需要 lockfile。** 如果 `deno.lock` 缺失或无法读取，`deno ci`
   会报错，而不是生成一个新的。这可确保同一提交的两次运行安装的是相同版本。
2. **先清空 `node_modules`。** 在安装之前，会移除前一次 CI 步骤遗留的任何状态（或开发环境中泄漏的安装结果），因此最终目录树只反映 lockfile 解析出的内容。
3. **使用 `--frozen` 锁定解析结果。** 如果 `deno.json` 或 `package.json` 已被修改，但没有重新运行 `deno install` 来刷新 lockfile，命令就会失败。这能在“我升级了版本但忘记提交 lockfile”这类错误到达生产环境之前捕获它们。

如果这些检查中的任何一个失败，安装都不会继续。

## 何时使用

| 场景                                   | 使用                         |
| -------------------------------------- | ---------------------------- |
| CI 构建 / 测试 / lint 流水线           | `deno ci`                    |
| 生产 Docker 镜像                       | `deno ci --prod`             |
| 本地开发（频繁修改）                   | `deno install`               |
| 添加或移除包                           | `deno add` / `deno remove`   |
| 首次引导（尚无 lockfile）               | `deno install`               |

经验法则：只要安装必须可复现，并且不期望 lockfile 发生变化，就选择 `deno ci`。只要你在依赖上进行迭代，就选择 `deno install`。

## 示例

### GitHub Actions

```yaml title=".github/workflows/test.yml"
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno ci
      - run: deno test
      - run: deno lint
      - run: deno fmt --check
```

### 生产用 Dockerfile

```dockerfile
FROM denoland/deno:2.8.0
WORKDIR /app

# 先复制清单文件，这样安装缓存效果更好
COPY deno.json deno.lock package.json* ./
RUN deno ci --prod

# 然后复制其余源码
COPY . .
CMD ["deno", "run", "-A", "main.ts"]
```

将 `COPY` 拆分为“先清单，后源码”，可以让 Docker 在依赖未变化时复用
`deno ci` 层。

### 主机上的生产安装

```sh
deno ci --prod --skip-types
```

`--prod` 会跳过 `package.json` 中的 `devDependencies`。`--skip-types` 会从
`deno.json` 的 imports 和 `package.json`
依赖中移除 `@types/*` 包——这在部署产物中很有用，因为类型文件会增加体积，而运行时并不需要它们。

## 常见失败模式

| 错误                                        | 可能原因                                                                                         | 修复方法                                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| "deno.lock is missing"                      | 没有提交 lockfile。                                                                              | 在本地运行 `deno install` 并提交生成的 `deno.lock`。                                                                  |
| "lockfile is out of date"                   | 在 `deno.json` / `package.json` 中添加或升级了依赖，但没有刷新 lockfile。                         | 在本地运行 `deno install` 并提交更新后的 `deno.lock`。                                                                |
| 非 TTY CI 中出现构建脚本审批提示            | 某个新的 npm 包想要运行尚未获准的生命周期脚本。                                                  | 使用 [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) 在本地批准它们，并提交这些批准记录。 |

## 另请参阅

- [`deno install`](/runtime/reference/cli/install/) — 日常安装，附完整标志参考
- [持续集成](/runtime/reference/continuous_integration/) — 在 GitHub Actions 和其他 CI 提供商中运行 Deno 的指南
- [`deno audit`](/runtime/reference/cli/audit/) — 扫描依赖中的已知漏洞，在 CI 中与 `deno ci` 互补
- [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) — 管理允许运行的 npm 生命周期脚本
