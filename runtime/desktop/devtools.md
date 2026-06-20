---
last_modified: 2026-06-19
title: "DevTools"
description: "将 Chrome DevTools 连接到一个 deno desktop 应用：单个会话即可同时显示 Deno 运行时 V8 和渲染器 V8，二者都可作为可检查目标。"
---

:::info Deno 2.9 即将推出

`deno desktop` 将随 Deno v2.9.0 一起发布，目前还不在稳定版本中。若要立即体验，请运行 `deno upgrade canary` 以安装
[`canary`](/runtime/reference/cli/upgrade/) 构建。在该功能稳定之前，命令、配置键以及 TypeScript API 仍可能发生变化。

:::

`deno desktop` 提供**统一 DevTools**：一个 Chrome DevTools 会话，可同时连接到应用内的两个 V8 隔离环境：**Deno 运行时**（你的处理程序、绑定、顶层代码）和**渲染器**（webview 侧 JavaScript）。一个 Console 下拉菜单，一个同时显示两个线程的 Sources 面板，一个调试会话。

## 开始一个检查器会话

```sh
deno desktop --inspect main.ts
```

然后打开 `chrome://inspect`（或 `edge://inspect`）。应用会作为一个目标显示出来。点击“inspect”，DevTools 就会打开，并连接到这两个隔离环境。

有三个标志控制启动行为：

| 标志              | 行为                                                             |
| ----------------- | ---------------------------------------------------------------- |
| `--inspect`      | 监听调试器；应用会立即开始运行。                                  |
| `--inspect-wait` | 在运行任何用户代码之前等待调试器连接。                             |
| `--inspect-brk`  | 等待调试器，并在两个隔离环境的第一行暂停。                         |

默认监听地址为 `127.0.0.1:9229`；可传入 `--inspect=host:port` 覆盖。

```sh
deno desktop --inspect=127.0.0.1:9230 main.ts
deno desktop --inspect-brk main.ts
deno desktop --inspect-wait main.ts
```

## 你会在 DevTools 中看到什么

连接后，DevTools UI 会显示：

- **Sources**：两个隔离环境都会出现在 **Threads** 侧边栏中。可设置断点、逐步执行，并在任一侧查看调用栈。
- **Console**：面板顶部的**目标下拉菜单**可在**Renderer**（webview）和**Deno**（运行时）之间切换。每个隔离环境的控制台输出都会带有标签。
- **Network**：来自 webview 的请求（webview 的 `fetch`、`XMLHttpRequest`、图片加载）。目前不会在这里显示来自 Deno 侧通过 `fetch` 发出的请求。
- **Performance / Memory**：分别为每个隔离环境分析性能；可通过同一个目标下拉菜单切换。

两侧都会遵循 source map。Deno 运行时中的 TypeScript 文件会按其原始行号显示；如果打包器输出了 map，打包后的 webview JS 会映射回其原始源码。

## 仅渲染器或仅 Deno 的会话

如果你只想调试一侧，可使用 DevTools 目标列表中的按目标端点，或在自己的代码中使用
[`Deno.BrowserWindow.openDevtools()`](/api/deno/~/Deno.BrowserWindow.openDevtools)：

```ts
win.openDevtools(); // 两个隔离环境（默认）
win.openDevtools({ deno: false }); // 仅渲染器
win.openDevtools({ renderer: false }); // 仅 Deno 运行时
```

`openDevtools()` 会在应用内部打开一个 DevTools 窗口，适合随构建一起发布带内置检查功能的调试版本，而无需使用 `chrome://inspect`。

## 工作原理

`deno desktop` 运行一个 CDP（Chrome DevTools Protocol）**多路复用器**，位于两个 V8 检查器之前：

```
             ┌──────────────────────────────────┐
DevTools     │  CDP Multiplexer (Deno CLI)      │
(one ws)  ◄─►│  /json/version  /json/list       │
             │  /unified  /deno  /cef           │
             └─────┬─────────────────┬──────────┘
                   │                 │
           Deno V8 inspector   Renderer V8 inspector
           (deno_core CDP)     (CEF remote-debugging)
```

这个 mux 将自己呈现为一个带有两个子项的 CDP“浏览器目标”：一个给渲染器的“page”目标，以及一个给 Deno 运行时的“worker”目标。DevTools 内置的多目标支持负责处理其余部分，这与它在开放网络上用于 `iframe` 和 `worker` 调试的机制相同。

无需修改 CDP 协议，无需分叉 DevTools，也无需修改前端。

## 后端支持

统一 DevTools 已为 **CEF** 后端实现。在其他后端上：

| 后端      | DevTools 状态                                                              |
| --------- | -------------------------------------------------------------------------- |
| `cef`     | 完整的统一 DevTools。                                                      |
| `webview` | 目前不支持；系统 webview 使用不同的检查器协议。                             |
| `raw`     | 仅支持 Deno 侧 `--inspect`；没有可供检查的渲染器。                          |

如果在不支持统一 DevTools 的后端上传入 `--inspect`，Deno 侧仍会运行一个检查器，你可以像普通的 `deno run --inspect` 会话一样连接到它。

## 跨绑定边界调试

当 webview 侧的 `bindings.foo()` 调用进入 Deno 侧处理程序时，两侧当前会显示为独立的堆栈跟踪。跨 realm 关联（自动将渲染器调用串接到 Deno 处理程序堆栈中）已列入路线图。现在，你可以在 Sources 面板中切换线程来手动跟踪执行。

一个实用方法：在开发期间，为绑定两侧添加匹配的控制台输出：

```ts
win.bind("readSettings", async () => {
  console.log("[bindings:readSettings] enter");
  const data = await readSettings();
  console.log("[bindings:readSettings] exit");
  return data;
});
```

在统一 Console 中，你会在 “Deno” 目标下看到这两行，并与在 “Renderer” 下可见的渲染器 `bindings.readSettings()` 调用相对应。

## 已知限制

- WebView 后端没有 DevTools 集成。
- 渲染器的 Network 面板不会显示 Deno 侧的 `fetch` 调用。
- 跨 realm 的逐步执行（点击 `bindings.foo()` 调用并进入 Deno 处理程序）尚未实现；请手动切换线程。
- `--inspect-brk` 会在导航前暂停两个隔离环境。恢复各自执行是独立的，因此你可能需要在每个线程上分别点击“Resume”。
