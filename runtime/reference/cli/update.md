---
title: "deno update"
command: update
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno 更新"
description: "通过交互式 CLI 更新过时的依赖项"
---

## 更新依赖项

默认情况下，`update` 子命令只会更新到符合 semver 兼容的版本（即不会更新到破坏性版本）。

```bash
$ deno update
更新了 1 个依赖项：
 - jsr:@std/fmt 1.0.0 -> 1.0.3
```

如果要更新到最新版本（无论是否符合 semver 兼容），请添加 `--latest` 标志。

```bash
$ deno update --latest
更新了 3 个依赖项：
 - jsr:@std/async 1.0.1 -> 1.0.8
 - jsr:@std/fmt   1.0.0 -> 1.0.3
 - npm:chalk      4.1.2 -> 5.3.0
```

## 选择包

`update` 子命令也支持选择要操作的包。

```bash
$ deno update --latest chalk
更新了 1 个依赖项：
 - npm:chalk 4.1.2 -> 5.3.0
```

可以传入多个选择器，并且支持通配符 (`*`) 和排除 (`!`)。

例如，要更新所有带有 `@std` 作用域的包，除了 `@std/fmt`：

```bash
$ deno update --latest "@std/*" "!@std/fmt"
更新了 1 个依赖项：
 - jsr:@std/async 1.0.1 -> 1.0.8
```

注意，如果使用通配符，通常需要用引号将参数括起来，以防止 shell 尝试展开它们。

### 更新到特定版本

除了选择要更新的包之外，`--update` 标志还支持选择新的 _版本_，通过在版本号前添加 `@` 指定。

```bash
❯ deno update chalk@5.2 @std/async@1.0.6
更新了 2 个依赖项：
 - jsr:@std/async 1.0.1 -> 1.0.6
 - npm:chalk      4.1.2 -> 5.2.0
```

## 工作区

在工作区环境中，默认情况下，`update` 只会操作 _当前_ 工作区成员。

例如，给定如下工作区：

```json
{
  "workspace": ["./member-a", "./member-b"]
}
```

从 `./member-a` 目录运行

```bash
deno update
```

将只更新 `./member-a/deno.json` 或 `./member-a/package.json` 中列出的依赖项。

要包含所有工作区成员，请传入 `--recursive` 标志（也接受 `-r` 简写）

```bash
deno update --recursive
deno update --latest -r
```