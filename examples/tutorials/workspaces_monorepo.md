---
last_modified: 2026-06-11
title: "使用 workspaces 配置 monorepo"
description: "使用多个包搭建一个 Deno workspace：成员名称与导出、glob 模式、仅根目录选项、共享导入，以及通过 catalogs 集中管理依赖版本。"
url: /examples/workspaces_monorepo_tutorial/
---

workspace 是一个文件夹集合，每个文件夹都有自己的 `deno.json` 或
`package.json`，由单一根目录统一管理。成员可以通过名称相互导入，
共享依赖，并一次性在整个仓库中运行 `deno test` 和 `deno fmt` 等工具。

## 创建 workspace

根目录的 `deno.json` 列出成员目录：

```json title="deno.json"
{
  "workspace": ["./utils", "./app"]
}
```

每个成员都有自己的 `deno.json`，包含 `name`、`version` 和
`exports` 字段，指向其入口点；如果成员是 npm 风格的包，则使用
`package.json`：

```json title="utils/deno.json"
{
  "name": "@acme/utils",
  "version": "0.1.0",
  "exports": "./mod.ts"
}
```

```ts title="utils/mod.ts"
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```json title="app/deno.json"
{
  "name": "@acme/app",
  "version": "0.1.0",
  "exports": "./main.ts"
}
```

其他成员通过裸名称导入 `@acme/utils`：不需要相对路径，也不需要
import map 条目。Deno 通过根目录的 `workspace` 列表找到该成员，
并通过其 `exports` 解析导入：

```ts title="app/main.ts"
import { greet } from "@acme/utils";

console.log(greet("workspace"));
```

```sh
$ deno run app/main.ts
Hello, workspace!
```

## 使用 glob 匹配成员

在较大的仓库中，逐个列出每个成员会变得繁琐。每个 `/*` 段匹配
一个文件夹层级：`packages/*` 匹配 `packages/foo`，但不匹配
`packages/foo/subpackage`。

```json title="deno.json"
{
  "workspace": ["packages/*", "examples/*/*"]
}
```

## 必须放在根目录的选项

有些选项控制整个 workspace 的解析行为，只会从根目录的
`deno.json` 读取：`nodeModulesDir`、`vendor`、`minimumDependencyAge`、
`links`、`lock` 和 `allowScripts`。把它们设置在成员中不会生效，
Deno 还会对此发出警告。

:::note

`name`、`version` 和 `exports` 则相反：它们属于成员，而不是根目录。

:::

## 从根目录共享依赖

成员会继承根目录的 `imports` 映射，因此常用依赖可以统一声明一次：

```json title="deno.json"
{
  "workspace": ["./utils", "./app"],
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0"
  }
}
```

成员也可以声明自己的 `imports`；在该成员的目录内，其条目会覆盖
根目录的条目。

## 使用已有的 npm、yarn 和 pnpm workspace

Deno 直接理解 `package.json` 中的 `workspaces` 字段，因此为 npm 或
yarn 设置的 monorepo 无需转换：

```json title="package.json"
{
  "workspaces": ["pkg-a", "pkg-b"]
}
```

成员在各自的 `dependencies` 中声明彼此，并通过名称导入，就像在 npm
下那样：

```json title="pkg-b/package.json"
{
  "name": "@acme/b",
  "dependencies": { "@acme/a": "*" }
}
```

```sh
$ deno install
$ deno run pkg-b/main.ts
from workspace member
```

:::note

pnpm workspace 是个例外：Deno 不读取 `pnpm-workspace.yaml`，因此请将
其中的包列表移动到根目录 `deno.json` 的 `workspace` 字段中（或者
`package.json` 中的 `workspaces` 字段）。

:::

## 使用 `catalog:` 集中管理版本

自 Deno 2.8 起，根目录可以声明一个版本要求的 `catalog`，成员可以在
其 `package.json` 的依赖中通过 `catalog:` 指定符引用它：

```json title="deno.json"
{
  "workspace": ["./utils", "./app"],
  "catalog": {
    "chalk": "^5.3.0"
  }
}
```

```json title="app/package.json"
{
  "name": "app",
  "dependencies": {
    "chalk": "catalog:"
  }
}
```

要将所有成员升级到新版本，只需修改一次 catalog 条目。

有关完整的选项矩阵、发布 workspace 包，以及 `package.json` 中的
`workspace:` 协议支持，请参阅
[Workspaces and monorepos](/runtime/fundamentals/workspaces/)。
