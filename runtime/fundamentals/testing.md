---
title: "Testing"
description: "A guide to Deno's testing capabilities. Learn about the built-in test runner, assertions, mocking, coverage reporting, snapshot testing, and how to write effective tests for your Deno applications."
oldUrl:
  - /runtime/manual/advanced/language_server/testing_api/
  - /runtime/manual/basics/testing/
  - /runtime/manual/basics/testing/coverage/
  - /runtime/manual/basics/testing/assertions/
  - /runtime/manual/basics/testing/mocking/
  - /runtime/manual/basics/testing/behavior_driven_development
  - /runtime/manual/testing/documentation/
  - /runtime/manual/basics/testing/sanitizers/
  - /runtime/manual/basics/testing/snapshot_testing/
  - /runtime/manual/testing
  - /runtime/manual/basics/testing/documentation/
---

Deno 提供了一个内置的测试运行器，可以用来编写和运行 JavaScript 和 TypeScript 中的测试。这使得确保代码可靠并按预期运行变得简单，无需安装任何额外的依赖项或工具。`deno test` 运行器允许您对每个测试的权限进行细粒度控制，确保代码没有执行任何意外的操作。

除了内置的测试运行器，您还可以使用来自 JS 生态系统的其他测试运行器，如 Jest、Mocha 或 AVA 来与 Deno 一起使用。不过本文件将不讨论这些内容。

## 编写测试

在 Deno 中定义测试，您可以使用 `Deno.test()` 函数。以下是一些示例：

```ts title="my_test.ts"
import { assertEquals } from "jsr:@std/assert";

Deno.test("简单测试", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

import { delay } from "jsr:@std/async";

Deno.test("异步测试", async () => {
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

## 命令行过滤

Deno 允许您使用命令行上的 `--filter` 选项运行特定的测试或测试组。此选项接受字符串或模式以匹配测试名称。过滤不会影响步骤；如果测试名称匹配过滤器，则将执行它的所有步骤。

考虑以下测试：

```ts
Deno.test("my-test", () => {});
Deno.test("test-1", () => {});
Deno.test("test-2", () => {});
```

### 通过字符串过滤

要运行所有名称中包含“my”的测试，请使用：

```sh
deno test --filter "my" tests/
```

这个命令将执行 `my-test`，因为它包含了单词“my”。

### 通过模式过滤

要运行与特定模式匹配的测试，请使用：

```sh
deno test --filter "/test-*\d/" tests/
```

这个命令将运行 `test-1` 和 `test-2`，因为它们匹配模式 `test-*` 后跟数字。

要指示您使用的是模式（正则表达式），请用正斜杠 `/` 将过滤值括起来，就像 JavaScript 的正则表达式语法一样。

### 在配置文件中包含和排除测试文件

您还可以通过在 [Deno 配置文件](/runtime/fundamentals/configuration) 中指定要包含或排除的路径来过滤测试。

例如，如果您只想测试 `src/fetch_test.ts` 和 `src/signal_test.ts` 并排除 `out/` 目录中所有文件：

```json
{
  "test": {
    "include": [
      "src/fetch_test.ts",
      "src/signal_test.ts"
    ]
  }
}
```

或者更可能的：

```json
{
  "test": {
    "exclude": ["out/"]
  }
}
```

## 测试定义选择

Deno 提供了两种选择测试的方法：忽略测试和专注于特定测试。

### 忽略/跳过测试

您可以根据特定条件使用测试定义中的 `ignore` 布尔值来忽略某些测试。如果 `ignore` 设置为 `true`，测试将被跳过。这在您希望测试仅在特定操作系统上运行时非常有用。

```ts
Deno.test({
  name: "执行 macOS 功能",
  ignore: Deno.build.os !== "darwin", // 如果不在 macOS 上运行，则该测试将被忽略
  fn() {
    // 在这里执行 MacOS 功能
  },
});
```

如果您想要在没有传递任何条件的情况下忽略测试，可以使用 `Deno.test` 对象中的 `ignore()` 函数：

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

Deno 包含三种内置报告工具来格式化测试输出：

- `pretty`（默认）：提供详细且可读的输出。
- `dot`：提供简洁的输出，便于快速查看测试结果。
- `junit`：以 JUnit XML 格式生成输出，可用于与 CI/CD 工具集成。

您可以使用 `--reporter` 标志指定要使用的报告工具：

```sh
# 使用默认的漂亮报告工具
deno test

