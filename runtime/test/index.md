---
last_modified: 2026-06-18
title: "测试"
description: "使用 Deno 内置的测试运行器编写并运行测试：断言、测试步骤、钩子、过滤和报告器，并提供用于 mock、快照和覆盖率的专门指南。"
oldUrl:
  - /runtime/fundamentals/testing/
  - /runtime/manual/basics/testing/
  - /runtime/manual/basics/testing/assertions/
  - /runtime/manual/basics/testing/behavior_driven_development
  - /runtime/manual/testing
---

Deno 提供了一个内置的测试运行器，可以用来编写和运行 JavaScript 和 TypeScript 中的测试。这使得确保代码可靠并按预期运行变得简单，无需安装任何额外的依赖项或工具。`deno test` 运行器允许您对每个测试的权限进行细粒度控制，确保代码没有执行任何意外的操作。

除了内置的测试运行器之外，您还可以在 Deno 中使用 JS 生态系统中的其他测试运行器，例如 Jest、Mocha 或 AVA。要迁移现有的 Jest 测试套件？请参阅
[从 Jest 迁移](/runtime/test/migrate_from_jest/)。

## [`Deno.test`](/api/deno/~/Deno.test) vs [`node:test`](/api/node/test/)

Deno 同等支持两种测试 API：它自己的 [`Deno.test`](/api/deno/~/Deno.test) 以及 Node 内置的 [`node:test`](/api/node/test/) 模块。二者都属于一等公民。`deno test` 可以发现、运行并报告使用任一 API 编写的测试，[覆盖率](/runtime/test/coverage/) 和名称过滤等核心功能在两者之间的行为一致，您也可以在同一个项目中混用二者。没有哪一个比另一个更受支持。

区别在于 API，而不是支持级别：

- [`Deno.test`](/api/deno/~/Deno.test) 无需导入，并暴露 Deno 特有的选项，例如每个测试的[权限](#tests-and-permissions)以及 op/resource [消毒器](/runtime/test/sanitizers/)开关。
- `node:test`（`import { test } from "node:test"`）使用 Node 测试 API，因此用它编写的测试套件也可以原样在 Node.js 上运行。

当您希望测试套件能够跨 Deno 和 Node 移植，或者在迁移 Node 项目时，请使用 `node:test`；当您希望使用 Deno 原生的易用性和选项时，请使用 [`Deno.test`](/api/deno/~/Deno.test)。

## 编写测试

要在 Deno 中定义测试，请使用 [`Deno.test()`](/api/deno/~/Deno.test)
函数。以下是一些示例：

```ts title="my_test.ts"
import { assertEquals } from "jsr:@std/assert";
import { delay } from "jsr:@std/async";

Deno.test("简单测试", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

Deno.test("async test", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

Deno.test({
  name: "读取文件测试",
  fn: () => {
    const data = Deno.readTextFileSync("./somefile.txt");
    assertEquals(data, "预期内容");
  },
});
```

如果您更喜欢类似于“jest”的 `expect` 风格的断言，Deno 标准库提供了一个 [`expect`](https://jsr.io/@std/expect) 函数，可以替代 `assertEquals`：

```ts title="my_test.ts"
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

Deno.test("add 函数正确相加两个数字", () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});
```

## 运行测试

要运行测试，请使用 [`deno test`](/runtime/reference/cli/test/) 子命令。

如果没有传入文件名或目录名，该子命令将自动查找并执行当前目录中（递归地）所有匹配 glob `{*_,*.,}test.{ts, tsx, mts, js, mjs, jsx}` 的测试。

```sh
# 运行当前目录及所有子目录中的所有测试
deno test

# 运行 util 目录中的所有测试
deno test util/

# 仅运行 my_test.ts
deno test my_test.ts

# 并行运行测试模块
deno test --parallel

# 传递额外参数给测试文件，这些参数在 `Deno.args` 中可见
deno test my_test.ts -- -e --foo --bar

# 提供文件系统的读取权限，这对于上面的最终测试是必要的
deno test --allow-read=. my_test.ts
```

## 测试步骤

Deno 还支持测试步骤，这允许您将测试细分为更小、可管理的部分。这在测试中的设置和拆除操作时非常有用：

```ts
Deno.test("数据库操作", async (t) => {
  using db = await openDatabase();
  await t.step("插入用户", async () => {
    // 插入用户逻辑
  });
  await t.step("插入书籍", async () => {
    // 插入书籍逻辑
  });
});
```

## 超时

您可以使用 `timeout` 选项为单个测试设置最大持续时间。
如果测试超过其截止时间，它将被标记为失败。无论是异步挂起
（一个永远不会解析的 promise）还是同步死循环（`while (true) {}`
）都会被捕获。

```ts
Deno.test({
  name: "在截止时间内完成",
  timeout: 5000, // 5 秒
  async fn() {
    const response = await fetch("https://example.com");
    await response.body?.cancel();
  },
});
```

如果某个测试超时，同一文件中的下一个测试仍会正常运行。

将 `timeout` 设为 `0` 或省略它，表示测试将在没有截止时间的情况下运行。

## 测试钩子

Deno 提供了测试钩子，允许您在测试运行之前和之后运行设置和拆除代码。这些钩子对于初始化资源、测试后清理以及确保测试环境一致非常有用。

### 可用的钩子

- `Deno.test.beforeAll(fn)` - 在当前范围内的所有测试之前运行一次
- `Deno.test.beforeEach(fn)` - 在每个单独测试之前运行
- `Deno.test.afterEach(fn)` - 在每个单独测试之后运行
- `Deno.test.afterAll(fn)` - 在当前范围内的所有测试之后运行一次

### 钩子执行顺序

- **beforeAll/beforeEach**: 按先进先出（FIFO）顺序执行
- **afterEach/afterAll**: 按后进先出（LIFO）顺序执行

如果任何钩子中抛出异常，同类型的剩余钩子将不会被执行，且当前测试将被标记为失败。

### 示例

```ts
import { DatabaseSync } from "node:sqlite";
import { assertEquals } from "jsr:@std/assert";

let db: DatabaseSync;

Deno.test.beforeAll(() => {
  console.log("正在设置测试数据库...");
  db = new DatabaseSync(":memory:");
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    ) STRICT
  `);
});

