---
last_modified: 2025-03-12
title: "文档指南"
description: "为 Deno 文档做贡献的指南。了解我们的文档标准、写作风格，以及如何提交 文档 变更。"
---

我们欢迎并感谢对 Deno 文档的贡献。如果你发现了问题，或者想要添加内容，每个页面底部都有一个“编辑此页面”的按钮。点击此按钮将带你到该页面在 [Deno 文档库](https://github.com/denoland/docs/) 中的源文件。然后你可以进行更改并提交拉取请求。

Deno 文档中的某些页面是从 Deno 库中的源文件生成的。这些页面不能直接编辑：

- [API 参考](/api/deno/) 页面是从 Deno 库中的类型定义生成的。
- 每个单独命令的 [CLI 参考](/runtime/reference/cli/) 页面是从 Deno 库中的源文件生成的。

如果你发现这些页面中的问题，你可以向 Deno 库提交拉取请求，或者在 [Deno 文档库](https://github.com/denoland/docs/issues) 中提出问题，我们会对此进行修复。
## 本地运行文档

你可以将整个
[Deno 文档仓库](https://github.com/denoland/docs) fork 并克隆到你的本地机器
然后在本地运行文档。这在你想在提交拉取请求之前
预览你的更改效果时会很有用。

1. Fork [Deno 文档仓库](https://github.com/denoland/docs)。
2. 使用 `git clone` 将你的 fork 克隆到本地机器。
3. 进入你刚刚克隆的 `docs` 目录。
4. 使用 `deno task serve` 在本地运行该文档仓库。
5. 打开浏览器并访问 `http://localhost:3000`。
6. 可选地，使用 `deno task reference` 生成 API 文档。

要查看可用任务的更详细说明，请查看
[Deno 文档 README](https://github.com/denoland/docs?tab=readme-ov-file#deno-docs)
