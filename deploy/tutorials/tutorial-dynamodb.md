---
title: "使用 DynamoDB 构建 API 服务器"
oldUrl:
  - /deploy/docs/tutorial-dynamodb/
---

在本教程中，让我们看看如何使用 DynamoDB 来构建一个小型 API，该 API 具有插入和检索信息的端点。

本教程假设您拥有 AWS 和 Deno Deploy 账户。

- [概述](#overview)
- [设置 DynamoDB](#setup-dynamodb)
- [在 Deno Deploy 中创建项目](#create-a-project-in-deno-deploy)
- [编写应用程序](#write-the-application)
- [部署应用程序](#deploy-the-application)

## 概述

我们将构建一个具有单个端点的 API，该端点接受 GET/POST 请求并返回相应的信息。

```sh
# 对该端点的 GET 请求应返回基于歌曲标题的详细信息。
GET /songs?title=Song%20Title # '%20' == 空格
# 响应
{
  title: "Song Title"
  artist: "Someone"
  album: "Something",
  released: "1970",
  genres: "country rap",
}

# 对该端点的 POST 请求应插入歌曲详细信息。
POST /songs
# POST 请求体
{
  title: "A New Title"
  artist: "Someone New"
  album: "Something New",
  released: "2020",
  genres: "country rap",
}
```

## 设置 DynamoDB

我们过程中的第一步是生成 AWS 凭证，以便以编程方式访问 DynamoDB。

生成凭证：

1. 转到 https://console.aws.amazon.com/iam/ 并进入“用户”部分。
2. 点击 **创建用户** 按钮，填写 **用户名** 字段（可以使用 `denamo`），选择 **程序matic access** 类型。
3. 点击 **下一步**
4. 选择 **直接附加策略** 并搜索 `AmazonDynamoDBFullAccess`。勾选结果中此策略旁边的框。
5. 点击 **下一步** 和 **创建用户**
6. 在生成的 **用户** 页面中，点击您刚创建的用户
7. 点击 **创建访问密钥**
8. 选择 **在 AWS 外部运行的应用程序**
9. 点击 ***创建**
10. 点击 **下载 .csv 文件** 以下载您刚创建的凭证。

创建数据库表：

1. 转到 https://console.aws.amazon.com/dynamodb 并点击 **创建表** 按钮。
2. 在 **表名** 字段中填写 `songs`，在 **分区键** 中填写 `title`。
3. 向下滚动并点击 **创建表**。
4. 创建表后，点击表名并查看其 **基本信息**
5. 在 **Amazon 资源名称 (ARN)** 下，记下您新表的区域（例如 us-east-1）。

## 编写应用程序

创建一个名为 `index.js` 的文件，并插入以下内容：

```js
import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
// AWS 有一个官方的 SDK 适用于浏览器。由于大多数 Deno Deploy 的 API
// 与浏览器类似，因此相同的 SDK 可与 Deno Deploy 一起使用。
// 因此我们导入 SDK 以及一些插入和
// 检索数据所需的类。
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "https://esm.sh/@aws-sdk/client-dynamodb";

// 通过提供您的区域信息创建客户端实例。
// 凭证是从环境变量中获取的，
// 这些变量是在 Deno Deploy 的项目创建步骤中设置的。
const client = new DynamoDBClient({
  region: Deno.env.get("AWS_TABLE_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  },
});

serve({
  "/songs": handleRequest,
});

async function handleRequest(request) {
  // 该端点允许 GET 和 POST 请求。GET 请求中需要一个名为“title”的参数。
  // 并且处理 POST 请求时，要求提供以下字段的体。
  // validateRequest 确保请求满足提供的条件。
  const { error, body } = await validateRequest(request, {
    GET: {
      params: ["title"],
    },
    POST: {
      body: ["title", "artist", "album", "released", "genres"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // 处理 POST 请求。
  if (request.method === "POST") {
    try {
      // 当我们想要与 DynamoDB 交互时，我们使用客户端实例发送命令。
      // 在这里，我们发送 PutItemCommand 来插入请求中的数据。
      const {
        $metadata: { httpStatusCode },
      } = await client.send(
        new PutItemCommand({
          TableName: "songs",
          Item: {
            // 这里 'S' 表示值类型为字符串
            // 而 'N' 表示数值。
            title: { S: body.title },
            artist: { S: body.artist },
            album: { S: body.album },
            released: { N: body.released },
            genres: { S: body.genres },
          },
        }),
      );

      // 在成功的插入项目请求中，dynamo 返回 200 状态码（很奇怪）。
      // 因此，我们测试状态码以验证数据是否已插入，并以请求提供的数据作为确认响应。
      if (httpStatusCode === 200) {
        return json({ ...body }, { status: 201 });
      }
    } catch (error) {
      // 如果在请求过程中发生错误，我们会记录该错误以供参考。
      console.log(error);
    }

    // 如果执行达到这里，意味着插入没有成功。
    return json({ error: "无法插入数据" }, { status: 500 });
  }

  // 处理 GET 请求。
  try {
    // 我们从请求中获取标题，并发送 GetItemCommand
    // 以检索有关歌曲的信息。
    const { searchParams } = new URL(request.url);
    const { Item } = await client.send(
      new GetItemCommand({
        TableName: "songs",
        Key: {
          title: { S: searchParams.get("title") },
        },
      }),
    );

    // Item 属性包含所有数据，因此如果它不是未定义的，
    // 我们继续返回有关该标题的信息
    if (Item) {
      return json({
        title: Item.title.S,
        artist: Item.artist.S,
        album: Item.album.S,
        released: Item.released.S,
        genres: Item.genres.S,
      });
    }
  } catch (error) {
    console.log(error);
  }

  // 如果在请求数据库时抛出错误，或者数据库中找不到 Item，
  // 我们可能会到达这里。
  // 我们用一条通用消息反映这两种情况。
  return json(
    {
      message: "找不到该标题",
    },
    { status: 404 },
  );
}
```

在您的新项目中初始化 git 并
[推送到 GitHub](https://docs.github.com/en/get-started/start-your-journey/hello-world#step-1-create-a-repository)。

## 部署应用程序

现在我们已准备好一切，让我们部署您的新应用程序！

1. 在浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并链接您的 GitHub 账户。
2. 选择包含您新应用程序的存储库。
3. 您可以给您的项目一个名称，或者允许 Deno 为您生成一个名称。
4. 在入口点下拉列表中选择 `index.js`
5. 点击 **部署项目**

为了使您的应用程序正常工作，我们需要配置其环境变量。

在您的项目成功页面或项目仪表板中，点击 **添加环境变量**。在环境变量下，点击 **+ 添加变量**。创建以下变量：

1. `AWS_ACCESS_KEY_ID` - 值来自您下载的 CSV
2. `AWS_SECRET_ACCESS_KEY` - 值来自您下载的 CSV。
3. `AWS_TABLE_REGION` - 选项为您的表的区域

点击保存变量。

让我们测试 API。

POST 一些数据。

```sh
curl --request POST --data \
'{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}' \
--dump-header - https://<project_name>.deno.dev/songs
```

获取关于标题的信息。

```sh
curl https://<project_name>.deno.dev/songs?title=Old%20Town%20Road
```

恭喜您学习了如何使用 DynamoDB 与 Deno Deploy！