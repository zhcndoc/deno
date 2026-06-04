---
last_modified: 2026-05-20
title: "deno audit"
command: audit
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno audit"
description: "审计项目依赖的已知安全漏洞"
---

`deno audit` 命令检查您项目的依赖是否存在已知安全漏洞。它读取您的锁文件，并报告漏洞数据库中发现的任何安全通告。

## 示例

审计所有依赖：

```sh
deno audit
```

仅显示高危和严重级别的漏洞：

```sh
deno audit --level=high
```

针对 [socket.dev](https://socket.dev/) 漏洞数据库进行检查：

```sh
deno audit --socket
```

忽略特定的 CVE（用于抑制误报或接受的风险）：

```sh
deno audit --ignore=CVE-2024-12345,CVE-2024-67890
```

忽略没有可用修复方案的通告：

```sh
deno audit --ignore-unfixable
```

如果无法从注册表获取审计数据，不报错：

```sh
deno audit --ignore-registry-errors
```

## 自动修复漏洞

从 Deno 2.8 开始，传递 `--fix` 可自动将存在漏洞的直接依赖升级到已修补、且与 semver 兼容的版本：

```sh
deno audit --fix
```

`deno audit --fix` 会更新 `package.json` / `deno.json` 并重新生成
锁文件。为了保持更改安全，它会有意**跳过**以下情况：

- 主版本升级（会作为无法修复的问题报告出来，以便您有意进行提升）。
- 不受支持的版本说明符样式，例如 `>=1 <2`、`1.x`、dist-tags 或
  别名 —— 而不是悄悄将它们重写为 caret 范围。
- 没有清晰直接依赖升级路径的传递依赖。这些会显示为“无法自动修复”。

示例输出：

```
╭ @denotest/with-vuln1 is susceptible to prototype pollution
│ ...
Found 2 vulnerabilities
Severity: 0 low, 0 moderate, 1 high, 1 critical

Fixed 1 vulnerability:
  @denotest/with-vuln1 1.0.0 -> 1.1.0

1 vulnerability could not be fixed automatically:
  @denotest/with-vuln2 (major upgrade to 2.0.0)
```

对于典型的 CI 工作流，请在 [`deno ci`](/runtime/reference/cli/ci/) 之后运行
`deno audit`，这样安装和安全检查就会共享同一个可复现状态。
