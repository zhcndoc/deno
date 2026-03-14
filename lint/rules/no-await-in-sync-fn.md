---
tags: [推荐]
---

禁止在非异步函数中使用 `await` 关键字。

在非异步函数中使用 `await` 关键字是语法错误。要在函数内部使用 `await`，必须通过 `async` 关键字将该函数标记为异步。

**无效：**

```javascript
function foo() {
  await bar();
}

const fooFn = function foo() {
  await bar();
};

const fooFn = () => {
  await bar();
};
```

**有效：**

```javascript
async function foo() {
  await bar();
}

const fooFn = async function foo() {
  await bar();
};

const fooFn = async () => {
  await bar();
};
```