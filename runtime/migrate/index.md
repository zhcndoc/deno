---
last_modified: 2026-06-08
title: "从 Node.js 迁移"
description: "如何将 Node.js 项目迁移到 Deno：将 Deno 作为即插即用的包管理器，运行现有项目和 package.json 脚本，了解 CommonJS 和 ES 模块如何解析，并将你的 Node 命令映射到 Deno。"
oldUrl:
  - /runtime/fundamentals/migrate_from_node/
  - /runtime/manual/node/migrate/
  - /runtime/manual/references/cheatsheet/
  - /runtime/manual/node/cheatsheet/
---

大多数 Node.js 项目都可以在 Deno 中运行，**完全无需任何改动**。Deno 会读取你的
`package.json`，安装并解析相同的 npm 依赖项，并运行 CommonJS 和 ES 模块，因此在大多数情况下，你只需将 Deno 指向现有
项目，它就能正常工作。

你也可以逐步采用 Deno：把它纯粹用作更快的、即插即用的包管理器，来管理仍然使用 Node 运行的应用；用 `deno task` 运行现有的
`package.json` 脚本；或者切换到 Deno 作为运行时，并使用它内置的工具链。本指南将逐步介绍每个步骤。

## 将 Deno 用作你的包管理器

Deno 与 npm 和 `package.json` 完全兼容，因此最容易上手的地方是依赖管理，而且完全无需改变你运行代码的方式。
`deno install` 会读取你现有的 `package.json`，解析相同的 npm
包，并写入 `node_modules` 目录，就像 `npm install` 一样：

```sh
cd my-node-app
deno install
```

从这里开始，你可以继续使用 Node 运行应用，只把 Deno 作为更快的
包管理器，或者使用 Deno 内置命令来管理依赖项：

```sh
deno add    npm:express   # 添加依赖
deno remove express       # 删除一个依赖
deno outdated             # 查看哪些依赖有更新版本
```

Deno 能理解在 `package.json` 和 `deno.json` 中声明的依赖项，单独的 npm 包也可以通过 `npm:` 说明符内联导入。
完整内容请参见 [依赖管理](/runtime/packages/)。

## 使用 Deno 运行你的项目

要用 Deno 运行现有的 Node 项目，请安装其依赖项并运行入口文件：

```sh
cd my-node-app
deno install
deno run main.js
```

请预期会与 Node 有一个直接的区别：Deno 默认是[安全的](/runtime/fundamentals/security/)，所以当你的应用第一次访问网络、文件系统或环境变量时，Deno 会提示你授予权限。
你可以通过标志预先授予应用所需权限（`deno run -N -R -E main.js`），或者在迁移期间使用 `-A` 以获得与 Node 等效的行为，之后再逐步收紧。
有关完整标志列表，请参见 [权限](/runtime/reference/permissions/)。

