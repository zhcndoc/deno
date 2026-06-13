---
last_modified: 2026-05-20
title: "依赖管理"
description: "将 Deno 用作 npm 和 JSR 的包管理器：安装、添加、更新、审计和检查依赖，管理锁文件和生命周期脚本，并覆盖包。"
oldUrl:
  - /runtime/fundamentals/dependency_management/
  - /runtime/manual/basics/modules/integrity_checking/
  - /runtime/manual/basics/modules/reloading_modules/
  - /runtime/manual/basics/vendoring/
  - /runtime/manual/advanced/http_imports/
  - /runtime/manual/examples/manage_dependencies
  - /runtime/manual/node/cdns.md
  - /runtime/manual/linking_to_external_code/reloading_modules
  - /runtime/fundamentals/esm.sh
---

Deno 是一个完整的 npm 和 [JSR](https://jsr.io) 包管理器，内置于
`deno` 二进制文件中。它可以与 `deno.json`、`package.json`，或者两者
同时配合使用，并且默认是安全的：除非你批准，npm 生命周期脚本不会运行。
本页介绍日常工作流程；[工具表](#the-dependency-toolbelt)列出了所有命令。

## 快速开始

在一个已经声明依赖项的项目中（在 `package.json` 或 `deno.json` 中），
使用以下命令安装它们：

```sh
deno install
```

从 npm 或 JSR 添加一个新依赖。未加前缀的名称表示 npm 包，就像 `npm install`：

```sh
deno install express            # 任意 npm 包
deno install jsr:@std/assert    # 一个 JSR 包
```

该依赖会记录在你项目的配置文件中，你可以通过其裸名称导入它：

```ts
import express from "express";
import { assertEquals } from "@std/assert";
```

## 依赖工具箱

每个依赖任务都有一个内置子命令。以下每个命令都链接到其完整参考文档：

| Command                                                           | 作用                                              |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| [`deno install`](/runtime/reference/cli/install/)                 | 安装项目依赖（或使用 `-g` 安装工具） |
| [`deno add`](/runtime/reference/cli/add/)                         | 将依赖添加到配置文件                       |
| [`deno remove`](/runtime/reference/cli/remove/)                   | 从配置文件中移除依赖                  |
| [`deno outdated`](/runtime/reference/cli/outdated/)               | 列出有新版本的依赖                     |
| [`deno update`](/runtime/reference/cli/update/)                   | 将依赖更新到更新的版本                     |
| [`deno why`](/runtime/reference/cli/why/)                         | 解释某个包为何出现在你的依赖树中          |
| [`deno info`](/runtime/reference/cli/info/)                       | 显示模块的完整依赖图和缓存详情   |
| [`deno audit`](/runtime/reference/cli/audit/)                     | 检查已安装依赖中的已知漏洞    |
| [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) | 批准特定包的 npm 生命周期脚本       |
| [`deno ci`](/runtime/reference/cli/ci/)                           | 为 CI 执行干净、严格遵循锁文件的安装（类似 `npm ci`）     |
| [`deno publish`](/runtime/reference/cli/publish/)                 | 将包发布到 JSR                                  |
| [`deno pack`](/runtime/reference/cli/pack/)                       | 从 Deno 包构建一个兼容 npm 的 tarball       |
| [`deno uninstall`](/runtime/reference/cli/uninstall/)             | 移除全局安装的工具                          |
| [`deno clean`](/runtime/reference/cli/clean/)                     | 移除全局模块缓存                            |

## 选择版本

你可以为正在导入的包指定一个版本范围。
这是通过使用 `@` 符号后跟版本范围说明符来完成的，并遵循 [semver](https://semver.org/) 版本规范。
如果你需要在多个工作区成员之间共享同一个版本范围，请参见
[`catalog:` 用于集中管理依赖版本](/runtime/fundamentals/workspaces/#centralized-dependency-versions-with-catalog)。

例如：

```bash
@scopename/mypackage           # 最高版本
@scopename/mypackage@16.1.0    # 精确版本
@scopename/mypackage@16        # 最高的 16.x 版本 >= 16.0.0
@scopename/mypackage@^16.1.0   # 最高的 16.x 版本 >= 16.1.0
@scopename/mypackage@~16.1.0   # 最高的 16.1.x 版本 >= 16.1.0
```

下面是你可以指定版本或范围的所有方式概览：

| Symbol    | 描述                                                                                                                                                         | 示例   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `1.2.3`   | 精确版本。只会使用这个特定版本。                                                                                                          | `1.2.3`   |
| `^1.2.3`  | 与 1.2.3 版本兼容。允许不会改变最左侧非零数字的更新。 <br>例如，允许 `1.2.4` 和 `1.3.0`，但不允许 `2.0.0`。 | `^1.2.3`  |
| `~1.2.3`  | 大致等同于 1.2.3 版本。允许补丁版本更新。 <br>例如，允许 `1.2.4`，但不允许 `1.3.0`。                           | `~1.2.3`  |
| `>=1.2.3` | 大于或等于 1.2.3 版本。允许任何 `1.2.3` 或更高版本。                                                                                   | `>=1.2.3` |
| `<=1.2.3` | 小于或等于 1.2.3 版本。允许任何 `1.2.3` 或更低版本。                                                                                       | `<=1.2.3` |
| `>1.2.3`  | 大于 1.2.3 版本。只允许高于 `1.2.3` 的版本。                                                                                          | `>1.2.3`  |
| `<1.2.3`  | 小于 1.2.3 版本。只允许低于 `1.2.3` 的版本。                                                                                              | `<1.2.3`  |
| `1.2.x`   | 1.2 次版本内的任意补丁版本。例如，`1.2.0`、`1.2.1` 等。                                                                                 | `1.2.x`   |
| `1.x`     | 1 主版本内的任意次版本和补丁版本。例如，`1.0.0`、`1.1.0`、`1.2.0` 等。                                                                | `1.x`     |
| `*`       | 允许任何版本。                                                                                                                                             | `*`       |

## 检查和更新依赖

查看哪些依赖有更新的版本，然后更新它们：

```sh
deno outdated      # 显示哪些版本落后，但不做任何更改
deno update        # 更新到最新的 semver 兼容版本
deno update --latest   # 忽略 semver 范围并升级到最新发布版本
```

当你想知道某个包来自哪里时，
[`deno why`](/runtime/reference/cli/why/) 会打印出通往它的每一条依赖路径：

```sh
deno why npm:kleur
```

[`deno info`](/runtime/reference/cli/info/) 会显示某个模块的完整依赖图，
包括大小和缓存位置，适用于你的入口点或任何指定符：

```sh
deno info main.ts
deno info jsr:@std/http
```

## 审计漏洞

[`deno audit`](/runtime/reference/cli/audit/) 会将你已安装的依赖与漏洞数据库进行比对检查：

```sh
deno audit                 # 报告已知漏洞
deno audit --level=high    # 仅高危和严重级别
deno audit --fix           # 自动升级受影响的包
deno audit --socket        # 使用 socket.dev 数据库进行检查
```

审计只是长期保持依赖树安全的一部分。有关更广泛的实践，请参见
[供应链管理](/runtime/packages/supply_chain/)：最低依赖年龄、锁文件纪律以及推荐的 CI 基线。

## 生命周期脚本

与 npm 不同，Deno 默认不会运行 `preinstall`/`postinstall` 脚本：包的安装脚本是常见攻击向量，因此运行它们需要显式授权。
当某个依赖确实需要其脚本时（例如原生插件），请显式允许它：

```sh
deno install --allow-scripts=npm:better-sqlite3
```

或者通过
[`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) 以交互方式管理批准。只有在使用 `node_modules` 目录时，脚本才会执行。

## 锁文件和可复现安装

Deno 会自动维护一个 `deno.lock` 文件，记录每个依赖的精确版本和完整性哈希，并在后续运行中验证它。请将其提交到版本控制中。
在 CI 和生产环境中，请使用
[`deno ci`](/runtime/reference/cli/ci/) 严格从锁文件安装；如果 `deno.lock` 缺失或已过期，它会报错，而不是静默解析新版本：

```sh
deno ci          # 类似 npm ci
deno ci --prod   # 另外跳过 devDependencies
```

你也可以通过 `--frozen` 在任何命令上强制使用冻结锁文件，或者在
[`deno.json`](/runtime/reference/deno_json/#lockfile) 中配置锁文件的行为和路径。
关于这为何重要，以及当锁文件与你“作对”时该怎么做，请参见
[供应链管理](/runtime/packages/supply_chain/)。

## node_modules 和缓存

默认情况下，Deno 会将依赖存储在全局缓存中，并且只有当你的项目有 `package.json` 时才会创建本地 `node_modules` 目录。可通过
[`deno.json`](/runtime/reference/deno_json/#node-modules-directory) 中的 `nodeModulesDir` 选项来控制这一点。

默认情况下，Deno 使用全局缓存目录（`DENO_DIR`）来存放下载的依赖。这个缓存会在所有项目之间共享。

你可以使用 `--reload` 标志强制 deno 重新获取并将模块重新编译到缓存中。

```bash
# 重新加载全部内容
deno run --reload my_module.ts

# 重新加载特定模块
deno run --reload=jsr:@std/fs my_module.ts
```

反过来也可以：`--cached-only` 会完全禁止网络访问，并且如果依赖树中的任何内容尚未缓存就会失败，这对于离线工作和可复现的 CI 很有用：

```shell
deno run --cached-only mod.ts
```

### 本地化远程模块

如果你的项目有外部依赖，你可能希望将它们存储在本地，以避免每次构建项目时都从互联网下载它们。这在 CI 服务器或 Docker 容器中构建项目时尤其有用，也适用于打补丁或以其他方式修改远程依赖。

Deno 通过你 `deno.json` 文件中的一个设置提供此功能：

```json
{
  "vendor": true
}
```

将上面的片段添加到你的 `deno.json` 文件中后，Deno 会在项目运行时将所有依赖本地缓存到 `vendor` 目录中；或者你也可以选择立即运行 `deno install --entrypoint` 命令来立刻缓存这些依赖：

```bash
deno install --entrypoint main.ts
```

然后你就可以像往常一样使用 `deno run` 运行应用程序：

```bash
deno run main.ts
```

在完成本地化后，你可以在没有互联网访问的情况下使用 `--cached-only` 标志运行 `main.ts`，这会强制 Deno 只使用本地可用的模块。

对于更高级的覆盖方式，例如在开发期间替换依赖，请参见[覆盖依赖](#overriding-dependencies)。

## 覆盖依赖

Deno 提供了覆盖依赖的机制，使开发者能够在开发或测试期间使用库的自定义版本或本地版本。

注意：如果你需要在本地缓存并修改依赖以便跨构建使用，请考虑[对远程模块进行 vendoring](#vendoring-remote-modules)。

### 覆盖本地包

对于熟悉 Node.js 中 `npm link` 的开发者，Deno 通过 `deno.json` 中的 `links` 字段为本地 JSR 和 npm 包提供了类似功能。这使你可以在开发期间使用本地版本覆盖依赖，而无需发布它们。

示例：

```json title="deno.json"
{
  "links": [
    "../some-package-or-workspace"
  ]
}
```

要点：

- `links` 字段接受指向包含包或工作区的目录路径。如果你引用的是工作区中的单个包，则整个工作区都会被包含进来。
- 同时支持 JSR 和 npm 包。
- 此功能仅在工作区根目录中生效。在其他位置使用 `links` 会触发警告。

限制：

- 不支持基于 Git 的依赖覆盖。
- `links` 字段要求在工作区根目录中进行正确配置。

### 覆盖 NPM 包

Deno 支持将 npm 包链接到本地版本，类似于 JSR 包可以被链接的方式。这使你可以在开发期间使用 npm 包的本地副本，而无需发布它。

要使用本地 npm 包，请在你的 `deno.json` 中配置 `links` 字段：

```json
{
  "links": [
    "../path/to/local_npm_package"
  ]
}
```

此功能需要一个 `node_modules` 目录，并且会根据你的 `nodeModulesDir` 设置表现出不同的行为：

- 使用 `"nodeModulesDir": "auto"`：该目录会在每次运行时重新创建，这会略微增加启动时间，但可确保始终使用最新版本。
- 使用 `"nodeModulesDir": "manual"`（使用 package.json 时的默认值）：你必须在更新包后运行 `deno install`，才能将更改写入工作区的 `node_modules` 目录。

限制：

- 指定 npm 包的本地副本或更改其依赖项，会从锁文件中清除 npm 包，这可能导致 npm 解析行为不同。
- 即使你使用的是本地副本，npm 包名称也必须存在于注册表中。

### 覆盖 HTTPS 导入

Deno 还允许通过 `deno.json` 中的 `scopes` 字段覆盖 HTTPS 导入。此功能在将远程依赖替换为本地补丁版本以进行调试或临时修复时尤其有用。

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

要点：

- 导入映射中的 `scopes` 字段允许你将特定导入重定向到其他路径。
- 这通常用于在测试或开发环境中使用本地文件覆盖远程依赖。
- 作用域只应用于项目根目录。依赖项中的嵌套作用域会被忽略。

## 仅开发时依赖

有时依赖只在开发期间需要，例如测试文件的依赖或构建工具的依赖。在 Deno 中，运行时不要求你区分开发依赖和生产依赖，因为[运行时只会加载和安装正在执行的代码中实际使用到的依赖](#why-does-deno-not-have-a-devimports-field)。

不过，为了帮助阅读你包的人，标记开发依赖仍然很有用。在使用 `deno.json` 时，惯例是在任何“仅开发”依赖后添加 `// dev` 注释：

```json title="deno.json"
{
  "imports": {
    "@std/fs": "jsr:@std/fs@1",
    "@std/testing": "jsr:@std/testing@1" // 开发
  }
}
```

使用 `package.json` 文件时，开发依赖可以添加到单独的 `devDependencies` 字段中：

```json title="package.json"
{
  "dependencies": {
    "pg": "npm:pg@^8.0.0"
  },
  "devDependencies": {
    "prettier": "^3"
  }
}
```

### package.json 中的 JSR 包

你可以直接在 `package.json` 中使用 `jsr:` 协议依赖 JSR 包，而无需单独的 `deno.json`：

```json title="package.json"
{
  "dependencies": {
    "@std/path": "jsr:^1.0.9"
  }
}
```

这与 `deno install` 配合良好，并将 JSR 包带入任何使用 `package.json` 进行依赖管理的项目。

### 依赖覆盖

`package.json` 中的 `overrides` 字段允许你控制整个依赖树中的传递依赖版本。这对于应用安全补丁、修复版本兼容性问题或替换包很有用：

```json title="package.json"
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "overrides": {
    "cookie": "0.7.0",
    "express": {
      "qs": "6.13.0"
    }
  }
}
```

在这个示例中，`cookie` 在全局范围内被固定为 `0.7.0`，而 `qs` 仅在 `express` 需要时被覆盖。

### 为什么 Deno 没有 `devImports` 字段？

要理解为什么 Deno 不在包清单中单独区分开发依赖，重要的是先理解开发依赖试图解决什么问题。

在部署应用程序时，你通常只希望安装在正在执行的代码中实际使用到的依赖。这有助于加快启动时间并减小部署后应用程序的体积。

从历史上看，这通常通过在 `package.json` 中将开发依赖分离到 `devDependencies` 字段来实现。在部署应用程序时，不会安装 `devDependencies`，只安装普通依赖。

这种做法在实践中被证明存在问题。当某个依赖从运行时依赖变为开发依赖时，很容易忘记将其从 `dependencies` 移到 `devDependencies`。此外，一些语义上属于“开发阶段”的依赖，例如 (`@types/*`)，在 `package.json` 文件中也经常被定义在 `dependencies` 中，这意味着它们即使在生产环境中并不需要，也会被安装。

Deno 提供了两种仅安装生产依赖的方法：

- **`deno install --prod`** —— 跳过 `package.json` 中的 `devDependencies`。你也可以传入 `--skip-types` 以进一步排除 `@types/*` 包。
- **`deno install --entrypoint`** —— 仅安装由指定入口文件实际（传递地）导入的依赖。与 `--prod` 结合使用时，模块图中也会排除仅类型依赖。

更多详情请参见 [`deno install` 参考文档](/runtime/reference/cli/install/)。

## HTTPS 导入

Deno 可以直接从 `https:` URL 导入模块，可以内联导入，也可以在 `deno.json` 中映射导入。这适合小型单文件脚本，但对于应用程序更推荐使用注册表（JSR、npm）：HTTPS 导入可能在不同文件间漂移到不同版本，不能由 `deno add`/`deno install` 管理，而且依赖所服务的主机。要固定并本地化它们，请参见[vendoring](#vendoring-remote-modules)。

## 深入了解

- **[发布包](/runtime/packages/publishing/)**：JSR、通过 `deno pack` 发布 npm，以及选择注册表。
- **[供应链管理](/runtime/packages/supply_chain/)**：锁文件规范、最小依赖年龄、审计工作流，以及 CI 基线。
- **[私有仓库](/runtime/packages/private_repositories/)**：使用 `DENO_AUTH_TOKENS` 对远程模块主机进行身份验证。对于私有 npm 注册表，请参见[npm 支持](/runtime/fundamentals/node/#private-registries)。
