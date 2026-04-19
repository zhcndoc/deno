---
last_modified: 2025-09-10
title: "编写测试"
description: "学习测试设置和结构、断言、异步测试、模拟、测试夹具以及代码覆盖率等关键概念"
url: /examples/testing_tutorial/
---

在软件开发中，测试至关重要：用来确保你的代码按预期工作，并在你进行修改后持续保持正确性。测试会验证你的函数、模块和应用程序行为是否正确，能否恰当地处理边界情况，并维持预期的性能特征。

## 为什么测试很重要

在代码进入生产环境之前，对代码进行测试可以帮助你在其到达生产前发现漏洞、问题或回归，从而节省时间和资源。测试也能用来帮助你规划应用程序的逻辑：它们可以作为一种人类可读的说明，描述你的代码应该如何被使用。

Deno 提供了[内置的测试能力](/runtime/fundamentals/testing/)，使你能够在项目中轻松实现健壮的测试实践。

## 使用 `Deno.test` 编写测试

在 Deno 中定义测试非常简单——使用 `Deno.test()` 函数将你的测试注册到测试运行器中。该函数既可以接受测试名称和函数，也可以接受带有更多详细选项的配置对象。所有符合诸如 `*_test.{ts,js,mjs,jsx,tsx}` 或 `*.test.{ts,js,mjs,jsx,tsx}` 这类命名模式的文件中的测试函数，都会在你运行 `deno test` 命令时被自动发现并执行。

下面是定义测试的基本方式：

```ts
// 带名称和函数的基础测试
Deno.test("my first test", () => {
  // 你的测试代码放在这里
});

// 带配置选项的测试
Deno.test({
  name: "my configured test",
  fn: () => {
    // 你的测试代码放在这里
  },
  ignore: false, // 可选：设为 true 以跳过此测试
  only: false, // 可选：设为 true 仅运行此测试
  permissions: { // 可选：指定所需权限
    read: true,
    write: false,
  },
});
```

### 一个简单的示例测试

