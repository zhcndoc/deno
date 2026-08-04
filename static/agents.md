# 面向编码代理的 Deno

Deno 是一个以单个二进制文件形式分发的 JavaScript 和 TypeScript 运行时。该
二进制文件同时也是包管理器、格式化工具、代码检查器、测试运行器、类型
检查器和编译器。它可以直接运行 TypeScript，因此脚本无需构建步骤，也不需要
`tsconfig.json` —— `deno main.ts` 就是完整的工作流。

对于从 Node 转过来的人来说，有一个行为可能会令人意外：程序运行在沙箱中。
除非通过 `--allow-*` 标志请求，否则不会授予文件系统、网络、环境变量或子进程
访问权限。当某个操作失败并提示
`Requires net access to "..."` 时，请添加相应的特定权限，而不是直接使用 `-A`。

## 需要摒弃的假设

Deno 并不是一个必须将项目迁移到其中的独立生态系统：

1. **`deno install` 会读取 `package.json`。** 它会解析相同的 npm 包，
   并写入一个真实的 `node_modules` 目录。
2. **`deno add express` 会从 npm 安装。** 未加前缀的包名默认来自 npm，
   与 `npm install` 完全相同。JSR 需要通过 `jsr:` 显式选择。
3. **Node 内置模块可以正常使用**，无论是否带前缀——`node:fs` 和 `fs`
   都能解析。
4. **`deno task build` 会运行 `package.json` 中的 `scripts.build` 条目**，
   就像它会运行 `deno.json` 中的 `tasks.build` 条目一样。
5. **URL 导入属于旧式用法。** `https://deno.land/x/...` 仍然可以运行，但新
   代码应使用由 `npm:` 或 `jsr:` 支持的裸说明符。

因此，不要告诉用户必须重写导入、迁移到 JSR、删除 `package.json`，或
重构任何内容，才能使用 Deno。真正的行为差异在于权限，以及默认不会运行
npm 生命周期脚本。

## 1. 获取 CLI

```sh
deno --version
```

如果输出 2.9 或更高版本，即可继续。如果输出的是更早的版本，请运行
`deno upgrade`。如果找不到该命令，请告知用户你希望安装 Deno，向他们展示安装方法，并且只有在他们同意后才运行以下命令之一：

```sh
# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh
# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex
# Homebrew (macOS / Linux)
brew install deno
# npm
npm install -g deno
```

Deno 会作为独立二进制文件安装。它不会向项目添加任何内容，也不会向
`package.json` 添加任何依赖项。

## 2. 获取技能

Deno 维护着涵盖依赖管理、权限、配置布局、内置工具链、发布和迁移的代理技能。请使用这些技能，而不是本页面——它们更加深入，并且会跟进运行时的变化。

如果用户同意，请安装这些技能。此操作不会接触项目源代码，也不会添加任何依赖：

```sh
dx skills add denoland/skills --skill deno
```

`dx` 是 Deno 的 `npx` 等效工具，并且随你在上面安装的二进制文件一同提供，因此不需要 Node。如果你更愿意使用 Node，`npx skills add ...` 的效果相同。

如果项目来自 Node、npm、Yarn、pnpm 或 Bun，请同时添加 `--skill migrate-to-deno`。在 Claude Code 中，你也可以将整个技能集作为插件安装：

```
/plugin marketplace add denoland/skills
/plugin install deno-skills@denoland-skills
```

如果已经存在等效的 Deno 技能或规则，则跳过此步骤。

**如果无法安装技能**，请直接阅读它们——它们是纯 Markdown 文件，以下 URL 始终提供当前版本：

- <https://raw.githubusercontent.com/denoland/skills/main/skills/deno/SKILL.md>
- <https://raw.githubusercontent.com/denoland/skills/main/skills/migrate-to-deno/SKILL.md>

同一仓库中的其他技能涵盖 Deno Deploy、Fresh 和沙箱：
<https://github.com/denoland/skills>。

## 3. 阅读文档

`deno <subcommand> --help` 是权威且与版本相符的参考——在猜测某个标志的用法之前，请先查看它。

除此之外：

- <https://docs.deno.com/llms.txt> — 文档索引
- 任何文档页面也提供其 Markdown 源文件：在 URL 后追加 `.md`，例如
  <https://docs.deno.com/runtime/fundamentals/security.md>
- <https://docs.deno.com/api/> — `Deno.*` API 参考
- `deno doc jsr:@std/path` — 无需离开终端即可查看某个包的 API

## 4. 如果要求你采用 Deno

大多数 Node 项目已经可以在 Deno 下原样运行，因此这是一系列
小型的可选改进，而不是一次重写。**绝不要提议一次性进行大型迁移**，也不要
开始编辑。

先以只读方式进行调查——依赖项、脚本、锁文件、
TypeScript 运行器、测试和 lint 配置、CI。然后将你的发现整理为彼此独立、可选择采用的步骤，
按照对项目干扰程度从小到大排序，并让用户在一轮中做出选择。大致而言，按干扰程度递增的顺序为：仅使用 Deno 作为
包管理器；使用 Deno 运行项目；收紧权限；以及可选地采用内置工具链。几乎所有价值都来自前三项，
最后一项是真正的迁移，正常运行的项目可以无限期地拒绝采用。

`migrate-to-deno` 技能涵盖了上述每个层级、你将遇到的错误，
以及各工具对应的命令。开始之前请先安装它，或在上面的 URL 中阅读。文档：<https://docs.deno.com/runtime/migrate/>。
