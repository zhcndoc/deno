---
title: "工作区和单体仓库"
description: "关于在 Deno 中管理工作区和单体仓库的指南。了解工作区配置、包管理、依赖解析以及如何有效地构建多包项目结构。"
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

Deno 工作区灵活且可以与 Node 包一起使用。为了使现有 Node.js 项目的迁移更容易，您可以在单个工作区中同时拥有 Deno 优先和 Node 优先的包。

## 工作区路径模式

Deno 支持对工作区成员文件夹进行模式匹配，使管理具有多个成员或特定目录结构的工作区更加容易。您可以使用通配符模式一次性包含多个目录：

```json title="deno.json"
{
  "workspace": [
    "some-dir/*",
    "other-dir/*/*"
  ]
}
```

模式匹配语法遵循关于文件夹深度的特定规则：

`some-path/*` 匹配 `some-path` 目录下的直接文件和子目录（仅第一层缩进）。例如，对于 `packages/*`，这包括 `packages/foo` 和 `packages/bar`，但不包括 `packages/foo/subpackage`。

`some-path/*/*` 匹配 `some-path` 目录的子目录中的文件和目录（第二层缩进）。它不匹配直接位于 `some-path` 下的项。例如，对于 `examples/*/*`，这包括 `examples/basic/demo` 和 `examples/advanced/sample`，但不包括 `examples/basic`。

模式中的每个 `/*` 段对应相对于基础路径的特定文件夹深度。这允许精确定位目录结构中不同层级的工作区成员。

## Deno 如何解析工作区依赖

当在一个工作区中运行项目，该项目从另一个工作区成员中导入时，Deno 遵循以下步骤解析依赖：

1. Deno 从执行项目的目录开始（例如，项目 A）
2. 向上查找父目录中的根 `deno.json` 文件
3. 如果找到，检查该文件中的 `workspace` 属性
4. 对项目 A 中的每个导入语句，Deno 检查是否匹配任何工作区成员 `deno.json` 中定义的包名
5. 如果找到匹配的包名，Deno 验证该包所在目录是否列在根工作区配置中
6. 导入随后通过工作区成员 `deno.json` 的 `exports` 字段解析到正确的文件

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

1. 识别导入语句
2. 检查父目录的 `deno.json`
3. 在工作区数组中找到 `project-b`
4. 验证 `project-b/deno.json` 存在且具有匹配的包名称
5. 使用 `project-b` 的 `exports` 解析导入

### 容器化的重要注意事项

当将依赖其他工作区成员的工作区成员容器化时，您必须包括：

1. 根 `deno.json` 文件
2. 所有依赖的工作区包
3. 与开发环境一致的目录结构

例如，要将上述 `project-a` 制作成 Docker 镜像，您的 Dockerfile 应该如下：

```dockerfile
COPY deno.json /app/deno.json
COPY project-a/ /app/project-a/
COPY project-b/ /app/project-b/
```

这确保了 Deno 用于查找和导入工作区依赖项的解析机制得以保留。

### 多个包条目

`exports` 属性详细说明了入口点并指示包用户应导入哪些模块。

目前我们的包只有单一条目。虽然对于简单包这没问题，但通常您希望拥有多个条目，将包的相关方面分组。这可以通过将 `exports` 设置为对象而非字符串实现：

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

其中 `"."` 是导入 `@scope/my-package` 时的默认条目。因此，上述 `deno.json` 提供以下条目：

- `@scope/my-package`
- `@scope/my-package/foo`
- `@scope/my-package/other`

### 发布工作区包到注册表

工作区简化了向如 JSR 或 NPM 等注册表发布包的流程。您可以发布单个工作区成员，同时保持它们在单体仓库中的开发关联。

#### 发布到 JSR

发布工作区包到 JSR，请按以下步骤操作：

1. 确保每个包的 `deno.json` 文件中包含适当的元数据：

```json title="my-package/deno.json"
{
  "name": "@scope/my-package",
  "version": "1.0.0",
  "exports": "./mod.ts",
  "publish": {
    "exclude": ["tests/", "*.test.ts", "examples/"]
  }
}
```

2. 进入特定包目录并发布：

```sh
cd my-package
deno publish
```

#### 管理相互依赖的包

当发布相互依赖的工作区包时，请在相关包之间使用一致的版本策略。先发布被依赖的包，再发布依赖它们的包。发布后，验证发布包是否正常工作：

```sh
# 测试已发布的包
deno add jsr:@scope/my-published-package
deno test integration-test.ts
```

发布依赖其他工作区成员的包时，Deno 会自动将工作区引用替换为发布代码中的正确注册表引用。

### 从 `npm` 工作区迁移

Deno 工作区支持从现有 npm 包中使用 Deno 优先的包。在此示例中，我们混用名为 `@deno/hi` 的 Deno 库和几年前开发的 Node.js 库 `@deno/log`。

