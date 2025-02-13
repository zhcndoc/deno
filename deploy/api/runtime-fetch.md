---
title: "HTTP 请求 (fetch)"
oldUrl:
  - /deploy/docs/runtime-fetch/
---

[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 允许您在 Deno Deploy 中发起外部 HTTP 请求。它是一个网络标准，并具有以下接口：

- `fetch()` - 允许您发起外部 HTTP 请求的方法
- [`Request`](./runtime-request) - 表示 fetch() 的请求资源
- [`Response`](./runtime-response) - 表示 fetch() 的响应资源
- [`Headers`](./runtime-headers) - 表示请求和响应的 HTTP 头部。

本页面展示了 fetch() 方法的使用示例。您可以点击上面的其他接口以了解更多信息。

Fetch 还支持从文件 URL 获取静态文件。有关静态文件的更多信息，请参阅 [文件系统 API 文档](./runtime-fs)。

## `fetch()`

`fetch()` 方法初始化对提供资源的网络请求，并返回一个在响应可用后解析的 Promise。

```ts
function fetch(
  resource: Request | string,
  init?: RequestInit,
): Promise<Response>;
```

#### 参数

| 名称     | 类型                                                          | 可选 | 描述                                                               |
| -------- | ------------------------------------------------------------- | ---- | ------------------------------------------------------------------ |
| resource | [`Request`](./runtime-request) <br/> [`USVString`][usvstring] | `false`  | 资源可以是请求对象或 URL 字符串。                                   |
| init     | [`RequestInit`](./runtime-request#requestinit)                | `true`   | init 对象允许您为请求应用可选参数。                               |

`fetch()` 的返回类型是一个解析为 [`Response`](./runtime-response) 的 Promise。

## 示例

下面的 Deno Deploy 脚本对每个传入的请求发起对 GitHub API 的 `fetch()` 请求，然后从处理函数返回该响应。

```ts
async function handler(req: Request): Promise<Response> {
  const resp = await fetch("https://api.github.com/users/denoland", {
    // 这里的 init 对象包含一个 headers 对象，其中包含指示我们接受的响应类型的头部。
    // 我们没有指定 method 字段，因为默认情况下 fetch 发起的是 GET 请求。
    headers: {
      accept: "application/json",
    },
  });
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "content-type": "application/json",
    },
  });
}

Deno.serve(handler);
```

[usvstring]: https://developer.mozilla.org/en-US/docs/Web/API/USVString