---
title: "HTTP 请求"
oldUrl:
  - /deploy/docs/runtime-request/
---

[请求](https://developer.mozilla.org/en-US/docs/Web/API/Request)接口是 Fetch API 的一部分，表示 fetch() 的请求。

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

| 名称                         | 类型                                                                                    | 默认值          | 描述                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------- |
| [`method`][method]           | `string`                                                                                | `GET`          | 请求的方法。                                              |
| [`headers`][headers]         | `Headers` 或 `{ [key: string]: string }`                                                | 无             | 请求的头部。                                              |
| [`body`][body]               | `Blob`、`BufferSource`、`FormData`、`URLSearchParams`、`USVString` 或 `ReadableStream` | 无             | 请求的主体。                                              |
| [`cache`][cache]             | `string`                                                                                | 无             | 请求的缓存模式。                                          |
| [`credentials`][credentials] | `string`                                                                                | `same-origin`  | 请求的凭据模式。                                          |
| [`integrity`][integrity]     | `string`                                                                                | 无             | 请求主体的加密哈希。                                      |
| [`mode`][mode]               | `string`                                                                                | `cors`         | 您想使用的请求模式。                                      |
| [`redirect`][redirect]       | `string`                                                                                | `follow`       | 处理重定向的模式。                                        |
| [`referrer`][referrer]       | `string`                                                                                | `about:client` | 一个 `USVString`，指定 `no-referrer`、`client` 或一个 URL。 |

## 属性

| 名称                               | 类型                                       | 描述                                                                                                                        |
| ---------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [`cache`][cache]                   | `string`                                   | 缓存模式指示浏览器如何缓存请求（`default`、`no-cache` 等）。                                                              |
| [`credentials`][credentials]       | `string`                                   | 凭据（`omit`、`same-origin` 等）指示用户代理是否在请求的 CORs 情况下发送 cookies。                                         |
| [`destination`][destination]       | [`RequestDestination`][requestdestination] | 字符串指示所请求内容的类型。                                                                                                |
| [`body`][body]                     | [`ReadableStream`][readablestream]         | getter 提供请求主体内容的 `ReadableStream`。                                                                                |
| [`bodyUsed`][bodyused]             | `boolean`                                  | 指示主体内容是否已被读取。                                                                                                  |
| [`url`][url]                       | `USVString`                                | 请求的 URL。                                                                                                                |
| [`headers`][headers]               | [`Headers`](runtime-headers)               | 与请求相关联的头部。                                                                                                        |
| [`integrity`][integrity]           | `string`                                   | 请求主体的加密哈希。                                                                                                        |
| [`method`][method]                 | `string`                                   | 请求的方法（`POST`、`GET` 等）。                                                                                             |
| [`mode`][mode]                     | `string`                                   | 指示请求的模式（例如 `cors`）。                                                                                            |
| [`redirect`][redirect]             | `string`                                   | 处理重定向的模式。                                                                                                          |
| [`referrer`][referrer]             | `string`                                   | 请求的引荐来源。                                                                                                            |
| [`referrerPolicy`][referrerpolicy] | `string`                                   | 请求的引荐政策。                                                                                                            |

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
      message: "Hello world!",
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
[destination]: https://developer.mozilla.org/en-us/docs/web/api/request/destination
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