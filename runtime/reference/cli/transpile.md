---
last_modified: 2026-05-20
title: "deno transpile"
command: transpile
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno transpile"
description: "将 TypeScript、JSX 或 TSX 转译为 JavaScript"
---

`deno transpile` 命令会从 TypeScript、JSX 或 TSX 源文件生成 JavaScript。当你需要将普通的 `.js` 输出交付给不理解 TypeScript 的运行时，或传入期望 JavaScript 的构建步骤时，它会很有用。

对于大多数工作流，你**不需要** `deno transpile`——`deno run`、`deno test` 和 `deno serve` 已经可以直接接受 `.ts` / `.tsx` 文件。以下情况可以使用它：

- 你正在向直接运行 `node` 或浏览器打包器的使用者发布库。（对于 npm tarball，优先使用
  [`deno pack`](/runtime/reference/cli/pack/)，它会将 `deno transpile` 与打包逻辑结合起来。）
- 下游工具只理解 `.js`。
- 你希望将预编译的 `.js` 检入构建产物，而不是在运行时即时转译。

## 用法

```sh
deno transpile <files...> [flags]
```

`<files>` 是一个或多个源文件路径（glob 会由 shell 展开）。`deno transpile` **不会** 递归扫描目录——请传入你希望转译的文件，也可以通过 shell glob 传入。

### 输出模式

| 模式                           | 效果                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| _无输出标志_                   | 将转译后的输出写入标准输出。                                       |
| `-o <path>`, `--output <path>` | 将输出写入单个文件。与 `--outdir` 冲突。                          |
| `--outdir <dir>`               | 将每个输入文件写入 `<dir>`，并保持源代码目录结构。                 |

```sh
# 打印到 stdout
deno transpile main.ts

# 写入单个文件
deno transpile main.ts -o dist/main.js

# 将多个文件转译到输出目录
deno transpile src/main.ts src/helpers.ts --outdir dist

# 使用 shell glob
deno transpile src/*.ts --outdir dist
```

### 输入 / 输出扩展名映射

| 输入   | 输出   | 源映射       |
| ------ | ------ | ------------ |
| `.ts`  | `.js`  | `.js.map`    |
| `.tsx` | `.js`  | `.js.map`    |
| `.jsx` | `.js`  | `.js.map`    |
| `.mts` | `.mjs` | `.mjs.map`   |
| `.cts` | `.cjs` | `.cjs.map`   |

JSX 转换、装饰器、目标版本以及其他发射设置都来自你的 `deno.json`（或 `tsconfig.json`）中的 `compilerOptions`，因此输出会与 `deno run` 的执行结果一致。有关完整列表，请参阅
[TypeScript 编译器选项](/runtime/fundamentals/typescript/#configuring-typescript-compiler-options)。

### 源映射

使用 `--source-map` 并指定以下其中一种：

| 模式       | 效果                                               |
| ---------- | -------------------------------------------------- |
| `none`     | （默认）不生成源映射                                  |
| `inline`   | 将源映射作为 `data:` 注释嵌入每个文件中              |
| `separate` | 写入同级的 `.js.map`（或 `.mjs.map` / `.cjs.map`） |

```sh
deno transpile main.ts -o dist/main.js --source-map separate
```

### 类型声明

使用 `--declaration` 输出 `.d.ts` 声明文件。声明文件由 `tsc`（使用内置的 TypeScript）生成，因此此标志会遵循你在 `deno.json` / `tsconfig.json` 中的 `compilerOptions`。

即使 JavaScript 输出将写入标准输出或单个 `-o` 文件，`.d.ts` 文件也总是会写入磁盘——如果未设置输出位置，则写在源文件旁边；如果提供了 `--outdir`，则写入其中。

```sh
deno transpile src/*.ts --outdir dist --declaration
```

## 与 `tsc` 的区别

`deno transpile` 和 TypeScript 的 `tsc` 有所重叠，但它们并不能直接互相替代：

| 关注点                        | `deno transpile`                                      | `tsc`                            |
| ------------------------------ | ------------------------------------------------------ | -------------------------------- |
| **类型检查**                  | 无——只负责输出。请单独使用 `deno check`。              | 默认进行完整类型检查。           |
| **`.d.ts` 生成**              | 可以，使用 `--declaration`。委托给内置的 `tsc`。       | 可以。                           |
| **JSR / npm / 远程导入**      | 可以解析。                                             | 不能解析。                       |
| **配置来源**                  | `deno.json`（或 `tsconfig.json`）。                    | 仅 `tsconfig.json`。             |
| **速度**                      | 基于 SWC 的快速输出。                                  | 较慢（包含类型检查）。           |

如果你希望暴露类型错误，请在转译前或转译后运行
[`deno check`](/runtime/reference/cli/check/)。`deno transpile` 会愉快地输出那些无法通过类型检查的代码。

## 注意事项

- **不进行打包。** 每个输入文件只会生成一个输出文件。导入会仅按扩展名重写（`./foo.ts` → `./foo.js`），但生成的依赖图仍然需要能够解析这些导入的运行时。若要生成单文件输出，请使用 [`deno bundle`](/runtime/reference/cli/bundle/)。
- **不会递归扫描目录。** 传入目录不会产生任何效果——请显式传入文件（`src/**/*.ts`）或通过 glob 传入。
- **源映射与 stdout。** 当输出到标准输出时，`--source-map inline` 可以工作；`separate` 则需要一个可在其旁边写入映射文件的输出路径。

## 另请参阅

- [`deno bundle`](/runtime/reference/cli/bundle/) — 生成单个打包后的 JavaScript 文件
- [`deno pack`](/runtime/reference/cli/pack/) — 构建可发布到 npm 的 tarball
  （内部使用 `deno transpile`）
- [`deno check`](/runtime/reference/cli/check/) — 仅进行类型检查，不输出代码
- [TypeScript 支持](/runtime/fundamentals/typescript/) — Deno 中 TypeScript 工作方式的概览
