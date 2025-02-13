---
title: "用 Firestore (Firebase) 构建 API 服务器"
oldUrl:
  - /deploy/docs/tutorial-firebase/
---

Firebase 是 Google 开发的平台，用于创建移动和 web 应用程序。您可以使用 Firestore 在该平台上持久化数据。在本教程中，让我们看看如何使用它构建一个小型 API，该 API 具有插入和检索信息的端点。

- [概述](#overview)
- [概念](#concepts)
- [设置 Firebase](#setup-firebase)
- [编写应用程序](#write-the-application)
- [部署应用程序](#deploy-the-application)

## 概述

我们将构建一个只有一个端点的 API，该端点接受 `GET` 和 `POST` 请求，并返回一个 JSON 有效负载的信息：

```sh
# 对没有任何子路径的端点进行 GET 请求应该返回商店中所有歌曲的详细信息：
GET /songs
# 响应
[
  {
    title: "歌曲标题",
    artist: "某人",
    album: "某事",
    released: "1970",
    genres: "乡村说唱",
  }
]

# 对带有子路径的标题的端点进行 GET 请求应该返回
# 基于其标题的歌曲的详细信息。
GET /songs/歌曲标题 # '%20' == 空格
# 响应
{
  title: "歌曲标题"
  artist: "某人"
  album: "某事",
  released: "1970",
  genres: "乡村说唱",
}

# 对端点发起 POST 请求应该插入歌曲的详细信息。
POST /songs
# POST 请求正文
{
  title: "新的标题"
  artist: "新某人"
  album: "新的某事",
  released: "2020",
  genres: "乡村说唱",
}
```

在本教程中，我们将：

- 创建并设置一个
  [Firebase 项目](https://console.firebase.google.com/)。
- 使用文本编辑器创建我们的应用程序。
- 创建一个 [gist](https://gist.github.com/) 来“托管”我们的应用程序。
- 在 [Deno Deploy](https://dash.deno.com/) 上部署我们的应用程序。
- 使用 [cURL](https://curl.se/) 测试我们的应用程序。

## 概念

有几个概念有助于理解我们在本教程其余部分采取特定方法的原因，也可以帮助扩展应用程序。如果您愿意，可以跳到 [设置 Firebase](#setup-firebase)。

### 部署类浏览器

尽管 Deploy 在云中运行，但它提供的 APIs 在许多方面都基于 Web 标准。因此，当使用 Firebase 时，Firebase APIs 与为服务器运行时设计的 APIs 更加兼容。这意味着我们将在本教程中使用 Firebase 的 Web 库。

### Firebase 使用 XHR

Firebase 使用一个封装器，围绕 Closure 的
[WebChannel](https://google.github.io/closure-library/api/goog.net.WebChannel.html)
构建，WebChannel 最初是围绕 [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 构建的。
虽然 WebChannel 支持更现代的 `fetch()` API，但当前版本的 Firebase Web 并不统一使用支持 `fetch()` 的 WebChannel，而是使用 `XMLHttpRequest`。

虽然 Deploy 类似于浏览器，但不支持 `XMLHttpRequest`。
`XMLHttpRequest` 是一个“遗留”浏览器 API，存在多个限制，且在 Deploy 中实现某些特性将会很困难，这意味着 Deploy 不太可能实现该 API。

因此，在本教程中，我们将使用一个有限的 _polyfill_，该 polyfill 提供了足够的 `XMLHttpRequest` 功能集，以允许 Firebase/WebChannel 与服务器进行通信。

### Firebase 身份验证

Firebase 提供了相当多的 [选项](https://firebase.google.com/docs/auth) 进行身份验证。在本教程中，我们将使用电子邮件和密码身份验证。

当用户登录时，Firebase 可以持久化该身份验证。因为我们使用 Firebase 的 Web 库，持久化身份验证使得用户在离开页面后返回时无需重新登录。Firebase 允许在本地存储、会话存储中持久化身份验证，或者不进行持久化。

在 Deploy 上下文中，这略有不同。Deploy 部署将保持“活动”状态，这意味着某些请求将在请求之间保持内存状态，但在各种条件下可以启动或关闭新部署。目前，Deploy 没有提供任何持久性，除了内存分配。此外，它目前不提供全局的 `localStorage` 或 `sessionStorage`，这是 Firebase 用于存储身份验证信息的方式。

为了减少重新身份验证的需要，同时确保我们可以支持单一部署的多个用户，我们将使用一个 polyfill，允许我们提供一个 `localStorage` 接口给 Firebase，但将信息作为客户端的 cookie 存储。

## 设置 Firebase

[Firebase](https://firebase.google.com/) 是一个功能丰富的平台。Firebase 管理的所有详细信息超出了本教程的范围。我们将涵盖本教程所需的内容。

1. 在 [Firebase 控制台](https://console.firebase.google.com/) 中创建一个新项目。
2. 向您的项目添加一个 Web 应用程序。请记录在设置向导中提供的 `firebaseConfig`。它看起来应该类似于以下内容。我们稍后会使用这个：

   ```js title="firebase.js"
   var firebaseConfig = {
     apiKey: "APIKEY",
     authDomain: "example-12345.firebaseapp.com",
     projectId: "example-12345",
     storageBucket: "example-12345.appspot.com",
     messagingSenderId: "1234567890",
     appId: "APPID",
   };
   ```

3. 在管理控制台的 `身份验证` 下，您将想要启用 `电子邮件/密码` 登录方法。
4. 您将想要在 `身份验证` 下的 `用户` 部分添加用户和密码，并记录所用值，以备后用。
5. 向您的项目添加 `Firestore 数据库`。控制台将允许您设置 _生产模式_ 或 _测试模式_。您将根据配置的内容自行决定，但 _生产模式_ 将要求您设置进一步的安全规则。
6. 向数据库添加一个名为 `songs` 的集合。这将要求您至少添加一个文档。只需将文档设置为 _自动 ID_。

_注意_ 根据您的 Google 账户状态，可能需要进行其他设置和管理步骤。

## 编写应用程序

我们想将应用程序创建为我们喜欢的编辑器中的 JavaScript 文件。

我们要做的第一件事是导入 Firebase 在 Deploy 下工作所需的 `XMLHttpRequest` polyfill 以及一个 `localStorage` 的 polyfill，以允许 Firebase 身份验证持久化已登录用户：

```js title="firebase.js"
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
```

> ℹ️ 我们使用的是在编写本教程时当前版本的包。它们可能不是最新的，您可能想要双重检查当前版本。

因为 Deploy 具有大量 Web 标准 API，最好在部署下使用 Firebase 的 Web 库。目前 v9 仍处于 beta 阶段，所以我们在本教程中将使用 v8：

```js title="firebase.js"
import firebase from "https://esm.sh/firebase@8.7.0/app";
import "https://esm.sh/firebase@8.7.0/auth";
import "https://esm.sh/firebase@8.7.0/firestore";
```

我们还将使用 [oak](https://deno.land/x/oak) 作为创建 API 的中间件框架，包括用于将 `localStorage` 值设置为客户端 cookies 的中间件：

```js title="firebase.js"
import {
  Application,
  Router,
  Status,
} from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { virtualStorage } from "https://deno.land/x/virtualstorage@0.1.0/middleware.ts";
```

现在我们需要设置我们的 Firebase 应用程序。我们将从稍后在 `FIREBASE_CONFIG` 关键字下设置的环境变量中获取配置，并获取我们将要使用的 Firebase 各部分的引用：

```js title="firebase.js"
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

我们还将设置应用程序以处理每个请求的登录用户。所以我们将创建一个我们之前在此部署中登录过的用户的映射。虽然在本教程中，我们只会有一个登录用户，但代码可以很容易地适应允许客户端单独登录：

```js title="firebase.js"
const users = new Map();
```

让我们创建我们的中间件路由器，并创建三个不同的中间件处理程序，以支持 `/songs` 的 `GET` 和 `POST` 以及对 `/songs/{title}` 的 `GET`：

```js title="firebase.js"
const router = new Router();

// 返回集合中的任何歌曲
router.get("/songs", async (ctx) => {
  const querySnapshot = await db.collection("songs").get();
  ctx.response.body = querySnapshot.docs.map((doc) => doc.data());
  ctx.response.type = "json";
});

// 返回第一个与标题匹配的文档
router.get("/songs/:title", async (ctx) => {
  const { title } = ctx.params;
  const querySnapshot = await db.collection("songs").where("title", "==", title)
    .get();
  const song = querySnapshot.docs.map((doc) => doc.data())[0];
  if (!song) {
    ctx.response.status = 404;
    ctx.response.body = `未找到标题为 "${ctx.params.title}" 的歌曲。`;
    ctx.response.type = "text";
  } else {
    ctx.response.body = querySnapshot.docs.map((doc) => doc.data())[0];
    ctx.response.type = "json";
  }
});

function isSong(value) {
  return typeof value === "object" && value !== null && "title" in value;
}

// 移除任何具有相同标题的歌曲并添加新歌曲
router.post("/songs", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.throw(Status.BadRequest, "必须是 JSON 文档");
  }
  const song = await body.value;
  if (!isSong(song)) {
    ctx.throw(Status.BadRequest, "有效负载格式不正确");
  }
  const querySnapshot = await db
    .collection("songs")
    .where("title", "==", song.title)
    .get();
  await Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete()));
  const songsRef = db.collection("songs");
  await songsRef.add(song);
  ctx.response.status = Status.NoContent;
});
```

好的，我们快要完成了。我们只需创建我们的中间件应用程序，并添加我们导入的 `localStorage` 中间件：

```js title="firebase.js"
const app = new Application();
app.use(virtualStorage());
```

然后我们需要添加中间件来验证用户。在本教程中，我们只是从我们将要设置的环境变量中获取用户名和密码，但如果用户未登录，这可以很容易地调整为将用户重定向到登录页面：

```js title="firebase.js"
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

现在让我们将路由器添加到中间件应用程序，并将应用程序设置为监听 8000 端口：

```js title="firebase.js"
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
```

现在我们有一个应该提供我们 API 的应用程序。

## 部署应用程序

现在我们一切就绪，让我们部署您的新应用程序！

1. 在浏览器中访问 [Deno Deploy](https://dash.deno.com/new_project) 并将您的 GitHub 账户链接起来。
2. 选择包含您新应用程序的仓库。
3. 您可以为项目命名，或者让 Deno 为您生成一个名称
4. 在入口点下拉菜单中选择 `firebase.js`
5. 点击 **部署项目**

为了使您的应用程序正常工作，我们需要配置其环境变量。

在您项目的成功页面或项目仪表板中，点击 **添加环境变量**。在环境变量下，点击 **+ 添加变量**。创建以下变量：

1. `FIREBASE_USERNAME` - 上述添加的 Firebase 用户（电子邮件地址）
2. `FIREBASE_PASSWORD` - 上述添加的 Firebase 用户密码
3. `FIREBASE_CONFIG` - Firebase 应用程序的配置，作为 JSON 字符串

配置需要是有效的 JSON 字符串，以便应用程序可以读取。如果设置时给出的代码片段看起来是这样的：

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

您需要将字符串的值设置为这个（注意空格和换行不是必需的）：

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

点击保存变量。

现在让我们来体验一下我们的 API。

我们可以创建一个新歌曲：

```sh
curl --request POST \
  --header "Content-Type: application/json" \
  --data '{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "乡村说唱, 流行"}' \
  --dump-header \
  - https://<project_name>.deno.dev/songs
```

我们可以获取我们集合中的所有歌曲：

```sh
curl https://<project_name>.deno.dev/songs
```

我们可以获取关于我们创建的标题的特定信息：

```sh
curl https://<project_name>.deno.dev/songs/Old%20Town%20Road
```