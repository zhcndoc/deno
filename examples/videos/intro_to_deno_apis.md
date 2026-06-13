---
title: "Deno API 简介"
description: "探索 Deno 内置的 API，用于文件系统操作、命令行参数、环境变量以及提供 HTTP 请求服务。"
url: /examples/intro_to_deno_apis/
videoUrl: https://www.youtube.com/watch?v=p28ujFMrdA0&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=7
layout: video.tsx
---

## 视频描述

在本视频中，我们将探索 Deno 在全局命名空间中提供的强大 API。我们演示了使用 Deno 内置方法进行文件系统操作，例如创建、读取、写入以及向文件追加内容。然后，介绍如何处理命令行参数、环境变量，并搭建一个基础服务器。有了这些 Deno 内置 API，我们可以减少对外部 API 的需求。

## 文本记录与示例

在全局命名空间中，Deno 提供了大量你可以利用的 API。让我们看几个示例。

### 创建并向文件写入内容

为了写入一个文件，我们首先会 `await Deno.open`，并传入我们想要创建的文件名。第二个参数将是一个对象，我们会把 `read`、`write` 和 `create` 都设置为 `true`：

```ts title="main.ts"
await Deno.open("thoughts.txt", {
  read: true,
  write: true,
  create: true,
});
```

要运行这个，我们将使用：

```sh
deno main.ts
```

运行时，控制台会提示我们允许读取权限，所以我们会选择允许（或
`y`）。然后它会请求写入权限，这也很不错（我们也会用 `y`
允许它），这样我们就同时授予了两种权限，现在我们已经创建了一个
名为 `thoughts.txt` 的文件。

如果我们想向这个文件写入一些数据，可以对 `main.ts` 文件做一些调整。让我们为文件创建一个变量（称为 file），然后在传给 `Deno.open` 方法的对象中添加 `append:true`
（我想我们也可以去掉 create，因为文件已经被创建了）：

```ts title="main.ts"
const file = await Deno.open("thoughts.txt", {
  read: true,
  write: true,
  append: true,
});
```

接下来，在下面我们会创建一个名为 `encoder` 的常量，并让它等于一个新的文本编码器。然后我们会创建第二个名为 `data` 的常量，它将调用 `encode`。最后我们会给 `data` 添加一个带有换行符和一些文本的字符串：

```ts title="main.ts"
const encoder = new TextEncoder();
const data = encoder.encode("\nI think basil is underrated.");
```

然后我们会 `await file.Write(data)`，这会把这些数据写入 thoughts 文件，最后我们会关闭文件。

```ts title=main.ts"
await file.write(data);
file.close();
```

这次我们将使用所需权限来运行文件：

```sh
deno --allow-read --allow-write main.ts
```

如果我们回头看看 `thoughts.txt` 文件，它会显示 "I think basil is
underrated"。文本已经被追加到我们的文件中了。

### 读取并追加到文件

还有一些其他选项，所以让我们回到文件顶部。这次不使用 `Deno.open`，而是使用 `Deno.readFile`。这意味着我们可以移除第二个参数对象，因为这里我们已经非常明确地知道自己要做什么了。然后我们会把文件输出到控制台。

```ts title="main.ts"
const file = await Deno.readFile("thoughts.txt");
console.log(file);
```

如果我们使用以下命令运行：

```sh
deno --allow-read main.ts
```

编码后的文件会被记录到控制台，这并不是我想要的。我实际上想要人类可读的文本。所以我在这里可以使用 `Deno.readTextFile` 而不是 `Deno.readFile`，这样就会把文件中的文本直接输出到控制台。

我们也可以使用 `Deno.writeTextFile` 向文件写入内容。例如：

```ts title="main.ts"
await Deno.writeTextFile(
  "thoughts.txt",
  "Fall is a great season",
);
```

如果我们使用 `deno --allow-write main.ts` 运行，它会用关于秋天的字符串覆盖 `thoughts.txt` 文件中的内容。

我们可以把那段代码更新为使用 `append: true`：

```ts title="main.ts"
await Deno.writeTextFile(
  "thoughts.txt",
  "\nWinter is the most fun season!",
  { append: true },
);
```

如果我们再次运行它，使用 `deno --allow-write main.ts`，它就会把第二个句子追加到文件末尾。

### 探索命令行参数

我们也可以探索命令行参数，所以我们可以这样写：

```ts title="main.ts"
const name = Deno.args[0];
console.log(name);
```

我们可以使用平常的 deno 命令来运行它，不过这次要传入一个命令行参数，就比如 `Eve`：

```sh
deno main.ts Eve
```

名字 `Eve` 将会被输出到控制台。

如果我们想更进一步，可以更新输出的模板字符串来传递一条消息：

```ts title="main.ts"
const name = Deno.args[0];
console.log(`How are you today, ${name}?`);
```

## 使用环境变量

在 Deno 全局对象上，我们还有环境变量。让我们创建一个名为 `home` 的变量，并把我们的 home 目录输出到控制台：

```ts title="main.ts"
const home = Deno.env.get("HOME");
console.log(`Home directory: ${home}`);
```

当使用 `deno main.ts` 运行时，Deno 会请求环境访问权限，我们可以用 `y` 允许它。或者我们也可以使用 `--allow-env` 标志来运行命令，这样我们的 home 目录就会被输出到控制台。

### 搭建一个简单的 HTTP 服务器

最后，让我们看看我们可靠的 `server` 构造器。我们可以创建一个返回响应的处理函数，然后把这个处理函数传给 `Deno.serve` 方法。

```ts title="main.ts"
function handler(): Response {
  return new Response("It's happening!");
}

Deno.serve(handler);
```

当使用以下命令运行时

```sh
deno --allow-net main.ts
```

我们会看到有一个服务器正在运行并监听 8000 端口。我们可以在浏览器中访问 `localhost:8000`，应该会看到文本 "It's happening!"。

所以，这些 API 还有很多，你都可以加以利用。不过，知道我们并不需要为所有事情都包含一个外部库是很不错的；在处理错误、管理服务器以及使用文件系统时，Deno 已经为我们准备好了。
