---
last_modified: 2025-04-11
title: "deno publish"
oldUrl: /runtime/manual/tools/publish/
command: publish
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno publish"
description: "将您的包或工作区发布到 JSR 注册表"
---

`deno publish` 会将您的包发布到 [JSR](https://jsr.io/) 注册表。

## 包要求

您的包必须在其 [`deno.json`](/runtime/fundamentals/configuration/) 或 `jsr.json` 文件中包含 `name`、`version` 和 `exports` 字段。

- `name` 字段必须是唯一的，并遵循 `@<scope_name>/<package_name>` 约定。
- `version` 字段必须是有效的 semver 版本。若要在发布流程中自动递增版本，请参阅 [`deno bump-version`](/runtime/reference/cli/bump_version/)。
- `exports` 字段必须指向包的主入口点。`exports` 字段可以指定为单个字符串，或指定为一个将入口点名称映射到您包中路径的对象。

示例：

```json title="deno.json"
{
  "name": "@scope_name/package_name",
  "version": "1.0.0",
  "exports": "./main.ts"
}
```

在您发布包之前，必须先通过访问 [JSR - 发布一个包](https://jsr.io/new) 在注册表中创建它。

## 排除工作区成员

在 [workspace](/runtime/fundamentals/workspaces/) 中运行时，`deno publish` 会尝试发布所有具有 `name` 和 `exports` 的成员，并在其中任何一个缺少 `version` 时报告错误。若要排除某个成员，例如仅用于承载共享 `tasks` 的内部辅助包，请在该成员的 `deno.json` 中设置 `"publish": false`：

```jsonc title="internal-helpers/deno.json"
{
  "name": "@scope/internal-helpers",
  "publish": false
}
```

该成员仍然属于工作区，但会被 `deno publish` 跳过。请参阅[从发布中排除工作区成员](/runtime/fundamentals/workspaces/#excluding-a-workspace-member-from-publish)
了解完整讨论。

## 示例

发布您当前的工作区

```sh
deno publish
```

使用特定令牌发布您当前的工作区，跳过交互式身份验证

```sh
deno publish --token c00921b1-0d4f-4d18-b8c8-ac98227f9275
```

发布并检查远程模块中的错误

```sh
deno publish --check=all
```

执行干运行以模拟发布。

```sh
deno publish --dry-run
```

使用特定配置文件中的设置发布

```sh
deno publish --config custom-config.json
```