---
last_modified: 2026-06-18
title: "权限"
description: "Deno 权限系统参考：运行时沙箱如何工作，以及如何使用 --allow 和 --deny 标志授予或拒绝文件系统、网络、环境、系统、子进程、FFI 和导入访问权限。"
oldUrl:
  - /runtime/manual/basics/permissionsDeno/
  - /manual/basics/permissions
  - /runtime/manual/basics/permissions
  - /runtime/manual/getting_started/permissions
---

Deno 在安全沙箱中运行代码：除非你授予权限，否则程序无法访问敏感的系统 I/O。本页是每种权限以及控制它的 `--allow-*` / `--deny-*` 标志的参考。关于其背后的安全模型以及如何运行不受信任的代码，请参阅
[安全性](/runtime/fundamentals/security/)。

默认情况下，大多数系统 I/O 的访问都会被拒绝。不过也有一些 I/O 操作即使在默认情况下也会被有限度地允许。下面会进行说明。

要启用这些操作，用户必须显式向 Deno 运行时授予权限。方法是向 `deno` 命令传递 `--allow-read`、`--allow-write`、
`--allow-net`、`--allow-env`、`--allow-run`、`--allow-sys`、`--allow-ffi` 和
`--allow-import` 标志。

在脚本执行期间，当运行时提示时，用户还可以显式授予对特定文件、目录、网络地址、环境变量和子进程的权限。如果 stdout/stderr 不是 TTY，或者向 `deno` 命令传递了 `--no-prompt` 标志，则不会显示提示。

用户还可以使用 `--deny-read`、`--deny-write`、`--deny-net`、`--deny-env`、`--deny-run`、
`--deny-sys`、`--deny-ffi` 和 `--deny-import` 标志显式拒绝访问特定资源。这些标志优先于允许标志。例如，如果你允许网络访问但拒绝访问某个特定域名，那么拒绝标志将优先生效。

Deno 还提供了 `--allow-all` 标志，可授予脚本所有权限。这会**完全禁用**安全沙箱，应谨慎使用。`--allow-all` 的安全属性与在 Node.js 中运行脚本相同（即没有）。

定义：`-A, --allow-all`

```sh
deno run -A script.ts
deno run --allow-all script.ts
```

默认情况下，Deno 不会为权限请求生成堆栈跟踪，因为这会带来性能损耗。用户可以通过将 `DENO_TRACE_PERMISSIONS` 环境变量设置为 `1` 来启用堆栈跟踪。

Deno 还可以生成所有已访问权限的审计日志，不论该访问是被允许还是被拒绝。

将 `DENO_AUDIT_PERMISSIONS` 设置为一个**文件路径**以写入 JSONL —— 每一行都是一个包含以下键的对象：

- `v`: 格式版本
- `datetime`: 访问权限的时间，格式为 RFC 3339
- `permission`: 权限名称
- `value`: 访问权限时使用的值；如果访问时未使用值，则为 `null`

相关 schema 可在
[permission-audit.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/permission-audit.v1.json) 中找到。

此外，此环境变量还可以与上述 `DENO_TRACE_PERMISSIONS` 结合使用，这样会在条目中新增一个 `stack` 字段，该字段是一个包含所有堆栈跟踪帧的数组。

你也可以将 `DENO_AUDIT_PERMISSIONS=otel` 设置为将每次访问作为 OpenTelemetry **日志记录** 输出，而不是写入文件。记录会发送到你通过
[`OTEL_DENO`](/runtime/fundamentals/open_telemetry/) 配置的导出器，并包含这些属性：

- `deno.permission.type`
- `deno.permission.value`
- `deno.permission.stack`（如果也设置了 `DENO_TRACE_PERMISSIONS`）

如果你已经在收集 OpenTelemetry 数据，这是推荐的设置——权限审计会与 traces 和 metrics 一起落地，便于你将其与请求处理关联起来。

```sh
OTEL_DENO=true DENO_AUDIT_PERMISSIONS=otel deno run -A main.ts
```

## 配置文件

