---
last_modified: 2026-06-25
title: "快照测试"
description: "使用 Deno 内置的测试运行器将程序输出捕获为参考快照，在每次运行时与其进行比较，并使用 deno test --update-snapshots 进行更新。"
oldUrl:
  - /runtime/manual/basics/testing/snapshot_testing/
  - /examples/snapshot_test_tutorial/
  - /examples/snapshot_tutorial/
---

快照测试会捕获你的代码输出，并在每次测试运行时将其与存储的参考版本进行比较。你无需为每个属性手动编写断言，而是让测试运行器一次记录整个序列化后的输出，然后在该输出发生变化时立即显式失败。当你想要验证的值很大，或很难手动表达时（例如渲染后的 HTML、CLI 输出、API 响应结构、错误对象），或者当期望输出变化得足够频繁，以至于维护手动断言变成一件麻烦事时，这种方式非常理想。Deno 内置的测试运行器通过测试上下文上的 `t.assertSnapshot` 方法提供快照测试，无需导入或依赖。

## 编写你的第一个快照测试

Deno 传递给每个测试的测试上下文 `t` 都有一个 `assertSnapshot`
方法。它会序列化一个值，并将其与存储在测试文件旁边的参考快照进行比较，
使用测试名称作为快照的键：

```ts title="example_test.ts"
Deno.test("isSnapshotMatch", async (t) => {
  const a = {
    hello: "world!",
    example: 123,
  };
  await t.assertSnapshot(a);
});
```

目前还没有快照，所以第一次运行必须创建一个。快照使用
`--update-snapshots` 标志（简写 `-u`）创建和更新：

```bash
deno test --update-snapshots
```

运行器会自行管理快照文件，因此默认位置的快照不需要读取或写入权限。
一旦快照存在，就正常运行测试；如果序列化后的值仍然匹配，测试就会通过，
如果不匹配，则会失败并显示带有差异的 `AssertionError`：

```bash
deno test
```

## 读取快照文件

快照会写入测试文件旁边的 `__snapshots__` 目录中，文件名为与测试模块同名的 `.snap` 文件。对于上面的示例，文件是 `__snapshots__/example_test.ts.snap`：

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

每个条目都以测试名称加上计数器作为键，因此一个多次调用 `assertSnapshot` 的测试会生成 `isSnapshotMatch 1`、`isSnapshotMatch 2`，依此类推。其值是使用 [`Deno.inspect`](/api/deno/~/Deno.inspect) 对你的数据进行序列化后的结果，对象键会按字母顺序排序。快照文件是纯 TypeScript，因此在代码审查中很容易阅读。

将快照文件提交到版本控制中。这样一来，快照变更就会与导致这些变更的代码改动一起被审查，而且任何拉取你分支的人都能在本地不重新生成快照的情况下通过测试。

## 更新快照

这是你最常使用的工作流部分。当你有意更改行为并且快照测试开始失败时，或者当你添加新的 `assertSnapshot` 调用时，请以更新模式重新运行测试：

```bash
deno test --update-snapshots
```

任何与当前输出不匹配的快照都会被重写，任何缺失的快照都会被创建，而已经匹配的快照则保持不变。运行摘要会报告已更新或已移除的快照数量。

更新后，在提交之前使用 `git diff` 检查 `.snap` 文件的差异。更新命令会乐于将 bug 记录为新的期望输出，因此对该 diff 进行人工审查，才是快照测试价值所在。

要通过上面的示例尝试完整流程：将 `hello: "world!"` 改为 `hello: "everyone!"`，运行 `deno test`，然后观察测试因 diff 而失败。接着运行 `deno test --update-snapshots`，快照文件就会被重写以保持一致。

## 在 CI 中验证快照

在 CI 中，你希望验证快照，而不是更新它们，所以请在不使用
`--update-snapshots` 的情况下运行测试：

```yaml title=".github/workflows/test.yml"
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - name: Run tests
        run: deno test
```

如果拉取请求更改了输出，CI 运行会失败，作者必须在本地更新快照并提交新的 `.snap` 文件。这样审查者就能在拉取请求 diff 中看到变更前后的确切输出，并确认这项变更是有意为之。

## 控制序列化和快照位置

`t.assertSnapshot` 在默认设置不适用时，可以接受一个选项对象作为第二个参数：

```ts title="serializer_test.ts"
import { stripAnsiCode } from "jsr:@std/fmt/colors";

Deno.test("自定义序列化器", async (t) => {
  const output = "\x1b[34mHello World!\x1b[39m";
  await t.assertSnapshot(output, {
    serializer: (actual) => stripAnsiCode(actual),
  });
});
```

最有用的选项：

- `serializer`：一个将值转换为字符串的函数。它必须是确定性的。可用于去除 ANSI 颜色代码、用占位符替换时间戳或 UUID，或者在敏感数据写入提交文件之前将其脱敏。
- `name`：覆盖快照键名，否则默认为测试名称。
- `dir` 和 `path`：控制快照文件的写入位置，按相对于测试文件的路径解析。自定义位置需要读写权限。
- `mode`：对单次调用强制使用 `"assert"` 或 `"update"` 行为，不受 `--update-snapshots` 标志影响。

类可以通过实现 `Symbol.for("Deno.customInspect")` 来自定义自身的序列化，因为默认序列化器是基于 [`Deno.inspect`](/api/deno/~/Deno.inspect) 构建的。

## 使用 node:test 的快照

如果你使用 [`node:test`](/runtime/reference/cli/test/) 而不是
[`Deno.test`](/api/deno/~/Deno.test) 编写测试，也可以使用它自己的快照断言。
`t.assert.fileSnapshot` 会序列化一个值，第一次运行时将其写入一个命名文件，
并在后续运行时与该文件进行比较：

```ts title="node_snapshot_test.ts"
import { test } from "node:test";

test("matches the saved output", (t) => {
  t.assert.fileSnapshot({ id: 1, name: "ada" }, "./__snapshots__/user.json");
});
```

有关完整的快照 API，请参阅
[Node.js test runner 文档](https://nodejs.org/api/test.html#snapshot-testing)。

## 何时不使用快照

快照测试断言输出没有变化，而不是断言它是否正确。以下情况它并不适合：

- 很容易写出精确断言时。`assertEquals(sum, 3)` 比 `3` 的快照更能表达意图。
- 输出是非确定性的。时间戳、随机 ID 和无序集合会导致不稳定的失败，除非你使用自定义序列化器对其进行规范化。
- 输出非常大。上千行的快照在审查中很容易被机械通过，这就违背了其初衷。应当快照相关片段。
- 测试应验证行为而不是表示形式。对渲染后的字符串进行断言会将测试与格式细节耦合，而这些细节可能会因无关原因而变化。

一个好的经验法则是：在人工能够有意义地审查记录输出的地方使用快照，其余地方则使用明确的断言。

## 继续了解

- [测试概览](/runtime/test/): 内置测试运行器、断言、
  步骤和权限。
- [模拟](/runtime/test/mocking/): 针对你的快照所依赖输入的间谍、存根和伪造时间。
