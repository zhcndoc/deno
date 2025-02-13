---
title: "如何在 Kinsta 上部署 Deno"
url: /examples/kinsta_tutorial/
oldUrl:
- /runtime/manual/advanced/deploying_deno/kinsta/
- runtime/tutorials/kinsta
---

[Kinsta 应用托管](https://kinsta.com/application-hosting)是一项服务，让您可以直接从 Git 仓库构建和部署您的 Web 应用。

## 准备您的应用

在 **Kinsta**，我们建议使用 [`deno-bin`](https://www.npmjs.com/package/deno-bin) 包来运行 Deno 应用。

为此，您的 `package.json` 应该如下所示：

```json title="package.json"
{
  "name": "deno app",
  "scripts": {
    "start": "deno run --allow-net index.js --port=${PORT}"
  },
  "devDependencies": {
    "deno-bin": "^1.28.2"
  }
}
```

## 示例应用

```js
import { parseArgs } from "jsr:@std/cli";

const { args } = Deno;
const port = parseArgs(args).port ? Number(parseArgs(args).port) : 8000;

Deno.serve({ port }, (_req) => new Response("Hello, world"));
```

应用本身不言自明。重要的是不要硬编码 `PORT`，而是使用 **Kinsta** 提供的环境变量。

还有一个 [仓库](https://github.com/kinsta/hello-world-deno) 可以帮助您入门。

## 部署

1. 在 [Kinsta 应用托管](https://kinsta.com/signup/?product_type=app-db) 注册，或直接登录 [My Kinsta](https://my.kinsta.com/) 管理面板。
2. 转到应用程序选项卡。
3. 连接您的 GitHub 仓库。
4. 按下 **添加服务 > 应用程序按钮**。
5. 按照向导步骤操作。