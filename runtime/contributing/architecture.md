---
title: "内部细节"
oldUrl: /runtime/manual/references/contributing/architecture/
---

## Deno 和 Linux 类比

|                       **Linux** | **Deno**                           |
| ------------------------------: | :--------------------------------- |
|                       进程     | 网络工作者                          |
|                       系统调用 | 操作                                |
|           文件描述符 (fd)      | [资源 ID (rid)](#resources)       |
|                       调度器   | Tokio                              |
| 用户空间: libc++ / glib / boost | https://jsr.io/@std                |
|                 /proc/\$\$/stat | [Deno.metrics()](#metrics)         |
|                       手册页   | deno 类型 / https://docs.deno.com |

### 资源

资源（也称为 `rid`）是 Deno 的文件描述符版本。它们是用于引用打开的文件、套接字和其他概念的整数值。对于测试来说，能够查询系统中有多少个打开的资源将是有益的。

```ts
console.log(Deno.resources());
// { 0: "stdin", 1: "stdout", 2: "stderr" }
Deno.close(0);
console.log(Deno.resources());
// { 1: "stdout", 2: "stderr" }
```

### 指标

指标是 Deno 用于各种统计信息的内部计数器。

```shell
> console.table(Deno.metrics())
┌─────────────────────────┬───────────┐
│          (idx)          │  值       │
├─────────────────────────┼───────────┤
│      opsDispatched      │    9      │
│    opsDispatchedSync    │    0      │
│   opsDispatchedAsync    │    0      │
│ opsDispatchedAsyncUnref │    0      │
│      opsCompleted       │    9      │
│    opsCompletedSync     │    0      │
│    opsCompletedAsync    │    0      │
│ opsCompletedAsyncUnref  │    0      │
│    bytesSentControl     │   504     │
│      bytesSentData      │    0      │
│      bytesReceived      │   856     │
└─────────────────────────┴───────────┘
```

## 会议

- Ryan Dahl. (2020年5月27日).
  [关于 Deno 的一个有趣案例](https://www.youtube.com/watch?v=1b7FoBwxc7E)。
  Deno 以色列。
- Bartek Iwańczuk. (2020年10月6日).
  [Deno 内部 - 现代 JS/TS 运行时是如何构建的](https://www.youtube.com/watch?v=AOvg_GbnsbA&t=35m13s)。 巴黎 Deno。