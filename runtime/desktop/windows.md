---
last_modified: 2026-06-16
title: "Windows"
description: "使用 Deno.BrowserWindow 创建和管理原生窗口：生命周期、多个窗口、大小调整、导航、键盘 / 鼠标 / 聚焦事件，以及原生窗口句柄。"
---

:::info 即将随 Deno 2.9 提供

`deno desktop` 随 Deno v2.9.0 发布，目前尚未进入稳定版。要立即试用，请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建版本。在该功能稳定之前，命令、配置键和 TypeScript API 仍可能发生变化。

:::

[`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) 类用于控制原生
窗口。当你的二进制程序启动时，会自动打开一个窗口，并导航到你的本地
[HTTP 服务器](/runtime/desktop/serving/)。你创建的**第一个**
`new Deno.BrowserWindow()` 会接管这个初始窗口；此后的每次创建都会打开一个新窗口。所有窗口共享同一个 Deno
运行时：每个进程只有一个异步运行时，无论打开了多少个窗口。

## 创建窗口

```ts
// 第一次创建会接管隐式启动窗口。
const win = new Deno.BrowserWindow({ title: "我的应用" });

// 后续创建会打开额外窗口。
const base = Deno.env.get("DENO_SERVE_ADDRESS")!; // "tcp:127.0.0.1:<port>"
const port = base.split(":").pop();

const settings = new Deno.BrowserWindow({
  title: "设置",
  width: 420,
  height: 320,
});
settings.navigate(`http://127.0.0.1:${port}/settings`);
```

构造函数接受一个 `BrowserWindowOptions` 对象：

| 选项                  | 类型      | 默认值  | 说明                                                                    |
| --------------------- | --------- | ------- | ----------------------------------------------------------------------- |
| `title`               | `string`  | 无      | 窗口标题。                                                               |
| `width`               | `number`  | `800`   | 以逻辑像素为单位的初始宽度。                                              |
| `height`              | `number`  | `600`   | 以逻辑像素为单位的初始高度。                                              |
| `x`, `y`              | `number`  | 无      | 初始位置；如果省略则居中。                                                |
| `resizable`           | `boolean` | `true`  | 用户是否可以调整窗口大小。                                               |
| `alwaysOnTop`         | `boolean` | `false` | 将窗口保持在其他窗口之上。                                               |
| `frameless`           | `boolean` | `false` | 移除标题栏和窗口边框。仅创建时可设置。                                      |
| `noActivate`          | `boolean` | `false` | 浮动的、不抢占焦点的面板。仅创建时可设置。                                  |
| `transparentTitlebar` | `boolean` | `false` | 将标题栏与内容融合。仅创建时可设置。                                       |

`new Deno.BrowserWindow()` 会立即打开（或接管）一个窗口。窗口会一直存在，直到调用 `close()` 或用户在操作系统中关闭它。

`frameless`、`noActivate` 和 `transparentTitlebar` 只能在创建时设置。`frameless` + `noActivate` 是托盘 / 菜单栏弹出面板的基础组件；参见 [`Tray.attachPanel`](/runtime/desktop/tray_and_dock/)。

多个窗口彼此独立：每个窗口都有自己的大小、位置、焦点状态和 webview。它们可以导航到不同的路径或不同的源，设置各自的绑定，并触发各自的事件。

## 生命周期

```ts
win.show();
win.hide();
win.focus();
win.close(); // 发送关闭请求，触发 "close" 事件
win.reload(); // 重新加载 webview 当前文档

if (win.isClosed()) { /* … */ }
if (win.isVisible()) { /* … */ }
```

每个窗口都有一个稳定的数字 id：

```ts
console.log(win.windowId);
```

关闭窗口不会停止运行时；进程会一直运行，直到所有窗口都关闭（或者你调用 [`Deno.exit()`](/api/deno/~/Deno.exit)）。

## 大小和位置

```ts
const [w, h] = win.getSize();
win.setSize(800, 600);

const [x, y] = win.getPosition();
win.setPosition(100, 100);

if (win.isResizable()) { /* … */ }
win.setResizable(false);

if (win.isAlwaysOnTop()) { /* … */ }
win.setAlwaysOnTop(true);
```

大小以逻辑像素为单位。操作系统负责 HiDPI 缩放。

## 标题

```ts
win.setTitle("我的应用：未命名");
```

使用稳定的前缀加上特定于文档的后缀；这是用户在窗口切换器、程序坞和任务栏中看到的内容。

## 导航

```ts
const port = Deno.env.get("DENO_SERVE_ADDRESS")!.split(":").pop();
win.navigate(`http://127.0.0.1:${port}`);
```

导航支持嵌入式 webview 可以加载的任何 URL，最常见的是本地 HTTP 服务器（见 [HTTP serving](/runtime/desktop/serving/)），也支持 `https://` URL、`file://` URL 和 `data:` URL。

对于多页面应用，使用本地 HTTP 服务器的路由，而不是切换窗口。对于模态对话框，优先创建子窗口而不是跳转离开。

## 事件

[`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) 是一个 `EventTarget`。使用 `addEventListener` 监听，或赋值给匹配的 `on<event>` 属性。

```ts
win.addEventListener("resize", (e) => {
  console.log("调整大小为", e.detail.width, e.detail.height);
});

win.onfocus = () => console.log("获得焦点");
win.onblur = () => console.log("失去焦点");
```

| 事件                | 触发时机                                     |
| ------------------- | ----------------------------------------------- |
| `resize`           | 窗口大小发生变化。                               |
| `move`             | 窗口位置发生变化。                               |
| `focus`            | 窗口获得焦点。                                   |
| `blur`             | 窗口失去焦点。                                   |
| `close`            | 用户请求关闭窗口。                               |
| `keydown`          | 窗口获得焦点时按下了某个键。                     |
| `keyup`            | 某个键被释放。                                   |
| `mousemove`        | 指针在窗口上移动。                               |
| `mouseenter`       | 指针进入窗口。                                   |
| `mouseleave`       | 指针离开窗口。                                   |
| `mousedown`        | 按下了鼠标按钮。                                 |
| `mouseup`          | 释放了鼠标按钮。                                 |
| `click`            | 鼠标单击落在窗口上。                             |
| `dblclick`         | 鼠标双击落在窗口上。                             |
| `wheel`            | 发生了滚轮 / 触控板滚动。                        |
| `menuclick`        | 点击了应用菜单项。                               |
| `contextmenuclick` | 点击了上下文菜单项。                             |

指针和键盘事件与浏览器中的对应事件（`KeyboardEvent`、`MouseEvent`、`WheelEvent`）一致。`resize`、`move`、`menuclick` 和 `contextmenuclick` 是携带 `detail` 负载的 `CustomEvent`；菜单事件请参见 [Menus](/runtime/desktop/menus/)。

```ts
win.addEventListener("keydown", (e) => {
  if (e.key === "Escape") win.close();
});
```

## 在 webview 中运行 JavaScript

```ts
const result = await win.executeJs(
  "document.querySelectorAll('li').length",
);
console.log(result); // 当前页面上的 <li> 数量
```

`executeJs` 会在 webview 的主世界中运行代码，并以结果完成返回。该值会跨越 realm 边界，因此必须可 JSON 序列化；如果脚本抛出异常，返回的 promise 会以抛出的值拒绝。

如需更丰富的 Deno ↔ webview 通信，请改用
[bindings](/runtime/desktop/bindings/)。

## 原生窗口句柄

```ts
const surface = win.getNativeWindow();
```

`getNativeWindow()` 会将窗口的原生表面包装为
[`Deno.UnsafeWindowSurface`](/api/deno/~/Deno.UnsafeWindowSurface)，以便你使用 WebGPU 将内容渲染到其上。请先请求 GPU adapter；如果没有活动的 WebGPU 上下文，该调用会抛出：

```ts
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter!.requestDevice();
const surface = win.getNativeWindow();
const context = surface.getContext("webgpu");
// 使用 `device` 配置 `context` 并绘制…
```

一旦表面已被获取，`close()` 会降级为 `hide()`，这样支撑该表面的原生句柄就不会在 WebGPU 仍在使用时被销毁。

## DevTools

```ts
win.openDevtools(); // Deno 和 renderer 两者
win.openDevtools({ deno: false }); // 仅 renderer
win.openDevtools({ renderer: false }); // 仅 Deno 运行时
```

参见 [DevTools](/runtime/desktop/devtools/)。

## 关闭应用

当没有打开的窗口且没有其他存活的异步任务（计时器、待处理的 fetch 等）时，运行时会退出。要显式退出：

```ts
Deno.exit(0);
```

如需阻止关闭（例如显示“是否保存？”对话框），请监听 `close` 并调用 `event.preventDefault()`：

```ts
win.addEventListener("close", async (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    const ok = await win.executeJs("confirm('放弃更改？')");
    if (ok) win.close();
  }
});
```