我们从一个简单的测试开始。创建一个名为 `main_test.ts` 的文件，在其中我们将使用 Deno 的测试 API 以及来自 [Deno 标准库](https://jsr.io/@std) 的 `assertEquals` 函数来测试一个基础的加法操作。

我们使用 `Deno.test`，并提供一个能描述该测试将做什么的名称：

```ts title="main_test.ts"
// hello_test.ts
import { assertEquals } from "jsr:@std/assert";

// 我们想要测试的函数
function add(a: number, b: number): number {
  return a + b;
}

Deno.test("basic addition test", () => {
  // Arrange - 设置测试数据
  const a = 1;
  const b = 2;

  // Act - 调用被测试的函数
  const result = add(a, b);

  // Assert - 验证结果是否是我们期望的值
  assertEquals(result, 3);
});
```

要运行这个测试，使用 `deno test` 命令：

```sh
deno test hello_test.ts
```

你应该会看到输出，表明你的测试通过了：

```
running 1 test from ./hello_test.ts
basic addition test ... ok (2ms)

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (2ms)
```

试着修改函数实现，使测试失败：

```ts
function add(a: number, b: number): number {
  return a - b; // 从加法改为减法
}
```

你会看到一条清晰地展示出哪里出错的错误信息：

```sh
running 1 test from ./hello_test.ts
basic addition test ... FAILED (3ms)

failures:

basic addition test => ./hello_test.ts:12:3
error: AssertionError: Values are not equal:
    
    [Diff] Actual / Expected
    
    -   -1
    +   3

  at assertEquals (https://jsr.io/@std/assert@0.218.2/assert_equals.ts:31:9)
  at Object.fn (file:///path/to/hello_test.ts:12:3)
  at asyncOpSanitizer (ext:core/01_core.js:199:13)
  at Object.sanitizeOps (ext:core/01_core.js:219:15)
  at runTest (ext:test/06_test_runner.js:319:29)
  at test (ext:test/06_test_runner.js:593:7)

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out (3ms)
```

这种明确的反馈能帮助你快速定位并修复代码中的问题。

## 测试结构与组织

Deno 会自动查找并运行所有符合命名模式的测试，例如 `*_test.{ts,js,mjs,jsx,tsx}` 或 `*.test.{ts,js,mjs,jsx,tsx}`。组织测试文件的方式有很多。我们建议将单元测试与其对应的代码放在一起，并将集成测试和配置放在一个 `tests` 目录中。这使你能立即发现单元测试并简化导入，同时还能保持不同类型测试之间的分离。

下面是一个你可能如何用测试来组织项目的示例结构：

```sh
my-deno-project/
├── src/
│   ├── models/
│   │   ├── user.ts
│   │   ├── user_test.ts          // user 模型的单元测试
│   │   ├── product.ts
│   │   └── product_test.ts       // product 模型的单元测试
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── auth-service_test.ts  // auth 服务的单元测试
│   │   ├── data-service.ts
│   │   └── data-service_test.ts  // data 服务的单元测试
│   └── utils/
│       ├── helpers.ts
│       └── helpers_test.ts       // helpers 的单元测试
├── tests/
│   ├── integration/              // 集成测试目录
│   │   ├── api_test.ts           // 测试 API 端点
│   │   └── db_test.ts            // 测试数据库交互
│   ├── e2e/                      // 端到端测试
│   │   └── user_flow_test.ts     // 测试完整的用户工作流
│   └── fixtures/                 // 共享的测试数据与工具
│       ├── test_data.ts          // 各测试间共享的测试数据
│       └── setup.ts              // 通用的设置函数
├── main.ts
└── deno.json                     // 项目配置
```

这种结构为测试配置提供了一个集中位置，同时仍能保留将单元测试与相关文件并置的好处。使用这种结构，你可以：

```sh
# 运行所有测试
deno test

# 只运行单元测试
deno test src/

# 只运行集成测试
deno test tests/integration/

# 运行特定模块的测试
deno test src/models/

# 运行特定的测试文件
deno test src/models/user_test.ts
```

## 断言

断言是高效测试的构建基块，使你能够验证代码是否按预期运行。它们会检查某个特定条件是否为真；如果不是，就会抛出错误，从而导致测试失败。良好的断言应该清晰、具体，并能在测试失败时帮助你准确定位哪里出了问题。

Deno 的核心库不包含断言，但你可以从[ Deno 标准库 ](https://jsr.io/@std/assert)中导入它们：

```ts
import {
  assertArrayIncludes, // 检查数组是否包含某个值
  assertEquals, // 检查值是否相等
  assertExists, // 检查值是否不是 null 或 undefined
  assertMatch, // 检查字符串是否匹配正则模式
  assertNotEquals, // 检查值是否不相等
  assertObjectMatch, // 检查对象是否具有预期属性
  assertRejects, // 检查 Promise 是否会拒绝（reject）
  assertStrictEquals, // 检查值是否严格相等（===）
  assertStringIncludes, // 检查字符串是否包含子字符串
  assertThrows, // 检查函数是否会抛出错误
} from "jsr:@std/assert";

Deno.test("assertion examples", () => {
  // 基础断言
  assertEquals(1 + 1, 2);
  assertNotEquals("hello", "world");
  assertExists("Hello");

  // 字符串断言
  assertStringIncludes("Hello, world!", "world");
  assertMatch("deno@1.0.0", /^deno@\d+\.\d+\.\d+$/);

  // 对象断言
  assertObjectMatch(
    { name: "Jane", age: 25, city: "Tokyo" },
    { name: "Jane" }, // 只检查指定的属性
  );

  // 严格相等（类型 + 值）
  assertStrictEquals("deno", "deno");

  // 错误断言
  assertThrows(
    () => {
      throw new Error("Something went wrong");
    },
    Error,
    "Something went wrong",
  );
});
```

如果你更喜欢流式断言（类似 Jest 用户熟悉的方式），你可以使用 `expect` 模块：

```ts
import { expect } from "jsr:@std/expect";

Deno.test("expect style assertions", () => {
  // 基础匹配器
  expect(5).toBe(5);
  expect({ name: "deno" }).toEqual({ name: "deno" });

  // 集合匹配器
  expect([1, 2, 3]).toContain(2);

  // 真值性匹配器
  expect(true).toBeTruthy();
  expect(0).toBeFalsy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();

  // 数值匹配器
  expect(100).toBeGreaterThan(99);
  expect(1).toBeLessThan(2);

  // 字符串匹配器
  expect("Hello world").toMatch(/world/);

  // 函数/错误匹配器
  expect(() => {
    throw new Error("fail");
  }).toThrow();
});
```

### 真实世界示例

下面是一个更贴近实际的示例：测试一个处理用户数据的函数。

```ts
// user_processor.ts
export function validateUser(user: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!user.name || typeof user.name !== "string") {
    errors.push("Name is required and must be a string");
  }

  if (!user.email || !user.email.includes("@")) {
    errors.push("Valid email is required");
  }

  if (
    user.age !== undefined && (typeof user.age !== "number" || user.age < 18)
  ) {
    errors.push("Age must be a number and at least 18");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// user_processor_test.ts
import { assertEquals } from "jsr:@std/assert";
import { validateUser } from "./user_processor.ts";

Deno.test("validateUser", async (t) => {
  await t.step("should validate a correct user object", () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };

    const result = validateUser(user);
    assertEquals(result.valid, true);
    assertEquals(result.errors.length, 0);
  });

  await t.step("should return errors for invalid user", () => {
    const user = {
      name: "",
      email: "invalid-email",
      age: 16,
    };

    const result = validateUser(user);
    assertEquals(result.valid, false);
    assertEquals(result.errors.length, 3);
    assertEquals(result.errors[0], "Name is required and must be a string");
    assertEquals(result.errors[1], "Valid email is required");
    assertEquals(result.errors[2], "Age must be a number and at least 18");
  });

  await t.step("should handle missing properties", () => {
    const user = {
      name: "Jane Doe",
      // email and age missing
    };

    const result = validateUser(user);
    assertEquals(result.valid, false);
    assertEquals(result.errors.length, 1);
    assertEquals(result.errors[0], "Valid email is required");
  });
});
```

## 异步测试

Deno 能够自然地处理异步测试。只需让你的测试函数标记为 `async`，并使用
`await`：

```ts
import { assertEquals } from "jsr:@std/assert";

Deno.test("异步测试示例", async () => {
  const response = await fetch("https://deno.land");
  const status = response.status;
  assertEquals(status, 200);
});
```

### 测试异步函数

当你测试返回 Promise 的函数时，你应该始终等待其结果：

```ts
// async-function.ts
export async function fetchUserData(userId: string) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

// async-function_test.ts
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { fetchUserData } from "./async-function.ts";

Deno.test("fetchUserData 成功", async () => {
  // 为测试模拟 fetch 函数
  globalThis.fetch = async (url: string) => {
    const data = JSON.stringify({ id: "123", name: "Test User" });
    return new Response(data, { status: 200 });
  };

  const userData = await fetchUserData("123");
  assertEquals(userData.id, "123");
  assertEquals(userData.name, "Test User");
});

Deno.test("fetchUserData 失败", async () => {
  // 模拟错误以模拟失败场景
  globalThis.fetch = async (url: string) => {
    return new Response("Not Found", { status: 404 });
  };

  await assertRejects(
    async () => await fetchUserData("nonexistent"),
    Error,
    "Failed to fetch user: 404",
  );
});
```

## 测试中的 Mock

Mock 是一种用于将被测代码与其依赖隔离开来的关键技术。Deno 提供内置工具以及第三方库来创建 mock。

### 基础 Mock

你可以通过
[将函数或对象替换为你自己的实现](/examples/mocking_tutorial/)，来创建简单的 mock。这使你能够控制依赖的行为，并测试你的代码如何与它们交互。

```ts
// 一个包含我们想要 mock 的函数的模块示例
const api = {
  fetchData: async () => {
    const response = await fetch("https://api.example.com/data");
    return response.json();
  },
};

// 在你的测试文件中
Deno.test("基础 mocking 示例", async () => {
  // 保存原始函数
  const originalFetchData = api.fetchData;

  // 替换为 mock 实现
  api.fetchData = async () => {
    return { id: 1, name: "Test Data" };
  };

  try {
    // 使用 mock 进行测试
    const result = await api.fetchData();
    assertEquals(result, { id: 1, name: "Test Data" });
  } finally {
    // 还原原始函数
    api.fetchData = originalFetchData;
  }
});
```

### 使用 Spy 函数

Spy 可以在不改变其行为的情况下跟踪函数是否被调用：

```ts
import { spy } from "jsr:@std/testing/mock";

Deno.test("spy 示例", () => {
  // 在 console.log 上创建 spy
  const consoleSpy = spy(console, "log");

  // 调用我们正在监视的函数
  console.log("Hello");
  console.log("World");

  // 验证函数是否被正确调用
  assertEquals(consoleSpy.calls.length, 2);
  assertEquals(consoleSpy.calls[0].args, ["Hello"]);
  assertEquals(consoleSpy.calls[1].args, ["World"]);

  // 还原原始函数
  consoleSpy.restore();
});
```

如需更高级的 mock 技术，请查看我们
[关于 Deno 中 mocking 的专门指南](/examples/mocking_tutorial/)。

## 测试 Hook（钩子）

Deno 提供测试 Hook，用于运行初始化和清理代码。下面是一个简单示例：使用 `beforeEach` 来确保测试之间拥有干净的状态：

```ts
import { assertEquals } from "jsr:@std/assert";

let testData: string[] = [];

Deno.test.beforeEach(() => {
  testData = ["initial", "data"];
});

Deno.test("第一个测试", () => {
  testData.push("first");
  assertEquals(testData.length, 3);
});

Deno.test("第二个测试", () => {
  testData.push("second");
  assertEquals(testData.length, 3); // 使用 beforeEach 清理状态
});
```

有关所有可用 Hook（`beforeAll`、`beforeEach`、
`afterEach`、`afterAll`）的完整信息，请参阅
[测试文档](/runtime/fundamentals/testing/#test-hooks)。

## 覆盖率（Coverage）

代码覆盖率是一项指标，用于帮助你了解你的代码有多少被测试到了。它衡量在测试过程中执行了你代码的哪些行、哪些函数以及哪些分支，从而让你洞察可能缺少适当测试的区域。

覆盖率分析可以帮助你：

- 识别未测试过的代码部分
- 确保关键路径都有测试
- 在做出变更时防止回归
- 随时间衡量测试进度

:::note

高覆盖率并不保证高质量的测试。它只表明执行了哪些代码，而不是断言是否有意义，或者边界情况是否处理得正确。

:::

Deno 提供内置的覆盖率工具，帮助你分析测试覆盖情况。要收集覆盖率信息：

```bash
deno test --coverage=coverage_dir
```

这会在指定目录中生成覆盖率数据（此处为 `coverage_dir`）。要查看可读性更强的报告：

```bash
deno coverage coverage_dir
```

你会看到类似如下的输出：

```sh
file:///projects/my-project/src/utils.ts 85.7% (6/7)
file:///projects/my-project/src/models/user.ts 100.0% (15/15)
file:///projects/my-project/src/services/auth.ts 78.3% (18/23)

total: 87.5% (39/45)
```

如需更详细的洞察，你也可以生成 HTML 报告：

```bash
deno coverage --html coverage_dir
```

这会在指定目录中创建一个交互式的 HTML 报告，准确显示哪些行被覆盖、哪些没有被覆盖。

默认情况下，覆盖率工具会自动排除：

- 测试文件（匹配如 `test.ts` 或 `test.js` 之类的模式）
- 远程文件（不以 `file:` 开头的文件）

这可确保你的覆盖率报告聚焦于你的应用代码，而不是测试文件或外部依赖。

### 覆盖率配置（Coverage Configuration）

你可以通过使用 `--exclude` 标志从覆盖率报告中排除文件：

```bash
deno coverage --exclude="test_,vendor/,_build/,node_modules/" coverage_dir
```

### 与 CI 集成

在持续集成环境中，你可能希望强制执行最低覆盖率门槛：

```yaml
# 在你的 GitHub Actions 工作流中
- name: Run tests with coverage
  run: deno test --coverage=coverage_dir

- name: Check coverage meets threshold
  run: |
    COVERAGE=$(deno coverage coverage_dir | grep "total:" | grep -o '[0-9]\+\.[0-9]\+')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Test coverage is below 80%: $COVERAGE%"
      exit 1
    fi
```

当你进行覆盖率相关的工作时，请记得设定现实的目标：在确保质量的前提下，争取高覆盖率，而不是仅仅追求超过 100%。

## 与其他测试框架的对比

如果你来自其他 JavaScript 测试框架，下面是 Deno 的测试能力与它们的对比方式：

| 功能         | Deno             | Jest                   | Mocha                      | Jasmine               |
| ------------- | ---------------- | ---------------------- | -------------------------- | --------------------- |
| 设置         | 内置             | 需要安装              | 需要安装                 | 需要安装             |
| 语法         | `Deno.test()`    | `test()`, `describe()` | `it()`, `describe()`       | `it()`, `describe()`  |
| 断言         | 来自 std 库     | 内置 expect           | 需要断言库               | 内置 expect           |
| Mock         | 来自 std 库     | 内置 jest.mock()      | 需要 sinon 或类似工具    | 内置 spies            |
| 异步支持     | 原生             | 需要特殊处理          | 支持 Promise              | 支持 Promise          |
| 文件监视     | `--watch` 参数  | watch 模式             | 需要 nodemon              | 需要额外工具         |
| 代码覆盖率   | 内置             | 内置                   | 需要 istanbul             | 需要 istanbul         |

### 测试风格对比

**Deno：**

```ts
import { assertEquals } from "jsr:@std/assert";

Deno.test("add function", () => {
  assertEquals(1 + 2, 3);
});
```

**Jest：**

```ts
test("add function", () => {
  expect(1 + 2).toBe(3);
});
```

**Mocha：**

```ts
import { assert } from "chai";

describe("math", () => {
  it("should add numbers", () => {
    assert.equal(1 + 2, 3);
  });
});
```

**Jasmine：**

```ts
describe("math", () => {
  it("should add numbers", () => {
    expect(1 + 2).toBe(3);
  });
});
```

## 下一步

🦕 Deno 内置的测试能力使得编写和运行测试变得很容易，无需安装额外的测试框架或工具。通过遵循本教程中概述的模式和最佳实践，你可以确保你的 Deno 应用具有良好的测试覆盖，并保持可靠性。

如需更多关于 Deno 测试的信息，请查看：

- [测试文档](/runtime/fundamentals/testing)
- [用于测试的 mock 数据](/examples/mocking_tutorial/)
- [编写基准测试](/examples/benchmarking/)
