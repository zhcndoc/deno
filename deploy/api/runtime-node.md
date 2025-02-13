---
title: "Node.js 内置 API"
oldUrl:
  - /deploy/docs/runtime-node/
  - /deploy/manual/runtime-node/
---

Deno Deploy 原生支持使用 `node:` 前缀导入内置的 Node.js 模块，如 `fs`、`path` 和 `http`。这使得原本为 Node.js 编写的代码可以在 Deno Deploy 中无须修改地运行。

以下是一个在 Deno Deploy 上运行的 Node.js HTTP 服务器示例：

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

使用 `node:` 前缀时，Deno Deploy 的所有其他功能仍然可用。例如，您可以使用 `Deno.env` 访问环境变量，即使是在使用 Node.js 模块的情况下。您还可以像往常一样从外部 URL 导入其他 ESM 模块。

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

这些模块的行为在大多数情况下应与 Node.js 一致。由于 Deno Deploy 的沙箱行为，一些功能不可用：

- 使用 `child_process` 执行二进制文件
- 使用 `worker_threads` 生成工作线程
- 使用 `vm` 创建上下文并评估代码

> 注：Node.js 模块的仿真对于大多数用例来说是足够的，但
> 仍然不完美。如果您遇到任何问题，请
> [提出问题](https://github.com/denoland/deno)。