---
title: "快照测试"
oldurl: /examples/snapshot_tutorial/
description: "了解如何在 Deno 中使用快照测试将输出与记录的参考值进行比较，从而更容易检测代码中的意外更改"
url: "/examples/snapshot_test_tutorial/"
---

快照测试是一种测试技术，它会捕获代码的输出，并将其与存储的参考版本进行比较。与其为每个属性手动编写断言，不如让测试运行器记录整个输出结构，这样更容易检测任何意外的更改。

[Deno 标准库](/runtime/reference/std/) 中有一个
[快照模块](https://jsr.io/@std/testing/doc/snapshot)，它使开发者能够编写将某个值与参考快照进行断言的测试。这个参考快照是原始值的序列化表示，并与测试文件存储在一起。

## 基本用法

`assertSnapshot` 函数会为一个值创建快照，并将其与参考快照进行比较，参考快照存储在测试文件旁边的 `__snapshots__` 目录中。

要创建初始快照（或更新现有快照），请在 `deno test` 命令中使用 `-- --update` 标志。

### 基本快照示例

下面的示例展示了如何将快照库与 `Deno.test` API 一起使用。我们可以对一个包含字符串和数字属性的基础对象进行快照测试。

`assertSnapshot(t, a)` 函数会将对象与存储的快照进行比较。`t` 参数是 Deno 提供的测试上下文，快照函数会使用它来确定测试名称和用于存储快照的位置。

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

你需要授予读写文件权限，Deno 才能写入快照文件，然后读取它来测试断言。如果这是你第一次运行测试，并且你还没有快照，请添加 `--update` 标志：

```bash
deno test --allow-read --allow-write -- --update
```

如果你已经有了快照文件，可以使用以下命令运行测试：

```bash
deno test --allow-read
```

测试会将对象的当前输出与存储的快照进行比较。如果匹配，测试通过；如果不同，测试失败。

快照文件如下所示：

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

你可以修改测试，将 `hello` 字符串改为 `"everyone!"`，然后再次使用 `deno test --allow-read` 运行测试。这一次 `assertSnapshot` 函数会抛出 `AssertionError`，导致测试失败，因为测试期间创建的快照与快照文件中的内容不匹配。

## 更新快照

当你向测试套件中添加新的快照断言，或者有意做出会导致快照失败的更改时，可以通过以更新模式运行快照测试来更新快照。运行测试时，可以通过传入 `--update` 或 `-u` 标志作为参数来启用更新模式。当传入此标志时，任何不匹配的快照都会被更新。

```bash
deno test --allow-read --allow-write -- --update
```

:::note

只有在存在 `--update` 标志时，才会创建新快照。

:::

## 权限

运行快照测试时，必须启用 `--allow-read` 权限，否则任何对 `assertSnapshot` 的调用都会因为权限不足而失败。此外，在更新快照时，必须启用 `--allow-write` 权限，因为更新快照文件需要它。

`assertSnapshot` 函数只会尝试读取和写入快照文件。因此，如有需要，`--allow-read` 和 `--allow-write` 的允许列表可以仅限制为现有的快照文件。

## 版本控制

快照测试最适合与其他代码更改一起提交快照文件的变更。这样可以将参考快照的变更与引起这些变更的代码改动一起审查，并确保其他人在拉取你的更改后，他们的测试可以通过，而无需在本地更新快照。

## 选项

`assertSnapshot` 函数可以与一个 `options` 对象一起调用，这提供了更大的灵活性，并支持一些非标准用例：

```ts
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("isSnapshotMatch", async (t) => {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a, {/*custom options go here*/});
});
```

### serializer

当你使用 `assertSnapshot` 运行测试时，你正在测试的数据需要转换为一种字符串格式，以便可以写入快照文件（在创建或更新快照时）并与现有快照进行比较（在验证时）。这个过程称为序列化。

`serializer` 选项允许你提供一个自定义序列化函数。这个自定义函数将由 `assertSnapshot` 调用，并接收被断言的值。你的自定义函数必须：

1. 返回一个 `string`
2. 是确定性的（给定相同输入时，它总会产生相同的输出）。

下面的代码展示了一个用于快照测试的自定义序列化函数的实际示例。这个序列化器使用 Deno 标准库中的 [`stripColour`](https://jsr.io/@std/fmt/doc/colors) 字符串格式化器从字符串中移除所有 ANSI 颜色代码。

```ts title="example_test.ts"
import { assertSnapshot, serialize } from "jsr:@std/testing/snapshot";
import { stripColor } from "jsr:@std/fmt/colors";

/**
 * 序列化 `actual` 并移除 ANSI 转义代码。
 */
function customSerializer(actual: string) {
  return serialize(stripColor(actual));
}

Deno.test("Custom Serializer", async (t) => {
  const output = "\x1b[34mHello World!\x1b[39m";
  await assertSnapshot(t, output, {
    serializer: customSerializer,
  });
});
```

```ts title="__snapshots__/example_test.ts.snap"
snapshot = {};

snapshot[`Custom Serializer 1`] = `"Hello World!"`;
```

自定义序列化器在多种场景中都很有用：

- 移除无关的格式（例如上面显示的 ANSI 代码）并提高可读性
- 处理非确定性数据。时间戳、UUID 或随机值可以替换为占位符
- 掩盖或移除不应保存在快照中的敏感数据
- 使用自定义格式以特定领域的方式呈现复杂对象

### 使用 `Deno.customInspect` 进行序列化

由于默认序列化器在底层使用了 `Deno.inspect`，如果需要，你可以将属性 `Symbol.for("Deno.customInspect")` 设置为一个自定义序列化函数：

```ts title="example_test.ts"
// example_test.ts
import { assertSnapshot } from "jsr:@std/testing/snapshot";

class HTMLTag {
  constructor(
    public name: string,
    public children: Array<HTMLTag | string> = [],
  ) {}

  public render(depth: number) {
    const indent = "  ".repeat(depth);
    let output = `${indent}<${this.name}>\n`;
    for (const child of this.children) {
      if (child instanceof HTMLTag) {
        output += `${child.render(depth + 1)}\n`;
      } else {
        output += `${indent}  ${child}\n`;
      }
    }
    output += `${indent}</${this.name}>`;
    return output;
  }

  public [Symbol.for("Deno.customInspect")]() {
    return this.render(0);
  }
}

Deno.test("页面 HTML 树", async (t) => {
  const page = new HTMLTag("html", [
    new HTMLTag("head", [
      new HTMLTag("title", [
        "简单的 SSR 示例",
      ]),
    ]),
    new HTMLTag("body", [
      new HTMLTag("h1", [
        "简单的 SSR 示例",
      ]),
      new HTMLTag("p", [
        "这是一个示例，展示如何使用 Deno.customInspect 来快照一个中间的 SSR 表示",
      ]),
    ]),
  ]);

  await assertSnapshot(t, page);
});
```

这个测试将生成如下快照。

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`页面 HTML 树 1`] = `
<html>
  <head>
    <title>
      简单的 SSR 示例
    </title>
  </head>
  <body>
    <h1>
      简单的 SSR 示例
    </h1>
    <p>
      这是一个示例，展示如何使用 Deno.customInspect 来快照一个中间的 SSR 表示
    </p>
  </body>
</html>
`;
```

相比之下，当我们移除 `Deno.customInspect` 方法时，测试会生成如下快照：

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Page HTML Tree 1`] = `HTMLTag {
  children: [
    HTMLTag {
      children: [
        HTMLTag {
          children: [
            "Simple SSR Example",
          ],
          name: "title",
        },
      ],
      name: "head",
    },
    HTMLTag {
      children: [
        HTMLTag {
          children: [
            "Simple SSR Example",
          ],
          name: "h1",
        },
        HTMLTag {
          children: [
            "This is an example of how Deno.customInspect could be used to snapshot an intermediate SSR representation",
          ],
          name: "p",
        },
      ],
      name: "body",
    },
  ],
  name: "html",
}`;
```

你可以看到第二个快照的可读性要差得多。这是因为：

1. 键按字母顺序排序，因此元素名称显示在其子元素之后
2. 它包含了很多额外信息，导致快照长度超过两倍
3. 它并不是该数据所代表的 HTML 的准确序列化结果

请注意，在这个示例中，通过调用以下代码也可以达到相同效果：

```ts
await assertSnapshot(t, page.render(0));
```

不过，这取决于你选择公开的公共 API，这样做可能并不现实。

还值得考虑的是，这可能会对快照测试之外的内容产生影响。例如，`Deno.customInspect` 在调用 `console.log` 时（以及某些其他情况）也用于序列化对象。这可能是你希望的，也可能不是。

### `dir` 和 `path`

`dir` 和 `path` 选项允许你控制快照文件将保存到哪里以及从哪里读取。这些可以是绝对路径或相对路径。如果是相对路径，它们将相对于测试文件进行解析。

例如，如果你的测试文件位于 `/path/to/test.ts`，并且 `dir` 选项设置为 `snapshots`，那么快照文件将被写入 `/path/to/snapshots/test.ts.snap`。

- `dir` 允许你指定快照目录，同时仍然使用快照文件名的默认格式。

- `path` 允许你指定快照文件的目录和文件名。

如果你的测试文件位于 `/path/to/test.ts`，并且 `path` 选项设置为 `snapshots/test.snapshot`，那么快照文件将被写入 `/path/to/snapshots/test.snapshot`。

:::note

如果同时指定了 `dir` 和 `path`，`dir` 选项将被忽略，而 `path` 选项将正常处理。

:::

### `mode`

`mode` 选项控制 `assertSnapshot` 的行为，不受命令行标志影响，并且有两个设置：`assert` 或 `update`：

- `assert`：始终只进行比较，忽略任何 `--update` 或 `-u` 标志。如果快照不匹配，测试将以 `AssertionError` 失败。

- `update`：始终更新快照。任何不匹配的快照都会在测试完成后更新。

当你需要在同一个测试套件中使用不同的快照行为时，这个选项很有用：

```ts
// 创建一个新快照或验证现有快照
await assertSnapshot(t, stableComponent);

