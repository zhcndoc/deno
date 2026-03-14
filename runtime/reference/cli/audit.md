---
title: "deno 审计"
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
