---
last_modified: 2026-05-20
title: "deno add"
command: add
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno add"
description: "使用 Deno 添加和管理项目依赖"
---

`deno add` 命令会将依赖项添加到项目的配置文件中。
它是
[`deno install [PACKAGES]`](/runtime/reference/cli/install/#deno-install-packages) 的别名。
有关 Deno 如何处理依赖项的更多信息，请参阅
[模块和依赖项](/runtime/fundamentals/modules/)。

## 示例

从 JSR 和 npm 添加包：

```sh
deno add npm:express hono zod
deno add jsr:@std/path
```

:::info Deno 2.8

未添加前缀的包名默认会被视为 npm 包，因此在 CLI 中不再需要 `npm:`
前缀。`deno add express` 等同于
`deno add npm:express`。JSR 包仍然需要 `jsr:` 前缀以保持含义明确。`npm:` 前缀在 `import` 规范符中仍然是必需的。

:::

默认情况下，依赖项会使用插入符号（`^`）版本范围添加。使用
`--save-exact` 可以将其固定到确切版本：

```sh
deno add --save-exact @std/path
```

这会保存没有 `^` 前缀的依赖项（例如，`1.0.0` 而不是 `^1.0.0`）。

## 依赖项存储在哪里

如果你的项目有 `package.json`，npm 包会被添加到
`package.json` 中的 `dependencies`。否则，所有包都会添加到
[`deno.json`](/runtime/fundamentals/configuration/) 中的 `imports` 字段。

要强制将每个依赖项都写入 `package.json`（如有需要会创建一个），请传递
`--package-json`（Deno 2.8+）：

```sh
deno add --package-json npm:express jsr:@std/path
```

使用 `--package-json` 添加的 JSR 包会以其与 npm 兼容的形式写入
（`npm:@jsr/...`）。同样的标志也适用于
[`deno install`](/runtime/reference/cli/install/)，
[`deno remove`](/runtime/reference/cli/remove/)，以及
[`deno uninstall`](/runtime/reference/cli/uninstall/)。
