---
title: "快照测试"
description: "使用 @std/testing 捕获程序输出作为参考快照，在每次运行时进行比较，并通过 deno test -- --update 进行更新。"
oldUrl:
  - /runtime/manual/basics/testing/snapshot_testing/
  - /examples/snapshot_test_tutorial/
  - /examples/snapshot_tutorial/
---

快照测试会捕获你的代码输出，并在每次测试运行时将其与存储的参考版本进行比较。你不必为每个属性手写断言，而是让测试运行器一次性记录整个序列化输出，然后在输出发生变化时立即失败。这非常适合用于验证那些很大或很难手工表达的值（渲染后的 HTML、CLI 输出、API 响应结构、错误对象），或者当期望输出变化足够频繁、以至于维护手动断言变成一件麻烦事时。[Deno Standard Library](/runtime/reference/std/) 将其作为 [`@std/testing/snapshot`](https://jsr.io/@std/testing/doc/snapshot) 模块提供。

## 编写你的第一个快照测试

`assertSnapshot` 函数会序列化一个值，并将其与存储在测试文件旁边的参考快照进行比较。它接收 Deno 传递给测试函数的测试上下文 `t`，并使用它来命名快照和定位快照文件。

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("isSnapshotMatch", async (t) => {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a);
});
```

目前还没有快照存在，因此第一次运行必须创建一个。只有在以更新模式运行测试时才会写入新的快照：

```bash
deno test --allow-read --allow-write -- --update
```

关于这个命令，有两点需要注意：

- 需要 `--allow-read` 和 `--allow-write`，因为 `assertSnapshot` 会读取和写入磁盘上的快照文件。如果没有 `--allow-read`，每次调用 `assertSnapshot` 都会因权限错误而失败。如果你愿意，也可以将这两个权限范围限制到仅快照目录。
- 裸 `--` 用于分隔 `deno test` 的标志和传递给测试文件本身的参数。`--update` 标志（或其简写 `-u`）必须放在 `--` 之后，因为它是由快照模块读取的，而不是由 Deno CLI 读取的。

一旦快照存在，就可以正常运行测试。此时只需要读取权限：

```bash
deno test --allow-read
```

如果序列化后的值与存储的快照匹配，测试现在会通过；如果不匹配，则会以包含 diff 的 `AssertionError` 失败。

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
deno test --allow-read --allow-write -- --update
```

在更新模式下，任何与当前输出不匹配的快照都会被重写，任何缺失的快照都会被创建。已经匹配的快照不会被改动。你也可以用 `-u` 代替 `--update`。

更新后，在提交之前使用 `git diff` 检查 `.snap` 文件的差异。更新命令会乐于将 bug 记录为新的期望输出，因此对该 diff 进行人工审查，才是快照测试价值所在。

要通过上面的示例体验完整流程：将 `hello: "world!"` 改为 `hello: "everyone!"`，运行 `deno test --allow-read`，然后观察测试因 diff 而失败。接着运行更新命令，快照文件就会被重写以保持一致。

## 在 CI 中审查快照 diff

在 CI 中你希望验证快照，而不是更新它们，因此请在不使用 `--update` 标志且不授予写权限的情况下运行测试：

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
        run: deno test --allow-read
```

如果拉取请求更改了输出，CI 运行会失败，作者必须在本地更新快照并提交新的 `.snap` 文件。这样审查者就能在拉取请求 diff 中看到变更前后的确切输出，并确认这项变更是有意为之。

## 控制序列化和快照位置

对于默认行为不适用的情况，`assertSnapshot` 作为第三个参数接受一个选项对象：

```ts title="serializer_test.ts"
import { assertSnapshot, serialize } from "jsr:@std/testing/snapshot";
import { stripAnsiCode } from "jsr:@std/fmt/colors";

function customSerializer(actual: string) {
  return serialize(stripAnsiCode(actual));
}

Deno.test("Custom Serializer", async (t) => {
  const output = "\x1b[34mHello World!\x1b[39m";
  await assertSnapshot(t, output, {
    serializer: customSerializer,
  });
});
```

最有用的选项：

- `serializer`：一个将值转换为字符串的函数。它必须是确定性的。可用于去除 ANSI 颜色代码、用占位符替换时间戳或 UUID，或者在敏感数据写入已提交文件之前将其脱敏。
- `name`：覆盖快照键，否则默认使用测试名称。
- `dir` 和 `path`：控制快照文件写入的位置，相对于测试文件解析。
- `mode`：强制单次调用使用 `"assert"` 或 `"update"` 行为，而不受 `--update` 标志影响。

类也可以通过实现 `Symbol.for("Deno.customInspect")` 来自定义自己的序列化，因为默认序列化器是基于 [`Deno.inspect`](/api/deno/~/Deno.inspect) 构建的。有关完整选项参考和 `createAssertSnapshot` 工厂，请参阅 [`@std/testing/snapshot` API 文档](https://jsr.io/@std/testing/doc/snapshot)。

## 何时不使用快照

快照测试断言输出没有变化，而不是断言它是否正确。以下情况它并不适合：

- 很容易写出精确断言时。`assertEquals(sum, 3)` 比 `3` 的快照更能表达意图。
- 输出是非确定性的。时间戳、随机 ID 和无序集合会导致不稳定的失败，除非你使用自定义序列化器对其进行规范化。
- 输出非常大。上千行的快照在审查中很容易被机械通过，这就违背了其初衷。应当快照相关片段。
- 测试应验证行为而不是表示形式。对渲染后的字符串进行断言会将测试与格式细节耦合，而这些细节可能会因无关原因而变化。

一个好的经验法则是：在人工能够有意义地审查记录输出的地方使用快照，其余地方则使用明确的断言。

## 继续了解

- [测试概览](/runtime/test/)：内置测试运行器、断言、步骤和权限。
- [Mocking](/runtime/test/mocking/)：用于你的快照所依赖输入的 spy、stub 和伪造时间。
- [`@std/testing/snapshot` API 文档](https://jsr.io/@std/testing/doc/snapshot)：每个选项，以及用于共享默认值的 `createAssertSnapshot`。
