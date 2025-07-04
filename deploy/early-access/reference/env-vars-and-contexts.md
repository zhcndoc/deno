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

## 预定义环境变量

Deno Deploy<sup>EA</sup> 在所有上下文中提供以下预定义环境变量：

- `DENO_DEPLOYMENT_ID`：表示整个配置集（应用 ID、修订 ID、上下文及环境变量）的唯一标识符。任一组件改变时该值都会改变。

- `DENO_REVISION_ID`：当前正在运行的修订 ID。

未来还会添加更多预定义变量。

注意，您不能手动设置任何以 `DENO_*` 开头的环境变量，这些是保留的系统变量。

```ts
const myEnvVar = Deno.env.get("MY_ENV_VAR");
```

## 预定义环境变量

Deno Deploy<sup>EA</sup> 提供了一组自动为每个应用设置的预定义环境变量。这些环境变量在所有上下文中均可用，可用于访问有关应用及其运行环境的信息。

- `DENO_DEPLOYMENT_ID` - 表示应用运行的完整配置集的唯一标识符。该配置包含应用 ID、修订 ID、上下文以及任何适用的环境变量。上述任何一项改变时，此值也会更改。

- `DENO_REVISION_ID` - 当前正在运行的修订 ID。

未来还会添加更多预定义环境变量。

无法手动设置任何以 `DENO_*` 开头的环境变量。这些环境变量由 Deno Deploy<sup>EA</sup> 设置，且只读。