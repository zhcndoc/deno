---
title: "环境变量"
description: "Deno 中使用环境变量的指南。了解 Deno.env API、.env 文件支持、CLI 配置以及控制 Deno 行为的特殊环境变量。"
oldUrl:
  - /runtime/manual/basics/env_variables/
  - /runtime/reference/cli/env_variables/
---

在 Deno 中使用环境变量有几种方式：

## 内置 Deno.env 方法

Deno 运行时提供了对环境变量的内置支持，通过
[`Deno.env`](https://docs.deno.com/api/deno/~/Deno.env)。

`Deno.env` 具有获取和设置方法。以下是示例用法：

```ts
Deno.env.set("FIREBASE_API_KEY", "examplekey123");
Deno.env.set("FIREBASE_AUTH_DOMAIN", "firebasedomain.com");

console.log(Deno.env.get("FIREBASE_API_KEY")); // examplekey123
console.log(Deno.env.get("FIREBASE_AUTH_DOMAIN")); // firebasedomain.com
console.log(Deno.env.has("FIREBASE_AUTH_DOMAIN")); // true
```

## .env 文件

Deno 也支持 `.env` 文件。您可以通过 `--env-file` 标志告诉 Deno 从 `.env` 中读取环境变量，例如：

```sh
deno run --env-file main.ts
```

这将从当前工作目录或包含 `.env` 文件的第一个父目录中读取 `.env` 文件。如果要从不同的文件加载环境变量，可以将该文件作为标志参数指定。

您可以传递多个 `--env-file` 标志（例如，
`deno run --env-file=.env.one --env-file=.env.two --allow-env <script>`）以从多个文件加载变量。

:::note

当单个 `.env` 文件内存在多个相同环境变量的声明时，将应用第一个出现的声明。然而，如果同一变量在多个 `.env` 文件中定义（使用多个 `--env-file` 参数），则最后一个指定文件中的值将优先。这意味着在最后列出的 `.env` 文件中的第一个出现将被应用。

:::

## `@std/dotenv`

标准库中的 `dotenv` 包也可以用于从 `.env` 加载环境变量。

假设您有一个 `.env` 文件，如下所示：

```sh
GREETING="Hello, world."
```

导入 `load` 模块以自动从 `.env` 文件导入到进程环境中。

```ts
import { load } from "jsr:@std/dotenv";

const env = await load({
  // 可选：选择特定路径（默认为 ".env"）
  envPath: ".env.local",
  // 可选：也导出到进程环境（这样 Deno.env 可以读取它）
  export: true,
});

console.log(env.GREETING);
console.log(Deno.env.get("GREETING"));
```

运行此命令时使用 `deno run --allow-read --allow-env app.ts`。

有关 `.env` 处理的更多文档可以在
[@std/dotenv](https://jsr.io/@std/dotenv/doc) 文档中找到。

## 在运行命令时设置变量

与其他 CLI 命令一样，您可以在运行命令之前设置环境变量，如下所示：

```shell
MY_VAR="my value" deno run main.ts
```

当您想根据环境变量更改任务时，这可能是有用的，并且可以与
[`deno task`](/runtime/reference/cli/task/) 命令结合使用，如下所示：

```jsonc title="deno.json"
{

  ...
  
  "tasks": {
    "build:full": {
      "description": "使用所有功能构建站点",
      "command": "BUILD_TYPE=FULL deno run main.ts"
    },
    "build:light": {
      "description": "构建不包含昂贵操作的站点",
      "command": "BUILD_TYPE=LIGHT deno run main.ts"
    }
  }
}
```

## `std/cli`

Deno 标准库具有 [`std/cli` 模块](https://jsr.io/@std/cli) 用于解析命令行参数。有关文档和示例，请参考该模块。

## 特殊环境变量

Deno 运行时具有以下特殊环境变量。

| 名称                 | 描述                                                                                                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DENO_AUTH_TOKENS     | 用于从私有存储库获取远程模块时要使用的以分号分隔的 bearer 令牌和主机名列表<br />(例如 `abcde12345@deno.land;54321edcba@github.com`) |
| DENO_TLS_CA_STORE    | 以逗号分隔的顺序相关证书存储列表.<br />可能的值：`system`，`mozilla`。默认为 `mozilla`。                                                                                     |
| DENO_CERT            | 从 PEM 编码文件加载证书颁发机构                                                                                                                                      |
| DENO_COVERAGE_DIR    | 设置收集覆盖率分析数据的目录。此选项仅适用于 [`deno test` 子命令](/runtime/reference/cli/test/)。                                        |
| DENO_DIR             | 设置缓存目录                                                                                                                                                           |
| DENO_INSTALL_ROOT    | 设置 deno 安装的输出目录（默认为 `$HOME/.deno/bin`）                                                                                                               |
| DENO_REPL_HISTORY    | 设置 REPL 历史文件路径，当值为空时禁用历史文件<br />(默认为 `$DENO_DIR/deno_history.txt`)                                                                         |
| DENO_NO_PACKAGE_JSON | 禁用 `package.json` 的自动解析                                                                                                                                     |
| DENO_NO_PROMPT       | 设置以禁用访问时的权限提示<br />(作为调用时传递 `--no-prompt` 的替代)                                                                                             |
| DENO_NO_UPDATE_CHECK | 设置以禁用检查是否有更新的 Deno 版本                                                                                                                                |
| DENO_V8_FLAGS        | 设置 V8 命令行选项                                                                                                                                                    |
| DENO_JOBS            | 用于 `--parallel` 标志与测试子命令的并行工作者数量.<br />默认为可用 CPU 的数量。                                                                                        |
| DENO_WEBGPU_TRACE    | 使用 WebGPU API 时输出 [WGPU 追踪](https://github.com/gfx-rs/wgpu/pull/619) 的目录路径                                                                                 |
| DENO_WEBGPU_BACKEND  | 选择 WebGPU 将使用的后端，或按优先顺序列出的逗号分隔的后端列表。可能的值为 `vulkan`，`dx12`，`metal` 或 `opengl`。                                                   |
| HTTP_PROXY           | HTTP 请求的代理地址（模块下载，提取）                                                                                                                                  |
| HTTPS_PROXY          | HTTPS 请求的代理地址（模块下载，提取）                                                                                                                                 |
| NPM_CONFIG_REGISTRY  | 用于 npm 注册表的 URL。                                                                                                                                                 |
| NO_COLOR             | 设置以禁用颜色                                                                                                                                                         |
| NO_PROXY             | 以逗号分隔的主机列表，表示不使用代理（模块下载，提取）                                                                                                                 |