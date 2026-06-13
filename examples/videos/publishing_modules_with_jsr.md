---
title: "使用 JSR 发布模块"
description: "了解 JSR，这个面向现代 JavaScript 的 TypeScript 优先注册表，并学习如何安装和发布包。"
url: /examples/publishing_modules_with_jsr/
videoUrl: https://www.youtube.com/watch?v=7uiL4WYvZVs&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=8
layout: video.tsx
---

## 文字稿与示例

[JSR](https://jsr.io) 是一个专门为现代 JavaScript
项目设计的注册表。JSR——JavaScript 注册表——有很多很酷的功能。但如果
你以前用过 npm，你可能会想：“为什么我需要这个？为什么我还
要再学一个类似的东西？”

- 首先，它针对 TypeScript 做了优化。
- JSR 只支持 ES Modules。
- 最后，npm 是 node 项目的中心化注册表，但还有
  其他运行时。当然包括 Deno，你也可以在 Bun、
  Cloudflare workers 等环境中使用这些包。

把它想成一个超集。JSR 不会取代 npm，而是在它之上构建。

所以在 [jsr.io](https://jsr.io) 这里，你可以搜索任何你想要的内容。我
正在找一个叫 Oak 的库，它是一个用于处理
HTTP 请求的中间件框架。我会在这里搜索它，这会带我进入
[文档页面](https://jsr.io/@oak/oak)。

如果你想安装一个包，你只需要把它添加进去：

```sh
deno add jsr:@oak/oak
```

然后我们就可以在文件中这样使用它。

```javascript
import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const router = new Router();
router.get("/", (context) => {
  context.response.body = "HEY!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
```

很酷吧！那发布我们自己的 JSR 包又是什么样的呢？其实
很棒。

JSR 包既可以依赖其他 JSR 包，也可以依赖任何 npm 包。

让我们构建一个小型库并将它发布到 JSR。还记得
[我们之前的 `sing` 函数](/examples/all-in-one_tooling/)，让我们把
它变成一个可以被 JavaScript
社区中的其他人使用的函数。欢迎大家。

```typescript
export function sing(
  phrase: string,
  times: number,
): string {
  return Array(times).fill(phrase).join(" ");
}

sing("la", 3);
```

<a href="https://jsr.io/new" class="docs-cta jsr-cta">发布到 JSR
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

现在如果我们[前往 jsr.io，就可以发布它](https://jsr.io/new)。我
第一次尝试发布包时，JSR 会问我想发布到哪个作用域。
我可以在这里创建它。

然后我会创建包名并按照说明操作。

让我们试着在一个使用 Vite 的项目中使用我们的新包。下面的命令
会引导我们完成新 Vite 项目的设置。

```shell
deno run --allow-read --allow-write --allow-env npm:create-vite-extra@latest
```

现在我们可以通过把它添加到项目中来导入我们的新包：

```shell
deno add jsr:@eveporcello/sing
```

然后在需要时导入它

```typescript
import { sing } from "@eveporcello/sing";
```

所以如果一定要给自己打个分，我甚至都不用给自己打分。
[JSR 会给我一个 29% 的评分](https://jsr.io/@eveporcello/sing/score)，
我也不知道。可能不太好。不过这里有一长串
我可以做出的改进。

我需要给我的包添加一个 readme。我需要添加示例。所有这些
不同的东西。所以我可以在自己有时间的时候继续完善它，以确保我这里能达到 100
分，这样我的代码就有完善的文档，并且能非常方便地被其他
开发者使用。
