---
title: "本地开发"
---

:::info 旧版文档

您正在查看 Deno Deploy Classic 的旧版文档。我们建议
迁移至新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

要进行本地开发，您可以使用 `deno` CLI。要安装 `deno`，请按照
[Deno 手册](https://deno.land/manual/getting_started/installation)中的说明进行操作。

安装后，您可以在本地运行脚本：

```shell
$ deno run --allow-net=:8000 https://deno.com/examples/hello.js
正在监听 http://localhost:8000
```

要监视文件更改，请添加 `--watch` 标志：

```shell
$ deno run --allow-net=:8000 --watch ./main.js
正在监听 http://localhost:8000
```

有关 Deno CLI 的更多信息，以及如何配置您的开发环境和 IDE，请访问 Deno 手册的[开始使用][manual-gs]部分。

[manual-gs]: https://deno.land/manual/getting_started