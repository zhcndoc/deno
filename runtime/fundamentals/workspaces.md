---
title: "Workspaces and monorepos"
description: "A guide to managing workspaces and monorepos in Deno. Learn about workspace configuration, package management, dependency resolution, and how to structure multi-package projects effectively."
oldUrl: /runtime/manual/basics/workspaces
---

Deno 支持工作区，也称为“单体仓库”，允许您同时管理多个相关且相互依赖的包。

“工作区”是一个包含 `deno.json` 或 `package.json` 配置文件的文件夹集合。根 `deno.json` 文件定义了工作区：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"]
}
```

这配置了一个包含 `add` 和 `subtract` 成员的工作区，这些成员是在预期中应具有 `deno.json(c)` 和/或 `package.json` 文件的目录。

:::info 命名

Deno 使用 `workspace` 而不是 npm 的 `workspaces` 来表示一个包含多个成员的单一工作区。

:::

## 示例

让我们扩展 `deno.json` 工作区示例，看看它的功能。文件层次结构如下所示：

```sh
/
├── deno.json
├── main.ts
├── add/
│     ├── deno.json
│     └── mod.ts
└── subtract/
      ├── deno.json
      └── mod.ts
```

有两个工作区成员（add 和 subtract），每个成员都有 `mod.ts` 文件。还有一个根 `deno.json` 和一个 `main.ts`。

顶级 `deno.json` 配置文件定义了工作区和应用于所有成员的顶级导入映射：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5"
  }
}
```

根 `main.ts` 文件使用导入映射中的 `chalk` 裸标识符，并从工作区成员导入 `add` 和 `subtract` 函数。请注意，它是通过 `@scope/add` 和 `@scope/subtract` 导入它们，即使这些不是正确的 URL 并且不在导入映射中。它们是如何被解析的呢？

```ts title="main.ts"
import chalk from "chalk";
import { add } from "@scope/add";
import { subtract } from "@scope/subtract";

console.log("1 + 2 =", chalk.green(add(1, 2)));
console.log("2 - 4 =", chalk.red(subtract(2, 4)));
```

在 `add/` 子目录中，我们定义了一个具有 `"name"` 字段的 `deno.json`，这对于引用工作区成员是重要的。该 `deno.json` 文件还包含示例配置，例如在使用 `deno fmt` 时关闭分号。

```json title="add/deno.json"
{
  "name": "@scope/add",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "fmt": {
    "semiColons": false
  }
}
```

```ts title="add/mod.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

`subtract/` 子目录类似，但没有相同的 `deno fmt` 配置。

```json title="subtract/deno.json"
{
  "name": "@scope/subtract",
  "version": "0.3.0",
  "exports": "./mod.ts"
}
```

```ts title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

让我们运行它：

```sh
> deno run main.ts
1 + 2 = 3
2 - 4 = -2
```

这里有很多内容可以展开，展示了 Deno 工作区的一些特性：

1. 这个单体仓库由两个包组成，放置在 `./add` 和 `./subtract` 目录中。

1. 通过在成员的 `deno.json` 文件中使用 `name` 和 `version` 选项，可以通过 “裸标识符” 在整个工作区中引用它们。在这种情况下，包的名称为 `@scope/add` 和 `@scope/subtract`，其中 `scope` 是您可以选择的“范围”名称。使用这两个选项后，无需在导入语句中使用长的和相对的文件路径。

1. `npm:chalk@5` 包是整个工作区的共享依赖。工作区成员“继承”工作区根的 `imports`，可以轻松管理整个代码库中的单个版本的依赖。

1. `add` 子目录在其 `deno.json` 中指定 `deno fmt` 应在格式化代码时不应用分号。这使得现有项目的过渡更加顺畅，无需一次性更改数十个或数百个文件。

---

Deno 工作区灵活，并且可以与 Node 包一起使用。为了使现有 Node.js 项目的迁移更容易，您可以在一个工作区中同时拥有 Deno 首选和 Node 首选包。

## Deno 如何解析工作区依赖项

在运行一个导入了另一个工作区成员的工作区项目时，Deno 按照以下步骤解析依赖项：

1. Deno 从正在执行的项目的目录开始（例如，项目 A）
2. 它在父目录中查找根 `deno.json` 文件
3. 如果找到，它会检查该文件中的 `workspace` 属性
4. 对于项目 A 中的每个导入语句，Deno 检查导入是否与任何工作区成员的 `deno.json` 中定义的包名称匹配
5. 如果找到匹配的包名称，Deno 验证包含该目录是否在根工作区配置中列出
6. 然后通过工作区成员的 `deno.json` 中的 `exports` 字段解析该导入

