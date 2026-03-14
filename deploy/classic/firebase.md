---
title: "连接到 Firebase"
---

:::info Legacy Documentation

您正在查看 Deno Deploy Classic 的旧文档。我们推荐您迁移到新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

Firebase 是 Google 开发的一个平台，用于创建移动和网络应用程序。它的功能包括用于登录的身份验证原语和一个 NoSQL 数据存储库 Firestore，您可以将数据持久化到其中。

本教程介绍了如何从部署在 Deno Deploy 上的应用程序连接到 Firebase。

您可以在 [这里](../tutorials/tutorial-firebase) 找到一个更全面的教程，该教程基于 Firebase 构建了一个示例应用程序。

## 从 Firebase 获取凭据

> 本教程假设您已经在 Firebase 中创建了一个项目并将网页应用程序添加到您的项目中。

1. 在 Firebase 中导航到您的项目，然后单击 **项目设置**
2. 向下滚动，直到您看到一张包含您的应用名称的卡片，以及一个包含 `firebaseConfig` 对象的代码示例。它应该看起来像下面的内容。请将其保留备用。我们稍后会用到它：

   ```js
   var firebaseConfig = {
     apiKey: "APIKEY",
     authDomain: "example-12345.firebaseapp.com",
     projectId: "example-12345",
     storageBucket: "example-12345.appspot.com",
     messagingSenderId: "1234567890",
     appId: "APPID",
   };
   ```

## 在 Deno Deploy 中创建项目

1. 访问 [https://dash.deno.com/new](https://dash.deno.com/new) （如果您尚未登录，请使用 GitHub 登录），然后在 **从命令行部署** 下单击 **+ 空项目**。
2. 现在单击项目页面上可用的 **设置** 按钮。
3. 导航至 **环境变量** 部分并添加以下内容：

   <dl>
    <dt><code>FIREBASE_USERNAME</code></dt>
    <dd>上述添加的 Firebase 用户（电子邮件地址）。</dd>
    <dt><code>FIREBASE_PASSWORD</code></dt>
    <dd>上述添加的 Firebase 用户密码。</dd>
    <dt><code>FIREBASE_CONFIG</code></dt>
    <dd>Firebase 应用程序的配置，格式为 JSON 字符串。</dd>
   </dl>

   配置需要是有效的 JSON 字符串，以便应用程序可以读取。如果在设置时给出的代码片段如下所示：

   ```js
   var firebaseConfig = {
     apiKey: "APIKEY",
     authDomain: "example-12345.firebaseapp.com",
     projectId: "example-12345",
     storageBucket: "example-12345.appspot.com",
     messagingSenderId: "1234567890",
     appId: "APPID",
   };
   ```

   您需要将字符串的值设置为如下（注意空格和换行不是必需的）：

   ```json
   {
     "apiKey": "APIKEY",
     "authDomain": "example-12345.firebaseapp.com",
     "projectId": "example-12345",
     "storageBucket": "example-12345.appspot.com",
     "messagingSenderId": "1234567890",
     "appId": "APPID"
   }
   ```

## 编写连接到 Firebase 的代码

我们要做的第一件事是导入 Firebase 在 Deploy 下运行所需的 `XMLHttpRequest` polyfill 以及一个用于 `localStorage` 的 polyfill，以允许 Firebase 身份验证保持登录用户：

```js
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
```

> ℹ️ 我们在撰写本教程时使用的是当前版本的包。它们可能不是最新的，您可能想要仔细检查当前版本。

由于 Deploy 具有许多网络标准 API，因此最好在 Deploy 下使用 Firebase 的 Web 库。目前 Firebase 的 v9 仍在测试阶段，所以我们将使用 v8：

```js
import firebase from "https://esm.sh/firebase@9.17.0/app";
import "https://esm.sh/firebase@9.17.0/auth";
import "https://esm.sh/firebase@9.17.0/firestore";
```

现在我们需要设置我们的 Firebase 应用程序。我们将从我们之前设置的环境变量中获取配置，并获取我们将要使用的 Firebase 部分的引用：

```js
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

好的，我们快完成了。我们只需创建我们的中间件应用程序并添加我们导入的 `localStorage` 中间件：

```js
const app = new Application();
app.use(virtualStorage());
```

然后我们需要添加中间件来验证用户。在本教程中，我们只是从将要设置的环境变量中获取用户名和密码，但这很容易适应于将用户重定向到登录页面，如果他们没有登录：

```js
app.use(async (ctx, next) => {
  const signedInUid = ctx.cookies.get("LOGGED_IN_UID");
  const signedInUser = signedInUid != null ? users.get(signedInUid) : undefined;
  if (!signedInUid || !signedInUser || !auth.currentUser) {
    const creds = await auth.signInWithEmailAndPassword(
      Deno.env.get("FIREBASE_USERNAME"),
      Deno.env.get("FIREBASE_PASSWORD"),
    );
    const { user } = creds;
    if (user) {
      users.set(user.uid, user);
      ctx.cookies.set("LOGGED_IN_UID", user.uid);
    } else if (signedInUser && signedInUid.uid !== auth.currentUser?.uid) {
      await auth.updateCurrentUser(signedInUser);
    }
  }
  return next();
});
```

## 将应用程序部署到 Deno Deploy

完成编写应用程序后，您可以将其部署到 Deno Deploy。

为此，请返回到您的项目页面，网址为
`https://dash.deno.com/projects/<project-name>`。

您应该会看到几种部署选项：

- [Github 集成](ci_github)
- [`deployctl`](./deployctl.md)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

除非您想添加构建步骤，否则我们建议您选择 Github 集成。

有关在 Deno Deploy 上部署的不同方式以及不同配置选项的更多详细信息，请阅读 [这里](how-to-deploy)。