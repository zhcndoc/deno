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

Deno 工作区具有灵活性且可以与 Node 包协同工作。为了更方便地迁移现有的 Node.js 项目，您可以在单个工作区中同时拥有以 Deno 优先和以 Node 优先的包。

## 工作区路径模式

Deno 支持工作区成员文件夹的模式匹配，这让管理包含大量成员或特定目录结构的工作区变得更简单。您可以使用通配符模式一次性包含多个目录：

```json title="deno.json"
{
  "workspace": [
    "some-dir/*",
    "other-dir/*/*"
  ]
}
```

模式匹配语法遵循关于文件夹深度的特定规则：

`some-path/*` 匹配位于 `some-path` 目录下的文件和文件夹（仅第一层级）。例如，使用 `packages/*` 时，包括 `packages/foo` 和 `packages/bar`，但不包括 `packages/foo/subpackage`。

`some-path/*/*` 匹配位于 `some-path` 子目录中的文件和文件夹（第二层级）。它不匹配直接位于 `some-path` 里的项目。例如，使用 `examples/*/*`，包括 `examples/basic/demo` 和 `examples/advanced/sample`，但不包括 `examples/basic`。

模式中的每个 `/*` 段对应相对于基础路径的特定文件夹深度。这允许您精确指定目录结构中不同层级的工作区成员。

## Deno 如何解析工作区依赖

在运行一个从另一个工作区成员导入的项目时，Deno 按以下步骤解析依赖：

1. Deno 从执行项目的目录开始（例如项目 A）

2. 向上查找父目录中的根 `deno.json` 文件

3. 如果找到，会检查该文件中的 `workspace` 属性

4. 对于项目 A 中的每个导入语句，Deno 检查它是否匹配任何工作区成员 `deno.json` 中定义的包名称

5. 如果找到匹配的包名，Deno 确认所在目录列在根工作区配置中

6. 然后根据工作区成员 `deno.json` 中的 `exports` 字段解析导入到正确文件

例如，假设结构如下：

```sh
/
├── deno.json         # workspace: ["./project-a", "./project-b"]
├── project-a/
│   ├── deno.json     # name: "@scope/project-a"
│   └── mod.ts        # 从 "@scope/project-b" 导入
└── project-b/
    ├── deno.json     # name: "@scope/project-b"
    └── mod.ts
```

当 `project-a/mod.ts` 导入 `"@scope/project-b"` 时，Deno 的解析流程是：

1. 看到导入语句

2. 检查父目录的 `deno.json`

3. 在工作区数组中找到 `project-b`

4. 验证 `project-b/deno.json` 存在且包名匹配

5. 使用 `project-b` 的 exports 解析该导入

### 容器化的重要提示

在将依赖其他工作区成员的工作区成员容器化时，您必须包括：

1. 根目录的 `deno.json` 文件

2. 所有相关依赖的工作区包

3. 与开发环境相同的目录结构

例如，如果要将上述的 `project-a` 制作为 Docker 镜像，Dockerfile 应该：

```dockerfile
COPY deno.json /app/deno.json
COPY project-a/ /app/project-a/
COPY project-b/ /app/project-b/
```

这样确保了 Deno 用于查找和导入工作区依赖的解析机制得以保留。

### 多个包条目

`exports` 属性详述入口点并指示包用户应导入哪些模块。

目前我们的包只有单一条目。虽然这适合简单包，通常您希望有多个条目，把包的相关部分分组。这可以通过将 `exports` 设置为对象（而非字符串）实现：

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

`"."` 条目是导入 `@scope/my-package` 时默认使用的入口点。因此，上述示例提供了以下入口：

- `@scope/my-package`

- `@scope/my-package/foo`

- `@scope/my-package/other`

### 发布工作区包到注册表

工作区简化了向如 JSR 或 NPM 等注册表发布包的流程。您可以发布单个工作区成员，同时保持它们在单体仓库中的开发联系。

#### 发布到 JSR

发布工作区包到 JSR，请按以下步骤操作：

