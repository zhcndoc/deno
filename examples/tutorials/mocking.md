---
title: "使用 Mock 进行隔离测试"
description: "掌握单元测试中的 Mock 技巧。了解如何使用 Spy、Stub、模拟时间及 Deno 其他工具来提升代码质量与测试可信度"
url: /examples/mocking_tutorial/
---

本指南基于
[Deno 测试基础](/examples/testing_tutorial/)，重点介绍可帮助你在测试中隔离代码的 Mock 技术。

为了实现高效的单元测试，你经常需要“模拟”（mock）代码所交互的数据。Mock 是一种测试技术，通过用可控的模拟数据替代真实数据来测试代码。当测试与外部服务（比如 API 或数据库）交互的组件时，这尤为有用。

Deno 标准库提供了[便捷的 Mock 工具](https://jsr.io/@std/testing/doc/mock)，让你的测试更轻松编写、更可靠且执行更快。

### 监听 (Spying)

在 Deno 中，你可以使用 [`spy`](https://jsr.io/@std/testing/doc/mock#spying) 监听函数调用情况。Spy 不会改变函数行为，但会记录如函数被调用次数及传入参数等重要信息。

通过使用 Spy，你可以检验代码是否与其依赖正确交互，而无需搭建复杂的基础设施。

下面示例测试了一个名为 `saveUser()` 的函数，它接受一个用户对象和一个数据库对象，然后调用数据库的 `save` 方法：

```ts
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

// 定义类型以提升代码质量
interface User {
  name: string;
}

interface Database {
  save: (user: User) => Promise<User & { id: number }>;
}

// 待测试函数
function saveUser(
  user: User,
  database: Database,
): Promise<User & { id: number }> {
  return database.save(user);
}

// 使用 mock 测试
Deno.test("saveUser 调用了 database.save", async () => {
  // 创建一个带有 save 方法的 mock 数据库，save 方法被 spy 包裹
  const mockDatabase = {
    save: spy((user: User) => Promise.resolve({ id: 1, ...user })),
  };

  const user: User = { name: "Test User" };
  const result = await saveUser(user, mockDatabase);

  // 验证 mock 调用情况
  assertSpyCalls(mockDatabase.save, 1);
  assertEquals(mockDatabase.save.calls[0].args[0], user);
  assertEquals(result, { id: 1, name: "Test User" });
});
```

我们从 Deno 标准库导入了断言函数和 Spy 相关功能。

mock 数据库是实数据库对象的替代品，其 `save` 方法被包裹进 Spy。Spy 记录对该方法的调用、传入参数，并执行真实实现（这里返回带有 `user` 数据和 `id` 的 Promise）。

测试调用 `saveUser()` 使用 mock 数据后，通过断言验证：

1. `save` 方法被调用一次
2. 调用的第一个参数是传入的 `user` 对象
3. 返回结果包含原始用户数据和新增的 ID

这样，我们无需设置或清理复杂的数据库状态便完成了对 `saveUser` 的测试。

### 孔函数 (Stubbing)

Spy 仅监听方法调用，不改变其行为，而 Stub 是完全替换原函数实现的技术。
[Stubbing](https://jsr.io/@std/testing/doc/mock#stubbing) 是一种 Mock 形式，暂时用受控的实现替换函数或方法，以模拟特定行为并返回预设值，也常用于覆盖与环境相关的功能。

在 Deno 中，可以使用标准测试库的 `stub` 函数创建 Stub：

```ts
import { assertEquals } from "jsr:@std/assert";
import { Stub, stub } from "jsr:@std/testing/mock";

// 定义类型以提升代码质量
interface User {
  name: string;
  role: string;
}

// 原始函数
function getCurrentUser(userId: string): User {
  // 可能涉及数据库调用的实现
  return { name: "Real User", role: "admin" };
}

// 待测试函数
function hasAdminAccess(userId: string): boolean {
  const user = getCurrentUser(userId);
  return user.role === "admin";
}

Deno.test("hasAdminAccess 使用 stub 用户", () => {
  // 创建替代 getCurrentUser 的 stub
  const getUserStub: Stub<typeof getCurrentUser> = stub(
    globalThis,
    "getCurrentUser",
    // 返回非管理员的测试用户
    () => ({ name: "Test User", role: "guest" }),
  );

  try {
    // 使用 stub 函数测试
    const result = hasAdminAccess("user123");
    assertEquals(result, false);

    // 测试中也能改变 stub 行为
    getUserStub.restore(); // 移除第一个 stub

    const adminStub = stub(
      globalThis,
      "getCurrentUser",
      () => ({ name: "Admin User", role: "admin" }),
    );

    try {
      const adminResult = hasAdminAccess("admin456");
      assertEquals(adminResult, true);
    } finally {
      adminStub.restore();
    }
  } finally {
    // 始终还原原始函数，避免影响其他测试
    getUserStub.restore();
  }
});
```

这里导入了必要函数，设置了一个可能调用数据库的原始 `getCurrentUser` 函数。

我们定义了待测试的 `hasAdminAccess()`，用来判断用户是否为管理员。

接着创建了 `hasAdminAccess with a stubbed user` 测试，用 stub 替换真实的 `getCurrentUser`，模拟返回一个非管理员用户。

测试调用这个 stub，会发现返回 `false`，符合预期。

然后将 stub 修改为返回管理员用户，断言结果为 `true`。

最后在 `finally` 中保证还原函数，避免对其他测试造成影响。

### 环境变量的 Stub

要实现确定性的测试，经常需要控制环境变量。Deno 标准库提供了相关工具：

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// 依赖环境变量和时间的函数
function generateReport() {
  const environment = Deno.env.get("ENVIRONMENT") || "development";
  const timestamp = new Date().toISOString();

  return {
    environment,
    generatedAt: timestamp,
    data: {/* 报告数据 */},
  };
}

Deno.test("在受控环境下生成报告", () => {
  // Stub 环境变量
  const originalEnv = Deno.env.get;
  const envStub = stub(Deno.env, "get", (key: string) => {
    if (key === "ENVIRONMENT") return "production";
    return originalEnv.call(Deno.env, key);
  });

  // Stub 时间
  const dateStub = stub(
    Date.prototype,
    "toISOString",
    () => "2023-06-15T12:00:00Z",
  );

  try {
    const report = generateReport();

    // 验证使用受控值生成的结果
    assertEquals(report.environment, "production");
    assertEquals(report.generatedAt, "2023-06-15T12:00:00Z");
  } finally {
    // 始终还原 stub，避免影响其他测试
    envStub.restore();
    dateStub.restore();
  }
});
```

### 模拟时间 (Faking Time)

时间相关的代码测试较难，因为结果可能因测试执行时间而不同。Deno 提供了 [`fakeTime`](https://jsr.io/@std/testing/doc/mock#faking-time) 工具，允许你在测试中模拟时间流逝并控制日期函数。

以下示例测试基于时间的函数：`isWeekend()` 判断当前是否是周末，`delayedGreeting()` 在 1 秒延时后调用回调：

```ts
import { assertEquals } from "jsr:@std/assert";
import { FakeTime, fakeTime } from "jsr:@std/testing/mock";

// 基于当前时间的函数
function isWeekend(): boolean {
  const date = new Date();
  const day = date.getDay();
  return day === 0 || day === 6; // 0 是星期日，6 是星期六
}

// 使用定时器的函数
function delayedGreeting(callback: (message: string) => void): void {
  setTimeout(() => {
    callback("Hello after delay");
  }, 1000); // 1 秒延迟
}

Deno.test("基于时间的测试", () => {
  // 创建一个模拟时间，初始为 2023 年 5 月 1 日（周一）
  const mockedTime: FakeTime = fakeTime(new Date("2023-05-01T12:00:00Z"));

  try {
    // 测试周一
    assertEquals(isWeekend(), false);

    // 向前推进时间到周六
    mockedTime.tick(5 * 24 * 60 * 60 * 1000); // 前进 5 天
    assertEquals(isWeekend(), true);

    // 测试带定时器的异步操作
    let greeting = "";
    delayedGreeting((message) => {
      greeting = message;
    });

    // 立即推进 1 秒以触发定时器
    mockedTime.tick(1000);
    assertEquals(greeting, "Hello after delay");
  } finally {
    // 始终还原真实时间
    mockedTime.restore();
  }
});
```

这里使用 `fakeTime` 创建受控时间环境，初始时间为 2023 年 5 月 1 日（星期一），返回的 `FakeTime` 对象可控制时间流逝。

我们在模拟周一时测试 `isWeekend()` 返回 `false`，推进到周六后为 `true`。

`fakeTime` 替换了 JS 的时间函数 (`Date`、`setTimeout`、`setInterval` 等)，让你无论实际测试时间何时，都可测试指定时间条件。此技术可避免依赖系统时钟导致的测试不稳定，并可通过快速推进时间来加速测试。

模拟时间适用于测试：

- 日历或日期相关功能，如日程、预约、过期时间
- 包含超时或定时器的代码，如轮询、延迟操作、去抖
- 动画或过渡效果的定时测试

和 Stub 类似，测试结束后记得调用 `restore()` 还原真实时间函数，避免影响其他测试。

## 高级 Mock 模式

### 部分 Mock

有时你只想 mock 某些对象方法，保留其他方法真实实现：

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

class UserService {
  async getUser(id: string) {
    // 复杂数据库查询
    return { id, name: "Database User" };
  }

  async formatUser(user: { id: string; name: string }) {
    return {
      ...user,
      displayName: user.name.toUpperCase(),
    };
  }

  async getUserFormatted(id: string) {
    const user = await this.getUser(id);
    return this.formatUser(user);
  }
}

Deno.test("使用 stub 进行部分 Mock", async () => {
  const service = new UserService();

  // 仅 mock getUser 方法
  const getUserMock = stub(
    service,
    "getUser",
    () => Promise.resolve({ id: "test-id", name: "Mocked User" }),
  );

  try {
    // formatUser 仍使用真实实现
    const result = await service.getUserFormatted("test-id");

    assertEquals(result, {
      id: "test-id",
      name: "Mocked User",
      displayName: "MOCKED USER",
    });

    // 验证 getUser 被正确调用
    assertEquals(getUserMock.calls.length, 1);
    assertEquals(getUserMock.calls[0].args[0], "test-id");
  } finally {
    getUserMock.restore();
  }
});
```

### Mock fetch 请求

测试涉及 HTTP 请求的代码通常需要模拟 `fetch` API：

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// 使用 fetch 的函数
async function fetchUserData(userId: string) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

Deno.test("Mock fetch API", async () => {
  const originalFetch = globalThis.fetch;

  // 创建 mock fetch 返回的响应
  const mockResponse = new Response(
    JSON.stringify({ id: "123", name: "John Doe" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

  // 用 stub 替换 fetch
  globalThis.fetch = stub(
    globalThis,
    "fetch",
    (_input: string | URL | Request, _init?: RequestInit) =>
      Promise.resolve(mockResponse),
  );

  try {
    const result = await fetchUserData("123");
    assertEquals(result, { id: "123", name: "John Doe" });
  } finally {
    // 还原原始 fetch
    globalThis.fetch = originalFetch;
  }
});
```

## 真实案例

现在我们将所有技巧合并，测试一个用户认证服务，该服务：

1. 验证用户凭证
2. 调用 API 进行认证
3. 存储带有过期时间的 token

下面示例创建了完整的 `AuthService` 类，用于登录、token 管理和鉴权。测试中使用了多种 Mock 技术：Stub fetch 请求、Spy 方法、模拟时间来测试 token 过期，并使用结构化测试步骤组织。

Deno 的测试 API 提供了 `t.step()` 方法，将测试逻辑分割为步骤或子测试，使复杂测试更易读，更便于定位问题。每步可单独断言，测试结果中分别报告。

```ts
import { assertEquals, assertRejects } from "jsr:@std/assert";
import { FakeTime, fakeTime, spy, stub } from "jsr:@std/testing/mock";

// 目标服务
class AuthService {
  private token: string | null = null;
  private expiresAt: Date | null = null;

  async login(username: string, password: string): Promise<string> {
    // 校验输入
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // 调用认证 API
    const response = await fetch("https://api.example.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data = await response.json();

    // 存储带 1 小时过期时间的 token
    this.token = data.token;
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    return this.token;
  }

  getToken(): string {
    if (!this.token || !this.expiresAt) {
      throw new Error("Not authenticated");
    }

    if (new Date() > this.expiresAt) {
      this.token = null;
      this.expiresAt = null;
      throw new Error("Token expired");
    }

    return this.token;
  }

  logout(): void {
    this.token = null;
    this.expiresAt = null;
  }
}

Deno.test("AuthService 综合测试", async (t) => {
  await t.step("登录应该验证凭证", async () => {
    const authService = new AuthService();
    await assertRejects(
      () => authService.login("", "password"),
      Error,
      "Username and password are required",
    );
  });

  await t.step("登录应正确处理 API 调用", async () => {
    const authService = new AuthService();

    // mock 成功响应
    const mockResponse = new Response(
      JSON.stringify({ token: "fake-jwt-token" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

    const fetchStub = stub(
      globalThis,
      "fetch",
      (_url: string | URL | Request, options?: RequestInit) => {
        // 验证请求数据正确
        const body = options?.body as string;
        const parsedBody = JSON.parse(body);
        assertEquals(parsedBody.username, "testuser");
        assertEquals(parsedBody.password, "password123");

        return Promise.resolve(mockResponse);
      },
    );

    try {
      const token = await authService.login("testuser", "password123");
      assertEquals(token, "fake-jwt-token");
    } finally {
      fetchStub.restore();
    }
  });

  await t.step("token 过期逻辑应正确", () => {
    const authService = new AuthService();
    const time = fakeTime(new Date("2023-01-01T12:00:00Z"));

    try {
      // mock 登录过程直接设置 token
      authService.login = spy(
        authService,
        "login",
        async () => {
          (authService as any).token = "fake-token";
          (authService as any).expiresAt = new Date(
            Date.now() + 60 * 60 * 1000,
          );
          return "fake-token";
        },
      );

      // 登录并验证 token
      authService.login("user", "pass").then(() => {
        const token = authService.getToken();
        assertEquals(token, "fake-token");

        // 将时间推进到过期后
        time.tick(61 * 60 * 1000);

        // token 应该已过期
        assertRejects(
          () => {
            authService.getToken();
          },
          Error,
          "Token expired",
        );
      });
    } finally {
      time.restore();
      (authService.login as any).restore();
    }
  });
});
```

该代码定义了 `AuthService` 类，包含三大功能：

- 登录：校验凭证，调用 API，保存带过期时间的 token
- 获取 Token：返回有效且未过期的 token
- 登出：清除 token 和过期时间

测试通过一个主测试，分为三个逻辑**步骤**，分别检验凭证验证、API 调用处理和 token 过期。

🦕 高效的 Mock 技术对于编写可靠、可维护的单元测试至关重要。Deno 提供多种强大工具帮助你在测试中隔离代码。掌握这些技巧后，你能编写更可靠、更快速且不依赖外部服务的测试。

更多测试资源请参考：

- [Deno 测试 API 文档](/api/deno/testing)
- [Deno 标准库测试模块](https://jsr.io/@std/testing)
- [Deno 测试基础教程](/examples/testing_tutorial/)