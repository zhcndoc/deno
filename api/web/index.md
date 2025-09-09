---
title: "Web 平台 API"
description: "Deno 中可用的 Web 平台 API 指南。了解 fetch、事件、workers、存储以及其他 Web 标准 API，包括实现细节及与浏览器规范的偏差。"
layout: doc.tsx
oldUrl:
  - /runtime/manual/runtime/navigator_api/
  - /runtime/manual/runtime/web_platform_apis/
  - /runtime/manual/runtime/location_api/
  - /runtime/manual/runtime/web_storage_api/
  - /runtime/manual/runtime/workers/
---

Deno 实现了许多在现代浏览器中可用的标准 Web 平台 API。这意味着如果您曾为 Web 开发，您很可能已经熟悉许多 Deno 的 API。学习 Deno 也就是对 Web 平台知识的投入。

本节提供了所有 Deno 支持的 Web API 的全面文档。您可以[浏览所有符号](/api/web/all_symbols)以查看完整列表，或按类别搜索。点击任何函数或接口即可查看带示例的详细文档。

## 核心 Web API

Deno 支持一个全面的 Web 标准 API 集：

### 网络与通信

- **[`fetch`](/api/web/~/fetch)** - 遵循 WHATWG fetch 规范的 HTTP 请求
- **[WebSocket](/api/web/~/WebSocket)** - 通过 TCP 的全双工通信
- **[Server-Sent Events](/api/web/~/EventSource)** - 服务器到客户端的事件流
- **[BroadcastChannel](/api/web/~/BroadcastChannel)** - 跨上下文消息传递

### 存储与状态

- **[Web Storage](/api/web/~/Storage)** - localStorage 和 sessionStorage API
- **[Cache API](/api/web/~/Cache)** - HTTP 响应缓存接口
- **[IndexedDB](/api/web/~/IDBDatabase)** - 客户端数据库存储

### Workers 与并发

- **[Web Workers](/api/web/~/Worker)** - 后台线程执行
- **[SharedArrayBuffer](/api/web/~/SharedArrayBuffer)** - 线程间共享内存

### 流与数据

- **[Streams API](/api/web/~/ReadableStream)** - 可组合的流数据接口
- **[Compression](/api/web/~/CompressionStream)** - 内置 gzip/deflate 压缩
- **[File API](/api/web/~/File)** - 文件和 Blob 操作

### 事件与 DOM

- **[Event API](/api/web/~/Event)** - 标准事件处理模式
- **[CustomEvent](/api/web/~/CustomEvent)** - 自定义事件创建与派发
- **[EventTarget](/api/web/~/EventTarget)** - 事件监听管理

### 编码与加密

- **[TextEncoder/TextDecoder](/api/web/~/TextEncoder)** - UTF-8 文本编解码
- **[Web Crypto](/api/web/~/SubtleCrypto)** - 加密操作
- **[URL API](/api/web/~/URL)** - URL 解析与操作

### 计时器与性能

- **[Performance API](/api/web/~/Performance)** - 高精度计时
- **[Timers](/api/web/~/setTimeout)** - setTimeout、setInterval 和 setImmediate

## 主要优势

- **标准兼容**：API 遵循 WHATWG 和 W3C 规范
- **跨平台**：代码可在 Deno、浏览器及其他运行时中一致运行
- **无 Polyfills**：原生实现带来最佳性能
- **面向未来**：基于不断演进的 Web 标准

## 使用示例

### 发起 HTTP 请求

```javascript
const response = await fetch("https://api.github.com/users/denoland");
const data = await response.json();
console.log(data);
```

### 使用 Web Workers

```javascript
// main.js
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});

worker.postMessage({ task: "process_data", data: [1, 2, 3] });
worker.onmessage = (e) => console.log("Result:", e.data);
```

```javascript
// worker.js
self.onmessage = (e) => {
  const { task, data } = e.data;
  const result = data.map((x) => x * 2);
  self.postMessage(result);
};
```

### 本地存储

