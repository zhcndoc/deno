---
last_modified: 2026-06-15
title: "同级依赖"
description: "同级依赖是 npm 和 package.json 的一项功能。deno.json 没有 peerDependencies 字段或等效项。Deno 在你使用 npm 包时如何解析同级依赖、node_modules 布局注意事项、可选同级依赖，以及修复未满足的同级依赖错误。"
---

同级依赖是 npm 的一项功能。包会在其 `package.json` 中声明它们，表示它期望安装它的项目提供另一个包的兼容副本，而不是把自己的副本打包进去：

```json title="package.json (inside an npm package)"
{
  "name": "some-react-plugin",
  "peerDependencies": {
    "react": "^19"
  }
}
```

插件和扩展使用同级依赖，这样插件和宿主就能共享同一个包副本。例如，React 组件库会将 `react` 声明为同级依赖，这样它就能使用你的应用已经在用的那个完全一致的 React，而不是引入第二个、可能不匹配的副本。

## `peerDependencies` 位于 `package.json` 中，而不是 `deno.json`

`peerDependencies` 是 `package.json` 的一个字段，也是 Deno 读取同级依赖的唯一来源。**`deno.json` 没有 `peerDependencies` 字段，也没有等效项。** 其中的 `imports` 映射将模块说明符解析到具体位置；它是一个导入映射，而不是像 npm 那样区分普通依赖、开发依赖和同级依赖的清单文件。

在实践中，这意味着：

- **编写包。** 如果你发布的包需要宿主项目提供某个依赖，你应在 `package.json` 中使用 `peerDependencies` 声明它。无法在 `deno.json` 中表达这一点。
- **使用包。** 当你安装一个 npm 包时，Deno 会读取它的 `peerDependencies` 并从你项目的依赖图中解析它们，方式与 npm 相同。只要让该包在你的项目中可解析，你就满足了一个同级依赖，无论你的项目使用的是 `deno.json` 还是 `package.json`。

## 提供同级依赖

将同级依赖与需要它的包一起添加。在 `deno.json` 项目中，把两者都列在 `imports` 中：

```json title="deno.json"
{
  "imports": {
    "react": "npm:react@^19",
    "some-react-plugin": "npm:some-react-plugin@^1"
  }
}
```

这样 `some-react-plugin` 就会将其 `react` 同级依赖解析为你的应用导入的同一个 `npm:react@^19`。这里你并没有声明一个同级依赖；你只是让 `react` 在图中可用，以便插件声明的同级依赖能够解析到它。在 `package.json` 项目中，你将 `react` 列在 `dependencies` 中，和在 Node 中的做法完全一样。

## node_modules 布局与同级依赖

同级依赖如何解析取决于 Deno 使用的
[node_modules 布局](/runtime/fundamentals/node/#node_modules)。

在默认的 **isolated** 布局中，每个包只能看到它声明的依赖，因此同级依赖必须由你的项目提供（如上所示），包才能找到它。这样可以尽早捕获缺失的同级依赖，而不是让包意外解析到一个它从未声明过的兄弟依赖。

某些 npm 工具假定使用 npm 和 Yarn classic 所用的 **hoisted** 布局，其中依赖会被扁平化到 `node_modules` 顶层。如果某个包在 `node_modules` 中查找同级依赖，按扁平解析的兄弟包方式查找却找不到，请切换到 hoisted 链接器（这需要一个手动管理的 `node_modules` 目录）：

```json title="deno.json"
{
  "nodeModulesDir": "manual",
  "nodeModulesLinker": "hoisted"
}
```

## 可选同级依赖

包可以通过其 `package.json` 中的 `peerDependenciesMeta` 将某个同级依赖标记为可选：

```json title="package.json (inside an npm package)"
{
  "peerDependencies": {
    "react": "^19"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  }
}
```

只有当你使用依赖它的功能时，才需要提供可选同级依赖。例如，一个支持多个框架的包可能会把每个框架都列为可选同级依赖，并使用你已经安装的那个。

## 修复未满足的同级依赖

如果某个包的同级依赖不存在，导入它会因缺少的包而失败，并报出 module-not-found 错误。要修复它，请将该同级依赖添加到项目的依赖中，然后运行 `deno install`，这样该版本就会成为你依赖图的一部分：

```sh
deno install
```

如果该包预期是在 `node_modules` 中作为 hoisted 兄弟包找到同级依赖，请参见
[node_modules 布局](/runtime/fundamentals/node/#node_modules)，并按上面所示切换到 hoisted 链接器。有关 Deno 如何与 npm 包和 `node_modules` 协同工作的更多信息，请参见
[Node 兼容性](/runtime/fundamentals/node/#using-npm-packages)。
