---
title: "从 pnpm 迁移"
description: "如何将 pnpm 项目迁移到 Deno：从现有的 package.json 安装依赖，保留你固定的版本，将 pnpm CLI 命令映射到 Deno，并让 Deno 自动迁移 pnpm-workspace.yaml 工作区和 catalog。"
last_modified: 2026-06-25
---

pnpm 是一个包管理器，不是运行时，因此你“迁移”的大部分内容是
配置而不是代码。Deno 会读取你现有的 `package.json`，
安装相同的 npm 依赖，并运行你的脚本，因此单包
pnpm 项目通常完全不需要任何更改。

pnpm 与 npm、Yarn 和 Bun 的不同之处在于它存储工作区
配置的位置。npm、Yarn 和 Bun 将它们的工作区 glob 保存在 `package.json`
中的 `workspaces` 下，Deno 会直接读取该配置。pnpm 则将它们保存在单独的
`pnpm-workspace.yaml` 文件中。Deno 在解析期间不会读取该文件，但
它会在首次需要时自动为你迁移它，如下所述。

## 运行你的项目

安装依赖并运行你的入口文件：

```sh
cd my-pnpm-app
deno install
deno run main.ts
```

`deno install` 会读取你现有的 `package.json`，并解析相同的 npm
包，就像 `pnpm install` 一样。它会写入一个 `node_modules` 目录，以及它自己的
[`deno.lock`](/runtime/packages/#lockfile-and-reproducible-installs)。

在你第一次执行 `deno install` 时，如果还没有 `deno.lock`，Deno 会根据你现有的
`pnpm-lock.yaml` 来生成它：你已经固定的版本和完整性哈希会被沿用，因此在这个过程中不会突然发生一轮升级。`node_modules` 的布局也会让你感到熟悉：和 pnpm 一样，Deno 使用隔离式布局，每个包只能看到它声明的依赖。

在 `package.json` 中定义的脚本会通过
[`deno task`](/runtime/reference/cli/task/) 运行，它相当于 `pnpm run`：

```sh
deno task dev
```

如果你还把应用从 Node 切换到 Deno 运行，那么会立刻遇到一个差异：**Deno 默认处于沙箱中**。你的程序第一次访问网络、文件系统或环境变量时，Deno 会请求权限。你可以一开始就用 `deno run -A main.ts` 一次性授予全部权限，以匹配 Node 的行为，然后再在之后收紧这些标志。参见
[安全与权限](/runtime/fundamentals/security/)。

## pnpm 到 Deno 对照速查表

<div class="cheatsheet">

### 依赖

| pnpm                             | Deno                |
| -------------------------------- | ------------------- |
| `pnpm install`                   | `deno install`      |
| `pnpm add <pkg>`                 | `deno add <pkg>`    |
| `pnpm add -D <pkg>`              | `deno add -D <pkg>` |
| `pnpm remove <pkg>`              | `deno remove <pkg>` |
| `pnpm update`                    | `deno update`       |
| `pnpm outdated`                  | `deno outdated`     |
| `pnpm install --frozen-lockfile` | `deno ci`           |
| `pnpm audit`                     | `deno audit`        |
| `pnpm why <pkg>`                 | `deno why <pkg>`    |

### 运行与执行

| pnpm                | Deno                 |
| ------------------- | -------------------- |
| `pnpm <script>`     | `deno task <script>` |
| `pnpm run <script>` | `deno task <script>` |
| `pnpm dlx <pkg>`    | `dx <pkg>`           |
| `pnpm exec <cmd>`   | `deno task <cmd>`    |

</div>

与 pnpm 不同，Deno 还内置了格式化工具和代码检查工具，因此
[`deno fmt`](/runtime/reference/cli/fmt/) 和
[`deno lint`](/runtime/reference/cli/lint/) 可替代 Prettier、ESLint 或 Biome，
且无需额外依赖。

## 工作区和 pnpm-workspace.yaml

npm、Yarn 和 Bun 将它们的工作区 glob 存储在 `package.json` 中，但 pnpm 将它们保存在单独的 `pnpm-workspace.yaml` 中，而 Deno 在解析期间不会读取这个文件。你不需要手动转换这个文件：第一次由于它导致某个工作区成员或 catalog 版本无法解析时，Deno 会找到附近的 `pnpm-workspace.yaml`，将其中的 `packages`、`catalog` 和 `catalogs` 转换为等效的 Deno 配置字段，并打印一条提示：

```console
warning: 发现附近有 pnpm-workspace.yaml，但 Deno 不会直接读取它。
hint: 已将其工作区配置迁移到 package.json。请再次运行该命令。
```

再次运行同样的命令即可正常解析。迁移之后，你的工作区 globs 会存放在 `workspace` 数组中，它相当于 pnpm 的 `packages` 列表：

```yaml title="pnpm-workspace.yaml (before)"
packages:
  - "packages/*"
  - "apps/*"
```

```json title="deno.json (after)"
{
  "workspace": ["packages/*", "apps/*"]
}
```

在阅读迁移后的 globs 时，有几点差异值得了解：

- **在 Deno 中，深度是显式的。** `packages/*` 匹配一层
  （`packages/foo`），而 `packages/*/*` 匹配两层。这里没有 `**`
  这种递归 glob；每增加一层，就添加一个 `/*` 段。请参见
  [工作区路径模式](/runtime/fundamentals/workspaces/#workspace-path-patterns)。
- **不支持排除项。** pnpm 的 `!packages/excluded` 否定写法在 `workspace` 字段中没有
  对应项，所以请显式列出你想要的成员，而不是从通配符中排除少数几个。

### Catalogs

pnpm [catalogs](https://pnpm.io/catalogs) 在各成员之间共享依赖版本，而 Deno 也支持相同的 `catalog:` 协议（在 Deno 2.8 中添加）。自动迁移会为你把 catalog 定义移动到根目录的 `deno.json` 中，并使用相同的字段名：

```json title="deno.json"
{
  "workspace": ["packages/*"],
  "catalog": {
    "react": "^19.0.0"
  },
  "catalogs": {
    "react18": {
      "react": "^18.3.0"
    }
  }
}
```

每个成员的 `package.json` 中的 `catalog:` 引用会保持完全不变：`"react": "catalog:"` 会解析到默认的 `catalog`，而 `"react": "catalog:react18"` 会解析到 `catalogs` 中命名的条目。请参见
[使用 `catalog:` 集中管理依赖版本](/runtime/fundamentals/workspaces/#centralized-dependency-versions-with-catalog)。

## 什么没有直接对应项

`pnpm-workspace.yaml` 中有一些设置是 pnpm 特有的，在 Deno 中没有对应项。应当围绕它们进行规划，而不是直接翻译：

- **`overrides`。** 通过项目已经使用的 `npm:` 解析方式，或使用一个 [导入映射](/runtime/fundamentals/configuration/) 条目，强制某个传递依赖使用特定版本。
- **`patchedDependencies`。** Deno 没有内置的 patch-package 机制。可以将该依赖进行 vendoring，或者在你自己的 fork 中维护补丁。
- **`registries`、`packageExtensions` 以及类似的调优项。** 这些是专门用于配置 pnpm 的解析器，不会被迁移过来。

## 继续阅读

- **[从 npm 迁移](/runtime/migrate/migrate_from_npm/)。** npm 和 pnpm 的 CLI 工作流映射到相同的 Deno 命令。
- **[从 Node.js 迁移](/runtime/migrate/)。** 如果你也在迁移运行时，这里涵盖了 CommonJS 和 ES 模块解析，以及 Deno 支持的 Node 内置模块。
- **[工作区](/runtime/fundamentals/workspaces/)。** 详细了解 Deno 如何解析成员、共享导入和目录。
- **[依赖管理](/runtime/packages/)。** npm、JSR 和 `package.json` 工作流。
- **[供应链管理](/runtime/packages/supply_chain/)。** `deno audit`、锁文件规范以及最小依赖年龄。
