---
last_modified: 2026-06-17
title: "配置文件 (deno.json)"
description: "每个 deno.json 字段的参考：依赖项和 import map、任务、lint 和 fmt、lockfile、node_modules 目录、TypeScript 编译器选项、unstable 标志、include/exclude、exports、权限、compile 以及 proxies。"
oldUrl:
  - /runtime/manual/basics/modules/import_maps/
  - /runtime/basics/import_maps/
  - /runtime/manual/linking_to_external_code/import_maps
  - /manual/linking_to_external_code/proxies
---

本页文档介绍你可以在 `deno.json`（或 `deno.jsonc`）配置文件中设置的字段。有关 Deno 如何发现并应用配置，以及 `deno.json` 与 `package.json` 的关系概览，请参阅 [配置](/runtime/fundamentals/configuration/) 概念页面。

## 依赖

`deno.json` 中的 `"imports"` 字段允许你指定项目中使用的依赖。你可以用它将裸 specifier 映射到 URL 或文件路径，从而更轻松地管理应用程序中的依赖和模块解析。

例如，如果你想在项目中使用标准库中的 `assert` 模块，你可以使用这个 import map：

```json title="deno.json"
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0",
    "chalk": "npm:chalk@5"
  }
}
```

然后你的脚本就可以使用裸 specifier `@std/assert`：

```js title="script.ts"
import { assertEquals } from "@std/assert";
import chalk from "chalk";

assertEquals(1, 2);
console.log(chalk.yellow("Hello world"));
```

你也可以在 `package.json` 中使用 `"dependencies"` 字段：

```json title="package.json"
{
  "dependencies": {
    "express": "^1.0.0"
  }
}
```

```js title="script.ts"
import express from "express";

const app = express();
```

请注意，这将需要你运行 `deno install`。

了解更多关于 [模块导入和依赖](/runtime/fundamentals/modules/) 的内容

### 自定义路径映射

`deno.json` 中的 import map 可用于更通用地映射 specifier 的路径。你可以将某个精确的 specifier 映射到第三方模块或直接映射到一个文件，也可以将导入 specifier 的一部分映射到某个目录。

```jsonc title="deno.jsonc"
{
  "imports": {
    // 映射到一个精确文件
    "foo": "./some/long/path/foo.ts",
    // 映射到一个目录，使用方式："bar/file.ts"
    "bar/": "./some/folder/bar/"
  }
}
```

用法：

```ts
import * as foo from "foo";
import * as bar from "bar/file.ts";
```

导入 specifier 的路径映射通常用于较大的代码库，以简化书写。

例如：

```json title="deno.json"
{
  "imports": {
    "@/": "./"
  }
}
```

```ts title="main.ts"
import { MyUtil } from "@/util.ts";
```

这会使以 `@/` 开头的导入 specifier 相对于 import map 的 URL 或文件路径进行解析。

### 范围映射

