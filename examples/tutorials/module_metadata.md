---
title: "模块元数据"
description: "A guide to working with module metadata in Deno. Learn about import.meta properties, main module detection, file paths, URL resolution, and how to access module context information in your applications."
url: /examples/module_metadata_tutorial/
oldUrl:
  - /runtime/manual/examples/module_metadata/
  - /runtime/tutorials/module_metadata/
---

## 概念

- [import.meta](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)
  可以提供模块上下文的信息。
- 布尔值
  [import.meta.main](https://docs.deno.com/api/web/~/ImportMeta#property_main)
  会告诉你当前模块是否为程序入口点。
- 字符串
  [import.meta.url](https://docs.deno.com/api/web/~/ImportMeta#property_url)
  将给你当前模块的 URL。
- 字符串
  [import.meta.filename](https://docs.deno.com/api/web/~/ImportMeta#property_filename)
  将给你当前模块的完全解析路径。_仅适用于本地模块_。
- 字符串
  [import.meta.dirname](https://docs.deno.com/api/web/~/ImportMeta#property_dirname)
  将给你包含当前模块的目录的完全解析路径。_仅适用于本地模块_。
- [import.meta.resolve](https://docs.deno.com/api/web/~/ImportMeta#property_resolve)
  允许你解析相对于当前模块的说明符。此函数会考虑启动时提供的导入地图（如果有）。
- 字符串 [Deno.mainModule](https://docs.deno.com/api/deno/~/Deno.mainModule)
  将给你主模块入口点的 URL，即由 deno 运行时调用的模块。

## 示例

下面的示例使用两个模块来展示 `import.meta.url`、`import.meta.main` 和 `Deno.mainModule` 之间的差异。在这个示例中，`module_a.ts` 是主模块入口点：

```ts title="module_b.ts"
export function outputB() {
  console.log("模块 B 的 import.meta.url", import.meta.url);
  console.log("模块 B 的 mainModule url", Deno.mainModule);
  console.log(
    "模块 B 通过 import.meta.main 判断是否为主模块？",
    import.meta.main,
  );
}
```

```ts title="module_a.ts"
import { outputB } from "./module_b.ts";

function outputA() {
  console.log("模块 A 的 import.meta.url", import.meta.url);
  console.log("模块 A 的 mainModule url", Deno.mainModule);
  console.log(
    "模块 A 通过 import.meta.main 判断是否为主模块？",
    import.meta.main,
  );
  console.log(
    "解析 ./module_b.ts 的说明符",
    import.meta.resolve("./module_b.ts"),
  );
}

outputA();
console.log("");
outputB();
```

如果 `module_a.ts` 位于 `/home/alice/deno`，则运行 `deno run --allow-read module_a.ts` 的输出为：

```console
模块 A 的 import.meta.url file:///home/alice/deno/module_a.ts
模块 A 的 mainModule url file:///home/alice/deno/module_a.ts
模块 A 通过 import.meta.main 判断是否为主模块？ true
解析 ./module_b.ts 的说明符 file:///home/alice/deno/module_b.ts

模块 B 的 import.meta.url file:///home/alice/deno/module_b.ts
模块 B 的 mainModule url file:///home/alice/deno/module_a.ts
模块 B 通过 import.meta.main 判断是否为主模块？ false
```