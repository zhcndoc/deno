---
last_modified: 2026-06-12
title: "私有仓库"
description: "使用 DENO_AUTH_TOKENS 从私有仓库加载远程模块：bearer 令牌、基本身份验证以及 GitHub 操作指南。"
oldUrl:
  - /runtime/manual/advanced/private_repositories/
  - /runtime/reference/private_repositories/
---

:::note

如果你在寻找私有 npm 仓库和 `.npmrc` 支持，请访问
[npm 支持](/runtime/fundamentals/node/#private-registries) 页面。

:::

在某些情况下，你可能希望加载位于 _私有_ 仓库中的远程模块，例如 GitHub 上的私有仓库。

Deno 支持在请求远程模块时发送 bearer 令牌。Bearer 令牌是 OAuth 2.0 中使用的主要访问令牌类型，并且被各类托管服务广泛支持（例如 GitHub、GitLab、Bitbucket、Cloudsmith 等）。

## DENO_AUTH_TOKENS

Deno CLI 会查找名为 `DENO_AUTH_TOKENS` 的环境变量，以确定在请求远程模块时应考虑使用哪些身份验证令牌。该环境变量的值格式为以分号（`;`）分隔的 _n_ 个令牌，其中每个令牌要么是：

- 格式为 `{token}@{hostname[:port]}` 的 bearer 令牌，或者
- 格式为 `{username}:{password}@{hostname[:port]}` 的基本身份验证数据

例如，针对 `deno.land` 的单个令牌看起来大致如下：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land
```

或者：

```sh
DENO_AUTH_TOKENS=username:password@deno.land
```

多个令牌则会像这样：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land;f1e2d3c4b5a6@example.com:8080;username:password@deno.land
```

当 Deno 去获取远程模块时，如果主机名与远程模块的主机名匹配，Deno 会将请求的 `Authorization` 标头设置为 `Bearer {token}` 或 `Basic {base64EncodedData}`。这使远程服务器能够识别该请求是与某个已认证用户相关联的授权请求，并为该服务器上的相应资源和模块提供访问权限。

## GitHub

要访问 GitHub 上的私有仓库，你需要为自己生成一个 _个人访问令牌_。你可以通过登录 GitHub，然后进入
_设置 -> 开发者设置 -> 个人访问令牌_ 来完成：

![GitHub 上的个人访问令牌设置](./images/private-pat.png)

然后你需要选择 _生成新令牌_，并为你的令牌添加描述以及对 `repo` 范围的适当访问权限。`repo` 范围将启用读取文件内容（关于 [GitHub 文档中的作用域](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes) 的更多信息）：

![在 GitHub 上创建新的个人访问令牌](./images/private-github-new-token.png)

创建完成后，GitHub 会仅显示一次新令牌，你需要将该值用于环境变量中：

![GitHub 上新创建令牌的显示](./images/private-github-token-display.png)

为了访问位于 GitHub 私有仓库中的模块，你应当在 `DENO_AUTH_TOKENS` 环境变量中使用生成的令牌，并将其作用域限定到 `raw.githubusercontent.com` 主机名。例如：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@raw.githubusercontent.com
```

这应该能让 Deno 访问该令牌所对应用户有权访问的任何模块。

当令牌不正确，或者用户无权访问该模块时，GitHub 会返回 `404 Not Found` 状态，而不是未授权状态。因此，如果你在命令行中访问模块时遇到“未找到”的错误，请检查环境变量设置和个人访问令牌设置。

此外，`deno run -L debug` 应该会打印一条调试信息，说明从环境变量中解析出了多少个令牌。如果它认为某些令牌格式不正确，则会打印错误信息。出于安全考虑，它不会打印任何有关这些令牌的详细信息。
