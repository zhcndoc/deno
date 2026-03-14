---
title: "使用 deno deploy 命令部署应用"
description: "使用 deno deploy CLI 命令创建并部署第一个应用到 Deno Deploy 早期访问的分步教程。"
url: /examples/deploy_command_tutorial/
---

`deno deploy` 命令为在 [Deno Deploy](https://deno.com/deploy) 上部署和管理应用提供了强大的 CLI 工具。

如果你已经有应用准备部署，可以跳转到[部署你的应用](#deploy-your-application)，或者继续阅读制作并部署一个简单应用。

## 前提条件

在使用 deploy 命令之前，你需要获得 Deno Deploy 的访问权限，并且需要一个 Deno Deploy 组织。

1. 访问
   [Deno Deploy 账号设置](https://dash.deno.com/account#early-access)
2. 开启“启用早期访问”开关
3. 在
   [Deno Deploy 控制台](https://console.deno.com/) 中创建一个 Deno Deploy 组织。

## 创建一个简单的 Web 应用

首先，我们来创建一个基本的 HTTP 服务器作为我们的应用。

新建一个项目目录并进入：

```bash
mkdir my-deploy-app
cd my-deploy-app
```

初始化一个新的 Deno 项目：

```bash
deno init
```

将 `main.ts` 的内容替换为一个简单的 HTTP 服务器：

```ts title="main.ts"
Deno.serve({ port: 8000 }, (req) => {
  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toISOString();

  // 记录每个请求
  console.log(
    `[${timestamp}] ${req.method} ${url.pathname} - User-Agent: ${userAgent}`,
  );

  // 简单路由
  if (url.pathname === "/") {
    console.log("Serving home page");
    return new Response(
      `
      <html>
        <head><title>My Deploy App</title></head>
        <body>
          <h1>欢迎使用 My Deploy App！</h1>
          <p>此应用使用 deno deploy 命令部署。</p>
          <nav>
            <a href="/about">关于</a> | 
            <a href="/api/status">API 状态</a> |
            <a href="/api/error">测试错误</a>
          </nav>
        </body>
      </html>
    `,
      {
        headers: { "content-type": "text/html" },
      },
    );
  }

  if (url.pathname === "/about") {
    console.log("Serving about page");
    return new Response(
      `
      <html>
        <head><title>关于 - My Deploy App</title></head>
        <body>
          <h1>关于此应用</h1>
          <p>这是一个使用 deno deploy CLI 部署的简单示例。</p>
          <p>查看日志以了解请求信息！</p>
          <a href="/">← 返回主页</a>
        </body>
      </html>
    `,
      {
        headers: { "content-type": "text/html" },
      },
    );
  }

  if (url.pathname === "/api/status") {
    const responseData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "API 正常运行",
      requestCount: Math.floor(Math.random() * 1000) + 1, // 模拟请求计数器
    };

    console.log("API 状态检查 - 全系统正常");
    console.log(`响应数据:`, responseData);

    return Response.json(responseData);
  }

  if (url.pathname === "/api/error") {
    // 此端点用于演示错误日志
    console.error("访问错误端点 - 演示错误日志");
    console.warn("这是将出现在日志中的警告信息");

    return Response.json({
      error: "这是用于演示的测试错误",
      timestamp: new Date().toISOString(),
      tip: "查看日志命令：deno deploy logs",
    }, { status: 500 });
  }

  // 其它路由返回 404
  console.warn(`404 - 未找到路由: ${url.pathname}`);
  return new Response("未找到", { status: 404 });
});
```

### 在本地测试应用

更新根目录下 `deno.json` 文件中的 `dev` 任务，允许网络访问：

```json
"dev": "deno run -N --watch main.ts"
```

然后运行 dev 命令：

```sh
deno run dev
```

访问 `http://localhost:8000` 查看运行中的应用。尝试访问不同路由（`/about`、`/api/status` 和 `/api/error`）以确认功能正常。你会看到每个请求都会被日志记录——这些日志在应用部署后也可以看到！

## 认证

`deno deploy` 命令自动处理认证。首次运行部署命令时会提示你进行认证。运行带有 `--help` 参数的部署命令查看所有可用选项：

```bash
deno deploy --help
```

:::note Deno Deploy 组织要求

`deno deploy` 命令需要一个 Deno Deploy 组织。如果你的账号还未设置组织，可以通过
[Deno Deploy Web 应用](https://console.deno.com) 创建一个。

:::

## 部署你的应用

现在让我们用 `deno deploy` 命令来部署应用！确保你在项目根目录，执行：

```bash
deno deploy
```

根据终端提示选择合适的选项。

部署过程将：

1. 打包你的应用代码为 tarball
2. 上传 tarball 到 Deno Deploy
3. 解包 tarball
4. 构建并部署到边缘网络
5. 返回一个可访问的在线 URL

你已经成功部署了应用！可以访问返回的 URL 查看应用效果。

如果需要修改应用，只需更新代码，然后再次运行 `deno deploy` 命令。

我们演示的应用内置了一些日志，可以通过 Deno Deploy 的日志功能监控应用。

## 监控你的应用

### 查看应用日志

部署后，可以实时获取日志流，了解应用具体情况：

```bash
deno deploy logs
```

访问你的应用 URL，浏览不同页面。你会看到类似的日志：

- 显示 HTTP 方法、路径和用户代理的请求日志
- 来自 `console.log()` 的信息日志
- 来自 `console.warn()` 的警告日志
- 来自 `console.error()` 的错误日志

在浏览器打开应用 URL，尝试访问 `/api/error` 端点，体验错误日志效果。

### 查看指定时间范围的日志

想查看特定时间范围的日志，可以使用 `--start` 和 `--end` 参数：

```bash
deno deploy logs \
  --start "2024-01-01T00:00:00Z" \
  --end "2024-01-01T23:59:59Z"
```

## 管理环境变量

你的应用可能需要环境变量进行配置。`deno deploy` 命令提供了完善的环境变量管理功能。

### 列出环境变量

查看应用的所有环境变量：

```bash
deno deploy env list
```

### 添加与更新环境变量

添加单个环境变量，使用 `deno deploy env add` 命令，例如：

```bash
deno deploy env add API_KEY "your-secret-key"
deno deploy env add DATABASE_URL "postgresql://..."
```

更新环境变量，使用 `deno deploy env update-value` 命令，例如：

```bash
deno deploy env update-value API_KEY "new-secret-key"
deno deploy env update-value DATABASE_URL "postgresql://new-user:new-pass@localhost/new-db"
```

### 删除环境变量

删除环境变量，使用 `deno deploy env delete` 命令，例如：

```bash
deno deploy env delete API_KEY
deno deploy env delete DATABASE_URL
```

### 从 .env 文件加载环境变量

你也可以使用 `.env` 文件将环境变量加载到部署的应用中：

```bash
deno deploy env load .env
```

🦕 你已成功使用 `deno deploy` 命令部署了第一个应用！更多命令和选项，请查阅 [`deno deploy` 文档](/runtime/reference/cli/deploy/)。

欲了解更多 Deno Deploy 相关信息，请参考 [Deno Deploy 文档](/deploy/)。
