---
title: "从 Bun 迁移"
description: "如何将 Bun 项目迁移到 Deno：从现有的 package.json 安装依赖，保留固定版本，不修改地运行脚本，将 Bun CLI 命令映射到 Deno，并用 Deno 和 Node 内置功能替换 Bun 特定 API。"
last_modified: 2026-06-25
---

大多数 Bun 项目都是标准的 `package.json` 和 TypeScript 项目，而 Deno 可以直接运行它们。Deno 会读取你的 `package.json`，安装相同的 npm 依赖，无需构建步骤即可运行 TypeScript，并提供一套类似的内置工具链：测试运行器、格式化器、代码检查器、打包器和编译器，全部集成在一个二进制文件中。

需要注意的是任何使用 Bun 特定 API 的内容（`Bun.serve`、`bun:sqlite`、`Bun.file`、`$` shell）。下面介绍它们在 Deno 中或在 Deno 支持的 Node 内置功能中的对应实现。凡是没有从 `bun` 或 `bun:*` 导入任何内容的代码，通常都可以不加修改地运行。

## 运行你的项目

安装依赖并运行你的入口文件：

```sh
cd my-bun-app
deno install
deno run main.ts
```

`deno install` 会读取你现有的 `package.json` 并解析相同的 npm
包，类似于 `bun install`。在你第一次运行 `deno install` 时，如果还没有
`deno.lock`，Deno 会基于你现有的 `bun.lock` 生成它，沿用你已经锁定的
版本和完整性哈希。`bun.lock` 是 Bun 的文本锁文件（自 Bun 1.1.39 起写入）；旧的二进制 `bun.lockb` 不会被读取，
所以如果你只有它，请先运行一次 `bun install` 生成 `bun.lock`，
或者让 Deno 重新解析你的 `package.json` 版本范围。

`package.json` 中定义的脚本通过
[`deno task`](/runtime/reference/cli/task/) 运行，相当于 `bun run`：

```sh
deno task start
```

你会立刻遇到的一个行为差异是：**Deno 默认处于沙箱中**。Bun 运行你的代码时可以完全访问网络、文件
系统和环境变量，而 Deno 在程序第一次需要某项权限时会逐个询问。你可以先用 `deno run -A main.ts`
一次性授予所有权限，以匹配 Bun 的行为，然后再在之后收紧这些标志。参见
[安全与权限](/runtime/fundamentals/security/) 和
[权限标志参考](/runtime/reference/permissions/)。

和 Bun 一样，Deno 允许你在文件场景下省略子命令：`deno main.ts` 的作用与
`deno run main.ts` 相同。

## Bun 到 Deno 速查表

<div class="cheatsheet">

### 依赖

| Bun                | Deno                |
| ------------------ | ------------------- |
| `bun install`      | `deno install`      |
| `bun add <pkg>`    | `deno add <pkg>`    |
| `bun remove <pkg>` | `deno remove <pkg>` |
| `bun update`       | `deno update`       |
| `bun outdated`     | `deno outdated`     |

### 运行和执行

| Bun                | Deno                 |
| ------------------ | -------------------- |
| `bun file.ts`      | `deno file.ts`       |
| `bun run <script>` | `deno task <script>` |
| `bunx <pkg>`       | `dx <pkg>`           |

### 测试、构建和工具链

| Bun                   | Deno            |
| --------------------- | --------------- |
| `bun test`            | `deno test`     |
| `bun build`           | `deno bundle` ¹ |
| `bun build --compile` | `deno compile`  |
| `bun upgrade`         | `deno upgrade`  |

¹ [`deno bundle`](/runtime/reference/cli/bundle/) 会从模块图中生成一个单一的 JavaScript
文件。它目前仍处于实验阶段；有关相关选项，请参见
[打包](/runtime/reference/bundling/)指南。

</div>

Bun 没有内置的格式化工具或代码检查器，因此这些是补充而不是
替代：[`deno fmt`](/runtime/reference/cli/fmt/) 和
[`deno lint`](/runtime/reference/cli/lint/) 可覆盖你原本需要安装
Prettier、ESLint 或 Biome 才能实现的功能，而且不需要额外依赖。

## Bun APIs 及其 Deno 等价项

### Bun.serve 到 Deno.serve

这两个服务器都接受类似 fetch 的处理器：一个接收 `Request`
并返回 `Response` 的函数。`Bun.serve` 调用通常可以直接转换为
[`Deno.serve`](/api/deno/~/Deno.serve)：

```ts title="server.ts"
Deno.serve({ port: 3000 }, (req) => {
  return new Response("你好，世界！");
});
```

