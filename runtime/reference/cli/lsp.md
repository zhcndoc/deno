---
title: "deno lsp"
oldUrl: /runtime/manual/tools/lsp/
---

:::info

通常情况下，用户不会直接使用此子命令。`deno lsp` 可以为 IDE 提供跳转到定义的支持以及自动代码格式化。

:::

启动 Deno 语言服务器。该语言服务器供编辑器使用，用于提供诸如 IntelliSense、代码格式化等功能。

## 用法

```sh
deno lsp
```

语言服务器通过 stdin/stdout 使用
[语言服务器协议](https://microsoft.github.io/language-server-protocol/)进行通信。
你通常不会直接运行它——你的编辑器会自动启动它。

## 编辑器设置

有关将编辑器配置为使用 Deno 语言服务器的说明，请参见：

- [Deno & VS Code](/runtime/reference/vscode/)
- 其他编辑器的 [LSP 集成](/runtime/reference/lsp_integration/)
