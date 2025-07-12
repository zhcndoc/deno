---
title: 云连接
description: 了解如何将 Deno Deploy 早期访问版连接到 AWS 和 Google Cloud Platform 等云提供商，而无需管理凭据。
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。寻找
部署经典版文档？[点此查看](/deploy/)。

:::

Deno Deploy<sup>EA</sup> 允许您连接到诸如 AWS 和 Google Cloud Platform（GCP）之类的云提供商，而无需手动管理静态凭据。这是通过使用 OpenID Connect (OIDC) 和身份联合来实现的。

## 工作原理

Deno Deploy<sup>EA</sup> 是一个 OIDC 提供者。Deno Deploy<sup>EA</sup> 的每个正在运行的应用都可以颁发由 Deno Deploy<sup>EA</sup> 签名的短期 JWT 令牌。这些令牌包含有关应用程序的信息，例如组织和应用的 ID 及别名、应用程序执行的上下文以及正在运行的修订 ID。

通过将这些令牌发送到 AWS 或 GCP，可以将它们交换为可用于访问云资源（如 AWS S3 存储桶或 Google Cloud Spanner 实例）的短期 AWS 或 GCP 凭据。将令牌发送到 AWS 或 GCP 时，云提供商会验证该令牌，检查其是否由 Deno Deploy<sup>EA</sup> 颁发，并且其对应该被允许访问云资源的应用和上下文有效。

为了使 AWS 或 GCP 能够用 OIDC 令牌交换凭据，需要将云提供商配置为信任 Deno Deploy<sup>EA</sup> 作为 OIDC 身份提供者，并且需要为特定的 Deno Deploy<sup>EA</sup> 应用创建一个允许使用令牌交换凭据的 AWS IAM 角色或 GCP 服务账号。

## 设置 AWS

本指南包含三种设置 AWS 资源的指导。您可以使用任意一种方式完成 AWS 资源的设置。

