---
last_modified: 2026-06-17
title: "通知"
description: "使用标准 Web Notifications API 从 deno desktop 应用中显示原生操作系统通知：权限流程、选项和事件。"
---

:::info 即将随 Deno 2.9 发布

`deno desktop` 随 Deno v2.9.0 一同发布，但尚未进入稳定版。要立即试用，请运行 `deno upgrade canary` 安装
[`canary`](/runtime/reference/cli/upgrade/) 构建。在该功能稳定之前，命令、配置键和 TypeScript API 仍可能发生变化。

:::

`deno desktop` 实现了标准的
[Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)。
你在浏览器中会使用的同一个 `Notification` 构造函数，会从你的 Deno 端代码中显示**原生
操作系统通知**（macOS 用户通知、Windows toast 通知，或 Linux 桌面通知服务）。

```ts
const n = new Notification("Build complete", {
  body: "Your binary is ready.",
});

n.addEventListener("click", () => win.focus()); // bring the app to front
```

`Notification` 仅定义在使用 `deno desktop` 编译的应用中。在普通的
`deno run` 脚本里它不存在。

## 权限

通知受操作系统级权限控制，和网页上的行为完全一致。使用 `Notification.permission` 检查当前状态，并用 `Notification.requestPermission()` 请求权限：

```ts
if (Notification.permission !== "granted") {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    // 用户拒绝了，不要尝试发送通知。
    return;
  }
}

new Notification("All set", { body: "Notifications are enabled." });
```

`Notification.permission` 是一个**缓存的**同步 getter，保存最近一次查询或请求的结果。`requestPermission()` 会在用户尚未决定时首次触发系统提示，并解析为 `"granted"`、
`"denied"` 或 `"default"`。

如需获取实时的操作系统状态，包括平台是否根本具备权限模型，请查询 Permissions API：

```ts
const status = await navigator.permissions.query({ name: "notifications" });
console.log(status.state); // "granted" | "denied" | "prompt"
```

在没有权限概念的平台或后端上（例如未打包的 macOS 进程、某些 Linux 通知守护进程），查询会报告 `"prompt"`，并且通知会在没有显式授权的情况下显示。

:::note macOS 需要经过代码签名的 bundle

macOS 只会向具有稳定代码身份的应用授予通知权限。`deno desktop` 会对其生成的每个 bundle 进行临时签名（并在 `--hmr` 模式下重新签名缓存的运行时），因此这可以开箱即用。有关配置真实签名身份，请参见
[分发](/runtime/desktop/distribution/#code-signing)。

:::

## 选项

构造函数接受标准的 `NotificationOptions`：

```ts
new Notification("New message", {
  body: "Alice: are we still on for 3pm?",
  icon: "data:image/png;base64,iVBORw0KGgo…",
  tag: "chat-alice",
  requireInteraction: true,
  silent: false,
});
```

| 选项                 | 类型                       | 说明                                                                      |
| -------------------- | -------------------------- | ------------------------------------------------------------------------- |
| `body`               | `string`                   | 通知的正文文本。                                                           |
| `icon`               | `string`                   | 图标 URL。仅显示 `data:` URL（见下文）。                                   |
| `tag`                | `string`                   | 用相同标签替换现有通知，而不是叠加显示。                                   |
| `requireInteraction` | `boolean`                  | 保持通知可见，直到用户将其关闭。                                           |
| `silent`             | `boolean \| null`          | 禁用通知声音。                                                             |
| `badge`              | `string`                   | 徽标 URL（取决于平台）。                                                   |
| `dir`                | `"auto" \| "ltr" \| "rtl"` | 文本方向。                                                                 |
| `lang`               | `string`                   | BCP 47 语言标签。                                                         |
| `data`               | `any`                      | 附加到通知上的任意数据；可从 `data` 中读取回来。                           |

### 图标

Web Notifications 规范将 `icon` 的类型定义为 URL 字符串。桌面运行时只能同步解析 `data:` URL，因此会渲染内联的 `data:image/png;base64,…` 图标。其他 URL 协议（`https:`、`file:`）会被接受，并且会通过 `icon` 属性往返保留，但操作系统通知显示时不会带图标。要使用磁盘上的文件，请读取它并将其编码为 `data:` URL：

```ts
import { encodeBase64 } from "jsr:@std/encoding/base64";

const bytes = await Deno.readFile("./icons/alert.png");
const dataUrl = "data:image/png;base64," + encodeBase64(bytes);
new Notification("Heads up", { icon: dataUrl });
```

## 事件

`Notification` 是一个 `EventTarget`。可使用 `addEventListener` 或 `on<event>` 属性监听：

```ts
const n = new Notification("Download finished");

n.onshow = () => console.log("已显示");
n.onclick = () => openDownloadsFolder();
n.onclose = () => console.log("已关闭");
n.onerror = () => console.warn("操作系统拒绝了该通知");
```

| 事件    | 触发时机                                         |
| ------- | ----------------------------------------------------- |
| `show`  | 操作系统显示了通知。                    |
| `click` | 用户点击了通知主体。               |
| `close` | 用户将其关闭，或它已过期。                 |
| `error` | 操作系统无法显示它（例如权限被拒绝）。 |

## 关闭

调用 `close()` 可通过程序关闭通知：

```ts
const n = new Notification("Connecting…");
// later, once connected:
n.close();
```

除此之外，通知都是一次性的。显示之后由操作系统负责管理，`close()` 只是尽力而为的请求。
