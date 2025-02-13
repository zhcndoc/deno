---
title: "配置 Deno 行为"
---

有几个环境变量可以影响 Deno 的行为：

### DENO_AUTH_TOKENS

一个授权令牌的列表，可以用来允许 Deno 访问远程私有代码。有关更多详细信息，请参阅
[私有模块和仓库](/runtime/reference/private_repositories) 部分。

### DENO_TLS_CA_STORE

一系列在建立 TLS 连接时使用的证书存储。可用的存储有 `mozilla` 和 `system`。您可以指定一个、两个或都不指定。证书链的解析尝试按照您指定的顺序进行。默认值为 `mozilla`。`mozilla` 存储将使用由 [`webpki-roots`](https://crates.io/crates/webpki-roots) 提供的捆绑 Mozilla 证书。`system` 存储将使用您平台的
[本机证书存储](https://crates.io/crates/rustls-native-certs)。确切的 Mozilla 证书集将依赖于您使用的 Deno 版本。如果您不指定证书存储，则不会对任何 TLS 连接给予信任，除非同时指定 `DENO_CERT` 或 `--cert`，或者为每个 TLS 连接指定特定证书。

### DENO_CERT

从 PEM 编码文件加载证书颁发机构。这“覆盖”了 `--cert` 选项。有关更多信息，请参阅 [代理](#proxies) 部分。

### DENO_DIR

设置缓存 CLI 信息的目录。这包括诸如缓存的远程模块、缓存的转译模块、语言服务器缓存信息和来自本地存储的持久数据等项目。默认值为操作系统的默认缓存位置，然后在 `deno` 路径下。

### DENO_INSTALL_ROOT

当使用 `deno install` 时，已安装的脚本存储的位置。默认值为 `$HOME/.deno/bin`。

### DENO_NO_PACKAGE_JSON

设置以禁用 package.json 文件的自动解析。

### DENO_NO_PROMPT

设置以禁用访问时的权限提示（替代在调用中传递 `--no-prompt`）。

### DENO_NO_UPDATE_CHECK

设置以禁用检查是否有更新的 Deno 版本可用。

### DENO_WEBGPU_TRACE

用于 WebGPU 跟踪的目录。

### HTTP_PROXY

用于 HTTP 请求的代理地址。有关更多信息，请参阅 [代理](#proxies) 部分。

### HTTPS_PROXY

用于 HTTPS 请求的代理地址。有关更多信息，请参阅 [代理](#proxies) 部分。

### NO_COLOR

如果设置，此选项将阻止 Deno CLI 在写入 stdout 和 stderr 时发送 ANSI 颜色代码。有关此 _事实_ 标准的更多信息，请参见网站 [https://no-color.org](https://no-color.org/)。此标志的值可以在运行时访问，而无需读取环境变量的权限，方法是检查 `Deno.noColor` 的值。

### NO_PROXY

指示应绕过在其他环境变量中设置的代理的主机。有关更多信息，请参阅 [代理](#proxies) 部分。

### NPM_CONFIG_REGISTRY

在通过
[npm 说明符](/runtime/fundamentals/node/#using-npm-packages) 加载模块时使用的 npm 注册表。

## 代理

Deno 能够通过代理服务器处理网络请求，这在安全性、缓存或访问防火墙后面的资源等各种原因中非常有用。运行时支持模块下载和 Web 标准 `fetch` API 的代理。

Deno 从环境变量中读取代理配置：`HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY`。

在 Windows 上，如果找不到环境变量，Deno 将回退到从注册表中读取代理设置。