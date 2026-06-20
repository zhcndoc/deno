---
last_modified: 2026-06-15
title: "将你的包管理器切换到 Deno"
description: "将 Deno 作为 npm、yarn 或 pnpm 的直接替代品，同时仍然使用 Node 运行应用：命令映射、安全安装，以及需要了解的差异。"
---

你不必切换运行时就能从 Deno 中获得一些好处。`deno install`
会读取你现有的 `package.json`，从同一
注册表解析相同的 npm 包，并写入一个普通的 `node_modules` 目录。你的应用仍然使用 Node 运行，部署流水线不会改变，而 Deno 接管 npm、
yarn 或 pnpm 原本负责的工作：安装、更新、审计，以及解释
依赖。

为什么要这么做？安装速度很快，npm 生命周期脚本不会自动运行，除非你
批准它们，而通常需要额外标志或额外包的审计和供应链工具
已经内置。这是刻意设计的最小可行采用步骤：如果效果不理想，删除
`deno.lock`，然后再次运行 `npm install`。

## 使用 Deno 安装你的依赖

在任何包含 `package.json` 的项目中：

```sh
cd my-node-app
deno install
node server.js
```

`deno install` 会创建 `node_modules` 和一个 `deno.lock` 锁文件。它会保留
现有的 `package-lock.json`（或 `yarn.lock`，或 `pnpm-lock.yaml`）不变，
因此对于尚未切换的团队成员不会造成任何破坏。Node 会像以前一样
直接从生成的 `node_modules` 中解析包。

## 命令映射

该表使用现代 Yarn（Berry）的命令名称。Yarn 1（经典版）在某些地方有所不同，
例如使用 `yarn upgrade` 而不是 `yarn up`。

| 任务                 | npm                 | yarn                       | pnpm                             | Deno                |
| -------------------- | ------------------- | -------------------------- | -------------------------------- | ------------------- |
| 安装全部依赖         | `npm install`       | `yarn install`             | `pnpm install`                   | `deno install`      |
| 添加一个包           | `npm install ms`    | `yarn add ms`              | `pnpm add ms`                    | `deno add ms`       |
| 添加开发依赖         | `npm install -D ms` | `yarn add -D ms`           | `pnpm add -D ms`                 | `deno add -D ms`    |
| 移除一个包           | `npm uninstall ms`  | `yarn remove ms`           | `pnpm remove ms`                 | `deno remove ms`    |
| 更新依赖             | `npm update`        | `yarn up <pattern>`        | `pnpm update`                    | `deno update`       |
| 列出过期依赖         | `npm outdated`      | `yarn upgrade-interactive` | `pnpm outdated`                  | `deno outdated`     |
| 运行脚本             | `npm run build`     | `yarn run build`           | `pnpm run build`                 | `deno task build`   |
| 审计依赖             | `npm audit`         | `yarn npm audit`           | `pnpm audit`                     | `deno audit`        |
| 解释一个依赖         | `npm explain ms`    | `yarn why ms`              | `pnpm why ms`                    | `deno why ms`       |
| 运行一次性二进制文件 | `npx cowsay`        | `yarn dlx cowsay`          | `pnpm dlx cowsay`                | `deno x npm:cowsay` |
| 清洁安装（CI）       | `npm ci`            | `yarn install --immutable` | `pnpm install --frozen-lockfile` | `deno ci`           |

有几点值得了解：