如果你的 `package.json` 定义了脚本，请使用
[`deno task`](/runtime/reference/cli/task/) 来运行它们，它相当于 `npm run`：

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "start": "node server.js"
  }
}
```

```sh
deno task start
```

大多数代码都可以不加修改地运行。最重要的是理解 Deno 如何决定
一个文件是 CommonJS 还是 ES 模块，这遵循你的 `package.json`。
下面会介绍这一点。

## CommonJS 和 ES 模块

Deno 同时运行 ES 模块和 CommonJS，并且使用与 Node.js 相同的规则来决定如何处理文件：

- `.cjs` 文件**始终**是 CommonJS，`.mjs` 文件**始终**是 ES
  模块。扩展名已经足够。
- 当最近的 `package.json` 设置了 `"type": "commonjs"` 时，`.js`、`.ts`、`.jsx` 或 `.tsx` 文件会被加载为**CommonJS**，否则会被加载为**ES 模块**。
  Deno 会像 Node 一样沿着目录树向上查找该 `package.json`。

```json title="package.json"
{
  "type": "commonjs"
}
```

因此现有的 CommonJS 项目会继续工作：只要在 `package.json` 中设置 `"type": "commonjs"`，
你的基于 `require()` 的 `.js` 文件就能在 Node 和 Deno 下运行。
CommonJS 代码需要其依赖项存在于 `node_modules` 中（在 `deno.json` 中设置
`"nodeModulesDir": "auto"`），并且需要常规的
[权限标志](/runtime/fundamentals/security/)。

你也可以混合使用这两种模块系统：`require()` 可在 `.cjs`
文件中使用，或通过 `createRequire` 使用；Deno 的 `require()` 可以加载同步 ES
模块，而且你可以在 ES 模块中 `import` CommonJS 文件。详情和边缘情况请参见
[CommonJS 支持](/runtime/fundamentals/node/#commonjs-support)。

## 常见错误与修复

大多数 Node 项目第一次运行时会遇到的少数错误，以及它们的含义：

- **`NotCapable: Requires read access to "...", run again with the
  --allow-read flag`**：
  这是权限沙箱在起作用。授予所列出的权限（这里是 `-R`），或者使用
  `-A` 运行，直到你准备好缩小权限范围。
- **`ReferenceError: require is not defined`**：Deno 将该文件视为 ES
  模块。请在 `package.json` 中设置 `"type": "commonjs"`，或者将文件重命名为
  `.cjs`。另请参见上面的[CommonJS 和 ES 模块](#commonjs-and-es-modules)。
- **Cannot find module / missing `node_modules`**：运行 `deno install`。如果你的
  工具期望存在 `node_modules` 目录，请在 `deno.json` 中设置
  `"nodeModulesDir": "auto"`。
- **某个依赖的 install/postinstall 脚本未运行**（原生插件，
  `node-gyp` 构建）：Deno 默认不会运行 npm 生命周期脚本。你可以通过
  `deno install --allow-scripts=npm:<pkg>` 为单个包允许它们，或者使用
  [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) 来管理批准。
- **某个 `node:` API 的行为不同或缺失**：请查看
  [Node API 兼容性列表](/runtime/reference/node_apis/)，了解状态和已知缺口。

如果你正在迁移框架应用（Next.js、SvelteKit、Nuxt 等），大多数可以通过将 `npm run dev` 替换为 `deno task dev` 在 Deno 下运行。请参见
[Web 开发](/runtime/fundamentals/web_dev/) 和
[教程](/examples/) 获取特定框架的演练。

## Node 到 Deno 速查表

在 Node 项目中，其中很多都是你需要单独安装和配置的包：eslint、prettier、jest、ts-node、nodemon、nyc、tsc。在 Deno 中，它们都是同一个二进制文件，无需额外依赖，也无需维护配置文件。
你可以保留现有的 `package.json`，或者将配置迁移到 `deno.json` 中。

<div class="cheatsheet">

### 运行与监听

| Node.js           | Deno               |
| ----------------- | ------------------ |
| `node file.js`    | `deno file.js`     |
| `ts-node file.ts` | `deno file.ts`     |
| `node -e "…"`     | `deno eval "…"`    |
| `nodemon`         | `deno run --watch` |

### 依赖与脚本

| Node.js                 | Deno                    |
| ----------------------- | ----------------------- |
| `npm install` / `npm i` | `deno install`          |
| `npm install -g <pkg>`  | `deno install -g <pkg>` |
| `npm run <script>`      | `deno task <script>`    |
| `npm explain <pkg>`     | `deno why <pkg>`        |

### 质量与测试（内置，无需安装或配置）

| Node.js                          | Deno            |
| -------------------------------- | --------------- |
| `eslint`                         | `deno lint`     |
| `prettier`                       | `deno fmt`      |
| `jest` / `mocha` / `ava` / `tap` | `deno test`     |
| `nyc` / `c8` / `istanbul`        | `deno coverage` |
| benchmark libraries              | `deno bench`    |

### TypeScript、文档和构建

| Node.js        | Deno           |
| -------------- | -------------- |
| `tsc`          | `deno check` ¹ |
| `typedoc`      | `deno doc`     |
| `nexe` / `pkg` | `deno compile` |

¹ TypeScript 会直接运行：没有构建步骤。`deno check` 会进行类型检查但不输出结果，而编译器内置于 `deno` 二进制文件中。

### 工具链

| Node.js             | Deno             |
| ------------------- | ---------------- |
| `tsserver`          | `deno lsp`       |
| `nvm` / `n` / `fnm` | `deno upgrade` ² |

² `deno upgrade` 会更新已安装的单个二进制文件，并可锁定任意发布版本（`deno upgrade 2.1.0`）；与 `nvm` 不同，它不会并排保留多个已安装版本。

</div>

## 继续阅读

- **[Node.js 与 npm 兼容性](/runtime/fundamentals/node/)。** 支持什么（`node:` 内置模块、npm 包、全局对象）以及已知缺口。
- **[Node API 兼容性列表](/runtime/reference/node_apis/)。** 每个 `node:` 内置模块的逐模块支持状态。
- **[迁移你的 tsconfig.json](/runtime/reference/ts_config_migration/)。**
  将 `tsconfig.json` 选项映射到 `deno.json`。
