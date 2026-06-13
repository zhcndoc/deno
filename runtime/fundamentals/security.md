---
last_modified: 2026-05-21
title: "安全与权限"
description: "Deno 安全模型指南：默认安全执行、权限沙箱、评估并执行不受信任的代码，以及权限代理。有关标志，请参阅 Permissions 参考。"
---

Deno 默认是安全的。除非你特意启用，否则在 Deno 中运行的程序没有访问敏感 API 的权限，例如文件系统访问、网络连接或环境访问。你必须通过命令行标志或运行时权限提示明确授予对这些资源的访问。这与 Node 的一个主要区别是，Node 中的依赖项会自动获得对所有系统 I/O 的完全访问权限，这可能会将隐藏的漏洞引入你的项目。

在使用 Deno 运行完全不受信任的代码之前，请阅读下面的
[执行不受信任的代码](#executing-untrusted-code) 部分。

## 关键原则

在深入了解权限的具体细节之前，了解 Deno 安全模型的关键原则是很重要的：

- **默认没有 I/O 访问权限**：在 Deno 运行时中执行的代码默认不能读取或写入文件系统上的任意文件，也不能发起网络请求、打开网络监听器、访问环境变量或生成子进程。
- **相同权限级别的代码执行不受限制**：Deno 允许通过多种方式执行任何代码（JS/TS/Wasm），包括 `eval`、`new Function`、动态导入以及 Web Worker，并且对代码来源（网络、npm、JSR 等）几乎不加限制，只要它们处于相同的权限级别。
- **同一应用的多次调用可以共享数据**：Deno 通过内置缓存和 KV 存储 API，提供同一应用多次调用共享数据的机制。不同应用无法看到彼此的数据。
- **在同一线程上执行的所有代码共享相同的权限级别**：在同一线程上执行的所有代码共享相同的权限级别。不同模块不可能在同一线程内拥有不同的权限级别。
- **代码不能在未经用户同意的情况下提升其权限**：在 Deno 运行时中执行的代码不能在未得到用户通过交互式提示或运行时标志明确同意提升权限的情况下提升其权限。
- **初始静态模块图可以不受限制地导入模块**：在初始静态模块图中导入的所有模块（本地文件、npm 包、jsr 包以及远程 URL）都会由运行时加载，而无需查询权限系统。加载本地文件不需要 `--allow-read`，获取远程模块也不需要 `--allow-net`。静态图包括静态 `import` 语句，以及其说明符是字符串字面量的 `import()` 调用——任何无需运行代码即可解析的内容。此豁免仅适用于加载。代码一旦运行，它所做的任何事情仍然要经过权限系统，而带有非常量说明符的 `import()` 调用（例如 `import(someVariable)`）会在运行时根据 `--allow-read` / `--allow-import` 进行检查。

这些关键原则旨在提供一个用户可以以最低风险执行代码的环境，以免对主机计算机或网络造成伤害。安全模型旨在易于理解，并在运行时与执行其中的代码之间提供清晰的关注点分离。安全模型由 Deno 运行时强制执行，并不依赖于底层操作系统。

## 权限

Deno 默认处于沙箱环境中：除非你允许，否则代码无法访问文件系统、网络、环境，也无法运行子进程。你可以使用 `--allow-*` / `--deny-*` 标志授予或拒绝访问权限（或者在运行时通过提示进行控制），并且可以将权限存储在 `deno.json` 中。

有关每种权限及其标志，请参阅 [Permissions 参考](/runtime/reference/permissions/)，以及在配置文件中声明它们的 [deno.json 中的 `permissions`](/runtime/reference/deno_json/#permissions)。

## 代码评估

Deno 对同一特权级别下的代码执行没有限制。这意味着在 Deno 运行时中执行的代码可以使用 `eval`、`new Function`，甚至动态导入或 web 工作者，以相同的特权级别执行**任意**代码，与调用 `eval`、`new Function` 或动态导入或 web 工作者的代码相同。

这些代码可以托管在网络上，可以是本地文件（如果已授予读取权限），或以字符串形式在调用 `eval`、`new Function` 或动态导入或 web 工作者的代码中存储的纯文本。

## 执行不可信代码

虽然 Deno 提供了一些旨在保护主机计算机和网络免受伤害的安全功能，但不可信代码仍然令人害怕。在执行不可信代码时，确保拥有多层防御是很重要的。以下是一些执行不可信代码的建议，我们建议在执行任意不可信代码时使用以下所有建议：

- 限制权限运行 `deno`，并预先确定实际需要运行的代码（并通过使用 `--frozen` 锁定文件和 `--cached-only` 防止更多代码被加载）。
- 使用操作系统提供的沙箱机制，如 `chroot`、`cgroups`、`seccomp` 等。
- 使用虚拟机或 MicroVM（gVisor、Firecracker 等）等沙箱环境。

## 审计依赖项

权限沙箱控制代码在运行时可以做什么，但不会告诉你依赖项中是否包含已知漏洞。Deno 提供 [`deno audit`](/runtime/reference/cli/audit/) 用于扫描你的依赖项并与漏洞数据库进行比对，这对于作为 CI 门禁很有用。有关随着时间推移保持依赖项安全的方法，请参阅 [供应链管理](/runtime/packages/supply_chain/)。

## 权限代理

:::caution 仅限高级用法

使用权限代理会改变 Deno 的决策权限：CLI 标志和提示将不再适用。启用 `DENO_PERMISSION_BROKER_PATH` 之前，请确保你的代理进程具有弹性、经过审计并且可用。

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
