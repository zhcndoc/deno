---
title: CDN 与缓存
description: "Deno Deploy 中的 HTTP 缓存：缓存控制头、缓存标签、失效 API 及边缘缓存的最佳实践。"
---

Deno Deploy 包含一个内置的 HTTP 缓存层，可以在边缘自动缓存符合条件的响应，从而降低延迟和源服务器负载。本文档介绍缓存的工作原理、如何控制缓存行为以及如何失效缓存内容。

## 缓存工作原理

当请求到达 Deno Deploy 时：

1. 缓存会检查是否存在该请求的有效缓存响应
2. 若找到且缓存未过期，立即返回缓存响应（缓存命中）
3. 若未找到或缓存过期，请求会转发给您的应用（缓存未命中）
4. 可缓存的响应会被存储以满足未来请求

该缓存遵循 [RFC 9110](https://httpwg.org/specs/rfc9110.html) 和 [RFC 9111](https://httpwg.org/specs/rfc9111.html) 规范，实现标准 HTTP 缓存行为。

## Cache-Control 头

Deno Deploy 支持标准的 `Cache-Control` 头中的以下指令：

### 响应指令

| 指令                      | 说明                             |
| ------------------------- | -------------------------------- |
| `public`                  | 响应可被共享缓存缓存             |
| `private`                 | 响应是用户特定的，不能缓存（绕过 CDN） |
| `no-store`                | 响应不应被缓存                   |
| `no-cache`                | 响应使用前必须重新验证           |
| `max-age=N`               | 响应在 N 秒内被视为新鲜         |
| `s-maxage=N`              | 类似 `max-age`，但只适用于共享缓存（优先级更高） |
| `stale-while-revalidate=N`| 在后台重新验证时可提供陈旧内容  |
| `stale-if-error=N`        | 若源返回错误，可提供陈旧内容     |
| `must-revalidate`         | 过期响应不允许使用，必须重新验证 |

### 示例：边缘缓存 1 小时

```typescript
Deno.serve(() => {
  return new Response("Hello, World!", {
    headers: {
      "Cache-Control": "public, s-maxage=3600",
    },
  });
});
```

### 示例：使用 stale-while-revalidate 缓存

```typescript
Deno.serve(() => {
  return new Response(JSON.stringify({ data: "..." }), {
    headers: {
      "Content-Type": "application/json",
      // 缓存 60 秒，后台重新验证时最多提供 5 分钟的陈旧内容
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
});
```

## Deno Deploy 专用头

Deno Deploy 支持额外的 headers 以实现更细粒度的缓存控制：

### `Deno-CDN-Cache-Control`

一个 CDN 专用的缓存控制头，其优先级高于 `CDN-Cache-Control` 和 `Cache-Control`。当您希望 Deno Deploy 的 CDN 缓存策略与浏览器或其他缓存不同步时使用此头。

**头优先级（高到低）：**

1. `Deno-CDN-Cache-Control`
2. `CDN-Cache-Control`
3. `Cache-Control`

```typescript
Deno.serve(() => {
  return new Response("Hello!", {
    headers: {
      // 浏览器缓存 60 秒
      "Cache-Control": "public, max-age=60",
      // Deno Deploy CDN 缓存 1 小时
      "Deno-CDN-Cache-Control": "public, s-maxage=3600",
    },
  });
});
```

### `Deno-Cache-Tag` / `Cache-Tag`

将响应关联到缓存标签以便目标失效。标签允许您无需知道具体 URL 即可失效一组缓存响应。

```typescript
Deno.serve((req) => {
  const url = new URL(req.url);
  const productId = url.pathname.split("/")[2];

  return new Response(JSON.stringify({ id: productId, name: "Widget" }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600",
      // 为该响应打标签，方便稍后失效
      "Deno-Cache-Tag": `product-${productId},products,catalog`,
    },
  });
});
```

**标签格式：**

- 多个标签以逗号分隔
- 标签忽略大小写
- 每个标签最多 1024 字符
- 每个响应最多 500 个标签
- 标签必须使用 UTF-8 编码

### `Deno-Cache-Id`

一个特殊的头，具有两个功能：

1. **选择退出自动失效**：带有此头的响应使用一个共享的缓存命名空间，缓存会跨部署持久存在。没有这个头，缓存响应会在部署新版本时自动失效。

2. **作为缓存标签**：其值可用于失效该缓存响应。

```typescript
Deno.serve(() => {
  return new Response("Static content that rarely changes", {
    headers: {
      "Cache-Control": "public, s-maxage=86400",
      // 此响应在重新部署后依然保留
      "Deno-Cache-Id": "static-content-v1",
    },
  });
});
```

**`Deno-Cache-Id` 使用场景：**

- 应该跨部署保留缓存的内容（如带内容哈希的静态资源）
- 长期缓存响应，需要显式失效控制
- 在不同部署版本间共享缓存响应

### `Deno-Vary`

扩展缓存变体支持，超出标准 HTTP `Vary` 语义。（即将支持）

## 缓存失效

Deno Deploy 支持按需通过缓存标签失效缓存，允许您无需重新部署即清理特定缓存内容。

### 失效 API

从您的 Deno Deploy 应用内向 `http://cache.localhost/invalidate/http` 发送 POST 请求：

```typescript
Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/admin/purge") {
    // 失效所有标记为 "products" 的响应
    const res = await fetch("http://cache.localhost/invalidate/http", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: ["products"],
      }),
    });

    if (res.ok) {
      return new Response("Cache purged successfully");
    }
    return new Response("Purge failed", { status: 500 });
  }

  // ... 处理其他请求
});
```

### 失效请求格式

```json
{
  "tags": ["tag1", "tag2", "tag3"]
}
```

- `tags`：需要失效的缓存标签数组（必填）
- 单次请求最多 500 个标签

### 通配符失效

使用 `"*"` 可失效您部署的所有缓存响应：

```typescript
await fetch("http://cache.localhost/invalidate/http", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tags: ["*"],
  }),
});
```

### 跨区域失效

缓存失效会自动同步到所有 Deno Deploy 区域，失效操作在几秒内全局生效。

### 示例：内容管理系统 Webhook

```typescript
Deno.serve(async (req) => {
  const url = new URL(req.url);

  // CMS 更新的 Webhook 端点
  if (req.method === "POST" && url.pathname === "/webhook/cms") {
    const payload = await req.json();

    // 根据内容类型选择失效标签
    const tags: string[] = [];

    if (payload.type === "product") {
      tags.push(`product-${payload.id}`, "products");
    } else if (payload.type === "category") {
      tags.push(`category-${payload.id}`, "categories", "navigation");
    }

    if (tags.length > 0) {
      await fetch("http://cache.localhost/invalidate/http", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
    }

    return new Response("OK");
  }

  // ... 服务内容
});
```

## 缓存状态头

Deno Deploy 会添加 `Cache-Status` 响应头，指示缓存结果：

| 值                              | 说明                              |
| ------------------------------- | ---------------------------------- |
| `deno; hit`                     | 响应来自缓存                     |
| `deno; fwd=uri-miss; stored`    | 缓存未命中，响应已存储            |
| `deno; fwd=miss; stored`        | Vary 键未命中，响应以新 vary 键存储 |
| `deno; fwd=stale`               | 响应过期，已转发到源服务器         |
| `deno; fwd=method`              | 非缓存请求方法（如 POST、PUT 等）  |
| `deno; fwd=bypass`              | 明确绕过缓存                      |
| `deno; fwd=request`             | 请求指令阻止缓存                  |

### 绕过细节

当响应绕过缓存时，`detail` 字段说明原因：

- `detail=not-cacheable` - 响应不符合缓存条件
- `detail=no-cache-or-private` - 具备 `no-cache` 或 `private` 指令
- `detail=set-cookie` - 响应含 `Set-Cookie` 头
- `detail=pragma-no-cache` - 旧式的 `Pragma: no-cache` 头存在
- `detail=too-large` - 响应体过大，超出可缓存限制
- `detail=zero-ttl` - 计算出的缓存时长为零
- `detail=vary-star` - `Vary: *` 阻止缓存
- `detail=header-overflow` - 响应头过多

## 可缓存的响应

响应满足以下条件时可缓存：

1. 请求方法是 `GET` 或 `HEAD`
2. 响应状态码为可缓存（200、203、204、206、300、301、308、404、405、410、414、501）
3. 响应包含缓存相关头（如 `Cache-Control`、`Expires` 等）
4. 没有 `no-store`、`private` 或 `no-cache` 指令
5. 响应不包含 `Set-Cookie` 头
6. 响应体大小在可缓存范围内

## 缓存变体（Vary）

缓存支持标准的 `Vary` 头，根据请求头存储响应的不同版本：

```typescript
Deno.serve((req) => {
  const acceptLanguage = req.headers.get("Accept-Language") || "en";
  const language = acceptLanguage.startsWith("es") ? "es" : "en";

  return new Response(`Hello in ${language}!`, {
    headers: {
      "Cache-Control": "public, s-maxage=3600",
      "Vary": "Accept-Language",
      "Content-Language": language,
    },
  });
});
```

**注意：** `Vary: *` 会完全阻止缓存。

## HEAD 请求

HEAD 请求可使用缓存的 GET 响应，缓存会自动剥离响应体，仅返回头信息。

## 范围请求

缓存支持 HTTP 范围请求（`Range` 头），可以基于缓存的完整响应返回部分内容。

## 最佳实践

### 1. 使用 `s-maxage` 实现 CDN 缓存

```typescript
// 让浏览器缓存 1 分钟，CDN 缓存 1 小时
headers: {
  "Cache-Control": "public, max-age=60, s-maxage=3600"
}
```

### 2. 给内容打标签以实现目标失效

```typescript
// 按内容类型、ID 和分类打标签，实现灵活清理
headers: {
  "Deno-Cache-Tag": `article-${id},articles,category-${category}`
}
```

### 3. 使用 `stale-while-revalidate` 优化用户体验

```typescript
// 在后台刷新时提供陈旧内容
headers: {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600"
}
```

### 4. 对稳定资源使用 `Deno-Cache-Id`

```typescript
// 对不应随着部署失效的内容寻址资源
const hash = computeHash(content);
headers: {
  "Cache-Control": "public, s-maxage=31536000, immutable",
  "Deno-Cache-Id": `asset-${hash}`
}
```

### 5. 设置合适的缓存时长 (TTL)

- 文件名中带哈希的静态资源：`max-age=31536000`（一年）
- API 响应：`s-maxage=60` 到 `s-maxage=300`，配合 `stale-while-revalidate`
- 个性化内容：不缓存或合理使用 `Vary`

## 自动缓存失效

默认情况下，所有没有 `Deno-Cache-Id` 的缓存响应，在您部署新版本应用时会自动失效，确保用户始终看到最新内容。

如果想关闭自动失效，可以使用 `Deno-Cache-Id` 头。
