---
title: "Deno Deploy<sup>EA</sup> 更新日志"
description: "列出 Deno Deploy 早期访问版开发和演进中的重要进展"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。想要查找
Deploy Classic 的文档？[点此查看](/deploy/)。

:::

## 2025年5月26日

### 功能

- 触发手动构建时，现在可以选择部署哪个分支
- 现在可以部署 Astro 静态网站，无需手动安装
  Deno 适配器
- 现在提供了
  [供您浏览的参考文档](https://docs.deno.com/deploy/early-access/)。

### Bug 修复

- 使用 `npm` 作为包管理器时，SvelteKit 自动检测功能现已正常工作
- 预热功能不再随机触发对您的应用的 POST 请求
- 访问带有尾部斜杠的页面不再返回 404
- 点击抽屉内部，按住并拖拽背景并释放时，抽屉将不再关闭

## 2025年5月22日

### 功能

- 现在可以在创建应用时通过粘贴 `.env` 文件的方式批量导入环境变量
- SvelteKit 现在可以开箱即用，无需手动安装 Deno 适配器
- 现已提供 Lume 静态网站生成器的预设配置

### Bug 修复

- 环境变量现在在时间线页面上正确显示
- 生产时间线页面现在能正确显示所有构建
- app.deno.com 现支持较旧版本的 Firefox
- app.deno.com 上的页面标题现在正确反映您所在的页面
- “申请证书”按钮在 DNS 验证失败后不再卡死
- 之前有证书或已关联应用的域名现在可以删除了