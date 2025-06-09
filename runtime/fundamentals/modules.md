---
title: "模块与依赖"
description: "管理 Deno 中模块与依赖的指南。了解 ECMAScript 模块、第三方包、导入映射、依赖管理、版本控制以及如何发布自己的模块。"
oldUrl:
  - /runtime/manual/basics/modules/
  - /runtime/manual/basics/modules/integrity_checking/
  - /runtime/manual/basics/modules/module_metadata/
  - /runtime/manual/basics/modules/publishing_modules/
  - /runtime/manual/basics/modules/reloading_modules/
  - /runtime/manual/basics/vendoring/
  - /runtime/manual/advanced/http_imports/
  - /runtime/manual/advanced/publishing/dnt/
  - /runtime/manual/advanced/publishing/
  - /runtime/manual/examples/manage_dependencies
  - /runtime/manual/node/cdns.md
  - /runtime/manual/linking_to_external_code
  - /runtime/manual/linking_to_external_code/reloading_modules
  - /runtime/fundamentals/esm.sh
  - /runtime/manual/basics/import_maps/
  - /runtime/manual/advanced/private_repositories/
  - /runtime/reference/private_repositories/
---

Deno 使用
[ECMAScript 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
作为其默认模块系统，以符合现代 JavaScript 标准并提升更高效和一致的开发体验。这是 JavaScript 模块的官方标准，允许更好的树摇优化，改进的工具集成，以及在不同环境中的原生支持。

通过采用 ECMAScript 模块，Deno 确保与不断发展的 JavaScript 生态系统的兼容性。对开发者而言，这意味着一个流畅且可预测的模块系统，避免了与遗留模块格式（如 CommonJS）相关的复杂性。

## 导入模块

在这个例子中，`add` 函数是从本地的 `calc.ts` 模块导入的。

```ts title="calc.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

```ts title="main.ts"
// 导入与此文件相邻的 `calc.ts` 模块
import { add } from "./calc.ts";

console.log(add(1, 2)); // 3
```

你可以在包含 `main.ts` 和 `calc.ts` 的目录中运行这个例子，通过调用 `deno run main.ts`。

使用 ECMAScript 模块时，本地导入规范必须始终包含完整的文件扩展名，不能省略。

```ts title="example.ts"
// 错误：缺少文件扩展名
import { add } from "./calc";

// 正确：包含文件扩展名
import { add } from "./calc.ts";
```

## 导入属性

Deno 支持 `with { type: "json" }` 导入属性语法以导入 JSON 文件：

```ts
import data from "./data.json" with { type: "json" };

console.log(data.property); // 访问 JSON 数据作为对象
```

这是 Deno 当前唯一支持的导入属性类型。对 `type: text` 和 `type: bytes` 的支持正在考虑未来的更新中，并且当前在等待
[Module Harmony proposal](https://github.com/whatwg/html/issues/9444)。

## 数据 URL 导入

Deno 支持导入数据 URL，这允许你导入不在单独文件中的内容。这对测试、原型设计或当你需要以编程方式生成模块时非常有用。

你可以使用 `data:` URL 方案动态创建模块：

```ts
// 从数据 URL 导入一个简单的 JavaScript 模块
import * as module from "data:application/javascript;base64,ZXhwb3J0IGNvbnN0IG1lc3NhZ2UgPSAiSGVsbG8gZnJvbSBkYXRhIFVSTCI7";
console.log(module.message); // 输出: Hello from data URL

// 你也可以使用非 base64 格式
const plainModule = await import(
  "data:application/javascript,export function greet() { return 'Hi there!'; }"
);
console.log(plainModule.greet()); // 输出: Hi there!

// 带有文本内容的简单示例
const textModule = await import(
  "data:text/plain,export default 'This is plain text'"
);
console.log(textModule.default); // 输出: This is plain text
```

数据 URL 格式遵循以下模式：

```sh
data:[<media type>][;base64],<data>
```

对于 JavaScript 模块，请使用 `application/javascript` 作为媒体类型。

TypeScript 也支持 `application/typescript`。此功能特别适用于在隔离环境中测试模块以及在测试期间创建模拟模块。

## 导入第三方模块和库

在 Deno 中使用第三方模块时，使用与本地代码相同的 `import` 语法。第三方模块通常从远程注册表导入，并以 `jsr:` 、 `npm:` 或 `https://` 开头。

```ts title="main.ts"
import { camelCase } from "jsr:@luca/cases@1.0.0";
import { say } from "npm:cowsay@1.6.0";
import { pascalCase } from "https://deno.land/x/case/mod.ts";
```

Deno 推荐使用 [JSR](https://jsr.io)，这是一个现代的 JavaScript 注册中心，用于第三方模块。在那里，你将会找到许多文档完善的 ES 模块供你的项目使用，包括
[Deno 标准库](/runtime/fundamentals/standard_library/)。

你可以
[在这里阅读更多关于 Deno 对 npm 包支持的内容](/runtime/fundamentals/node/#using-npm-modules)。

## 管理第三方模块和库

在多个文件中导入模块时，输入模块名称和完整版本说明符可能会变得繁琐。你可以通过在 `deno.json` 文件中使用 `imports` 字段来集中管理远程模块。我们将这个 `imports` 字段称为 **导入映射（import map）**，它基于 [导入映射标准](https://github.com/WICG/import-maps)。

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0",
    "cowsay": "npm:cowsay@^1.6.0",
    "cases": "https://deno.land/x/case/mod.ts"
  }
}
```

使用重新映射的说明符，代码看起来更加简洁：

```ts title="main.ts"
import { camelCase } from "@luca/cases";
import { say } from "cowsay";
import { pascalCase } from "cases";
```

重新映射名称可以是任何有效的说明符。这是 Deno 中一个非常强大的功能，可以重新映射任何内容。了解更多关于导入映射可以做什么的信息
[这里](/runtime/fundamentals/configuration/#dependencies)。

## 区分 `deno.json` 中的 `imports` 或 `importMap` 选项和 `--import-map` 选项

[导入映射标准]要求每个模块有两个条目：一个是模块说明符，另一个是带有尾随 `/` 的说明符。这是因为该标准只允许每个模块说明符一个条目，而尾随的 `/` 表示该说明符指代一个目录。例如，当使用 `--import-map import_map.json` 选项时，`import_map.json` 文件必须为每个模块包含这两个条目（注意使用 `jsr:/@std/async` 而不是 `jsr:@std/async`）：

```json title="import_map.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0",
    "@std/async/": "jsr:/@std/async@^1.0.0/"
  }
}
```

`deno.json` 中 `importMap` 字段引用的 `import_map.json` 文件的行为与使用 `--import-map` 选项完全相同，包含的每个模块的条目要求与上面所示相同。

相比之下，`deno.json` 扩展了导入映射标准。当你在 `deno.json` 中使用 imports 字段或通过 `importMap` 字段引用 `import_map.json` 文件时，你只需要指定模块说明符而不带尾随 `/`：

```json title="deno.json"
{
  "imports": {
    "@std/async": "jsr:@std/async@^1.0.0"
  }
}
```

## 使用 `deno add` 添加依赖

使用 `deno add` 子命令可以轻松完成安装过程。它将自动将你请求的包的最新版本添加到 `deno.json` 的 `imports` 部分。

```sh
# 将模块的最新版本添加到 deno.json
$ deno add jsr:@luca/cases
Add @luca/cases - jsr:@luca/cases@1.0.0
```

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0"
  }
}
```

