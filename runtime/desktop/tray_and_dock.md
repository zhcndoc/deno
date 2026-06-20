---
last_modified: 2026-06-16
title: "托盘和 Dock"
description: "向操作系统状态区域和 macOS Dock 添加图标：工具提示、深色模式变体、点击事件以及右键上下文菜单。"
---

:::info 即将推出于 Deno 2.9

`deno desktop` 随 Deno v2.9.0 发布，但尚未进入稳定版。若要立即试用，请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建。命令、配置键和 TypeScript API 在该功能稳定之前仍可能发生变化。

:::

[`Deno.Tray`](/api/deno/~/Deno.Tray) 会在系统状态区域中放置一个图标
（macOS 菜单栏附加项、Windows 系统托盘、Linux AppIndicator）。
[`Deno.dock`](/api/deno/~/Deno.dock) 是一个单例，用于控制应用在 Dock
/ 任务栏中的存在：徽章、弹跳、可见性，以及自定义菜单。

两者的菜单都使用 [`Deno.MenuItem`](/runtime/desktop/menus/) 类型。

## [`Deno.Tray`](/api/deno/~/Deno.Tray)

```ts
const icon = await Deno.readFile("./icons/tray.png");

const tray = new Deno.Tray();
tray.setIcon(icon);
tray.setTooltip("我的应用");

tray.setMenu([
  { item: { label: "打开", id: "open", enabled: true } },
  { item: { label: "退出", id: "quit", enabled: true } },
]);

tray.addEventListener("menuclick", (e) => {
  if (e.detail.id === "open") win.show();
  if (e.detail.id === "quit") Deno.exit(0);
});
```

### 生命周期

图标会一直保留在状态区域中，直到你调用 `tray.destroy()`（或者进程退出）。可以同时存在多个托盘，这对于需要独立控制界面的应用指示器很有用。

```ts
tray.destroy();
```

`Tray` 也是一个 `Disposable`，因此可以与 `using` 一起使用：

```ts
{
  using tray = new Deno.Tray();
  // ...
} // 在作用域结束时自动销毁
```

### 设置图标

```ts
tray.setIcon(pngBytes); // 字节，不是路径
tray.setIconDark(darkPngBytes); // 可选的深色模式变体
tray.setIconDark(null); // 清除深色图标
```

传入的是 PNG 编码后的字节，而不是文件路径。请自行读取文件：

```ts
const png = await Deno.readFile("./icons/tray.png");
tray.setIcon(png);
```

如果你希望在深色菜单栏中获得不同的对比度，请通过 `setIconDark` 提供单独的深色模式图标（macOS 10.14+、现代 Linux）。如果不提供，则两种模式都使用同一个图标。

为了获得最佳效果，请使用小尺寸的 **模板图像** 风格（大多为不透明轮廓，其余区域透明）：macOS 为 22×22 逻辑像素，Windows 为 16×16。

### 工具提示

```ts
tray.setTooltip("我的应用：有 3 条未读");
tray.setTooltip(null); // 移除工具提示
```

### 上下文菜单

在托盘图标上右键会打开 `setMenu` 设置的菜单。其项目与应用菜单和上下文菜单使用的 [`Deno.MenuItem`](/runtime/desktop/menus/) 结构相同：

```ts
tray.setMenu([
  { item: { label: "打开", id: "open", enabled: true } },
  "separator",
  {
    item: {
      label: "设置…",
      id: "settings",
      accelerator: "CmdOrCtrl+,",
      enabled: true,
    },
  },
  "separator",
  {
    item: {
      label: "退出",
      id: "quit",
      accelerator: "CmdOrCtrl+Q",
      enabled: true,
    },
  },
]);

tray.addEventListener("menuclick", (e) => {
  switch (e.detail.id) {
    case "open":
      win.show();
      break;
    case "settings":
      showSettings();
      break;
    case "quit":
      Deno.exit(0);
      break;
  }
});

tray.setMenu(null); // 在不销毁托盘的情况下移除菜单
```

子菜单的工作方式与应用菜单相同。

### 点击事件

```ts
tray.addEventListener("click", () => win.show());
tray.addEventListener("dblclick", () => openSettings());
```

`click` 会在主键单击时触发。`dblclick` 会在双击时触发。在右键被保留给上下文菜单的平台上（所有平台都是如此），只有左键点击才会产生这些事件。

### 弹出面板

对于经典的菜单栏应用模式，单击托盘图标以切换一个锚定在其下方的小浮动窗口，然后使用 `attachPanel()`：

```ts
const tray = new Deno.Tray();
tray.setIcon(await Deno.readFile("./icons/tray.png"));

const panel = tray.attachPanel({
  url: `http://127.0.0.1:${port}/panel`,
  width: 360,
  height: 480,
});

