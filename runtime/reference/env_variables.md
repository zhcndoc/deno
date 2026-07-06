---
last_modified: 2026-07-02
title: "环境变量"
description: "Deno 中使用环境变量的指南。了解 Deno.env API、.env 文件支持、CLI 配置以及控制 Deno 行为的特殊环境变量。"
oldUrl:
  - /runtime/manual/basics/env_variables/
  - /runtime/reference/cli/env_variables/
---

在 Deno 中使用环境变量有几种方式：

## Built-in Deno.env Methods

The Deno runtime provides built-in support for environment variables through
[`Deno.env`](https://docs.deno.com/api/deno/~/Deno.env).

[`Deno.env`](/api/deno/~/Deno.env) has getter and setter methods. Here is an
example:

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

## [`@std/dotenv`](/runtime/reference/std/dotenv/)

标准库中的 `dotenv` 包也可以用于从 `.env` 加载环境变量。

假设您有一个 `.env` 文件，如下所示：

```sh
GREETING="你好，世界。"
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

## Set variables when running a command

As with other CLI commands, you can set environment variables before running a command, as follows:

```shell
MY_VAR="my value" deno run main.ts
```

This can be useful when you want to change a task based on environment variables, and it can be combined with the
[`deno task`](/runtime/reference/cli/task/) command, as follows:

```jsonc title="deno.json"
{

  ...
  
  "tasks": {
    "build:full": {
      "description": "Build the site with all features",
      "command": "BUILD_TYPE=FULL deno run main.ts"
    },
    "build:light": {
      "description": "Build the site without expensive operations",
      "command": "BUILD_TYPE=LIGHT deno run main.ts"
    }
  }
}
```

:::note 带空格的变量

When setting environment variables that contain spaces in a `.env` file, be sure to wrap the value in quotes. For example:

```shell
MY_VAR="my value with spaces"
```

:::

## 特殊环境变量

Deno 运行时具有以下特殊环境变量。

| 名称                   | 描述                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DENO_AUTH_TOKENS       | 用分号分隔的 bearer token 和主机名列表，在从私有仓库获取远程模块时使用<br />(例如 `abcde12345@deno.land;54321edcba@github.com`)                                                                                                                                                                     |
| DENO_TLS_CA_STORE      | 用逗号分隔的、按顺序依赖的证书存储列表。<br />可能的值：`system`、`mozilla`。默认值为 `mozilla`。                                                                                                                                                                                                                         |
| DENO_CERT              | 从 PEM 编码文件加载证书颁发机构。该文件可以包含多个证书，每个证书位于各自的 PEM 块中。这是 `--cert` 标志对应的环境变量形式。                                                                                                                                                          |
| NODE_EXTRA_CA_CERTS    | 指向包含额外证书颁发机构的 PEM 文件的路径。会在根证书存储级别加载，因此这些证书会被 `fetch()`、[`Deno.connectTls()`](/api/deno/~/Deno.connectTls) 以及 Node 兼容 API（`node:https`、`node:tls`）所信任。Deno 2.8+ 可用。缺失或无效的文件会发出警告，而不会导致失败，这与 Node.js 的行为一致。 |
| DENO_COVERAGE_DIR      | 设置用于收集覆盖率配置文件数据的目录。此选项仅适用于 [`deno test 子命令`](/runtime/reference/cli/test/)。                                                                                                                                                                                                            |
| DENO_DIR               | 设置缓存目录                                                                                                                                                                                                                                                                                                                               |
| DENO_INSTALL           | 由 [shell 安装脚本](/runtime/getting_started/installation/) 使用，用于选择 `deno` 可执行文件的安装位置。二进制文件会放置在 `$DENO_INSTALL/bin/deno`。                                                                                                                                                                      |
| DENO_INSTALL_ROOT      | 设置 `deno install` 的安装根目录。可执行文件会放置在其 `bin` 子目录中，除非路径本身已经以 `bin` 结尾（默认值为 `$HOME/.deno`，即可执行文件会放到 `$HOME/.deno/bin`）                                                                                                                                         |
| DENO_REPL_HISTORY      | 设置 REPL 历史文件路径。当值为空时，历史文件会被禁用 <br />(默认值为 `$DENO_DIR/deno_history.txt`)                                                                                                                                                                                                                          |
| DENO_NO_PACKAGE_JSON   | 禁用 `package.json` 的自动解析                                                                                                                                                                                                                                                                                                            |
| DENO_CONDITIONS        | 用逗号分隔的自定义条件列表，在解析 npm 包导出时使用（等同于 `--conditions` 标志）                                                                                                                                                                                                                           |
| DENO_UNSTABLE_TSGO     | 设置为 `1` 时，使用 TypeScript 原生（Go）编译器进行类型检查。等同于 `--unstable-tsgo` 标志。另请参见 [TypeScript](/runtime/fundamentals/typescript/#faster-type-checking-with-the-native-compiler-tsgo)。                                                                                                                                    |
| DENO_NO_PROMPT         | 设置为在访问时禁用权限提示<br />(可替代在调用时传递 `--no-prompt`)                                                                                                                                                                                                                                                 |
| DENO_NO_UPDATE_CHECK   | 设置为禁用检查是否有更新版本的 Deno 可用                                                                                                                                                                                                                                                                                          |
| DENO_V8_FLAGS          | 设置 V8 命令行选项                                                                                                                                                                                                                                                                                                                           |
| DENO_JOBS              | 与测试子命令的 `--parallel` 标志一起使用的并行工作线程数量。<br />默认为可用 CPU 数量。                                                                                                                                                                                                                        |
| DENO_KV_ACCESS_TOKEN   | 连接到 Deno KV 数据库时使用的个人访问令牌（例如通过 [`Deno.openKv`](/api/deno/~/Deno.openKv) 或带有 KV Connect URL 的 `@deno/kv`）。                                                                                                                                                                                       |
| DENO_AUDIT_PERMISSIONS | 审计每一次权限访问。设置为文件路径时会写入 JSONL，或设置为字面值 `otel` 时会通过已配置的 OTel 导出器发出 OpenTelemetry 日志记录。有关字段集合请参见 [权限审计](/runtime/reference/permissions/)。                                                                                                      |
| DENO_TRACE_PERMISSIONS | 设置为 `1` 时，在权限提示中启用堆栈跟踪（默认禁用，因为收集跟踪会影响性能）                                                                                                                                                                                                                             |
| DENO_WEBGPU_TRACE      | 使用 WebGPU API 时，用于输出 [WGPU trace](https://github.com/gfx-rs/wgpu/pull/619) 的目录路径                                                                                                                                                                                                                                    |
| DENO_WEBGPU_BACKEND    | 选择 WebGPU 将使用的后端，或按优先级排序的、以逗号分隔的后端列表。可能的值为 `vulkan`、`dx12`、`metal` 或 `opengl`                                                                                                                                                                                          |
| HTTP_PROXY             | HTTP 请求的代理地址（模块下载、fetch）                                                                                                                                                                                                                                                                                             |
| HTTPS_PROXY            | HTTPS 请求的代理地址（模块下载、fetch）                                                                                                                                                                                                                                                                                            |
| NPM_CONFIG_REGISTRY    | npm 注册表使用的 URL。                                                                                                                                                                                                                                                                                                                      |
| NO_COLOR               | 设置为禁用颜色                                                                                                                                                                                                                                                                                                                                  |
| NO_PROXY               | 不使用代理的主机列表，以逗号分隔（模块下载、fetch）                                                                                                                                                                                                                                                                      |