根目录包含如下 `deno.json` 配置文件：

```json title="deno.json"
{
  "workspace": {
    "members": ["hi"]
  }
}
```

以及现有的 `package.json` 工作区配置：

```json title="package.json"
{
  "workspaces": ["log"]
}
```

该工作区目前包含一个日志 npm 包：

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

现在我们创建一个导入 `@deno/log` 的 Deno 优先包 `@deno/hi`：

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

现在我们编写一个导入并调用 `hi` 的 `main.ts` 文件：

```ts title="main.ts"
import { sayHiTo } from "@deno/hi";

sayHiTo("friend");
```

运行它：

```sh
$ deno run main.ts
Hi, friend!
```

您甚至可以在现有的 Node.js 包中同时拥有 `deno.json` 和 `package.json`。此外，您还可以移除根目录中的 `package.json`，并在 `deno.json` 工作区成员中指定 npm 包。这使您能够逐步迁移到 Deno，而无需进行大量前期工作。

例如，您可以为 `log` 包添加 `deno.json` 来配置 Deno 的 linter 和格式化工具：

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

在工作区中运行 `deno fmt` 时， `log` 包将格式化为不带分号，同时如果源文件中有未使用的变量则 `deno lint` 不会报错。

## 配置内置 Deno 工具

某些配置选项仅在工作区根目录下有效，例如，在单个成员中指定 `nodeModulesDir` 选项时不可用，Deno 会警告如果该选项需要在工作区根部应用。

以下为工作区根和成员中支持的各种 `deno.json` 选项完整矩阵：

| 选项               | 工作区  | 包     | 注释                                                                                                                                                                                                        |
| ------------------ | ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| compilerOptions    | ✅      | ✅     |                                                                                                                                                                                                               |
| importMap          | ✅      | ❌     | 每个配置文件的导入和作用域互斥。此外，工作区配置中不支持 importMap，且包配置中亦不支持导入。                                                                                                        |
| imports            | ✅      | ✅     | 每个配置文件的导入映射互斥。                                                                                                                                                                                  |
| scopes             | ✅      | ❌     | 每个配置文件的导入映射互斥。                                                                                                                                                                                  |
| exclude            | ✅      | ✅     |                                                                                                                                                                                                               |
| lint.include       | ✅      | ✅     |                                                                                                                                                                                                               |
| lint.exclude       | ✅      | ✅     |                                                                                                                                                                                                               |
| lint.files         | ⚠️      | ❌     | 已弃用                                                                                                                                                                                                         |
| lint.rules.tags    | ✅      | ✅     | 标签通过将包附加到工作区列表进行合并，忽略重复项。                                                                                                                                                          |
| lint.rules.include |         |        |                                                                                                                                                                                                               |
| lint.rules.exclude | ✅      | ✅     | 规则按包合并，包优先于工作区（包包含比工作区排除权重更大）。                                                                                                                                                   |
| lint.report        | ✅      | ❌     | 仅允许一个 reporter 处于活动状态，因此在跨多个包的文件中进行 lint 时，允许每个工作区不同 reporters 将无法工作。                                                                                      |
| fmt.include        | ✅      | ✅     |                                                                                                                                                                                                               |
| fmt.exclude        | ✅      | ✅     |                                                                                                                                                                                                               |
| fmt.files          | ⚠️      | ❌     | 已弃用                                                                                                                                                                                                         |
| fmt.useTabs        | ✅      | ✅     | 包配置优先于工作区。                                                                                                                                                                                           |
| fmt.indentWidth    | ✅      | ✅     | 包配置优先于工作区。                                                                                                                                                                                           |
| fmt.singleQuote    | ✅      | ✅     | 包配置优先于工作区。                                                                                                                                                                                           |
| fmt.proseWrap      | ✅      | ✅     | 包配置优先于工作区。                                                                                                                                                                                           |
| fmt.semiColons     | ✅      | ✅     | 包配置优先于工作区。                                                                                                                                                                                           |
| fmt.options.\*     | ⚠️      | ❌     | 已弃用                                                                                                                                                                                                         |
| nodeModulesDir     | ✅      | ❌     | 整个工作区解析行为必须统一。                                                                                                                                                                                |
| vendor             | ✅      | ❌     | 整个工作区解析行为必须统一。                                                                                                                                                                                |
| tasks              | ✅      | ✅     | 包任务优先于工作区。任务的当前工作目录（cwd）是任务所在配置文件目录。                                                                                                                                         |
| test.include       | ✅      | ✅     |                                                                                                                                                                                                               |
| test.exclude       | ✅      | ✅     |                                                                                                                                                                                                               |
| test.files         | ⚠️      | ❌     | 已弃用                                                                                                                                                                                                         |
| publish.include    | ✅      | ✅     |                                                                                                                                                                                                               |
| publish.exclude    | ✅      | ✅     |                                                                                                                                                                                                               |
| bench.include      | ✅      | ✅     |                                                                                                                                                                                                               |
| bench.exclude      | ✅      | ✅     |                                                                                                                                                                                                               |
| bench.files        | ⚠️      | ❌     | 已弃用                                                                                                                                                                                                         |
| lock               | ✅      | ❌     | 每个解析器只能存在一个锁文件，每个工作区只能存在一个解析器，因此每个包开启锁定文件是不合理的。                                                                                                   |
| unstable           | ✅      | ❌     | 为简化起见不允许不稳定标志，因为许多 CLI 假定不稳定标志不可变且为全局设置，并且存在与 DENO_UNSTABLE_* 标志的奇怪交互。                                                                                             |
| name               | ❌      | ✅     |                                                                                                                                                                                                               |
| version            | ❌      | ✅     |                                                                                                                                                                                                               |
| exports            | ❌      | ✅     |                                                                                                                                                                                                               |
| workspace          | ✅      | ❌     | 不支持嵌套工作区。                                                                                                                                                                                           |

