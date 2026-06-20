---
last_modified: 2026-06-18
title: "Bindings"
description: "通过 win.bind() 从 webview JavaScript 调用 Deno 侧函数：在进程内通道上进行类型安全的 RPC，在边界处编码且无需跨进程往返。"
---

:::info 即将随 Deno 2.9 提供

`deno desktop` 随 Deno v2.9.0 一起发布，目前尚未进入稳定版。若要立即试用，请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建。该命令、配置键以及 TypeScript API 在功能稳定之前仍可能发生变化。

:::

`win.bind(name, handler)` 会向 webview 暴露一个 Deno 侧函数。在 webview 中，将其作为 `bindings.<name>(args)` 调用，该调用会返回一个 `Promise`，并以 handler 的返回值完成。

```ts title="Deno side"
win.bind("readSettings", async () => {
  const text = await Deno.readTextFile("settings.json");
  return JSON.parse(text);
});

win.bind("saveSettings", async (settings) => {
  await Deno.writeTextFile("settings.json", JSON.stringify(settings, null, 2));
});
```

```ts title="Webview side"
const settings = await bindings.readSettings();
settings.theme = "dark";
await bindings.saveSettings(settings);
```

## 其工作原理

Bindings **不是** IPC。Deno 运行时和渲染后端作为线程/进程运行在同一地址空间（CEF）内，或运行在协调后的进程组（WebView）中。调用通过进程内通道进行，后端从其运行循环中分发它们。

这避免了基于套接字的 IPC 框架（Electron 的 `ipcMain` / `ipcRenderer`、Tauri 的 `invoke`）所带来的跨进程往返。参数和结果在跨越运行域边界时仍会被编码，但传输是在进程内完成的：没有 socket，也没有跨进程调度。

从实际角度看：bindings 足够快，因此对于典型应用工作负载，你无需担心调用频率。

## webview 代理

webview 侧的 `bindings` 是一个 `Proxy`。任何属性访问都会按需创建一个函数：

```js
bindings.foo; // function
bindings.foo("a", 1); // Promise<unknown>
```

该代理不会校验名称：把 `bindings.readSettings` 输入成 `bindings.readSetings` 不会在属性访问时抛错；它会在你调用时抛错（因为没有注册这样的 binding，调用会被拒绝）。

## 参数和返回值语义

参数和返回值在 webview 与 Deno 运行时之间传递时，会被编码为 JSON。这意味着：

- 普通对象、数组、字符串、数字、布尔值以及 `null`：按原样传递。
- `Uint8Array`：受支持，可用于传递二进制数据。
- `undefined` 和可选属性：在序列化期间会被丢弃。
- `Date`、`Map`、`Set`、`RegExp`、除 `Uint8Array` 之外的类型数组、`ArrayBuffer`：**不会**被保留。发送前请将其转换为 JSON 兼容的结构（例如 `Date` 变为字符串，`Map` 变为 `{}`）。
- 函数、DOM 节点、原型以及循环引用：不可传输。
- handler 抛出的错误：会以 `{ name, message,
  stack }` 的形式传递给 webview（见下方 [Errors](#errors)），而不是作为 `Error`
  实例。

请在双方都只使用普通数据和 `Uint8Array`。

## 异步 handlers

Handlers 可以是同步或异步的。webview 始终会看到一个 `Promise`：

```ts
win.bind("now", () => Date.now()); // 同步
win.bind("delay", async (ms) => { // 异步
  await new Promise((r) => setTimeout(r, ms));
});
```

```ts
const t = await bindings.now();
await bindings.delay(500);
```

## 错误

如果某个 handler 抛错，无论是同步抛出还是通过被拒绝的 promise 抛出，都会导致 webview 侧调用被拒绝：

```ts
win.bind("readFile", async (path) => {
  return await Deno.readTextFile(path);
});
```

```ts
try {
  await bindings.readFile("/missing");
} catch (e) {
  console.error(e); // NotFound: …
}
```

错误会以普通 `{ name, message, stack }` 对象的形式到达 webview。若要区分错误类型，请检查 `error.name`。

## 解绑

```ts
win.unbind("readSettings");
```

移除该 binding。之后的 `bindings.readSettings()` 调用会被拒绝。

## 权限

Bindings 在 Deno 运行时内运行，因此会继承进程的权限。调用 [`Deno.readTextFile`](/api/deno/~/Deno.readTextFile) 的 binding 需要在启动时已授予 `--allow-read`。webview 不能通过 bindings 提升运行时权限。

对于桌面应用，你通常会在编译后的二进制中直接内置较宽的权限运行（`deno desktop` 目前不会在运行时强制单独的权限提示）。如果你暴露的 bindings 会操作文件系统或网络，请像对待任何信任边界代码一样谨慎地验证输入。

## 每个窗口的 bindings

Bindings 是按窗口区分的。在 `winA` 上注册的 binding 不能从 `winB` 的 webview 中调用。若要共享，请在每个窗口上都注册：

```ts
function bindShared(win: Deno.BrowserWindow) {
  win.bind("now", () => Date.now());
  win.bind("readSettings", readSettings);
}

const main = new Deno.BrowserWindow(); // 采用启动窗口
bindShared(main);

const settings = new Deno.BrowserWindow();
bindShared(settings);
```

## 类型安全

Deno 侧的 `win.bind()` 与 webview 侧的 `bindings.<name>()` 之间没有内建的类型桥接。两侧是彼此独立的 JS 运行域。

一个小型共享声明文件可以同时满足两端：

```ts title="bindings.d.ts"
export interface Bindings {
  readSettings(): Promise<Settings>;
  saveSettings(s: Settings): Promise<void>;
  now(): Promise<number>;
}

declare global {
  // 让 webview 中的 `bindings` 拥有类型。
  const bindings: Bindings;
}

export interface Settings {
  theme: "light" | "dark";
}
```

在 webview 的 `tsconfig` / Deno 项目配置中引用它，并使用同一个 `Bindings` 接口对你的 `win.bind` 调用进行类型检查。注册与声明之间的不匹配会在 Deno 侧的编译时被捕获。

## 从 Electron 迁移

如果你来自 Electron 的 `ipcMain.handle('channel', handler)` /
`ipcRenderer.invoke('channel', ...)`，那么心智模型是相同的：

| Electron                                            | `deno desktop`                                |
| --------------------------------------------------- | --------------------------------------------- |
| `ipcMain.handle('channel', (e, ...args) => result)` | `win.bind('channel', (...args) => result)`    |
| `ipcRenderer.invoke('channel', ...args)`            | `bindings.channel(...args)`                   |
| `contextBridge.exposeInMainWorld('api', {...})`     | 不需要；`bindings` 默认已暴露。 |

Electron 传入的第一个参数 `event` 对象没有对应物，因为没有独立的进程可用于归属该调用。每个窗口的上下文存在于你注册该 binding 的 `win` 上。
