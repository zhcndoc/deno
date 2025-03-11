---
title: "Web Platform APIs"
description: "A guide to the Web Platform APIs available in Deno. Learn about fetch, events, workers, storage, and other web standard APIs, including implementation details and deviations from browser specifications."
oldUrl:
  - /runtime/manual/runtime/navigator_api/
  - /runtime/manual/runtime/web_platform_apis/
  - /runtime/manual/runtime/location_api/
  - /runtime/manual/runtime/web_storage_api/
  - /runtime/manual/runtime/workers/
---

Deno 简化网络和云开发的一种方式是使用标准的 Web 平台 API（如 `fetch`、WebSockets 等）而不是专有 API。这意味着如果你曾经为浏览器开发过，你可能已经对 Deno 有了一定的熟悉；而如果你正在学习 Deno，你也在投资于对网络的了解。

<a href="/api/web/" class="docs-cta runtime-cta">探索支持的 Web API</a>

下面我们将重点介绍一些 Deno 支持的标准 Web API。

要检查某个 Web 平台 API 是否在 Deno 中可用，你可以点击
[MDN 上的接口](https://developer.mozilla.org/en-US/docs/Web/API#interfaces)
并参考
[其浏览器兼容性表](https://developer.mozilla.org/en-US/docs/Web/API/AbortController#browser_compatibility)。

## fetch

[`fetch`](/api/web/~/fetch) API 可用于发起 HTTP 请求。它的实现符合
[WHATWG `fetch` 规范](https://fetch.spec.whatwg.org/)。

### 规范偏差

- Deno 用户代理没有 cookie 存储。因此，响应中的 `set-cookie` 头不会被处理，也不会从可见的响应头中过滤。
- Deno 不遵循同源策略，因为 Deno 用户代理当前没有原始的概念，也没有 cookie 存储。这意味着 Deno 不需要保护防止跨源泄露身份验证数据。因此 Deno 不实现 WHATWG `fetch` 规范的以下部分：
  - 第 `3.1.` 节：`'Origin'` 头。
  - 第 `3.2.` 节：CORS 协议。
  - 第 `3.5.` 节：CORB。
  - 第 `3.6.` 节：`'Cross-Origin-Resource-Policy'` 头。
  - `原子 HTTP 重定向处理`。
  - `opaqueredirect` 响应类型。
- 使用 `redirect` 模式为 `manual` 的 `fetch` 会返回 `basic` 响应，而不是 `opaqueredirect` 响应。
- 规范对于如何处理 [`file:` URLs](https://fetch.spec.whatwg.org/#scheme-fetch) 上并不明确。Firefox 是唯一实施 `file:` URLs 获取的主流浏览器，即使如此，默认情况下它不工作。从 Deno 1.16 开始，Deno 支持获取本地文件。请参阅下一节以获取详情。
- `request` 和 `response` 头保护已实现，但与浏览器不同，没有任何对允许哪些头名称的限制。
- `referrer`、`referrerPolicy`、`mode`、`credentials`、`cache`、`integrity`、`keepalive` 和 `window` 属性及其在 `RequestInit` 中的相关行为未实现。相关字段不存在于 `Request` 对象上。
- 支持请求体上传流（在 HTTP/1.1 和 HTTP/2 上）。与当前的 fetch 提案不同，实施方案支持双向流。
- 在迭代 `headers` 时，`set-cookie` 头不会被连接。此行为正在
  [进行规范](https://github.com/whatwg/fetch/pull/1346)。

### 获取本地文件

Deno 支持获取 `file:` URLs。这使得编写在服务器上和本地使用相同代码路径的代码变得更容易，同时也更容易编写可以在 Deno CLI 和 Deno Deploy 中工作的代码。

Deno 只支持绝对的文件 URL，这意味着 `fetch("./some.json")` 将不工作。然而需要注意的是，如果指定了 [`--location`](#location)，相对 URL 将使用 `--location` 作为基础，但 `file:` URL 不能作为 `--location` 传递。

要能够获取一个相对于当前模块的资源，该资源在本地或远程都能工作，应该使用 `import.meta.url` 作为基础。例如：

```js
const response = await fetch(new URL("./config.json", import.meta.url));
const config = await response.json();
```

关于获取本地文件的注意事项：

- 对读取资源施加权限，因此需要适当的 `--allow-read` 权限才能读取本地文件。
- 本地获取仅支持 `GET` 方法，对于其他任何方法都会拒绝 promise。
- 不存在的文件会简单地拒绝 promise，并抛出模糊的 `TypeError`。这是为了避免指纹识别攻击的潜在风险。
- 响应中没有设置任何头。因此由消费者决定内容类型或内容长度等。
- 响应体从 Rust 端流式传输，因此大文件是分块可用的，并且可以被取消。

## CustomEvent 和 EventTarget

[DOM 事件 API](/api/web/~/Event) 可用于在应用程序中分发和监听事件。它的实现符合
[WHATWG DOM 规范](https://dom.spec.whatwg.org/#events)。

### 规范偏差

- 事件不会冒泡，因为 Deno 没有 DOM 层次结构，因此没有事件可以冒泡/捕获的树。
- `timeStamp` 属性始终设置为 `0`。

## 类型定义

实现的 Web API 的 TypeScript 定义可以在
[`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.shared_globals.d.ts)
和
[`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.window.d.ts)
文件中找到。

特定于 worker 的定义可以在
[`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.worker.d.ts)
文件中找到。

## Location

Deno 支持来自 Web 的 [`location`](/api/web/~/Location) 全局。

### Location 标志

在 Deno 进程中没有可以用于位置的“网页” URL。因此，我们允许用户通过 CLI 指定一个来模拟文档位置，使用 `--location` 标志。它可以是一个 `http` 或 `https` URL。

```ts
// deno run --location https://example.com/path main.ts

console.log(location.href);
// "https://example.com/path"
```

你必须传递 `--location <href>` 才能让这项工作正常。如果不这样做，任何对 `location` 全局的访问都将抛出错误。

```ts
// deno run main.ts

console.log(location.href);
// error: Uncaught ReferenceError: Access to "location", run again with --location <href>.
```

设置 `location` 或其任何字段通常会导致浏览器中的导航。在 Deno 中不适用，因此在这种情况下将抛出错误。

```ts
// deno run --location https://example.com/path main.ts

location.pathname = "./foo";
// error: Uncaught NotSupportedError: Cannot set "location.pathname".
```

### 扩展用法

在 Web 上，资源解析（不包括模块）通常使用 `location.href` 的值作为基础来处理任何相对 URL。这会影响一些被 Deno 采用的 Web API。

#### Fetch API

```ts
// deno run --location https://api.github.com/ --allow-net main.ts

const response = await fetch("./orgs/denoland");
// Fetches "https://api.github.com/orgs/denoland".
```

如果没有传递 `--location` 标志，上面的 `fetch()` 调用将抛出错误，因为没有可以基于的 Web 类似位置。

#### Worker 模块

```ts
// deno run --location https://example.com/index.html --allow-net main.ts

const worker = new Worker("./workers/hello.ts", { type: "module" });
// Fetches worker module at "https://example.com/workers/hello.ts".
```

:::note

对于上述用例，最好完整传递 URL 而不是依赖 `--location`。如有需要，你可以使用 `URL` 构造函数手动构建相对 URL。

:::

`--location` 标志适用于那些想要模拟文档位置并意识到这仅在应用层级有效的人。不过，你也可以使用它来消除依赖项中不必要访问 `location` 全局造成的错误。

## Web Storage

[Web Storage API](/api/web/storage) 提供了一个用于存储字符串键和值的 API。数据持久化的方式与浏览器相似，并且有 10MB 的存储限制。全局 `sessionStorage` 对象只对当前执行上下文持久化数据，而 `localStorage` 则从一次执行到下一次执行持久化数据。

在浏览器中，`localStorage` 每个 origin 唯一持久化数据（有效的协议加主机名加端口）。从 Deno 1.16 开始，Deno 有一套规则来确定什么是唯一的存储位置：

- 当使用 `--location` 标志时，位置的 origin 用于唯一存储数据。这意味着 `http://example.com/a.ts` 和 `http://example.com/b.ts` 以及 `http://example.com:80/` 将共享相同的存储，但 `https://example.com/` 将是不同的。
- 如果没有位置说明符，但指定了 `--config` 配置文件，则使用该配置文件的绝对路径。这意味着 `deno run --config deno.jsonc a.ts` 和 `deno run --config deno.jsonc b.ts` 将共享相同的存储，但 `deno run --config tsconfig.json a.ts` 将是不同的。
- 如果没有配置或位置说明符，Deno 使用主模块的绝对路径来确定共享的存储。Deno REPL 会生成一个基于 `deno` 启动的当前工作目录的“合成”主模块。这意味着从同一路径多次调用 REPL 将共享持久化的 `localStorage` 数据。

要设置、获取和移除 `localStorage` 中的项，可以使用以下方法：

```ts
// 在 localStorage 中设置一个项
localStorage.setItem("myDemo", "Deno App");

// 从 localStorage 中读取一个项
const cat = localStorage.getItem("myDemo");

// 从 localStorage 中移除一个项
localStorage.removeItem("myDemo");

// 从 localStorage 中移除所有项
localStorage.clear();
```

## Web Workers

Deno 支持 [`Web Worker API`](/api/web/workers)。

Worker 可用于在多个线程上运行代码。每个 `Worker` 实例在单独的线程上运行，仅用于该 worker。

当前 Deno 仅支持 `module` 类型的 workers；因此在创建新 worker 时务必传递 `type: "module"` 选项。

在主 worker 中使用相对模块说明符仅在 CLI 传递 `--location <href>` 时受支持。这不推荐用于可移植性。你可以使用 `URL` 构造函数和 `import.meta.url` 来轻松创建某个附近脚本的说明符。然而，专用 worker 默认具有位置及此能力。

```ts
// 好
new Worker(import.meta.resolve("./worker.js"), { type: "module" });

// 坏
new Worker(import.meta.resolve("./worker.js"));
new Worker(import.meta.resolve("./worker.js"), { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

与常规模块一样，你可以在 worker 模块中使用顶层 `await`。然而，你应该小心始终在第一个 `await` 之前注册消息处理程序，因为否则消息可能会丢失。这不是 Deno 的错误，而是一种特性的遗憾交互，并且在所有支持模块 worker 的浏览器中也会发生。

```ts
import { delay } from "jsr:@std/async@1/delay";

// 第一个 await：等待一秒，然后继续运行模块。
await delay(1000);

// 消息处理程序仅在那 1 秒延迟后设置，因此在那一秒内到达 worker 的一些消息可能在没有注册处理程序时被触发。
self.onmessage = (evt) => {
  console.log(evt.data);
};
```

### 实例权限

创建新的 `Worker` 实例类似于动态导入；因此 Deno 对此操作要求适当的权限。

对于使用本地模块的 worker；需要 `--allow-read` 权限：

```ts title="main.ts"
new Worker(import.meta.resolve("./worker.ts"), { type: "module" });
```

```ts title="worker.ts"
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: read access to "./worker.ts", run again with the --allow-read flag

$ deno run --allow-read main.ts
hello world
```

对于使用远程模块的 worker；需要 `--allow-net` 权限：

```ts title="main.ts"
new Worker("https://example.com/worker.ts", { type: "module" });
```

```ts title="worker.ts"
// 此文件托管在 https://example.com/worker.ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: net access to "https://example.com/worker.ts", run again with the --allow-net flag

$ deno run --allow-net main.ts
hello world
```

### 在 worker 中使用 Deno

```js title="main.js"
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});

worker.postMessage({ filename: "./log.txt" });
```

```js title="worker.js"
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};
```

```text title="log.txt"
hello world
```

```shell
$ deno run --allow-read main.js
hello world
```

### 指定 worker 权限

:::caution

这是一个不稳定的 Deno 特性。了解更多关于
[不稳定特性](/runtime/fundamentals/stability_and_releases/#unstable-apis)。

:::

worker 的权限与 CLI 权限标志类似，这意味着在那里启用的每个权限都可以在 Worker API 级别禁用。你可以在这里找到每个权限选项的更详细描述 [here](/runtime/fundamentals/security/)。

默认情况下，worker 将继承其创建所在线程的权限，但是为了允许用户限制此 worker 的访问，我们在 worker API 中提供了 `deno.permissions` 选项。

对于支持细粒度访问的权限，你可以传入 worker 将访问的所需资源的列表，而对于仅具有开/关选项的权限，你可以分别传递 true/false：

```ts
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: [
        "deno.land",
      ],
      read: [
        new URL("./file_1.txt", import.meta.url),
        new URL("./file_2.txt", import.meta.url),
      ],
      write: false,
    },
  },
});
```

细粒度访问权限同时支持绝对路径和相对路径作为参数，但请注意相对路径将相对于实例化 worker 的文件进行解析，而不是 worker 文件当前所在的路径：

```ts
const worker = new Worker(
  new URL("./worker/worker.js", import.meta.url).href,
  {
    type: "module",
    deno: {
      permissions: {
        read: [
          "/home/user/Documents/deno/worker/file_1.txt",
          "./worker/file_2.txt",
        ],
      },
    },
  },
);
```

`deno.permissions` 及其子项都支持选项 `"inherit"`，这意味着它将借用其父权限：

```ts
// 此 worker 将继承其父权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "inherit",
  },
});
```

```ts
// 此 worker 将仅继承其父的网络权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      env: false,
      hrtime: false,
      net: "inherit",
      ffi: false,
      read: false,
      run: false,
      write: false,
    },
  },
});
```

不指定 `deno.permissions` 选项或其子项将导致 worker 默认继承：

```ts
// 此 worker 将继承其父权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});
```

```ts
// 此 worker 将继承其父的所有权限，但不包括网络
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: false,
    },
  },
});
```

通过将 `"none"` 传递给 `deno.permissions` 选项，可以完全禁用 worker 的权限：

```ts
// 此 worker 将不启用任何权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "none",
  },
});
```

## 其他 API 从规范的偏差

### 缓存 API

仅实现以下 API：

- [CacheStorage::open()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open)
- [CacheStorage::has()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/has)
- [CacheStorage::delete()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete)
- [Cache::match()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
- [Cache::put()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)
- [Cache::delete()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete)

与浏览器相比，几个地方有所不同：

1. 你不能将相对路径传递给 API。请求可以是 Request、URL 的实例或 URL 字符串。
2. `match()` 和 `delete()` 尚不支持查询选项。