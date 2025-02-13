---
title: "编写一个文件服务器"
url: /examples/file_server_tutorial/
oldUrl:
  - /runtime/manual/examples/file_server/
  - /runtime/tutorials/file_server/
---

一个文件服务器监听传入的HTTP请求，并从本地文件系统提供文件。这个教程演示了如何使用Deno内置的 [文件系统API](/api/deno/file-system) 创建一个简单的文件服务器。

## 编写一个简单的文件服务器

首先，创建一个新的文件，命名为 `file-server.ts`。

我们将使用Deno内置的 [HTTP服务器](/api/deno/~/Deno.serve) 来监听传入的请求。在你的新 `file-server.ts` 文件中，添加以下代码：

```ts title="file-server.ts"
Deno.serve(
  { hostname: "localhost", port: 8080 },
  (request) => {
    const url = new URL(request.url);
    const filepath = decodeURIComponent(url.pathname);
  },
);
```

> 如果你不熟悉 `URL` 对象，可以在 [URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL) 文档中了解更多。 
> [decodeURIComponent函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) 用于解码URL编码的路径，以防字符被百分号编码。

### 打开文件并流式传输其内容

当接收到请求时，我们将尝试使用 [`Deno.open`](/api/deno/~/Deno.open) 打开请求URL中指定的文件。

如果请求的文件存在，我们将其转换为可读的数据流，使用 [ReadableStream API](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)，并将其内容流式传输到响应中。我们不知道请求的文件有多大，因此流式传输可以在服务大型文件或同时处理多个请求时防止内存问题。

如果文件不存在，我们将返回 "404 Not Found" 响应。

在请求处理程序的主体中，在这两个变量的下面，添加以下代码：

```ts
try {
  const file = await Deno.open("." + filepath, { read: true });
  return new Response(file.readable);
} catch {
  return new Response("404 Not Found", { status: 404 });
}
```

### 运行文件服务器

使用 `deno run` 命令运行你的新文件服务器，允许读取访问和网络访问：

```shell
deno run --allow-read=. --allow-net file-server.ts
```

## 使用Deno标准库提供的文件服务器

从头编写文件服务器是理解Deno的HTTP服务器如何工作的一个很好的练习。然而，从零开始编写生产级文件服务器可能会很复杂且容易出错。使用经过测试和可靠的解决方案更好。

Deno标准库为你提供了一个 [文件服务器](https://jsr.io/@std/http/doc/file-server/~)，这样你就不必自己编写。

要使用它，首先将远程脚本安装到本地文件系统：

```shell
# Deno 1.x
deno install --allow-net --allow-read jsr:@std/http/file-server
# Deno 2.x
deno install --global --allow-net --allow-read jsr:@std/http/file-server
```

> 这将把脚本安装到Deno安装根目录中，例如 `/home/user/.deno/bin/file-server`。

你现在可以使用简化的脚本名称运行该脚本：

```shell
$ file-server .
Listening on:
- Local: http://0.0.0.0:8000
```

要查看文件服务器可用的完整选项列表，请运行 `file-server --help`。

如果你在网页浏览器中访问 [http://0.0.0.0:8000/](http://0.0.0.0:8000/)，你将看到本地目录的内容。

### 在Deno项目中使用 @std/http 文件服务器

要在 [Deno项目](/runtime/getting_started/first_project) 中使用文件服务器，你可以在 `deno.json` 文件中添加它：

```sh
deno add jsr:@std/http
```

然后在你的项目中导入它：

```ts title="file-server.ts"
import { serveDir } from "@std/http/file-server";

Deno.serve((req) => {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "path/to/static/files/dir",
    });
  }
  return new Response();
});
```

这段代码将使用 `Deno.serve` 设置一个HTTP服务器。当请求到来时，它会检查请求的路径是否以 “/static” 开头。如果是，则从指定目录服务文件。否则，它会返回一个空响应。

🦕 现在你知道如何编写自己的简单文件服务器，以及如何使用Deno标准库提供的文件服务器工具。你可以处理各种任务 - 无论是服务静态文件、处理上传、转换数据还是管理访问控制 - 你都准备好使用Deno服务文件了。