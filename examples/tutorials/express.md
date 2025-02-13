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

[在这里查看源代码。](https://github.com/denoland/examples/tree/main/with-express)

## 创建 `main.ts`

让我们创建 `main.ts`：

```console
touch main.ts
```

在 `main.ts` 中，创建一个简单的服务器：

```ts
// @ts-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

const app = express();

app.get("/", (req, res) => {
  res.send("欢迎来到恐龙 API！");
});

app.listen(8000);
```

让我们运行这个服务器：

```console
deno run -A main.ts
```

然后在浏览器中访问 `localhost:8000`。你应该看到：

**欢迎来到恐龙 API！**

## 添加数据和路由

接下来的步骤是添加一些数据。我们将使用从 [这篇文章](https://www.thoughtco.com/dinosaurs-a-to-z-1093748) 中找到的恐龙数据。随意
[从这里复制数据](https://github.com/denoland/examples/blob/main/with-express/data.json)。

我们来创建 `data.json`：

```console
touch data.json
```

并粘贴恐龙数据。

接下来，我们将这些数据导入 `main.ts`。在文件顶部添加这一行：

```ts
import data from "./data.json" assert { type: "json" };
```

然后，我们可以创建访问这些数据的路由。为了保持简单，我们只为 `/api/` 和 `/api/:dinosaur` 定义 `GET` 处理程序。在 `const app = express();` 行后添加以下内容：

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
```

让我们使用 `deno run -A main.ts` 运行服务器，并查看 `localhost:8000/api`。你应该看到恐龙的列表：

```json
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

当我们访问 `localhost:8000/api/aardonyx` 时：

```json
{
  "name": "Aardonyx",
  "description": "长颈龙演化早期阶段。"
}
```

太棒了！