你也可以指定确切的版本：

```sh
# 传入确切版本
$ deno add jsr:@luca/cases@1.0.0
Add @luca/cases - jsr:@luca/cases@1.0.0
```

在 [`deno add` 参考文档](/runtime/reference/cli/add/) 中阅读更多内容。

你也可以使用 `deno remove` 移除依赖项：

```sh
$ deno remove @luca/cases
Remove @luca/cases
```

```json title="deno.json"
{
  "imports": {}
}
```

在 [`deno remove` 参考文档](/runtime/reference/cli/remove/) 中阅读更多内容。

## 包版本

你可以为正在导入的包指定一个版本范围。这通过 `@` 符号后跟版本范围说明符来完成，并遵循 [semver](https://semver.org/) 版本方案。

例如：

```bash
@scopename/mypackage           # 最高版本
@scopename/mypackage@16.1.0    # 精确版本
@scopename/mypackage@16        # 最高的 16.x 版本 >= 16.0.0
@scopename/mypackage@^16.1.0   # 最高的 16.x 版本 >= 16.1.0
@scopename/mypackage@~16.1.0   # 最高的 16.1.x 版本 >= 16.1.0
```

以下是所有你可以指定版本或范围的方式的概述：

| 符号      | 描述                                                                                                                                                             | 示例      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `1.2.3`   | 精确版本。仅使用此特定版本。                                                                                                                                   | `1.2.3`   |
| `^1.2.3`  | 兼容版本 1.2.3。允许更新而不改变最左侧的非零数字。<br>例如，`1.2.4` 和 `1.3.0` 是允许的，但 `2.0.0` 不是。                                                    | `^1.2.3`  |
| `~1.2.3`  | 大约等价于版本 1.2.3。允许对补丁版本进行更新。<br>例如，`1.2.4` 是允许的，但 `1.3.0` 不是。                                                                    | `~1.2.3`  |
| `>=1.2.3` | 大于或等于版本 1.2.3。任何版本 `1.2.3` 或更高的版本都是允许的。                                                                                                 | `>=1.2.3` |
| `<=1.2.3` | 小于或等于版本 1.2.3。任何版本 `1.2.3` 或更低的版本都是允许的。                                                                                                 | `<=1.2.3` |
| `>1.2.3`  | 大于版本 1.2.3。仅允许版本高于 `1.2.3` 的版本。                                                                                                                | `>1.2.3`  |
| `<1.2.3`  | 小于版本 1.2.3。仅允许低于 `1.2.3` 的版本。                                                                                                                    | `<1.2.3`  |
| `1.2.x`   | 在次版本 1.2 中的任何补丁版本。例如，`1.2.0`、`1.2.1` 等。                                                                                                     | `1.2.x`   |
| `1.x`     | 在主版本 1 中的任何次版本和补丁版本。例如，`1.0.0`、`1.1.0`、`1.2.0` 等。                                                                                      | `1.x`     |
| `*`       | 任何版本都是允许的。                                                                                                                                           | `*`       |

## HTTPS 导入

Deno 还支持引用 HTTP/HTTPS URL 的导入语句，可以直接：

```js
import { Application } from "https://deno.land/x/oak/mod.ts";
```

或作为你的 `deno.json` 导入映射的一部分：

```json
{
  "imports": {
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

支持 HTTPS 导入使我们能够支持以下 JavaScript CDN，因为它们提供对 JavaScript 模块的 URL 访问：

- [deno.land/x](https://deno.land/x)
- [esm.sh](https://esm.sh)
- [unpkg.com](https://unpkg.com)

HTTPS 导入对于小型且通常是单文件的 Deno 项目特别有用，这些项目不需要其他配置。使用 HTTPS 导入，你可以完全避免拥有 `deno.json` 文件。然而，在较大的应用程序中不建议使用这种导入风格，因为你可能会遇到版本冲突（不同文件使用不同的版本说明符）。HTTP 导入不支持 `deno add`/`deno install` 命令。

:::info

使用 HTTPS 导入时请谨慎，并且仅**从受信任的来源**。如果服务器被攻破，它可能会向你的应用程序提供恶意代码。如果你在不同的文件中导入不同版本，可能还会导致版本问题。HTTPS 导入仍然被支持，**但我们建议使用包注册中心以获得更好的体验。**

:::

## 覆盖依赖

Deno 提供机制来覆盖依赖项，使开发者在开发或测试期间使用自定义或本地版本库。

注意：如果你需要在构建之间缓存和修改本地依赖项，考虑[对远程模块进行 vendoring](#vendoring-remote-modules)。

### 覆盖本地 JSR 包

对于熟悉 Node.js 中 `npm link` 的开发者，Deno 通过 `deno.json` 中的 `patch` 字段提供了类似的功能。这允许你在开发期间使用本地版本覆盖依赖项，而不需要发布它们。

示例：

```json title="deno.json"
{
  "patch": [
    "../some-package-or-workspace"
  ]
}
```

关键点：

- `patch` 字段接受包含 JSR 包或工作区的目录路径。如果你在工作区中引用单个包，整个工作区将被包括在内。
- 此功能仅在工作区根目录中被尊重。在其他位置使用 `patch` 将触发警告。
- 目前，`patch` 仅限于 JSR 包。尝试覆盖 `npm` 包将导致警告而无效。

限制：

- 目前不支持 `npm` 包的覆盖。这计划在未来的更新中实现。
- 不支持基于 Git 的依赖项覆盖。
- `patch` 字段要求在工作区根目录中进行适当配置。
- 此功能为实验性质，可能会根据用户反馈进行更改。

### 覆盖 NPM 包

Deno 支持通过本地版本覆盖 npm 包，类似于如何覆盖 JSR 包。这允许你在开发期间使用本地 npm 包副本而无需发布它。

要使用本地 npm 包，请在你的 `deno.json` 中配置 `patch` 字段：

```json
{
  "patch": [
    "../path/to/local_npm_package"
  ],
  "unstable": ["npm-patch"]
}
```

此功能需要一个 `node_modules` 目录，并且根据你的 `nodeModulesDir` 设置具有不同的行为：

- 当 `"nodeModulesDir": "auto"` 时：目录会在每次运行时重新创建，这会稍微增加启动时间，但确保始终使用最新版本。
- 当 `"nodeModulesDir": "manual"`（使用 package.json 时的默认值）：你必须在更新包后运行 `deno install` 才能将更改应用到工作区的 `node_modules` 目录。

限制：

- 指定本地副本的 npm 包或更改其依赖项将会清除锁文件中的 npm 包，这可能会导致 npm 解析工作出现不同。
- npm 包名称必须在注册中心中存在，即使你使用的是本地副本。
- 此功能当前处于 `unstable` 标志下。

### 覆盖 HTTPS 导入

Deno 还允许通过 `deno.json` 中的 `scopes` 字段覆盖 HTTPS 导入。此功能在调试或临时修复时，将远程依赖项替换为本地修补版本时特别有用。

示例：

```json title="deno.json"
{
  "imports": {
    "example/": "https://deno.land/x/example/"
  },
  "scopes": {
    "https://deno.land/x/example/": {
      "https://deno.land/x/my-library@1.0.0/mod.ts": "./patched/mod.ts"
    }
  }
}
```

关键点：

- 导入映射中的 `scopes` 字段允许你将特定导入重定向到其他路径。
- 这通常用于用本地文件覆盖远程依赖项，用于测试或开发目的。
- Scopes 仅适用于项目的根目录。嵌套在依赖项中的 scopes 会被忽略。

## Vendoring 远程模块

如果你的项目有外部依赖项，你可能希望将它们本地存储，以避免每次构建项目时都从互联网下载它们。在 CI 服务器或 Docker 容器中构建项目或修补或其他修改远程依赖项时，这尤其有用。

Deno 通过在 `deno.json` 文件中设置提供此功能：

```json
{
  "vendor": true
}
```

将上述代码段添加到你的 `deno.json` 文件中，Deno 将在项目运行时将所有依赖项缓存到 `vendor` 目录中，或者你可以选择运行 `deno install --entrypoint` 命令以立即缓存依赖项：

```bash
deno install --entrypoint main.ts
```

然后你可以像往常一样使用 `deno run` 运行应用程序：

```bash
deno run main.ts
```

在进行 vendoring 后，你可以使用 `--cached-only` 标志在没有互联网访问的情况下运行 `main.ts`，这会强制 Deno 仅使用本地可用的模块。

有关更加高级的覆盖，例如在开发期间替代依赖项，请参见 [覆盖依赖](#overriding-dependencies)。

## 发布模块

任何定义导出的 Deno 程序都可以作为模块发布。这允许其他开发人员在自己的项目中导入和使用你的代码。模块可以发布到：

- [JSR](https://jsr.io) - 推荐，原生支持 TypeScript，并为你自动生成文档
- [npm](https://www.npmjs.com/) - 使用 [dnt](https://github.com/denoland/dnt) 创建 npm 包
- [deno.land/x](https://deno.com/add_module) - 用于 HTTPS 导入，尽可能使用 JSR，而不是

## 重新加载模块

默认情况下，Deno 使用全局缓存目录（`DENO_DIR`）来存储下载的依赖项。这个缓存共享于所有项目。

你可以使用 `--reload` 标志强制 Deno 重新获取并重新编译模块到缓存中。

```bash
# 重新加载所有内容
deno run --reload my_module.ts

# 重新加载特定模块
deno run --reload=jsr:@std/fs my_module.ts
```

## 只使用缓存模块

要强制 Deno 只使用之前已缓存的模块，请使用 `--cached-only` 标志：

```shell
deno run --cached-only mod.ts
```

如果有任何依赖于 mod.ts 的依赖树中的依赖项尚未缓存，这将失败。

## 完整性检查和锁文件

想象一下，你的模块依赖于位于 https://some.url/a.ts 的远程模块。当你第一次编译模块时，`a.ts` 被获取、编译并缓存。此缓存版本将在你在不同机器上运行模块（例如在生产环境中）或手动重新加载缓存（使用命令，如 `deno install --reload`）之前使用。

但是如果 `https://some.url/a.ts` 的内容发生变化呢？这可能导致你的生产模块与本地模块运行的依赖代码不同。为了检测这一点，Deno 使用完整性检查和锁文件。

Deno 使用 `deno.lock` 文件检查外部模块的完整性。要启用锁文件，应该做到以下两点之一：

1. 在当前或祖先目录中创建 `deno.json` 文件，这将自动创建一个附加锁文件 `deno.lock`。

   注意，可以通过在 deno.json 中指定以下内容来禁用此功能：

   ```json title="deno.json"
   {
     "lock": false
   }
   ```

2. 使用 `--lock` 标志以启用并指定锁文件检查。

### 冻结锁文件

默认情况下，Deno 使用附加锁文件，新的依赖项将被添加到锁文件中，而不是发生错误。

在某些情况下（例如 CI 流水线或生产环境），这可能并不是所希望的，在这些情况下你希望 Deno 在遇到从未见过的依赖项时报错。为此，你可以指定 `--frozen` 标志，或在 deno.json 文件中设置以下内容：

```json title="deno.json"
{
  "lock": {
    "frozen": true
  }
}
```

在使用冻结的锁文件运行 deno 命令时，任何尝试用新内容更新锁文件的操作都会导致命令退出，并显示将要进行的修改的错误信息。

如果你希望更新锁文件，可以在命令行中指定 `--frozen=false` ，以暂时禁用冻结锁文件。

### 更改锁文件路径

可以通过指定 `--lock=deps.lock` 或在 Deno 配置文件中设置以下内容来配置锁文件路径：

```json title="deno.json"
{
  "lock": {
    "path": "deps.lock"
  }
}
```

## 私有仓库

:::note

如果你在寻找私有 npm 注册中心和 `.npmrc` 支持，请访问
[npm 支持](/runtime/fundamentals/node/#private-registries) 页面。

:::

可能会有一些情况，你希望加载位于 _私有_ 仓库中的远程模块，例如 GitHub 中的私有仓库。

Deno 支持在请求远程模块时发送 bearer token。Bearer tokens 是与 OAuth 2.0 一起使用的主流访问令牌类型，并且广泛得到托管服务的支持（例如 GitHub、GitLab、Bitbucket、Cloudsmith 等）。

### DENO_AUTH_TOKENS

Deno CLI 将寻找名为 `DENO_AUTH_TOKENS` 的环境变量，以确定应考虑使用哪些身份验证令牌来请求远程模块。环境变量的值格式为 _n_ 数量的令牌，由分号（`;`）分隔，其中每个令牌可以是：

- 格式为 `{token}@{hostname[:port]}` 的 bearer token，或者
- 格式为 `{username}:{password}@{hostname[:port]}` 的基本认证数据

例如，单个令牌对于 `deno.land` 看起来像这样：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land
```

或者：

```sh
DENO_AUTH_TOKENS=username:password@deno.land
```

多个令牌则看起来像这样：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@deno.land;f1e2d3c4b5a6@example.com:8080;username:password@deno.land
```

当 Deno 前往获取一个远程模块时，如果主机名与远程模块的主机名匹配，Deno 将把请求的 `Authorization` 头设置为 `Bearer {token}` 或 `Basic {base64EncodedData}` 的值。这允许远程服务器识别请求是与特定已认证用户关联的授权请求，并提供对服务器上适当资源和模块的访问。

### GitHub

要访问 GitHub 上的私有仓库，你需要为自己发放一个 _个人访问令牌_。你可以通过登录 GitHub 并进入
_设置 -> 开发者设置 -> 个人访问令牌_：

![GitHub 上的个人访问令牌设置](./images/private-pat.png)

然后选择 _生成新令牌_，为你的令牌提供描述，并相应地授予 `repo` 权限。`repo` 权限将使你能够读取文件内容（有关 [GitHub 中作用域的更多信息](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#available-scopes)）：

![在 GitHub 上创建新的个人访问令牌](./images/private-github-new-token.png)

创建后，GitHub 将仅显示新令牌一次，此时你要在环境变量中使用的值：

![在 GitHub 上显示新生成的令牌](./images/private-github-token-display.png)

为了访问包含在 GitHub 私有仓库中的模块，你需要在环境变量 `DENO_AUTH_TOKENS` 中使用发放的令牌，作用域为 `raw.githubusercontent.com` 主机名。例如：

```sh
DENO_AUTH_TOKENS=a1b2c3d4e5f6@raw.githubusercontent.com
```

这应该允许 Deno 访问任何由该令牌发放用户可以访问的模块。

当令牌不正确或用户没有访问模块的权限时，GitHub 将发出 `404 Not Found` 状态，而不是未授权状态。因此，如果你在命令行中收到访问模块未找到的错误，请检查环境变量设置和个人访问令牌设置。

此外，`deno run -L debug` 应该打印出关于从环境变量解析出的令牌数量的调试信息。如果它觉得任何令牌格式错误，它会打印错误消息，但出于安全原因，它不会打印任何令牌的详细信息。