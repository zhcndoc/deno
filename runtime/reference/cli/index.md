---
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

- [deno add](/runtime/reference/cli/add) - 添加依赖
- [deno approve-scripts](/runtime/reference/cli/approve_scripts) - 管理 npm 包的生命周期脚本
- [deno audit](/runtime/reference/cli/audit) - 审计依赖项
- deno cache - _（已弃用。请使用 [deno install](/runtime/reference/cli/install/)）_
- [deno install](/runtime/reference/cli/install/) - 安装依赖或脚本
- [deno uninstall](/runtime/reference/cli/uninstall/) - 卸载依赖或脚本
- [deno remove](/runtime/reference/cli/remove) - 移除依赖
- [deno outdated](/runtime/reference/cli/outdated) - 查看或更新过时的依赖

## 工具

- [deno bench](/runtime/reference/cli/bench/) - 基准测试工具
- [deno check](/runtime/reference/cli/check/) - 对程序进行类型检查（不运行程序）
- [deno compile](/runtime/reference/cli/compile/) - 将程序编译为独立可执行文件
- [deno completions](/runtime/reference/cli/completions/) - 生成命令行补全脚本
- [deno coverage](/runtime/reference/cli/coverage/) - 生成测试覆盖率报告
- [deno doc](/runtime/reference/cli/doc/) - 生成模块文档
- [deno deploy](/runtime/reference/cli/deploy) - 管理并发布你的项目到 web
- [deno fmt](/runtime/reference/cli/fmt/) - 格式化代码
- [deno info](/runtime/reference/cli/info/) - 检查 ES 模块及其所有依赖
- [deno init](/runtime/reference/cli/init/) - 创建新项目
- [deno jupyter](/runtime/reference/cli/jupyter/) - 运行 Jupyter 笔记本
- [deno lint](/runtime/reference/cli/lint/) - 代码静态检查
- [deno lsp](/runtime/reference/cli/lsp/) - 语言服务器协议集成
- [deno publish](/runtime/reference/cli/publish/) - 发布模块到 JSR
- [deno test](/runtime/reference/cli/test/) - 运行测试
- [deno types](/runtime/reference/cli/types/) - 打印运行时类型
- [deno upgrade](/runtime/reference/cli/upgrade/) - 升级 Deno 至最新版
- [deno x](/runtime/reference/cli/x/) - 运行 npm 或 JSR 包

## 其他

- [不稳定功能标志](/runtime/reference/cli/unstable_flags/)
- [集成 Deno LSP](/runtime/reference/lsp_integration/)