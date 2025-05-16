---
title: "行为驱动开发 (BDD)"
description: "使用 Deno 标准库的 BDD 模块实现行为驱动开发。创建可读性强、组织良好的测试，并进行有效的断言。"
url: /examples/bdd_tutorial/
---

行为驱动开发 (BDD) 是一种软件开发方法，鼓励开发人员、质量保证人员和非技术利益相关者之间的协作。BDD 关注通过用所有利益相关者都能理解的自然语言编写的示例来定义应用程序的行为。

Deno 的标准库提供了一个 BDD 风格的测试模块，使您能够以对非技术利益相关者友好且在实现上实用的方式构建测试。在本教程中，我们将探索如何使用 BDD 模块为您的应用程序创建描述性测试套件。

## BDD 简介

BDD 扩展了
[测试驱动开发](https://en.wikipedia.org/wiki/Test-driven_development)
(TDD)，通过使用易于阅读的自然语言编写测试。与其考虑“测试”，BDD 鼓励我们考虑“规范”或“规格”，这些规格描述软件应如何从用户的角度进行操作。这种方法有助于保持测试专注于代码应做什么，而不是它是如何实现的。

BDD 的基本元素包括：

- **Describe** 块，用于分组相关的规范
- **It** 语句，表达单一的行为
- **Before/After** 钩子，用于设置和拆解操作

## 使用 Deno 的 BDD 模块

要开始在 Deno 中进行 BDD 测试，我们将使用 [Deno 标准库](https://jsr.io/@std/testing/doc/bdd) 中的 `@std/testing/bdd` 模块。

首先，让我们导入所需的函数：

```ts
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "jsr:@std/assert";
```

这些导入提供了核心的 BDD 函数：

- `describe` 创建一个块，分组相关的测试
- `it` 声明一个验证特定行为的测试用例
- `beforeEach`/`afterEach` 在每个测试用例前后运行
- `beforeAll`/`afterAll` 在描述块中的所有测试之前或之后运行一次

我们还将使用来自 [`@std/assert`](https://jsr.io/@std/assert) 的断言函数来验证我们的期望。

### 编写您的第一个 BDD 测试

让我们创建一个简单的计算器模块并使用 BDD 对其进行测试：

```ts title="calculator.ts"
export class Calculator {
  private value: number = 0;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  add(number: number): Calculator {
    this.value += number;
    return this;
  }

  subtract(number: number): Calculator {
    this.value -= number;
    return this;
  }

  multiply(number: number): Calculator {
    this.value *= number;
    return this;
  }

  divide(number: number): Calculator {
    if (number === 0) {
      throw new Error("无法被零除");
    }
    this.value /= number;
    return this;
  }

  get result(): number {
    return this.value;
  }
}
```

现在，让我们使用 BDD 风格测试这个计算器：

```ts title="calculator_test.ts"
import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { Calculator } from "./calculator.ts";

describe("计算器", () => {
  let calculator: Calculator;

  // 在每个测试之前创建一个新的 Calculator 实例
  beforeEach(() => {
    calculator = new Calculator();
  });

  it("应初始化为零", () => {
    assertEquals(calculator.result, 0);
  });

  it("应初始化为提供的值", () => {
    const initializedCalculator = new Calculator(10);
    assertEquals(initializedCalculator.result, 10);
  });

  describe("加法方法", () => {
    it("应正确地加一个正数", () => {
      calculator.add(5);
      assertEquals(calculator.result, 5);
    });

    it("应正确处理负数", () => {
      calculator.add(-5);
      assertEquals(calculator.result, -5);
    });

    it("应支持链式调用", () => {
      calculator.add(5).add(10);
      assertEquals(calculator.result, 15);
    });
  });

  describe("减法方法", () => {
    it("应正确地减去一个数", () => {
      calculator.subtract(5);
      assertEquals(calculator.result, -5);
    });

    it("应支持链式调用", () => {
      calculator.subtract(5).subtract(10);
      assertEquals(calculator.result, -15);
    });
  });

  describe("乘法方法", () => {
    beforeEach(() => {
      // 对于乘法测试，初始值为 10
      calculator = new Calculator(10);
    });

    it("应正确地乘以一个数", () => {
      calculator.multiply(5);
      assertEquals(calculator.result, 50);
    });

    it("应支持链式调用", () => {
      calculator.multiply(2).multiply(3);
      assertEquals(calculator.result, 60);
    });
  });

  describe("除法方法", () => {
    beforeEach(() => {
      // 对于除法测试，初始值为 10
      calculator = new Calculator(10);
    });

    it("应正确地除以一个数", () => {
      calculator.divide(2);
      assertEquals(calculator.result, 5);
    });

    it("应在除以零时抛出错误", () => {
      assertThrows(
        () => calculator.divide(0),
        Error,
        "无法被零除",
      );
    });
  });
});
```

要运行此测试，请使用 `deno test` 命令：

```sh
deno test calculator_test.ts
```

您将看到类似以下的输出：

```sh
running 1 test from file:///path/to/calculator_test.ts
计算器
  ✓ 应初始化为零 
  ✓ 应初始化为提供的值 
  加法方法
    ✓ 应正确地加一个正数 
    ✓ 应正确处理负数 
    ✓ 应支持链式调用 
  减法方法
    ✓ 应正确地减去一个数 
    ✓ 应支持链式调用 
  乘法方法
    ✓ 应正确地乘以一个数 
    ✓ 应支持链式调用 
  除法方法
    ✓ 应正确地除以一个数 
    ✓ 应在除以零时抛出错误 

ok | 11 passed | 0 failed (234ms)
```

## 使用嵌套的 describe 块组织测试

BDD 的一个强大特性是能够嵌套 `describe` 块，从而帮助以层次结构组织测试。在计算器示例中，我们在各自的 `describe` 块中分组了每个方法的测试。这不仅使测试更具可读性，而且在测试失败时更容易定位问题。

您可以嵌套 `describe` 块，但要注意不要嵌套得太深，因为过度嵌套可能使测试更难以理解。

## 钩子

BDD 模块提供了四个钩子：

- `beforeEach` 在当前 describe 块中的每个测试之前运行
- `afterEach` 在当前 describe 块中的每个测试之后运行
- `beforeAll` 在当前 describe 块中的所有测试之前运行一次
- `afterAll` 在当前 describe 块中的所有测试之后运行一次

### beforeEach/afterEach

这些钩子非常适合于：

- 为每个测试设置一个新的测试环境
- 在每个测试后清理资源
- 确保测试隔离

在计算器示例中，我们使用 `beforeEach` 在每个测试之前创建一个新的计算器实例，以确保每个测试都从干净的状态开始。

### beforeAll/afterAll

这些钩子适用于：

- 可以共享的昂贵设置操作
- 设置和拆除数据库连接
- 创建和清理共享资源

以下是如何使用 `beforeAll` 和 `afterAll` 的示例：

```ts
describe("数据库操作", () => {
  let db: Database;

  beforeAll(async () => {
    // 在所有测试之前一次连接到数据库
    db = await Database.connect(TEST_CONNECTION_STRING);
    await db.migrate();
  });

  afterAll(async () => {
    // 在所有测试完成后断开连接
    await db.close();
  });

  it("应插入一条记录", async () => {
    const result = await db.insert({ name: "测试" });
    assertEquals(result.success, true);
  });

  it("应检索一条记录", async () => {
    const record = await db.findById(1);
    assertEquals(record.name, "测试");
  });
});
```

## Gherkin 与 JavaScript 风格的 BDD

如果您熟悉 Cucumber 或其他 BDD 框架，您可能会期待使用 "Given-When-Then" 语句的 Gherkin 语法。

Deno 的 BDD 模块使用的是 JavaScript 风格的语法，而不是 Gherkin。这种方法类似于其他 JavaScript 测试框架，如 Mocha 或 Jasmine。然而，您仍然可以通过以下方式遵循 BDD 原则：

1. 编写清晰、以行为为中心的测试描述
2. 组织测试以反映用户故事
3. 在测试实现中遵循 "Arrange-Act-Assert" 模式

例如，您可以将您的 `it` 块构造为与 Given-When-Then 格式相对应：

```ts
describe("计算器", () => {
  it("应正确加法运算", () => {
    // Given
    const calculator = new Calculator();

    // When
    calculator.add(5);

    // Then
    assertEquals(calculator.result, 5);
  });
});
```

如果您需要完整的 Gherkin 支持和自然语言规范，请考虑使用与 Deno 兼容的专用 BDD 框架，例如
[cucumber-js](https://github.com/cucumber/cucumber-js)。

## Deno 的 BDD 最佳实践

### 编写易于阅读的测试

BDD 测试应像文档一样可读。在您的 `describe` 和 `it` 语句中使用清晰、描述性的语言：

```ts
// 好
describe("用户认证", () => {
  it("应拒绝不正确密码的登录", () => {
    // 测试代码
  });
});

// 不好
describe("auth", () => {
  it("bad pw fails", () => {
    // 测试代码
  });
});
```

### 保持测试专注

每个测试应验证单一行为。避免在单个 `it` 块中测试多个行为：

```ts
// 好
it("应将商品添加到购物车", () => {
  // 测试添加到购物车
});

it("应计算出正确的总数", () => {
  // 测试总数计算
});

// 不好
it("应添加商品并计算总数", () => {
  // 测试添加到购物车
  // 测试总数计算
});
```

### 使用上下文特定的设置

当一个描述块中的测试需要不同的设置时，使用嵌套的描述和它们自己的 `beforeEach` 钩子，而不是条件逻辑：

```ts
// 好
describe("用户操作", () => {
  describe("当用户已登录时", () => {
    beforeEach(() => {
      // 设置已登录用户
    });

    it("应显示仪表盘", () => {
      // 测试
    });
  });

  describe("当用户未登录时", () => {
    beforeEach(() => {
      // 设置未登录状态
    });

    it("应重定向到登录", () => {
      // 测试
    });
  });
});

// 避免
describe("用户操作", () => {
  beforeEach(() => {
    // 设置基本状态
    if (isLoggedInTest) {
      // 设置已登录状态
    } else {
      // 设置未登录状态
    }
  });

  it("应在已登录时显示仪表盘", () => {
    isLoggedInTest = true;
    // 测试
  });

  it("应在未登录时重定向到登录", () => {
    isLoggedInTest = false;
    // 测试
  });
});
```

### 正确处理异步测试

在测试异步代码时，请记住：

- 将您的测试函数标记为 `async`
- 对于 Promise 使用 `await`
- 正确处理错误

```ts
it("应异步获取用户数据", async () => {
  const user = await fetchUser(1);
  assertEquals(user.name, "约翰·多");
});
```

🦕 通过遵循本教程中概述的 BDD 原则和实践，您可以构建更可靠的软件，并加深对代码业务逻辑的理解。

请记住，BDD 不仅仅是关于语法或工具，而是共同定义和验证应用程序行为的方法。最成功的 BDD 实施将这些技术实践与开发人员、测试人员、产品与业务利益相关者之间的定期对话结合在一起。

要继续学习 Deno 中的测试，请探索标准库测试套件中的其他模块，例如 [模拟](/examples/mocking_tutorial/) 和 [快照测试](/examples/snapshot_tutorial/)。