- `deno add` 中未加前缀的名称默认是 npm 包。Deno 也可以通过
  [JSR](https://jsr.io) 安装，例如 `deno add jsr:@std/path`。
- 在包含 `package.json` 的项目中，`deno add -D` 会写入 `devDependencies`，
  与 `npm install -D` 相同。`deno ci --prod` 和 `deno install` 也会按你预期
  尊重这种区分。
- 默认情况下，`deno update` 会遵守你的 semver 范围；添加 `--latest` 可跨越
  主版本，或使用 `-i` 交互式选择更新。它是
  `deno outdated --update` 的别名。
- 现代 Yarn 没有内置的 `outdated` 命令，因此交互式升级界面是最接近的等价物。
- `deno ci` 需要 `deno.lock`，会删除任何现有的 `node_modules`，并且仅从锁文件
  严格安装；如果锁文件缺失或与 `package.json` 不一致，则会报错。

## Deno 的不同之处

### 生命周期脚本默认关闭

npm 会自动运行 `postinstall` 和其他生命周期脚本，这是供应链攻击最常见的
入口之一。Deno 永远不会运行它们，除非你显式启用，可以在安装时单独设置：

```sh
deno install --allow-scripts=npm:better-sqlite3
```

或者事后通过交互方式使用
[`deno approve-scripts`](/runtime/reference/cli/approve_scripts/)，它会提示你
从声明了生命周期脚本的已安装包中进行选择。大多数包即使不运行脚本也能正常工作；
少数不能正常工作的包（主要是原生插件）会在运行时告诉你。

### 带自动修复的审计

`deno audit` 会将已安装的包与 npm 建议数据库进行比对，而
`deno audit --fix` 会自动为你升级存在漏洞的包。你可以使用
`--level=high` 进行过滤，使用 `--ignore` 忽略特定 CVE，或使用 `--socket`
检查 socket.dev 数据库。

### 新版本的等待期

Deno 可以拒绝安装年龄小于指定阈值的包版本，这可以在它们到达你这里之前
拦截大多数恶意发布，因为这类发布通常会在几天内被检测并撤回：

```jsonc title="deno.json"
{
  "minimumDependencyAge": "P3D"
}
```

同样的控制也可以通过 `deno install --minimum-dependency-age=P3D` 使用，或者在
`.npmrc` 中通过 `min-release-age` 配置。查看
[供应链管理](/runtime/packages/supply_chain/) 以了解完整情况。

### 锁文件

Deno 维护自己的锁文件 `deno.lock`，不会读取或写入
`package-lock.json`。实际上这意味着：

- 第一次 `deno install` 会重新解析你的 `package.json` 范围，因此它选择的
  版本可能比旧锁文件固定的版本更新。在提交 `deno.lock` 之前请先审查结果。
- 在迁移期间，这两个锁文件可以共存，但它们可能会逐渐分歧，
  因为每个工具只更新自己的锁文件。一旦团队完成切换，就删除旧锁文件并提交
  `deno.lock`。

## 需要注意的事项

**node_modules 布局。** 默认情况下，Deno 使用一种类似 pnpm 的隔离布局：
真实文件位于内容寻址的 `node_modules/.deno/` 目录中，包通过符号链接暴露，
因此每个包只能看到其声明的依赖。大多数项目不会注意到这一点，而这种布局可以
发现扁平化布局会隐藏的幽灵依赖。那些遍历 `node_modules` 并期望 npm 扁平布局的工具，
可以在 `deno.json` 中启用 hoisted linker（Deno 2.8+）：
`"nodeModulesDir": "manual"` 和 `"nodeModulesLinker": "hoisted"`。
参见
[node_modules 目录参考](/runtime/reference/deno_json/#node-modules-directory)
以及
[隔离与提升式布局](/runtime/fundamentals/node/#node_modules-layout%3A-isolated-vs-hoisted)。

**pnpm 工作区。** Deno 支持 `package.json` 中的 `workspace:` 协议
（`workspace:*`、`workspace:~`、`workspace:^`），并且自 Deno 2.8 起还支持
`catalog:` 协议以集中管理依赖版本。不过，`pnpm-workspace.yaml` 文件本身不会被读取；
请将其转换为 `deno.json` 中的 `"workspace"` 字段。参见
[工作区与 monorepo](/runtime/fundamentals/workspaces/)。

**Yarn Plug'n'Play。** Deno 总是将 npm 包安装到真实的
`node_modules` 目录中。没有 `node_modules` 的 Yarn PnP 配置（`.pnp.cjs`
方案）在尝试使用 Deno 之前，应该先将 Yarn 切回其 `node-modules` linker。

**生命周期脚本，再强调一次。** 如果你的安装“成功了但应用坏了”，
请检查某个依赖是否需要它的 `postinstall` 脚本，并使用
`deno approve-scripts` 批准它。这是人们最常遇到的差异。

## 继续前进

- **[从 Node.js 迁移](/runtime/migrate/)。** 当你准备好迈出下一步时：
  使用 `deno task` 运行脚本，然后直接用 Deno 运行应用本身。
- **[依赖管理](/runtime/packages/)。** 完整工具集：版本、锁文件、覆盖、vendor 化，以及 JSR。
- **[供应链管理](/runtime/packages/supply_chain/)。** 锁文件规范、最小依赖年龄，以及推荐的 CI 基线。
