---
last_modified: 2026-06-16
title: "菜单"
description: "构建原生应用程序菜单栏和右键上下文菜单，支持子菜单、快捷键、分隔线、复选框和点击事件。"
---

:::info 即将于 Deno 2.9 中推出

`deno desktop` 随 Deno v2.9.0 发布，目前尚未进入稳定版。若要立即试用，请运行 `deno upgrade canary` 来安装 [`canary`](/runtime/reference/cli/upgrade/) 构建版本。在该功能稳定之前，命令、配置键和 TypeScript API 仍可能发生变化。

:::

`deno desktop` 提供两种原生菜单：**应用菜单**
（macOS 菜单栏、Windows / Linux 窗口菜单）和 **上下文菜单**（右键
弹出菜单）。

两者都使用相同的 [`Deno.MenuItem`](/api/deno/~/Deno.MenuItem) 类型。

## `MenuItem` 结构

`MenuItem` 是一个带标签的联合类型：每个条目都是以下四种结构之一：

```ts
type MenuItem =
  // 可点击项。
  | {
    item: {
      label: string;
      id?: string; // 在点击事件中返回
      accelerator?: string; // 例如 "CmdOrCtrl+S"、"F11"
      enabled: boolean;
    };
  }
  // 嵌套子菜单。
  | {
    submenu: {
      label: string;
      items: MenuItem[];
    };
  }
  // 分隔线。
  | "separator"
  // 标准 OS 角色（见下文）。
  | { role: { role: string } };
```

顶级菜单是这些项组成的数组。通过将更多 `MenuItem` 放入
`submenu` 的 `items` 中来嵌套条目。

## 应用菜单

为窗口设置在 macOS 菜单栏（或 Windows / Linux 窗口菜单）中显示的菜单：

```ts
win.setApplicationMenu([
  {
    submenu: {
      label: "File",
      items: [
        {
          item: {
            label: "New",
            id: "new",
            accelerator: "CmdOrCtrl+N",
            enabled: true,
          },
        },
        {
          item: {
            label: "Open…",
            id: "open",
            accelerator: "CmdOrCtrl+O",
            enabled: true,
          },
        },
        "separator",
        {
          item: {
            label: "Save",
            id: "save",
            accelerator: "CmdOrCtrl+S",
            enabled: true,
          },
        },
        { role: { role: "quit" } },
      ],
    },
  },
  {
    submenu: {
      label: "Edit",
      items: [
        { role: { role: "undo" } },
        { role: { role: "redo" } },
        "separator",
        { role: { role: "cut" } },
        { role: { role: "copy" } },
        { role: { role: "paste" } },
      ],
    },
  },
]);
```

通过 `menuclick` 事件监听点击：

```ts
win.addEventListener("menuclick", (e) => {
  switch (e.detail.id) {
    case "new":
      newDocument();
      break;
    case "open":
      openDocument();
      break;
    case "save":
      saveDocument();
      break;
  }
});
```

`e.detail.id` 是你在 `item` 上设置的 `id`。没有 `id` 的条目，以及
`role` 条目（由操作系统直接处理），不会产生 `menuclick` 事件。

### 快捷键

快捷键在当前聚焦窗口内全局生效。字符串格式为
`Modifier+Modifier+Key`：

| 修饰键        | 说明                                      |
| ------------- | ----------------------------------------- |
| `Cmd`         | 仅限 macOS                               |
| `Ctrl`        | 所有平台                                 |
| `CmdOrCtrl`   | macOS 上为 `Cmd`，其他平台上为 `Ctrl`    |
| `Alt`         | 所有平台（macOS 键盘上为 `Option`）      |
| `Shift`       | 所有平台                                 |
| `Super`       | “Windows” / `Meta` 键                   |

按键可以是字母（`A`-`Z`）、数字（`0`-`9`）、功能键（`F1`-`F24`），或
命名键（`Enter`、`Esc`、`Up`、`Down`、`Left`、`Right`、`Tab`、`Space`、
`Backspace`、`Delete`）。

请使用 `CmdOrCtrl` 而不是直接使用 `Cmd` 或 `Ctrl`，这样在最常见的快捷键上
就不需要按平台分支处理。

### 角色

`{ role: { role } }` 条目会映射到标准 OS 菜单命令：平台会提供标签、快捷键和行为。请在这些约定俗成的命令上使用角色，以便它们以原生方式工作（同时也让 macOS 自动绑定标准 Edit 菜单快捷键）：

```ts
const quit: Deno.MenuItem = { role: { role: "quit" } };
const copy: Deno.MenuItem = { role: { role: "copy" } };
const paste: Deno.MenuItem = { role: { role: "paste" } };
```

常见角色包括 `quit`、`undo`、`redo`、`cut`、`copy`、`paste`、
`selectAll`、`minimize` 和 `close`。角色条目不需要 `id`，也不会触发
`menuclick` 事件；它由操作系统直接处理。

### macOS 菜单栏的特殊之处

在 macOS 上，**第一个**顶级子菜单是应用菜单（带有你的应用名称的菜单），其标签会替换为应用名称。请把标准应用角色（例如 `quit`）放在那里。如果你没有提供，系统会生成一个默认菜单。

当你将它们作为 `role` 条目包含时，Edit 菜单中的标准项目（Cut、Copy、Paste、Select All、Undo、Redo）会以原生方式工作。

## 上下文菜单

使用 `showContextMenu(x, y, menu)` 在屏幕位置显示上下文菜单：

```ts
const contextMenu: Deno.MenuItem[] = [
  { item: { label: "Copy", id: "copy", enabled: true } },
  { item: { label: "Paste", id: "paste", enabled: true } },
  "separator",
  { item: { label: "Properties…", id: "props", enabled: true } },
];

// 从右键点击触发。webview 可能不会转发浏览器的
// `contextmenu` 事件，因此请在窗口上处理次要鼠标按钮。
win.addEventListener("mousedown", (e) => {
  if (e.button === 2) {
    win.showContextMenu(e.clientX, e.clientY, contextMenu);
  }
});

win.addEventListener("contextmenuclick", (e) => {
  if (e.detail.id === "copy") { /* ... */ }
  if (e.detail.id === "paste") { /* ... */ }
});
```

上下文菜单点击会以 `contextmenuclick` 事件到达，而应用菜单
点击会以 `menuclick` 事件到达，因此你无需通过命名空间化 id 来区分它们。

## 动态菜单

应用菜单可以在任何时候通过再次调用 `setApplicationMenu`
来替换，操作系统会在原位置替换该菜单。没有“更新单个条目”的
API；当状态变化时，请重建数组并调用 `setApplicationMenu`：

```ts
function rebuildEditMenu(canUndo: boolean) {
  win.setApplicationMenu([
    {
      submenu: {
        label: "Edit",
        items: [
          {
            item: {
              label: "Undo",
              id: "undo",
              accelerator: "CmdOrCtrl+Z",
              enabled: canUndo,
            },
          },
        ],
      },
    },
  ]);
}
```

对于频繁更新的菜单（每次按键），请批量更新，而不是在每次变化时都调用。

## 禁用和隐藏条目

设置 `enabled: false` 可将条目置灰：

```ts
const save: Deno.MenuItem = {
  item: { label: "Save", id: "save", enabled: false },
};
```

没有 `visible` 标志。若要隐藏某个条目，请将其从数组中排除，并再次调用
`setApplicationMenu`。
