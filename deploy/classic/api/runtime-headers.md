---
last_modified: 2026-03-19
title: "HTTP 请求头"
oldUrl:
  - /deploy/docs/runtime-headers/
  - /deploy/api/runtime-headers/
---

:::warning 2026 年 7 月 20 日终止支持

Deno Deploy Classic 将于 2026 年 7 月 20 日关闭。我们建议迁移到新的 <a href="/deploy/">Deno Deploy</a> 平台。详情请参阅 <a href="/deploy/migration_guide/">迁移指南</a>。

:::

[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 接口是 Fetch API 的一部分。它允许您创建和操作 fetch() 请求和响应资源的 HTTP 请求头。

- [构造函数](#构造函数)
  - [参数](#参数)
- [方法](#方法)
- [示例](#示例)

## 构造函数

Header() 构造函数创建一个新的 `Header` 实例。

```ts
let headers = new Headers(init);
```

#### 参数

| 名称  | 类型                                    | 可选    | 描述                                                                                                 |
| ----- | --------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| init  | `Headers` / `{ [key: string]: string }` | `true`  | init 选项允许你使用现有的 `Headers` 或对象字面量来初始化请求头对象。                                      |

构造函数的返回类型是 `Headers` 实例。

## 方法

| 名称                                    | 描述                                                               |
| --------------------------------------- | ------------------------------------------------------------------ |
| `append(name: string, value: string)`  | 向 Headers 对象追加一个请求头（不会覆盖已有的同名请求头）。            |
| `delete(name: string)`                  | 从 Headers 对象删除一个请求头。                                     |
| `set(name: string, value: string)`     | 在 Headers 对象中设置一个新的请求头；如果存在同名请求头则覆盖。         |
| `get(name: string)`                     | 获取 Headers 对象中指定请求头的值。                                 |
| `has(name: string)`                     | 检查 Headers 对象中是否存在指定的请求头。                           |
| `entries()`                             | 以键值对形式获取所有请求头，结果是可迭代的。                       |
| `keys()`                               | 获取 Headers 对象中所有键组成的可迭代对象。                       |

## 示例

```ts
// 使用对象字面量创建一个新的请求头对象。
const myHeaders = new Headers({
  accept: "application/json",
});

// 向请求头对象添加一个请求头。
myHeaders.append("user-agent", "Deno Deploy Classic");

// 打印请求头对象中的所有请求头。
for (const [key, value] of myHeaders.entries()) {
  console.log(key, value);
}

// 你可以将请求头实例传递给 Response 或 Request 构造函数。
const request = new Request("https://api.github.com/users/denoland", {
  method: "POST",
  headers: myHeaders,
});
```