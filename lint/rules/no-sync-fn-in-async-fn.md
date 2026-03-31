---
tags: []
---

不允许在异步函数内部使用同步函数。

使用像 `Deno.readTextFileSync` 这样的同步函数会阻塞 Deno 事件循环，因此不推荐在异步函数内使用它，因为它会停止所有其他异步任务的进程。

**无效示例：**

```javascript
async function foo() {
  Deno.readTextFileSync("");
}

const fooFn = async function foo() {
  Deno.readTextFileSync("");
};

const fooFn = async () => {
  Deno.readTextFileSync("");
};
```

**有效示例：**

```javascript
async function foo() {
  await Deno.readTextFile("");
}

function foo() {
  Deno.readTextFileSync("");
}

const fooFn = function foo() {
  Deno.readTextFileSync("");
};

const fooFn = () => {
  Deno.readTextFileSync("");
};
```