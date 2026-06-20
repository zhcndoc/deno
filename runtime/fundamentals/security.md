---
last_modified: 2026-06-17
title: "安全与权限"
description: "Deno 安全模型指南：默认安全执行、权限沙箱、评估和执行不受信任的代码，以及权限代理。有关标志，请参阅 Permissions 参考。"
---

Deno 默认是安全的。除非你特意启用，否则在 Deno 中运行的程序没有访问敏感 API 的权限，例如文件系统访问、网络连接或环境访问。你必须通过命令行标志或运行时权限提示明确授予对这些资源的访问。这与 Node 的一个主要区别是，Node 中的依赖项会自动获得对所有系统 I/O 的完全访问权限，这可能会将隐藏的漏洞引入你的项目。

在使用 Deno 运行完全不受信任的代码之前，请阅读下面的
[执行不受信任的代码](#executing-untrusted-code) 部分。

## 关键原则

在深入了解权限的具体细节之前，了解 Deno 安全模型的关键原则是很重要的：

- **默认不允许访问 I/O**：在 Deno 运行时中执行的代码无法
  读取或写入文件系统上的任意文件，无法发起网络
  请求或打开网络监听器，无法访问环境变量，或
  派生子进程。
- **对同一特权级别下的代码执行没有限制**：Deno
  允许通过多种方式执行任何代码（JS/TS/Wasm），包括
  `eval`、`new Function`、动态导入和 web 工作者，并且都在同一特权
  级别下，对代码来源几乎没有限制（网络、npm、
  JSR 等）。
- **同一应用的多次调用可以共享数据**：Deno 提供
  一种机制，使同一应用的多次调用能够共享数据，
  通过内置缓存和 KV 存储 API。不同应用之间无法看到彼此的数据。
- **在同一线程上执行的所有代码共享相同的特权级别**：所有
  在同一线程上执行的代码共享相同的特权级别。不同模块
  不可能在同一线程内拥有不同的特权级别。
- **代码不能在未经用户同意的情况下提升其权限**：在 Deno 运行时中执行的
  代码不能在用户未明确同意通过交互式提示或运行时标志进行
  提权的情况下提升其权限。
- **初始静态模块图可以不受限制地导入模块**：
  初始静态模块图中导入的所有模块（本地文件、
  npm 包、jsr 包和远程 URL）都会由运行时加载，而不
  需要咨询权限系统。加载本地
  文件不需要 `--allow-read`，获取远程模块也不需要 `--allow-net`。静态
  图包括静态 `import` 语句和 specifier 为字符串字面量的 `import()` 调用：任何
  无需运行代码即可解析的内容。此
  例外仅适用于加载。一旦代码运行，它所做的任何事情仍然会经过
  权限系统，而带有非字面量
  specifier 的 `import()` 调用（例如 `import(someVariable)`）会在运行时根据 `--allow-read` /
  `--allow-import` 进行检查。

这些关键原则旨在提供一个用户可以以最低风险执行代码的环境，以免对主机计算机或网络造成伤害。安全模型旨在易于理解，并在运行时与执行其中的代码之间提供清晰的关注点分离。安全模型由 Deno 运行时强制执行，并不依赖于底层操作系统。

## 权限

Deno 默认处于沙箱中：除非你允许，否则代码无法触碰文件系统、网络、
环境，或运行子进程。权限并非全有或全无。你可以通过 `--allow-*` 标志授予它们，并且大多数权限都可以限定到
特定资源，因此程序只会获得它所需的确切访问权限，不会更多。

使用不带任何标志的方式运行程序时，敏感操作会被拒绝：

```sh
deno run main.ts
# error: Requires net access to "example.com", run again with the --allow-net flag
```

授予仅限于程序应访问的主机的权限：

```sh
deno run --allow-net=example.com main.ts
```

相同的范围限制也适用于其他权限：`--allow-read=./data` 将
读取限制在一个目录中，`--allow-env=API_KEY` 限制为单个变量，等等。单独的 `--allow-net` 若不带值则会授予整个类别的权限，这比大多数程序所需的范围更广。

当某个操作被拒绝时（因为未授予权限或已被
显式拒绝），Deno 会抛出 `NotCapable` 错误。如果你希望优雅地处理缺失权限，
可以像处理其他错误一样捕获它：

```ts
try {
  await Deno.readTextFile("/etc/hosts");
} catch (err) {
  if (err instanceof Deno.errors.NotCapable) {
    console.error("缺少读取权限，请使用 --allow-read 重新运行");
  }
}
```

当 stdout 是终端且你没有传入标志时，Deno 会暂停并询问，
而不是直接失败，因此你可以在请求时以交互方式授予访问权限：

```console
⚠️  Deno requests net access to "example.com". Run again with --allow-net to bypass this prompt.
   Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all net permissions) >
```

`--deny-*` 标志会覆盖对应的 `--allow-*` 标志，因此你可以先授予
较大的类别，再划出敏感部分：
`--allow-read --deny-read=/etc` 允许读取除 `/etc` 之外的所有内容。在另一个
极端，`-A`（`--allow-all`）会授予一切并完全关闭沙箱，
与在 Node 中运行代码获得的访问权限相同，因此请谨慎使用。

有关每种权限及其标志，请参阅 [Permissions 参考](/runtime/reference/permissions/)，以及在配置文件中声明它们的 [deno.json 中的 `permissions`](/runtime/reference/deno_json/#permissions)。

### 绕过沙箱的权限

少数权限会授予对 Deno 无法沙箱化的内容的访问，因此授予它们
实际上等同于授予完全访问权限：

- `--allow-run` 允许程序派生子进程。子进程会作为
  独立程序运行，拥有自己的权限，而不是你授予给 Deno 进程的受限权限，
  因此它所做的一切都发生在沙箱之外。这也是
  `--allow-run=deno` 尤其危险的原因：一个能够启动新的 `deno`
  进程的脚本可以用 `--allow-all` 启动它，继承不到父进程的任何
  限制，从而完全逃离沙箱。只有在可以明确信任的特定可执行文件上才授予 `--allow-run`
  （例如 `--allow-run=git`），并避免给沙箱化程序
  启动 `deno` 或 shell 的能力。
- `--allow-ffi` 通过 [FFI](/runtime/fundamentals/ffi/)
  或 Node-API 插件加载本机库。Deno 在 JavaScript 层强制执行权限，但
  本机库以编译后的机器码形式在同一进程中运行，并可直接发出系统调用。
  一旦加载，它就可以读取文件、打开套接字，或执行操作系统允许进程做的
  任何事情，而不受你传入的 `--allow-*` 标志的限制。

将 `--allow-write` 与 `--allow-run` 结合使用时要小心。对
包含已允许可执行文件的目录（或对可执行文件本身）的写访问会使
程序能够覆盖该二进制文件，因此它接下来启动的子进程会以攻击者控制的代码
并使用主机权限运行。避免授予对你通过 `--allow-run` 允许的二进制文件所在目录的写访问。

在决定是否信任你正在运行的代码时，请将这两者都视为等同于 `--allow-all`。

### 在运行时调整权限

程序可以通过
[`Deno.permissions`](/api/deno/#permissions) API 检查并收紧自身权限。
[`Deno.permissions.query`](/api/deno/#query-permissions) 会报告权限是否已授予，
[`Deno.permissions.request`](/api/deno/#request-permissions) 会按需提示申请权限，而
[`Deno.permissions.revoke`](/api/deno/#revoke-permissions)
会将已授予权限降级回提示状态：

```ts
// 启动时读取配置文件，然后放弃读取权限。
const config = JSON.parse(await Deno.readTextFile("./config.json"));
await Deno.permissions.revoke({ name: "read" });

// 之后的读取现在必须再次提示，在 --no-prompt 下会直接失败。
```

在启动后放弃不再需要的权限，是缩小其余代码（包括依赖项）可利用攻击面的简单方法。

## 代码评估

Deno 对同一特权级别下的代码执行没有限制。这意味着在 Deno 运行时中执行的代码可以使用 `eval`、`new Function`，甚至动态导入或 web 工作者，以相同的特权级别执行**任意**代码，与调用 `eval`、`new Function` 或动态导入或 web 工作者的代码相同。

这些代码可以托管在网络上，可以是本地文件（如果已授予读取权限），或以字符串形式在调用 `eval`、`new Function` 或动态导入或 web 工作者的代码中存储的纯文本。

## 执行不可信代码

虽然 Deno 提供了一些旨在保护主机计算机和网络免受伤害的安全功能，但不可信代码仍然令人害怕。在执行不可信代码时，确保拥有多层防御是很重要的。以下是一些执行不可信代码的建议，我们建议在执行任意不可信代码时使用以下所有建议：

- 使用有限权限运行 `deno`，并提前确定实际需要运行的代码（并使用 `--frozen` 锁文件和
  `--cached-only` 防止加载更多代码）。
- 将不受信任的部分隔离在
  [具有受限权限集的 Web Worker](/runtime/reference/web_platform_apis/#specifying-worker-permissions) 中，
  这样它就不能继承主程序被授予的全部权限。
- 使用操作系统提供的沙箱机制，例如 `chroot`、`cgroups`、`seccomp`，
  等等。
- 使用虚拟机或 MicroVM 之类的沙箱环境（gVisor、Firecracker 等）。

## 审计依赖项

权限沙箱控制代码在运行时可以做什么，但不会告诉你依赖项中是否包含已知漏洞。Deno 提供 [`deno audit`](/runtime/reference/cli/audit/) 用于扫描你的依赖项并与漏洞数据库进行比对，这对于作为 CI 门禁很有用。有关随着时间推移保持依赖项安全的方法，请参阅 [供应链管理](/runtime/packages/supply_chain/)。

## 权限代理

:::caution 仅限高级用法

使用权限代理会改变 Deno 的决策权：CLI 标志和
提示将不再生效。请确保你的代理进程足够健壮、经过审计，并且在启用 `DENO_PERMISSION_BROKER_PATH` 之前
可用。

:::

对于集中式、基于策略的权限决策，Deno 可以将所有权限检查委托给外部代理进程。通过将 `DENO_PERMISSION_BROKER_PATH` 环境变量设置为 Deno 用于连接代理的路径来启用此功能：

- 在类 Unix 系统上：使用 Unix 域套接字路径（例如，`/tmp/deno-perm.sock`）。
- 在 Windows 上：使用命名管道（例如，`\\.\pipe\deno-perm-broker`）。

当权限代理激活时：

- 所有 `--allow-*` 和 `--deny-*` 标志将被忽略。
- 不显示交互式权限提示（等同于非交互模式）。
- 每次权限检查均发送给代理；代理必须对每个请求回复决策。

如果代理过程中出现任何错误（例如：Deno 无法连接到套接字/管道，消息格式错误，消息顺序错乱，ID 不匹配，或连接意外关闭），Deno 会立即终止进程，以保障完整性并防止权限提升。

请求和响应消息结构有版本控制，并由 JSON Schema 定义：

- 请求模式：
  [permission-broker-request.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/permission-broker-request.v1.json)
- 响应模式：
  [permission-broker-response.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/permission-broker-response.v1.json)

每个请求包含版本号 (`v`)、Deno 进程 ID (`pid`)、唯一单调请求 ID (`id`)、时间戳 (`datetime`，RFC 3339 格式)、权限名称 (`permission`) 和根据权限类型的可选值 (`value`)。响应必须回显请求 ID 并包含一个 `result`，其值为 `"allow"` 或 `"deny"`。如果拒绝，可包含人类可读的 `reason`。

示例消息流程：

```text
-> req {"v":1,"pid":10234,"id":1,"datetime":"2025-01-01T00:00:00.000Z","permission":"read","value":"./run/permission_broker/scratch.txt"}
<- res {"id":1,"result":"allow"}
-> req {"v":1,"pid":10234,"id":2,"datetime":"2025-01-01T00:00:01.000Z","permission":"read","value":"./run/permission_broker/scratch.txt"}
<- res {"id":2,"result":"allow"}
-> req {"v":1,"pid":10234,"id":3,"datetime":"2025-01-01T00:00:02.000Z","permission":"read","value":"./run/permission_broker/log.txt"}
<- res {"id":3,"result":"allow"}
-> req {"v":1,"pid":10234,"id":4,"datetime":"2025-01-01T00:00:03.000Z","permission":"write","value":"./run/permission_broker/log.txt"}
<- res {"id":4,"result":"allow"}
-> req {"v":1,"pid":10234,"id":5,"datetime":"2025-01-01T00:00:04.000Z","permission":"env","value":null}
<- res {"id":5,"result":"deny","reason":"环境访问被拒绝。"}
```
