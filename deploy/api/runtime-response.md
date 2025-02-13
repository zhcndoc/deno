---
title: "HTTP 响应"
oldUrl:
  - /deploy/docs/response/
---

[响应](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)
接口是 Fetch API 的一部分，表示 fetch() 的响应资源。

- [构造函数](#构造函数)
  - [参数](#参数)
- [属性](#属性)
- [方法](#方法)
- [示例](#示例)

## 构造函数

Response() 构造函数创建一个新的 Response 实例。

```ts
let response = new Response(body, init);
```

#### 参数

| 名称 | 类型                                                                                    | 可选 | 描述                                                                   |
| ---- | --------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------- |
| body | `Blob`，`BufferSource`，`FormData`，`ReadableStream`，`URLSearchParams` 或 `USVString` | `true` | 响应的主体。默认值为 `null`。                                           |
| init | `ResponseInit`                                                                          | `true` | 可选对象，允许设置响应的状态和头部信息。                             |

返回类型为一个 `Response` 实例。

##### `ResponseInit`

| 名称         | 类型                                                  | 可选 | 描述                                                      |
| ------------ | ----------------------------------------------------- | ---- | --------------------------------------------------------- |
| `status`     | `number`                                              | `true` | 响应的状态码。                                         |
| `statusText` | `string`                                              | `true` | 表示状态码的状态信息。                                    |
| `headers`    | `Headers` 或 `string[][]` 或 `Record<string, string>` | `false` | 响应的 HTTP 头信息。                                     |

## 属性

| 名称                       | 类型             | 只读 | 描述                                                        |
| -------------------------- | ---------------- | ---- | ----------------------------------------------------------- |
| [`body`][body]             | `ReadableStream` | `true` | getter 返回主体内容的 `ReadableStream`。                  |
| [`bodyUsed`][bodyused]     | `boolean`        | `true` | 表示主体内容是否已被读取。                                  |
| [`url`][url]               | `USVString`      | `true` | 响应的 URL。                                               |
| [`headers`][headers]       | `Headers`        | `true` | 与响应相关的头部信息。                                     |
| [`ok`][ok]                 | `boolean`        | `true` | 表示响应是否成功（状态码在 200-299 之间）。                |
| [`redirected`][redirected] | `boolean`        | `true` | 表示响应是否是重定向的结果。                                |
| [`status`][status]         | `number`         | `true` | 响应的状态码。                                            |
| [`statusText`][statustext] | `string`         | `true` | 响应的状态信息。                                          |
| [`type`][type]             | `string`         | `true` | 响应的类型。                                              |

## 方法

| 名称                                                 | 描述                                                                                    |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`arrayBuffer()`][arraybuffer]                       | 读取主体流直到完成并返回一个 `ArrayBuffer` 对象。                                       |
| [`blob()`][blob]                                     | 读取主体流直到完成并返回一个 `Blob` 对象。                                             |
| [`formData()`][formdata]                             | 读取主体流直到完成并返回一个 `FormData` 对象。                                         |
| [`json()`][json]                                     | 读取主体流直到完成，将其解析为 JSON 并返回一个 JavaScript 对象。                       |
| [`text()`][text]                                     | 读取主体流直到完成并返回一个 USVString 对象（文本）。                                  |
| [`clone()`][clone]                                   | 克隆响应对象。                                                                         |
| [`error()`][error]                                   | 返回一个与网络错误相关的新响应对象。                                                  |
| [`redirect(url: string, status?: number)`][redirect] | 创建一个新的响应，重定向到提供的 URL。                                               |

## 示例

```ts
function handler(_req) {
  // 创建一个以 HTML 为主体的响应。
  const response = new Response("<html> Hello </html>", {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });

  console.log(response.status); // 200
  console.log(response.headers.get("content-type")); // text/html

  return response;
}

Deno.serve(handler);
```

[clone]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/clone
[error]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/error
[redirect]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/redirect
[body]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/body
[bodyused]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/bodyUsed
[url]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/url
[headers]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/headers
[ok]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/ok
[redirected]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/redirected
[status]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/status
[statustext]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/statusText
[type]: https://developer.mozilla.org/zh-CN/docs/Web/API/Response/type
[method]: https://developer.mozilla.org/zh-CN/docs/Web/API/Request/method
[readablestream]: https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream
[arraybuffer]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/arrayBuffer
[blob]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/blob
[json]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/json
[text]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/text
[formdata]: https://developer.mozilla.org/zh-CN/docs/Web/API/Body/formdata