`"scopes"` 字段允许你为从特定路径前缀加载的模块覆盖 import 映射，遵循 [import maps 规范](https://github.com/WICG/import-maps#scoping-examples)。每个键都是一个 scope（路径前缀），其值是一个仅适用于该 scope 下模块的 import map。当两个依赖需要同一包的不同版本时，这非常有用。

```json title="deno.json"
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0"
  },
  "scopes": {
    "./legacy/": {
      "@std/assert": "jsr:@std/assert@^0.224.0"
    }
  }
}
```

在此示例中，`./legacy/` 下的模块会将 `@std/assert` 解析为较旧版本，而项目其余部分使用 `"imports"` 中的版本。

### 覆盖包

`deno.json` 中的 `links` 字段允许你使用磁盘上的本地包来覆盖依赖。这类似于 `npm link`。

```json title="deno.json"
{
  "links": [
    "../some-package"
  ]
}
```

此功能解决了若干常见的开发难题：

- 依赖漏洞修复
- 私有本地库
- 兼容性问题

被引用的包不一定需要发布。它只需要在 `deno.json` 或 `package.json` 中具有正确的包名和元数据，以便 Deno 知道它正在处理哪个包。这提供了更大的灵活性和模块化，同时保持主代码与外部包之间的清晰分离。

## 任务

`deno.json` 文件中的 `tasks` 字段用于定义可通过 `deno task` 命令执行的自定义命令，并允许你根据项目的具体需求定制命令和权限。

它类似于 `package.json` 文件中的 `scripts` 字段，该字段同样受支持。

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

要执行任务，请使用 `deno task` 命令并接上任务名称。例如：

```sh
deno task start
deno task test
deno task lint
deno task dev
deno task build
```

了解更多关于 [`deno task`](/runtime/reference/cli/task/) 的内容。

## 代码检查

`deno.json` 文件中的 `lint` 字段用于配置 Deno 内置代码检查器的行为。这使你可以指定要包含或排除在代码检查之外的文件，并自定义代码检查规则以满足项目需求。

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
- 不检查 `src/testdata/` 目录中的文件或 `src/fixtures/` 目录中的任何 TypeScript 文件。
- 指定应用推荐的代码检查规则，
- 添加 `ban-untagged-todo`，并且
- 排除 `no-unused-vars` 规则。

你可以在 [规则列表](/lint/) 文档页面中找到所有可用代码检查规则的完整列表。

了解更多关于 [使用 Deno 进行代码检查](/runtime/reference/cli/lint/) 的内容。

## 格式化

`deno.json` 文件中的 `fmt` 字段用于配置 Deno 内置代码格式化器的行为。这使你可以自定义代码的格式化方式，确保整个项目的一致性，从而更易于阅读和协作。以下是你可以配置的关键选项：

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
- 将行长度限制为 80 个字符，
- 使用 4 个空格的缩进宽度，
- 在语句末尾添加分号，
- 对字符串使用单引号，
- 保留正文换行，
- 格式化 `src/` 目录中的文件，
- 排除 `src/testdata/` 目录中的文件以及 `src/fixtures/` 目录中的任何 TypeScript 文件。

`fmt` 字段接受以下选项，每项都显示其默认值和允许值：

<div class="fmt-options">

| 选项                                  | 默认值                  | 可选值                                                     |
| ------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `bracePosition`                       | `sameLine`              | `maintain`, `sameLine`, `nextLine`, `sameLineUnlessHanging` |
| `indentWidth`                         | `2`                     | 一个数字                                                   |
| `lineWidth`                           | `80`                    | 一个数字                                                   |
| `newLineKind`                          | `lf`                    | `auto`, `crlf`, `lf`, `system`                              |
| `nextControlFlowPosition`             | `sameLine`              | `sameLine`, `nextLine`, `maintain`                          |
| `operatorPosition`                    | `sameLine`              | `sameLine`, `nextLine`, `maintain`                          |
| `proseWrap`                           | `always`                | `always`, `never`, `preserve`                               |
| `quoteProps`                          | `asNeeded`              | `asNeeded`, `consistent`, `preserve`                        |
| `semiColons`                          | `true`                  | `true`, `false`                                             |
| `singleBodyPosition`                  | `sameLineUnlessHanging` | `sameLine`, `nextLine`, `maintain`, `sameLineUnlessHanging` |
| `singleQuote`                         | `false`                 | `true`, `false`                                             |
| `spaceAround`                         | `false`                 | `true`, `false`                                             |
| `spaceSurroundingProperties`          | `true`                  | `true`, `false`                                             |
| `trailingCommas`                      | `always`                | `always`, `never`                                           |
| `typeLiteral.separatorKind`           | `semiColon`             | `comma`, `semiColon`                                        |
| `useBraces`                           | `whenNotSingleLine`     | `maintain`, `whenNotSingleLine`, `always`, `preferNone`     |
| `useTabs`                             | `false`                 | `true`, `false`                                             |
| `jsx.bracketPosition`                 | `nextLine`              | `maintain`, `sameLine`, `nextLine`                          |
| `jsx.forceNewLinesSurroundingContent` | `false`                 | `true`, `false`                                             |
| `jsx.multiLineParens`                 | `prefer`                | `never`, `prefer`, `always`                                 |
| `unstable-component`                  | `false`                 | `true`, `false`                                             |
| `unstable-sql`                        | `false`                 | `true`, `false`                                             |

</div>

了解更多关于 [使用 Deno 格式化代码](/runtime/lint_and_format/) 的内容。

## Lockfile

`deno.json` 文件中的 `lock` 字段用于指定 Deno 用来 [确保依赖完整性](/runtime/packages/#lockfile-and-reproducible-installs) 的锁文件配置。锁文件会记录项目所依赖模块的确切版本和完整性哈希，确保每次运行项目时都使用相同版本，即使这些依赖在远程已更新或更改。

```json title="deno.json"
{
  "lock": {
    "path": "./deno.lock",
    "frozen": true
  }
}
```

此配置将：

- 指定锁文件位置为 `./deno.lock`（这是默认值，可省略）
- 告诉 Deno：如果任何依赖发生变化，就报错

Deno 默认使用锁文件，你可以使用以下配置将其禁用：

```json title="deno.json"
{
  "lock": false
}
```

## 最小依赖年龄

`minimumDependencyAge` 字段会阻止 Deno 安装发布时间晚于所配置时长的 npm 或 JSR 包版本。刚发布的恶意版本通常会在几天内被检测并撤下，因此设置一个较小的延迟窗口可以捕获大部分供应链攻击。关于如何选择窗口，请参阅 [供应链管理](/runtime/packages/supply_chain/)。

```jsonc title="deno.json"
{
  // 不要安装发布时间不足 3 天的版本
  "minimumDependencyAge": "P3D"
}
```

该值可接受 [ISO-8601 持续时间](https://en.wikipedia.org/wiki/ISO_8601#Durations)，例如 `P3D` 或 `PT72H`，也可以是分钟数（`120`）、绝对截止日期（`2025-09-16`）或 RFC3339 时间戳，或者使用 `0` 来禁用。

如需排除特定包，请使用带有 `exclude` 列表的对象形式：

```jsonc title="deno.json"
{
  "minimumDependencyAge": {
    "age": "P3D",
    "exclude": ["npm:@mycompany/cli", "jsr:@mycompany/lib"]
  }
}
```

同样的控制也可以通过 `--minimum-dependency-age` CLI 标志以及在 [`.npmrc`](/runtime/fundamentals/node/#.npmrc-configuration) 中使用 `min-release-age` 来实现。

## Node 模块目录

默认情况下，如果你的项目目录中有 `package.json` 文件，Deno 会使用本地的 `node_modules` 目录。

你可以使用 `deno.json` 文件中的 `nodeModulesDir` 字段来控制这一行为。

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

你可以将此字段设置为以下值：

| 值           | 行为                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `"none"`     | 不使用本地 `node_modules` 目录。改为使用 `$DENO_DIR` 中由 Deno 自动保持最新的全局缓存。                                             |
| `"auto"`     | 使用本地 `node_modules` 目录。该目录会由 Deno 自动创建并保持最新。                                                                  |
| `"manual"`   | 使用本地 `node_modules` 目录。用户必须手动保持该目录为最新，例如使用 `deno install` 或 `npm install`。                              |

无需显式指定此设置，会应用以下默认值：

- 如果项目目录中没有 `package.json` 文件，则为 `"none"`
- 如果项目目录中有 `package.json` 文件，则为 `"manual"`

在使用工作区时，此设置只能在工作区根目录中使用。在任何成员中指定它都会产生警告。只有当工作区根目录中存在 `package.json` 文件时，`"manual"` 设置才会自动应用。

## TypeScript 编译器选项

`deno.json` 文件中的 `compilerOptions` 字段用于为你的 Deno 项目配置 [TypeScript 编译器设置](https://www.typescriptlang.org/tsconfig)。这使你可以自定义 TypeScript 代码的编译方式，确保其符合你的项目需求和编码规范。

:::info

Deno 推荐使用默认的 TypeScript 配置。这在共享代码时会有帮助。

:::

如果你正在从 Node.js 迁移，你现有的 `tsconfig.json` 文件可以直接与 Deno 一起使用。有关支持的字段和优先级规则，请参阅 [tsconfig.json 兼容性参考](/runtime/reference/ts_config_migration/)。

关于受支持的编译器选项、库配置和高级设置的完整列表，请参阅 [配置 TypeScript](/runtime/reference/ts_config_migration/)。

## 不稳定特性

`deno.json` 文件中的 `unstable` 字段用于为你的 Deno 项目启用特定的不稳定特性。

这些特性仍在开发中，尚未成为稳定 API 的一部分。通过在 `unstable` 数组中列出这些特性，你可以在它们正式发布前进行试验并使用这些新能力。

```json title="deno.json"
{
  "unstable": ["cron", "kv", "webgpu"]
}
```

[了解更多](/runtime/reference/cli/unstable_flags/)。

## include 和 exclude

许多配置项（如 `lint`、`fmt`）都有 `include` 和 `exclude` 属性，用于指定要包含的文件。

### include

只会包含此处指定的路径或模式。

```jsonc
{
  "lint": {
    // 仅格式化 src/ 目录
    "include": ["src/"]
  }
}
```

### exclude

此处指定的路径或模式将被排除。

```jsonc
{
  "lint": {
    // 不对 dist/ 文件夹进行 lint
    "exclude": ["dist/"]
  }
}
```

它的优先级高于 `include`；如果某个路径同时匹配 `include` 和 `exclude`，则会以 `exclude` 为准。

你可能希望排除某个目录，但包含其子目录。在 Deno 1.41.2+ 中，你可以通过在更通用的排除规则下方指定一个取反的 glob 来取消排除更具体的路径：

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

### 顶层 exclude

如果有某个目录你绝不希望 Deno 对其进行 fmt、lint、类型检查、在 LSP 中分析等，那么请在顶层 exclude 数组中指定它：

```jsonc
{
  "exclude": [
    // 从所有子命令和 LSP 中排除 dist 文件夹
    "dist/"
  ]
}
```

有时你可能希望取消排除某个在顶层 exclude 中被排除的路径或模式。在 Deno 1.41.2+ 中，你可以在更具体的配置中指定一个取反的 glob 来取消排除某个路径：

```jsonc
{
  "fmt": {
    "exclude": [
      // 即使 dist 文件夹在顶层被排除，
      // 也要格式化它
      "!dist"
    ]
  },
  "exclude": [
    "dist/"
  ]
}
```

### 发布 - 覆盖 .gitignore

`deno publish` 命令会考虑 `.gitignore`。在 Deno 1.41.2+ 中，你可以通过使用取反的 exclude glob 来选择不忽略 `.gitignore` 中被忽略的文件：

```title=".gitignore"
dist/
.env
```

```jsonc title="deno.json"
{
  "publish": {
    "exclude": [
      // 包含被 .gitignore 忽略的 dist 文件夹
      "!dist/"
    ]
  }
}
```

另外，也可以在 `"include"` 中显式指定被 gitignore 的路径：

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

## 导出

`deno.json` 文件中的 `exports` 字段允许你定义包中的哪些路径应可公开访问。这对于控制包的 API 暴露面并确保只有预期的代码部分对用户可见尤其有用。

```jsonc title="deno.json"
{
  "exports": "./src/mod.ts" // 默认入口点
}
```

你也可以定义多个入口点：

```json title="deno.json"
{
  "exports": {
    "./module1": "./src/module1.ts",
    "./module2": "./src/module2.ts",
    ".": "./src/mod.ts" // 默认入口点
  }
}
```

此配置将会：

- 将 `module1` 和 `module2` 作为你的包的入口点暴露出来，并且
- 将 `./src/mod.ts` 设为默认入口点（`.`）。

用户可以使用指定的路径导入这些模块，而你包中的其他文件仍保持私有。

要在代码中使用这些导出，你可以这样导入：

```ts title="example.ts"
import * as module_1 from "@example/my-package/module1";
import * as module_2 from "@example/my-package/module2";
```

## 权限

Deno 2.5+ 支持在配置文件中存储 [权限](/runtime/reference/permissions/) 集。

### 命名权限

权限可以在 `"permissions"` 键下，以任意命名的权限集中的键值对形式定义。对于每个权限集：

- 键是一个 [权限](/runtime/reference/permissions/) 的名称，在 CLI 调用中它会跟在 `--allow-` 或 `--deny-` 后面（即 `read`、`write`、`net`、`env`、`sys`、`run`、`ffi`、`import`）
- 值可以是布尔值（`true` / `false` 分别对应允许 / 拒绝）、表示路径、域名等的字符串数组，或包含 `allow`、`deny` 和/或 `ignore` 布尔键值对的对象。

```jsonc
{
  "permissions": {
    "read-data": {
      "read": "./data"
    },
    "read-and-write": {
      "read": true,
      "write": ["./data"]
    }
  }
}
```

可以通过指定 `--permission-set=<name>` 或 `-P=<name>` 标志来使用权限集：

```sh
$ deno run -P=read-data main.ts
```

### 默认权限

特殊的 `"default"` 权限键允许在使用 `--permission-set`/`-P` 标志时省略名称：

```jsonc
{
  "permissions": {
    "default": {
      "env": true
    }
  }
}
```

然后只需使用 `-P` 运行：

```sh
$ deno run -P main.ts
```

### allow、deny 和 ignore

为了对权限进行更精细的控制，你可以使用带有 `allow`、`deny` 和 `ignore` 键的对象形式。当你需要比简单的布尔值或数组值提供的更细粒度的权限控制时，这一点尤其有用。

#### 对象形式语法

而不是将权限指定为布尔值或数组：

```jsonc
{
  "permissions": {
    "default": {
      "read": true, // 简单布尔形式
      "write": ["./data"] // 简单数组形式
    }
  }
}
```

你可以使用对象形式：

```jsonc
{
  "permissions": {
    "default": {
      "read": {
        "allow": ["./data", "./config"],
        "deny": ["./data/secrets"],
        "ignore": ["./data/cache"]
      },
      "write": {
        "allow": ["./output"],
        "deny": ["./output/system"]
      }
    }
  }
}
```

#### 可用权限

`allow`、`deny` 和 `ignore` 键的工作方式会因权限类型而异：

- **`read` 和 `env`**：支持 `allow`、`deny` 和 `ignore`
- **`write`、`net`、`run`、`ffi`、`sys` 和 `import`**：支持 `allow` 和 `deny`（不支持 `ignore`）

#### 行为

- **`allow`**：显式授予对特定资源的访问权限。可以是 `true`（允许全部）、`false`（不允许任何）、或者允许的特定路径/值数组。
- **`deny`**：显式拒绝访问特定资源（抛出 [PermissionDenied](https://docs.deno.com/api/deno/~/Deno.errors.PermissionDenied)），即使这些资源在其他情况下本应被允许。可以是 `true`（拒绝全部）、`false`（拒绝任何）、或者拒绝的特定路径/值数组。
- **`ignore`**：（仅适用于 `read` 和 `env` 权限）静默忽略对特定资源的访问尝试，而不抛出错误。可以是 `true`、`false`，或者要忽略的特定路径/值数组。

#### 示例

```jsonc
{
  "permissions": {
    "default": {
      // 允许从 data 目录读取，但拒绝访问 secrets，
      // 并静默忽略 cache 文件
      "read": {
        "allow": ["./data"],
        "deny": ["./data/secrets"],
        "ignore": ["./data/cache"]
      },
      // 允许所有环境变量，除了 API 密钥
      "env": {
        "allow": true,
        "ignore": ["API_KEY", "SECRET_TOKEN"]
      },
      // 允许全部，但拒绝 'rm'、'sudo'
      "run": {
        "allow": true,
        "deny": ["rm", "sudo"]
      }
    }
  }
}
```

### 测试、基准测试和编译权限

可以在 `"test"`、`"bench"` 或 `"compile"` 键内可选地指定权限。

```jsonc
{
  "test": {
    "permissions": {
      "read": ["./data"]
    }
  }
}
```

或者引用一个权限集：

```jsonc
{
  "test": {
    "permissions": "read-data"
  },
  "permissions": {
    "read-data": {
      "read": ["./data"]
    }
  }
}
```

定义后，你必须使用 `-P` 或权限标志运行 `deno test`：

```
> deno test
error: 在配置文件中发现了测试权限。你是想使用 `-P` 运行吗？
    at file:///Users/david/dev/example/deno.json
> deno test -P
...运行...
> deno test --allow-read
...运行...
> deno test -A
...运行...
```

这样做是为了帮助你避免在忘记以权限方式运行时，还要花时间困惑为什么某些东西不起作用。

请注意，工作区中的 test 和 bench 文件会使用最近的 `deno.json` 来确定 `test` 和 `bench` 权限。这允许为不同的工作区成员分配不同的权限。

### 安全风险

配置文件中权限的威胁模型与 `deno task` 类似，因为脚本可能会修改 `deno.json` 以提升权限。这就是为什么它需要通过 `-P` 显式启用，并且默认不会加载。

如果你可以接受这种风险，那么这个特性会对你很有用。

## 编译配置

`"compile"` 块用于配置
[`deno compile`](/runtime/reference/cli/compile/)，无需你在每次调用时重复传递标志。你可以声明要打包进可执行文件的额外文件或目录，以及要排除的路径：

```jsonc title="deno.json"
{
  "compile": {
    "include": ["names.csv", "data", "worker.ts"],
    "exclude": ["data/secrets", "**/*.test.ts"]
  }
}
```

命令行中的 `--include` 和 `--exclude` 标志会与这些列表合并，而不是替换它们。`"compile"` 块还可以携带 `permissions`（参见
[测试、基准测试和编译权限](#test-bench-and-compile-permissions)）。

## 一个 `deno.json` 文件示例

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "permissions": {
    "default": {
      "read": {
        "allow": ["./src/"],
        "deny": ["./src/secrets/"]
      },
      "env": {
        "allow": true,
        "ignore": ["TEMP_*"]
      }
    }
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

这是一个配置了 TypeScript 编译器选项、代码检查器、格式化工具、node modules 目录等内容的 `deno.json` 文件示例。有关可用字段和配置的完整列表，请参阅
[Deno 配置文件模式](#json-schema)。

## JSON 模式

编辑器可使用一个 JSON 模式文件来提供自动补全。该文件有版本管理，并可在以下地址获取：
[https://github.com/denoland/deno/blob/main/cli/schemas/config-file.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/config-file.v1.json)

## 代理

Deno 支持模块下载和 fetch API 的代理。代理配置从
[环境变量](https://docs.deno.com/runtime/reference/env_variables/#special-environment-variables)中读取：
HTTP_PROXY、HTTPS_PROXY 和 NO_PROXY。

如果你使用的是 Windows——如果找不到环境变量，Deno 会回退到从注册表中读取代理。
