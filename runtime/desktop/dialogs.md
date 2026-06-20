---
last_modified: 2026-06-16
title: "对话框"
description: "prompt()、alert() 和 confirm() 会在 deno desktop 应用中显示原生弹窗对话框，而不是终端提示。"
---

:::info 即将随 Deno 2.9 提供

`deno desktop` 随 Deno v2.9.0 发布，目前还不在稳定版中。要立即试用它，请运行 `deno upgrade canary` 来安装 [`canary`](/runtime/reference/cli/upgrade/) 构建版本。在该功能稳定之前，命令、配置键和 TypeScript API 仍可能发生变化。

:::

熟悉的浏览器全局函数 `prompt()`、`alert()` 和 `confirm()` 可以在 `deno desktop` 应用中工作，但它们不会从终端读取输入，而是显示**原生弹窗对话框**。

这让桌面应用无需任何特定平台的代码就能显得原生，同时保持与你在浏览器端脚本中编写的相同 API。

## `alert(message)`

显示一个带有 OK 按钮的模态对话框。返回 `void`。

```ts
alert("保存完成。");
```

当前窗口是父窗口：点击对话框外部不会将其关闭；用户必须点击 OK。

## `confirm(message)`

显示一个带有 OK 和 Cancel 的模态对话框。返回 `boolean`：OK 返回 `true`，Cancel 返回 `false`。

```ts
if (confirm("放弃未保存的更改？")) {
  await closeDocument();
}
```

## `prompt(message, defaultValue?)`

显示一个带有文本输入框以及 OK 和 Cancel 的模态对话框。返回输入的字符串；如果用户取消，则返回 `null`。

```ts
const name = prompt("新文档名称：", "Untitled");
if (name !== null) {
  await createDocument(name);
}
```

## 何时触发

这些函数会阻塞调用代码（同步执行），直到用户作出响应。它们运行在**Deno 运行时线程**上，而不是 webview 中，所以不会冻结渲染中的 UI，但会暂停你的处理程序。

```ts
win.addEventListener("menuclick", (e) => {
  if (e.detail.id === "delete") {
    if (confirm("真的删除？")) {
      // … 执行删除
    }
  }
});
```

如果你从 webview 端调用它们（通过渲染页面中的 JavaScript），则会改用 webview 自己的原生对话框：`window.alert()`、`window.confirm()` 和 `window.prompt()`，由浏览器实现。行为类似：这是一个限定于该 webview 的原生模态对话框。

## 与终端 Deno 的差异

在普通的 `deno run` 脚本中，这些函数会从终端读写：`prompt` 读取一行 stdin，`confirm` 接受 `y` / `n`。这种终端行为在桌面应用中是不可见的，因此 `deno desktop` 会将它们替换为原生对话框，而你无需修改任何代码。

## 文件和文件夹对话框

原生的文件选择和文件夹选择对话框目前还没有作为一等 API 暴露出来。在此之前，有两种变通方法：

1. **使用 webview 的 `<input type="file">`**。webview 会显示操作系统原生的选择器，得到的 `File` 对象可以通过绑定传给 Deno 侧处理：

   ```html
   <input id="f" type="file" accept=".json">
   <script>
     document.getElementById("f").addEventListener("change", async (e) => {
       const file = e.target.files[0];
       await bindings.handleFile(file.name, await file.arrayBuffer());
     });
   </script>
   ```

   ```ts
   win.bind("handleFile", async (name, bytes) => {
     await Deno.writeFile(name + ".bak", new Uint8Array(bytes));
   });
   ```

2. **拖放到 webview 中**。将文件拖到 `<div>` 上，用 File API 读取它，然后通过绑定传递字节。

原生文件选择器 API 已列入路线图。

## 通知

系统通知有专门的 API：标准 Web 的 `Notification` 构造函数，可从你的 Deno 侧代码中调用。参见 [通知](/runtime/desktop/notifications/)。

## 剪贴板

目前尚未暴露专门的剪贴板 API。暂时请在 webview 端使用 Web `Clipboard` API（`navigator.clipboard.readText()`、`writeText()`）。
