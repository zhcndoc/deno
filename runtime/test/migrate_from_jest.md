---
title: "从 Jest 迁移"
description: "将 Jest 测试套件迁移到 deno test：通过 node:test 实现 describe/it、expect 映射、模拟函数等价物、快照测试、假定时器，以及翻译 Jest 配置。"
---

大多数 Jest 测试套件都可以迁移到 `deno test`，而无需重写测试逻辑：`node:test` 模块提供了相同的 `describe`/`it` 结构，标准库也提供了带有你已在使用的匹配器的 `expect`。变化之处主要是少量导入方式以及运行器的配置方式。

## 在 Deno 中运行相同的测试

一个典型的 Jest 测试只需要新的导入：

```ts title="cart.test.ts"
import { beforeEach, describe, it } from "node:test";
import { expect, fn } from "jsr:@std/expect";

describe("shopping cart", () => {
  let cart: string[];

  beforeEach(() => {
    cart = [];
  });

  it("starts empty", () => {
    expect(cart).toHaveLength(0);
  });

  it("notifies a listener", () => {
    const onAdd = fn();
    cart.push("apple");
    onAdd(cart.length);
    expect(onAdd).toHaveBeenCalledWith(1);
  });
});
```

```sh
$ deno test cart.test.ts
ok | 1 passed (2 steps) | 0 failed (13ms)
```

与 Jest 不同，没有任何内容会作为全局变量注入：`describe`、`it`、`expect` 和这些钩子都是显式导入的，因此每个文件都会明确表明自己使用了什么。针对 `node:test` 编写的测试也可以在 Node.js 本身中继续运行。

## 一一对应关系

| Jest                              | Deno                                                            |
| --------------------------------- | --------------------------------------------------------------- |
| `describe`, `it`, `beforeEach`, … | `node:test` (或 [`@std/testing/bdd`](/examples/bdd_tutorial/))  |
| `expect(...)` 匹配器             | `jsr:@std/expect`                                               |
| `jest.fn()`                       | 来自 `jsr:@std/expect` 的 `fn()`                                  |
| `jest.spyOn(obj, "m")`            | 来自 [`@std/testing/mock`](/runtime/test/mocking/) 的 [`spy`/`stub`] |
| `toMatchSnapshot()`               | [`assertSnapshot`](/examples/snapshot_test_tutorial/)           |
| `jest.useFakeTimers()`            | [`FakeTime`](/runtime/test/mocking/#faking-time)                |
| `npx jest`                        | `deno test`                                                     |
| `npx jest --watch`                | `deno test --watch`                                             |
| `npx jest -t "name"`              | `deno test --filter "name"`                                     |

## 翻译配置

Jest 配置大多会直接消失：TypeScript、JSX 和 ES 模块无需转换即可工作，因此 `ts-jest`、`babel-jest` 和 `transform` 条目没有对应项可迁移。文件选择迁移到 `deno.json` 中：

```json title="deno.json"
{
  "test": {
    "include": ["src/**/*.test.ts"],
    "exclude": ["src/fixtures/"]
  }
}
```

## 模块模拟

没有 `jest.mock("./module")` 的对应功能，因为 Deno 中的模块记录是不可变的。依赖它的测试通常会迁移为以下其中一种方式：

- 依赖注入：将协作者传入，并为测试提供一个
  [spy 或 stub](/runtime/test/mocking/)；
- 使用 `@std/testing/mock` 中的 `stub` 来替换模块对外暴露的对象。

这通常是迁移中唯一需要修改被测代码的部分。

## 尽可能保留 npm 包

来自 npm 的测试辅助工具仍可通过 `npm:` 规范符继续使用，例如用于 DOM 断言的 `npm:@testing-library/dom`（参见
[将 Testing Library 与 Deno 一起使用](/examples/testing_library_tutorial/)）。真正需要迁移的是测试运行器本身。

关于运行器标志、报告器和覆盖率，请参阅
[`deno test` 参考](/runtime/reference/cli/test/)。