例如，给定以下结构：

```sh
/
├── deno.json         # workspace: ["./project-a", "./project-b"]
├── project-a/
│   ├── deno.json     # name: "@scope/project-a"
│   └── mod.ts        # imports from "@scope/project-b"
└── project-b/
    ├── deno.json     # name: "@scope/project-b"
    └── mod.ts
```

当 `project-a/mod.ts` 导入 `"@scope/project-b"` 时，Deno：

1. 看到导入语句
2. 检查父目录的 `deno.json`
3. 在工作区数组中找到 `project-b`
4. 验证 `project-b/deno.json` 是否存在并且具有匹配的包名称
5. 使用 `project-b` 的 exports 解析导入

### 容器化的重要注意事项

当容器化一个依赖于其他工作区成员的工作区成员时，您必须包括：

1. 根 `deno.json` 文件
2. 所有依赖的工作区包
3. 与您的开发环境相同的目录结构

例如，如果对上面的 `project-a` 进行 Docker 化，您的 Dockerfile 应该是：

```dockerfile
COPY deno.json /app/deno.json
COPY project-a/ /app/project-a/
COPY project-b/ /app/project-b/
```

这保留了 Deno 用于查找和导入工作区依赖项的工作区解析机制。

### 多个包条目

`exports` 属性详细说明了入口点，并揭示了哪些模块应该被你的包的用户导入。

到目前为止，我们的包只有一个条目。这对于简单的包来说是可以的，但通常您会希望拥有多个条目，将包的相关方面分组。这可以通过向 `exports` 传递一个 `对象` 而不是 `字符串` 来完成：

```json title="my-package/deno.json"
{
  "name": "@scope/my-package",
  "version": "0.3.0",
  "exports": {
    ".": "./mod.ts",
    "./foo": "./foo.ts",
    "./other": "./dir/other.ts"
  }
}
```

`"."` 条目是导入 `@scope/my-package` 时选择的默认条目。因此，上面的 `deno.json` 示例提供了以下条目：

- `@scope/my-package`
- `@scope/my-package/foo`
- `@scope/my-package/other`

### 从 `npm` 工作区迁移

Deno 工作区支持从现有 npm 包中使用 Deno 首选包。在这个例子中，我们将名为 `@deno/hi` 的 Deno 库与几年前开发的 Node.js 库 `@deno/log` 混合使用。

我们需要在根目录中包含一个 `deno.json` 配置文件：

```json title="deno.json"
{
  "workspace": {
    "members": ["hi"]
  }
}
```

与我们现有的 package.json 工作区一起：

```json title="package.json"
{
  "workspaces": ["log"]
}
```

工作区目前有一个日志 npm 包：

```json title="log/package.json"
{
  "name": "@deno/log",
  "version": "0.5.0",
  "type": "module",
  "main": "index.js"
}
```

```js title="log/index.js"
export function log(output) {
  console.log(output);
}
```

让我们创建一个导入 `@deno/log` 的 Deno 首选包 `@deno/hi`：

```json title="hi/deno.json"
{
  "name": "@deno/hi",
  "version": "0.2.0",
  "exports": "./mod.ts",
  "imports": {
    "log": "npm:@deno/log@^0.5"
  }
}
```

```ts title="hi/mod.ts"
import { log } from "log";

export function sayHiTo(name: string) {
  log(`Hi, ${name}!`);
}
```

现在我们可以编写一个导入并调用 `hi` 的 `main.ts` 文件：

```ts title="main.ts"
import { sayHiTo } from "@deno/hi";

sayHiTo("friend");
```

```sh
$ deno run main.ts
Hi, friend!
```

您甚至可以在现有的 Node.js 包中同时拥有 `deno.json` 和 `package.json`。此外，您还可以移除根目录中的 package.json，并在 deno.json 工作区成员中指定 npm 包。这使您可以逐渐迁移到 Deno，而无需投入大量的前期工作。

例如，您可以添加 `log/deno.json` 来配置 Deno 的 linter 和格式化工具：

```jsonc
{
  "fmt": {
    "semiColons": false
  },
  "lint": {
    "rules": {
      "exclude": ["no-unused-vars"]
    }
  }
}
```

在工作区中运行 `deno fmt`，将使 `log` 包的格式不带有分号，并且如果您在其中一个源文件中留下一个未使用的变量，`deno lint` 将不会抱怨。

