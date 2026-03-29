---
title: "deno outdated"
command: outdated
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno outdated"
description: "检查项目中的过期依赖，并通过交互式 CLI 安全地更新它们"
---

## 检查过期依赖

`outdated` 子命令会检查 [`deno.json`](/runtime/fundamentals/configuration/) 或 `package.json`
文件中列出的 NPM 和 JSR 依赖是否有新版本，并显示可以更新的依赖。
工作区也完全受支持，包括部分成员使用 `package.json`、其他成员使用 `deno.json` 的工作区。

例如，考虑一个包含 `deno.json` 文件的项目：

```json title="deno.json"
{
  "imports": {
    "@std/fmt": "jsr:@std/fmt@^1.0.0",
    "@std/async": "jsr:@std/async@1.0.1",
    "chalk": "npm:chalk@4"
  }
}
```

以及一个将 `@std/fmt` 锁定为 `1.0.0` 的锁定文件。

```sh
deno outdated
┌────────────────┬─────────┬────────┬────────┐
│ 包名称          │ 当前版本  │ 更新版本  │ 最新版本  │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/fmt   │ 1.0.0   │ 1.0.3  │ 1.0.3  │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/async │ 1.0.1   │ 1.0.1  │ 1.0.8  │
├────────────────┼─────────┼────────┼────────┤
│ npm:chalk      │ 4.1.2   │ 4.1.2  │ 5.3.0  │
└────────────────┴─────────┴────────┴────────┘
```

`更新版本` 列显示最新的 semver 兼容版本，而 `最新版本` 列显示最新版本。

注意，尽管没有可以更新到的 semver 兼容版本，`jsr:@std/async` 仍然被列出。如果您希望仅显示具有新兼容版本的包，可以传递 `--compatible` 标志。

```sh
deno outdated --compatible
┌────────────────┬─────────┬────────┬────────┐
│ 包名称          │ 当前版本  │ 更新版本  │ 最新版本  │
├────────────────┼─────────┼────────┼────────┤
│ jsr:@std/fmt   │ 1.0.0   │ 1.0.3  │ 1.0.3  │
└────────────────┴─────────┴────────┴────────┘
```

`jsr:@std/fmt` 仍然被列出，因为它可以安全地更新到 `1.0.3`，但 `jsr:@std/async` 不再显示。

## 更新依赖

`outdated` 子命令还可以通过 `--update` 标志更新依赖。
默认情况下，它只会将依赖更新到 semver 兼容版本（即不会更新到不兼容的版本）。

```sh
deno outdated --update
Updated 1 dependency:
 - jsr:@std/fmt 1.0.0 -> 1.0.3
```

要更新到最新版本（无论是否兼容 semver），请传递 `--latest` 标志。

```sh
deno outdated --update --latest
Updated 3 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.8
 - jsr:@std/fmt   1.0.0 -> 1.0.3
 - npm:chalk      4.1.2 -> 5.3.0
```

## 选择包

`outdated` 子命令也支持选择要操作的包。
这在使用或不使用 `--update` 标志时都适用。

```sh
deno outdated --update --latest chalk
Updated 1 dependency:
 - npm:chalk 4.1.2 -> 5.3.0
```

可以传递多个选择器，并且也支持通配符（`*`）或排除（`!`）。

例如，要更新所有具有 `@std` 范围的包，除了 `@std/fmt`：

```sh
deno outdated --update --latest "@std/*" "!@std/fmt"
Updated 1 dependency:
 - jsr:@std/async 1.0.1 -> 1.0.8
```

请注意，如果您使用通配符，您可能需要用引号将参数包围，以防止 shell 尝试展开它们。

### 更新到特定版本

您还可以通过在 `@` 后附加版本号来选择要更新到的特定版本。

```sh
deno outdated --update chalk@5.2 @std/async@1.0.6
Updated 2 dependencies:
 - jsr:@std/async 1.0.1 -> 1.0.6
 - npm:chalk      4.1.2 -> 5.2.0
```

## 工作区

在工作区设置中，默认情况下，`outdated` 只会在 _当前_ 工作区成员上操作。

例如，给定一个工作区：

```json title="deno.json"
{
  "workspace": ["./member-a", "./member-b"]
}
```

从 `./member-a` 目录运行

```sh
deno outdated
```

将仅检查 `./member-a/deno.json` 或 `./member-a/package.json` 中列出的过期依赖。

要包含所有工作区成员，请传递 `--recursive` 标志（也接受简写 `-r`）。

```sh
deno outdated --recursive
deno outdated --update --latest -r
```