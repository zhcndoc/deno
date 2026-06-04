---
last_modified: 2026-03-08
title: "Deno CLI 子命令"
oldUrl: "/runtime/reference/cli/all_commands"
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno help"
---

Deno CLI（命令行接口）允许你通过终端或命令提示符与 Deno 运行时环境进行交互。CLI 具有一些子命令，可以用于执行不同的任务，下面的链接提供有关每个子命令的更多信息。

## 执行

- [deno run](/runtime/reference/cli/run/) - 运行一个脚本
- [deno serve](/runtime/reference/cli/serve/) - 运行一个 web 服务器
- [deno task](/runtime/reference/cli/task/) - 运行一个任务
- [deno repl](/runtime/reference/cli/repl/) - 启动一个读取-评估-打印循环
- [deno eval](/runtime/reference/cli/eval/) - 评估提供的脚本

## 依赖管理

- [deno add](/runtime/reference/cli/add) - 添加依赖项
- [deno approve-scripts](/runtime/reference/cli/approve_scripts) - 管理
  npm 包的生命周期脚本
- [deno audit](/runtime/reference/cli/audit) - 审计依赖项
- [deno bump-version](/runtime/reference/cli/bump_version/) - 提升项目
  在 `deno.json` 或 `package.json` 中的版本号
- deno cache - _(已弃用。请使用
  [deno install](/runtime/reference/cli/install/))_
- [deno install](/runtime/reference/cli/install/) - 安装一个依赖项或一个
  脚本
- [deno uninstall](/runtime/reference/cli/uninstall/) - 卸载一个依赖项或一个脚本
- [deno remove](/runtime/reference/cli/remove) - 移除依赖项
- [deno outdated](/runtime/reference/cli/outdated) - 查看或更新过时的
  依赖项
- [deno why](/runtime/reference/cli/why/) - 解释为什么某个包位于
  依赖树中

## 工具

- [deno bench](/runtime/reference/cli/bench/) - 基准测试工具
- [deno check](/runtime/reference/cli/check/) - 在不运行程序的情况下对其进行
  类型检查
- [deno compile](/runtime/reference/cli/compile/) - 将程序编译为一个
  独立可执行文件
- [deno completions](/runtime/reference/cli/completions/) - 生成 shell
  补全
- [deno coverage](/runtime/reference/cli/coverage/) - 生成测试覆盖率
  报告
- [deno create](/runtime/reference/cli/create/) - 使用模板搭建一个新的项目
- [deno doc](/runtime/reference/cli/doc/) - 为一个模块生成文档
- [deno deploy](/runtime/reference/cli/deploy) - 管理并发布你的
  Web 项目
- [deno fmt](/runtime/reference/cli/fmt/) - 格式化你的代码
- [deno info](/runtime/reference/cli/info/) - 检查一个 ES 模块及其所有
  依赖项
- [deno init](/runtime/reference/cli/init/) - 创建一个新项目
- [deno jupyter](/runtime/reference/cli/jupyter/) - 运行一个 Jupyter 笔记本
- [deno lint](/runtime/reference/cli/lint/) - 对你的代码进行 lint
- [deno lsp](/runtime/reference/cli/lsp/) - 语言服务器协议集成
- [deno pack](/runtime/reference/cli/pack/) - 从当前 Deno 项目创建一个 npm
  tarball
- [deno publish](/runtime/reference/cli/publish/) - 将一个模块发布到 JSR
- [deno test](/runtime/reference/cli/test/) - 运行你的测试
- [deno transpile](/runtime/reference/cli/transpile/) - 将 TypeScript、
  JSX 或 TSX 转译为 JavaScript
- [deno types](/runtime/reference/cli/types/) - 打印运行时类型
- [deno upgrade](/runtime/reference/cli/upgrade/) - 将 Deno 升级到最新
  版本
- [deno x](/runtime/reference/cli/x/) - 运行一个 npm 或 JSR 包

## 其他

- [不稳定功能标志](/runtime/reference/cli/unstable_flags/)
- [集成 Deno LSP](/runtime/reference/lsp_integration/)