```javascript
// 跨会话持久化数据
localStorage.setItem("user_preference", "dark_mode");
const preference = localStorage.getItem("user_preference");
```

## 兼容性说明

欲检验某 Web 平台 API 是否在 Deno 中可用，请参考
[MDN](https://developer.mozilla.org/en-US/docs/Web/API#interfaces) 上的接口文档及其浏览器兼容性表。

多数 API 按规范实现，针对服务器环境做了部分 Deno 特有的适配。以下记录了显著差异。

## fetch

[`fetch`](/api/web/~/fetch) API 可用于发起 HTTP 请求。其实现遵照
[WHATWG `fetch` 规范](https://fetch.spec.whatwg.org/)。

### 规范偏差

- Deno 用户代理不含 cookie 存储。因此响应中的 `set-cookie` 头不会被处理，也不会在可见响应头中呈现。
- Deno 不遵守同源策略，因为 Deno 用户代理目前没有起源的概念，也没有 cookie 存储。这意味着 Deno 不需要防止跨源泄露经过身份验证的数据。基于此，Deno 不实现 WHATWG `fetch` 规范中以下部分：
  - 第 `3.1. 'Origin' header` 节。
  - 第 `3.2. CORS protocol` 节。
  - 第 `3.5. CORB` 节。
  - 第 `3.6. 'Cross-Origin-Resource-Policy' header` 节。
  - `原子 HTTP 重定向处理`。
  - `opaqueredirect` 响应类型。
- `redirect` 模式为 `manual` 的 `fetch` 将返回 `basic` 响应，而非 `opaqueredirect` 响应。
- 规范对 [`file:` URL 的处理方式](https://fetch.spec.whatwg.org/#scheme-fetch)描述模糊。Firefox 是唯一实现了 `file:` URL fetch 的主流浏览器，且默认不启用。自 Deno 1.16 起，Deno 支持本地文件的 fetch，详见下一节。
- `request` 和 `response` 头的保护机制已实现，但与浏览器不同，Deno 对允许的头名没有限制。
- `RequestInit` 中的 `referrer`、`referrerPolicy`、`mode`、`credentials`、`cache`、`integrity`、`keepalive` 和 `window` 属性及其相关行为未实现。相关字段不会出现在 `Request` 对象中。
- 请求体上传流式支持（HTTP/1.1 和 HTTP/2），且实现支持双工流式，与当前 fetch 提案不同。
- 在 `headers` 迭代器中，`set-cookie` 头不会被合并。这一行为正在[制定规范中](https://github.com/whatwg/fetch/pull/1346)。

### 本地文件 fetch

Deno 支持 fetch `file:` URL。这使得在服务器和本地都使用同一代码路径更为简单，也方便编写能在 Deno CLI 和 Deno Deploy 中工作的代码。

Deno 仅支持绝对文件 URL，这意味着 `fetch("./some.json")` 不会工作。需要注意的是，若指定了 [`--location`](#location)，则相对 URL 会以 `--location` 作为基准，但 `--location` 不能传入 `file:` URL。

若需基于当前模块相对路径 fetch 资源（无论模块本地还是远程均有效），应使用 `import.meta.url` 作为基准。例如：

```js
const response = await fetch(new URL("./config.json", import.meta.url));
const config = await response.json();
```

关于本地文件 fetch 的说明：

- 权限会作用于读取资源，因此需合适的 `--allow-read` 权限才可读取本地文件。
- 本地 fetch 仅支持 `GET` 方法，其他方法会拒绝 Promise。
- 文件不存在时会以模糊的 `TypeError` 拒绝 Promise，避免潜在的指纹攻击。
- 响应不包含任何头信息，消费者需自行判断内容类型或长度。
- 响应体从 Rust 端流式传输，支持大文件分块加载且可取消。

## CustomEvent 和 EventTarget

[DOM 事件 API](/api/web/~/Event) 可用于派发并监听应用中发生的事件。其实现遵照[WHATWG DOM 规范](https://dom.spec.whatwg.org/#events)。

### 事件 API 偏差

- 事件不冒泡，因为 Deno 不包含 DOM 层级结构，没有事件冒泡/捕获的树结构。
- `timeStamp` 属性始终为 `0`。

## 类型定义

已实现 Web API 的 TypeScript 定义位于
[`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.shared_globals.d.ts)
和
[`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.window.d.ts)
文件中。

针对 workers 的定义位于
[`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.worker.d.ts)
文件内。

## Location

Deno 支持来自 Web 的 [`location`](/api/web/~/Location) 全局变量。

### Location 标志

Deno 进程中不存在可用作 location 的“网页” URL。我们允许用户通过 CLI 的 `--location` 标志来模拟文档的 location。它可以是 `http` 或 `https` URL。

```ts
// deno run --location https://example.com/path main.ts

console.log(location.href);
// "https://example.com/path"
```

若无 `--location <href>` 参数，访问 `location` 全局将抛出错误。

```ts
// deno run main.ts

console.log(location.href);
// error: Uncaught ReferenceError: Access to "location", run again with --location <href>.
```

在浏览器中，设置 `location` 或其字段通常会导致导航。在 Deno 中不适用，会抛出异常。

```ts
// deno run --location https://example.com/path main.ts

location.pathname = "./foo";
// error: Uncaught NotSupportedError: Cannot set "location.pathname".
```

### 扩展用法

在 Web 中，资源解析（不含模块）通常以 `location.href` 作为任何相对 URL 的根基。这影响了 Deno 采纳的一些 Web API。

#### Fetch API

```ts
// deno run --location https://api.github.com/ --allow-net main.ts

const response = await fetch("./orgs/denoland");
// 请求 "https://api.github.com/orgs/denoland"
```

若未传入 `--location`，上述 `fetch()` 调用将抛出异常，因为没有对应的 Web 位置。

#### Worker 模块

```ts
// deno run --location https://example.com/index.html --allow-net main.ts

const worker = new Worker("./workers/hello.ts", { type: "module" });
// 载入工作者模块位于 "https://example.com/workers/hello.ts"
```

:::note

对于上述用例，建议传入完整 URL 而非依赖 `--location`。需要时可用 `URL` 构造函数结合 `import.meta.url` 手动构造相对 URL。

:::

`--location` 标志适合有意模拟文档位置且明确此操作仅用于应用层的用户。您也可用它避免错误，针对某些随意访问 `location` 全局的依赖。

## Web Storage

[Web Storage API](/api/web/storage) 提供字符串键值存储的 API。数据持久化操作类似浏览器，且有 10MB 的存储限制。全局对象 `sessionStorage` 只在当前执行上下文中持久化，而 `localStorage` 跨执行上下文持久化。

在浏览器里，`localStorage` 按起源（协议+主机名+端口）持久化数据。自 Deno 1.16 起，Deno 按一套规则确定唯一存储位置：

- 使用 `--location` 时，使用其起源唯一存储数据。比如 `http://example.com/a.ts`、`http://example.com/b.ts` 和 `http://example.com:80/` 共享存储，但 `https://example.com/` 则独立。
- 无 location 指定，但指定了 `--config` 配置文件时，使用该配置文件的绝对路径来确定。这意味着
  `deno run --config deno.jsonc a.ts` 与 `deno run --config deno.jsonc b.ts` 共享存储，但 `deno run --config tsconfig.json a.ts` 则单独存储。
- 若无配置文件和 location 指定，Deno 使用入口模块绝对路径判断共享存储。Deno REPL 生成基于当前工作目录的“合成”入口模块，意味着从同一路径多次启动 REPL 会共享 `localStorage`。

对 `localStorage` 设置、读取和删除条目示例如下：

```ts
// 设置 localStorage 中的项
localStorage.setItem("myDemo", "Deno App");

// 读取 localStorage 中的项
const cat = localStorage.getItem("myDemo");

// 删除 localStorage 中的项
localStorage.removeItem("myDemo");

// 清除所有 localStorage 项
localStorage.clear();
```

## Web Workers

Deno 支持 [`Web Worker API`](/api/web/workers)。

Worker 可用于多线程运行代码。每个 `Worker` 实例独占一个线程。

当前 Deno 仅支持 `module` 类型 Worker；因此新建 Worker 时需传入 `type: "module"`。

主线程中的相对模块路径只支持 CLI 传入 `--location <href>`。不建议为兼容性而使用此方法。可用 `URL` 构造函数与 `import.meta.url` 轻松构造附近脚本的模块路径。专用 Worker 默认有 location 支持。

```ts
// 推荐
new Worker(import.meta.resolve("./worker.js"), { type: "module" });

// 不推荐
new Worker(import.meta.resolve("./worker.js"));
new Worker(import.meta.resolve("./worker.js"), { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

如常规模块，Worker 模块中可使用顶层 `await`。但务必在首次 `await` 前先注册消息处理器，否则消息可能丢失。这不是 Deno 的错误，而是功能交互导致的，且所有支持模块 Worker 的浏览器都存在该问题。

```ts
import { delay } from "jsr:@std/async@1/delay";

// 第一次 await：等待一秒，然后继续执行模块。
await delay(1000);

// 1 秒延时后才设置消息处理器，因此该期间到达 Worker 的一些消息可能因为无处理器而丢失。
self.onmessage = (evt) => {
  console.log(evt.data);
};
```

### 创建 Worker 的权限

创建新 `Worker` 实例类似动态导入；因此 Deno 要求具备相应权限。

本地模块 Worker 需要 `--allow-read` 权限：

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

远程模块 Worker 需要 `--allow-net` 权限：

```ts title="main.ts"
new Worker("https://example.com/worker.ts", { type: "module" });
```

```ts title="worker.ts"
// 该文件托管于 https://example.com/worker.ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: net access to "https://example.com/worker.ts", run again with the --allow-net flag

$ deno run --allow-net main.ts
hello world
```

### Worker 中使用 Deno

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

### 指定 Worker 权限

:::caution

这是不稳定的 Deno 功能。详见[不稳定功能](/runtime/fundamentals/stability_and_releases/#unstable-apis)。

:::

Worker 的权限可类比 CLI 权限标志，每个启用的权限均可在 Worker API 级别禁用。具体权限选项详情见[安全文档](/runtime/fundamentals/security/)。

默认情况下，Worker 会继承创建它的线程的权限，但为便于限制该 Worker 的访问权限，Worker API 提供了 `deno.permissions` 选项。

对支持细粒度访问的权限，您可传入 Worker 可访问的资源列表；对仅开/关切换的权限，传 `true` 或 `false` 表示启用与否：

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

细粒度访问权限可接受绝对和相对路径，但相对路径会相对于 Worker 实例化的文件所在位置解析，而非 Worker 文件当前所处路径：

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

`deno.permissions` 及其子选项支持 `"inherit"`，表示继承父权限：

```ts
// 此 Worker 继承父权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "inherit",
  },
});
```

```ts
// 此 Worker 仅继承父线程的 net 权限
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

未指定 `deno.permissions` 或其子选项时，默认继承父权限：

```ts
// 此 Worker 继承父权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
});
```

```ts
// 此 Worker 继承父权限，除 net 权限禁用
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: {
      net: false,
    },
  },
});
```

您亦可通过将 `"none"` 传给 `deno.permissions` 选项，完全禁用 Worker 权限：

```ts
// 此 Worker 不启用任何权限
const worker = new Worker(import.meta.resolve("./worker.js"), {
  type: "module",
  deno: {
    permissions: "none",
  },
});
```

## 其他 API 规范偏差

### Cache API

仅实现以下 API：

- [CacheStorage::open()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open)
- [CacheStorage::has()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/has)
- [CacheStorage::delete()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete)
- [Cache::match()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
- [Cache::put()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)
- [Cache::delete()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete)

与浏览器相比有几点不同：

1. 不支持传入相对路径。请求可以是 Request 实例、URL 或 url 字符串。
2. `match()` 和 `delete()` 还不支持查询选项。