---
title: "deno update"
command: update
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno 更新"
description: "通过交互式 CLI 更新过时的依赖项"
---

`deno update` 会更新你的
[`deno.json`](/runtime/fundamentals/configuration/) 或 `package.json` 中的依赖项。有关依赖项管理的更多信息，请参阅
[Modules](/runtime/fundamentals/modules/)。

## 更新依赖项

默认情况下，`update` 子命令只会更新到符合 semver 兼容的版本（即不会更新到破坏性版本）。

```sh
deno update
Updated 1 dependency:
 - jsr:@std/fmt 1.0.0 -> 1.0.3
```

如果要更新到最新版本（无论是否符合 semver 兼容），请添加 `--latest` 标志。

```sh
deno update --latest
Updated 3 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.8
 - jsr:@std/fmt   1.0.0 -> 1.0.3
 - npm:chalk      4.1.2 -> 5.3.0
```

## 选择包

`update` 子命令也支持选择要操作的包。

```sh
deno update --latest chalk
Updated 1 dependency:
 - npm:chalk 4.1.2 -> 5.3.0
```

可以传入多个选择器，并且支持通配符 (`*`) 和排除 (`!`)。

例如，要更新所有带有 `@std` 作用域的包，除了 `@std/fmt`：

```sh
deno update --latest "@std/*" "!@std/fmt"
Updated 1 dependency:
 - jsr:@std/async 1.0.1 -> 1.0.8
```

注意，如果使用通配符，通常需要用引号将参数括起来，以防止 shell 尝试展开它们。

### 更新到特定版本

You can also select a specific version to update to by appending it after `@`.

```sh
deno update chalk@5.2 @std/async@1.0.6
Updated 2 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.6
 - npm:chalk      4.1.2 -> 5.2.0
```

## 工作区

在工作区环境中，默认情况下，`update` 只会操作 _当前_ 工作区成员。

例如，给定如下工作区：

```json title="deno.json"
{
  "workspace": ["./member-a", "./member-b"]
}
```

从 `./member-a` 目录运行

```sh
deno update
```

将只更新 `./member-a/deno.json` 或 `./member-a/package.json` 中列出的依赖项。

要包含所有工作区成员，请传入 `--recursive` 标志（也接受 `-r` 简写）。

```sh
deno update --recursive
deno update --latest -r
```