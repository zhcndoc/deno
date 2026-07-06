---
title: "从 Yarn 迁移"
description: "如何将 Yarn 项目迁移到 Deno：从现有的 package.json 安装依赖，保留固定版本，将 Yarn CLI 命令映射到 Deno，原样运行工作区，以及如何处理 Plug'n'Play。"
last_modified: 2026-06-25
---

Yarn 是一个包管理器，不是运行时，因此你“迁移”的大部分内容是
配置，而不是代码。Yarn Classic 和 Yarn Berry 都使用标准的 `package.json`
来描述项目，而 Deno 会直接读取它：它会安装并解析相同的 npm 依赖，并运行你的脚本。一个典型的
Yarn 项目在 Deno 下通常无需任何改动即可运行。

唯一需要做出决定的 Yarn 功能是 Plug'n'Play，也就是 Yarn Berry 的默认
安装模式。Deno 不使用 PnP；它会安装一个真实的 `node_modules`
目录。下面会对此进行说明。

## 运行你的项目

安装依赖并运行你的入口文件：

```sh
cd my-yarn-app
deno install
deno run main.js
```

`deno install` 会读取你现有的 `package.json` 并解析相同的 npm
包，就像 `yarn install` 一样。它会写入一个 `node_modules` 目录以及它自己的
[`deno.lock`](/runtime/packages/#lockfile-and-reproducible-installs)。

在你第一次执行 `deno install` 时，如果还没有 `deno.lock`，Deno 会从 Yarn Classic (v1) 的 `yarn.lock` 进行初始化，沿用你已经锁定的版本和完整性
哈希。Yarn Berry (v2+) 使用不同的锁文件格式，Deno 不会从中初始化；在这种情况下，Deno 会重新解析你的 `package.json`
范围，因此在提交之前请先检查 `deno.lock`。

`package.json` 中定义的脚本会使用
[`deno task`](/runtime/reference/cli/task/) 运行，它相当于 `yarn run`：

```sh
deno task start
```

如果你还把应用从 Node 切换到 Deno 运行，那么要预期
一个立刻可见的差异：**Deno 默认是沙箱化的**。程序第一次访问
网络、文件系统或环境变量时，Deno 会提示请求权限。
你可以先使用 `deno run -A main.js` 一次性授予全部权限，以匹配 Node 的
行为，然后再在之后收紧这些标志。参见
[安全性与权限](/runtime/fundamentals/security/)。

## Yarn 到 Deno 对照速查表

<div class="cheatsheet">

### 依赖

| Yarn                       | Deno                |
| -------------------------- | ------------------- |
| `yarn install`             | `deno install`      |
| `yarn add <pkg>`           | `deno add <pkg>`    |
| `yarn add -D <pkg>`        | `deno add -D <pkg>` |
| `yarn remove <pkg>`        | `deno remove <pkg>` |
| `yarn up <pkg>`            | `deno update`       |
| `yarn outdated`            | `deno outdated`     |
| `yarn install --immutable` | `deno ci`           |
| `yarn npm audit`           | `deno audit`        |
| `yarn why <pkg>`           | `deno why <pkg>`    |

### 运行与执行

| Yarn                | Deno                 |
| ------------------- | -------------------- |
| `node file.js`      | `deno file.js`       |
| `yarn <script>`     | `deno task <script>` |
| `yarn run <script>` | `deno task <script>` |
| `yarn dlx <pkg>`    | `dx <pkg>`           |

</div>

Deno 还内置了格式化工具和代码检查器，因此
[`deno fmt`](/runtime/reference/cli/fmt/) 和
[`deno lint`](/runtime/reference/cli/lint/) 可以在无需额外依赖的情况下替代 Prettier 和 ESLint。

## 工作区

Yarn 会将工作区的 glob 模式存储在 `package.json` 的 `workspaces` 下，而 Deno 会直接读取该字段。像这样的 monorepo 可以直接按原样运行：

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

各成员通过其 `package.json` 依赖中的 [`workspace:` 协议](/runtime/fundamentals/workspaces/#using-workspace-protocol-in-package-json) 相互引用，和在 Yarn 下的方式完全一样。无需进行任何转换。有关解析机制的工作原理，请参见 [Workspaces](/runtime/fundamentals/workspaces/)。

## Plug'n'Play

Yarn Berry 默认使用 Plug'n'Play，它会跳过 `node_modules`，并通过生成的 `.pnp.cjs` 文件来解析包。Deno 不支持 PnP。当你运行 `deno install` 时，它会改为写入一个普通的 `node_modules` 目录，因此在 Deno 下你完全不需要 PnP。

实际上，这意味着一旦你迁移到 Deno，PnP 相关的文件和设置就不再适用：

- `.pnp.cjs` 和 `.pnp.loader.mjs` 不再使用。Deno 从 `node_modules` 进行解析。
- `.yarnrc.yml` 中的解析器设置（`nodeLinker`、`pnpMode`、plugins）是专门为 Yarn 配置的，不会沿用到 Deno。
- `yarn patch` 没有内置的 Deno 对应功能。你可以将依赖 vendoring，或者把补丁保留在 fork 中。

## 需要注意的事项

- **生命周期脚本默认不会运行。** 如果某个依赖需要依赖
  `install` 或 `postinstall` 脚本（原生插件、`node-gyp` 构建），请使用 `deno install --allow-scripts=npm:<pkg>` 为该包单独授权，或者通过 [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) 管理审批。
  这是出于安全考虑的默认行为，不是缺少功能。

## 继续

- **[从 Node.js 迁移](/runtime/migrate/)。** 如果你也在迁移
  运行时，这里涵盖了 CommonJS 和 ES 模块解析，以及 Deno 支持的 Node 内置模块。
- **[从 npm 迁移](/runtime/migrate/migrate_from_npm/)** 和
  **[从 pnpm 迁移](/runtime/migrate/migrate_from_pnpm/)。** 相同的 Deno
  命令，并附带每种工具工作区格式的说明。
- **[依赖管理](/runtime/packages/)。** 详细介绍 npm、JSR 和 `package.json`
  工作流。
- **[供应链管理](/runtime/packages/supply_chain/)。** `deno audit`、
  锁文件规范，以及最小依赖年龄。
