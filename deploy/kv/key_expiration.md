---
last_modified: 2025-10-07
title: "键过期（密钥的 TTL）"
oldUrl:
  - /kv/manual/key_expiration/
  - /deploy/kv/manual/key_expiration/
---

<deno-admonition></deno-admonition>

从版本 1.36.2 起，Deno KV 支持键过期，允许开发者控制 KV 数据库中键的生存时间（TTL）。这允许为某个键关联一个过期时间戳，在该时间戳之后，该键将自动从数据库中删除：

```ts
const kv = await Deno.openKv();

// `expireIn` 是键过期的毫秒数。
function addSession(session: Session, expireIn: number) {
  await kv.set(["sessions", session.id], session, { expireIn });
}
```

在 Deno CLI 和 Deno Deploy 上均支持键过期。

## 原子性地过期多个键

如果在同一原子操作中设置多个键并且它们具有相同的 `expireIn` 值，则这些键的过期将是原子性的。例如：

```ts
const kv = await Deno.openKv();

function addUnverifiedUser(
  user: User,
  verificationToken: string,
  expireIn: number,
) {
  await kv.atomic()
    .set(["users", user.id], user, { expireIn })
    .set(["verificationTokens", verificationToken], user.id, { expireIn })
    .commit();
}
```

## 注意事项

过期时间戳指定了 _最早_ 可以从数据库中删除键的时间。实现允许在指定时间戳之后的任意时间删除键，但不允许在之前删除。如果您需要严格执行过期时间（例如出于安全目的），请将其作为值的一个字段添加，并在从数据库中检索到该值后进行检查。