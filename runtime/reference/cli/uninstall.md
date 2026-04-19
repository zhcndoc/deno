---
last_modified: 2025-03-10
title: "deno uninstall"
oldUrl: /runtime/manual/tools/uninstall/
command: uninstall
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno uninstall"
description: "从你的项目或全局缓存中移除一个依赖"
---

## `deno uninstall [PACKAGES]`

移除指定于
[`deno.json`](/runtime/fundamentals/configuration/) 或 `package.json` 中的依赖：

```sh
deno add npm:express
添加 npm:express@5.0.0

cat deno.json
{
  "imports": {
    "express": "npm:express@5.0.0"
  }
}
```

```sh
deno uninstall express
已移除 express

cat deno.json
{
  "imports": {}
}
```

:::tip

你也可以使用 `deno remove`，这是 `deno uninstall [PACKAGES]` 的别名。

:::

你可以一次性移除多个依赖：

```sh
deno add npm:express jsr:@std/http
已添加 npm:express@5.0.0
已添加 jsr:@std/http@1.0.7

cat deno.json
{
  "imports": {
    "@std/http": "jsr:@std/http@^1.0.7",
    "express": "npm:express@^5.0.0"
  }
}
```

```sh
deno remove express @std/http
已移除 express
已移除 @std/http

cat deno.json
{
  "imports": {}
}
```

:::info

虽然依赖已经从 `deno.json` 和 `package.json` 中移除，但它们仍然保留在全局缓存中以供将来使用。

:::

如果你的项目包含 `package.json`，`deno uninstall` 也可以与之一起工作：

```sh
cat package.json
{
  "dependencies": {
    "express": "^5.0.0"
  }
}

deno remove express
已移除 express

cat package.json
{
  "dependencies": {}
}
```

## `deno uninstall --global [SCRIPT_NAME]`

卸载 `serve`

```sh
deno uninstall --global serve
```

从特定的安装根目录卸载 `serve`

```sh
deno uninstall -g --root /usr/local/bin serve
```