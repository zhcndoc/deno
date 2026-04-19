---
last_modified: 2025-12-10
title: "deno approve-scripts"
command: approve-scripts
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno approve-scripts"
description: "管理依赖树中 npm 包的生命周期脚本。"
---

`deno approve-scripts` 允许你审查并批准依赖树中待处理的 npm 生命周期脚本
（例如 `postinstall`）。与 npm 不同，出于安全原因，Deno 默认不会运行
这些脚本。

## 基本用法

以交互方式审查并批准待处理的脚本：

```sh
deno approve-scripts
```

这将向你显示哪些包包含尚未
被批准的生命周期脚本。

## 为什么默认会阻止生命周期脚本

npm 生命周期脚本（例如 `preinstall` 和 `postinstall`）会在安装过程中运行任意
代码。这是已知的供应链攻击向量——
恶意包只需被安装，就可以在你的机器上执行代码。

Deno 采取了更安全的方法：生命周期脚本必须在运行之前
显式批准。
