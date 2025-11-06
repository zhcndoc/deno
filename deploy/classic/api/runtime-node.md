---
title: "Node.js 内置 API"
oldUrl:
  - /deploy/docs/runtime-node/
  - /deploy/manual/runtime-node/
  - /deploy/api/runtime-node/
---

:::info Legacy Documentation

您正在查看 Deno Deploy Classic 的遗留文档。我们建议迁移到新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

Deno Deploy Classic 原生支持通过 `node:` 前缀导入内置 Node.js 模块，例如 `fs`、`path` 和 `http`。这允许您无需修改即可运行最初为 Node.js 编写的代码。

以下是在 Deno Deploy Classic 上运行的 Node.js HTTP 服务器示例：

```js
import { createServer } from "node:http";
import process from "node:process";

const server = createServer((req, res) => {
  const message = `Hello from ${process.env.DENO_REGION} at ${new Date()}`;
  res.end(message);
});

server.listen(8080);
```

_您可以在这里实时查看此示例：
https://dash.deno.com/playground/node-specifiers_

使用 `node:` 前缀时，Deno Deploy Classic 的所有其他功能依然可用。例如，即便使用 Node.js 模块，您仍可以使用 `Deno.env` 访问环境变量。您也可以像往常一样从外部 URL 导入其他 ESM 模块。

以下 Node.js 模块可用：

- `assert`
- `assert/strict`
- `async_hooks`
- `buffer`
- `child_process`
- `cluster`
- `console`
- `constants`
- `crypto`
- `dgram`
- `diagnostics_channel`
- `dns`
- `dns/promises`
- `domain`
- `events`
- `fs`
- `fs/promises`
- `http`
- `http2`
- `https`
- `module`
- `net`
- `os`
- `path`
- `path/posix`
- `path/win32`
- `perf_hooks`
- `process`
- `punycode`
- `querystring`
- `readline`
- `stream`
- `stream/consumers`
- `stream/promises`
- `stream/web`
- `string_decoder`
- `sys`
- `timers`
- `timers/promises`
- `tls`
- `tty`
- `url`
- `util`
- `util/types`
- `v8`
- `vm`
- `worker_threads`
- `zlib`

这些模块的行为在大多数情况下应与 Node.js 一致。由于 Deno Deploy Classic 的沙箱行为，部分功能不可用：

- 使用 `child_process` 执行二进制文件
- 使用 `worker_threads` 生成工作线程
- 使用 `vm` 创建上下文并评估代码

> 注：Node.js 模块的仿真对于大多数用例来说是足够的，但
> 仍然不完美。如果您遇到任何问题，请
> [提出问题](https://github.com/denoland/deno)。