1. 确保每个包的 `deno.json` 文件包含适当的元数据：

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

发布相互依赖的工作区包时，请在相关包之间保持一致的版本策略。先发布被依赖的包，再发布依赖它们的包。发布后，验证发布包是否正常工作：

```sh
# 测试已发布的包
deno add jsr:@scope/my-published-package
deno test integration-test.ts
```

发布依赖其他工作区成员的包时，Deno 会自动将工作区引用替换为发布代码中的正确注册表引用。

### 从 npm 工作区迁移

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

在工作区运行 `deno fmt` 时，会将 `log` 包格式化为不带分号；运行 `deno lint` 时，如果代码中存在未使用的变量，将不会报错。

## 配置内置 Deno 工具

有些配置只在工作区根部设置才有意义，例如在成员中指定 `nodeModulesDir` 选项不可用，Deno 会警告需要在工作区根部应用该选项。

下面是工作区根及其成员中各种 `deno.json` 选项的完整矩阵：

| 选项                | 工作区 | 包     | 说明                                                                                                                                                             |
| ------------------ | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| compilerOptions    | ✅     | ✅     |                                                                                                                                                                |
| importMap          | ✅     | ❌     | 与每个配置文件的 imports 和 scopes 互斥。此外，工作区配置中不支持 importMap，包配置中不支持 imports。                                                           |
| imports            | ✅     | ✅     | 与每个配置文件的 importMap 互斥。                                                                                                                              |
| scopes             | ✅     | ❌     | 与每个配置文件的 importMap 互斥。                                                                                                                              |
| exclude            | ✅     | ✅     |                                                                                                                                                                |
| lint.include       | ✅     | ✅     |                                                                                                                                                                |
| lint.exclude       | ✅     | ✅     |                                                                                                                                                                |
| lint.files         | ⚠️     | ❌     | 已弃用                                                                                                                                                          |
| lint.rules.tags    | ✅     | ✅     | 标签通过追加包到工作区列表进行合并，重复项被忽略。                                                                                                              |
| lint.rules.include |        |        |                                                                                                                                                                |
| lint.rules.exclude | ✅     | ✅     | 规则按包合并，包的优先级高于工作区（包的 include 比工作区的 exclude 权重更强）。                                                                              |
| lint.report        | ✅     | ❌     | 一次只能激活一个报告器，因此在跨多个包 lint 文件时，不支持每个工作区使用不同报告器。                                                                            |
| fmt.include        | ✅     | ✅     |                                                                                                                                                                |
| fmt.exclude        | ✅     | ✅     |                                                                                                                                                                |
| fmt.files          | ⚠️     | ❌     | 已弃用                                                                                                                                                          |
| fmt.useTabs        | ✅     | ✅     | 包优先级高于工作区。                                                                                                                                             |
| fmt.indentWidth    | ✅     | ✅     | 包优先级高于工作区。                                                                                                                                             |
| fmt.singleQuote    | ✅     | ✅     | 包优先级高于工作区。                                                                                                                                             |
| fmt.proseWrap      | ✅     | ✅     | 包优先级高于工作区。                                                                                                                                             |
| fmt.semiColons     | ✅     | ✅     | 包优先级高于工作区。                                                                                                                                             |
| fmt.options.*      | ⚠️     | ❌     | 已弃用                                                                                                                                                          |
| nodeModulesDir     | ✅     | ❌     | 解析行为必须在整个工作区保持一致。                                                                                                                             |
| vendor             | ✅     | ❌     | 解析行为必须在整个工作区保持一致。                                                                                                                             |
| tasks              | ✅     | ✅     | 包任务优先于工作区。cwd 是包含任务配置文件的目录的工作目录。                                                                                                   |
| test.include       | ✅     | ✅     |                                                                                                                                                                |
| test.exclude       | ✅     | ✅     |                                                                                                                                                                |
| test.files         | ⚠️     | ❌     | 已弃用                                                                                                                                                          |
| publish.include    | ✅     | ✅     |                                                                                                                                                                |
| publish.exclude    | ✅     | ✅     |                                                                                                                                                                |
| bench.include      | ✅     | ✅     |                                                                                                                                                                |
| bench.exclude      | ✅     | ✅     |                                                                                                                                                                |
| bench.files        | ⚠️     | ❌     | 已弃用                                                                                                                                                          |
| lock               | ✅     | ❌     | 每个解析器只能存在一个锁定文件，且每个工作区只能有一个解析器，所以不支持为包单独启用锁文件。                                                                      |
| unstable           | ✅     | ❌     | 为简化操作，不允许使用 unstable 标志，因为 CLI 假设该标志为全局且不可变，这也避免了与 DENO_UNSTABLE_* 标志的奇怪交互。                                        |
| name               | ❌     | ✅     |                                                                                                                                                                |
| version            | ❌     | ✅     |                                                                                                                                                                |
| exports            | ❌     | ✅     |                                                                                                                                                                |
| workspace          | ✅     | ❌     | 不支持嵌套工作区。                                                                                                                                               |

