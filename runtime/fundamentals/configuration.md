---
title: "deno.json 和 package.json"
description: "配置您的 Deno 项目的指南。了解 TypeScript 设置、任务、依赖项、格式化、代码检查以及如何有效使用 deno.json 和/或 package.json。"
oldUrl:
- /runtime/manual/getting_started/configuration_file/
- /runtime/manual/basics/modules/import_maps/
- /runtime/basics/import_maps/
- /runtime/manual/linking_to_external_code/import_maps
- /manual/linking_to_external_code/proxies
---

您可以使用 `deno.json` 文件来配置 Deno。该文件可用于配置 TypeScript 编译器、代码检查器、格式化工具以及其他 Deno 工具。

该配置文件支持 `.json` 和 [`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments) 扩展名。

如果在当前工作目录或父目录中检测到 `deno.json` 或 `deno.jsonc` 配置文件，Deno 将自动识别。可以使用 `--config` 标志指定不同的配置文件。

## package.json 支持

Deno 还支持 `package.json` 文件，以兼容 Node.js 项目。如果您有一个 Node.js 项目，则不必创建 `deno.json` 文件。Deno 将使用 `package.json` 文件来配置项目。

如果在同一目录中同时存在 `deno.json` 和 `package.json` 文件，Deno 将理解两个文件中指定的依赖项；并使用 `deno.json` 文件进行 Deno 特定配置。有关更多信息，请阅读 [Deno 中的 Node 兼容性](/runtime/fundamentals/node/#node-compatibility)。

## 依赖项

在您的 `deno.json` 文件中，`"imports"` 字段允许您指定项目中使用的依赖项。您可以使用它将简单的指定符映射到 URL 或文件路径，从而更轻松地管理依赖关系和模块解析。

例如，如果您想在项目中使用标准库中的 `assert` 模块，可以使用以下导入映射：

```json title="deno.json"
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0",
    "chalk": "npm:chalk@5"
  }
}
```

然后，您的脚本可以使用简单的指定符 `std/assert`：

```js title="script.ts"
import { assertEquals } from "@std/assert";
import chalk from "chalk";

assertEquals(1, 2);
console.log(chalk.yellow("Hello world"));
```

您还可以在 `package.json` 中使用 `"dependencies"` 字段：

```json title="package.json"
{
  "dependencies": {
    "express": "express@^1.0.0"
  }
}
```

```js title="script.ts"
import express from "express";

const app = express();
```

请注意，这将要求您运行 `deno install`。

有关更多信息，请阅读 [模块导入和依赖项](/runtime/fundamentals/modules/)。

### 自定义路径映射

`deno.json` 中的导入映射可用于更一般的指定符路径映射。您可以将确切的指定符映射到第三方模块或文件，或将导入指定符的一部分映射到一个目录。

```jsonc title="deno.jsonc"
{
  "imports": {
    // 映射到一个确切的文件
    "foo": "./some/long/path/foo.ts",
    // 映射到一个目录，使用方法: "bar/file.ts"
    "bar/": "./some/folder/bar/"
  }
}
```

用法：

```ts
import * as foo from "foo";
import * as bar from "bar/file.ts";
```

导入路径映射在较大的代码库中通常用于简化代码。

要使用项目根目录进行绝对导入：

```json title="deno.json"
{
  "imports": {
    "/": "./",
    "./": "./"
  }
}
```

```ts title="main.ts"
import { MyUtil } from "/util.ts";
```

这会使以 `/` 开头的导入指定符相对于导入映射的 URL 或文件路径进行解析。

### 覆盖包

`deno.json` 中的 `links` 字段允许您用存储在磁盘上的本地包覆盖依赖项。这类似于 `npm link`。

```json title="deno.json"
{
  "links": [
    "../some-package"
  ]
}
```

此功能解决了几个常见的开发问题：

- 依赖项错误修复
- 私有本地库
- 兼容性问题

被引用的包不必发布。只需要在 `deno.json` 或 `package.json` 中具有正确的包名和元数据，Deno 就能识别它正在处理哪个包。这提供了更大的灵活性和模块化，保持主代码与外部包的清晰分离。

## 任务

您在 `deno.json` 文件中的 `tasks` 字段用于定义可以使用 `deno task` 命令执行的自定义命令，并允许您根据项目的具体需求调整命令和权限。

这与 `package.json` 文件中的 `scripts` 字段类似，也受支持。

```json title="deno.json"
{
  "tasks": {
    "start": "deno run --allow-net --watch=static/,routes/,data/ dev.ts",
    "test": "deno test --allow-net",
    "lint": "deno lint"
  }
}
```

```json title="package.json"
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

