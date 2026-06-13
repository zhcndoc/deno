---
title: "使用私有 npm 注册表"
description: "配置 Deno 以从私有注册表安装 npm 包：.npmrc 的作用域注册表和认证令牌、NPM_CONFIG_REGISTRY 覆盖、DENO_AUTH_TOKENS，以及 Azure Artifacts 和 JFrog Artifactory 的实战配置。"
url: /examples/private_registries_tutorial/
---

Deno 会读取与 npm 相同的 `.npmrc` 文件，因此托管在私有
npm 注册表中的包可以像公共包一样通过 `deno install` 和 `deno add` 安装。
本教程先配置一个带认证令牌的作用域注册表，然后介绍
全局注册表覆盖以及两个常见的托管注册表。

## 将作用域指向你的注册表

创建一个 `.npmrc` 文件，将你组织的作用域映射到注册表 URL，
并为该主机附加一个认证令牌：

```ini title=".npmrc"
@mycompany:registry=https://registry.mycompany.com/
//registry.mycompany.com/:_auth=secretToken
```

Deno 会先在项目根目录中查找 `.npmrc`，然后再查找你 `$HOME`
目录中的文件。配置完成后，就可以像往常一样依赖该包：

```json title="deno.json"
{
  "imports": {
    "@mycompany/package": "npm:@mycompany/package@1.0.0"
  }
}
```

现在，每个 `npm:@mycompany/...` 标识符都会通过你的注册表解析；
其他内容仍然来自默认的 npm 注册表。

## 为所有包覆盖注册表

如果要将 _所有_ npm 请求发送到同一个注册表，请设置
`NPM_CONFIG_REGISTRY` 环境变量：

```sh
NPM_CONFIG_REGISTRY=https://registry.mycompany.com/ deno install
```

它会覆盖 `.npmrc` 中配置的注册表，行为与 npm 自身的优先级一致，
因此非常适合在 CI 中使用：你可以在不修改已提交的 `.npmrc` 的情况下
重定向安装来源。

## 认证私有 HTTPS 和 JSR 导入

`.npmrc` 只覆盖 `npm:` 包。对于从私有 HTTPS 主机导入的模块
（例如私有 GitHub 仓库），请使用 `DENO_AUTH_TOKENS`
环境变量。每一项要么是 bearer token（`{token}@{hostname}`），
要么是 basic auth（`{username}:{password}@{hostname}`），多项之间
用分号分隔：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land;username:password@example.com:8080
```

Deno 在从这些主机获取模块时，会发送匹配的 `Authorization`
请求头。

## GitHub Packages

GitHub npm 注册表使用个人访问令牌进行认证（在 Actions 中也可以使用
`GITHUB_TOKEN`），并通过 `_authToken` 字段配置：

```ini title=".npmrc"
@mycompany:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=ghp_yourTokenHere
```

Deno 会像 npm 一样将其作为 bearer token 发送。

## Verdaccio

对于自托管的 [Verdaccio](https://verdaccio.org/) 实例，配置方式
完全相同：将作用域（或对所有包使用 `NPM_CONFIG_REGISTRY`）指向你的
实例，并提供其令牌：

```ini title=".npmrc"
@mycompany:registry=https://verdaccio.mycompany.com/
//verdaccio.mycompany.com/:_authToken=secretToken
```

## Azure Artifacts

Azure Artifacts feed 使用这种注册表 URL 形式（这是一个典型的 Azure feed URL；
请替换为你自己的组织和 feed 名称）：

```ini title=".npmrc"
@mycompany:registry=https://pkgs.dev.azure.com/{org}/_packaging/{feed}/npm/registry/
//pkgs.dev.azure.com/{org}/_packaging/{feed}/npm/registry/:_auth=base64EncodedToken
```

## JFrog Artifactory

Artifactory npm 仓库遵循以下 URL 约定：

```ini title=".npmrc"
@mycompany:registry=https://{host}/artifactory/api/npm/{repo}/
//{host}/artifactory/api/npm/{repo}/:_auth=secretToken
```

:::caution

将包含令牌的 `.npmrc` 文件视为机密。优先通过 CI 提供商的密钥存储
注入令牌，而不是将其提交到仓库中。

:::

## 双向 TLS

如果注册表需要客户端证书（mTLS），请使用 `certfile` 和 `keyfile`
字段将 Deno 指向 PEM 文件（Deno 2.8+）：

```ini title=".npmrc"
//registry.mycompany.com/:certfile=/etc/deno/client.crt
//registry.mycompany.com/:keyfile=/etc/deno/client.key
```

Deno 也会为需要它的旧版注册表读取 `email` 字段，以及读取
`min-release-age` 作为供应链防护；有关所有受支持字段，请参阅
[`.npmrc` 配置参考](/runtime/fundamentals/node/#private-registries)。