// 无论命令行标志如何，始终更新此快照
await assertSnapshot(t, experimentalComponent, {
  mode: "update",
  name: "experimental feature",
});

// 无论命令行标志如何，始终验证但绝不更新此快照
await assertSnapshot(t, criticalComponent, {
  mode: "assert",
  name: "critical feature",
});
```

### `name`

快照的名称。如果未指定，则会使用测试步骤的名称。

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("isSnapshotMatch", async (t) => {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a, {
    name: "测试名称",
  });
});
```

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`测试名称 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

当使用相同的 `name` 值多次运行 `assertSnapshot` 时，后缀会像往常一样递增。即 `Test Name 1`、`Test Name 2`、`Test Name 3` 等。

### `msg`

用于设置自定义错误消息。这将覆盖默认错误消息，默认错误消息包含失败快照的 diff：

```ts
Deno.test("自定义错误消息示例", async (t) => {
  const userData = {
    name: "John Doe",
    role: "admin",
  };

  await assertSnapshot(t, userData, {
    msg:
      "用户数据结构发生了意外变化。请确认你的修改是有意为之。",
  });
});
```

当快照失败时，你看到的将不是默认的 diff 消息，而是你自定义的错误消息。

## 测试不同数据类型

快照测试适用于各种数据类型和结构：

```ts
Deno.test("snapshot various types", async (t) => {
  // 数组
  await assertSnapshot(t, [1, 2, 3, "four", { five: true }]);

  // 复杂对象
  await assertSnapshot(t, {
    user: { name: "Test", roles: ["admin", "user"] },
    settings: new Map([["theme", "dark"], ["language", "en"]]),
  });

  // 错误对象
  await assertSnapshot(t, new Error("Test error message"));
});
```

## 处理异步代码

在测试异步函数时，确保在将结果传递给快照之前先等待结果：

```ts
Deno.test("async function test", async (t) => {
  const fetchData = async () => {
    // 模拟 API 调用
    return { success: true, data: ["item1", "item2"] };
  };

  const result = await fetchData();
  await assertSnapshot(t, result);
});
```

## 最佳实践

### 保持快照简洁

避免捕获对测试不必要的大型数据结构。只关注相关内容。

### 使用描述性的测试名称

使用能清楚表明测试内容的描述性测试名称：

```ts
Deno.test(
  "渲染包含所有必需字段的用户资料卡",
  async (t) => {
    // ... 测试代码
    await assertSnapshot(t, component);
  },
);
```

### 在代码评审中检查快照

在代码评审过程中始终检查快照更改，以确保它们代表的是有意的变更，而不是回归。

### 快照组织

对于较大的项目，可以考虑按功能或组件组织快照：

```ts
await assertSnapshot(t, component, {
  path: `__snapshots__/components/${componentName}.snap`,
});
```

## 在 CI/CD 中进行快照测试

### GitHub Actions 示例

在 CI 环境中运行快照测试时，通常你会希望验证现有快照，而不是更新它们：

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

对于有意更新快照的拉取请求，审阅者应在合并前确认这些更改是符合预期的。

## 实际示例

### 测试 HTML 输出

使用快照测试 HTML 输出对于 Web 应用特别有用，因为你希望确保组件渲染出预期的标记。这种方法可以帮助你捕捉 HTML 结构、属性或内容中可能影响 UI 组件视觉外观或功能的意外变化。

通过捕获 HTML 输出的快照，你可以：

- 验证 UI 组件在不同的 props/数据下是否正确渲染
- 在重构渲染逻辑时检测回归
- 记录组件预期的输出格式

```ts
Deno.test("HTML rendering", async (t) => {
  const renderComponent = () => {
    return `<div class="card">
      <h2>用户资料</h2>
      <p>用户名：testuser</p>
    </div>`;
  };

  await assertSnapshot(t, renderComponent());
});
```

### 测试 API 响应

在构建与 API 交互的应用时，快照测试有助于确保 API 响应的结构和格式保持一致。这对于以下方面尤为重要：

- 在更新 API 集成时保持向后兼容
- 验证你的 API 响应解析逻辑是否正常工作
- 为团队协作记录 API 响应的预期形状
- 检测可能破坏应用的 API 响应中的意外变化

```ts
Deno.test("API response format", async (t) => {
  const mockApiResponse = {
    status: 200,
    data: {
      users: [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ],
      pagination: { page: 1, total: 10 },
    },
  };

  await assertSnapshot(t, mockApiResponse);
});
```

🦕 快照测试是一种强大的技术，它通过让你在不编写详细断言的情况下捕获并验证复杂输出，来补充传统的单元测试。通过将快照测试纳入你的测试策略，你可以捕捉意外变化、记录预期行为，并构建更具弹性的应用。
