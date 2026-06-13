---
title: "重映射导入路径"
description: "将 deno.json 中的 imports 字段用作导入映射：为 src/ 使用 @/ 之类的路径别名、为本地模块使用裸名称，以及为传递性导入使用作用域覆盖。"
url: /examples/import_maps_tutorial/
---

`deno.json` 中的 `imports` 字段是一个导入映射：任何导入标识符前缀都可以
重映射到任意位置。除了用于命名包之外，它还替代了 `tsconfig.json` 中的 `paths`
部分，可用于像 `@/` 这样的路径别名。

## 为目录设置别名

以 `/` 结尾的键会映射整个前缀。常见约定是将源代码根目录设为别名：

```json title="deno.json"
{
  "imports": {
    "@/": "./src/"
  }
}
```

项目中任何位置的导入现在都可以从根目录访问文件，而不必
逐层计算 `../` 段数：

```ts title="src/pages/about.ts"
import { greet } from "@/greet.ts";
```

## 为单个模块设置别名

不带尾部斜杠的键会将一个裸名称映射到一个文件，这对于处处都会用到的模块来说
读起来很自然：

```json title="deno.json"
{
  "imports": {
    "@/": "./src/",
    "logger": "./src/utils/logger.ts"
  }
}
```

```ts title="main.ts"
import { greet } from "@/greet.ts";
import { log } from "logger";

log(greet("import maps"));
```

```sh
$ deno run main.ts
[log] 你好，import maps！
```

## 编辑器支持

Deno 语言服务器会读取同一个文件，因此补全和
跳转到定义会跟随这些别名，无需额外的 `tsconfig.json` 配置。
如果你迁移的是一个包含 `compilerOptions.paths` 的项目，请将这些条目
移动到 `imports` 中。

## 作用域覆盖

标准导入映射中的 `scopes` 字段同样适用，它会仅对
来自指定路径前缀下的导入重映射某个标识符：

```json title="deno.json"
{
  "imports": {
    "logger": "./src/utils/logger.ts"
  },
  "scopes": {
    "./vendor/": {
      "logger": "./vendor/legacy_logger.ts"
    }
  }
}
```

`vendor/` 下的模块会使用旧版 logger；其他所有内容都会使用默认值。

:::note

导入映射会重定向你自己代码中的标识符。若要强制使用
依赖树更深处某个包的版本，请改用 `package.json` 的 `overrides` 字段；请参见
[覆盖传递性依赖](/examples/add_remove_dependencies_tutorial/#overriding-transitive-dependencies)。

:::

关于包本身如何在导入映射中命名和版本化，请参见
[添加和移除依赖](/examples/add_remove_dependencies_tutorial/)以及
[模块文档](/runtime/fundamentals/modules/)。
