---
title: OIDC
description: Deno Deploy 运行时环境充当 OpenID Connect (OIDC) 提供者，使您能够与支持 OIDC 认证的第三方服务集成。
---

Deno Deploy<sup>EA</sup> 是一个 OIDC 提供者。Deno Deploy<sup>EA</sup> 的每个正在运行的应用程序都可以获得由 Deno Deploy<sup>EA</sup> 签发的短期 JWT 令牌。这些令牌包含有关应用程序的信息，例如组织和应用的 ID 与 slug、应用程序执行的上下文以及正在运行的修订版本 ID。

这些令牌可以用来与支持 OIDC 认证的第三方服务进行身份验证，例如主要的云提供商，也包括 HashiCorp Vault、NPM 等。

:::tip

想要使用 OIDC 令牌进行 AWS 或 Google Cloud 的身份验证？请使用[云连接](./cloud-connections)功能，而不是手动配置 OIDC 认证。云连接会为您处理整个配置流程，包括建立信任关系和权限设置。底层依然使用的是 OIDC。

:::

## 签发令牌

要为当前正在运行的应用程序签发令牌，请使用来自 [`@deno/oidc` 模块（在 JSR 上）](http://jsr.io/@deno/oidc) 的 `getIdToken()` 函数。

首先，将 `@deno/oidc` 作为您的应用依赖安装：

```sh
deno add jsr:@deno/oidc
```

然后，引入 `getIdToken()` 函数，并使用所需的目标受众调用它：

```ts
import { getIdToken } from "jsr:@deno/oidc";

const token = await getIdToken("https://example.com/");
console.log(token);
```

`audience` 参数是一个字符串，用于标识令牌的预期接收方。通常是一个 URL 或表示将消费该令牌的服务或应用的标识符。受众值必须与您希望进行身份验证的第三方服务中配置的值相匹配。该值会放入签发的 JWT 令牌的 `aud` 声明中。

`getIdToken()` 函数返回一个 Promise，解析后为字符串形式的 JWT 令牌。

若要检查当前环境是否支持 OIDC（即您的应用是否运行在 Deno Deploy<sup>EA</sup> 上），可使用 `supportsIssuingIdTokens` 命名空间属性：

```ts
import { supportsIssuingIdTokens } from "jsr:@deno/oidc";

if (supportsIssuingIdTokens) {
  // 支持 OIDC
} else {
  // 不支持 OIDC
}
```

## 令牌结构

发放的令牌是采用 RS256 算法签名的 JWT 令牌。令牌包含以下声明：

| 声明名称       | 示例值                                 | 描述                                                                                                 |
| -------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `iss`          | `https://oidc.deno.com`              | 令牌的签发者，总是 `https://oidc.deno.com`。                                                      |
| `aud`          | `https://example.com/`               | 令牌的受众，即传入 `getIdToken()` 函数的值。                                                      |
| `iat`          | `1757924011`                         | 令牌签发时间，Unix 时间戳，表示令牌签发时刻。                                                    |
| `exp`          | `1757924311`                         | 令牌过期时间，Unix 时间戳，表示令牌失效时刻。                                                    |
| `nbf`          | `1757923951`                         | 令牌生效时间，Unix 时间戳，表示令牌开始有效时刻。                                                |
| `sub`          | `deployment:deno/astro-app/production` | 令牌主题，是字符串拼接的形式：`deployment:<org>/<app>/<context>`                                   |
| `org_id`       | `729adb8f-20d6-4b09-bb14-fac14cb260d1` | 拥有该应用的组织的唯一标识符。                                                                      |
| `org_slug`     | `deno`                              | 拥有该应用的组织的 slug。                                                                          |
| `app_id`       | `16ad21d8-7aeb-4155-8aa3-9f58df87cd3e` | 应用的唯一标识符。                                                                                  |
| `app_slug`     | `astro-app`                         | 应用的 slug。                                                                                      |
| `context_id`   | `1d685676-92d7-418d-b103-75b46f1a58b4` | 应用运行的上下文的唯一标识符。                                                                      |
| `context_name` | `production`                       | 应用运行的上下文。                                                                                  |
| `revision_id`  | `rh2r15rgy802`                     | 当前运行的应用修订版本的唯一标识符。                                                                |
| `deployment_id`| <随机字符串>                       | 包含整个部署元数据（包括应用、修订和上下文 ID）的唯一哈希。                                          |

令牌会在签发后 5 分钟过期。为考虑时钟偏差，令牌中的 `nbf` 声明设置为比 `iat` 提前 1 分钟。

## 验证令牌

要验证由 Deno Deploy<sup>EA</sup> 签发的令牌，您需要从 OIDC 提供者的 JWKS 端点获取公钥。Deno Deploy<sup>EA</sup> 的 JWKS 端点为：

```
https://oidc.deno.com/.well-known/jwks.json
```

使用 JWT 令牌头中的 `kid`（密钥 ID）选择 JWKS 响应中的正确密钥。

Deno Deploy<sup>EA</sup> 还提供了标准的 OIDC 发现文档：

```
https://oidc.deno.com/.well-known/openid-configuration
```

Deno Deploy<sup>EA</sup> 会定期更换其签名密钥，因此应动态从 JWKS 端点获取密钥，而不要将密钥硬编码。

当前，Deno Deploy<sup>EA</sup> 的签名密钥使用 `ES256` 算法。未来可能会根据安全需求、最佳实践及第三方服务支持情况进行更改。

验证令牌时，可以使用支持 OIDC 和 JWKS 的 JWT 库。在 TypeScript 中，您可以使用 [`jose`](https://jsr.io/@panva/jose) 库。