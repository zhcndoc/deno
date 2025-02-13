---
title: "边缘缓存"
---

[Web Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) 在 Deno Deploy 上得到支持。此缓存旨在提供微秒级的读取延迟、多GB/s的写入吞吐量以及无限存储，尽管其在一致性和耐久性方面提供的是尽力而为的保障。

```ts
const cache = await caches.open("my-cache");

Deno.serve(async (req) => {
  const cached = await cache.match(req);
  if (cached) {
    return cached;
  }

  const res = new Response("cached at " + new Date().toISOString());
  await cache.put(req, res.clone());
  return res;
});
```

缓存的数据存储在运行您代码的同一 Deno Deploy 区域。通常，您的隔离进程会在同一区域内观察到读取后写入（RAW）和写入后写入（WAW）的一致性；但是，在极少数情况下，最近的写入可能会丢失、顺序错乱或暂时不可见。

## 过期

默认情况下，缓存的数据会无限期地保存。虽然我们定期扫描并删除不活跃的对象，但通常一个对象会在缓存中保持至少 30 天。

边缘缓存理解标准的 HTTP 响应头 `Expires` 和 `Cache-Control`。您可以使用它们为每个缓存对象指定过期时间，例如：

```
Expires: Thu, 22 Aug 2024 01:22:31 GMT
```

或：

```
Cache-Control: max-age=86400
```

## 限制

- 如果响应不是从 `Uint8Array` 或 `string` 主体构建的，`Content-Length` 头需要手动设置。
- 目前不支持删除。