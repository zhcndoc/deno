---
last_modified: 2025-12-16
title: "在测试中使用桩（Stubbing）"
description: "了解如何在 Deno 中使用桩来隔离测试代码：通过用受控的行为替换函数实现"
url: /examples/stubbing_tutorial/
---

桩（Stubbing）是一种强大的技术，通过用受控的实现替换被测代码中的函数，从而实现代码隔离。尽管
[间谍（spies）](/examples/mocking_tutorial/#spying) 会在不改变行为的情况下监控函数调用，但桩更进一步：它会彻底替换原始实现，让你能够在测试期间模拟特定的条件或行为。

## 什么是桩（stubs）？

桩是用于测试的“假实现”，在测试时会替换真实函数。它们让你：

- 控制函数返回哪些值
- 模拟错误或特定的边界情况
- 防止调用数据库或 API 等外部服务
- 测试那些使用真实实现很难触发的代码路径

Deno 通过
[标准库的测试工具](https://jsr.io/@std/testing/doc/mock#stubbing)
提供了强大的桩能力。

## 基本桩用法

下面是一个简单示例，演示如何对函数进行桩替换：

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// 将依赖封装起来，以便能够在测试中安全地进行桩替换。
const deps = {
  getUserName(_id: number): string {
    // 在真实应用中，这可能会调用数据库
    return "Original User";
  },
};

// 要测试的函数
function greetUser(id: number): string {
  const name = deps.getUserName(id);
  return `Hello, ${name}!`;
}

Deno.test("greetUser with stubbed getUserName", () => {
  // 创建一个桩：返回一个受控的值
  const getUserNameStub = stub(deps, "getUserName", () => "Test User");

  try {
    // 使用桩后的实现进行测试
    const greeting = greetUser(123);
    assertEquals(greeting, "Hello, Test User!");
  } finally {
    // 始终恢复原始函数
    getUserNameStub.restore();
  }
});
```

在这个示例中，我们：

1. 从 Deno 的标准库中导入所需的函数
2. 为 `getUserName` 函数创建一个桩：使其返回 “Test User”，而不是调用真实实现
3. 调用我们的被测函数，它会使用被桩替换后的实现
4. 验证结果符合我们的预期
5. 恢复原始函数，以防影响其他测试

## 在测试场景中使用桩

让我们用一个更贴近实际的例子来看看：一个与数据库交互的 `UserRepository` 类：

```ts
import { assertSpyCalls, returnsNext, stub } from "jsr:@std/testing/mock";
import { assertThrows } from "jsr:@std/assert";

type User = {
  id: number;
  name: string;
};

// 这表示我们的数据库访问层
const database = {
  getUserById(id: number): User | undefined {
    // 在真实应用中，这会查询数据库
    return { id, name: "Ada Lovelace" };
  },
};

// 我们想要测试的类
class UserRepository {
  static findOrThrow(id: number): User {
    const user = database.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

Deno.test("findOrThrow method throws when the user was not found", () => {
  // 将 database.getUserById 桩替换为返回 undefined
  using dbStub = stub(database, "getUserById", returnsNext([undefined]));

  // 我们期望这个函数调用会抛出错误
  assertThrows(() => UserRepository.findOrThrow(1), Error, "User not found");

  // 验证被桩替换的函数只被调用了一次
  assertSpyCalls(dbStub, 1);
});
```

在这个示例中：

1. 我们正在测试 `findOrThrow` 方法：当找不到用户时它应该抛出错误
2. 我们将 `database.getUserById` 桩替换为返回 `undefined`，用于模拟用户缺失
3. 我们验证 `findOrThrow` 会抛出预期的错误
4. 我们还会检查数据库方法是否恰好被调用了一次

注意：我们在 `stub` 上使用了 `using` 关键字，它是一种很方便的方式，能够确保当桩超出作用域时会自动恢复。

## 高级桩技巧

### 在连续调用中返回不同的值

有时你希望桩在每次被调用时返回不同的值：

```ts
import { returnsNext, stub } from "jsr:@std/testing/mock";
import { assertEquals } from "jsr:@std/assert";

Deno.test("stub with multiple return values", () => {
  const dataService = {
    fetchData: () => "original data",
  };

  const fetchDataStub = stub(
    dataService,
    "fetchData",
    // 按顺序返回这些值
    returnsNext(["first result", "second result", "third result"]),
  );

  try {
    assertEquals(dataService.fetchData(), "first result");
    assertEquals(dataService.fetchData(), "second result");
    assertEquals(dataService.fetchData(), "third result");
  } finally {
    fetchDataStub.restore();
  }
});
```

### 使用桩时编写实现逻辑

你也可以在桩的实现中提供自定义逻辑：

```ts
import { stub } from "jsr:@std/testing/mock";
import { assertEquals } from "jsr:@std/assert";

Deno.test("stub with custom implementation", () => {
  // 创建一个计数器，用于跟踪桩被调用了多少次
  let callCount = 0;

  const mathService = {
    calculate: (a: number, b: number) => a + b,
  };

  const calculateStub = stub(
    mathService,
    "calculate",
    (a: number, b: number) => {
      callCount++;
      return a + b * 2; // 自定义实现
    },
  );

  try {
    const result = mathService.calculate(5, 10);
    assertEquals(result, 25); // 5 + (10 * 2)
    assertEquals(callCount, 1);
  } finally {
    calculateStub.restore();
  }
});
```

## 对 API 调用和外部服务进行桩替换

桩最常见的用途之一，是在测试期间替换 API 调用：

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

const apiClient = {
  fetch: globalThis.fetch,
};

async function fetchUserData(id: string) {
  const response = await apiClient.fetch(`https://api.example.com/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

Deno.test("fetchUserData with stubbed fetch", async () => {
  const mockResponse = new Response(
    JSON.stringify({ id: "123", name: "Jane Doe" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

  // 用桩替换 apiClient.fetch
  const fetchStub = stub(
    apiClient,
    "fetch",
    () => Promise.resolve(mockResponse),
  );

  try {
    const user = await fetchUserData("123");
    assertEquals(user, { id: "123", name: "Jane Doe" });
  } finally {
    fetchStub.restore();
  }
});
```

## 最佳实践

1. **始终恢复桩**：使用 `try/finally` 代码块或 `using` 关键字来
   确保即使测试失败，桩也会被恢复。

2. **为外部依赖使用桩**：对数据库调用、API 请求或文件系统操作进行桩替换，
   以让测试更快、更可靠。

3. **保持桩的简单**：桩应该返回可预测的值，以便你测试特定场景。

4. **需要时与间谍（spies）结合**：有时你不仅要替换功能（桩），
   还需要跟踪调用（间谍）。

5. **在正确的层级进行桩替换**：在接口边界处进行桩替换，而不是深入到底层实现细节。

🦕 桩是一个强大的工具，能在测试期间隔离你的代码：它让你能够创建确定性的测试环境，并轻松测试各种边界情况。通过用受控的行为替换真实实现，你可以编写更聚焦、更可靠、且运行更快的一致性测试。

想了解更多测试资源，请查看：

- [使用 mock 在隔离环境中测试](/examples/mocking_tutorial/)
- [Deno 标准库测试模块](https://jsr.io/@std/testing)
- [Deno 中的基础测试](/examples/testing_tutorial/)