# 使用 dot 报告工具获得简洁输出
deno test --reporter=dot

# 使用 JUnit 报告工具
deno test --reporter=junit
```

此外，您可以使用 `--junit-path` 标志将 JUnit 报告写入文件，同时在终端中获得可读的输出：

```sh
deno test --junit-path=./report.xml
```

## 监视、模拟（测试替身）、存根和时间伪造

[Deno 标准库](/runtime/fundamentals/standard_library/) 提供了一组函数，帮助您编写涉及监视、模拟和存根的测试。有关这些工具的更多信息，请查看 [JSR 上的 @std/testing 文档](https://jsr.io/@std/testing) 或我们的 [关于使用 deno 进行测试的模拟和监视的教程](/examples/mocking_tutorial/)。

## 覆盖率

如果您在启动 `deno test` 时指定 `--coverage` 标志，Deno 将收集代码的测试覆盖率信息。此覆盖信息直接从 V8 JavaScript 引擎获取，确保高准确度。

然后，您可以使用 [`deno coverage`](/runtime/reference/cli/coverage/) 工具将其从内部格式进一步处理为常用格式，如 `lcov`。

## 行为驱动开发

使用 [@std/testing/bdd](https://jsr.io/@std/testing/doc/bdd/~) 模块，您可以以化简的格式编写测试，以便分组测试和添加其他 JavaScript 测试框架（如 Jasmine、Jest 和 Mocha）使用的设置/拆卸钩子。

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

请查看 [JSR 的文档](https://jsr.io/@std/testing/doc/bdd/~) 获取有关这些函数和钩子的更多信息。

- [BDD 测试教程](/examples/bdd_tutorial/)

## 文档测试

Deno 允许您评估用 JSDoc 或 markdown 文件编写的代码片段。这确保了文档中的示例是最新且可运行的。

### 示例代码块

````ts title="example.ts"
/**
 * # 示例
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(1, 2);
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
````

三重反引号标记代码块的开始和结束，语言由语言标识符属性确定，该属性可以是以下之一：

- `js`
- `javascript`
- `mjs`
- `cjs`
- `jsx`
- `ts`
- `typescript`
- `mts`
- `cts`
- `tsx`

如果未指定语言标识符，则从提取代码块的源文档的媒体类型推断语言。

```sh
deno test --doc example.ts
```

上述命令将提取此示例，并将其转换为看似以下的伪测试用例：

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add } from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(1, 2);
  assertEquals(sum, 3);
});
```

然后将其作为一个独立模块运行，该模块位于与被记录模块相同的目录中。

:::tip 想只进行类型检查？

如果您想对 JSDoc 和 markdown 文件中的代码片段进行类型检查，而不实际运行它们，您可以使用 [`deno check`](/runtime/reference/cli/check/) 命令与 `--doc` 选项（用于 JSDoc）或 `--doc-only` 选项（用于 markdown）代替。

:::

### 导出的项会自动导入

查看上面生成的测试代码，您会注意到它包含 `import` 语句以导入 `add` 函数，即使原始代码块没有。这是因为在记录模块时，所有从模块导出的项都会自动包括在生成的测试代码中，使用相同的名称。

假设我们有以下模块：

````ts title="example.ts"
/**
 * # 示例
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(ONE, getTwo());
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}

export const ONE = 1;
export default function getTwo() {
  return 2;
}
````

这将转换为以下测试用例：

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add, ONE }, getTwo from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(ONE, getTwo());
  assertEquals(sum, 3);
});
```

### 跳过代码块

您可以通过添加 `ignore` 属性来跳过代码块的评估。

````ts
/**
 * 该代码块将不会被运行。
 *
 * ```ts ignore
 * await sendEmail("deno@example.com");
 * ```
 */
export async function sendEmail(to: string) {
  // 向指定地址发送电子邮件...
}
````

## 消毒器

测试运行器提供了多种消毒器，以确保测试以合理和预期的方式运行。

### 资源消毒器

资源消毒器确保在测试过程中创建的所有 I/O 资源都被关闭，以防止资源泄漏。

I/O 资源是指 `Deno.FsFile` 句柄、网络连接、`fetch` 体、定时器等不自动进行垃圾回收的其他资源。

完成操作后，您应始终关闭资源。例如，要关闭一个文件：

