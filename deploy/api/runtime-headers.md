---
title: "HTTP 头"
oldUrl:
  - /deploy/docs/runtime-headers/
---

[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 接口是 Fetch API 的一部分。它允许你创建和操作 fetch() 请求和响应资源的 HTTP 头。

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
| `append(name: string, value: string)`  | 向 Headers 对象追加一个头部（覆盖现有的）。                         |
| `delete(name: string)`                  | 从 Headers 对象删除一个头部。                                     |
| `set(name: string, value: string)`      | 在 Headers 对象中创建一个新的头部。                               |
| `get(name: string)`                     | 获取 Headers 对象中头部的值。                                    |
| `has(name: string)`                     | 检查头部是否存在于 Headers 对象中。                               |
| `entries()`                             | 以键值对的形式获取头部。结果是可迭代的。                          |
| `keys()`                                | 获取 Headers 对象的所有键。结果是可迭代的。                       |

## 示例

```ts
// 从对象字面量创建一个新的头部对象。
const myHeaders = new Headers({
  accept: "application/json",
});

// 向头部对象添加一个头部。
myHeaders.append("user-agent", "Deno Deploy");

// 打印头部对象的头部。
for (const [key, value] of myHeaders.entries()) {
  console.log(key, value);
}

// 你可以将头部实例传递给 Response 或 Request 构造函数。
const request = new Request("https://api.github.com/users/denoland", {
  method: "POST",
  headers: myHeaders,
});
```