Deno 支持将权限存储在 deno.json/deno.jsonc 文件中。更多内容请参见 [配置](/runtime/reference/deno_json/#permissions)。

## 文件系统访问

默认情况下，执行中的代码不能读取或写入文件系统中的任意文件。这包括列出目录内容、检查某个文件是否存在，以及打开或连接 Unix 套接字。

读取文件的访问权限使用 `--allow-read`（或 `-R`）标志授予，写入文件的访问权限使用 `--allow-write`（或 `-W`）标志授予。这些标志可以指定一个路径列表，以允许访问特定文件或目录及其任何子目录。

定义：`--allow-read[=<PATH>...]` 或 `-R[=<PATH>...]`

PATH 可以用逗号（`,`）分隔。若要在 PATH 中包含逗号字符，必须将其写成双逗号。（示例：`this file,, contains a comma.txt`）

```sh
# 允许对文件系统的所有读取
deno run -R script.ts
# 或
deno run --allow-read script.ts

# 仅允许读取 foo.txt 和 bar.txt
deno run --allow-read=foo.txt,bar.txt script.ts

# 允许读取 ./node_modules 任意子目录中的任何文件
deno run --allow-read=node_modules script.ts
```

定义：`--deny-read[=<PATH>...]`

```sh
# 允许读取 /etc 中的文件，但不允许读取 /etc/hosts
deno run --allow-read=/etc --deny-read=/etc/hosts script.ts

# 拒绝所有磁盘读取访问，并禁用读取权限提示。
deno run --deny-read script.ts
```

定义：`--allow-write[=<PATH>...]` 或 `-W[=<PATH>...]`

```sh
# 允许对文件系统的所有写入
deno run -W script.ts
# 或
deno run --allow-write script.ts

# 仅允许写入 foo.txt 和 bar.txt
deno run --allow-write=foo.txt,bar.txt script.ts
```

定义：`--deny-write[=<PATH>...]`

```sh
# 允许读取当前工作目录中的文件
# 但不允许写入 ./secrets 目录。
deno run --allow-write=./ --deny-write=./secrets script.ts

# 拒绝所有磁盘写入访问，并禁用权限提示。
deno run --deny-write script.ts
```

Deno 中的一些 API 在底层通过文件系统操作实现，尽管它们并不直接提供对特定文件的读/写访问。这些 API 会对磁盘进行读写，但不需要任何显式的读/写权限。这些 API 的一些示例包括：

- `localStorage`
- Deno KV
- `caches`
- `Blob`

由于这些 API 是通过文件系统操作实现的，即使用户没有直接访问文件系统的权限，也可以用它们消耗文件系统资源，例如存储空间。

在模块加载期间，Deno 可以从磁盘加载文件。这有时需要显式权限，有时则默认允许：

- 从入口模块以可被静态分析的方式导入的所有文件，默认都允许读取。这包括静态 `import` 语句，以及参数为指向特定文件或文件目录的字符串字面量的动态 `import()` 调用。可以使用 `deno info <entrypoint>` 打印出这份列表中的全部文件。
- 以无法被静态分析的方式动态导入的文件需要运行时读取权限。
- `node_modules/` 目录中的文件默认允许读取。

当从网络获取模块，或者将代码从 TypeScript 转译为 JavaScript 时，Deno 会使用文件系统作为缓存。这意味着即使用户没有显式授予读/写权限，Deno 也可能消耗文件系统资源，例如存储空间。

### 符号链接

通过符号链接读取或写入时，Deno 会基于符号链接本身的位置检查权限，而不是其指向的目标。这意味着如果你有 `--allow-read=/app`，你可以通过位于 `/app/link` 的符号链接读取，即使它指向 `/app` 之外的文件。

不过，Deno 会阻止通过符号链接进行权限提升。如果某个符号链接解析到了敏感系统路径，则需要额外权限：

- **`/proc`, `/dev`, `/sys`（Linux）**：通过解析到这些路径的符号链接进行读取或写入需要 `--allow-all`，因为这些路径可能暴露敏感的系统信息。
- **`/proc/**/environ`**：需要 `--allow-env`，因为它会暴露环境变量。
- **`/dev/null`, `/dev/zero`, `/dev/random`, `/dev/urandom`**：这些安全设备文件始终可访问，无需额外权限。

使用 [`Deno.symlink()`](/api/deno/~/Deno.symlink) 创建符号链接时，需要同时具备完整访问权限的 `--allow-read` 和 `--allow-write`（不是仅针对路径的权限），因为符号链接可能指向任意位置。

> **注意**：文件系统中已存在的符号链接可以使用符号链接本身位置对应的权限进行读取。完整的读/写权限要求仅适用于使用 [`Deno.symlink()`](/api/deno/~/Deno.symlink) _创建_ 新的符号链接。

## 网络访问

默认情况下，执行中的代码不能发起网络请求、打开网络监听器或执行 DNS 解析。这包括发出 HTTP 请求、打开 TCP/UDP 套接字，以及监听通过 TCP 或 UDP 传入的连接。

网络访问使用 `--allow-net` 标志授予。该标志可以指定一个主机列表，以允许访问特定网络地址。主机可以是主机名或 IP 地址，并可选带端口。

主机名不允许子域名，除非显式列出。若要允许某个主机名的任意子域名，可以使用 `*` 作为任意子域名的通配符。

定义：`--allow-net[=<HOST>...]` 或 `-N[=<HOST>...]`

```sh
# 允许网络访问
deno run -N script.ts
# 或
deno run --allow-net script.ts

# 允许访问 github.com 和 jsr.io
deno run --allow-net=github.com,jsr.io script.ts

# 允许 example.com 的所有子域名
deno run --allow-net="*.example.com" script.ts

# 端口 80 上的主机名：
deno run --allow-net=example.com:80 script.ts

# 端口 443 上的 IPv4 地址
deno run --allow-net=1.1.1.1:443 script.ts

# 一个 IPv6 地址，允许所有端口
deno run --allow-net=[2606:4700:4700::1111] script.ts
```

定义：`--deny-net[=<HOST>...]`

```sh
# 允许访问网络，但拒绝访问
# github.com 和 jsr.io
deno run --allow-net --deny-net=github.com,jsr.io script.ts

# 拒绝所有网络访问，并禁用权限提示。
deno run --deny-net script.ts
```

在模块加载期间，Deno 可以从网络加载模块。默认情况下，Deno 允许通过静态和动态导入从以下位置加载模块，而无需显式网络访问权限：

- `https://deno.land/`
- `https://jsr.io/`
- `https://esm.sh/`
- `https://raw.esm.sh/`
- `https://cdn.jsdelivr.net/`
- `https://raw.githubusercontent.com/`
- `https://gist.githubusercontent.com/`

这些位置是受信任的“公共利益”注册表，不预期会通过 URL 路径实现数据外泄。你可以使用 `--allow-import` 标志添加更多受信任的注册表。

此外，Deno 允许通过 `npm:` 标识符导入任何 NPM 包。

Deno 还会最多每天向 `https://dl.deno.land/` 发送一次请求，以检查 Deno CLI 是否有更新。可以使用环境变量 `DENO_NO_UPDATE_CHECK=1` 来禁用此功能。

## 环境变量

默认情况下，执行的代码不能读取或写入环境变量。这包括读取环境变量以及设置新值。

通过 `--allow-env` 标志授予对环境变量的访问权限。该标志可以配合一个环境变量列表使用，以允许访问特定的环境变量。从 Deno v2.1 开始，你现在可以指定后缀通配符，以允许对环境变量进行“作用域化”访问。

定义：`--allow-env[=<VARIABLE_NAME>...]` 或 `-E[=<VARIABLE_NAME>...]`

```sh
# 允许访问所有环境变量
deno run -E script.ts
# 或
deno run --allow-env script.ts

# 允许 HOME 和 FOO 环境变量
deno run --allow-env=HOME,FOO script.ts

# 允许访问所有以 AWS_ 开头的环境变量
deno run --allow-env="AWS_*" script.ts
```

定义：`--deny-env[=<VARIABLE_NAME>...]`

```sh
# 允许所有环境变量，除了
# AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY。
deno run \
  --allow-env \
  --deny-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY \
  script.ts

# 拒绝对所有环境变量的访问，禁用权限提示。
deno run --deny-env script.ts
```

`--ignore-env` 标志与 `--deny-env` 类似，但不同之处在于，它不会直接拒绝访问，而是对任何环境变量读取静默返回 `undefined`。当你希望代码在缺少权限时也能运行，而不是失败时，这很有用，它会将受限变量视为未设置。

定义：`--ignore-env[=<VARIABLE_NAME>...]`

```sh
# 忽略所有环境变量读取（返回 undefined）。
deno run --ignore-env script.ts

# 忽略特定环境变量。
deno run --ignore-env=PORT,HOME script.ts
```

> Windows 用户注意：环境变量在 Windows 上不区分大小写，
> 因此 Deno 也会以不区分大小写的方式匹配它们（仅限 Windows）。

Deno 在启动时会读取某些环境变量，例如 `DENO_DIR` 和
`NO_COLOR`（[查看完整列表](/runtime/reference/env_variables/)）。

`NO_COLOR` 环境变量的值对在 Deno 运行时中运行的所有代码都是可见的，
无论该代码是否已被授予读取环境变量的权限。

## 系统信息

默认情况下，执行的代码无法访问系统信息，例如操作系统版本、
系统运行时间、平均负载、网络接口以及系统内存信息。

通过 `--allow-sys` 标志授予对系统信息的访问权限。该标志可以配合
来自 [Deno.SysPermissionDescriptor](/api/deno/~/Deno.SysPermissionDescriptor) 中定义的列表的允许接口列表使用。
这些字符串会映射到 `Deno` 命名空间中提供操作系统信息的函数，例如
[Deno.systemMemoryInfo](https://docs.deno.com/api/deno/~/Deno.SystemMemoryInfo)。

定义：`--allow-sys[=<API_NAME>...]` 或 `-S[=<API_NAME>...]`

```sh
# 允许所有系统信息 API
deno run -S script.ts
# 或
deno run --allow-sys script.ts

# 允许 systemMemoryInfo 和 osRelease API
deno run --allow-sys="systemMemoryInfo,osRelease" script.ts
```

定义：`--deny-sys[=<API_NAME>...]`

```sh
# 允许访问所有系统信息，但 "networkInterfaces" 除外
deno run --allow-sys --deny-sys="networkInterfaces" script.ts

# 拒绝对所有系统信息的访问，禁用权限提示。
deno run --deny-sys script.ts
```

`--allow-sys` 接受的接口名称对应于 `Deno` 命名空间中暴露主机信息的函数，例如 `hostname`、`osRelease`、
`osUptime`、`loadavg`、`networkInterfaces`、`systemMemoryInfo`、`uid`、`gid`、
`username`、`cpus` 和 `homedir`。有关可识别名称的完整集合，请参见
[Deno.SysPermissionDescriptor](/api/deno/~/Deno.SysPermissionDescriptor)。

同一标志也会控制对应的 Node 兼容 API。[`node:os`](/api/node/os/) 和
[`node:process`](/api/node/process/) 中读取系统信息的函数，例如 `os.hostname()`、`os.cpus()`、
`os.networkInterfaces()`、`os.freemem()`、`os.totalmem()`、`os.uptime()`、
`process.getuid()` 和 `process.getgid()`，都需要 `--allow-sys`，并映射到
相同的接口名称。例如，调用 `os.cpus()` 需要
`--allow-sys=cpus`，而 `os.networkInterfaces()` 需要
`--allow-sys=networkInterfaces`。

## 子进程

默认情况下，在 Deno 运行时中执行的代码不能生成子进程，因为这将构成违反“代码不能在未经用户同意的情况下提升其权限”这一原则。

Deno 提供了执行子进程的机制，但这需要用户显式授权。这通过 `--allow-run` 标志实现。

你从程序中生成的任何子进程都会独立于授予父进程的权限运行。这意味着子进程可以访问系统资源，而不受你授予生成它的 Deno 进程的权限限制。这通常被称为权限提升。

因此，请务必仔细考虑是否要授予程序 `--allow-run` 访问权限：它本质上会使 Deno 安全沙箱失效。如果你确实需要生成特定可执行文件，可以通过向 `--allow-run` 标志传递特定可执行文件名来限制 Deno 进程可以启动的程序，从而降低风险。

定义：`--allow-run[=<PROGRAM_NAME>...]`

```sh
# 允许运行所有子进程
deno run --allow-run script.ts

# 允许运行 "curl" 和 "whoami" 子进程
deno run --allow-run="curl,whoami" script.ts
```

:::caution

除非父进程具有 `--allow-all`，否则你大概永远不想使用 `--allow-run=deno`，因为能够启动一个 `deno` 进程意味着脚本可以以完全权限再启动另一个 `deno` 进程。

:::

### 带有 `LD_*` 和 `DYLD_*` 环境变量的子进程

使用名称以 `LD_` 开头的环境变量（例如 `LD_LIBRARY_PATH` 或 `LD_PRELOAD`）或以 `DYLD_` 开头的环境变量（例如 `DYLD_LIBRARY_PATH` 或 `DYLD_INSERT_LIBRARIES`）来生成子进程，需要未限定范围的 `--allow-run` 标志。像 `--allow-run=curl` 这样的限定范围允许列表 _不足够_，即使其值与 Deno 启动时使用的值相同也是如此：

```ts
// 在 `--allow-run=echo` 下失败，在 `--allow-run` 或 `--allow-all` 下成功。
new Deno.Command("echo", {
  args: ["hello"],
  env: { LD_PRELOAD: "/path/to/lib.so" },
}).outputSync();
```

```console
NotCapable: 需要 --allow-run 权限才能使用 LD_PRELOAD
环境变量生成子进程。或者，在该环境变量未设置的情况下生成。
```

这些变量会指示动态链接器将任意共享库加载到子进程中，因此无论你允许了哪个可执行文件，它们都可以在子进程中运行代码。将它们限制为未限定范围的 `--allow-run`，可以防止限定范围的允许列表被静默绕过。如果你不需要它们，最简单的修复方式是在生成子进程时不设置该变量。

定义：`--deny-run[=<PROGRAM_NAME>...]`

```sh
# 允许运行所有程序，但 "whoami" 和 "ps" 除外。
deno run --allow-run --deny-run="whoami,ps" script.ts

# 拒绝生成子进程的所有访问，禁用
# 权限提示。
deno run --deny-run script.ts
```

默认情况下，`npm` 包在安装期间不会执行其 post-install 脚本（例如使用 `deno install` 时），因为这会允许任意代码执行。使用 `--allow-scripts` 标志运行时，npm 包的 post-install 脚本将作为子进程执行。

## FFI（外部函数接口）

Deno 提供了一种[在 Deno 运行时中执行其他语言编写的代码的 FFI 机制](/runtime/fundamentals/ffi/)，例如 Rust、C 或 C++。这通过 [`Deno.dlopen`](/api/deno/~/Deno.dlopen) API 实现，它可以加载共享库并调用其中的函数。

默认情况下，执行的代码不能使用 [`Deno.dlopen`](/api/deno/~/Deno.dlopen) API，因为这将构成违反“代码不能在未经用户同意的情况下提升其权限”这一原则。

除了 [`Deno.dlopen`](/api/deno/~/Deno.dlopen) 之外，FFI 还可以通过 Node-API（NAPI）原生插件使用。这些默认情况下也不允许。

[`Deno.dlopen`](/api/deno/~/Deno.dlopen) 和 NAPI 原生插件都需要使用 `--allow-ffi` 标志显式授权。该标志可以配合文件或目录列表使用，以允许访问特定的动态库。

_与子进程类似，动态库不会在沙箱中运行，因此不具有与其被加载到其中的 Deno 进程相同的安全限制。因此，请极其谨慎地使用。_

定义：`--allow-ffi[=<PATH>...]`

```sh
# 允许加载所有动态库
deno run --allow-ffi script.ts

# 允许从特定路径加载动态库
deno run --allow-ffi=./libfoo.so script.ts
```

定义：`--deny-ffi[=<PATH>...]`

```sh
# 允许加载所有动态库，但 ./libfoo.so 除外
deno run --allow-ffi --deny-ffi=./libfoo.so script.ts

# 拒绝加载所有动态库，禁用权限提示。
deno run --deny-ffi script.ts
```

## 从 Web 导入

允许从 Web 导入代码。默认情况下，Deno 会限制你可以从哪些主机导入代码。这对静态导入和动态导入都适用。

如果你想动态导入代码，无论是使用 `import()` 还是 `new Worker()` API，都需要授予额外权限。从本地文件系统导入[需要 `--allow-read`](#file-system-access)，但 Deno 也允许从 `http:` 和 `https:` URL 导入。在这种情况下，你需要指定显式的 `--allow-import` 标志：

```sh
# 允许从 `https://example.com` 导入代码
$ deno run --allow-import=example.com main.ts
```

默认情况下，Deno 允许从以下主机导入源代码：

- `deno.land`
- `jsr.io`
- `esm.sh`
- `raw.esm.sh`
- `cdn.jsdelivr.net`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`

只允许使用 HTTPS 进行导入。

此允许列表默认应用于静态导入，并且在指定 `--allow-import` 标志时，默认也应用于动态导入。

```sh
# 允许从 `https://deno.land` 动态导入代码
$ deno run --allow-import main.ts
```

请注意，为 `--allow-import` 指定允许列表将覆盖默认主机列表。

使用 `--deny-import` 可以阻止从特定主机导入，即使它们本来会被允许。拒绝标志优先于允许标志：

```sh
# 允许默认导入主机，但排除 esm.sh
$ deno run --deny-import=esm.sh main.ts
```
