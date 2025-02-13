---
title: "工作区和单体仓库"
oldUrl: /runtime/manual/basics/workspaces
---

Deno 支持工作区，也称为“单体仓库”，允许您同时管理多个相关且相互依赖的包。

“工作区”是一个包含 `deno.json` 或 `package.json` 配置文件的文件夹集合。根目录的 `deno.json` 文件定义了工作区：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"]
}
```

这配置了一个包含 `add` 和 `subtract` 成员的工作区，这些成员是预计会有 `deno.json(c)` 和/或 `package.json` 文件的目录。

:::info 命名

Deno 使用 `workspace` 而不是 npm 的 `workspaces` 来表示具有多个成员的单个工作区。

:::

## 示例

让我们扩展一下 `deno.json` 工作区示例，看看它的功能。文件层次结构如下所示：

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

顶级的 `deno.json` 配置文件定义了工作区和应用于所有成员的顶级导入映射：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5"
  }
}
```

根目录的 `main.ts` 文件使用导入映射中的 `chalk` 无符号说明符，并从工作区成员中导入 `add` 和 `subtract` 函数。请注意，它使用 `@scope/add` 和 `@scope/subtract` 导入它们，尽管这些不是有效的 URL，并且不在导入映射中。它们是如何解析的？

```ts title="main.ts"
import chalk from "chalk";
import { add } from "@scope/add";
import { subtract } from "@scope/subtract";

console.log("1 + 2 =", chalk.green(add(1, 2)));
console.log("2 - 4 =", chalk.red(subtract(2, 4)));
```

在 `add/` 子目录中，我们定义了一个具有 `"name"` 字段的 `deno.json`，这个字段对引用工作区成员至关重要。`deno.json` 文件还包含示例配置，例如在使用 `deno fmt` 时关闭分号。

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

这里有很多内容需要解析，展示了一些 Deno 工作区的特性：

1. 这个单体仓库由两个包组成，分别放置在 `./add` 和 `./subtract` 目录下。

1. 通过在成员的 `deno.json` 文件中使用 `name` 和 `version` 选项，可以在整个工作区中使用“无符号说明符”引用它们。在此情况下，包的名称为 `@scope/add` 和 `@scope/subtract`，其中 `scope` 是您可以选择的“作用域”名称。通过这两个选项，您无需在导入声明中使用长而相对的文件路径。

1. `npm:chalk@5` 包是整个工作区的共享依赖项。工作区成员“继承”工作区根的 `imports` 允许轻松管理代码库中依赖项的单一版本。

1. `add` 子目录在其 `deno.json` 中指定 `deno fmt` 在格式化代码时不应应用分号。这使得现有项目的过渡更加顺畅，无需一次性更改几十或几百个文件。

---

Deno 工作区灵活，并且可以与 Node 包一起使用。为了使现有 Node.js 项目的迁移更容易，您可以在单个工作区中同时拥有 Deno 优先和 Node 优先的包。

### 多个包条目

到目前为止，我们的包只有一个条目。这对于简单的包来说可以，但通常您会希望有多个条目以分组包的相关方面。这可以通过将 `object` 而不是 `string` 传递给 `exports` 实现：

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

`"."` 条目是在导入 `@scope/my-package` 时选择的默认条目。因此，上述的 `deno.json` 示例提供了以下条目：

- `@scope/my-package`
- `@scope/my-package/foo`
- `@scope/my-package/other`

### 从 `npm` 工作区迁移

Deno 工作区支持从现有 npm 包使用 Deno 优先包。在这个示例中，我们将一个名为 `@deno/hi` 的 Deno 库与几年前开发的 Node.js 库 `@deno/log` 混合使用。

我们需要在根目录中包含一个 `deno.json` 配置文件：

```json title="deno.json"
{
  "workspace": {
    "members": ["hi"]
  }
}
```

在我们现有的 `package.json` 工作区旁边：

```json title="package.json"
{
  "workspaces": ["log"]
}
```

该工作区当前有一个日志 npm 包：

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

让我们创建一个导入 `@deno/log` 的 Deno 优先包 `@deno/hi`：

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

现在，我们可以编写一个导入并调用 `hi` 的 `main.ts` 文件：

```ts title="main.ts"
import { sayHiTo } from "@deno/hi";

sayHiTo("friend");
```

```sh
$ deno run main.ts
Hi, friend!
```

您甚至可以在现有的 Node.js 包中同时拥有 `deno.json` 和 `package.json`。此外，您可以删除根目录中的 `package.json`，并在 `deno.json` 工作区成员中指定 npm 包。这使您能够逐步迁移到 Deno，而无需进行大量的前期工作。

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

在工作区中运行 `deno fmt`，将会格式化 `log` 包以不含分号，而 `deno lint` 如果您在某个源文件中留下未使用的变量也不会抱怨。

