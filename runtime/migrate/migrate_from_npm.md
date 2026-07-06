---
title: "从 npm 迁移"
description: "如何将 npm 项目迁移到 Deno：从现有的 package.json 安装依赖，保留已固定版本，将 npm CLI 命令映射到 Deno，保持工作区不变地运行，并处理生命周期脚本。"
last_modified: 2026-06-25
oldUrl:
  - /runtime/migrate/switch_package_manager/
---

npm 是包管理器，不是运行时，因此你“迁移”的大部分内容是配置，而不是代码。Deno 与 `package.json` 完全兼容：它会读取你现有的清单，安装并解析相同的 npm 依赖，并运行你的脚本。在大多数情况下，你只需让 Deno 指向一个现有的 npm 项目，它就能正常工作。

你不必一开始就切换运行时。最小的一步是将 Deno 纯粹用作你仍在使用 Node 运行的应用的更快、更安全的包管理器：`deno install` 会读取你的 `package.json`，解析相同的包，并写入一个普通的 `node_modules` 目录，因此应用会像以前一样继续在 Node 下运行。从那里开始，你可以使用 `deno task` 运行你的 `package.json` 脚本，并在准备好时切换运行时。这也是可逆的：如果效果不理想，删除 `deno.lock` 并再次运行 `npm install` 即可。

## 运行你的项目

安装依赖并运行你的入口文件：

```sh
cd my-npm-app
deno install
deno run main.js
```

`deno install` 会读取你现有的 `package.json` 并解析相同的 npm
包，类似于 `npm install`。它会写入一个 `node_modules` 目录以及它自己的
[`deno.lock`](/runtime/packages/#lockfile-and-reproducible-installs)。

在你第一次执行 `deno install` 时，如果还没有 `deno.lock`，Deno 会从你现有的 `package-lock.json` 生成它：你已经固定好的精确版本和完整性哈希会被沿用，所以在迁移过程中不会突然出现一轮升级。之后，Deno 会维护 `deno.lock`，并保持
`package-lock.json` 不变，因此那些还没有切换的队友不会受到影响。等你满意之后，就提交 `deno.lock`。

`package.json` 中定义的脚本会通过
[`deno task`](/runtime/reference/cli/task/) 运行，它相当于 `npm run`：

```sh
deno task start
```

如果你还将应用从在 Node 上运行切换为在 Deno 上运行，预计会有一个立刻的不同：**Deno 默认是沙箱化的**。程序第一次访问网络、文件系统或环境变量时，Deno 会请求权限。你可以一开始就用 `deno run -A main.js` 授予全部权限，以匹配 Node 的行为，然后再在之后收紧这些标志。请参阅
[安全性和权限](/runtime/fundamentals/security/)。

## npm 到 Deno 速查表

<div class="cheatsheet">

### 依赖

| npm                    | Deno                |
| ---------------------- | ------------------- |
| `npm install`          | `deno install`      |
| `npm install <pkg>`    | `deno add <pkg>`    |
| `npm install -D <pkg>` | `deno add -D <pkg>` |
| `npm uninstall <pkg>`  | `deno remove <pkg>` |
| `npm update`           | `deno update`       |
| `npm outdated`         | `deno outdated`     |
| `npm ci`               | `deno ci`           |
| `npm audit`            | `deno audit`        |
| `npm explain <pkg>`    | `deno why <pkg>`    |

### 运行和执行

| npm                | Deno                 |
| ------------------ | -------------------- |
| `node file.js`     | `deno file.js`       |
| `npm run <script>` | `deno task <script>` |
| `npx <pkg>`        | `dx <pkg>`           |

</div>

Deno 还内置了格式化工具和代码检查器，因此
[`deno fmt`](/runtime/reference/cli/fmt/) 和
[`deno lint`](/runtime/reference/cli/lint/) 可以在无需额外依赖的情况下替代 Prettier 和 ESLint。

## 工作区

npm 将工作区 glob 模式存储在 `package.json` 的 `workspaces` 下，Deno 会直接读取
该字段。像这样的 monorepo 可以直接按原样运行：

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

各成员在其 `package.json` 依赖中通过
[`workspace:` 协议](/runtime/fundamentals/workspaces/#using-workspace-protocol-in-package-json)
相互引用，这一点与它们在 npm 下的做法完全相同。没有任何内容需要转换。有关
解析工作方式，请参见 [工作区](/runtime/fundamentals/workspaces/)。

## 需要注意的事项

- **生命周期脚本默认不运行。** 如果某个依赖需要 `install` 或 `postinstall` 脚本（原生 addon、`node-gyp` 构建），可以通过 `deno install --allow-scripts=npm:<pkg>` 按包允许它运行，或者使用 [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) 来管理审批。这是出于安全考虑的默认设置，不是缺失的功能。
- **`overrides`。** 通过 [import map](/runtime/fundamentals/configuration/) 条目来固定传递依赖，而不是使用 `package.json` 中的 `overrides` 字段。
- **node_modules 布局。** 默认情况下，Deno 使用类似于 pnpm 的隔离布局：真实文件位于 `node_modules/.deno/` 中，包通过符号链接暴露出来。期望 npm 扁平、提升式布局的工具可以在 `deno.json` 中通过 `"nodeModulesDir": "manual"` 和 `"nodeModulesLinker": "hoisted"` 选择这种布局。参见 [node_modules 目录参考](/runtime/reference/deno_json/#node-modules-directory)。

## 继续学习

- **[从 Node.js 迁移](/runtime/migrate/)。** 如果你也在迁移运行时，这里涵盖了 CommonJS 和 ES 模块解析，以及 Deno 支持的 Node 内置模块。
- **[从 pnpm 迁移](/runtime/migrate/migrate_from_pnpm/)** 和 **[从 Yarn 迁移](/runtime/migrate/migrate_from_yarn/)。** 相同的 Deno 命令，并附有各工具工作区格式的说明。
- **[依赖管理](/runtime/packages/)。** 详细介绍 npm、JSR 和 `package.json` 工作流。
- **[供应链管理](/runtime/packages/supply_chain/)。** `deno audit`、锁文件规范，以及最低依赖年龄。
