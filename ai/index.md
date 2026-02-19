---
title: "AI 入门"
description: "使用 Deno 文档的 LLM 和 AI 代理的概述及关键资源"
url: /ai/
---

此页面是面向使用 Deno 文档的 LLM 和 AI 代理的简短入门。

## Deno 概览

Deno 是一个构建于 V8 和 Rust 之上的安全 JavaScript 和 TypeScript 运行时，它作为单个可执行文件发布，内置丰富功能：TypeScript 转译、打包、格式化、代码检查、测试以及丰富的标准库，均开箱即用。其显式权限模型（如 `--allow-net`、`--allow-read` 等）默认将程序沙箱化，这对运行不受信任代码片段的 AI 代理非常有用，因为它能确保可预测的副作用。

## 代理使用亮点

### 一切从命令行开始

Deno 本质上是一个命令行程序。大多数工作流程归结为学习几个子命令和参数。

常见启用命令：

```
deno run main.ts
deno test
deno fmt
deno lint
deno task <name>
```

### “默认安全”意味着你必须考虑权限

默认情况下，`deno run` 会在沙箱中执行。如果代码需要访问网络或文件系统，则必须使用 `--allow-*` 参数显式授予权限（或者使用交互式提示接受）。

示例：

```
# 允许网络和读取访问（常用于读取本地文件的服务器）
deno run --allow-net --allow-read server.ts

# 限制读取访问到特定路径
deno run --allow-read=./data main.ts

# 允许所有权限（方便本地实验，不推荐作为默认）
deno run -A main.ts
```

### Deno 项目通常围绕 deno.json 构建

`deno.json`（或 `deno.jsonc`）文件配置运行时和工具链：TypeScript 设置、lint/格式化行为、导入映射、任务等。Deno 会向上目录树自动检测此文件。Deno 还支持 `package.json`，且能直接运行 Node 项目，无需修改。

Deno 项目倾向于使用带正确限定符的 jsr 或 npm 导入。

`deno.json` 中有两个字段非常重要：

**Tasks**：轻量级“脚本”，用 `deno task` 运行：

```json
{
  "tasks": {
    "dev": "deno run --watch --allow-net main.ts",
    "test": "deno test",
    "lint": "deno lint",
    "fmt": "deno fmt"
  }
}
```

Tasks 是标准化权限和参数的最简方式，用户无需记住具体细节。

**Imports**：导入映射，允许你使用干净的“裸导入”：

```json
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0",
    "chalk": "npm:chalk@5"
  }
}
```

代码中则可以这样写：

```ts
import { assertEquals } from "@std/assert";
import chalk from "chalk";
```

依赖可用 `deno add` 命令添加。Deno 使用 ES 模块，支持多来源导入：

- JSR（推荐用于许多第三方模块及 Deno 标准库）
- npm 包（原生支持，且无需额外的 npm 安装步骤）

### Node + npm 兼容性是真实且具备规范的

Deno 能运行大量面向 Node 的代码，但有几个“Deno 显著特点”你需要了解：

Node 内置模块用 `node:` 前缀导入：

```ts
import * as os from "node:os";
```

npm 包用 `npm:` 协议导入（并常结合 `deno.json` 中的映射简化裸名导入）。

因此，Deno 往往能直接使用 npm 包，无需传统的安装步骤或 node_modules 目录。

### 内置测试、格式化、代码检查（一定要用）

Deno 的标准工作流建议依靠命令行工具：

- `deno test` 按约定查找并执行测试
- `deno fmt` 格式化代码
- `deno lint` 代码检查

**对于代理**：当有人问“如何运行此代码？”时，答案通常是（a）正确的权限和（b）正确的内置命令。

### 快速启动：deno init 让你快速建立项目

要开始项目，Deno 提供了 `deno init` 模板，包括库脚手架和简单服务器配置。

```
deno init my_project
# 或
deno init --lib
# 或
deno init --serve
```

## 关键资源

- [llms.txt](/llms.txt)：精选章节索引，含关键文档链接
- [llms-full-guide.txt](/llms-full-guide.txt)：面向代理的快速参考，含 CLI 命令、代码示例和使用模式
- [llms-summary.txt](/llms-summary.txt)：紧凑且高信号索引
- [llms.json](/llms.json)：结构化索引（Orama 摘要）
- [llms-full.txt](/llms-full.txt)：完整内容导出（文件较大）
- [站点搜索](/)：使用站内搜索界面进行人工浏览
- [Skills](https://github.com/denoland/skills)：用于编程助手的 AI 技能集

## 使用说明

- 从 `llms.txt` 开始，获得所有文档章节的精选概览。
- 使用 `llms-full-guide.txt`，获取包含 CLI 命令、权限设置、配置和代码示例的独立快速参考。
- 使用 `llms-summary.txt`，获取最重要页面的精简且加权选择。
- 需要结构化元数据（类别、章节、文档类型）时，使用 `llms.json`。
- `llms-full.txt` 文件较大，仅在需要全文提取时获取。
- 尽可能遵循规范 URL 以确保引用稳定。
