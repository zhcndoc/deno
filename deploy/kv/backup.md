---
title: "备份"
oldUrl:
  - /kv/manual/backup/
  - /deploy/kv/manual/backup/
---

<deno-admonition></deno-admonition>

在 Deno Deploy 上托管的 KV 数据库可以持续备份到您自己的 S3 兼容存储桶。这是我们为所有存储在托管 Deno KV 数据库中的数据内部执行的复制和备份的补充，以确保高可用性和数据持久性。

此备份将持续进行，几乎没有延迟，支持 _[时间点恢复](https://en.wikipedia.org/wiki/Point-in-time_recovery)_ 和实时复制。为 KV 数据库启用备份可以解锁各种有趣的使用案例：

- 在过去的任何时间点检索数据的一致快照
- 独立于 Deno Deploy 运行只读数据副本
- 通过将变更管道到流媒体平台和分析数据库（如 Kafka、BigQuery 和 ClickHouse）来推送数据到您最喜欢的数据管道

## 配置备份到 Amazon S3

首先，您必须在 AWS 上创建一个存储桶：

<deno-tabs group-id="aws-tool">
<deno-tab value="console" label="AWS 控制台" default>

1. 访问 [AWS S3 控制台](https://s3.console.aws.amazon.com/s3/home)
2. 点击 “创建存储桶”
3. 输入存储桶名称并选择 AWS 区域，然后向下滚动并点击 “下一步”

</deno-tab>
<deno-tab value="cli" label="AWS CLI">

1. 安装 [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2. 运行
   `aws s3api create-bucket --bucket <bucket-name> --region <region> --create-bucket-configuration LocationConstraint=<region>`
   （将 `<bucket-name>` 和 `<region>` 替换为您的值）

</deno-tab>
</deno-tabs>

接下来，创建一个对存储桶具有 `PutObject` 访问权限的 IAM 策略，将其附加到 IAM 用户，并为该用户创建访问密钥：

<deno-tabs group-id="aws-tool">
<deno-tab value="console" label="AWS 控制台" default>

1. 访问 [AWS IAM 控制台](https://console.aws.amazon.com/iam/home)
2. 在左侧边栏点击 “策略”
3. 点击 “创建策略”
4. 选择 “JSON” 策略编辑器并粘贴以下策略：
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "KVBackup",
         "Effect": "Allow",
         "Action": "s3:PutObject",
         "Resource": "arn:aws:s3:::<bucket-name>/*"
       }
     ]
   }
   ```
   将 `<bucket-name>` 替换为您之前创建的存储桶名称。
5. 点击 “审核策略”
6. 输入策略名称并点击 “创建策略”
7. 在左侧边栏点击 “用户”
8. 点击 “添加用户”
9. 输入用户名称并点击 “下一步”
10. 点击 “直接附加策略”
11. 搜索您之前创建的策略，并点击其旁边的复选框
12. 点击 “下一步”
13. 点击 “创建用户”
14. 点击您刚刚创建的用户
15. 点击 “安全凭证”，然后点击 “创建访问密钥”
16. 选择 “其他”，然后点击 “下一步”
17. 输入访问密钥描述并点击 “创建访问密钥”
18. 复制访问密钥 ID 和秘密访问密钥，并将其保存在安全的地方。
    您稍后会需要它们，并且将无法再检索它们。

</deno-tab>
<deno-tab value="cli" label="AWS CLI">

1. 复制以下命令到终端，将 `<bucket-name>` 替换为您之前创建的存储桶名称，然后运行：
   ```
   aws iam create-policy --policy-name <policy-name> --policy-document '{"Version":"2012-10-17","Statement":[{"Sid":"KVBackup","Effect":"Allow","Action":"s3:PutObject","Resource":"arn:aws:s3:::<bucket-name>/*"}]}'
   ```
2. 复制以下命令到终端，将 `<user-name>` 替换为您正在创建的用户的名称，然后运行：
   ```
   aws iam create-user --user-name <user-name>
   ```
3. 复制以下命令到终端，将 `<policy-arn>` 替换为您在步骤 1 中创建的策略的 ARN，并将 `<user-name>` 替换为您在上一步中创建的用户的名称，然后运行：
   ```
   aws iam attach-user-policy --policy-arn <policy-arn> --user-name <user-name>
   ```
4. 复制以下命令到终端，将 `<user-name>` 替换为您在步骤 2 中创建的用户的名称，然后运行：
   ```
   aws iam create-access-key --user-name <user-name>
   ```
5. 复制访问密钥 ID 和秘密访问密钥，并将其保存在安全的地方。
   您稍后会需要它们，并且将无法再检索它们。

</deno-tab>
</deno-tabs>

现在访问 [Deno Deploy 控制台](https://dash.deno.com)，并在您的项目中点击 “KV” 选项卡。滚动到 “备份” 部分，点击 “AWS S3”。输入您之前创建的存储桶名称、访问密钥 ID 和秘密访问密钥，以及存储桶所在的区域。然后点击 “保存”。

<img
  src="./images/backup-add-bucket-to-dash.png"
  alt="将备份添加到仪表板"
  style="height: 500px;"
/>

备份将立即开始。一旦数据备份完成，并且连续备份处于活动状态，您将看到状态变为 “活跃”。

## 配置备份到 Google Cloud Storage

Google Cloud Storage (GCS) 兼容 S3 协议，也可以用作备份目标。

首先，您必须在 GCP 上创建一个存储桶：

<deno-tabs group-id="gcp-tool">
<deno-tab value="console" label="GCP 控制台" default>

1. 访问 [GCP Cloud Storage 控制台](https://console.cloud.google.com/storage/browser)
2. 点击顶部栏的 “创建”
3. 输入存储桶名称，选择位置，然后点击 “创建”

</deno-tab>
<deno-tab value="cli" label="gcloud CLI">

1. 安装 [gcloud CLI](https://cloud.google.com/sdk/docs/install)
2. 运行 `gcloud storage buckets create <bucket-name> --location <location>`
   （将 `<bucket-name>` 和 `<location>` 替换为您的值）

</deno-tab>
</deno-tabs>

接下来，创建一个对存储桶具有 `Storage Object Admin` 访问权限的服务账号，并为该服务账号创建 HMAC 访问密钥：

<deno-tabs group-id="gcp-tool">
<deno-tab value="console" label="GCP 控制台" default>

1. 访问 [GCP IAM 控制台](https://console.cloud.google.com/iam-admin/iam)
2. 在左侧边栏点击 “服务账户”
3. 点击 “创建服务账户”
4. 输入服务账户名称并点击 “完成”
5. 复制您刚刚创建的服务账户的电子邮件。您稍后会需要它。
6. 访问 [GCP Cloud Storage 控制台](https://console.cloud.google.com/storage/browser)
7. 点击您之前创建的存储桶
8. 点击工具栏上的 “权限”
9. 点击 “授予访问权限”
10. 将您之前复制的服务账户的电子邮件粘贴到 “新主体” 字段中
11. 从 “选择角色” 下拉菜单中选择 “Storage Object Admin”
12. 点击 “保存”
13. 在左侧边栏点击 “设置”（仍然在 Cloud Storage 控制台中）
14. 点击 “互操作性” 标签
15. 点击 “为服务帐号创建密钥”
16. 选择您之前创建的服务帐号
17. 点击 “创建密钥”
18. 复制访问密钥和秘密访问密钥，并将其保存在安全的地方。您稍后会需要它们，并且将无法再检索它们。

</deno-tab>
<deno-tab value="cli" label="gcloud CLI">

1. 运行以下命令，将 `<service-account-name>` 替换为您正在创建的服务帐号的名称：
   ```
   gcloud iam service-accounts create <service-account-name>
   ```
2. 运行以下命令，将 `<bucket-name>` 替换为您之前创建的存储桶名称，并将 `<service-account-email>` 替换为您在上一步创建的服务帐户的电子邮件：
   ```
   gsutil iam ch serviceAccount:<service-account-email>:objectAdmin gs://<bucket-name>
   ```
3. 运行以下命令，将 `<service-account-email>` 替换为您在上一步创建的服务帐户的电子邮件：
   ```
   gcloud storage hmac create <service-account-email>
   ```
4. 复制 `accessId` 和 `secret` 并将其保存在安全的地方。您稍后会需要它们，并且将无法再检索它们。

</deno-tab>
</deno-tabs>

现在访问 [Deno Deploy 控制台](https://dash.deno.com)，并在您的项目中点击 “KV” 选项卡。滚动到 “备份” 部分，点击 “Google Cloud Storage”。输入您之前创建的存储桶名称、访问密钥 ID 和秘密访问密钥，以及存储桶所在的区域。然后点击 “保存”。

备份将立即开始。一旦数据备份完成，并且连续备份处于活动状态，您将看到状态变为 “活跃”。

## 使用备份

S3 备份可以与 `denokv` 工具一起使用。有关更多详细信息，请参阅 [文档](https://github.com/denoland/denokv)。