## 配置内置 Deno 工具

一些配置选项仅在工作区根部才有意义，例如，在其中一个成员中指定 `nodeModulesDir` 选项是不可用的，如果选项需要在工作区根部应用，Deno 将发出警告。

以下是可用的各种 `deno.json` 选项在工作区根和其成员的完整矩阵：

| 选项               | 工作区 | 包     | 备注                                                                                                                                                                                                                                                                                                  |
| ------------------ | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| compilerOptions    | ✅        | ❌      | 目前我们只允许每个工作区一组 compilerOptions。这是因为允许多组需要对 deno_graph 和 TSC 集成进行多项更改。此外，我们还需要确定哪些 compilerOptions 适用于远程依赖。我们可以在未来重新考虑这一点。 |
| importMap          | ✅        | ❌      | 在每个配置文件中与 imports 和 scopes 排他性使用。可以在工作区配置中有 importMap，并且在包配置中有 imports。                                                                                                                                                         |
| imports            | ✅        | ✅      | 在每个配置文件中与 importMap 排他性使用。                                                                                                                                                                                                                                                              |
| scopes             | ✅        | ❌      | 在每个配置文件中与 importMap 排他性使用。                                                                                                                                                                                                                                                              |
| exclude            | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.include       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.exclude       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| lint.files         | ⚠️        | ❌      | 已废弃                                                                                                                                                                                                                                                                                             |
| lint.rules.tags    | ✅        | ✅      | 标签通过将包附加到工作区列表进行合并。重复项会被忽略。                                                                                                                                                                                                                        |
| lint.rules.include |           |         |                                                                                                                                                                                                                                                                                                        |
| lint.rules.exclude | ✅        | ✅      | 规则按包合并，包的优先级高于工作区（包的包含强于工作区的排除）。                                                                                                                                                                        |
| lint.report        | ✅        | ❌      | 一次只允许一个报告者处于活动状态，因此在需要 lint 文件跨多个包的情况下允许不同的报告者将不起作用。                                                                                                                                   |
| fmt.include        | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| fmt.exclude        | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| fmt.files          | ⚠️        | ❌      | 已废弃                                                                                                                                                                                                                                                                                             |
| fmt.useTabs        | ✅        | ✅      | 包的优先级高于工作区。                                                                                                                                                                                                                                                                 |
| fmt.indentWidth    | ✅        | ✅      | 包的优先级高于工作区。                                                                                                                                                                                                                                                                 |
| fmt.singleQuote    | ✅        | ✅      | 包的优先级高于工作区。                                                                                                                                                                                                                                                                 |
| fmt.proseWrap      | ✅        | ✅      | 包的优先级高于工作区。                                                                                                                                                                                                                                                                 |
| fmt.semiColons     | ✅        | ✅      | 包的优先级高于工作区。                                                                                                                                                                                                                                                                 |
| fmt.options.\*     | ⚠️        | ❌      | 已废弃                                                                                                                                                                                                                                                                                             |
| nodeModulesDir     | ✅        | ❌      | 整个工作区的解析行为必须保持一致。                                                                                                                                                                                                                                         |
| vendor             | ✅        | ❌      | 整个工作区的解析行为必须保持一致。                                                                                                                                                                                                                                         |
| tasks              | ✅        | ✅      | 包任务的优先级高于工作区。使用的 cwd 是任务所在配置文件的 cwd。                                                                                                                                                                                        |
| test.include       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| test.exclude       | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| test.files         | ⚠️        | ❌      | 已废弃                                                                                                                                                                                                                                                                                             |
| publish.include    | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| publish.exclude    | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.include      | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.exclude      | ✅        | ✅      |                                                                                                                                                                                                                                                                                                        |
| bench.files        | ⚠️        | ❌      | 已废弃                                                                                                                                                                                                                                                                                             |
| lock               | ✅        | ❌      | 每个解析器只能存在一个锁定文件，并且每个工作区只能存在一个解析器，因此每个包的锁定文件条件启用没有意义。                                                                                                                                  |
| unstable           | ✅        | ❌      | 为了简单起见，我们不允许不稳定标志，因为 CLI 的许多假设不稳定标志是不可变的，并且是整个进程全局的。此外，还与 DENO_UNSTABLE_\* 标志存在奇怪的相互作用。                                                                                        |
| name               | ❌        | ✅      |                                                                                                                                                                                                                                                                                                        |
| version            | ❌        | ✅      |                                                                                                                                                                                                                                                                                                        |
| exports            | ❌        | ✅      |                                                                                                                                                                                                                                                                                                        |
| workspace          | ✅        | ❌      | 不支持嵌套工作区。                                                                                                                                                                                                                                                                   |
