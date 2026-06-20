---
last_modified: 2026-06-12
title: "添加和移除依赖"
description: "使用 deno add 和 deno remove 管理项目依赖：npm 和 JSR 包、版本固定、开发依赖，以及在 import map 中为包设置别名。"
url: /examples/add_remove_dependencies_tutorial/
---

Deno 通过项目的 `deno.json` import map，或者在你有 `package.json` 时通过它来管理依赖。`deno add` 和 `deno remove` 命令会替你编辑这些文件，而带包参数的 `deno install` 也会执行同样的操作。

## 添加包

未带前缀的包名会被视为 npm 包。对 JSR 包请使用 `jsr:` 前缀：

```sh
$ deno add express jsr:@std/path
Add npm:express@5.2.1
Add jsr:@std/path@1.1.5
```

`deno install express` 是等价的：它会以相同方式记录依赖，并在一步中完成全部安装。

这两者最终都会进入 `deno.json` 的 `imports` 映射，使用与 semver 兼容的 caret 范围：

```json title="deno.json"
{
  "imports": {
    "@std/path": "jsr:@std/path@^1.1.5",
    "express": "npm:express@^5.2.1"
  }
}
```

在项目中的任何地方，都可以通过它们的裸名称导入：

```ts
import express from "express";
import { join } from "@std/path";
```

如果要固定为精确版本而不是 caret 范围，请传入 `--save-exact`。如果要指定特定版本或标签，请直接写出来：

```sh
deno add --save-exact npm:express@4.21.2
deno add npm:typescript@next
```

## 依赖写入的位置

如果项目包含 `package.json`，npm 包会被添加到其中的 `dependencies`，而不是 `deno.json`，这在与 Node.js 工具链共享的项目中很方便。你可以使用 `--package-json` 强制这样做。

开发依赖只存在于 `package.json` 体系中：

```sh
deno add --dev npm:typescript
```

:::note

如果没有 `package.json`，`--dev` 标志不会生效：`deno.json` 只有一个 `imports` 映射，因此该包会作为普通导入被添加。

:::

## 为包设置别名

import map 可以将任意名称映射到任意 specifier。这会以原始名称安装一个 fork，因此现有导入可以继续工作：

```json title="deno.json"
{
  "imports": {
    "lodash": "npm:lodash-es@^4.17.21"
  }
}
```

别名也是让同一个包的两个版本并排使用的方式：

```json title="deno.json"
{
  "imports": {
    "preact": "npm:preact@^10.27.2",
    "preact-canary": "npm:preact@11.0.0-experimental.4"
  }
}
```

## 覆盖传递依赖

import map 只命名你的直接依赖。要强制依赖树中更深层某处的某个包使用特定版本，请使用 `package.json` 中的 `overrides` 字段，方式与 npm 相同：

```json title="package.json"
{
  "dependencies": {
    "debug": "4.4.3"
  },
  "overrides": {
    "ms": "2.1.2"
  }
}
```

`deno install` 会将 `ms` 在出现的所有位置解析为 2.1.2，并将其记录在锁文件中。若要使用包的本地副本进行覆盖，或重新映射你自己的导入而不是依赖树，请参见
[覆盖依赖](/runtime/packages/#overriding-dependencies) 和
[重新映射导入路径](/examples/import_maps_tutorial/)。

## 移除包

`deno remove` 会按其 import-map 名称删除条目（如果包名不同，则不是包名）：

```sh
$ deno remove express
Removed express
```

在你再次运行 `deno install` 之前，锁文件会保留已移除包的记录；关于 `deno.lock` 如何跟踪这些内容，请参见
[锁文件文档](/runtime/packages/#lockfile-and-reproducible-installs)。
