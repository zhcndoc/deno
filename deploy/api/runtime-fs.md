---
title: "文件系统 API"
oldUrl:
  - /deploy/docs/runtime-fs/
  - /deploy/manual/runtime-fs/
---

Deno Deploy 支持 Deno 中可用的有限文件系统 API 集。这些文件系统 API 可以访问您部署中的静态文件。静态文件例如：

- 如果您通过 GitHub 集成进行部署，则为您的 GitHub 存储库中的文件。
- 在 playground 部署中的入口文件。

可用的 API 有：

- [Deno.cwd](#deno.cwd)
- [Deno.readDir](#deno.readdir)
- [Deno.readFile](#deno.readfile)
- [Deno.readTextFile](#deno.readtextfile)
- [Deno.open](#deno.open)
- [Deno.stat](#deno.stat)
- [Deno.lstat](#deno.lstat)
- [Deno.realPath](#deno.realpath)
- [Deno.readLink](#deno.readlink)

## Deno.cwd

`Deno.cwd()` 返回您部署的当前工作目录。它位于您部署根目录的根部。例如，如果您通过 GitHub 集成进行部署，则当前工作目录是您 GitHub 存储库的根部。

## Deno.readDir

`Deno.readDir()` 允许您列出目录的内容。

该函数与 [Deno](https://docs.deno.com/api/deno/~/Deno.readDir) 完全兼容。

```ts
function Deno.readDir(path: string | URL): AsyncIterable<DirEntry>
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

### 示例

此示例列出目录的内容，并将此列表作为 JSON 对象返回到响应正文中。

```js
async function handler(_req) {
  // 列出位于存储库根目录中的 `blog` 目录中的文章。
  const posts = [];
  for await (const post of Deno.readDir(`./blog`)) {
    posts.push(post);
  }

  // 返回 JSON。
  return new Response(JSON.stringify(posts, null, 2), {
    headers: {
      "content-type": "application/json",
    },
  });
}

Deno.serve(handler);
```

## Deno.readFile

`Deno.readFile()` 允许您将文件完全读入内存。

该函数的定义与 [Deno](https://docs.deno.com/api/deno/~/Deno.readFile) 类似，但目前不支持 [`ReadFileOptions`](https://docs.deno.com/api/deno/~/Deno.ReadFileOptions)。未来将添加支持。

```ts
function Deno.readFile(path: string | URL): Promise<Uint8Array>
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

### 示例

此示例将文件内容读入内存作为字节数组，然后将其作为响应正文返回。

```js
async function handler(_req) {
  // 让我们读取位于存储库根目录中的 README.md 文件，以探索可用的方法。

  // 相对路径是相对于存储库的根部
  const readmeRelative = await Deno.readFile("./README.md");
  // 绝对路径。
  // 存储库的内容可以在 Deno.cwd() 下获得。
  const readmeAbsolute = await Deno.readFile(`${Deno.cwd()}/README.md`);
  // 文件 URL 也受到支持。
  const readmeFileUrl = await Deno.readFile(
    new URL(`file://${Deno.cwd()}/README.md`),
  );

  // 将 Uint8Array 解码为字符串。
  const readme = new TextDecoder().decode(readmeRelative);
  return new Response(readme);
}

Deno.serve(handler);
```

> 注意：要使用此功能，您必须将 GitHub 存储库链接到您的项目。

Deno Deploy 支持 `Deno.readFile` API 从文件系统中读取静态资源。这对于提供图像、样式表和 JavaScript 文件等静态资源非常有用。本指南演示了如何使用此功能。

假设在 GitHub 存储库中有以下文件结构：

```console
├── mod.ts
└── style.css
```

`mod.ts` 的内容：

```ts
async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  // 服务器的工作方式：
  // 1. 针对特定资产的请求到达。
  // 2. 我们从文件系统中读取该资产。
  // 3. 我们将资产发送回客户端。

  // 检查请求是否是针对 style.css。
  if (pathname.startsWith("/style.css")) {
    // 从文件系统中读取 style.css 文件。
    const file = await Deno.readFile("./style.css");
    // 用 style.css 文件响应请求。
    return new Response(file, {
      headers: {
        "content-type": "text/css",
      },
    });
  }

  return new Response(
    `<html>
      <head>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <h1>示例</h1>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

Deno.serve(handleRequest);
```

提供给 [`Deno.readFile`](https://docs.deno.com/api/deno/~/Deno.readFile) API 的路径是相对于存储库的根部。您也可以指定绝对路径，前提是它们位于 `Deno.cwd` 内部。

## Deno.readTextFile

此函数类似于 [Deno.readFile](#Deno.readFile)，不同之处在于它将文件内容解码为 UTF-8 字符串。

```ts
function Deno.readTextFile(path: string | URL): Promise<string>
```

### 示例

此示例将文本文件读入内存，并将内容作为响应正文返回。

```js
async function handler(_req) {
  const readme = await Deno.readTextFile("./README.md");
  return new Response(readme);
}

Deno.serve(handler);
```

## Deno.open

`Deno.open()` 允许您打开一个文件，返回一个文件句柄。该文件句柄随后可用于读取文件的内容。有关文件句柄上可用方法的信息，请参见 [`Deno.File`](#deno.file)。

该函数的定义与 [Deno](https://docs.deno.com/api/deno/~/Deno.open) 类似，但目前不支持 [`OpenOptions`](https://docs.deno.com/api/deno/~/Deno.OpenOptions)。未来将添加支持。

```ts
function Deno.open(path: string | URL): Promise<Deno.File>
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

### 示例

此示例打开一个文件，并将内容作为响应主体进行流式传输。

```js
async function handler(_req) {
  // 打开位于存储库根部的 README.md 文件。
  const file = await Deno.open("./README.md");

  // 使用 `readable` 属性，这是一个 `ReadableStream`。这将在响应完成发送时自动关闭文件句柄。
  return new Response(file.readable);
}

Deno.serve(handler);
```

:::note

当您按如下所示迭代文件流时，文件描述符将在迭代结束时自动关闭。无需手动关闭文件描述符：`const iterator = fd.readable[Symbol.asyncIterator]();`

:::

## Deno.File

`Deno.File` 是通过 [`Deno.open()`](#deno.open) 返回的文件句柄。它可以用于使用 `read()` 方法读取文件的块。可以使用 `close()` 方法关闭文件句柄。

该接口与 [Deno](https://docs.deno.com/api/deno/~/Deno.File) 类似，但不支持写入文件或寻址。对后者的支持将在未来添加。

```ts
class File {
  readonly rid: number;

  close(): void;
  read(p: Uint8Array): Promise<number | null>;
}
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

## Deno.File#read()

read 方法用于读取文件的一块。它应传递一个缓冲区以读取数据。它返回读取的字节数或 `null`（如果已到达文件末尾）。

```ts
function read(p: Uint8Array): Promise<number | null>;
```

### Deno.File#close()

close 方法用于关闭文件句柄。关闭句柄将中断所有正在进行的读取。

```ts
function close(): void;
```

## Deno.stat

`Deno.stat()` 读取文件系统条目的元数据。它返回一个 [`Deno.FileInfo`](#fileinfo) 对象。符号链接会被跟随。

该函数的定义与 [Deno](https://docs.deno.com/api/deno/~/Deno.stat) 相同。它不返回修改时间、访问时间或创建时间值。

```ts
function Deno.stat(path: string | URL): Promise<Deno.FileInfo>
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

### 示例

此示例获取文件的大小，并将结果作为响应主体返回。

```js
async function handler(_req) {
  // 获取位于存储库根部的 README.md 的文件信息。
  const info = await Deno.stat("./README.md");

  // 获取文件的字节大小。
  const size = info.size;

  return new Response(`README.md 的大小为 ${size} 字节`);
}

Deno.serve(handler);
```

## Deno.lstat

`Deno.lstat()` 类似于 `Deno.stat()`，但它不跟随符号链接。

该函数的定义与 [Deno](https://docs.deno.com/api/deno/~/Deno.lstat) 相同。它不返回修改时间、访问时间或创建时间值。

```ts
function Deno.lstat(path: string | URL): Promise<Deno.FileInfo>
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

## Deno.FileInfo

`Deno.FileInfo` 接口用于表示文件系统条目的元数据。它是由 [`Deno.stat()`](#deno.stat) 和 [`Deno.lstat()`](#deno.lstat) 函数返回的。它可以表示文件、目录或符号链接。

在 Deno Deploy 中，仅有文件类型和大小属性可用。大小属性的行为与 Linux 上相同。

```ts
interface FileInfo {
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  size: number;
}
```

## Deno.realPath

`Deno.realPath()` 返回解析后的绝对路径，经过符号链接的跟随。

该函数的定义与 [Deno](https://docs.deno.com/api/deno/~/Deno.realPath) 相同。

```ts
function Deno.realPath(path: string | URL): Promise<string>
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

### 示例

此示例调用 `Deno.realPath()` 获取存储库根部文件的绝对路径。结果作为响应正文返回。

```js
async function handler(_req) {
  const path = await Deno.realPath("./README.md");

  return new Response(`./README.md 的完全解析路径为 ${path}`);
}

Deno.serve(handler);
```

## Deno.readLink

`Deno.readLink()` 返回符号链接的目标路径。

该函数的定义与 [Deno](https://docs.deno.com/api/deno/~/Deno.readLink) 相同。

```ts
function Deno.readLink(path: string | URL): Promise<string>
```

路径可以是相对路径或绝对路径。它也可以是 `file:` URL。

### 示例

此示例调用 `Deno.readLink()` 获取存储库根部文件的绝对路径。结果作为响应正文返回。

```js
async function handler(_req) {
  const path = await Deno.readLink("./my_symlink");

  return new Response(`./my_symlink 的目标路径为 ${path}`);
}

Deno.serve(handler);
```