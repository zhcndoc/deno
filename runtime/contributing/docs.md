---
title: "Documentation guidelines"
description: "Guide for contributing to Deno's documentation. Learn our documentation standards, writing style, and how to submit 文档 changes."
---

我们欢迎并感谢对 Deno 文档的贡献。如果你发现了问题，或者想要添加内容，每个页面底部都有一个“编辑此页面”的按钮。点击此按钮将带你到该页面在 [Deno 文档库](https://github.com/denoland/docs/) 中的源文件。然后你可以进行更改并提交拉取请求。

Deno 文档中的某些页面是从 Deno 库中的源文件生成的。这些页面不能直接编辑：

- [API 参考](/api/deno/) 页面是从 Deno 库中的类型定义生成的。
- 每个单独命令的 [CLI 参考](/runtime/reference/cli/) 页面是从 Deno 库中的源文件生成的。

如果你发现这些页面中的问题，你可以向 Deno 库提交拉取请求，或者在 [Deno 文档库](https://github.com/denoland/docs/issues) 中提出问题，我们会对此进行修复。
## Running the docs locally

You can fork and clone the entire
[Deno docs repository](https://github.com/denoland/docs) to your local machine
and run the docs locally. This is useful if you want to see how your changes
will look before submitting a pull request.

1. Fork the [Deno docs repository](https://github.com/denoland/docs).
2. Clone your fork to your local machine with `git clone`.
3. Change directory into the `docs` directory you just cloned.
4. Run the docs repo locally with `deno task serve`.
5. Open your browser and navigate to `http://localhost:3000`.
6. Optionally, generate the API documentation with `deno task reference`.

To see a more detailed description of available tasks, check out the
[Deno docs README](https://github.com/denoland/docs?tab=readme-ov-file#deno-docs)
