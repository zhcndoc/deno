---
title: 环境变量和上下文
description: "Deno Deploy 早期访问版中管理环境变量和上下文的指南，包括变量类型、创建、编辑以及在代码中访问它们的方式。"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。正在寻找 Deploy Classic 的文档？[请点击这里查看](/deploy/)。

:::

Deno Deploy<sup>EA</sup> 中的环境变量允许您使用静态值配置应用程序，例如 API 密钥或数据库连接字符串。

## 环境变量类型

环境变量可以以以下形式存储：

- **纯文本**：在 UI 中可见，适用于非敏感值，如特征标志
- **密钥**：创建后在 UI 中不可见，仅能从应用代码中读取，适用于敏感值，如 API 密钥

变量可以设置在：

- **应用级别**：特定于单个应用
- **组织级别**：应用于组织中的所有应用，但可以被应用级变量覆盖

## 上下文

每个环境变量适用于一个或多个上下文。上下文代表代码运行的逻辑“环境”，每个环境拥有自己的一组变量和密钥。

默认情况下，有两个上下文：

- **生产**：用于生产时间线，服务生产流量
- **开发**：用于开发时间线，服务非生产流量（预览 URL 和分支 URL）

:::info

需要额外的上下文？请联系 [支持](../support)。

:::

此外，还有一个用于构建过程中的 **构建** 上下文。构建上下文中的环境变量仅在构建期间可用，在生产和开发上下文中不可访问（反之亦然）。这种分离使得构建时和运行时可以有不同的配置。

在单个应用或者组织内，同一上下文中不能存在多个同名的环境变量；但可以在不同且不重叠的上下文中存在同名变量。

## 添加、编辑和删除环境变量

您可以从多个位置管理环境变量：

- 在创建应用时的 “新建应用” 页面
- 在应用设置的 “环境变量” 部分
- 在组织设置的 “环境变量” 部分

在每个位置，点击相应的编辑按钮打开环境变量抽屉。更改仅在点击 “保存” 后生效。点击 “取消” 会放弃更改。

添加变量步骤：

1. 点击 “添加环境变量”
2. 输入名称和值
3. 指定是否为密钥
4. 选择适用的上下文

您也可以从 `.env` 文件批量导入变量：

1. 点击 “+ 从 .env 文件添加”
2. 粘贴 `.env` 文件内容
3. 点击 “导入变量”

注意以 `#` 开头的行会被视为注释。

删除变量，点击其旁边的 “删除” 按钮。

编辑变量，点击其旁边的 “编辑” 按钮，可修改名称、值、密钥状态或适用上下文。

## 在代码中使用环境变量

通过 `Deno.env.get` API 访问环境变量：

```ts
const myEnvVar = Deno.env.get("MY_ENV_VAR");
```

<!--
## 以文件形式暴露环境变量

环境变量可以通过切换“以文件形式暴露”选项，而不是作为普通环境变量暴露。

启用该选项后，环境变量的值会存储在应用文件系统的一个临时文件中。环境变量的值则变为该临时文件的路径。

要读取该值，可以结合使用 `Deno.readTextFile` 与 `Deno.env.get` API：

```ts
// 假设 MY_ENV_VAR 已设置为以文件形式暴露
const value = await Deno.readTextFile(Deno.env.get("MY_ENV_VAR"));
```

这对于值过大而不适合放入环境变量，或希望避免在环境变量列表中暴露敏感数据非常有用。

此外，对于预先存在的应用程序，期望某些环境变量指向文件（如 Postgres CA 证书的 `PGSSLROOTCERT`）也很有帮助。
-->

## 限制

环境变量有以下限制：

- 环境变量键最大长度为 128 字节。
- 环境变量键不能以以下前缀开头：
  - `DENO_`，但允许以下除外：`DENO_AUTH_TOKENS`、`DENO_COMPAT`、`DENO_CONDITIONS`、
    `DENO_DEPLOY_ENDPOINT` 或 `DENO_DEPLOY_TOKEN`
  - `LD_`
  - `OTEL_`
- 环境变量值最大长度为 16 KB（16,384 字节）。
- 环境变量键不能为以下任一键。请改用
  [云连接](/deploy/early-access/reference/cloud-connections)
  - `AWS_ROLE_ARN`
  - `AWS_WEB_IDENTITY_TOKEN_FILE`
  - `GCP_WORKLOAD_PROVIDER_ID`
  - `GCP_SERVICE_ACCOUNT_EMAIL`
  - `GCP_PROJECT_ID`
  - `AZURE_CLIENT_ID`
  - `AZURE_TENANT_ID`
  - `AZURE_FEDERATED_TOKEN_FILE`

## 预定义环境变量

Deno Deploy<sup>EA</sup> 在所有上下文中提供以下预定义环境变量：

- `DENO_DEPLOY=1`：表示应用正在 Deno Deploy 环境中运行。

- `DENO_DEPLOYMENT_ID`：表示整个配置集（应用 ID、修订 ID、上下文和环境变量）的唯一标识符。当其中任何组件更改时此值也会变化。

- `DENO_DEPLOY_ORG_ID`：应用所属组织的 ID。

- `DENO_DEPLOY_ORG_SLUG`：应用所属组织的标识符。

- `DENO_DEPLOY_APP_ID`：应用的 ID。

- `DENO_DEPLOY_APP_SLUG`：应用的标识符。

- `DENO_DEPLOY_BUILD_ID`：当前运行的修订版本 ID。

- `DENO_TIMELINE`：应用当前运行的时间线。可能的值包括 `production`、`git-branch/<branch-name>` 和 `preview/<revision-id>`。构建期间不设置此变量，因为构建不针对特定时间线。

构建期间，环境变量中还会额外设置 `CI=1`。