区别在于：`Bun.serve` 接受一个带有 `fetch`
属性的单一选项对象，而 [`Deno.serve`](/api/deno/~/Deno.serve) 则将处理器作为
直接参数传入（其前可选地带一个 options 对象）。Bun 会将服务器
对象作为处理器的第二个参数传递；Deno 传递的则是连接信息。
Bun 的 `routes` 选项在
[`Deno.serve`](/api/deno/~/Deno.serve) 中没有内置对应项：请使用 `URLPattern` 或框架来
进行路由。更多内容请参见 [HTTP 服务器](/runtime/fundamentals/http_server/)。

### bun:sqlite 到 node:sqlite

Deno 支持内置的 [`node:sqlite`](/runtime/reference/node_apis/)，它同样是同步的，并且覆盖相同的功能：

```ts title="db.ts"
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");
db.exec("CREATE TABLE people (name TEXT)");
db.prepare("INSERT INTO people VALUES (?)").run("Ada");

const rows = db.prepare("SELECT * FROM people").all();
console.log(rows);
```

类名不同（`DatabaseSync` 和 `StatementSync`，而不是 `Database`
和 `Statement`），但 `prepare/run/get/all` 的流程是相同的。

### Bun.file 到 Deno 文件 API

`Bun.file()` 会返回一个带有 `.text()` 和 `.json()` 方法的惰性文件引用。
在 Deno 中，直接使用
[`Deno.readTextFile`](/api/deno/~/Deno.readTextFile) 读取文件，或者在需要用于流式处理的句柄时使用
[`Deno.open`](/api/deno/~/Deno.open)：

```ts
const text = await Deno.readTextFile("./data.txt");
const config = JSON.parse(await Deno.readTextFile("./config.json"));
```

对于更高级的辅助函数（复制、移动、遍历、存在性检查），请使用
[`@std/fs`](https://jsr.io/@std/fs) 包。如果你更喜欢
Node API，也可以使用 `node:fs`。

### bun:test 到 deno test

`bun test` 运行从 `bun:test` 导入的 Jest 风格测试。Deno 支持
[`node:test`](/runtime/reference/node_apis/) 内置模块，因此 `describe` 和
`it` 结构可以直接沿用；配合 `node:assert` 做断言：

```ts title="add.test.ts"
import { describe, it } from "node:test";
import assert from "node:assert";
import { add } from "./add.ts";

describe("add", () => {
  it("adds two numbers", () => {
    assert.strictEqual(add(1, 2), 3);
  });
});
```

```sh
deno test
```

如果你想保留 Bun 的 Jest 风格 `expect` 断言，可以从
[`@std/expect`](/runtime/reference/std/expect/) 导入 `expect`。Deno 自带的
[`Deno.test`](/api/deno/~/Deno.test) 运行器也可用。完整情况请参见
[测试](/runtime/test/)。

### $ shell

Bun 的 `$` 模板字符串 shell 有一个几乎完全相同的对应项：
[`dax`](https://jsr.io/@david/dax)，这是启发它的库之一。

```ts
import $ from "jsr:@david/dax";

const result = await $`echo hello`.text();
```

如果只需要不带 shell 层的子进程控制，请使用内置的
[`Deno.Command`](/api/deno/~/Deno.Command) API。

### bunfig.toml 到 deno.json

运行时和工具配置从 `bunfig.toml` 迁移到 `deno.json`：
tasks、格式化器和 linter 设置、编译器选项以及导入映射都放在
那里。Deno 会同时读取 `package.json`，因此你可以逐步迁移。
参见 [配置](/runtime/fundamentals/configuration/)。

## 没有直接对应项的内容

Bun 的一些功能在 Deno 中没有对应功能，因此需要提前规划：

- **宏。** Bun 可以通过 `with { type: "macro" }`
  导入在打包时运行函数并内联结果。Deno 没有打包时宏系统；请改为在构建脚本中完成这项工作。
- **HTMLRewriter。** Bun 提供了基于 lol-html 构建、与 Cloudflare Workers 兼容的 `HTMLRewriter`
  。Deno 没有内置的 `HTMLRewriter` 全局对象；请使用 npm 包，例如 `npm:lol-html`，或者使用 HTML 解析器，如
  [`deno-dom`](https://jsr.io/@b-fuze/deno-dom)。
- **打包器细节。** `bun build` 的一些功能，例如带有自动资源打包的 HTML 入口点，并不能与实验性的 `deno bundle` 一一对应。对于功能完整的前端构建，请在 Deno 下使用 Vite 或其他打包器；参见 [打包](/runtime/reference/bundling/)。

## 继续阅读

- **[从 Node.js 迁移](/runtime/migrate/).** 其中很多内容也适用于 Bun
  项目，包括 CommonJS 和 ES 模块的解析方式。
- **[安全与权限](/runtime/fundamentals/security/).** 沙箱如何工作，以及需要授予哪些标志。
- **[测试](/runtime/test/).** 测试运行器、模拟、快照和
  覆盖率。
- **[依赖管理](/runtime/packages/).** 详细介绍 npm、JSR 和 `package.json`
  的工作流。
