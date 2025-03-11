---
title: "获取和流数据"
description: "A tutorial on working with network requests in Deno. Learn how to use the fetch API for HTTP requests, handle responses, implement data streaming, and manage file uploads and downloads."
url: /examples/fetch_data_tutorial/
oldUrl:
  - /runtime/manual/examples/fetch_data/
  - /runtime/tutorials/fetch_data/
---

Deno 将几个熟悉的 Web API 引入到服务器环境中。如果您曾经使用过浏览器，您可能会认识 [`fetch()`](/api/web/fetch) 方法和 [`streams`](/api/web/streams) API，它们用于进行网络请求和访问网络上的数据流。Deno 实现了这些 API，使您能够从网络中获取和流式传输数据。

## 获取数据

在构建 Web 应用程序时，开发人员通常需要从 Web 的其他地方检索资源。我们可以使用 `fetch` API 来实现。我们将看看如何从 URL 获取不同形状的数据，以及如果请求失败时如何处理错误。

创建一个名为 `fetch.js` 的新文件，并添加以下代码：

```ts title="fetch.js"
// 输出：JSON 数据
const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();

console.log(jsonData, "\n");

// 输出：HTML 数据
const textResponse = await fetch("https://deno.land/");
const textData = await textResponse.text();

console.log(textData, "\n");

// 输出：错误信息
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
}
```

您可以使用 `deno run` 命令运行此代码。因为它正在跨网络获取数据，您需要授予 `--allow-net` 权限：

```sh
deno run --allow-net fetch.js
```

您应该在控制台看到 JSON 数据、作为文本的 HTML 数据以及一条错误信息。

## 流式传输数据

有时您可能希望通过网络发送或接收大文件。当您不知道文件的大小时，流式传输是处理数据的更有效方法。客户端可以从流中读取数据，直到它说它完成。

Deno 提供了一种使用 `Streams API` 进行数据流式传输的方法。我们将看看如何将文件转换为可读或可写的流，以及如何使用流来发送和接收文件。

创建一个名为 `stream.js` 的新文件。

我们将使用 `fetch` API 来检索一个文件。然后我们将使用 [`Deno.open`](/api/deno/Deno.open) 方法来创建和打开一个可写文件，并使用 Streams API 的 [`pipeTo`](/api/web/~/ReadableStream.pipeTo) 方法将字节流发送到创建的文件。

接下来，我们将使用 `POST` 请求上的 `readable` 属性将文件的字节流发送到服务器。

```ts title="stream.js"
// 接收文件
const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
  const file = await Deno.open("./logo.svg", { write: true, create: true });

  await fileResponse.body.pipeTo(file.writable);
}

// 发送文件
const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com/", {
  method: "POST",
  body: file.readable,
});
```

您可以使用 `deno run` 命令运行此代码。因为它正在从网络获取数据并写入文件，所以您需要授予 `--allow-net`、`--allow-write` 和 `--allow-read` 权限：

```sh
deno run --allow-read --allow-write --allow-net stream.js
```

您应该会看到文件 `logo.svg` 在当前目录中创建并填充，而如果您拥有 example.com，您会看到文件被发送到服务器。

🦕 现在您知道如何在网络上获取和流式传输数据，以及如何将数据流式传输到文件和从文件中流式传输数据！无论您是提供静态文件、处理上传、生成动态内容还是流式传输大型数据集，Deno 的文件处理和流式传输能力都是您开发工具箱中的绝佳工具！