- [在本地使用 `deno deploy setup-aws` 命令](#aws%3A-easy-setup-with-deno-deploy-setup-aws)
  （推荐）
- [使用 `aws` CLI](#setup-aws-cli)
- [使用 AWS 控制台](#setup-aws-console)
- [使用 Terraform](#setup-aws-terraform)

要在您的 AWS 账户中设置与 Deno Deploy<sup>EA</sup> 的 AWS 集成，需要创建以下资源：

- 一个
  [AWS IAM OIDC 身份提供者](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
  来信任 Deno Deploy<sup>EA</sup> 作为 OIDC 提供者。
  - OIDC 提供者 URL 为 `https://oidc.deno.com`。
  - 受众（客户端 ID）为 `sts.amazonaws.com`。
- 一个
  [AWS IAM 角色](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html)
  ，可使用 Deno Deploy<sup>EA</sup> 的 OIDC 令牌进行“切换”（登录）。
  - 角色的信任策略应允许 OIDC 提供者切换角色，例如：
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Federated": "arn:aws:iam::<account-id>:oidc-provider/oidc.deno.com"
          },
          "Action": "sts:AssumeRoleWithWebIdentity",
          "Condition": {
            "StringEquals": {
              "oidc.deno.com:aud": "sts.amazonaws.com",
              "oidc.deno.com:sub": "deployment:<organization-slug>/<application-slug>/<context-name>"
            }
          }
        }
      ]
    }
    ```
  - 角色应拥有访问您想使用的 AWS 资源（如 S3 存储桶或 DynamoDB 表）的权限。

设置完 AWS 资源后，从应用设置中前往 AWS 云集成设置页面。在那里，您必须选择应可用云连接的上下文。

然后必须输入之前创建的 AWS IAM 角色的 ARN（亚马逊资源名称）。输入 ARN 后，可以点击“测试连接”按钮开始连接测试。连接测试会检查 AWS IAM 角色和 OIDC 提供者是否已正确配置，并且不会允许未授权的应用、组织或上下文访问。

测试连接成功后，即可保存云连接。

### 使用方法

在建立 AWS 与 Deno Deploy<sup>EA</sup> 之间的云连接后，您可以直接从应用代码访问 AWS 资源（如 S3），无需配置任何凭据。

AWS SDK v3 会自动按云连接配置使用凭据。以下是一个示例，展示如何从配置了 AWS 账户的 Deno Deploy<sup>EA</sup> 应用访问 S3 存储桶。

```ts
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-west-2" });

Deno.serve(() => {
  const { Buckets } = await s3.send(new ListBucketsCommand({}));
  return Response.json(Buckets);
});
```

## 设置 GCP

要在您的 GCP 账户中设置与 Deno Deploy<sup>EA</sup> 的集成，需要创建以下资源：

- 一个
  [工作负载身份池和工作负载身份提供者](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers)
  ，信任 Deno Deploy<sup>EA</sup> 作为 OIDC 提供者。
  - OIDC 提供者 URL 为 `https://oidc.deno.com`。
  - 受众应为默认值（以 `https://iam.googleapis.com` 开头）。
  - 至少需设置以下属性映射：
    - `google.subject = assertion.sub`
    - `attribute.full_slug = assertion.org_slug + "/" + assertion.app_slug`
- 一个
  [服务账号](https://cloud.google.com/iam/docs/service-accounts-create)
  ，可用 OIDC 令牌“模拟”（登录）。
  - 来自工作负载身份池的主体或主体集合应拥有使用工作负载身份用户角色 (`roles/iam.workloadIdentityUser`) 访问该服务账号的权限。示例：
    - 应用中的特定上下文：
      `principal://iam.googleapis.com/projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:<ORG_SLUG>/<APP_SLUG>/<CONTEXT_NAME>`
    - 应用中的所有上下文：
      `principalSet://iam.googleapis.com/projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/oidc-deno-com/attribute.full_slug/<ORG_SLUG>/<APP_SLUG>`
  - 服务账号应拥有访问您想使用的 GCP 资源的权限，例如 Google Cloud Storage 存储桶。

本指南包含三种设置 GCP 资源的指导。您可以使用任意一种方式完成 GCP 资源的设置。

- [在本地使用 `deno deploy setup-gcp` 命令](#setup-gcp-easy)
  （推荐）
- [使用 `gcloud` CLI](#setup-gcp-cli)
- [使用 GCP 控制台](#setup-gcp-console)
- [使用 Terraform](#setup-gcp-terraform)

设置完 GCP 资源后，前往应用设置中的 GCP 云集成设置页面。在那里，您必须选择应可用云连接的上下文。

然后您必须输入工作负载身份提供者 ID，格式为
`projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/oidc-deno-com/providers/oidc-deno-com`，
以及之前创建的 GCP 服务账号邮箱。输入邮箱后，点击“测试连接”按钮开始连接测试。连接测试会检查 GCP 服务账号和 OIDC 提供者是否已正确配置，并且不会允许未授权的应用、组织或上下文访问。

测试成功后，即可保存云连接。

### 使用方法

在建立 GCP 与 Deno Deploy<sup>EA</sup> 之间的云连接后，您可以直接从应用代码访问 GCP 资源（如 Cloud Storage），无需配置任何凭据。

Google Cloud SDK 会自动按云连接配置使用凭据。以下是一个示例，展示如何从配置了 GCP 账户的 Deno Deploy<sup>EA</sup> 应用访问 Cloud Storage 存储桶。

```ts
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

Deno.serve(() => {
  const [buckets] = await storage.getBuckets();
  return Response.json(buckets);
});
```

## 删除云集成

您可以在云集成部分，点击特定云连接旁边的“删除”按钮来删除该云连接。

## 设置指南

### AWS：使用 `deno deploy setup-aws` 简单设置

有关如何使用 `deno deploy setup-aws` 命令设置 AWS 与 Deno Deploy<sup>EA</sup> 集成的说明，请参阅应用设置中的 AWS 云集成设置页面的说明。

### AWS：使用 `aws` CLI

您可以使用 AWS CLI 手动设置 AWS 资源。此方法要求已安装并配置 AWS CLI，且拥有创建 IAM 角色、OIDC 提供者和附加策略的权限。

#### 前提条件

- 已安装并配置 AWS CLI
- 拥有创建 IAM 角色、OIDC 提供者和附加策略的权限

#### 第 1 步：创建 OIDC 提供者

如果还未创建 OIDC 提供者，请运行：

```bash
aws iam create-open-id-connect-provider \
  --url https://oidc.deno.com \
  --client-id-list sts.amazonaws.com
```

#### 第 2 步：创建带信任策略的 IAM 角色

创建一个信任策略文件，允许您的 Deno Deploy<sup>EA</sup> 应用切换角色。您可以选择允许所有上下文访问，或者只允许特定上下文。

**针对应用中所有上下文：**

```bash
# 为整个应用创建信任策略文件
cat > trust-policy-all-contexts.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/oidc.deno.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "oidc.deno.com:sub": "deployment:YOUR_ORG/YOUR_APP/*"
        }
      }
    }
  ]
}
EOF
```

**针对特定上下文：**

```bash
# 为特定上下文创建信任策略文件
cat > trust-policy-specific-contexts.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/oidc.deno.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.deno.com:sub": [
            "deployment:YOUR_ORG/YOUR_APP/production",
            "deployment:YOUR_ORG/YOUR_APP/staging"
          ]
        }
      }
    }
  ]
}
EOF
```

#### 第 3 步：创建 IAM 角色

使用相应的信任策略创建角色：

```bash
# 针对整个应用
aws iam create-role \
  --role-name DenoDeploy-YourOrg-YourApp \
  --assume-role-policy-document file://trust-policy-all-contexts.json

# 或针对特定上下文
aws iam create-role \
  --role-name DenoDeploy-YourOrg-YourApp \
  --assume-role-policy-document file://trust-policy-specific-contexts.json
```

#### 第 4 步：附加策略

附加所需策略，以授予应用访问 AWS 资源的权限：

```bash
aws iam attach-role-policy \
  --role-name DenoDeploy-YourOrg-YourApp \
  --policy-arn arn:aws:iam::aws:policy/POLICY_NAME
```

将 `POLICY_NAME` 替换为合适的 AWS 策略（例如 `AmazonS3ReadOnlyAccess`、`AmazonDynamoDBReadOnlyAccess` 等），根据您的需求选择。

完成上述步骤后，在 Deno Deploy<sup>EA</sup> 云连接配置中使用角色 ARN。

### AWS：使用 AWS 控制台

您也可以通过 AWS 管理控制台网页界面设置 AWS 资源，此方式提供了一个直观的配置方法。

#### 第 1 步：创建 OIDC 身份提供者

1. 进入 IAM 控制台 → 身份提供者
2. 点击“添加提供者”
3. 选择“OpenID Connect”
4. 填写提供者 URL：`https://oidc.deno.com`
5. 受众：`sts.amazonaws.com`
6. 点击“添加提供者”

#### 第 2 步：创建 IAM 角色

1. 进入 IAM 控制台 → 角色
2. 点击“创建角色”
3. 选择受信实体类型为 **Web 身份**
4. 选择刚才创建的 OIDC 提供者（`oidc.deno.com`）
5. 受众填写 `sts.amazonaws.com`

#### 第 3 步：配置信任策略条件

添加条件限制哪些 Deno Deploy<sup>EA</sup> 应用可切换此角色。选择一种方式：

**应用中所有上下文：**

- 条件键：`oidc.deno.com:sub`
- 操作符：`StringLike`
- 值：`deployment:YOUR_ORG/YOUR_APP/*`

**特定上下文：**

- 条件键：`oidc.deno.com:sub`
- 操作符：`StringEquals`
- 值：`deployment:YOUR_ORG/YOUR_APP/production`
- 对每个上下文（如 staging、development）添加额外条件

点击“下一步”继续。

#### 第 4 步：附加权限策略

1. 根据需求搜索并选择合适的策略：
   - S3 访问：`AmazonS3ReadOnlyAccess` 或 `AmazonS3FullAccess`
   - DynamoDB 访问：`AmazonDynamoDBReadOnlyAccess` 或 `AmazonDynamoDBFullAccess`
   - 其他服务：选择相应策略
2. 点击“下一步”

#### 第 5 步：命名并创建角色

1. 角色名：`DenoDeploy-YourOrg-YourApp`（替换为您的组织及应用名）
2. 说明：可选填写角色用途描述
3. 审核信任策略和权限
4. 点击“创建角色”

#### 第 6 步：复制角色 ARN

创建完成后：

1. 进入角色详情页
2. 复制角色 ARN（格式为 `arn:aws:iam::123456789012:role/DenoDeploy-YourOrg-YourApp`）
3. 在 Deno Deploy<sup>EA</sup> 云连接配置中使用该 ARN

### AWS：使用 Terraform

您可以使用 Terraform 编程方式创建所需的 AWS 资源。此方案适合基础设施即代码的工作流程。

#### Terraform 配置示例

创建一个 Terraform 配置文件，内容如下：

```hcl
# 变量定义
variable "org" {
  description = "Deno Deploy 组织名称"
  type        = string
}

variable "app" {
  description = "Deno Deploy 应用名称"
  type        = string
}

variable "contexts" {
  description = "允许的特定上下文列表（留空表示允许所有上下文）"
  type        = list(string)
  default     = []
}

# OIDC 提供者资源
resource "aws_iam_openid_connect_provider" "deno_deploy" {
  url = "https://oidc.deno.com"
  client_id_list = ["sts.amazonaws.com"]
}

# 根据上下文动态生成的 IAM 角色
resource "aws_iam_role" "deno_deploy_role" {
  name = "DenoDeploy-${var.org}-${var.app}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.deno_deploy.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = length(var.contexts) > 0 ? {
          # 只允许特定上下文
          StringEquals = {
            "oidc.deno.com:sub" = [
              for context in var.contexts : "deployment:${var.org}/${var.app}/${context}"
            ]
          }
        } : {
          # 允许所有上下文（通配符）
          StringLike = {
            "oidc.deno.com:sub" = "deployment:${var.org}/${var.app}/*"
          }
        }
      }
    ]
  })
}

# 附加策略
resource "aws_iam_role_policy_attachment" "example" {
  role       = aws_iam_role.deno_deploy_role.name
  policy_arn = "arn:aws:iam::aws:policy/POLICY_NAME"
}

# 输出角色 ARN
output "role_arn" {
  value = aws_iam_role.deno_deploy_role.arn
}
```

#### 使用示例

**针对整个应用（所有上下文）访问：**

```hcl
module "deno_deploy_aws" {
  source = "./path-to-terraform-module"

  org      = "your-org"
  app      = "your-app"
  contexts = []  # 空表示所有上下文
}
```

**仅针对特定上下文：**

```hcl
module "deno_deploy_aws" {
  source = "./path-to-terraform-module"

  org      = "your-org"
  app      = "your-app"
  contexts = ["production", "staging"]
}
```

#### 应用配置

1. 初始化 Terraform：
   ```bash
   terraform init
   ```

2. 计划部署：
   ```bash
   terraform plan
   ```

3. 应用配置：
   ```bash
   terraform apply
   ```

应用完成后，Terraform 会输出角色 ARN，供您在 Deno Deploy<sup>EA</sup> 云连接配置中使用。

#### 自定义策略

将 `aws_iam_role_policy_attachment` 资源中的 `POLICY_NAME` 替换为适合您的 AWS 托管策略，或根据需求创建自定义策略。您可以通过创建多个策略附件资源添加多个策略。

### GCP：使用 `deno deploy setup-gcp` 简单设置

有关如何使用 `deno deploy setup-gcp` 命令设置 GCP 与 Deno Deploy<sup>EA</sup> 集成的说明，请参阅应用设置中的 Google 云集成设置页面的说明。

### GCP：使用 `gcloud` CLI

您可以使用 gcloud CLI 手动设置 GCP 资源。此方法需要安装并认证 gcloud CLI，且拥有创建工作负载身份池、服务账号和授予 IAM 角色的权限。

#### 前提条件

- 安装并认证 gcloud CLI
- 拥有创建工作负载身份池、服务账号和授予 IAM 角色权限
- 启用以下必需 API：
  - `iam.googleapis.com`
  - `iamcredentials.googleapis.com`
  - `sts.googleapis.com`

#### 第 1 步：启用必需 API

先为项目启用必需的 API：

```bash
gcloud services enable iam.googleapis.com
gcloud services enable iamcredentials.googleapis.com
gcloud services enable sts.googleapis.com
```

#### 第 2 步：创建工作负载身份池

创建工作负载身份池以管理外部身份：

```bash
gcloud iam workload-identity-pools create oidc-deno-com \
  --location=global \
  --display-name="Deno Deploy Workload Identity Pool"
```

#### 第 3 步：创建工作负载身份提供者

在工作负载身份池中配置 OIDC 提供者：

```bash
gcloud iam workload-identity-pools providers create-oidc oidc-deno-com \
  --workload-identity-pool=oidc-deno-com \
  --location=global \
  --issuer-uri=https://oidc.deno.com \
  --attribute-mapping="google.subject=assertion.sub,attribute.org_slug=assertion.org_slug,attribute.app_slug=assertion.app_slug,attribute.full_slug=assertion.org_slug+\"/\"+assertion.app_slug"
```

#### 第 4 步：创建服务账号

创建供您的 Deno Deploy<sup>EA</sup> 应用使用的服务账号：

```bash
gcloud iam service-accounts create deno-your-org-your-app \
  --display-name="Deno Deploy YourOrg/YourApp"
```

#### 第 5 步：配置工作负载身份绑定

获取项目编号，并配置工作负载身份绑定。可选择允许所有上下文访问或仅特定上下文访问。

```bash
# 获取项目编号
PROJECT_NUMBER=$(gcloud projects describe PROJECT_ID --format="value(projectNumber)")
```

**应用中所有上下文：**

```bash
gcloud iam service-accounts add-iam-policy-binding \
  deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/attribute.full_slug/YOUR_ORG/YOUR_APP"
```

**仅特定上下文：**

```bash
# 绑定到生产上下文
gcloud iam service-accounts add-iam-policy-binding \
  deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principal://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:YOUR_ORG/YOUR_APP/production"

# 绑定到预发布上下文
gcloud iam service-accounts add-iam-policy-binding \
  deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principal://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:YOUR_ORG/YOUR_APP/staging"

# 根据需要为每个特定上下文添加更多绑定
```

#### 第 6 步：授予服务账号角色

授予服务账号访问 GCP 资源所需的角色：

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/ROLE_NAME"
```

将 `ROLE_NAME` 替换为适当的角色，例如：

- `roles/storage.objectViewer`（Cloud Storage 读取访问）
- `roles/storage.objectAdmin`（Cloud Storage 完全访问）
- `roles/cloudsql.client`（Cloud SQL 访问）
- 根据需求选择其他角色

#### 第 7 步：获取必要的值

设置完成后，您需获取两个值用于 Deno Deploy<sup>EA</sup> 配置：

1. **工作负载提供者 ID**：
   `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/providers/oidc-deno-com`
2. **服务账号邮箱地址**：
   `deno-your-org-your-app@PROJECT_ID.iam.gserviceaccount.com`

将这些值用于 Deno Deploy<sup>EA</sup> 云连接配置。

### GCP：使用 GCP 控制台

您也可以通过 Google Cloud 控制台网页界面设置 GCP 资源，此方式提供工作负载身份联合和服务账号的可视化配置。

#### 第 1 步：启用必需 API

1. 进入 API 与服务 → 库
2. 搜索并启用以下 API：
   - “身份和访问管理 (IAM) API”
   - “IAM 服务账号凭证 API”
   - “安全令牌服务 API”

#### 第 2 步：创建工作负载身份池

1. 进入 IAM 与管理员 → 工作负载身份联合
2. 点击“创建池”
3. 填写：
   - 池名称：`Deno Deploy Workload Id Pool`
   - 池 ID：`oidc-deno-com`
4. 点击“继续”

#### 第 3 步：添加提供者到池中

1. 点击“添加提供者”
2. 选择提供者类型为 **OpenID Connect (OIDC)**
3. 填写：
   - 提供者名称：`Deno Deploy OIDC Provider`
   - 提供者 ID：`oidc-deno-com`
   - 签发者 URL：`https://oidc.deno.com`
4. 配置属性映射：
   - `google.subject` → `assertion.sub`
   - `attribute.org_slug` → `assertion.org_slug`
   - `attribute.app_slug` → `assertion.app_slug`
   - `attribute.full_slug` → `assertion.org_slug + "/" + assertion.app_slug`
5. 点击“保存”

#### 第 4 步：创建服务账号

1. 进入 IAM 与管理员 → 服务账号
2. 点击“创建服务账号”
3. 填写：
   - 服务账号名称：`deno-your-org-your-app`
   - 服务账号 ID：`deno-your-org-your-app`
   - 描述：`Deno Deploy 项目 your-org/your-app 的服务账号`
4. 点击“创建并继续”

#### 第 5 步：授予服务账号角色

1. 根据需要选择角色：
   - Cloud Storage：`Storage 对象查看者` 或 `Storage 管理员`
   - Cloud SQL：`Cloud SQL 客户端`
   - 其他服务：选择相关角色
2. 点击“继续”，然后“完成”

#### 第 6 步：配置工作负载身份绑定

1. 回到已创建的服务账号
2. 点击“有访问权限的主体”标签
3. 点击“授予访问权限”
4. 配置主体 - 选择一种方式：

   **应用中所有上下文：**
   - 新主体：
     `principalSet://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/attribute.full_slug/YOUR_ORG/YOUR_APP`

   **仅特定上下文：**
   - 新主体：
     `principal://iam.googleapis.com/projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/oidc-deno-com/subject/deployment:YOUR_ORG/YOUR_APP/production`
   - 对每个上下文（如 staging 等）重复添加

5. 角色：**工作负载身份用户**
6. 点击“保存”

#### 第 7 步：获取必要的值

您需要两个值用于 Deno Deploy<sup>EA</sup> 配置：

1. **工作负载提供者 ID**：
   - 回到工作负载身份联合
   - 点击您的池，然后点击您的提供者
   - 复制提供者资源名称（完整路径，以 `projects/` 开头）
2. **服务账号邮箱**：在服务账号详情页复制

#### 第 8 步：验证配置

最终工作负载身份池概览应显示：

- 您的工作负载身份池与 OIDC 提供者
- 已连接的服务账号
- 已正确配置的绑定

在 Deno Deploy<sup>EA</sup> 云连接配置中使用服务账号邮箱和工作负载提供者 ID。

### GCP：使用 Terraform

您可以使用 Terraform 编程方式创建 GCP 所需的资源。此方案适合基础设施即代码的工作流程。

#### Terraform 配置示例

创建一个 Terraform 配置文件，内容如下：

```hcl
# 变量定义
variable "org" {
  description = "Deno Deploy 组织名称"
  type        = string
}

variable "app" {
  description = "Deno Deploy 应用名称"
  type        = string
}

variable "contexts" {
  description = "允许的特定上下文列表（留空表示允许所有上下文）"
  type        = list(string)
  default     = []
}

variable "project_id" {
  description = "GCP 项目 ID"
  type        = string
}

variable "roles" {
  description = "授予服务账号的 IAM 角色列表"
  type        = list(string)
  default     = []
}

# 项目信息数据源
data "google_project" "project" {
  project_id = var.project_id
}

# 工作负载身份池
resource "google_iam_workload_identity_pool" "deno_deploy" {
  workload_identity_pool_id = "oidc-deno-com"
  display_name              = "Deno Deploy Workload Id Pool"
}

# 工作负载身份提供者
resource "google_iam_workload_identity_pool_provider" "deno_deploy" {
  workload_identity_pool_id           = google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id
  workload_identity_pool_provider_id = "oidc-deno-com"
  display_name                       = "Deno Deploy OIDC Provider"

  attribute_mapping = {
    "google.subject"      = "assertion.sub"
    "attribute.org_slug"  = "assertion.org_slug"
    "attribute.app_slug"  = "assertion.app_slug"
    "attribute.full_slug" = "assertion.org_slug + \"/\" + assertion.app_slug"
  }

  oidc {
    issuer_uri = "https://oidc.deno.com"
  }
}

# 服务账号
resource "google_service_account" "deno_deploy" {
  account_id   = "deno-${var.org}-${var.app}"
  display_name = "Deno Deploy ${var.org}/${var.app}"
}

# 基于上下文动态配置的工作负载身份绑定
resource "google_service_account_iam_binding" "workload_identity" {
  service_account_id = google_service_account.deno_deploy.name
  role               = "roles/iam.workloadIdentityUser"

  members = length(var.contexts) > 0 ? [
    # 仅允许特定上下文
    for context in var.contexts :
    "principal://iam.googleapis.com/projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id}/subject/deployment:${var.org}/${var.app}/${context}"
  ] : [
    # 允许所有上下文（使用属性映射）
    "principalSet://iam.googleapis.com/projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id}/attribute.full_slug/${var.org}/${var.app}"
  ]
}

# 授予服务账号权限
resource "google_project_iam_member" "service_account_roles" {
  for_each = toset(var.roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.deno_deploy.email}"
}

# 输出工作负载提供者 ID
output "workload_provider_id" {
  value = "projects/${data.google_project.project.number}/locations/global/workloadIdentityPools/${google_iam_workload_identity_pool.deno_deploy.workload_identity_pool_id}/providers/${google_iam_workload_identity_pool_provider.deno_deploy.workload_identity_pool_provider_id}"
}

# 输出服务账号邮箱
output "service_account_email" {
  value = google_service_account.deno_deploy.email
}
```

#### 使用示例

**针对整个应用（所有上下文）访问：**

```hcl
module "deno_deploy_gcp" {
  source = "./path-to-terraform-module"

  org        = "your-org"
  app        = "your-app"
  project_id = "your-gcp-project-id"
  contexts   = []  # 空列表表示允许所有上下文
  roles      = [
    "roles/storage.objectViewer",
    "roles/cloudsql.client"
  ]
}
```

**仅针对特定上下文：**

```hcl
module "deno_deploy_gcp" {
  source = "./path-to-terraform-module"

  org        = "your-org"
  app        = "your-app"
  project_id = "your-gcp-project-id"
  contexts   = ["production", "staging"]
  roles      = [
    "roles/storage.objectAdmin",
    "roles/cloudsql.client"
  ]
}
```

#### 应用配置

1. 初始化 Terraform：
   ```bash
   terraform init
   ```

2. 计划部署：
   ```bash
   terraform plan
   ```

3. 应用配置：
   ```bash
   terraform apply
   ```

应用完成后，Terraform 会输出工作负载提供者 ID 和服务账号邮箱，供您在 Deno Deploy<sup>EA</sup> 云连接配置中使用。

#### 自定义角色

`roles` 变量接受一个 GCP IAM 角色列表。常见角色包括：

- `roles/storage.objectViewer` - Cloud Storage 读取权限
- `roles/storage.objectAdmin` - Cloud Storage 对象完全权限
- `roles/cloudsql.client` - Cloud SQL 访问权限
- `roles/secretmanager.secretAccessor` - Secret Manager 访问权限
- 也可指定自定义角色