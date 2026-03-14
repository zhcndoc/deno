---
title: "HTTP 头"
oldUrl:
  - /deploy/docs/runtime-headers/
  - /deploy/api/runtime-headers/
---

:::info Legacy Documentation

您正在查看 Deno Deploy Classic 的遗留文档。我们建议您迁移到新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 接口是 Fetch API 的一部分。它允许您创建和操作 fetch() 请求和响应资源的 HTTP 头。

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
| init  | `Headers` / `{ [key: string]: string }` | `true`  | init 选项允许你使用现有的 `Headers` 或对象字面量初始化头对象。                                      |

构造函数的返回类型是 `Headers` 实例。

## 方法

| 名称                                    | 描述                                                               |
| --------------------------------------- | ------------------------------------------------------------------ |
| `append(name: string, value: string)`  | 向 Headers 对象追加一个头部（不会覆盖已有的同名头部）。            |
| `delete(name: string)`                  | 从 Headers 对象删除一个头部。                                     |
| `set(name: string, value: string)`     | 在 Headers 对象中设置一个新的头部，若存在同名头部则覆盖。         |
| `get(name: string)`                     | 获取 Headers 对象中指定头部的值。                                 |
| `has(name: string)`                     | 检查 Headers 对象中是否存在指定的头部。                           |
| `entries()`                             | 以键值对形式获取所有头部，结果是可迭代的。                       |
| `keys()`                               | 获取 Headers 对象中所有键组成的可迭代对象。                       |

## 示例

```ts
// 从对象字面量创建一个新的头部对象。
const myHeaders = new Headers({
  accept: "application/json",
});

// 向头部对象添加一个头部。
myHeaders.append("user-agent", "Deno Deploy Classic");

// 打印头部对象中的所有头部。
for (const [key, value] of myHeaders.entries()) {
  console.log(key, value);
}

// 你可以将头部实例传递给 Response 或 Request 构造函数。
const request = new Request("https://api.github.com/users/denoland", {
  method: "POST",
  headers: myHeaders,
});
```