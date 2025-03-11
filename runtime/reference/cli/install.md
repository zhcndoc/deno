---
title: "`deno install`"
oldUrl:
 - /runtime/manual/tools/script_installer/
 - /runtime/reference/cli/script_installer/
 - /runtime/manual/tools/script_installer/
 - /runtime/manual/tools/cache/
 - /runtime/reference/cli/cache/
command: install
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno install"
description: "Install and cache dependencies for your project"
---

## 示例

### deno install

使用此命令安装 `deno.json` 和/或 `package.json` 中定义的所有依赖项。

依赖项将被安装在全局缓存中，但如果您的项目有 `package.json` 文件，本地的 `node_modules` 目录也会被创建。

### deno install [PACKAGES]

使用此命令安装特定的软件包，并将其添加到 `deno.json` 或 `package.json` 中。

```shell
$ deno install jsr:@std/testing npm:express
```

:::tip

您也可以使用 `deno add`，它是 `deno install [PACKAGES]` 的别名。

:::

如果您的项目有 `package.json` 文件，来自 npm 的软件包将被添加到 `package.json` 的 `dependencies` 中。否则，所有软件包将被添加到 `deno.json` 中。

### deno install --entrypoint [FILES]

使用此命令安装提供文件及其依赖项中使用的所有依赖项。

如果您在代码中使用 `jsr:`、`npm:`、`http:` 或 `https:` 指定符，并希望在部署项目之前缓存所有依赖项，这尤其有用。

```js title="main.js"
import * as colors from "jsr:@std/fmt/colors";
import express from "npm:express";
```

```shell
$ deno install -e main.js
下载 jsr:@std/fmt
下载 npm:express
```

:::tip

如果您想设置本地的 `node_modules` 目录，可以传递 `--node-modules-dir=auto` 选项。

某些依赖项可能在没有本地 `node_modules` 目录的情况下无法正确工作。

:::

### deno install --global [PACKAGE_OR_URL]

使用此命令安装提供的软件包或脚本，使其作为系统中的全局可用二进制文件。

此命令创建一个瘦的可执行 shell 脚本，该脚本使用指定的 CLI 标志和主模块调用 `deno`。它被放置在安装根目录中。

示例：

```shell
$ deno install --global --allow-net --allow-read jsr:@std/http/file-server
下载 jsr:@std/http/file-server...

✅ 成功安装 file-server.
/Users/deno/.deno/bin/file-server
```

要更改可执行文件的名称，使用 `-n`/`--name`：

```shell
deno install -g -N -R -n serve jsr:@std/http/file-server
```

可执行文件名称默认推断：

- 尝试获取 URL 路径的文件名根。这上面的示例将变为 'file-server'。
- 如果文件名根是 'main'、'mod'、'index' 或 'cli' 这样的通用名称，并且路径没有父级，则采用父路径的文件名。否则，采用通用名称。
- 如果结果名称有 '@...' 后缀，则去掉它。

要更改安装根目录，请使用 `--root`：

```shell
deno install -g -N -R --root /usr/local/bin jsr:@std/http/file-server
```

安装根目录的确定顺序如下：

- `--root` 选项
- `DENO_INSTALL_ROOT` 环境变量
- `$HOME/.deno/bin`

如果需要，必须手动将这些添加到路径中。

```shell
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

您必须在安装时指定运行脚本所需的权限。

```shell
deno install -g -N -R jsr:@std/http/file-server -- -p 8080
```

上述命令创建一个名为 `file_server` 的可执行文件，该文件在网络和读取权限下运行，并绑定到端口 8080。

出于良好实践，请使用
[`import.meta.main`](/runtime/tutorials/module_metadata/) 习语在可执行脚本中指定入口点。

示例：

```ts
// https://example.com/awesome/cli.ts
async function myAwesomeCli(): Promise<void> {
  // -- 省略 --
}

if (import.meta.main) {
  myAwesomeCli();
}
```

当您创建可执行脚本时，请确保通过向您的存储库添加示例安装命令来通知用户：

```shell
# 使用 deno install 安装

$ deno install -n awesome_cli https://example.com/awesome/cli.ts
```

## 原生 Node.js 附加模块

许多流行的 npm 软件包，如 [`npm:sqlite3`](https://www.npmjs.com/package/sqlite3) 或 [`npm:duckdb`](https://www.npmjs.com/package/duckdb)，依赖于 ["生命周期脚本"](https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts)，例如 `preinstall` 或 `postinstall` 脚本。通常，运行这些脚本是软件包正常工作的必要条件。

与 npm 不同，Deno 默认不运行这些脚本，因为它们可能会带来安全漏洞。

您仍然可以通过在运行 `deno install` 时传递 `--allow-scripts=<packages>` 选项来运行这些脚本：

```shell
deno install --allow-scripts=npm:sqlite3
```

_安装所有依赖项，并允许 `npm:sqlite3` 软件包运行其生命周期脚本_。

## 卸载

您可以使用 `deno uninstall` 命令卸载依赖项或二进制脚本：

```shell
$ deno uninstall express
删除 express
```

```shell
$ deno uninstall -g file-server
删除 /Users/deno/.deno/bin/file-server
✅ 成功卸载 file-server
```

有关更多详细信息，请参见 [`deno uninstall` 页面](/runtime/reference/cli/uninstall/)。