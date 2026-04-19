---
last_modified: 2025-04-03
title: "测试 Web 应用"
description: "使用 Deno 对 Web 应用进行测试的全面指南"
url: "/examples/web_testing_tutorial/"
---

Deno 是一个在浏览器之外运行的 JavaScript 运行时，因此，你
无法像在浏览器中那样直接在 Deno 中操作文档对象模型（DOM）。然而你可以使用类似
[deno-dom](https://jsr.io/@b-fuze/deno-dom),
[JSDom](https://github.com/jsdom/jsdom) 或
[LinkeDOM](https://www.npmjs.com/package/linkedom) 这样的库来处理 DOM。本教程将指导你如何使用 Deno 有效地测试你的 Web 应用。

## 测试 UI 组件和 DOM 操作

假设你有一个显示用户个人资料的网站，你可以设置一个测试函数来验证 DOM 元素的创建是否正常工作。该代码会先设置一个基础的卡片元素，然后测试所创建的 DOM 结构是否与预期一致。

```ts
import { assertEquals } from "jsr:@std/assert";
import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

// 进行 DOM 操作的组件或函数
function createUserCard(user: { name: string; email: string }): Element {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const card = doc.createElement("div");
  card.className = "user-card";

  const name = doc.createElement("h2");
  name.textContent = user.name;
  card.appendChild(name);

  const email = doc.createElement("p");
  email.textContent = user.email;
  email.className = "email";
  card.appendChild(email);

  return card;
}

Deno.test("DOM 操作测试", () => {
  // 创建测试用户
  const testUser = { name: "Test User", email: "test@example.com" };

  // 调用函数
  const card = createUserCard(testUser);

  // 断言 DOM 结构正确
  assertEquals(card.className, "user-card");
  assertEquals(card.children.length, 2);
  assertEquals(card.querySelector("h2")?.textContent, "Test User");
  assertEquals(card.querySelector(".email")?.textContent, "test@example.com");
});
```

## 测试事件处理

Web 应用通常通过事件来处理用户交互。下面介绍如何测试事件处理函数。此代码会创建一个按钮，用于跟踪其激活/未激活状态，并在被点击时更新其外观。配套的测试通过创建按钮、检查其初始状态、模拟点击，并在每次交互后断言按钮确实正确更新状态，从而验证切换功能：

```ts
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { assertEquals } from "jsr:@std/assert";

// 带有事件处理的组件
function createToggleButton(text: string) {
  const doc = new DOMParser().parseFromString("<div></div>", "text/html")!;
  const button = doc.createElement("button");

  button.textContent = text;
  button.dataset.active = "false";

  button.addEventListener("click", () => {
    const isActive = button.dataset.active === "true";
    button.dataset.active = isActive ? "false" : "true";
    button.classList.toggle("active", !isActive);
  });

  return button;
}

Deno.test("事件处理测试", () => {
  // 创建按钮
  const button = createToggleButton("Toggle Me");

  // 初始状态
  assertEquals(button.dataset.active, "false");
  assertEquals(button.classList.contains("active"), false);

  // 模拟点击事件
  button.dispatchEvent(new Event("click"));

  // 第一次点击后的测试
  assertEquals(button.dataset.active, "true");
  assertEquals(button.classList.contains("active"), true);

  // 再次点击
  button.dispatchEvent(new Event("click"));

  // 第二次点击后的测试
  assertEquals(button.dataset.active, "false");
  assertEquals(button.classList.contains("active"), false);
});
```

## 测试 Fetch 请求

测试会发起网络请求的组件需要对 fetch API 进行模拟（mock）。

在下面的示例中，我们将 [mock](/examples/mocking_tutorial/) `fetch` API，以测试一个从外部 API 获取用户数据的函数。该测试会创建一个间谍函数（spy），根据请求的 URL 返回预定义的响应，从而让你无需发起真实网络请求，就能同时测试成功请求和错误处理：

```ts
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import { assertEquals } from "jsr:@std/assert";

// 会获取数据的组件
async function fetchUserData(
  userId: string,
): Promise<{ name: string; email: string }> {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return await response.json();
}

Deno.test("fetch 请求测试", async () => {
  // 模拟 fetch 响应
  const originalFetch = globalThis.fetch;

  const mockFetch = spy(async (input: RequestInfo | URL): Promise<Response> => {
    const url = input.toString();
    if (url === "https://api.example.com/users/123") {
      return new Response(
        JSON.stringify({ name: "John Doe", email: "john@example.com" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response("Not found", { status: 404 });
  });

  // 用 mock 替换全局 fetch
  globalThis.fetch = mockFetch;

  try {
    // 使用有效 ID 调用函数
    const userData = await fetchUserData("123");

    // 断言结果
    assertEquals(userData, { name: "John Doe", email: "john@example.com" });
    assertSpyCalls(mockFetch, 1);

    // 测试错误处理（可选）
    try {
      await fetchUserData("invalid");
      throw new Error("Should have thrown an error for invalid ID");
    } catch (error) {
      assertEquals((error as Error).message, "Failed to fetch user: 404");
    }

    assertSpyCalls(mockFetch, 2);
  } finally {
    // 恢复原始 fetch
    globalThis.fetch = originalFetch;
  }
});
```

## 使用测试步骤进行搭建与清理

对于复杂的测试，你可以使用步骤（steps）将测试逻辑组织成离散的
代码段，使测试更易读、也更易维护。步骤还能让测试中不同部分之间更好地隔离。通过为步骤命名，你可以实现对测试条件的初始化和清理。

```ts
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { assertEquals, assertExists } from "jsr:@std/assert";

Deno.test("复杂的 Web 组件测试", async (t) => {
  const doc = new DOMParser().parseFromString(
    "<!DOCTYPE html><html></html>",
    "text/html",
  );
  const body = doc.createElement("body");
  const container = doc.createElement("div");
  body.appendChild(container);

  await t.step("初始渲染", () => {
    container.innerHTML = `<div id="app"></div>`;
    const app = container.querySelector("#app");
    assertExists(app);
    assertEquals(app.children.length, 0);
  });

  await t.step("添加内容", () => {
    const app = container.querySelector("#app");
    assertExists(app);

    const header = doc.createElement("header");
    header.textContent = "My App";
    app.appendChild(header);

    assertEquals(app.children.length, 1);
    assertEquals(app.firstElementChild?.tagName.toLowerCase(), "header");
  });

  await t.step("响应用户输入", () => {
    const app = container.querySelector("#app");
    assertExists(app);

    const button = doc.createElement("button");
    button.textContent = "Click me";
    button.id = "test-button";
    app.appendChild(button);

    let clickCount = 0;
    button.addEventListener("click", () => clickCount++);

    button.dispatchEvent(new Event("click"));
    button.dispatchEvent(new Event("click"));

    assertEquals(clickCount, 2);
  });

  await t.step("移除内容", () => {
    const app = container.querySelector("#app");
    assertExists(app);

    const header = app.querySelector("header");
    assertExists(header);

    header.remove();
    assertEquals(app.children.length, 1); // 只应剩下按钮
  });
});
```

## 在 Deno 中进行 Web 测试的最佳实践

1. 保持隔离——每个测试都应是自包含的，且不依赖其他测试。

2. 使用名称体现意图——给测试起描述性名称，可以清楚说明在测试什么，并让控制台输出更易读。

3. 在测试后进行清理——移除测试过程中创建的任何 DOM 元素，以防止测试污染。

4. 模拟外部服务（如 API）以加快测试并提高可靠性。

5. 对于复杂组件，使用 `t.step()` 将测试组织成逻辑步骤。

## 运行你的测试

使用 Deno 的 test 命令执行测试：

```bash
deno test
```

对于 Web 测试，你可能需要额外权限：

```bash
deno test --allow-net --allow-read --allow-env
```

🦕 按照本教程中的模式，你可以为你的 Web 应用编写全面的测试，以验证功能和用户体验。

请记住，有效的测试能让应用更稳健，并帮助你在问题到达用户之前就将其发现。
