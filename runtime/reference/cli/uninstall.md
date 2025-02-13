---
title: "deno uninstall"
oldUrl: /runtime/manual/tools/uninstall/
command: uninstall
---

## `deno uninstall [PACKAGES]`

移除在 `deno.json` 或 `package.json` 中指定的依赖：

```shell
$ deno add npm:express
添加 npm:express@5.0.0

$ cat deno.json
{
  "imports": {
    "express": "npm:express@5.0.0"
  }
}
```

```shell
$ deno uninstall express
已移除 express

$ cat deno.json
{
  "imports": {}
}
```

:::tip

你也可以使用 `deno remove`，这是 `deno uninstall [PACKAGES]` 的别名。

:::

你可以一次性移除多个依赖：

```shell
$ deno add npm:express jsr:@std/http
添加 npm:express@5.0.0
添加 jsr:@std/http@1.0.7

$ cat deno.json
{
  "imports": {
    "@std/http": "jsr:@std/http@^1.0.7",
    "express": "npm:express@^5.0.0"
  }
}
```

```shell
$ deno remove express @std/http
已移除 express
已移除 @std/http

$ cat deno.json
{
  "imports": {}
}
```

:::info

虽然依赖已经从 `deno.json` 和 `package.json` 中移除，但它们仍然保留在全局缓存中以供将来使用。

:::

如果你的项目包含 `package.json`，`deno uninstall` 也可以与之一起工作：

```shell
$ cat package.json
{
  "dependencies": {
    "express": "^5.0.0"
  }
}

$ deno remove express
已移除 express

$ cat package.json
{
  "dependencies": {}
}
```

## `deno uninstall --global [SCRIPT_NAME]`

卸载 `serve`

```bash
deno uninstall --global serve
```

从特定的安装根目录卸载 `serve`

```bash
deno uninstall -g --root /usr/local/bin serve
```