要执行任务，请使用 `deno task` 命令后跟任务名称。例如：

```sh
deno task start
deno task test
deno task lint
deno task dev
deno task build
```

有关更多信息，请阅读 [`deno task`](/runtime/reference/cli/task_runner/)。

## 代码检查

`deno.json` 文件中的 `lint` 字段用于配置 Deno 内置代码检查器的行为。这允许您指定要包含或排除在哪些文件中进行代码检查，以及自定义代码检查规则以满足项目的需求。

例如：

```json title="deno.json"
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

此配置将：

- 仅检查 `src/` 目录中的文件，
- 排除检查 `src/testdata/` 目录中的文件或 `src/fixtures/` 目录中的任何 TypeScript 文件。
- 指定应应用推荐的代码检查规则，
- 添加对 `ban-untagged-todo` 规则的启用，
- 排除 `no-unused-vars` 规则。

您可以在 [规则列表](/lint/) 文档页面中找到所有可用的代码检查规则的完整列表。

有关更多信息，请阅读 [使用 Deno 进行代码检查](/runtime/reference/cli/linter/)。

## 格式化

`deno.json` 文件中的 `fmt` 字段用于配置 Deno 内置代码格式化程序的行为。这允许您自定义代码的格式，以确保项目的一致性，使其更易于阅读和协作。以下是您可以配置的关键选项：

```json title="deno.json"
{
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": true,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  }
}
```

此配置将：

- 使用制表符而不是空格进行缩进，
- 将行限制为 80 个字符，
- 使用 4 个空格的缩进宽度，
- 在语句结束时添加分号，
- 使用单引号包裹字符串，
- 保留文本换行，
- 格式化 `src/` 目录中的文件，
- 排除 `src/testdata/` 目录中的文件和任何 TypeScript 文件。

有关更多信息，请阅读 [使用 Deno 格式化代码](/runtime/fundamentals/linting_and_formatting/)。

## 锁定文件

`deno.json` 文件中的 `lock` 字段用于指定 Deno 使用的锁定文件的配置，以 [确保依赖项的完整性](/runtime/fundamentals/modules/#integrity-checking-and-lock-files)。锁定文件记录了您的项目所依赖模块的确切版本和完整性哈希，确保在每次运行项目时使用相同的版本，即使依赖项被更新或远程更改。

```json title="deno.json"
{
  "lock": {
    "path": "./deno.lock",
    "frozen": true
  }
}
```

此配置将：

- 指定锁定文件位置为 `./deno.lock`（这是默认值，可以省略）
- 告诉 Deno 如果有任何依赖项更改则返回错误

Deno 默认使用锁定文件，您可以使用以下配置禁用它：

```json title="deno.json"
{
  "lock": false
}
```

## Node 模块目录

默认情况下，如果您的项目目录中有 `package.json` 文件，Deno 将使用本地 `node_modules` 目录。

您可以使用 `deno.json` 文件中的 `nodeModulesDir` 字段来控制此行为。

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

您可以将此字段设置为以下值：

| 值         | 行为                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `"none"`   | 不使用本地 `node_modules` 目录。改为使用 `$DENO_DIR` 中的全局缓存，Deno 会自动保持其最新。                                        |
| `"auto"`   | 使用本地 `node_modules` 目录。Deno 会自动创建并保持此目录的最新状态。                                                             |
| `"manual"` | 使用本地 `node_modules` 目录。用户必须手动保持此目录的最新状态，例如使用 `deno install` 或 `npm install`。                       |

不需要指定此设置，以下默认值会被应用：

- 如果您的项目目录中没有 `package.json` 文件，则为 `"none"`  
- 如果您的项目目录中有 `package.json` 文件，则为 `"manual"`

使用工作区时，此设置只能在工作区根目录中使用。在任何成员中指定此设置都会导致警告。只有在工作区根目录中有 `package.json` 文件时，`"manual"` 设置才会被自动应用。

## TypeScript 编译器选项

`deno.json` 文件中的 `compilerOptions` 字段用于配置 [TypeScript 编译器设置](https://www.typescriptlang.org/tsconfig) 以符合您的 Deno 项目。这允许您自定义 TypeScript 代码的编译方式，确保与项目的要求和编码标准一致。

:::info

Deno 推荐使用默认的 TypeScript 配置。这将有助于分享代码。

:::

另请参见 [在 Deno 中配置 TypeScript](/runtime/reference/ts_config_migration/)。

## 不稳定特性

`deno.json` 文件中的 `unstable` 字段用于启用 Deno 项目的特定不稳定特性。

这些特性仍在开发中，尚未成为稳定 API 的一部分。通过在 `unstable` 数组中列出特性，您可以在它们正式发布之前进行实验和使用这些新功能。

```json title="deno.json"
{
  "unstable": ["cron", "kv", "webgpu"]
}
```

[了解更多](/runtime/reference/cli/unstable_flags/)。

## include 和 exclude

许多配置（例如 `lint`, `fmt`）都有 `include` 和 `exclude` 属性来指定要包含的文件。

### include

这里指定的路径或模式仅会被包含。

```jsonc
{
  "lint": {
    // 仅格式化 src/ 目录
    "include": ["src/"]
  }
}
```

### exclude

这里指定的路径或模式将被排除。

```jsonc
{
  "lint": {
    // 不检查 dist/ 文件夹
    "exclude": ["dist/"]
  }
}
```

此项优先级高于 `include`，如果在 `include` 和 `exclude` 中都匹配路径，则以 `exclude` 为准。

您可能希望排除一个目录，但包含一个子目录。在 Deno 1.41.2 及更高版本中，可以通过在更一般的排除下指定否定通配符来取消排除更具体的路径：

```jsonc
{
  "fmt": {
    // 不格式化 "fixtures" 目录，
    // 但格式化 "fixtures/scripts"
    "exclude": [
      "fixtures",
      "!fixtures/scripts"
    ]
  }
}
```

### 顶级排除

如果有一个目录您永远不希望 Deno 格式化、检查、类型检查、分析等，则在顶级排除数组中指定它：

```jsonc
{
  "exclude": [
    // 从所有子命令和 LSP 中排除 dist 文件夹
    "dist/"
  ]
}
```

有时您可能会发现希望取消排除顶级排除中已排除的路径或模式。在 Deno 1.41.2 及更高版本中，可以在更具体的配置中通过指定否定通配符取消排除路径：

```jsonc
{
  "fmt": {
    "exclude": [
      // 格式化 dist 文件夹，即使在顶级被排除
      "!dist"
    ]
  },
  "exclude": [
    "dist/"
  ]
}
```

### 发布 - 覆盖 .gitignore

`.gitignore` 会被考虑在 `deno publish` 命令中。在 Deno 1.41.2 及更高版本中，您可以使用否定的排除通配符来选择不包含在 _.gitignore_ 中的排除文件：

```title=".gitignore"
dist/
.env
```

```jsonc title="deno.json"
{
  "publish": {
    "exclude": [
      // 包含被 git 忽略的 dist 文件夹
      "!dist/"
    ]
  }
}
```

另一种方法是将 git 忽略的路径明确指定在 `"include"` 中：

```json
{
  "publish": {
    "include": [
      "dist/",
      "README.md",
      "deno.json"
    ]
  }
}
```

## 一个示例 `deno.json` 文件

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": false,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "lock": false,
  "nodeModulesDir": "auto",
  "unstable": ["webgpu"],
  "test": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "tasks": {
    "start": "deno run --allow-read main.ts"
  },
  "imports": {
    "oak": "jsr:@oak/oak"
  },
  "exclude": [
    "dist/"
  ]
}
```

这是一个配置了 TypeScript 编译器选项、代码检查器、格式化器、node_modules 目录等的 `deno.json` 文件示例。有关可用字段和配置的完整列表，请参阅
[Deno 配置文件模式](#json-schema)。

这是一个配置了 TypeScript 编译器选项、代码检查器、格式化器、node_modules 目录等的 `deno.json` 文件示例。有关可用字段和配置的完整列表，请参阅
[Deno 配置文件模式](#json-schema)。

## JSON 模式

可用于编辑器提供自动完成的 JSON Schema 文件可在以下位置获得： [https://github.com/denoland/deno/blob/main/cli/schemas/config-file.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/config-file.v1.json)

## 代理

Deno 支持用于模块下载和 fetch API 的代理。代理配置从 [环境变量](https://docs.deno.com/runtime/reference/env_variables/#special-environment-variables) 中读取：HTTP_PROXY，HTTPS_PROXY 和 NO_PROXY。

如果您使用的是 Windows - 如果未找到环境变量，Deno 将退回到从注册表读取代理。