---
title: "如何在 Deno 中使用 Express"
url: /examples/express_tutorial/
oldUrl:
  - /runtime/manual/examples/how_to_with_npm/express/
  - /runtime/manual/node/how_to_with_npm/express/
  - /runtime/tutorials/how_to_with_npm/express/
---

[Express](https://expressjs.com/) 是一个流行的 web 框架，以简单和无特定意见著称，拥有庞大的中间件生态系统。

本指南将展示如何使用 Express 和 Deno 创建一个简单的 API。

[查看源代码。](https://github.com/denoland/tutorial-with-express)

## 初始化一个新的 Deno 项目

在命令行中运行以下命令以创建一个新的启动项目，然后导航到项目目录中：

```sh
deno init my-express-project
cd my-express-project
```

## 安装 Express

要安装 Express，我们将使用 `npm:` 模块说明符。这个说明符允许我们从 npm 导入模块：

```sh
deno add npm:express
```

这将把最新的 `express` 包添加到 `deno.json` 文件中的 `imports` 字段。现在你可以在代码中使用 `import express from "express";` 导入 `express`。

## 更新 `main.ts`

在 `main.ts` 中，让我们创建一个简单的服务器：

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("欢迎来到恐龙 API！");
});

app.listen(8000);
console.log(`服务器正在运行在 http://localhost:8000`);
```

你可能会注意到编辑器对 `req` 和 `res` 参数发出警告。这是因为 Deno 没有为 `express` 模块提供类型。为了解决这个问题，你可以直接从 npm 导入 Express 类型文件。在 `main.ts` 的顶部添加以下注释：

```ts
// @ts-types="npm:@types/express@4.17.15"
```

这个注释告诉 Deno 使用 `@types/express` 包中的类型。

## 运行服务器

当你初始化项目时，Deno 设置了一个任务来运行 `main.ts` 文件，你可以在 `deno.json` 文件中看到它。更新 `dev` 任务以包含 [`--allow-net`](/runtime/fundamentals/security/#network-access) 标志：

````jsonc
{
  "scripts": {
    "dev": "deno run --allow-net main.ts"
  }, 
  ...
}
````

这将允许该项目进行网络请求。你可以 [阅读更多关于权限标志的信息](/runtime/fundamentals/security/)。

现在你可以使用以下命令运行服务器：

```sh
deno run dev
```

如果你在浏览器中访问 `localhost:8000`，你应该看到：

**欢迎来到恐龙 API！**

## 添加数据和路由

接下来的步骤是添加一些数据。我们将使用来自 [这篇文章](https://www.thoughtco.com/dinosaurs-a-to-z-1093748) 的恐龙数据。随意
[从这里复制它](https://raw.githubusercontent.com/denoland/tutorial-with-express/refs/heads/main/data.json)。

在项目根目录中创建一个 `data.json` 文件，并粘贴恐龙数据。

接下来，我们将把这些数据导入到 `main.ts` 中：

```ts
import data from "./data.json" with { type: "json" };
```

我们将创建访问这些数据的路由。

为了简单起见，我们只为 `/api/` 和 `/api/:dinosaur` 定义 `GET` 处理程序。在 `const app = express();` 这一行后添加以下代码：

```ts
app.get("/", (req, res) => {
  res.send("欢迎来到恐龙 API！");
});

app.get("/api", (req, res) => {
  res.send(data);
});

app.get("/api/:dinosaur", (req, res) => {
  if (req?.params?.dinosaur) {
    const found = data.find((item) =>
      item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
    );
    if (found) {
      res.send(found);
    } else {
      res.send("未找到恐龙。");
    }
  }
});

app.listen(8000);
console.log(`服务器正在运行在 http://localhost:8000`);
```

让我们使用 `deno run dev` 运行服务器，并在浏览器中查看 `localhost:8000/api`。你应该会看到一列恐龙！

```jsonc
[
  {
    "name": "Aardonyx",
    "description": "长颈龙演化早期阶段。"
  },
  {
    "name": "Abelisaurus",
    "description": "\"阿贝尔的蜥蜴\" 是由单个头骨重建的。"
  },
  {
    "name": "Abrictosaurus",
    "description": "异齿龙的早期亲属。"
  },
...
```

你还可以通过访问 "/api/恐龙名称" 来获取特定恐龙的详细信息，例如 `localhost:8000/api/aardonyx` 将显示：

```json
{
  "name": "Aardonyx",
  "description": "长颈龙演化早期阶段。"
}
```

🦕 现在你已准备好在 Deno 中使用 Express。你可以考虑把这个示例扩展成一个恐龙网页应用。或者查看
[Deno 内置的 HTTP 服务器](https://docs.deno.com/runtime/fundamentals/http_server/)。