---
title: "键过期（键的 TTL）"
oldUrl:
  - /kv/manual/key_expiration/
---

<deno-admonition></deno-admonition>

自版本 1.36.2 起，Deno KV 支持键过期，允许开发者控制 KV 数据库中键的生存时间（TTL）。这允许与一个键关联一个过期时间戳，在该时间戳之后，键将自动从数据库中删除：

```ts
const kv = await Deno.openKv();

// `expireIn` 是键过期的毫秒数。
function addSession(session: Session, expireIn: number) {
  await kv.set(["sessions", session.id], session, { expireIn });
}
```

键过期在 Deno CLI 和 Deno Deploy 上均得到支持。

## 原子性过期多个键

如果在同一原子操作中设置多个键并具有相同的 `expireIn` 值，则这些键的过期将具有原子性。例如：

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

过期时间戳指定了 _最早_ 可以从数据库中删除的时间。实现允许在指定时间戳之后的任何时间删除键，但不得在之前。如果您需要严格执行过期时间（例如出于安全目的），请将其作为值的一个字段添加，并在从数据库中检索到值后进行检查。