---
last_modified: 2025-09-24
title: "Simple API server"
url: /examples/simple_api_tutorial/
oldUrl:
  - /deploy/tutorials/simple-api/
  - /deploy/docs/simple-api/
---

Deno 使得仅使用 Web 平台的基础（Request、Response、fetch）及内置数据存储 KV，构建轻量级、标准化的 HTTP API 变得简单。在本教程中，你将构建并部署一个基于 Deno KV 的小型链接缩短器，然后将其推送到 Deno Deploy 的生产环境。

我们将使用 [Deno KV](/deploy/kv/manual) 实现一个简单的链接缩短服务。现代的 Deno 运行时提供 `Deno.serve()`，可以零配置启动 HTTP 服务器。

## 创建本地 API 服务器

为你的项目创建一个新目录，并运行 `deno init` 创建一个基础的 Deno 项目。

将 `main.ts` 文件更新为以下代码：

```ts title="main.ts"
const kv = await Deno.openKv();

interface CreateLinkBody {
  slug: string;
  url: string;
}

function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9-_]{1,40}$/.test(slug);
}

export function handler(req: Request): Promise<Response> | Response {
  return (async () => {
    // 基础 CORS 支持（可选 - 不需要时可移除）
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
          "access-control-allow-headers": "content-type",
        },
      });
    }

    if (req.method === "POST") {
      let body: CreateLinkBody;
      try {
        body = await req.json();
      } catch {
        return json({ error: "无效的 JSON 请求体" }, { status: 400 });
      }

      const { slug, url } = body;
      if (!slug || !url) {
        return json({ error: "'slug' 和 'url' 是必填项" }, {
          status: 400,
        });
      }
      if (!isValidSlug(slug)) {
        return json({ error: "无效的 slug 格式" }, { status: 422 });
      }
      try {
        new URL(url);
      } catch {
        return json({ error: "'url' 必须是绝对 URL" }, {
          status: 422,
        });
      }

      // 使用原子操作防止覆盖已存在的 slug
      const key = ["links", slug];
      const txResult = await kv.atomic().check({ key, versionstamp: null }).set(
        key,
        url,
      ).commit();

      if (!txResult.ok) {
        return json({ error: "Slug 已存在" }, { status: 409 });
      }
      return json({ slug, url }, { status: 201 });
    }

    // 重定向短链 - 从路径名中提取 slug
    const slug = new URL(req.url).pathname.slice(1); // 去除开头的 '/'
    if (!slug) {
      return json({
        message: "请在路径中提供 slug，或者通过 POST 创建一个。",
      }, { status: 400 });
    }
    const result = await kv.get<[string] | string>(["links", slug]);
    const target = result.value as string | null;
    if (!target) {
      return json({ error: "未找到该 slug" }, { status: 404 });
    }
    return Response.redirect(target, 301);
  })();
}

export function startServer(port = 8000) {
  return Deno.serve({ port }, handler);
}

startServer();
```

## 本地运行和测试服务器

更新 `deno.json` 文件中的 `dev` 任务，授予网络权限并添加 `--unstable-kv` 标志，以允许本地使用 Deno KV：

```json title="deno.json"
{
  "tasks": {
    "dev": "deno run --unstable-kv -N main.ts"
  }
}
```

现在可以用以下命令运行服务器：

```sh
deno task dev
```

> 为了快速迭代，你也可以授予全部权限（`-A`），而不仅仅是网络权限（`-N`），但不建议在生产环境这样做。

### 测试你的 API 服务器

服务器将响应 HTTP `GET` 和 `POST` 请求。`POST` 处理器期望请求体中是包含 `slug` 和 `url` 属性的 JSON 文档。`slug` 是短链接组件，`url` 是你希望跳转到的完整 URL。

下面用 cURL 创建短链接的示例（期望返回 201 Created）：

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/","slug":"denodocs"}' \
  http://localhost:8000/
```

响应中，服务器返回描述存储链接的 JSON：

```json
{ "slug": "denodocs", "url": "https://docs.deno.com/" }
```

如果你重复执行上述 curl 创建相同 slug，将收到 409 Conflict：

```json
{ "error": "Slug 已存在" }
```

对服务器的 `GET` 请求使用 URL slug 作为路径参数，并重定向到对应的 URL。你可以在浏览器访问，也可以用 cURL 来测试效果：

```shell
curl -v http://localhost:8000/denodocs
```

## 部署你的 API 服务器

::: Deno Deploy 账号必需

你需要有一个 Deno Deploy 账号才能完成本节内容。如果还没有，[注册一个免费的 Deno Deploy 账号](https://console.deno.com/)。

:::

### 在 Deno Deploy 上预置 KV 数据库

首先，我们在 Deno Deploy 上为部署的应用“预置”一个 KV 数据库。

1. 访问 [Deno Deploy](https://console.deno.com/) 并点击“Databases”标签页。
2. 点击“+ Provision database”按钮。
3. 点击“Provision”按钮，创建免费的 KV 数据库。
4. 给数据库命名，选择地区，然后点击“Provision Database”。

### 部署你的服务器

使用以下命令部署服务器：

```sh
deno deploy
```

它会短暂跳转到浏览器进行 Deno Deploy 账号认证，认证完成后返回终端。

1. 选择组织（如果你有多个组织）。
2. 选择“创建新应用”。
3. 回到浏览器给新项目命名。
4. 点击“Create App”。
5. 应用创建成功后，点击左侧“Timelines”菜单项。
6. 点击 Databases 部分旁的“Manage”。
7. 找到之前创建的 KV 数据库，点击“Assign”。
8. 选择刚创建的应用。
9. 点击“Assignments”列中应用名返回应用页面。
10. 点击最近一次部署的链接（会失败，因为尚未分配 KV）。
11. 点击“Retry Build”按钮，重新部署应用并关联 KV 数据库。

构建成功后，在“Overview”标签页可以看到生产环境 URL，你现在可以用 curl 命令测试部署好的 API 了。

## 试用你刚刚的链接缩短器

无需额外配置（Deno KV 在 Deploy 环境下开箱即用），你的应用运行效果应当与本地完全相同。

你可以像以前一样使用 `POST` 添加新链接，只要把 `localhost` 部分替换为你部署的生产环境 URL：

```shell
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://docs.deno.com/runtime/","slug":"denodocs"}' \
  https://your-project.yourusername.deno.net/
```

同样，你可以在浏览器访问缩短的 URL，或者用 cURL 获取跳转响应：

```shell
curl -v https://your-project.yourusername.deno.net/denodocs
```

🦕 现在你知道如何用 Deno 创建一个基础 API，并将它部署到 Deno Deploy。既然你的 url 缩短器已经可以使用了，可以考虑为其制作一个前端，允许用户创建和管理自己的短链接。可以参考我们的（web 框架）[/frameworks](/examples/#web-frameworks-and-libraries) 页面，获取如何开始的灵感！