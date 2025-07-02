---
title: "捆绑器"
oldUrl: /runtime/manual/cli/bundler/
command: bundle
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno bundle"
---

:::info

`deno bundle` 目前是一个实验性子命令，可能会有所更改。

:::

`deno bundle [URL]` 将输出一个供 Deno 使用的单个 JavaScript 文件，其中包含指定输入的所有依赖项。例如：

```bash
$ deno bundle https://deno.land/std@0.190.0/examples/colors.tsts colors.bundle.js
打包 https://deno.land/std@0.190.0/examples/colors.ts
下载 https://deno.land/std@0.190.0/examples/colors.ts
下载 https://deno.land/std@0.190.0/fmt/colors.ts
输出 "colors.bundle.js" (9.83KB)
```

如果省略输出文件，打包内容将发送到 `stdout`。

该打包文件可以像在 Deno 中跑其他模块一样运行：

```bash
deno run colors.bundle.js
```

输出是一个自包含的 ES 模块，任何从命令行提供的主模块的导出都会可用。例如，如果主模块看起来像这样：

```ts
export { foo } from "./foo.js";

export const bar = "bar";
```

可以这样导入：

```ts
import { bar, foo } from "./lib.bundle.js";
```

## 针对 Web 的打包

`deno bundle` 的输出是为了在 Deno 中使用，而不是在网页浏览器或其他运行时中使用。也就是说，根据输入，它可能在其他环境中工作。

如果您希望针对 Web 进行打包，我们推荐使用其他解决方案，例如 [esbuild](https://esbuild.github.io/)。