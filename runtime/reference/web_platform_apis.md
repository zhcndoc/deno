---
last_modified: 2026-06-25
title: "Web 平台 API"
description: "Deno 中可用的 Web 平台 API 指南。了解 fetch、事件、工作线程、存储以及其他 Web 标准 API，包括实现细节和与浏览器规范的差异。"
oldUrl:
  - /runtime/manual/runtime/navigator_api/
  - /runtime/manual/runtime/web_platform_apis/
  - /runtime/manual/runtime/location_api/
  - /runtime/manual/runtime/web_storage_api/
  - /runtime/manual/runtime/workers/
---

Deno 简化网络和云开发的一种方式是使用标准的 Web 平台 API（如 `fetch`、WebSockets 等）而不是专有 API。这意味着如果你曾经为浏览器开发过，你可能已经对 Deno 有了一定的熟悉；而如果你正在学习 Deno，你也在投资于对网络的了解。

<a href="/api/web/" class="docs-cta runtime-cta">查看受支持的 Web API</a>

下面我们将重点介绍一些 Deno 支持的标准 Web API。

要检查某个 Web 平台 API 是否在 Deno 中可用，你可以点击
[MDN 上的接口](https://developer.mozilla.org/en-US/docs/Web/API#interfaces)
并参考
[其浏览器兼容性表](https://developer.mozilla.org/en-US/docs/Web/API/AbortController#browser_compatibility)。

## fetch

[`fetch`](/api/web/~/fetch) API 可用于发起 HTTP 请求。它的实现符合
[WHATWG `fetch` 规范](https://fetch.spec.whatwg.org/)。

### 规范偏差

- Deno 用户代理没有 cookie jar。因此，响应上的 `set-cookie`
  头不会被处理，也不会从可见的响应
  头中被过滤掉。
- Deno 不遵循同源策略，因为 Deno 用户代理
  目前没有 origin 的概念，也没有 cookie
  jar。这意味着 Deno 不需要防止经过身份验证的数据跨源泄漏。
  因此，Deno 未实现 WHATWG `fetch` 规范中的以下
  部分：
  - 第 `3.1. 'Origin' header` 节。
  - 第 `3.2. CORS protocol` 节。
  - 第 `3.5. CORB` 节。
  - 第 `3.6. 'Cross-Origin-Resource-Policy' header` 节。
  - `Atomic HTTP redirect handling`。
  - `opaqueredirect` 响应类型。
- `redirect` 模式为 `manual` 的 `fetch` 将返回 `basic` 响应，
  而不是 `opaqueredirect` 响应。
- 该规范对
  [如何处理 `file:` URLs](https://fetch.spec.whatwg.org/#scheme-fetch) 表述得并不明确。
  Firefox 是唯一实现了获取 `file:` URLs 的主流浏览器，
  而且即便如此，默认情况下也无法工作。截至 Deno 1.16，Deno 支持
  获取本地文件。详见下一节。
- `request` 和 `response` 头守卫已实现，但与
  浏览器不同，它们对允许哪些头名称没有任何限制。
- `referrer`、`referrerPolicy`、`mode`、`credentials`、`cache`、`integrity`、
  `keepalive` 和 `window` 属性及其在
  `RequestInit` 中的相关行为均未实现。相关字段不存在于
  [`Request`](/api/web/~/Request) 对象上。
- `RequestInit` 的 `priority` 成员（`"auto"`、`"high"` 或 `"low"`）会被
  接受并校验。按照 Fetch 标准，它是只写的，因此不会作为属性暴露回
  `Request` 对象上。
- 支持请求体上传流式传输（在 HTTP/1.1 和 HTTP/2 上）。不同于
  当前的 fetch 提案，实现支持双工流式传输。
- 在 `headers` 迭代器中迭代时，`set-cookie` 头不会被合并连接。
  这一行为正在
  [被规范化](https://github.com/whatwg/fetch/pull/1346)。

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

## Structured Clone 和可转移对象

Deno 支持 [`structuredClone()`](/api/web/~/structuredClone) 和
[`postMessage()`](/api/web/~/Worker)，用于在不同上下文之间（例如主线程和 Web Worker 之间）克隆和传输对象。

### 可序列化类型

这些类型可以通过 `structuredClone()` 克隆，并通过 `postMessage()` 发送：

| 类型                                      | 说明                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| 基本类型                                | `string`、`number`、`boolean`、`null`、`undefined`、`bigint`                                 |
| `Array`、`Object`、`Map`、`Set`           | 包括嵌套结构和循环引用                                          |
| `Date`、`RegExp`                          |                                                                                              |
| `ArrayBuffer`、`TypedArray`、`DataView`   | 默认复制，或可转移（见下文）                                                |
| `Error` 类型                             | `Error`、`EvalError`、`RangeError`、`ReferenceError`、`SyntaxError`、`TypeError`、`URIError` |
| [`Blob`](/api/web/~/Blob)                 | 需要 Deno 2.8+                                                                           |
| [`File`](/api/web/~/File)                 | 需要 Deno 2.8+                                                                           |
| [`DOMException`](/api/web/~/DOMException) |                                                                                              |
| [`CryptoKey`](/api/web/~/CryptoKey)       |                                                                                              |

### 可转移类型

这些类型可以通过 `structuredClone()` 中的 `transfer` 选项或 `postMessage()` 中的 `transfer` 列表进行 _转移_（而非复制）。转移后，原始对象将无法使用：

| 类型                                            | 说明                                    |
| ----------------------------------------------- | ---------------------------------------- |
| [`ArrayBuffer`](/api/web/~/ArrayBuffer)         | 将底层内存转移给接收方 |
| [`MessagePort`](/api/web/~/MessagePort)         | 将端口转移到另一个上下文    |
| [`ReadableStream`](/api/web/~/ReadableStream)   | 将流转移到另一个上下文  |
| [`WritableStream`](/api/web/~/WritableStream)   | 将流转移到另一个上下文  |
| [`TransformStream`](/api/web/~/TransformStream) | 将流转移到另一个上下文  |

```ts
// 克隆一个 Blob
const blob = new Blob(["hello"], { type: "text/plain" });
const cloned = structuredClone(blob);
console.log(await cloned.text()); // "hello"

// 通过 MessageChannel 转移 ArrayBuffer
const buffer = new ArrayBuffer(1024);
const ch = new MessageChannel();
ch.port1.postMessage(buffer, [buffer]);
// buffer.byteLength 现在是 0（已转移）
```

## CustomEvent 和 EventTarget

[DOM 事件 API](/api/web/~/Event) 可用于在应用程序中分发和监听事件。它的实现符合
[WHATWG DOM 规范](https://dom.spec.whatwg.org/#events)。

### 规范偏差

- 事件不会冒泡，因为 Deno 没有 DOM 层次结构，因此没有事件可以冒泡/捕获的树。
- `timeStamp` 属性始终设置为 `0`。

## 类型定义

已实现的 Web API 的 TypeScript 定义可以在
[`lib.deno.shared_globals.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.shared_globals.d.ts)
和
[`lib.deno.window.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.window.d.ts)
文件中找到。

特定于 worker 的定义可以在
[`lib.deno.worker.d.ts`](https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.worker.d.ts)
文件中找到。

## 位置

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
// error: Uncaught ReferenceError: 访问 "location" 时出错，请使用 --location <href> 重新运行。
```

设置 `location` 或其任何字段通常会导致浏览器中的导航。在 Deno 中不适用，因此在这种情况下将抛出错误。

```ts
// deno run --location https://example.com/path main.ts

location.pathname = "./foo";
// error: Uncaught NotSupportedError: 无法设置 "location.pathname"。
```

### 扩展用法

在 Web 上，资源解析（不包括模块）通常使用 `location.href` 的值作为基础来处理任何相对 URL。这会影响一些被 Deno 采用的 Web API。

#### Fetch API

```ts
// deno run --location https://api.github.com/ --allow-net main.ts

const response = await fetch("./orgs/denoland");
// 获取 "https://api.github.com/orgs/denoland"。
```

如果没有传递 `--location` 标志，上面的 `fetch()` 调用将抛出错误，因为没有可以基于的 Web 类似位置。

#### Worker 模块

```ts
// deno run --location https://example.com/index.html --allow-net main.ts

const worker = new Worker("./workers/hello.ts", { type: "module" });
// 在 "https://example.com/workers/hello.ts" 获取 worker 模块。
```

:::note

对于上述用例，最好直接传入完整 URL，而不是依赖 `--location`。如果需要，你可以使用
[`URL`](/api/web/~/URL) 构造函数手动以相对 URL 为基础进行解析。

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
localStorage.setItem("myDemo", "Deno 应用");

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

主 worker 中对相对模块标识符的使用，仅在 CLI 传递了 `--location <href>` 时才受支持。这不利于可移植性。你可以改用 [`URL`](/api/web/~/URL) 构造函数和 `import.meta.url`，轻松为附近的脚本创建一个标识符。不过，专用 worker 默认具有位置，因此也具备此能力。

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

### 向主线程发送消息

通信是双向的。主线程使用 `worker.postMessage()` 向 worker 发送数据，并使用 `worker.onmessage` 监听回复。在 worker 内部，`self.onmessage` 接收消息，而 `self.postMessage()` 将结果发回：

```ts title="main.ts"
const worker = new Worker(import.meta.resolve("./worker.ts"), {
  type: "module",
});

// 从 worker 接收结果
worker.onmessage = (evt) => {
  console.log("来自 worker 的结果：", evt.data);
};

// 向 worker 发送任务
worker.postMessage(41);
```

```ts title="worker.ts"
self.onmessage = (evt) => {
  const result = evt.data + 1;
  // 将结果发回主线程
  self.postMessage(result);
};
```

运行 `deno run --allow-read main.ts` 会打印 `来自 worker 的结果: 42`。

### 实例化权限

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

worker 的权限与 CLI 权限标志类似，这意味着在那里启用的每个权限都可以在 Worker API 级别禁用。你可以在这里找到每个权限选项的更详细描述 [这里](/runtime/fundamentals/security/)。

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

## OffscreenCanvas

从 Deno 2.8 开始，[`OffscreenCanvas`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) API 可用。`OffscreenCanvas` 是一个存在于任何 DOM 之外的画布，可在任何地方使用（包括 Web Workers），用于线程外渲染和图像生成。

### 支持的渲染上下文

`OffscreenCanvas#getContext` 接受规范定义的两个上下文 id：

- `"bitmaprenderer"`：返回一个 [`ImageBitmapRenderingContext`](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmapRenderingContext)，用于显示通过 `createImageBitmap` 生成的 `ImageBitmap`。
- `"webgpu"`：返回一个 [`GPUCanvasContext`](https://developer.mozilla.org/en-US/docs/Web/API/GPUCanvasContext)，用于使用 WebGPU 进行渲染。

使用 `"2d"`、`"webgl"` 或 `"webgl2"` 调用 `getContext` 会返回 `null`；这些上下文尚未在 Deno 中实现。

### 示例：将图像编码为 PNG

将图像解码为 `ImageBitmap`，通过 `bitmaprenderer` 上下文将其放到 `OffscreenCanvas` 上，并将结果写入磁盘：

```ts
const data = await Deno.readFile("./input.jpg");
const bitmap = await createImageBitmap(new Blob([data]));

const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
const ctx = canvas.getContext("bitmaprenderer")!;
ctx.transferFromImageBitmap(bitmap);

const blob = await canvas.convertToBlob({ type: "image/png" });
await Deno.writeFile(
  "./output.png",
  new Uint8Array(await blob.arrayBuffer()),
);
```

典型用途：

- 在请求时生成缩略图、格式转换或社交卡片图片，而无需启动无头浏览器，
- 在 Web Worker 中执行线程外图像处理，
- 驱动不需要窗口的 WebGPU 渲染目标。

## 几何接口

从 Deno 2.8 开始，[Geometry Interfaces Module Level 1](https://drafts.fxtf.org/geometry/) 类型可作为全局对象使用。这些类型与浏览器中的相同：

- [`DOMMatrix`](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) /
  [`DOMMatrixReadOnly`](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrixReadOnly)：
  用于 2D 和 3D 操作的 4×4 变换矩阵。
- [`DOMPoint`](https://developer.mozilla.org/en-US/docs/Web/API/DOMPoint) /
  [`DOMPointReadOnly`](https://developer.mozilla.org/en-US/docs/Web/API/DOMPointReadOnly)：
  2D / 3D 空间中的点。
- [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) /
  [`DOMRectReadOnly`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRectReadOnly)：
  轴对齐矩形。
- [`DOMQuad`](https://developer.mozilla.org/en-US/docs/Web/API/DOMQuad)：由四个点定义的
  四边形。

```ts
const m = new DOMMatrix().translateSelf(10, 20).scaleSelf(2);
const p = new DOMPoint(1, 1).matrixTransform(m);
console.log(p.x, p.y); // 12 22
```

这些类型对图形工作很有用；例如将变换应用于 canvas 绘图、计算布局数学，或移植依赖几何类型的浏览器代码。

## navigator

Deno 实现了 [`navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) 全局对象的一个子集。可用的属性如下：

- `navigator.userAgent` — 始终为 `"Deno/<version>"`
- `navigator.platform` — 底层操作系统平台（例如 `"Linux x86_64"`、
  `"MacIntel"`、`"Win32"`）。已在 Deno 2.7 中添加。
- `navigator.hardwareConcurrency` — 逻辑 CPU 核心数
- `navigator.userAgentData` — 一个
  [`NavigatorUAData`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData)
  对象，实现了 User-Agent Client Hints API。低熵属性
  `brands`、`mobile` 和 `platform` 可同步读取，而
  `getHighEntropyValues(hints)` 会解析并返回额外细节，例如
  `architecture`、`model` 和 `platformVersion`。
- `navigator.locks` — 一个
  [`LockManager`](https://developer.mozilla.org/en-US/docs/Web/API/LockManager)
  实现了
  [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API)，
  用于通过 `navigator.locks.request()` 和 `navigator.locks.query()`
  协调对命名资源的访问。

```ts
console.log(navigator.userAgent); // "Deno/2.7.0"
console.log(navigator.platform); // 例如 "Linux x86_64", "MacIntel", "Win32"
console.log(navigator.hardwareConcurrency); // 例如 8
console.log(navigator.userAgentData.brands); // 例如 [{ brand: "Deno", version: "2" }]
```

## Temporal

[Temporal API](https://tc39.es/proposal-temporal/docs/) is a modern date/time library that can replace `Date` in most use cases. It is stable in Deno 2.7 and available as a global object without any flags.

```ts
// Date/time in the current local time zone
const now = Temporal.Now.plainDateTimeISO();
console.log(now.toString()); // e.g. "2025-03-12T10:30:00"

// Parse date
const date = Temporal.PlainDate.from("2025-03-12");
console.log(date.month); // 3

// Time zone aware
const zonedNow = Temporal.Now.zonedDateTimeISO("America/New_York");
console.log(zonedNow.timeZoneId); // "America/New_York"
```

Before Deno 2.7, Temporal required the `--unstable-temporal` flag.

## CompressionStream 和 DecompressionStream

Deno 支持用于流式压缩和解压缩的 [`CompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream) 和 [`DecompressionStream`](https://developer.mozilla.org/en-US/docs/Web/API/DecompressionStream)。

### 支持的格式

| 格式         | 字符串             | 说明               |
| ------------ | ------------------ | ------------------ |
| gzip         | `"gzip"`           | RFC 1952           |
| deflate      | `"deflate"`        | zlib (RFC 1950)    |
| deflate-raw  | `"deflate-raw"`    | 原始 DEFLATE (1951) |
| Brotli       | `"brotli"`         | 在 Deno 2.7 中添加  |

```ts
// 使用 Brotli 压缩
const input = new TextEncoder().encode("Hello, Deno!");
const cs = new CompressionStream("brotli");
const writer = cs.writable.getWriter();
writer.write(input);
writer.close();
const compressed = await new Response(cs.readable).arrayBuffer();

// 解压缩
const ds = new DecompressionStream("brotli");
const writer2 = ds.writable.getWriter();
writer2.write(new Uint8Array(compressed));
writer2.close();
const result = await new Response(ds.readable).text();
console.log(result); // "Hello, Deno!"
```

## Web Crypto

Deno 通过 `crypto.subtle` 支持
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)。

### 特性检测

`SubtleCrypto.supports()` 是一个静态方法，用于同步检查某个给定的算法与操作组合是否可用，而无需实际运行该操作或捕获错误。它接受操作名称、算法，以及一个可选的第三个参数，并返回一个布尔值。此功能于 Deno 2.9 中添加。

```ts
SubtleCrypto.supports("digest", "SHA3-256"); // true
SubtleCrypto.supports("generateKey", "ChaCha20-Poly1305"); // true
SubtleCrypto.supports("sign", "ML-DSA-65"); // true
```

操作可以是 `"encrypt"`、`"decrypt"`、`"sign"`、`"verify"`、
`"digest"`、`"generateKey"`、`"deriveKey"`、`"deriveBits"`、`"importKey"`、
`"exportKey"`、`"wrapKey"`、`"unwrapKey"`、`"encapsulateKey"`、
`"encapsulateBits"`、`"decapsulateKey"`、`"decapsulateBits"`，或
`"getPublicKey"`。

可选的第三个参数会根据操作进行解释：对于 `"deriveBits"`，它是以位为单位的长度；否则它是一个相关算法，例如 `"deriveKey"` 的派生密钥算法，或 `"encapsulateKey"`
和 `"decapsulateKey"` 的共享密钥算法。

```ts
// deriveKey 会从 HKDF 生成一个 AES-GCM 密钥吗？
SubtleCrypto.supports("deriveKey", "HKDF", { name: "AES-GCM", length: 256 });
```

`SubtleCrypto.supports()` 是 WICG 的
[Web Cryptography API 中现代算法](https://wicg.github.io/webcrypto-modern-algos/)
草案的一部分。

### SHA-3 哈希算法

从 Deno 2.7 开始，SHA-3 系列哈希算法已被 `crypto.subtle.digest` 支持：

- `SHA3-256`
- `SHA3-384`
- `SHA3-512`

```ts
const data = new TextEncoder().encode("Hello, Deno!");
const hash = await crypto.subtle.digest("SHA3-256", data);
console.log(new Uint8Array(hash));
```

`HMAC` 密钥也可以使用 SHA-3 哈希。生成或导入密钥时，将算法名称作为 `hash` 传入：

```ts
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA3-256" },
  true,
  ["sign", "verify"],
);
const signature = await crypto.subtle.sign("HMAC", key, data);
```

### 可扩展输出函数

Deno 2.9 添加了 SHAKE、cSHAKE、TurboSHAKE 和 KangarooTwelve
可扩展输出函数（XOF）。与固定长度哈希不同，XOF 可以生成任意长度的摘要，因此 `crypto.subtle.digest` 需要提供一个 `outputLength`
选项，以位为单位指定输出大小。`outputLength` 必须是 8 的正整数倍。支持的名称有：

- `SHAKE128`, `SHAKE256`
- `cSHAKE128`, `cSHAKE256`
- `TurboSHAKE128`, `TurboSHAKE256`
- `KT128`（也接受 `KangarooTwelve`）和 `KT256`

```ts
const data = new TextEncoder().encode("Hello, Deno!");

// 256 位（32 字节）的 SHAKE256 摘要。
const digest = await crypto.subtle.digest(
  { name: "SHAKE256", outputLength: 256 },
  data,
);
console.log(new Uint8Array(digest).length); // 32
```

`cSHAKE128` 和 `cSHAKE256` 接受两个可选的 `BufferSource` 参数来定制函数：`functionName`，一个由 NIST 定义的函数名，以及 `customization`，一个由调用方定义的域分离字符串。

```ts
const digest = await crypto.subtle.digest(
  {
    name: "cSHAKE128",
    outputLength: 256,
    customization: new TextEncoder().encode("my-app"),
  },
  data,
);
```

`TurboSHAKE128` 和 `TurboSHAKE256` 接受一个可选的 `domainSeparation` 字节，其取值必须在 `0x01` 到 `0x7F` 范围内：

```ts
const digest = await crypto.subtle.digest(
  { name: "TurboSHAKE256", outputLength: 512, domainSeparation: 0x1f },
  data,
);
```

`KT128` 和 `KT256` 是 KangarooTwelve XOF。它们接受一个可选的
`customization` `BufferSource`：

```ts
const digest = await crypto.subtle.digest(
  { name: "KT128", outputLength: 256 },
  data,
);
```

### KMAC

`KMAC128` 和 `KMAC256` 是基于 cSHAKE 构建的带密钥消息认证码。
此功能于 Deno 2.9 中添加。先生成一个以位为单位的 `length` 密钥，然后使用以位为单位的 `outputLength` 和一个可选的 `customization` `BufferSource`
进行签名和验证：

```ts
const key = await crypto.subtle.generateKey(
  { name: "KMAC128", length: 128 },
  true,
  ["sign", "verify"],
);

const data = new TextEncoder().encode("Hello, Deno!");
const params = {
  name: "KMAC128",
  outputLength: 256,
  customization: new TextEncoder().encode("Deno"),
};
const mac = await crypto.subtle.sign(params, key, data);
const valid = await crypto.subtle.verify(params, key, mac, data);
```

KMAC 密钥可以使用 `"raw"`、`"raw-secret"` 和
`"jwk"` 格式导入和导出。

### Argon2

`Argon2d`、`Argon2i` 和 `Argon2id` 是密码哈希密钥派生函数。
此功能于 Deno 2.9 中添加。使用 `"raw-secret"`
格式并带有 `deriveBits` 用途将密码导入为密钥，然后调用 `deriveBits`。参数包括
`memory`（以 kibibytes 为单位的内存成本）、`passes`（迭代次数）、`parallelism`
（并行度）以及一个 `nonce` `BufferSource`（盐）。`secretValue`
和 `associatedData` 是可选的 `BufferSource` 值：

```ts
const password = new TextEncoder().encode("correct horse battery staple");
const key = await crypto.subtle.importKey(
  "raw-secret",
  password,
  "Argon2id",
  false,
  ["deriveBits"],
);

const derived = await crypto.subtle.deriveBits(
  {
    name: "Argon2id",
    memory: 65536,
    passes: 3,
    parallelism: 4,
    nonce: crypto.getRandomValues(new Uint8Array(16)),
  },
  key,
  256, // 输出长度（位）
);
```

### ChaCha20-Poly1305

Deno 2.9 通过 `generateKey`、`encrypt` 和 `decrypt`
支持 `ChaCha20-Poly1305` 认证加密算法。密钥始终为 256 位：

```ts
const key = await crypto.subtle.generateKey(
  { name: "ChaCha20-Poly1305" },
  true,
  ["encrypt", "decrypt"],
);
```

每次 `encrypt` 和 `decrypt` 调用都需要一个 12 字节的 `nonce`，以及一个可选的
`additionalData`，它会被认证但不会被加密。对于同一密钥下加密的每条消息，都应使用一个新的 nonce：

```ts
const nonce = crypto.getRandomValues(new Uint8Array(12));
const data = new TextEncoder().encode("Hello, Deno!");

const ciphertext = await crypto.subtle.encrypt(
  { name: "ChaCha20-Poly1305", nonce },
  key,
  data,
);

const plaintext = await crypto.subtle.decrypt(
  { name: "ChaCha20-Poly1305", nonce },
  key,
  ciphertext,
);
console.log(new TextDecoder().decode(plaintext)); // "Hello, Deno!"
```

返回的密文包含 16 字节的 Poly1305 认证标签。

### 后量子密码学

Deno 2.9 实现了来自 WICG
[Web Cryptography API 中现代算法](https://wicg.github.io/webcrypto-modern-algos/)
草案的 NIST 后量子算法：ML-DSA 和 SLH-DSA 签名，以及 ML-KEM 密钥封装。

#### ML-DSA 签名

`ML-DSA`（FIPS 204）是一种基于格的数字签名方案。有三个参数集可用，安全级别依次递增：`ML-DSA-44`、`ML-DSA-65` 和
`ML-DSA-87`。先生成密钥对，然后使用私钥签名并用公钥验证：

```ts
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: "ML-DSA-65" },
  true,
  ["sign", "verify"],
);

const data = new TextEncoder().encode("Hello, Deno!");
const signature = await crypto.subtle.sign(
  { name: "ML-DSA-65" },
  privateKey,
  data,
);
const valid = await crypto.subtle.verify(
  { name: "ML-DSA-65" },
  publicKey,
  signature,
  data,
);
console.log(valid); // true
```

`sign` 和 `verify` 接受一个可选的 `context`，它是一个将签名绑定到应用特定值的 `BufferSource`。两次调用必须提供相同的 `context`：

```ts
const context = new TextEncoder().encode("v1");
const signature = await crypto.subtle.sign(
  { name: "ML-DSA-65", context },
  privateKey,
  data,
);
```

ML-DSA 密钥可以使用 `"pkcs8"`、`"spki"`、`"jwk"`、
`"raw-public"`、`"raw-private"` 和 `"raw-seed"` 格式导入和导出。

#### SLH-DSA 签名

`SLH-DSA`（FIPS 205）是一种无状态基于哈希的签名方案。共有十二种参数集可用，结合了哈希族（`SHA2` 或 `SHAKE`）、安全级别（`128`、`192` 或 `256`）以及 `s`（小签名）或 `f`
（快速）权衡：

- `SLH-DSA-SHA2-128s`, `SLH-DSA-SHA2-128f`, `SLH-DSA-SHA2-192s`,
  `SLH-DSA-SHA2-192f`, `SLH-DSA-SHA2-256s`, `SLH-DSA-SHA2-256f`
- `SLH-DSA-SHAKE-128s`, `SLH-DSA-SHAKE-128f`, `SLH-DSA-SHAKE-192s`,
  `SLH-DSA-SHAKE-192f`, `SLH-DSA-SHAKE-256s`, `SLH-DSA-SHAKE-256f`

SLH-DSA 使用与 ML-DSA 相同的 `generateKey`、`sign` 和 `verify` 流程，
包括可选的 `context`：

```ts
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: "SLH-DSA-SHAKE-128f" },
  true,
  ["sign", "verify"],
);

const data = new TextEncoder().encode("Hello, Deno!");
const signature = await crypto.subtle.sign(
  { name: "SLH-DSA-SHAKE-128f" },
  privateKey,
  data,
);
```

SLH-DSA 密钥可以使用 `"pkcs8"`、`"spki"`、`"jwk"`、
`"raw-public"` 和 `"raw-private"` 格式导入和导出。

#### ML-KEM 密钥封装

`ML-KEM`（FIPS 203）是一种密钥封装机制：一方将新的共享密钥封装到接收方的公钥中，接收方再对生成的密文进行解封装，以恢复相同的密钥。参数集为
`ML-KEM-512`、`ML-KEM-768` 和 `ML-KEM-1024`。

接收方生成密钥对并发布公钥（封装）密钥。发送方调用 `encapsulateKey`，它会同时返回要发送回去的 `ciphertext` 和一个用于其第三个参数所命名算法的 `sharedKey` `CryptoKey`。接收方将密文传递给 `decapsulateKey` 以派生出相同的密钥：

```ts
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: "ML-KEM-768" },
  true,
  ["encapsulateKey", "decapsulateKey"],
);

// 发送方：将共享 AES-GCM 密钥封装到接收方的公钥中。
const { ciphertext, sharedKey } = await crypto.subtle.encapsulateKey(
  { name: "ML-KEM-768" },
  publicKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"],
);

// 接收方：解封装密文以恢复相同的密钥。
const recovered = await crypto.subtle.decapsulateKey(
  { name: "ML-KEM-768" },
  privateKey,
  ciphertext,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"],
);
```

`encapsulateBits` 和 `decapsulateBits` 是更低层级的变体：它们返回原始共享密钥作为 `ArrayBuffer`，而不是将其导入为
`CryptoKey`。解封装（私有）密钥还会暴露 `getPublicKey()`，它返回与其匹配的封装（公钥）密钥。

## createImageBitmap

Deno 支持 [`createImageBitmap()`](https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap)，可将图像解码为可与 [`OffscreenCanvas`](#offscreencanvas) 一起使用的 `ImageBitmap` 对象。

### 支持的输入格式

| 格式 | 说明              |
| ---- | ----------------- |
| PNG  |                   |
| JPEG |                   |
| BMP  |                   |
| GIF  | 在 Deno 2.7 中添加 |
| WebP | 在 Deno 2.7 中添加 |

```ts
const data = await Deno.readFile("./image.gif");
const bitmap = await createImageBitmap(new Blob([data]));
console.log(bitmap.width, bitmap.height);
```

## 文件锁

[`Deno.FsFile`](/api/deno/~/Deno.FsFile) 支持建议性文件锁，用于协调进程之间的访问：

- [`lock(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.lock) — 获取一个
  锁。默认是共享（读）锁；传入 `true` 表示独占（写）锁。如果已持有不兼容的锁，则会阻塞。
- [`lockSync(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.lockSync) —
  `lock()` 的同步版本。
- [`tryLock(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.tryLock) —
  非阻塞。获取到锁时返回 `true`，否则返回 `false`。
  在 Deno 2.7 中添加。
- [`tryLockSync(exclusive?)`](/api/deno/~/Deno.FsFile.prototype.tryLockSync) —
  `tryLock()` 的同步版本。

```ts
const file = await Deno.open("./data.txt", { read: true, write: true });

const locked = await file.tryLock(true); // 独占
if (locked) {
  await file.write(new TextEncoder().encode("hello"));
  await file.unlock();
} else {
  console.log("文件已被另一个进程锁定，跳过。");
}
file.close();
```

## Other APIs that do not match the specification

### Cache APIs

Only the following APIs are implemented:

- [CacheStorage::open()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open)
- [CacheStorage::has()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/has)
- [CacheStorage::delete()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete)
- [CacheStorage::keys()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/keys)
  (Deno 2.8+)
- [Cache::match()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
- [Cache::put()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put)
- [Cache::delete()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete)
- [Cache::keys()](https://developer.mozilla.org/en-US/docs/Web/API/Cache/keys)
  (Deno 2.8+)

Compared with browsers, there are a few differences:

1. You cannot pass relative paths to the API. Requests can be Request, URL instances, or URL strings.
2. `match()` and `delete()` do not yet support query options.