---
title: "连接到 DynamoDB"
---

亚马逊 DynamoDB 是一个完全托管的 NoSQL 数据库。要将数据持久化到 DynamoDB，请按照以下步骤操作：

本教程假设您拥有 AWS 和 Deno Deploy 帐户。

您可以在 [这里](../tutorials/tutorial-dynamodb) 找到一个更全面的教程，该教程在 DynamoDB 上构建了一个示例应用程序。

## 从 DynamoDB 收集凭证

该过程的第一步是生成 AWS 凭证，以便以编程方式访问 DynamoDB。

生成凭证：

1. 访问 https://console.aws.amazon.com/iam/ 并进入“用户”部分。
2. 点击 **添加用户** 按钮，填写 **用户名** 字段（可以使用 `denamo`），并选择 **编程访问** 类型。
3. 点击 **下一步：权限**，然后点击 **直接附加现有策略**，搜索 `AmazonDynamoDBFullAccess` 并选择它。
4. 点击 **下一步：标签**，然后点击 **下一步：审核**，最后点击 **创建用户**。
5. 点击 **下载 .csv** 按钮以下载凭证。

## 在 Deno Deploy 中创建项目

接下来，让我们在 Deno Deploy 中创建一个项目并设置所需的环境变量：

1. 访问 [https://dash.deno.com/new](https://dash.deno.com/new)（如果尚未登录，请用 GitHub 登录），然后在 **从命令行部署** 下点击 **+ 空项目**。
2. 现在点击项目页面上的 **设置** 按钮。
3. 导航到 **环境变量** 部分并添加以下密钥。

- `AWS_ACCESS_KEY_ID` - 使用下载的 CSV 中 **访问密钥 ID** 列下的值。
- `AWS_SECRET_ACCESS_KEY` - 使用下载的 CSV 中 **秘密访问密钥** 列下的值。

## 编写代码以连接到 DynamoDB

AWS 提供了一个
[官方 SDK](https://www.npmjs.com/package/@aws-sdk/client-dynamodb)，它可以在浏览器中使用。由于大多数 Deno Deploy 的 API 与浏览器类似，因此该 SDK 也可以在 Deno Deploy 中使用。要在 Deno 中使用该 SDK，可以从 CDN 导入，如下所示并创建一个客户端：

```js
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb?dts";

// 通过提供您的区域信息创建客户端实例。
// 凭证会从我们在 Deno Deploy 的项目创建步骤中设置的环境变量中自动获取，因此我们不需要在此手动传递它们。
const client = new ApiFactory().makeNew(DynamoDB);

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // async/await。
  try {
    const data = await client.send(command);
    // 处理数据。
  } catch (error) {
    // 错误处理。
  } finally {
    // 最终处理。
  }
}
```

## 将应用程序部署到 Deno Deploy

一旦您完成了应用程序的编写，就可以在 Deno Deploy 上部署它。

为此，请返回到您的项目页面，地址为 `https://dash.deno.com/projects/<project-name>`。

您应该会看到几个部署选项：

- [Github 集成](ci_github)
- [`deployctl`](./deployctl.md)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您希望添加构建步骤，否则我们建议您选择 GitHub 集成。

有关在 Deno Deploy 上部署的不同方式和不同配置选项的更多详细信息，请阅读 [这里](how-to-deploy)。