Deno.test.beforeEach(() => {
  console.log("正在清空数据库以保持干净的测试状态...");
  db.exec("DELETE FROM users");
});

Deno.test.afterEach(() => {
  console.log("测试完成，正在清理资源...");
  // 每个测试后的额外清理
});

Deno.test.afterAll(() => {
  console.log("正在拆除测试数据库...");
  db.close();
});

Deno.test("用户创建", () => {
  const stmt = db.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
  );
  const user = stmt.get("alice", "alice@example.com");
  assertEquals(user!.name, "alice");
});

Deno.test("用户删除", () => {
  const insertStmt = db.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
  );
  const user = insertStmt.get("bob", "bob@example.com");

  const deleteStmt = db.prepare("DELETE FROM users WHERE id = ?");
  deleteStmt.run(user!.id);

  const selectStmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const deletedUser = selectStmt.get(user!.id);
  assertEquals(deletedUser, undefined);
});
```

### 多个钩子

您可以注册多个相同类型的钩子，它们将按照上述顺序依次执行：

```ts
Deno.test.beforeEach(() => {
  console.log("第一个 beforeEach 钩子");
});

Deno.test.beforeEach(() => {
  console.log("第二个 beforeEach 钩子");
});

// 输出：
// 第一个 beforeEach 钩子
// 第二个 beforeEach 钩子
// （测试执行）
```

## 过滤测试

使用 `--filter` 标志运行部分测试。它接受一个字符串，或者一个
用正斜杠包裹的正则表达式：

```sh
# 运行名称包含单词 "my" 的测试
deno test --filter "my" tests/

# 运行名称匹配某种模式的测试
deno test --filter "/test-*\d/" tests/
```

要控制首先收集哪些测试文件，请在您的
[配置文件](/runtime/reference/deno_json/#include-and-exclude) 中设置 `test.include`
和 `test.exclude`。有关完整的
过滤语义，请参阅 [`deno test` 参考](/runtime/reference/cli/test/#filtering)。

## 测试定义选择

Deno 提供了两种选择测试的方法：忽略测试和专注于特定测试。

### 忽略/跳过测试

您可以根据特定条件使用测试定义中的 `ignore` 布尔值来忽略某些测试。如果 `ignore` 设置为 `true`，该测试将被跳过。这在您希望测试仅在特定操作系统上运行时非常有用。

```ts
Deno.test({
  name: "执行 macOS 功能",
  ignore: Deno.build.os !== "darwin", // 如果不在 macOS 上运行，则该测试将被忽略
  fn() {
    // 在这里执行 MacOS 功能
  },
});
```

如果您想在不传入任何条件的情况下忽略测试，可以使用 [`Deno.test`](/api/deno/~/Deno.test) 对象中的
`ignore()` 函数：

```ts
Deno.test.ignore("我的测试", () => {
  // 您的测试代码
});
```

### 仅运行特定测试

如果您想专注于特定测试并忽略其他测试，可以使用 `only` 选项。这告诉测试运行器仅运行设置为 `only` 的测试。多个测试可以设置此选项。然而，如果任何测试标记为 only，则整体测试运行将始终失败，因为这被视为临时调试措施。

```ts
Deno.test.only("我的测试", () => {
  // 一些测试代码
});
```

或者

```ts
Deno.test({
  name: "仅关注此测试",
  only: true, // 仅此测试将运行
  fn() {
    // 在这里测试复杂的内容
  },
});
```

## 快速失败

如果您有一个长时间运行的测试套件，并希望在第一次失败时停止，可以在运行套件时指定 `--fail-fast` 标志。

```shell
deno test --fail-fast
```

这将导致测试运行器在第一次测试失败后停止执行。

## 报告工具

测试输出默认使用详细的 `pretty` 报告器。使用
`--reporter` 标志（`dot`、`junit`、`tap`）切换格式，或者使用
`--junit-path` 将 JUnit XML 报告写入文件，同时在终端保持可读输出：

```sh
deno test --reporter=dot
deno test --junit-path=./report.xml
```

请参阅 [`deno test` 参考](/runtime/reference/cli/test/#reporters) 以查看
报告器的完整列表。

## Mock 和测试替身

通过使用 `@std/testing` 中的 spy、stub 和 mock 替换其协作者，来隔离被测代码，并使用 `FakeTime` 控制时钟。请参阅
[Mock 和测试替身](/runtime/test/mocking/) 以获取包含
可运行示例的完整指南。

## 覆盖率

在测试时使用 `deno test --coverage` 收集覆盖率，然后通过 `deno coverage` 将其转换为
终端、HTML 或 lcov 报告。数据直接来自 V8。请参阅 [测试覆盖率](/runtime/test/coverage/) 了解工作流程，
包括 CI 集成。

## 行为驱动开发

使用 [`@std/testing/bdd`](/runtime/reference/std/testing/) 模块，您可以
以其他 JavaScript 测试框架（如 Jasmine、
Jest 和 Mocha）使用的熟悉格式编写测试，用于分组测试并添加
设置/拆除钩子。

`describe` 函数创建一个块，以将多个相关测试分组。`it` 函数注册一个单个测试用例。例如：

```ts
import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { add } from "./add.js";

