---
title: "使用 Deno 构建字词查找应用"
description: "A tutorial on creating a word search application with Deno. Learn how to build a web server, implement pattern matching, handle HTTP requests, and create an interactive web interface using Oak framework."
url: /examples/word_finder_tutorial/
oldUrl:
  - /runtime/manual/examples/word_finder/
  - /runtime/tutorials/word_finder/
---

## 开始

在本教程中，我们将使用 Deno 创建一个简单的字词查找网页应用。
不需要有 Deno 的前置知识。

## 介绍

我们的字词查找应用将接受用户提供的模式字符串并
返回与该模式匹配的所有英语字典中的单词。模式
可以包括字母字符以及 `_` 和 `?`。`?` 可以代表
模式中不存在的任何字母。`_` 可以代表任何字母。

例如，模式 `c?t` 匹配 "cat" 和 "cut"。模式 `go?d`
匹配单词 "goad" 和 "gold"（但不匹配 "good"）。

![字词查找 UI](./images/word_finder.png)

## 构建视图

下面的函数渲染 HTML 以创建上面显示的简单用户界面。
您可以指定模式和单词列表以自定义 HTML 内容。如果指定了
模式，则它会出现在搜索文本框中。如果指定了单词列表，
则会渲染一个带有项目符号的单词列表。

```jsx title="render.js"
export function renderHtml(pattern, words) {
  let searchResultsContent = "";
  if (words.length > 0) {
    let wordList = "";
    for (const word of words) {
      wordList += `<li>${word}</li>`;
    }
    searchResultsContent = `
        <p id="search-result-count" data-count="${words.length}">找到的单词数量: ${words.length}</p>
        <ul id="search-result" name="search-results">
          ${wordList}
        </ul>
      `;
  }

  return `<html>
    <head>
        <title>Deno 字词查找器</title>
        <meta name="version" content="1.0" />
    </head>
    <body>
        <h1>Deno 字词查找器</h1>

        <form id="perform-search" name="perform-search" method="get" action="/api/search">
            <label for="search-text">搜索文本:</label>
            <input id="search-text" name="search-text" type="text" value="${pattern}" />
            <input type="submit" />
        </form>

        ${searchResultsContent}

        <h2>使用说明</h2>

        <p>
            输入一个单词，使用 _ 和 ? 来表示未知字符。使用 ? 代表包括那些未被使用的字母（可以将其视为“财富之轮”的占位符）。使用 _ 将找到包含任何字符的单词（无论它是否为“已揭示”）。
            <br />
            <br />
            例如，d__d 将返回:
            <ul>
                <li>dand</li>
                <li>daud</li>
                <li>dead</li>
                <li>deed</li>
                <li>dird</li>
                <li>dodd</li>
                <li>dowd</li>
                <li>duad</li>
                <li>dyad</li>
            </ul>
            <br />
            而 go?d 将返回:
            <ul>
                <li>goad</li>
                <li>gold</li>
            </ul>
        </p>
    </body>
  </html>
  `;
}
```

## 查询字典

我们还需要一个简单的搜索功能，它扫描字典并返回
所有与指定模式匹配的单词。下面的函数接受一个模式和
字典，并返回所有匹配的单词。

```jsx title="search.js"
export function search(pattern, dictionary) {
  // 创建一个正则表达式模式，排除单词中已有的字符
  let excludeRegex = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c != "?" && c != "_") {
      excludeRegex += "^" + c;
    }
  }
  excludeRegex = "[" + excludeRegex + "]";

  // 让问号仅匹配未在单词中出现的字符
  let searchPattern = pattern.replace(/\?/g, excludeRegex);

  // 让下划线匹配任何字符
  searchPattern = "^" + searchPattern.replace(/\_/g, "[a-z]") + "$";

  // 找到字典中所有匹配模式的单词
  let matches = [];
  for (let i = 0; i < dictionary.length; i++) {
    const word = dictionary[i];
    if (word.match(new RegExp(searchPattern))) {
      matches.push(word);
    }
  }

  return matches;
}
```

## 运行 Deno 服务器

[Oak](https://jsr.io/@oak/oak) is a framework that lets you easily setup a
server in Deno (analogous to JavaScript's Express) and we'll be using it to host
our application. Our server will use our search function to populate our HTML
template with data and then return the customized HTML back to the viewer. We
can conveniently rely on the `/usr/share/dict/words` file as our dictionary
which is a standard file present on most Unix-like operating systems.

```jsx title="server.js"
import { Application, Router } from "jsr:@oak/oak";
import { search } from "./search.js";
import { renderHtml } from "./render.js";

const dictionary = (await Deno.readTextFile("/usr/share/dict/words")).split(
  "\n",
);

const app = new Application();
const port = 8080;

const router = new Router();

router.get("/", async (ctx) => {
  ctx.response.body = renderHtml("", []);
});

router.get("/api/search", async (ctx) => {
  const pattern = ctx.request.url.searchParams.get("search-text");
  ctx.response.body = renderHtml(pattern, search(pattern, dictionary));
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("正在监听 http://localhost:" + port);
await app.listen({ port });
```

我们可以使用以下命令启动服务器。请注意，我们需要显式
授予对文件系统和网络的访问权限，因为 Deno 默认是安全的。

```bash
deno run --allow-read --allow-net server.js
```

现在如果您访问 [http://localhost:8080](http://localhost:8080/) 您应该能够查看字词查找应用。

## 示例代码

您可以在 [这里](https://github.com/awelm/deno-word-finder) 找到完整的示例代码。