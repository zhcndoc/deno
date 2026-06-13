---
last_modified: 2026-05-20
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

[`Deno.env`](/api/deno/~/Deno.env) 具有 getter 和 setter 方法。以下是
示例用法：

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

## 在运行命令时设置变量

与其他 CLI 命令一样，您可以在运行命令之前设置环境变量，如下所示：

```shell
MY_VAR="我的值" deno run main.ts
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

:::note Variables with spaces

当在 `.env` 文件中设置包含空格字符的环境变量时，请确保将值用引号括起来。例如：

```shell
MY_VAR="包含空格的我的值"
```

:::

## 特殊环境变量

Deno 运行时具有以下特殊环境变量。

| 名称                   | 描述                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DENO_AUTH_TOKENS       | 以分号分隔的 bearer token 和主机名列表，用于从私有仓库获取远程模块时使用<br />(例如 `abcde12345@deno.land;54321edcba@github.com`)                                                                                                                                                                     |
| DENO_TLS_CA_STORE      | 以逗号分隔的、顺序相关的证书存储列表。<br />可能的值：`system`、`mozilla`。默认值为 `mozilla`。                                                                                                                                                                                                                         |
| DENO_CERT              | 从 PEM 编码文件加载证书颁发机构                                                                                                                                                                                                                                                                                                      |
| NODE_EXTRA_CA_CERTS    | 指向包含额外证书颁发机构的 PEM 文件的路径。会在根证书存储级别加载，因此这些证书会被 `fetch()`、[`Deno.connectTls()`](/api/deno/~/Deno.connectTls) 以及 Node 兼容 API（`node:https`、`node:tls`）所信任。在 Deno 2.8+ 中可用。缺失或无效的文件会发出警告而不是失败，这与 Node.js 一致。 |
| DENO_COVERAGE_DIR      | 设置用于收集覆盖率分析数据的目录。此选项仅适用于 [`deno test` 子命令](/runtime/reference/cli/test/)。                                                                                                                                                                                                            |
| DENO_DIR               | 设置缓存目录                                                                                                                                                                                                                                                                                                                               |
| DENO_INSTALL_ROOT      | 设置 deno install 的输出目录（默认为 `$HOME/.deno/bin`）                                                                                                                                                                                                                                                                                   |
| DENO_REPL_HISTORY      | 设置 REPL 历史文件路径。值为空时会禁用历史文件 <br />（默认为 `$DENO_DIR/deno_history.txt`）                                                                                                                                                                                                                          |
| DENO_NO_PACKAGE_JSON   | 禁用 `package.json` 的自动解析                                                                                                                                                                                                                                                                                                            |
| DENO_CONDITIONS        | 以逗号分隔的自定义条件列表，用于解析 npm 包导出（等同于 `--conditions` 标志）                                                                                                                                                                                                                           |
| DENO_NO_PROMPT         | 设置后可在访问时禁用权限提示<br />（可替代在调用时传递 `--no-prompt`）                                                                                                                                                                                                                                                 |
| DENO_NO_UPDATE_CHECK   | 设置后可禁用检查是否有更新的 Deno 版本可用                                                                                                                                                                                                                                                                                          |
| DENO_V8_FLAGS          | 设置 V8 命令行选项                                                                                                                                                                                                                                                                                                                           |
| DENO_JOBS              | 与测试子命令的 `--parallel` 标志一起使用的并行 worker 数量。<br />默认为可用 CPU 数量。                                                                                                                                                                                                                        |
| DENO_KV_ACCESS_TOKEN   | 连接到 Deno KV 数据库时使用的个人访问令牌（例如通过 [`Deno.openKv`](/api/deno/~/Deno.openKv) 或带有 KV Connect URL 的 `@deno/kv`）。                                                                                                                                                                                       |
| DENO_AUDIT_PERMISSIONS | 审计每次权限访问。设置为文件路径时将写入 JSONL，或设置为字面值 `otel` 时通过已配置的 OTel 导出器发出 OpenTelemetry 日志记录。有关字段集合，请参见[权限审计](/runtime/reference/permissions/)。                                                                                                      |
| DENO_TRACE_PERMISSIONS | 设置为 `1` 以在权限提示中启用堆栈跟踪（默认禁用，因为收集跟踪会影响性能）                                                                                                                                                                                                                             |
| DENO_WEBGPU_TRACE      | 指向目录的路径，用于在使用 WebGPU API 时输出 [WGPU 跟踪](https://github.com/gfx-rs/wgpu/pull/619)                                                                                                                                                                                                                                    |
| DENO_WEBGPU_BACKEND    | 选择 WebGPU 将使用的后端，或按偏好顺序排列的、以逗号分隔的后端列表。可能的值为 `vulkan`、`dx12`、`metal` 或 `opengl`                                                                                                                                                                                          |
| HTTP_PROXY             | HTTP 请求的代理地址（模块下载、fetch）                                                                                                                                                                                                                                                                                             |
| HTTPS_PROXY            | HTTPS 请求的代理地址（模块下载、fetch）                                                                                                                                                                                                                                                                                            |
| NPM_CONFIG_REGISTRY    | npm 注册表的 URL。                                                                                                                                                                                                                                                                                                                      |
| NO_COLOR               | 设置后禁用颜色                                                                                                                                                                                                                                                                                                                                  |
| NO_PROXY               | 不使用代理的主机列表，以逗号分隔（模块下载、fetch）                                                                                                                                                                                                                                                                      |
