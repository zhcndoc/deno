---
last_modified: 2026-06-12
title: "模拟与测试替身"
description: "使用 Deno Standard Library 的 @std/testing 包，通过间谍、存根、模拟对象和虚拟时间来隔离被测代码。"
oldUrl:
  - /runtime/manual/basics/testing/mocking/
  - /examples/mocking_tutorial/
  - /examples/stubbing_tutorial/
---

单元测试在每次只测试一件事时最有用。真实依赖，例如数据库、HTTP API 或系统时钟，会让测试变得缓慢、脆弱且难以搭建。测试替身是这类依赖的受控替代品。它让你能够验证代码如何与该依赖交互，而无需承担真实依赖的成本。Deno Standard Library 在
[`@std/testing/mock`](https://jsr.io/@std/testing/doc/mock) 和
[`@std/testing/time`](https://jsr.io/@std/testing/doc/time) 中为你提供了所需的一切。

## 间谍

间谍会包装一个函数并记录每一次调用：运行了多少次，以及接收了哪些参数。间谍不会改变函数的行为，因此它们是最轻量级的测试替身。

这里我们测试一个 `saveUser()` 函数，它把用户交给数据库对象。我们不使用真实数据库，而是传入一个其 `save` 方法被间谍包裹的对象：

```ts
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCall, assertSpyCalls, spy } from "jsr:@std/testing/mock";

interface User {
  name: string;
}

interface Database {
  save: (user: User) => Promise<User & { id: number }>;
}

// 要测试的函数
function saveUser(
  user: User,
  database: Database,
): Promise<User & { id: number }> {
  return database.save(user);
}

Deno.test("saveUser calls database.save", async () => {
  // 一个替代数据库，其 save 方法被间谍包裹
  const mockDatabase = {
    save: spy((user: User) => Promise.resolve({ id: 1, ...user })),
  };

  const user: User = { name: "Test User" };
  const result = await saveUser(user, mockDatabase);

  // save 方法被精确调用了一次
  assertSpyCalls(mockDatabase.save, 1);

  // 第一次调用（索引 0）接收了我们的用户对象
  assertSpyCall(mockDatabase.save, 0, { args: [user] });

  assertEquals(result, { id: 1, name: "Test User" });
});
```

`assertSpyCalls` 会检查总调用次数，而 `assertSpyCall` 会按索引检查单次调用：它的参数，以及可选的返回值。我们在没有设置或清理任何数据库状态的情况下，验证了整个交互过程。

你也可以对对象的现有方法进行间谍监控。方法间谍是可释放的，因此请使用 `using` 关键字声明它们，这样测试结束时会自动恢复原始方法。不需要 `try`/`finally` 清理：

```ts
import { assertEquals } from "jsr:@std/assert";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";

Deno.test("using disposable spies", () => {
  const calculator = {
    add: (a: number, b: number) => a + b,
  };

  // 离开作用域时会自动恢复
  using addSpy = spy(calculator, "add");

  const sum = calculator.add(3, 4);
  assertEquals(sum, 7);
  assertSpyCalls(addSpy, 1);
  assertEquals(addSpy.calls[0].args, [3, 4]);
});
```

如果不能使用 `using`，也可以在 `finally` 块中调用 `addSpy.restore()`。无论哪种方式，恢复间谍都能防止状态在测试之间泄漏。

## 存根

存根比间谍更进一步：它会完全替换原始实现。使用存根来返回预定值、模拟错误，或避免测试触及外部服务。存根仍然会记录它的调用，因此所有间谍断言同样适用于它。

```ts
import { assertEquals } from "jsr:@std/assert";
import { stub } from "jsr:@std/testing/mock";

// 将依赖封装在对象中，这样就可以在测试中对其进行存根
const deps = {
  getUserName(_id: number): string {
    // 在真实应用中，这里可能会调用数据库
    return "Original User";
  },
};

// 被测函数
function greetUser(id: number): string {
  const name = deps.getUserName(id);
  return `Hello, ${name}!`;
}

Deno.test("greetUser with stubbed getUserName", () => {
  // 用受控实现替换原实现
  using getUserNameStub = stub(deps, "getUserName", () => "Test User");

  assertEquals(greetUser(123), "Hello, Test User!");
  assertEquals(getUserNameStub.calls.length, 1);
});
```

和方法间谍一样，存根也是可释放的。`using` 关键字会在存根离开作用域时恢复原始实现，而在需要手动控制时也可以使用 `restore()`。

### 返回一系列值

当存根需要在每次调用时返回不同结果时，传入带有顺序值的 `returnsNext`。这对于模拟缺失记录、重试或任何按调用变化的场景都很有用：

```ts
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { assertSpyCalls, returnsNext, stub } from "jsr:@std/testing/mock";

type User = { id: number; name: string };

const database = {
  getUserById(id: number): User | undefined {
    return { id, name: "Ada Lovelace" };
  },
};

function findOrThrow(id: number): User {
  const user = database.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

Deno.test("findOrThrow throws when the user was not found", () => {
  // 该存根在第一次（也是唯一一次）调用时返回 undefined
  using dbStub = stub(database, "getUserById", returnsNext([undefined]));

  assertThrows(() => findOrThrow(1), Error, "User not found");
  assertSpyCalls(dbStub, 1);
});

Deno.test("stub with multiple return values", () => {
  const dataService = { fetchData: () => "original data" };

  using fetchDataStub = stub(
    dataService,
    "fetchData",
    returnsNext(["first result", "second result"]),
  );

  assertEquals(dataService.fetchData(), "first result");
  assertEquals(dataService.fetchData(), "second result");
  assertSpyCalls(fetchDataStub, 2);
});
```

## 间谍、存根，还是模拟对象？

这些术语有重叠，但区分起来很简单：

- **间谍**用于观察。它在真实行为运行时记录调用。
- **存根**用于替换。它记录调用并替换为受控实现。
- **模拟对象**是任意测试替身的统称。实际上，“模拟对象”通常是一个手工构建的替代品（如上面的 `mockDatabase`），其方法是间谍或存根，并在被测代码运行后对其进行断言。

你所需的一切都在 `jsr:@std/testing/mock` 中。

## 虚拟时间

读取时钟或设置计时器的代码，会根据运行时机产生不同结果。来自 `jsr:@std/testing/time` 的 `FakeTime` 会用可控版本替换 `Date`、`setTimeout`、`setInterval` 及其相关函数，因此你可以固定当前日期，并通过 `tick()` 立即推进时间，而不必等待真实超时：

```ts
import { assertEquals } from "jsr:@std/assert";
import { FakeTime } from "jsr:@std/testing/time";

// 依赖当前时间的函数
function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6; // 0 表示星期日，6 表示星期六
}

// 处理超时的函数
function delayedGreeting(callback: (message: string) => void): void {
  setTimeout(() => callback("Hello after delay"), 1000);
}

Deno.test("time-dependent tests", () => {
  // 将虚拟时钟设置到一个已知的星期一；会自动恢复
  using time = new FakeTime(new Date("2023-05-01T12:00:00Z"));

  assertEquals(isWeekend(), false);

  // 前进 5 天到星期六
  time.tick(5 * 24 * 60 * 60 * 1000);
  assertEquals(isWeekend(), true);

  // 当虚拟时钟经过定时器时，它们会立刻触发
  let greeting = "";
  delayedGreeting((message) => {
    greeting = message;
  });
  time.tick(1000);
  assertEquals(greeting, "Hello after delay");
});
```

虚拟时间非常适合日历类功能，例如调度和过期；也适合基于超时或间隔的代码，例如轮询和防抖；还适合任何等待真实时钟都会让测试变慢或变脆弱的场景。`FakeTime` 是可释放的，因此 `using` 会在测试结束时恢复真实时钟。

## 选择合适的替身

选择能完成任务的最简单替身。如果你只需要验证某个交互确实发生了，就用间谍。如果真实实现很慢、不可预测或依赖外部系统，就用存根替换。如果依赖的是时钟，就用虚拟时间，而不是手动存根 `Date`。无论你选择哪种方式，都应在接口边界（`deps` 对象、数据库层）进行存根，而不是深入到实现细节内部，并让 `using` 负责恢复，这样一个测试就不会影响下一个测试。

## 继续阅读

- [Deno 中的测试](/runtime/test/)：测试运行器、断言和覆盖率
- [快照测试](/runtime/test/snapshots/)：将输出与记录的快照进行比较
- [`@std/testing` API 文档](https://jsr.io/@std/testing)：每个工具的详细说明
- [更多示例](/examples/)：可运行的教程和示例
