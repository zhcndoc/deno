---
title: "测试清理器"
description: "Deno 的测试清理器可以捕获测试中的异步操作泄漏、资源泄漏以及意外退出。了解每种清理器检查什么，以及如何启用它们。"
oldUrl:
  - /runtime/manual/basics/testing/sanitizers/
---

[`deno test`](/runtime/reference/cli/test/) 运行器提供了多个清理器，
用于捕获测试中 assertion 无法发现的异常行为：泄漏的异步
操作、未关闭的资源以及意外的进程退出。

## 资源清理器

资源清理器会确保测试期间创建的所有 I/O 资源都已关闭，
以防止泄漏。

I/O 资源包括例如 [`Deno.FsFile`](/api/deno/~/Deno.FsFile) 句柄、
网络连接、[`fetch`](/api/web/~/fetch) 响应体、计时器，以及其他
不会被自动垃圾回收的资源。

你应该在完成使用后始终关闭资源。例如，关闭文件：

```ts
const file = await Deno.open("hello.txt");
// 对文件执行一些操作
file.close(); // <- 使用完文件后始终关闭它
```

关闭网络连接：

```ts
const conn = await Deno.connect({ hostname: "example.com", port: 80 });
// 对连接执行一些操作
conn.close(); // <- 使用完连接后始终关闭它
```

关闭 [`fetch`](/api/web/~/fetch) 响应体：

```ts
const response = await fetch("https://example.com");
// 对响应执行一些操作
await response.body?.cancel(); // <- 如果没有以其他方式消费它，使用完后始终取消响应体
```

从 Deno 2.8 开始，此清理器**默认关闭**。你可以通过
`sanitizeResources: true` 启用它，或使用
[全局启用清理器](#enabling-sanitizers-globally) 中描述的全局机制之一。

```ts
Deno.test({
  name: "不允许泄漏",
  async fn() {
    using file = await Deno.open("hello.txt");
    // ...
  },
  sanitizeResources: true,
});
```

## 异步操作清理器

异步操作清理器会确保测试中启动的所有异步操作都在
测试结束前完成。这一点很重要，因为如果某个异步
操作没有被 await，测试会在该操作完成前结束，
即使该操作实际上可能已经失败，测试也会被标记为成功。

你应该在测试中始终 await 所有异步操作。例如：

```ts
Deno.test({
  name: "异步操作测试",
  async fn() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});
```

从 Deno 2.8 开始，此清理器**默认关闭**。你可以通过
`sanitizeOps: true` 启用它，或使用下面描述的全局机制之一。

```ts
Deno.test({
  name: "不允许泄漏的操作",
  async fn() {
    await someAsyncWork();
  },
  sanitizeOps: true,
});
```

## 全局启用清理器

如果你想要 pre-2.8 的行为（对每个测试都开启资源和操作清理器），
可以在以下五个作用域中的任意一个重新启用它们。更高优先级的设置
会覆盖更低优先级的设置。

1. **按测试**（最高优先级）：

   ```ts
   Deno.test({
     name: "严格模式",
     sanitizeOps: true,
     sanitizeResources: true,
     fn() {/* … */},
   });
   ```

2. **按模块**，使用
   [`Deno.test.sanitizer()`](/api/deno/~/Deno.test.sanitizer)：

   ```ts
   Deno.test.sanitizer({ ops: true, resources: true });

   Deno.test("使用模块级清理器", () => {/* … */});
   ```

3. **CLI 标志**：`--sanitize-ops` 和 `--sanitize-resources`。

4. **环境变量**：`DENO_TEST_SANITIZE_OPS=1` 和
   `DENO_TEST_SANITIZE_RESOURCES=1`。

5. **`deno.json`**（最低优先级）：

   ```jsonc
   {
     "test": {
       "sanitizeOps": true,
       "sanitizeResources": true
     }
   }
   ```

## 退出清理器

退出清理器会确保被测试的代码不会调用
[`Deno.exit()`](/api/deno/~/Deno.exit)，因为这可能会造成测试成功的假象。

此清理器默认启用，但可以通过
`sanitizeExit: false` 关闭。

```ts
Deno.test({
  name: "错误的成功",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// 这个测试永远不会运行，因为进程会在“错误的成功”测试期间退出
Deno.test({
  name: "失败的测试",
  fn() {
    throw new Error("这个测试失败了");
  },
});
```
