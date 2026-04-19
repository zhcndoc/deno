---
last_modified: 2025-04-03
title: "使用控制台 API 进行更好的调试"
description: "Deno 中高级控制台调试的深入指南。了解 console.table、计时器、计数器、追踪器，以及如何在基础日志之外充分利用完整的 console API，以实现更好的调试工作流。"
url: /examples/debugging_with_console_tutorial/
---

控制台 API 的一部分对 Web 开发者来说可能已经是肌肉记忆了，但它不仅仅是给你用的 `console.log()`。Deno 对这个 API 提供了很好的支持，所以不管你是在为浏览器还是为服务器编写 JavaScript，都值得学习这些有用的工具。

让我们来看看该 API 中一些最有用的方法。你的调试会变得轻松许多！

## `console.log()`

你好，老朋友！你很可能会用它来输出日志消息到控制台，帮助你调试。

```js
console.log("Hello, world!"); // "Hello, world!"
```

你可以通过逗号分隔来输出多个项目，例如：

```jsx
const person = { "name": "Jane", "city": "New York" };
console.log("Hello, ", person.name, "from ", person.city); // "Hello, Jane from New York"
```

或者你也可以使用字符串字面量：

```jsx
const person = { "name": "Jane", "city": "New York" };
console.log(`Hello ${person.name} from ${person.city}`); // "Hello, Jane from New York"
```

你还可以使用 ` %c ` 指令，[通过 CSS 应用一些样式](/examples/color_logging/)：

```jsx
console.log("Wild %cblue", "color: blue", "yonder"); // 将蓝色文本颜色应用到单词“blue”
```

但使用控制台 API 你还可以做得更多。

## `console.table()`

`table` 方法对于输出诸如对象这类结构化数据很有帮助，便于更轻松地检查。

```jsx
const people = {
  "john": {
    "age": 30,
    "city": "New York",
  },
  "jane": {
    "age": 25,
    "city": "Los Angeles",
  },
};

console.table(people);

/*
┌───────┬─────┬───────────────┐
│ (idx) │ age │ city          │
├───────┼─────┼───────────────┤
│ john  │ 30  │ "New York"    │
│ jane  │ 25  │ "Los Angeles" │
└───────┴─────┴───────────────┘
*/
```

你也可以指定想要包含在表格中的对象属性。非常适合用来检查这些详细对象的汇总信息，从而看到你关心的那一部分。

```jsx
console.table(people, ["city"]);

/* 输出
┌───────┬───────────────┐
│ (idx) │ city          │
├───────┼───────────────┤
│ john  │ "New York"    │
│ jane  │ "Los Angeles" │
└───────┴───────────────┘
*/
```

## 计时器方法

理解你应用程序中哪些特定部分耗时多久，对于移除性能瓶颈和昂贵操作至关重要。如果你曾经为了计时而去用 JavaScript 的日期方法，那么你会希望早就知道这个方法。它更方便，也更准确。

请尝试改用
[`console.time()`](https://developer.mozilla.org/en-US/docs/Web/API/console/time_static)，
[`console.timeLog()`](https://developer.mozilla.org/en-US/docs/Web/API/console/timeLog_static)，以及
[`console.timeEnd()`](https://developer.mozilla.org/en-US/docs/Web/API/console/timeEnd_static)。

```jsx
console.time("My timer"); // 启动一个标为“My timer”的计时器
// 执行一些工作...
console.timeLog("My timer"); // 输出当前计时器的值，例如“My timer: 9000ms”
// 再做一些工作...
console.timeEnd("My timer"); // 停止“My timer”并报告其值，例如“My timer: 97338ms”
```

你可以创建多个计时器，每个计时器都有自己的标签。非常实用！

## 使用 `console.count()` 进行计数

在你的代码中，记录特定操作执行了多少次通常很有帮助。与其手动去做，你可以使用
[`console.count()`](https://developer.mozilla.org/en-US/docs/Web/API/console/count_static)，它可以根据你提供的标签为你维护多个计数器。

```jsx
// 增加默认计数器
console.count();
console.count();
console.count();

/*
"default: 1"
"default: 2"
"default: 3"
*/
```

这在函数内部非常好用，并且你可以传入一个标签，例如：

```jsx
function pat(animal) {
  console.count(animal);
  return `Patting the ${animal}`;
}

pat("cat");
pat("cat");
pat("dog");
pat("cat");

/*
"cat: 1"
"cat: 2"
"dog: 1"
"cat: 3"
*/
```

## 使用 `console.trace()` 更深入地排查问题

为了详细了解你应用程序中发生了什么，你可以使用
[`console.trace()`](https://developer.mozilla.org/en-US/docs/Web/API/console/trace_static)
将堆栈追踪信息输出到控制台：

```jsx
// main.js
function foo() {
  function bar() {
    console.trace();
  }
  bar();
}

foo();

/*
Trace
    at bar (file:///PATH_TO/main.js:3:13)
    at foo (file:///PATH_TO/main.js:5:3)
    at file:///PATH_TO/main.js:8:1
*/
```

当然还有更多内容值得探索，但这些实用的方法可以让你的 JavaScript 调试更上一层楼，并且你可以随时在浏览器里或你的 Deno 应用中直接使用它们。

请在 API Reference 文档中查看 [console 支持情况](/api/web/~/Console) 以了解更多。