describe("add 函数", () => {
  it("正确相加两个数字", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  it("处理负数", () => {
    const result = add(-2, -3);
    expect(result).toBe(-5);
  });
});
```

查看 [`@std/testing` 文档](/runtime/reference/std/testing/)
以了解这些函数和钩子的更多信息。

- [BDD 测试教程](/examples/bdd_tutorial/)

## 文档测试

`deno test --doc` 会将 JSDoc 注释和 markdown 文件中的代码示例作为测试运行，因此文档不会悄悄过时。请参阅
[文档测试](/runtime/test/doc_tests/) 了解如何提取、类型检查和跳过代码片段。

## 消毒器

测试运行器可以捕获断言无法发现的错误行为：泄漏的异步
操作、未关闭的资源以及意外的
[`Deno.exit()`](/api/deno/~/Deno.exit) 调用。退出消毒器默认开启；由于 Deno 2.8，op 和资源消毒器为可选启用。请参阅
[测试消毒器](/runtime/test/sanitizers/) 了解每种消毒器以及全局
启用选项。

## 快照测试

将一个值与存储在测试旁边的序列化参考值进行比较，并在行为有意改变时使用一个标志更新参考值。
请参阅 [快照测试](/runtime/test/snapshots/) 了解工作流程，包括
更新和审查快照。

## 测试和权限

[`Deno.test`](/api/deno/~/Deno.test) 配置中的 `permissions` 属性允许您有针对性地拒绝权限，但不会授予权限。权限必须在运行测试命令时提供。在构建健壮的应用程序时，您通常需要处理权限被拒绝的情况（例如，您可能希望编写测试来检查回退方案是否已正确设置）。

考虑一种情况，您正在从文件中读取，您可能希望在函数没有读取权限的情况下提供一个回退值：

```ts
import { assertEquals } from "jsr:@std/assert";
import getFileText from "./main.ts";

Deno.test({
  name: "文件读取器在有权限时获取文本",
  // 没有 `permissions` 表示“继承”
  fn: async () => {
    const result = await getFileText();
    console.log(result);
    assertEquals(result, "文件内容");
  },
});

Deno.test({
  name: "文件读取器在没有权限时回退到错误消息",
  permissions: { read: false },
  fn: async () => {
    const result = await getFileText();
    console.log(result);
    assertEquals(result, "糟糕，没有权限");
  },
});
```

```sh
# 运行带有读取权限的测试
deno test --allow-read
```

权限对象支持详细配置：

```ts
Deno.test({
  name: "权限配置示例",
  // permissions: { read: true } // 授予所有读取权限，拒绝其他所有权限
  // 或者
  permissions: {
    read: ["./data", "./config"], // 仅授予对特定路径的读取权限
    write: false, // 明确拒绝写权限
    net: ["example.com:443"], // 允许特定的 host:port 组合
    env: ["API_KEY"], // 允许访问特定的环境变量
    run: false, // 拒绝子进程执行权限
    ffi: false, // 拒绝加载动态库
    hrtime: false, // 拒绝高分辨率时间权限
  },
  fn() {
    // 遵守这些权限边界的测试代码
  },
});
```

请记住，任何未在命令行中明确授予的权限都将被拒绝，无论测试配置中指定了什么。

## 相关教程

有关更多上手测试指南，请查看：

- [基础测试教程](/examples/testing_tutorial/)
- [Mocking 和测试替身](/runtime/test/mocking/)
- [快照测试](/runtime/test/snapshots/)
- [从 Jest 迁移](/runtime/test/migrate_from_jest/)
- [Web 应用测试教程](/examples/web_testing_tutorial/)
