---
title: "安全与权限"
oldUrl:
  - /runtime/manual/basics/permissionsDeno/
  - /manual/basics/permissions
  - /runtime/manual/basics/permissions
  - /runtime/manual/getting_started/permissions
---

Deno 默认是安全的。除非你特意启用，否则在 Deno 中运行的程序没有访问敏感 API 的权限，例如文件系统访问、网络连接或环境访问。你必须通过命令行标志或运行时权限提示明确授予对这些资源的访问。这与 Node 的一个主要区别是，Node 中的依赖项会自动获得对所有系统 I/O 的完全访问权限，这可能会将隐藏的漏洞引入你的项目。

在使用 Deno 运行完全不可信的代码之前，请阅读下面的 [执行不可信代码](#executing-untrusted-code) 部分。

## 关键原则

在深入了解权限的具体细节之前，了解 Deno 安全模型的关键原则是很重要的：

- **默认情况下没有 I/O 访问**：在 Deno 运行时中执行的代码没有权限读取或写入任意文件，在文件系统上进行网络请求或打开网络监听器，访问环境变量，或生成子进程。
- **同一特权级别下代码的执行没有限制**：Deno 允许通过多种方式执行任何代码（JS/TS/Wasm），包括 `eval`、`new Function`、动态导入和网页工作者，几乎不限制代码来源（网络、npm、JSR 等）。
- **同一应用程序的多次调用可以共享数据**：Deno 提供了一种机制，使同一应用程序的多次调用可以通过内置缓存和 KV 存储 API 共享数据。不同的应用程序不能看到彼此的数据。
- **所有在同一线程上执行的代码共享相同的特权级别**：所有在同一线程上执行的代码共享相同的特权级别。在同一线程内，不同模块不可能拥有不同的特权级别。
- **代码不能在未获得用户同意的情况下提升其特权**：在 Deno 运行时中执行的代码不能在未获得用户的明确同意（通过交互式提示或调用时间标志）提升其特权。
- **初始静态模块图可以不受限制地导入本地文件**：所有在初始静态模块图中导入的文件可以不受限制地导入，即使该文件未明确授予读取权限。这不适用于任何动态模块导入。

这些关键原则旨在提供一个用户可以以最低风险执行代码的环境，以免对主机计算机或网络造成伤害。安全模型旨在易于理解，并在运行时与执行其中的代码之间提供清晰的关注点分离。安全模型由 Deno 运行时强制执行，并不依赖于底层操作系统。

## 权限

默认情况下，对大多数系统 I/O 的访问是被拒绝的。即便如此，仍然有一些 I/O 操作在有限的范围内允许，这些将在下面描述。

为了启用这些操作，用户必须明确授予 Deno 运行时权限。这是通过将 `--allow-read`、`--allow-write`、`--allow-net`、`--allow-env` 和 `--allow-run` 标志传递给 `deno` 命令来完成的。

在执行脚本时，用户也可以在运行时提示时明确授予对特定文件、目录、网络地址、环境变量和子进程的访问权限。如果 stdout/stderr 不是 TTY，或者在 `deno` 命令中传递了 `--no-prompt` 标志，则不会显示提示。

用户还可以通过使用 `--deny-read`、`--deny-write`、`--deny-net`、`--deny-env` 和 `--deny-run` 标志明确拒绝对特定资源的访问。这些标志优先于许可标志。例如，如果你允许网络访问但拒绝访问特定域，则拒绝标志将优先。

Deno 还提供了 `--allow-all` 标志，该标志授予脚本所有权限。这将 **完全禁用** 安全沙箱，应该谨慎使用。`--allow-all` 具有与在 Node.js 中运行脚本相同的安全属性（即无安全性）。

定义：`-A, --allow-all`

```sh
deno run -A script.ts
deno run --allow-all script.ts
```

默认情况下，Deno 不会为权限请求生成堆栈跟踪，因为这对性能有一定影响。用户可以通过 `DENO_TRACE_PERMISSIONS` 环境变量启用堆栈跟踪。

### 文件系统访问

默认情况下，执行的代码无法读取或写入文件系统上的任意文件。这包括列出目录内容，检查指定文件的存在性，以及打开或连接 Unix 套接字。

通过使用 `--allow-read`（或 `-R`）标志授予读取文件的权限，通过使用 `--allow-write`（或 `-W`）标志授予写入文件的权限。这些标志可以通过指定路径列表来允许访问特定文件或目录。

定义：`--allow-read[=<PATH>...]` 或 `-R[=<PATH>...]`

```sh
# 允许从文件系统读取所有文件
deno run -R script.ts
# 或 
deno run --allow-read script.ts

# 仅允许读取文件 foo.txt 和 bar.txt
deno run --allow-read=foo.txt,bar.txt script.ts
```

定义：`--deny-read[=<PATH>...]`

```sh
# 允许读取 /etc 中的文件，但不允许读取 /etc/hosts
deno run --allow-read=/etc --deny-read=/etc/hosts script.ts

# 拒绝所有对磁盘的读取访问，禁用读取的权限提示。
deno run --deny-read script.ts
```

定义：`--allow-write[=<PATH>...]` 或 `-W[=<PATH>...]`

```sh
# 允许对文件系统的所有写入
deno run -W script.ts
# 或 
deno run --allow-write script.ts

# 仅允许写入文件 foo.txt 和 bar.txt
deno run --allow-write=foo.txt,bar.txt script.ts
```

定义：`--deny-write[=<PATH>...]`

```sh
# 允许读取当前工作目录中的文件 
# 但不允许写入 ./secrets 目录。
deno run --allow-write=./ --deny-write=./secrets script.ts

# 拒绝所有对磁盘的写入访问，禁用写入的权限提示。
deno run --deny-write script.ts
```

一些 Deno 中的 API 是在后台使用文件系统操作实现的，即使它们并不直接提供对特定文件的读/写访问。这些 API 会读取和写入磁盘，但不需要任何明确的读/写权限。这些 API 的一些例子包括：

- `localStorage`
- Deno KV
- `caches`
- `Blob`

由于这些 API 使用文件系统操作实现，用户可以使用它们来消耗存储空间等文件系统资源，即使他们没有对文件系统的直接访问权限。

在加载模块时，Deno 可以从磁盘加载文件。这有时需要明确的权限，有时则默认允许：

- 以可以静态分析的方式从入口模块导入的所有文件默认被允许读取。这包括静态 `import` 语句和动态 `import()` 调用，其中参数是指向特定文件或文件目录的字符串字面量。可以使用 `deno info <entrypoint>` 打印出这个列表中的文件的完整列表。
- 以不可以静态分析的方式动态导入的文件要求运行时读取权限。
- `node_modules/` 目录中的文件默认允许读取。

当从网络中获取模块或将 TypeScript 代码转译为 JavaScript 时，Deno 使用文件系统作为缓存。这意味着即使用户未明确授予读/写权限，Deno 仍然可以消耗像存储空间这样的文件系统资源。

### 网络访问

默认情况下，执行的代码不能进行网络请求、打开网络监听器或执行 DNS 解析。这包括发起 HTTP 请求、打开 TCP/UDP 套接字和监听 TCP 或 UDP 上的传入连接。

网络访问是通过 `--allow-net` 标志授予的。该标志可以通过指定 IP 地址或主机名的列表来允许访问特定的网络地址。

定义：`--allow-net[=<IP_OR_HOSTNAME>...]` 或 `-N[=<IP_OR_HOSTNAME>...]`

```sh
# 允许网络访问
deno run -N script.ts
# 或
deno run --allow-net script.ts

# 允许访问 github.com 和 jsr.io 的网络
deno run --allow-net=github.com,jsr.io script.ts

# 主机名在 80 端口：
deno run --allow-net=example.com:80 script.ts

# IPv4 地址在 443 端口
deno run --allow-net=1.1.1.1:443 script.ts

# 一个 IPv6 地址，所有端口都允许
deno run --allow-net=[2606:4700:4700::1111] script.ts
```

定义：`--deny-net[=<IP_OR_HOSTNAME>...]`

```sh
# 允许访问网络，但拒绝访问 
# github.com 和 jsr.io
deno run --allow-net --deny-net=github.com,jsr.io script.ts

# 拒绝所有网络访问，禁用权限提示。
deno run --deny-net script.ts
```

在加载模块时，Deno 可以从网络加载模块。默认情况下，Deno 允许使用静态和动态导入从以下位置加载模块，而不需要明确的网络访问：

- `https://deno.land/`
- `https://jsr.io/`
- `https://esm.sh/`
- `https://raw.githubusercontent.com`
- `https://gist.githubusercontent.com`

这些位置是受信任的“公共良好”注册表，不被期望通过 URL 路径启用数据外泄。你可以使用 `--allow-imports` 标志添加更多受信任的注册表。

此外，Deno 允许通过 `npm:` 说明符导入任何 NPM 包。

Deno 还每天最多向 `https://dl.deno.land/` 发送一次请求，以检查 Deno CLI 的更新。这可以通过设置环境变量 `DENO_NO_UPDATE_CHECK=1` 来禁用。

### 环境变量

默认情况下，执行的代码不能读取或写入环境变量。这包括读取环境变量和设置新值。

访问环境变量的权限是通过 `--allow-env` 标志授予的。该标志可以通过指定允许访问特定环境变量的环境变量列表来使用。从 Deno v2.1 开始，你现在可以指定后缀通配符以允许对环境变量的“作用域”访问。

定义：`--allow-env[=<VARIABLE_NAME>...]` 或 `-E[=<VARIABLE_NAME>...]`

```sh
# 允许访问所有环境变量
deno run -E script.ts
# 或
deno run --allow-env script.ts

# 允许访问 HOME 和 FOO 环境变量
deno run --allow-env=HOME,FOO script.ts

# 允许访问所有以 AWS_ 开头的环境变量
deno run --allow-env="AWS_*" script.ts
```

定义：`--deny-env[=<VARIABLE_NAME>...]`

```sh
# 允许所有环境变量，但拒绝 
# AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY。
deno run \
  --allow-env \
  --deny-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY \
  script.ts

# 拒绝所有对环境变量的访问，禁用权限提示。
deno run --deny-env script.ts
```

> Windows 用户注意：环境变量在 Windows 上不区分大小写，Deno 也会在 Windows 上不区分大小写地匹配它们。

Deno 在启动时读取某些环境变量，例如 `DENO_DIR` 和 `NO_COLOR`（[查看完整列表](/runtime/reference/cli/env_variables/)）。

`NO_COLOR` 环境变量的值对在 Deno 运行时中运行的所有代码都是可见的，无论该代码是否已被授予读取环境变量的权限。

### 系统信息

默认情况下，执行的代码不能访问系统信息，例如操作系统版本、系统正常运行时间、负载平均值、网络接口和系统内存信息。

访问系统信息的权限是通过 `--allow-sys` 标志授予的。该标志可以通过指定允许访问的接口列表来使用，接口可以包括：`hostname`、`osRelease`、`osUptime`、`loadavg`、`networkInterfaces`、`systemMemoryInfo`、`uid` 和 `gid`。这些字符串映射到 `Deno` 命名空间中的提供 OS 信息的函数，比如
[Deno.systemMemoryInfo](https://docs.deno.com/api/deno/~/Deno.SystemMemoryInfo)。

定义：`--allow-sys[=<API_NAME>...]` 或 `-S[=<API_NAME>...]`

```sh
# 允许所有系统信息 API
deno run -S script.ts
# 或
deno run --allow-sys script.ts

# 允许 systemMemoryInfo 和 osRelease APIs
deno run --allow-sys="systemMemoryInfo,osRelease" script.ts
```

定义：`--deny-sys[=<API_NAME>...]`

```sh
# 允许访问所有系统信息，但限制 "networkInterfaces"
deno run --allow-sys --deny-sys="networkInterfaces" script.ts

# 拒绝对系统信息的所有访问，禁用权限提示。
deno run --deny-sys script.ts
```

### 子进程

默认情况下，在 Deno 运行时中执行的代码不能生成子进程，因为这将构成违反不可以在未获得用户同意的情况下提升其特权的原则。

Deno 提供了一种执行子进程的机制，但这需要用户的明确权限。这是通过使用 `--allow-run` 标志来完成的。

从程序生成的任何子进程独立于父进程所授予的权限运行。这意味着子进程可以访问系统资源，而不考虑已授予生成它的 Deno 进程的权限。这通常被称为特权提升。

因此，请确保仔细考虑是否想要授予程序 `--allow-run` 访问权限：这本质上无效化了 Deno 的安全沙箱。如果你确实需要生成特定的可执行文件，可以通过将特定的可执行文件名称传递给 `--allow-run` 标志来降低风险。

定义：`--allow-run[=<PROGRAM_NAME>...]`

```sh
# 允许运行所有子进程
deno run --allow-run script.ts

# 允许运行 "curl" 和 "whoami" 子进程
deno run --allow-run="curl,whoami" script.ts
```

:::caution

除非父进程具有 `--allow-all`，否则你可能永远不想使用 `--allow-run=deno`，因为能够生成一个 `deno` 进程意味着该脚本可以生成另一个具有完全权限的 `deno` 进程。

:::

定义：`--deny-run[=<PROGRAM_NAME>...]`

```sh
# 允许运行所有程序，但 "whoami" 和 "ps"。
deno run --allow-run --deny-run="whoami,ps" script.ts

# 拒绝所有生成子进程的访问，禁用权限提示。
deno run --deny-run script.ts
```

默认情况下，`npm` 包的后安装脚本不会在安装期间执行（例如通过 `deno install`），因为这会允许任意代码执行。当使用 `--allow-scripts` 标志运行时，npm 包的后安装脚本将作为子进程执行。

### FFI（外部函数接口）

Deno 提供了一种机制，用于从 Deno 运行时执行用其他语言（如 Rust、C 或 C++）编写的代码。这是通过 `Deno.dlopen` API 来完成的，它可以加载共享库并从中调用函数。

默认情况下，执行的代码不能使用 `Deno.dlopen` API，因为这违反了代码不能在未获得用户同意的情况下提升其特权的原则。

除了 `Deno.dlopen`，FFI 也可以通过 Node-API (NAPI) 原生添加模块使用。这些默认情况下也不被允许。

`Deno.dlopen` 和 NAPI 原生添加模块都需要使用 `--allow-ffi` 标志明确授权。该标志可以通过指定允许访问特定动态库的文件或目录列表来使用。

_同子进程一样，动态库不会在沙箱中运行，因此没有与它们被加载到的 Deno 进程相同的安全限制。因此，请极其小心地使用。_

定义：`--allow-ffi[=<PATH>...]`

```sh
# 允许加载所有动态库
deno run --allow-ffi script.ts

# 允许从特定路径加载动态库
deno run --allow-ffi=./libfoo.so script.ts
```

定义：`--deny-ffi[=<PATH>...]`

```sh
# 允许加载所有动态库，但 ./libfoo.so
deno run --allow-ffi --deny-ffi=./libfoo.so script.ts

# 拒绝加载所有动态库，禁用权限提示。
deno run --deny-ffi script.ts
```

### 从 Web 导入

允许从 Web 导入代码。默认情况下，Deno 限制可以从中导入代码的主机。这对于静态和动态导入都是如此。

如果你想动态导入代码，无论是使用 `import()` 还是 `new Worker()` API，都需要授予额外的权限。从本地文件系统导入 [需要 `--allow-read`](#file-system-read-access)，但 Deno 也允许从 `http:` 和 `https:` URL 导入。在这种情况下，你需要指定一个明确的 `--allow-import` 标志：

```
# 允许从 `https://example.com` 导入代码
$ deno run --allow-import=example.com main.ts
```

默认情况下，Deno 允许从以下主机导入源：

- `deno.land`
- `esm.sh`
- `jsr.io`
- `cdn.jsdelivr.net`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`

**仅允许使用 HTTPS 进行导入**

此允许列表默认适用于静态导入，并在指定 `--allow-import` 标志时默认适用于动态导入。

```
# 允许从 `https://deno.land` 动态导入代码
$ deno run --allow-import main.ts
```

请注意，为 `--allow-import` 指定允许列表将覆盖默认主机列表。

## 代码评估

Deno 对同一特权级别下的代码执行没有限制。这意味着在 Deno 运行时中执行的代码可以使用 `eval`、`new Function`，甚至动态导入或 web 工作者，以相同的特权级别执行**任意**代码，与调用 `eval`、`new Function` 或动态导入或 web 工作者的代码相同。

这些代码可以托管在网络上，可以是本地文件（如果已授予读取权限），或以字符串形式在调用 `eval`、`new Function` 或动态导入或 web 工作者的代码中存储的纯文本。

## 执行不可信代码

虽然 Deno 提供了一些旨在保护主机计算机和网络免受伤害的安全功能，但不可信代码仍然令人害怕。在执行不可信代码时，确保拥有多层防御是很重要的。以下是一些执行不可信代码的建议，我们建议在执行任意不可信代码时使用以下所有建议：

- 限制权限运行 `deno`，并预先确定实际需要运行的代码（并通过使用 `--frozen` 锁定文件和 `--cached-only` 防止更多代码被加载）。
- 使用操作系统提供的沙箱机制，如 `chroot`、`cgroups`、`seccomp` 等。
- 使用虚拟机或 MicroVM（gVisor、Firecracker 等）等沙箱环境。