## 配置内置 Deno 工具

有些配置选项仅在工作区的根部有意义，例如，在某个成员中指定 `nodeModulesDir` 选项是不可用的，如果某个选项需要在工作区根部应用，Deno 将会发出警告。

以下是工作区根部及其成员中可用的各种 `deno.json` 选项的完整矩阵：

| 选项                 | 工作区 | 包     | 注意事项                                                                                                                                                                                                                                                                                                  |
| ------------------ | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| compilerOptions    | ✅        | ❌      | 目前每个工作区只允许一组 compilerOptions。这是因为需要对 deno_graph 和 TSC 集成进行多次更改以允许多于一组。此外，我们还需要确定哪些 compilerOptions 适用于远程依赖项。我们将在未来重新审视这一点。 |
| importMap          | ✅        | ❌      | 与每个配置文件中的 imports 和 scopes 独占。此外，不支持在工作区配置中有 importMap，并在包配置中有 imports。                                                                                                                                     |
| imports            | ✅        | ✅      | 与每个配置文件中的 importMap 独占。                                                                                                                                                                                                                                                              |
| scopes             | ✅        | ❌      | 与每个配置文件中的 importMap 独占。                                                                                                                                                                                                                                                              |
| exclude            | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.include       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.exclude       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.files         | ⚠️        | ❌      | 已弃用                                                                                                                                                                                                                                                                                             |
| lint.rules.tags    | ✅        | ✅      | 标签通过将包附加到工作区列表合并。忽略重复项。                                                                                                                                                                                                                        |
| lint.rules.include |           |         |                                                                                                                                                                                                                                                                                                        |
| lint.rules.exclude | ✅        | ✅      | 规则按包合并，包优先于工作区（包包含的优先于工作区排除）。                                                                                                                                                                        |
| lint.report        | ✅        | ❌      | 同时只能有一个报告器处于活动状态，因此在多个包中排列文件时，不可能在工作区中允许不同的报告器。                                                                                                                                   |
| fmt.include        | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| fmt.exclude        | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| fmt.files          | ⚠️        | ❌      | 已弃用                                                                                                                                                                                                                                                                                             |
| fmt.useTabs        | ✅        | ✅      | 包优先于工作区。                                                                                                                                                                                                                                                                 |
| fmt.indentWidth    | ✅        | ✅      | 包优先于工作区。                                                                                                                                                                                                                                                                 |
| fmt.singleQuote    | ✅        | ✅      | 包优先于工作区。                                                                                                                                                                                                                                                                 |
| fmt.proseWrap      | ✅        | ✅      | 包优先于工作区。                                                                                                                                                                                                                                                                 |
| fmt.semiColons     | ✅        | ✅      | 包优先于工作区。                                                                                                                                                                                                                                                                 |
| fmt.options.\*     | ⚠️        | ❌      | 已弃用                                                                                                                                                                                                                                                                                             |
| nodeModulesDir     | ✅        | ❌      | 解析行为在整个工作区中必须相同。                                                                                                                                                                                                                                         |
| vendor             | ✅        | ❌      | 解析行为在整个工作区中必须相同。                                                                                                                                                                                                                                         |
| tasks              | ✅        | ✅      | 包任务优先于工作区。使用的 cwd 是任务所在配置文件的 cwd。                                                                                                                                                                                        |
| test.include       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| test.exclude       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| test.files         | ⚠️        | ❌      | 已弃用                                                                                                                                                                                                                                                                                             |
| publish.include    | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| publish.exclude    | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.include      | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.exclude      | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.files        | ⚠️        | ❌      | 已弃用                                                                                                                                                                                                                                                                                             |
| lock               | ✅        | ❌      | 每个解析器只能存在一个锁文件，并且每个工作区只能存在一个解析器，因此按包条件启用锁文件没有意义。                                                                                                                                  |
| unstable           | ✅        | ❌      | 为了简单起见，我们不允许不稳定标志，因为 CLI 中的很多假设不稳定标志是不可变的，并且是全局默认的。同样，DENO_UNSTABLE_\* 标志的奇怪交互。                                                                                        |
| name               | ❌        | ✅      |                                                                                                                                                                                                                                                                                                        |
| version            | ❌        | ✅      |                                                                                                                                                                                                                                                                                                        |
| exports            | ❌        | ✅      |                                                                                                                                                                                                                                                                                                        |
| workspace          | ✅        | ❌      | 不支持嵌套工作区。                                                                                                                                                                                                                                                                   |
