---
title: "运行 npm 生命周期脚本"
description: "通过 deno approve-scripts 允许 Deno 中的 npm postinstall 和其他生命周期脚本，并使用 deno.json 中的 allowScripts 字段持久化批准结果。"
url: /examples/npm_lifecycle_scripts_tutorial/
---

npm 包可以声明诸如 `preinstall` 和 `postinstall` 之类的生命周期脚本，这些脚本会在安装期间运行任意代码，是众所周知的供应链攻击向量。与 npm 不同，Deno 默认不会运行这些脚本，除非你显式批准它们。带有原生 addon 的包（例如 `npm:better-sqlite3`）需要它们的构建脚本才能正常工作，因此本教程将演示如何批准这些脚本。

## 安装需要构建脚本的包

在一个带有 `package.json` 的项目中，安装一个声明了生命周期脚本的包：

```sh
$ deno install npm:better-sqlite3
...
╭ 警告
│
│  忽略了以下包的构建脚本：
│  npm:better-sqlite3@12.10.0
│
│  运行 "deno approve-scripts" 以执行构建脚本。
╰─
```

该包已安装，但其 `install` 脚本被跳过，因此缺少原生绑定，包在运行时会失败。

## 批准脚本

`deno approve-scripts` 用于查看并运行待批准的脚本。无参数运行时会出现交互式提示，列出所有未批准脚本的包；也可以直接指定包名：

```sh
$ deno approve-scripts npm:better-sqlite3
已批准 npm:better-sqlite3
初始化 better-sqlite3@12.10.0：正在运行 'install' 脚本
```

## 将批准结果持久化到 deno.json

为了让批准成为项目配置的一部分，从而使每位贡献者和 CI 运行都获得相同的行为，请将这些包列入 `allowScripts` 字段：

```json title="deno.json"
{
  "allowScripts": ["npm:better-sqlite3"]
}
```

现在，直接执行 `deno install` 就会为列出的包运行构建脚本，无需任何额外标志。另一种一次性做法是直接向 `deno install` 传递 `--allow-scripts=npm:better-sqlite3`。

:::note

只有当包在本地 `node_modules` 目录中完成设置时，生命周期脚本才会执行。带有 `package.json` 的项目会自动获得该目录；仅使用 `deno.json` 的项目则需要设置 `"nodeModulesDir": "auto"`。

:::

:::caution

在工作区中，`allowScripts` 必须定义在工作区根目录，以确保所有包遵循一致的安全策略。

:::

更多详情请参阅
[`deno approve-scripts` 参考文档](/runtime/reference/cli/approve_scripts/) 以及
`deno install` 文档中的
[原生 Node.js addons 部分](/runtime/reference/cli/install/#native-nodejs-addons)。
