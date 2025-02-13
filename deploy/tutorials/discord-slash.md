---
title: "Discord 斜杠命令"
oldUrl:
  - /deploy/docs/discord-slash/
---

Discord 有一个新功能，称为 **斜杠命令**。它们允许你输入 `/` 后跟命令名称来执行某些操作。例如，你可以输入 `/giphy cats`（一个内置命令）来获取一些猫的 GIF。

Discord 斜杠命令的工作原理是在有人发出命令时向一个 URL 发送请求。你不需要时刻运行你的应用程序，以便斜杠命令能够工作，这使得 Deno Deploy 成为构建这些命令的完美解决方案。

在这篇文章中，让我们看看如何使用 Deno Deploy 创建一个 hello world 斜杠命令。

## **第一步：** 在 Discord 开发者门户创建应用程序

1. 前往 [https://discord.com/developers/applications](https://discord.com/developers/applications) （如有需要，请使用你的 Discord 账户登录）。
2. 点击你个人资料照片左侧的 **新建应用程序** 按钮。
3. 给你的应用程序命名，并点击 **创建**。
4. 转到 **机器人** 部分，点击 **添加机器人**，最后点击 **是的，执行！** 进行确认。

就是这样。一个新的应用程序被创建，它将保存我们的斜杠命令。请不要关闭这个选项卡，因为我们在开发过程中需要这个应用程序页面的信息。

## **第二步：** 在 Discord 应用中注册斜杠命令

在我们编写一些代码之前，我们需要向一个 Discord 端点发送请求以在我们的应用中注册一个斜杠命令。

将 `BOT_TOKEN` 填入 **机器人** 部分的令牌，将 `CLIENT_ID` 填入页面 **通用信息** 部分的 ID，并在终端运行以下命令。

```sh
BOT_TOKEN='replace_me_with_bot_token'
CLIENT_ID='replace_me_with_client_id'
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"hello","description":"问候一个人","options":[{"name":"name","description":"人的名字","type":3,"required":true}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/commands"
```

这将注册一个名为 `hello` 的斜杠命令，它接受一个名为 `name` 的字符串类型参数。

## **第三步：** 创建并在 Deno Deploy 上部署 hello world 斜杠命令

接下来，我们需要创建一个服务器，以便在 Discord 发送 POST 请求并包含某人的斜杠命令时进行响应。

1. 前往 https://dash.deno.com/new 并在 **Playground** 卡片下点击 **Play**。
2. 在下一页的编辑器中，点击顶部菜单中的 **设置** 图标。在弹出的模态框中，选择 **+ 添加变量**。
3. 输入 `DISCORD_PUBLIC_KEY` 作为 KEY。VALUE 应该是 Discord 应用页面 **通用信息** 部分中可用的公钥。
4. 将以下代码复制并粘贴到编辑器中：

   ```ts
   // Sift 是一个小型路由库，它抽象了启动端口上的监听器等细节，
   // 提供了一个简单的函数 (serve)，具有调用特定路径函数的 API。
   import {
     json,
     serve,
     validateRequest,
   } from "https://deno.land/x/sift@0.6.0/mod.ts";
   // TweetNaCl 是一个我们用来验证来自 Discord 请求的加密库。
   import nacl from "https://esm.sh/tweetnacl@v1.0.3?dts";

   // 对于所有请求到 "/" 端点，我们希望调用 home() 处理程序。
   serve({
     "/": home,
   });

   // Discord 斜杠命令的主要逻辑在此函数中定义。
   async function home(request: Request) {
     // validateRequest() 确保请求的方法为 POST，并且具有以下头部。
     const { error } = await validateRequest(request, {
       POST: {
         headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
       },
     });
     if (error) {
       return json({ error: error.message }, { status: error.status });
     }

     // verifySignature() 验证请求是否来自 Discord。
     // 当请求的签名无效时，我们返回 401，这一点很重要，因为 Discord 会发送无效的请求来测试我们的验证。
     const { valid, body } = await verifySignature(request);
     if (!valid) {
       return json(
         { error: "无效的请求" },
         {
           status: 401,
         },
       );
     }

     const { type = 0, data = { options: [] } } = JSON.parse(body);
     // Discord 进行 Ping 交互以测试我们的应用程序。
     // 请求中的类型 1 表示 Ping 交互。
     if (type === 1) {
       return json({
         type: 1, // 响应中的类型 1 是 Pong 交互响应类型。
       });
     }

     // 请求中的类型 2 是 ApplicationCommand 交互。
     // 这意味着用户已发出命令。
     if (type === 2) {
       const { value } = data.options.find((option) => option.name === "name");
       return json({
         // 类型 4 的响应包含以下消息，保留用户的输入在顶部。
         type: 4,
         data: {
           content: `你好，${value}!`,
         },
       });
     }

     // 我们将返回一个错误请求，因为有效的 Discord 请求不应该到达这里。
     return json({ error: "错误请求" }, { status: 400 });
   }

   /** 验证请求是否来自 Discord。 */
   async function verifySignature(
     request: Request,
   ): Promise<{ valid: boolean; body: string }> {
     const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
     // Discord 在每个请求中都会发送这些头部。
     const signature = request.headers.get("X-Signature-Ed25519")!;
     const timestamp = request.headers.get("X-Signature-Timestamp")!;
     const body = await request.text();
     const valid = nacl.sign.detached.verify(
       new TextEncoder().encode(timestamp + body),
       hexToUint8Array(signature),
       hexToUint8Array(PUBLIC_KEY),
     );

     return { valid, body };
   }

   /** 将十六进制字符串转换为 Uint8Array。 */
   function hexToUint8Array(hex: string) {
     return new Uint8Array(
       hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)),
     );
   }
   ```

5. 点击 **保存并部署** 来部署服务器。
6. 一旦文件被部署，请注意项目 URL。它将显示在编辑器的右上角，并以 `.deno.dev` 结尾。

## **第三步：** 配置 Discord 应用以使用我们的 URL 作为交互端点 URL

1. 返回到你的应用程序（Greeter）页面的 Discord 开发者门户。
2. 将 **交互端点 URL** 字段填入上面 Deno Deploy 项目的 URL，并点击 **保存更改**。

应用程序现在已准备就绪。让我们继续下一部分以安装它。

## **第四步：** 在你的 Discord 服务器上安装斜杠命令

要使用 `hello` 斜杠命令，我们需要在我们的 Discord 服务器上安装我们的 Greeter 应用。以下是步骤：

1. 前往 Discord 开发者门户上的 Discord 应用页面的 **OAuth2** 部分。
2. 选择 `applications.commands` 范围，并点击下面的 **复制** 按钮。
3. 现在将其粘贴并在浏览器中访问该 URL。选择你的服务器并点击 **授权**。

打开 Discord，输入 `/hello Deno Deploy` 并按 **Enter**。输出将类似于以下内容。

![Hello, Deno Deploy!](../docs-images/discord-slash-command.png)

恭喜你完成本教程！继续构建一些很棒的 Discord 斜杠命令！并请在 [Deno Discord 服务器](https://discord.gg/deno) 的 **deploy** 频道与我们分享它们。