```ts
const file = await Deno.open("hello.txt");
// 对文件执行某些操作
file.close(); // <- 始终在完成后关闭文件
```

要关闭网络连接：

```ts
const conn = await Deno.connect({ hostname: "example.com", port: 80 });
// 对连接执行某些操作
conn.close(); // <- 始终在完成后关闭连接
```

要关闭一个 `fetch` 体：

```ts
const response = await fetch("https://example.com");
// 对响应执行某些操作
await response.body?.cancel(); // <- 如果不以其他方式使用它，请始终在完成后取消主体
```

此消毒器默认启用，但可以在此测试中使用 `sanitizeResources: false` 进行禁用：

```ts
Deno.test({
  name: "泄漏资源测试",
  async fn() {
    await Deno.open("hello.txt");
  },
  sanitizeResources: false,
});
```

### 异步操作消毒器

异步操作消毒器确保在测试中启动的所有异步操作都在测试结束前完成。这很重要，因为如果异步操作没有被等待，测试将在操作完成之前结束，并且即使操作可能实际上失败，测试也会被标记为成功。

在测试中，您应始终等待所有异步操作。例如：

```ts
Deno.test({
  name: "异步操作测试",
  async fn() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});
```

此消毒器默认启用，但可以使用 `sanitizeOps: false` 进行禁用：

```ts
Deno.test({
  name: "泄漏操作测试",
  fn() {
    crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("a".repeat(100000000)),
    );
  },
  sanitizeOps: false,
});
```

### 退出消毒器

退出消毒器确保被测试的代码不会调用 `Deno.exit()`，因为这可能会导致假测试成功。

此消毒器默认启用，但可以使用 `sanitizeExit: false` 进行禁用。

```ts
Deno.test({
  name: "假成功",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// 此测试永远不会运行，因为进程在“假成功”测试期间退出
Deno.test({
  name: "失败的测试",
  fn() {
    throw new Error("该测试失败");
  },
});
```

## 快照测试

[Deno 标准库](/runtime/fundamentals/standard_library/) 包含一个 [快照模块](https://jsr.io/@std/testing/doc/snapshot/~)，允许开发者通过将值与参考快照进行比较来编写测试。这些快照是原始值的序列化表示，存储在测试文件旁边。

快照测试能够通过极少的代码捕捉到广泛的错误。在难以准确表达应该断言什么的情况下非常有用，而不需要过多的代码，或者在预期测试所做的断言经常变化的情况下也特别有帮助。
- [快照测试教程](/examples/snapshot_tutorial/)

## 测试和权限

`Deno.test` 配置中的 `permissions` 属性允许您具体拒绝权限，但不授予权限。运行测试命令时必须提供权限。当构建健壮的应用程序时，您通常需要处理权限被拒绝的情况（例如，您可能希望编写测试以检查回退是否已正确设置）。

考虑一种情况，您正在从文件中读取，您可能希望在函数没有读取权限的情况下提供一个回退值：

```ts
import { assertEquals } from "jsr:@std/assert";
import getFileText from "./main.ts";

Deno.test({
  name: "File reader gets text with permission",
  // no `permissions` means "inherit"
  fn: async () => {
    const result = await getFileText();
    console.log(result);
    assertEquals(result, "the content of the file");
  },
});

Deno.test({
  name: "File reader falls back to error message without permission",
  permissions: { read: false },
  fn: async () => {
    const result = await getFileText();
    console.log(result);
    assertEquals(result, "oops don't have permission");
  },
});
```

```sh
# Run the tests with read permission
deno test --allow-read
```

权限对象支持详细配置：

```ts
Deno.test({
  name: "permission configuration example",
  // permissions: { read: true } // Grant all read permissions and deny all others
  // OR
  permissions: {
    read: ["./data", "./config"], // Grant read to specific paths only
    write: false, // Explicitly deny write permissions
    net: ["example.com:443"], // Allow specific host:port combinations
    env: ["API_KEY"], // Allow access to specific env variables
    run: false, // Deny subprocess execution
    ffi: false, // Deny loading dynamic libraries
    hrtime: false, // Deny high-resolution time
  },
  fn() {
    // Test code that respects these permission boundaries
  },
});
```

请记住，任何在命令行中未明确授予的权限将被拒绝，无论测试配置中指定的内容是什么。