panel.window.bind("doThing", async () => {/* … */});
```

返回的 [`Deno.TrayPanel`](/api/deno/~/Deno.TrayPanel) 会在点击托盘时切换显示，位置在图标下方，并在失去焦点时隐藏。将字符串作为 `{ url }` 的简写传入。`TrayPanelOptions` 还接受 `hideOnBlur`（默认 `true`）以及一个用于覆盖定位的 `position` 回调（例如用于底部任务栏）。

```ts
panel.show();
panel.hide();
panel.toggle();
console.log(panel.visible);
panel.destroy(); // 分离并关闭面板窗口
panel.window; // 底层 BrowserWindow：bind()、executeJs() 等
```

面板是基于这些原语提供的便捷封装。若要完全控制，请自行创建一个 `frameless` + `noActivate` 的 [`BrowserWindow`](/runtime/desktop/windows/)，并使用 `Tray.getBounds()` 定位：

```ts
const bounds = tray.getBounds(); // { x, y, width, height } | null
if (bounds) {
  popover.setPosition(bounds.x, bounds.y + bounds.height);
  popover.show();
}
```

`getBounds()` 会返回图标的屏幕矩形；当平台无法报告时则返回 `null`。在 Linux 上无法查询图标位置，因此附加面板会显示在上次位置，而不是锚定到图标。

### 平台支持

托盘图标依赖操作系统提供状态区域。相关后端对以下平台支持托盘：

- **macOS**：状态栏菜单项（NSStatusItem）。
- **Windows**：系统托盘（NotifyIcon）。
- **Linux**：AppIndicator / KStatusNotifierItem。需要能够显示它们的桌面环境。大多数都支持，但某些精简的 i3 配置可能需要诸如 `swaync` 或 `polybar` 之类的额外配置。

如果后端无法创建托盘图标，则构造器底层的 `trayId` 为 `0`，后续调用都会成为无操作（静默）。如果你需要优雅降级，请检查 `tray.trayId !== 0`。

## [`Deno.dock`](/api/deno/~/Deno.dock)

[`Deno.dock`](/api/deno/~/Deno.dock) 是一个单例，提供应用的 Dock /
任务栏控制。其方法是跨平台的，但效果不同：仅 macOS 的操作在 Windows 和 Linux 上是无操作（会优雅失败，而不是抛出错误）。

### 徽章

```ts
Deno.dock.setBadge("3"); // Dock / 任务栏图标上的短文本
Deno.dock.setBadge(null); // 清除（null 或空字符串）
```

在 Dock 图标（macOS）或任务栏图标（Windows）上设置文本徽章；在 Linux 上则会在当前聚焦窗口的标题前加上前缀。徽章通常很短，一般是一个计数；较长字符串会被操作系统截断。

### 弹跳

```ts
Deno.dock.bounce(); // 单次弹跳 / 闪烁
Deno.dock.bounce(true); // 持续弹跳，直到应用获得焦点
```

使 Dock 图标弹跳（macOS）、让任务栏按钮闪烁（Windows），或为当前聚焦窗口设置紧急提示（Linux）。可选的 `critical` 参数（默认 `false`）控制是弹跳一次还是持续弹跳。

### 可见性

```ts
Deno.dock.setVisible(false); // 从 Dock 中移除应用
Deno.dock.setVisible(true); // 恢复它
```

仅限 macOS；控制应用的激活策略。隐藏的应用不会出现在 Dock 或 Cmd-Tab 切换器中，这正适合只在菜单栏运行的应用。应用仍会继续运行，并且仍可显示窗口；用户可以通过 Spotlight 或托盘图标访问它。在 Windows 和 Linux 上无操作。

### 菜单

```ts
Deno.dock.setMenu([
  { item: { label: "新建窗口", id: "new", enabled: true } },
  { item: { label: "退出", id: "quit", enabled: true } },
]);
Deno.dock.setMenu(null); // 移除菜单

Deno.dock.addEventListener("menuclick", (e) => {
  if (e.detail.id === "quit") Deno.exit(0);
});
```

仅限 macOS；在 Dock 图标上提供一个自定义右键菜单。点击会作为 `menuclick` 事件发送到 [`Deno.dock`](/api/deno/~/Deno.dock)。

### 重新打开事件

在 macOS 上，当应用没有可见窗口时点击 Dock 图标会触发 `reopen` 事件。默认的“显示最后隐藏的窗口”行为会被吞掉，因此由你决定如何处理：

```ts
Deno.dock.addEventListener("reopen", (e) => {
  if (!e.detail.hasVisibleWindows) win.show();
});
```

## 模式：仅托盘后台应用

若要作为仅状态栏运行的后台进程（无 Dock、无主窗口）：

```ts
Deno.dock.setVisible(false); // macOS：从 Dock 中隐藏应用
win.hide(); // 隐藏隐式启动窗口

const tray = new Deno.Tray();
tray.setIcon(await Deno.readFile("./icons/tray.png"));
tray.setTooltip("我的应用");
tray.setMenu([
  { item: { label: "显示窗口", id: "show", enabled: true } },
  { item: { label: "退出", id: "quit", enabled: true } },
]);

tray.addEventListener("menuclick", (e) => {
  if (e.detail.id === "show") win.show();
  if (e.detail.id === "quit") Deno.exit(0);
});
```

启动窗口会在你的二进制程序启动时创建；隐藏它可以让它保持就绪，以便之后显示时不会产生启动延迟。