## 跨工作区运行命令

Deno 提供多种方式在所有或特定工作区成员中运行命令：

### 运行测试

要在所有工作区成员中运行测试，只需在工作区根目录执行：

```sh
deno test
```

这将基于每个成员的测试配置执行测试。

若要运行特定工作区成员的测试，可以：

1. 进入该成员目录，运行测试命令：

```sh
cd my-directory
deno test
```

2. 或从根目录指定路径：

```sh
deno test my-directory/
```

### 格式化和 lint

与测试类似，格式化和 lint 命令默认在所有工作区成员中运行：

```sh
deno fmt
deno lint
```

每个成员遵循其 `deno.json` 中配置的格式化和 lint 规则，某些设置从根配置继承（如上述表格所示）。

### 使用工作区任务

您可以在工作区根目录和单个成员中定义任务：

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

运行某个包内定义的任务：

```sh
deno task --cwd=add build
```

## 共享和管理依赖

工作区提供强大的方法来共享和管理跨项目依赖：

### 共享开发依赖

通常的开发依赖（如测试库）可在工作区根部定义：

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "@std/testing/": "jsr:@std/testing@^0.218.0/",
    "chai": "npm:chai@^4.3.7"
  }
}
```

这使得所有工作区成员都可以使用这些依赖，无需重新定义。

### 管理版本冲突

解析依赖时，工作区成员可覆盖根部分定义的依赖。如果根和成员指定同一依赖的不同版本，解析成员文件夹内依赖时使用成员的版本。这样允许单个包按需使用特定的依赖版本。

但是，成员特定依赖仅在该成员文件夹内生效。成员文件夹外，或根级文件操作时，依赖解析使用工作区根部的导入映射（包括 JSR 和 HTTPS 依赖）。

### 互相依赖的工作区成员

如之前 `add` 与 `subtract` 模块示例，工作区成员间可互为依赖。这方便实现职责清晰的拆分，且可共同开发和测试互依模块。

`subtract` 模块导入 `add` 模块功能，示范工作区成员如何基于彼此构建：

```ts title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

此方法允许您：

1. 将复杂项目拆分成职责单一的包

2. 在包间共享代码，无需发布到注册表

3. 共同开发、测试相互依赖模块

4. 逐步将单体代码库迁移为模块化架构

## 在 package.json 中使用工作区协议

Deno 支持在 `package.json` 中使用工作区协议说明符，非常适合依赖工作区内其他包的 npm 包：

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

Deno 能无缝兼容使用 `package.json` 中定义的标准 npm 工作区：

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

对于 pnpm 用户，Deno 支持典型 pnpm 工作区配置。然而，若您使用 `pnpm-workspace.yaml`，需将其迁移到 `deno.json` 工作区配置：

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

这样，在迁移或混合项目中，Deno 与 npm／pnpm 生态系统能实现顺畅集成。

有关配置项目的更多信息，请查看 [使用 deno.json 进行配置](/examples/configuration_with_deno_json/) 教程。