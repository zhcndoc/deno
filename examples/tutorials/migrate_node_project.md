---
last_modified: 2026-06-11
title: "在现有的 Node.js 项目中使用 Deno"
description: "无需重写即可使用 Deno 运行现有的 Node.js 项目：从 package.json 安装依赖，使用 deno task 运行 npm 脚本，使用 node: 内置模块，并逐步采用 Deno 内置工具链。"
url: /examples/migrate_node_project_tutorial/
---

大多数 Node.js 项目都可以在 Deno 中无需修改即可运行。Deno 会读取 `package.json`，
将相同的 npm 依赖安装到 `node_modules` 中，运行 CommonJS 和
ES 模块，并执行你现有的 npm 脚本。本教程将一步一步地把一个典型的 Node 项目
迁移到 Deno 中运行。

## 从 package.json 安装依赖

`deno install` 相当于 `npm install`：它会读取你现有的
`package.json` 并生成 `node_modules` 目录：

```sh
$ deno install
Initialize ms@2.1.3
Installed 1 package in 2ms

Dependencies:
+ npm:ms 2.1.3
```

不需要 `deno.json`；仅 `package.json` 就足够了。系统会创建一个 `deno.lock` 文件
来固定精确版本。

## 运行你的 npm 脚本

`deno task` 相当于 `npm run`，并会原样读取你
`package.json` 中的 `scripts`：

```json title="package.json"
{
  "name": "my-node-app",
  "type": "module",
  "scripts": {
    "start": "node main.js"
  },
  "dependencies": {
    "ms": "^2.1.3"
  }
}
```

```sh
$ deno task start
Task start node main.js
172800000
```

## 使用 Deno 运行入口文件

要把 Deno 作为运行时，只需将其指向相同的入口文件：

```sh
$ deno run main.js
172800000
```

:::note

Deno 默认是安全的：如果你的代码会读取文件、打开套接字或访问
环境变量，请显式授予访问权限，例如
`deno run --allow-net --allow-env main.js`，或者先使用较宽松的
`deno run -A main.js`，之后再收紧权限。

:::

另外两条兼容性规则几乎覆盖了其他所有情况：

- **Node 内置模块使用 `node:` 前缀**：应写成 `import os from "node:os"`
  而不是 `import os from "os"`。Node 本身也支持这个前缀，因此
  这种修改具有向后兼容性。
- **CommonJS 和 ES 模块都能工作**：`.cjs` 和 `.mjs` 是明确无歧义的，而
  `.js` 则遵循最近的 `package.json` 中的 `"type"` 字段。基于
  `require()` 且 `"type": "commonjs"` 的项目可以原样运行。

:::note

Deno 默认假定使用 ES 模块。只有当最近的 `package.json` 声明了 `"type": "commonjs"` 时，
`.js` 文件才会被视为 CommonJS；而 Node 在该字段缺失时会默认使用 CommonJS。
对于依赖这种隐式默认值的旧项目，请添加这一行。

:::

## 逐步替换工具链

你不必一次性切换所有内容：Deno 既可以只作为包管理器使用，也可以只作为任务运行器使用。
当你准备好时，内置工具链可以在零配置的情况下替代多个开发依赖：

| Node.js 工具链      | Deno         |
| ------------------ | ------------ |
| `npm install`      | deno install |
| `npm run <script>` | deno task    |
| `eslint`           | deno lint    |
| `prettier`         | deno fmt     |
| `jest` / `mocha`   | deno test    |
| `tsc --NoEmit`     | deno check   |

有关模块解析细节、完整命令速查表以及 tsconfig
迁移，请参阅 [从 Node.js 迁移指南](/runtime/migrate/)。