## 跨工作区运行命令

Deno 提供了多种方法在所有或特定工作区成员中运行命令：

### 运行测试

要在所有工作区成员中运行测试，只需从工作区根目录执行：

```sh
deno test
```

这将根据每个工作区成员的测试配置执行测试。

要运行特定工作区成员的测试，可以：

1. 进入该成员目录并运行测试命令：

```sh
cd my-directory
deno test
```

2. 或从工作区根目录指定路径：

```sh
deno test my-directory/
```

### 格式化和代码检查

与测试类似，格式化和 linting 命令默认会在所有工作区成员中运行：

```sh
deno fmt
deno lint
```

每个工作区成员遵循其 `deno.json` 中定义的格式化和 lint 规则，某些设置从根配置继承，如上表所示。

### 使用工作区任务

您可以在工作区根和单个工作区成员中定义任务：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "tasks": {
    "build": "echo '构建所有包'",
    "test:all": "deno test"
  }
}
```

```json title="add/deno.json"
{
  "name": "@scope/add",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "build": "echo '构建 add 包'",
    "test": "deno test"
  }
}
```

要运行特定包中定义的任务：

```sh
deno task --cwd=add build
```

## 共享和管理依赖关系

工作区提供了强大的方法来共享和管理跨项目的依赖关系：

### 共享开发依赖

通常的开发依赖（如测试库）可以在工作区根部定义：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "@std/testing/": "jsr:@std/testing@^0.218.0/",
    "chai": "npm:chai@^4.3.7"
  }
}
```

这使它们对所有工作区成员可用，无需在每个包中重复定义。

### 管理版本冲突

解析依赖时，工作区成员可以覆盖根部定义的依赖版本。如果根和成员分别指定了同一依赖的不同版本，则在解析成员内的文件时将使用成员的版本。这允许个别包在需要时使用特定依赖版本。

但是，成员特定依赖仅限于该成员目录。成员目录外，或处理根级别文件时，将使用根工作区的导入映射解析依赖（包括 JSR 和 HTTPS 依赖）。

### 相互依赖的工作区成员

如先前示例所示，工作区成员可以相互依赖。这使您能够保持关注点分离的同时，共同开发和测试相互依赖的模块。

例如，`subtract` 模块从 `add` 模块导入功能，演示工作区成员间的联动构建：

```ts title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

这种方法允许您：

1. 将复杂项目拆分为单一职责的包
2. 在包间共享代码而无需发布至注册表
3. 一起开发和测试相互依赖模块
4. 逐步从单体代码库向模块化架构迁移

## 在 package.json 中使用工作区协议

Deno 支持 `package.json` 中的工作区协议说明符，非常适合依赖于工作区内其他包的 npm 包：

```json title="package.json"
{
  "name": "my-npm-package",
  "dependencies": {
    "another-workspace-package": "workspace:*"
  }
}
```

支持的工作区协议说明符包括：

- `workspace:*` —— 使用工作区中可用的最新版
- `workspace:~` —— 使用工作区版本，且仅允许补丁级变更
- `workspace:^` —— 使用与语义版本兼容的工作区版本

## npm 和 pnpm 工作区兼容性

Deno 能无缝协作使用 `package.json` 中定义的标准 npm 工作区：

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

对于 pnpm 用户，Deno 支持典型的 pnpm 工作区配置。然而，若您使用 `pnpm-workspace.yaml`，需将其迁移到 `deno.json` 工作区配置：

```yaml title="pnpm-workspace.yaml (应替换)"
packages:
  - "packages/*"
```

应转换为：

```json title="deno.json"
{
  "workspace": ["packages/*"]
}
```

这使得在迁移或混合项目中，Deno 和 npm/pnpm 生态系统间能实现平滑集成。