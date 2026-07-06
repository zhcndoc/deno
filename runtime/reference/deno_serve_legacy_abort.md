---
last_modified: 2026-07-02
title: "Deno.serve 请求中止行为"
description: "了解 Deno.serve 中 legacy request.signal abort 行为、其变化原因，以及如何使用 --unstable-no-legacy-abort 标志检测请求完成。"
---

[`Deno.serve`](/api/deno/~/Deno.serve) 历来会在请求完成时触发请求的
[`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
（`request.signal`）上的 `abort` 事件，**包括当你的处理器返回成功响应时也是如此**。该信号原本用于表示客户端已经离开（例如，连接在响应发送前已关闭），但实际上它也会在每次成功响应时触发。

这就是“legacy abort”行为，并且目前默认启用。
[`--unstable-no-legacy-abort`](/runtime/reference/cli/unstable_flags/#--unstable-no-legacy-abort)
标志会启用修正后的行为，该行为将在即将到来的版本中成为默认行为。

## 为什么行为正在改变

由于信号会在成功时中止，监视 `request.signal` 的代码无法区分“客户端断开连接”和“响应已正常送达”。这会破坏许多常见库，最明显的是 Node 风格的 HTTP 代理，例如 [`http-proxy`](https://www.npmjs.com/package/http-proxy) 和 [`http-proxy-middleware`](https://www.npmjs.com/package/http-proxy-middleware)（例如被 Vite 等使用），它们会将上游中止视为真正的失败，并抛出一个虚假的错误。

有关背景请参见问题 [#28850](https://github.com/denoland/deno/issues/28850) 和 [#29111](https://github.com/denoland/deno/issues/29111)。

## 新行为

启用 `--unstable-no-legacy-abort` 后，`request.signal` **仅在** 客户端实际取消请求，或者在响应尚未完全发送之前连接丢失时才会中止。成功的响应不再会触发中止。

```ts
Deno.serve((req) => {
  req.signal.addEventListener("abort", () => {
    // 使用 --unstable-no-legacy-abort 时，这只会在真实的客户端
    // 断开连接时运行，而不会在每次成功响应时运行。
    console.log("client went away");
  });

  return new Response("hello");
});
```

## 检测请求何时已完全传送

如果你过去依赖旧版的 abort 来判断响应是否已完全发送，
请改用处理函数第二个参数上的 `completed` promise
（[`ServeHandlerInfo`](/api/deno/~/Deno.ServeHandlerInfo)）。它是
一种面向所有模式、且符合预期的方式来观察传送过程：

```ts
Deno.serve((req, info) => {
  info.completed
    .then(() => {
      // 响应（包括流式主体）已成功发送。
      console.log("response fully delivered");
    })
    .catch((err) => {
      // 传送在中途失败（客户端断开连接、写入错误，……）。
      console.error("response was not sent successfully:", err);
    });

  return new Response(someStream);
});
```

`info.completed`：

- 在响应（包括任何流式主体）已发送到客户端后，**resolve**
- 如果在完成之前传送失败，则 **reject**

这个 promise 是惰性创建的，因此从不读取 `info.completed` 的处理函数
不会付出额外成本。

## 迁移

1. 在测试时启用该标志：

   ```sh
   deno run --unstable-no-legacy-abort main.ts
   ```

   或者在 `deno.json` 中：

   ```json title="deno.json"
   {
     "unstable": ["no-legacy-abort"]
   }
   ```

2. 仅将 `request.signal` 用于取消操作，并将完成/清理逻辑移到
   `info.completed` 上（或移到处理程序的返回路径上）。

一旦你采用了新的行为，当它成为默认行为时，你的代码将可以继续
保持不变地工作。
