---
last_modified: 2026-06-17
title: "deno unlink"
command: unlink
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno unlink"
description: "将本地 JSR 包与当前项目解除链接"
---

`deno unlink` 命令会移除使用 [`deno link`](/runtime/reference/cli/link/) 创建的本地包链接，从而使导入再次解析到已发布的注册表版本。它会为你编辑最近的 `deno.json` 中的 [`links`](/runtime/reference/deno_json/#overriding-packages) 数组。

## 移除链接

你可以通过路径或通过已链接包的 JSR 名称来移除条目：

```sh
# 通过你链接的路径
deno unlink ../my-local-pkg

# 通过包的 JSR 名称
deno unlink @scope/name
```

路径参数会相对于当前工作目录进行解析，方式与
[`deno link`](/runtime/reference/cli/link/) 相同，因此
`deno unlink
../pkg` 会匹配由同一目录下的 `deno link ../pkg` 创建的条目。当 `links` 数组变为空时，它会被完全移除。

如果没有任何参数匹配到已链接条目，`deno unlink` 会以非零状态退出，而不是报告成功，因此在脚本和 CI 中可以检测到拼写错误的路径或名称。它永远不会创建 `deno.json`：如果不存在该文件，就没有可移除的已链接包。
