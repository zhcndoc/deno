---
title: "Deno KV 教程与示例"
oldUrl:
  - /kv/tutorials/
---

查看这些展示 Deno KV 实际使用的示例。

## 使用队列处理传入的 Webhook

按照 [本教程](./webhook_processor.md) 学习如何使用队列将任务分配到后台进程，这样您的 Web 应用可以保持响应。这个示例展示了如何将处理来自 [GitHub](https://www.github.com) 的传入 Webhook 请求的任务加入队列。

## 使用队列安排未来的通知

按照 [本教程](./schedule_notification.md) 学习如何使用队列安排代码在未来某个时间执行。这个示例展示了如何使用 [Courier](https://www.courier.com/) 安排通知。

## Deno KV 中的 CRUD - TODO 列表

- Zod 模式验证
- 基于 Fresh 构建
- 使用 BroadcastChannel 进行实时协作
- [源代码](https://github.com/denoland/showcase_todo)
- [实时预览](https://showcase-todo.deno.dev/)

## Deno SaaSKit

- 基于 Fresh 构建的现代 SaaS 模板。
- 完全基于 KV 构建的类似于 [Product Hunt](https://www.producthunt.com/) 的模板。
- 使用 Deno KV OAuth 进行 GitHub OAuth 2.0 身份验证
- 用于更快地启动您的下一个应用项目
- [源代码](https://github.com/denoland/saaskit)
- [实时预览](https://hunt.deno.land/)

## 多人井字棋

- GitHub 身份验证
- 保存用户状态
- 使用 BroadcastChannel 进行实时同步
- [源代码](https://github.com/denoland/tic-tac-toe)
- [实时预览](https://tic-tac-toe-game.deno.dev/)

## 多用户像素艺术绘画

- 持久的画布状态
- 多用户协作
- 使用 BroadcastChannel 进行实时同步
- [源代码](https://github.com/denoland/pixelpage)
- [实时预览](https://pixelpage.deno.dev/)

## GitHub 身份验证与 KV

- 在 KV 中存储绘画
- GitHub 身份验证
- [源代码](https://github.com/hashrock/kv-sketchbook)
- [实时预览](https://hashrock-kv-sketchbook.deno.dev/)

## Deno KV oAuth 2

- 由 Deno KV 提供支持的高层次 OAuth 2.0
- [源代码](https://github.com/denoland/deno_kv_oauth)
- [实时预览](https://kv-oauth.deno.dev/)