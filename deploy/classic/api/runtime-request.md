---
last_modified: 2026-06-20
title: "HTTP 请求"
oldUrl:
  - /deploy/docs/runtime-request/
  - /deploy/api/runtime-request/
---

:::warning 2026年7月20日停止服务

Deno Deploy Classic 将于 2026年7月20日关闭。我们建议迁移
到新的 <a href="/deploy/">Deno Deploy</a> 平台。详情请参见
<a href="/deploy/migration_guide/">迁移指南</a>。

:::

[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 接口是 Fetch API 的一部分，表示 fetch() 的请求。

- [构造函数](#constructor)
  - [参数](#parameters)
- [属性](#properties)
- [方法](#methods)
- [示例](#example)

## 构造函数

Request() 构造函数创建一个新的 Request 实例。

```ts
let request = new Request(resource, init);
```

#### 参数

| 名称     | 类型                          | 可选     | 描述                                                                     |
| -------- | ----------------------------- | -------- | ----------------------------------------------------------------------- |
| resource | `Request` 或 `USVString`      | `false`  | 资源可以是请求对象或 URL 字符串。                                        |
| init     | [`RequestInit`](#requestinit) | `true`   | init 对象允许您设置应用于请求的可选参数。                                  |

返回类型是一个 `Request` 实例。

##### `RequestInit`

| name                         | type                                                                                    | default        | description                                                |
| ---------------------------- | --------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------- |
| [`method`][method]           | `string`                                                                                | `GET`          | 请求的方法。                                                |
| [`headers`][headers]         | `Headers` 或 `{ [key: string]: string }`                                                | 无             | 请求的头信息。                                              |
| [`body`][body]               | `Blob`、`BufferSource`、`FormData`、`URLSearchParams`、`USVString` 或 `ReadableStream` | 无             | 请求的主体。                                                |
| [`cache`][cache]             | `string`                                                                                | 无             | 请求的缓存模式。                                            |
| [`credentials`][credentials] | `string`                                                                                | `same-origin`  | 请求的凭据模式。                                            |
| [`integrity`][integrity]     | `string`                                                                                | 无             | 请求主体的加密哈希。                                        |
| [`mode`][mode]               | `string`                                                                                | `cors`         | 您要使用的请求模式。                                        |
| [`redirect`][redirect]       | `string`                                                                                | `follow`       | 处理重定向的方式。                                          |
| [`referrer`][referrer]       | `string`                                                                                | `about:client` | 指定 `no-referrer`、`client` 或 URL 的 `USVString`。        |

## 属性

| 名称                               | 类型                                       | 描述                                                                                                                        |
| ---------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [`cache`][cache]                   | `string`                                   | 缓存模式指示浏览器应如何缓存该请求（`default`、`no-cache` 等）。                                                              |
| [`credentials`][credentials]       | `string`                                   | 凭据（`omit`、`same-origin` 等）指示在请求发生 CORS 时，用户代理是否应发送 cookie。                                          |
| [`destination`][destination]       | [`RequestDestination`][requestdestination] | 该字符串指示所请求内容的类型。                                                                                               |
| [`body`][body]                     | [`ReadableStream`][readablestream]         | 该 getter 暴露了请求体内容的 `ReadableStream`。                                                                               |
| [`bodyUsed`][bodyused]             | `boolean`                                  | 指示请求体内容是否已被读取。                                                                                                 |
| [`url`][url]                       | `USVString`                                | 请求的 URL。                                                                                                                 |
| [`headers`][headers]               | [`Headers`](runtime-headers)               | 与该请求关联的标头。                                                                                                         |
| [`integrity`][integrity]           | `string`                                   | 请求体的加密哈希值。                                                                                                         |
| [`method`][method]                 | `string`                                   | 请求的方法（`POST`、`GET` 等）。                                                                                             |
| [`mode`][mode]                     | `string`                                   | 指示请求的模式（例如 `cors`）。                                                                                              |
| [`redirect`][redirect]             | `string`                                   | 指示如何处理重定向的模式。                                                                                                   |
| [`referrer`][referrer]             | `string`                                   | 请求的 referrer。                                                                                                            |
| [`referrerPolicy`][referrerpolicy] | `string`                                   | 请求的 referrer policy。                                                                                                     |

上述所有属性都是只读的。

## 方法

| 名称                           | 描述                                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| [`arrayBuffer()`][arraybuffer] | 读取主体流直到完成并返回一个 `ArrayBuffer` 对象。                                        |
| [`blob()`][blob]               | 读取主体流直到完成并返回一个 `Blob` 对象。                                              |
| [`formData()`][formdata]       | 读取主体流直到完成并返回一个 `FormData` 对象。                                          |
| [`json()`][json]               | 读取主体流直到完成，将其解析为 JSON 并返回一个 JavaScript 对象。                       |
| [`text()`][text]               | 读取主体流直到完成并返回一个 USVString 对象（文本）。                                   |
| [`clone()`][clone]             | 克隆请求对象。                                                                          |

## 示例

```ts
function handler(_req) {
  // 创建一个 POST 请求
  const request = new Request("https://post.deno.dev", {
    method: "POST",
    body: JSON.stringify({
      message: "你好，世界！",
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  console.log(request.method); // POST
  console.log(request.headers.get("content-type")); // application/json

  return fetch(request);
}

Deno.serve(handler);
```

[cache]: https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
[credentials]: https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
[destination]: https://developer.mozilla.org/en-US/docs/web/api/request/destination
[requestdestination]: https://developer.mozilla.org/en-US/docs/Web/API/RequestDestination
[body]: https://developer.mozilla.org/en-US/docs/Web/API/Body/body
[bodyused]: https://developer.mozilla.org/en-US/docs/Web/API/Body/bodyUsed
[url]: https://developer.mozilla.org/en-US/docs/Web/API/Request/url
[headers]: https://developer.mozilla.org/en-US/docs/Web/API/Request/headers
[method]: https://developer.mozilla.org/en-US/docs/Web/API/Request/method
[integrity]: https://developer.mozilla.org/en-US/docs/Web/API/Request/integrity
[mode]: https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
[redirect]: https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect
[referrer]: https://developer.mozilla.org/en-US/docs/Web/API/Request/referrer
[referrerpolicy]: https://developer.mozilla.org/en-US/docs/Web/API/Request/referrerpolicy
[readablestream]: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
[arraybuffer]: https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer
[blob]: https://developer.mozilla.org/en-US/docs/Web/API/Body/blob
[json]: https://developer.mozilla.org/en-US/docs/Web/API/Body/json
[text]: https://developer.mozilla.org/en-US/docs/Web/API/Body/text
[formdata]: https://developer.mozilla.org/en-US/docs/Web/API/Body/formdata
[clone]: https://developer.mozilla.org/en-US/docs/Web/API/Request/clone