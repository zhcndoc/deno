---
title: "在 Deno 中使用 Testing Library"
description: "在 deno test 中使用 @testing-library/dom 和 happy-dom 测试 DOM 行为：按 role 和文本查询、模拟事件，以及该设置所需的权限。"
url: /examples/testing_library_tutorial/
---

[Testing Library](https://testing-library.com/) 鼓励针对用户能看到的内容（角色、标签、文本）进行断言，而不是实现细节。它可在 `deno test` 中运行，并使用来自 [happy-dom](https://github.com/capricorn86/happy-dom) 的模拟 DOM。

## 安装包

```sh
deno add happy-dom @testing-library/dom
```

## 查询并与 DOM 交互

happy-dom 提供 document；Testing Library 提供查询：

```ts title="button.test.ts"
import { Window } from "happy-dom";
import { getByRole, getByText } from "@testing-library/dom";
import { assertEquals } from "jsr:@std/assert";

Deno.test("renders and clicks a button", () => {
  const window = new Window();
  const document = window.document;
  document.body.innerHTML = `<button>次数: 0</button>`;

  let count = 0;
  const button = getByRole(document.body as never, "button");
  button.addEventListener("click", () => {
    count++;
    button.textContent = `次数: ${count}`;
  });
  button.click();

  assertEquals(getByText(document.body as never, "次数: 1"), button);
});
```

由于 happy-dom 的依赖在启动时会检查一些环境变量，因此请使用环境和读取权限运行：

```sh
$ deno test --allow-env --allow-read
ok | 1 passed | 0 failed (14ms)
```

:::note

`as never` 这些类型断言用于弥补类型不匹配：Testing Library 的类型期望的是浏览器的 `HTMLElement`，而 happy-dom 提供的是它自己兼容的实现。运行时这些查询可以正常工作。

:::

## 为什么使用查询而不是选择器

如果元素不再是按钮，`getByRole("button")` 会使测试失败；如果可见文本发生变化，`getByText` 也会失败：这些断言追踪的是用户的实际体验，而不是类名或 DOM 结构。完整的查询目录（`findBy`、`queryAll`、标签和占位符查询）位于 [Testing Library 文档](https://testing-library.com/docs/queries/about)。

## 这适用于什么场景

如果要在不使用 Testing Library 的情况下测试 DOM 代码（使用 `deno-dom` 或直接解析 HTML），请参见 [测试 Web 应用](/examples/web_testing_tutorial/)。像 `@testing-library/react` 这样的框架封装，则是在相同设置之上，在中间加上框架渲染器。
