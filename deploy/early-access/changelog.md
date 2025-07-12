---
title: "Deno Deployᴱᴬ 更新日志"
description: "列出 Deno Deploy 早期访问版开发和演进中的显著进展"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。正在寻找
Deploy Classic 文档？[请点击这里查看](/deploy/)。

:::

## 2025年7月9日

### 新功能

- 新功能：Cloud Connect 允许您安全地将 Deno Deploy<sup>EA</sup> 应用连接到 AWS 和 GCP，使您能够使用 AWS S3、Google Cloud Storage 等服务，无需管理凭据。
  - 这是通过不存储任何长期静态凭据，而是使用短期令牌和 OIDC（OpenID Connect）建立 Deno Deploy<sup>EA</sup> 与云提供商之间的信任关系来实现的。
  - 在应用设置页面有一个设置流程，或在 playground 中有一个抽屉，引导您完成将应用连接到 AWS 或 GCP 的过程。
  - 您可以使用标准的 AWS 和 GCP SDK 来访问服务——无需重新编写任何代码以使用不同的 API。
  - [在文档中了解更多信息。](https://docs.deno.com/deploy/early-access/reference/cloud-connections/)
- 应用指标页面现在显示更多指标，包括 V8 内存指标，如堆大小和垃圾回收统计，以及进程级指标，如 CPU 使用率和总体内存使用情况。
- 组织概览中新增了一个“指标”标签页，显示组织内所有应用的整体指标，包括请求数量、CPU 使用率和内存使用情况。
- 现在可以通过编辑预览 iframe 上方显示的“地址栏”来编辑 playground 预览的 URL。
- 当环境变量的键包含 `SECRET`、`KEY`、`TOKEN`、`PRIVATE` 或 `PASSWORD` 时，环境变量默认设为秘密。您仍可以根据需要手动切换为纯文本。
- 环境变量值的最大长度限制已从 1024 字符提升至 4096 字符。

### Bug 修复

- playground 在尝试部署空文件时不会再卡住。
- playground 抽屉调整大小更可靠，尤其是在部分抽屉折叠时表现更佳。
- 构建时间显著缩短，特别是大型项目。之前超过 10 秒的“热身”和“路由”步骤现在通常各不到 1 秒。
- 构建现在可以在“排队”和“路由”步骤中取消。
- 组织创建页面在提交表单前，会正确显示组织 slug 是否已被占用。
- `npm install` 现在可以再次安装 `esbuild` —— 之前会以模糊错误失败。

## 2025年6月24日

### 新功能

- playground 现拥有实时流式日志和追踪面板
  - 当前修订的日志和追踪显示最近一小时数据
  - 日志和追踪可过滤，与专用可观测性页面相同
- 框架自动检测现已支持更多项目，包括许多基于 Vite 的项目
- 组织下拉菜单现在更清晰地突出显示当前选择的组织

### Bug 修复

- 指标概览中的火花图现在正常工作
- 错误率指标功能恢复正常
- GitHub 触发的构建不再多次执行
- Next.js 构建在旧版 Next.js 上更加稳定

## 2025年6月12日

### 新功能

- Deno Deploy<sup>EA</sup> 现支持 playground！
  - playground 可在组织概览的 playgrounds 标签页中创建和访问
  - playground 支持多文件及构建步骤
  - playground 界面提供已部署应用的预览 iframe
  - 目前提供三种模板：hello world、Next.js 和 Hono
- 移动设备上新增浮动导航栏，不会干扰页面内容

## 2025年6月9日

### 新功能

- Deno Deploy<sup>EA</sup> 拥有了新徽标！
- 现在任何人都可通过注册 [dash.deno.com](https://dash.deno.com/account#early-access) 加入早期访问
- 构建相关更新：
  - 构建最大可用存储提升至 8 GB（之前为 2 GB）
  - 构建可使用组织或应用设置（新“构建”上下文）中的环境变量和密钥
  - 构建最大运行时长为 5 分钟
- 指标页面全面重写，重新实现图表渲染：
  - 拖拽图表可放大选定区域
  - 能展示更多数据，且不卡页面
  - 工具提示随鼠标移动，新增准星辅助精确分析
  - 改进字体大小和颜色，提高可读性

### Bug 修复

- 构建不再卡在挂起状态
- 仪表板页面加载速度明显提升
- 正确显示追踪中未导出的父跨度
- 切换时间范围时，指标页面正确刷新
- 遥测搜索栏中的“清除搜索”按钮正常工作
- 旧版 Next.js（如 Next.js 13）现在能正常构建
- 全部地方统一使用环境变量抽屉，修复同名但不同上下文环境变量冲突问题
- 构建器中运行 `node <path>`，当路径为绝对路径时不再失败
- 构建器已支持 `npx`
- Astro 构建不再偶尔因 `--unstable-vsock` 错误而失败
- 明确指定 `@deno/svelte-adapter` 时，Svelte 项目可正确部署

## 2025年5月26日

### 新功能

- 手动触发构建时，现可选择部署分支
- 支持部署 Astro 静态站点，无需手动安装 Deno 适配器
- 提供了[参考文档](https://docs.deno.com/deploy/early-access/)，方便您查阅

### Bug 修复

- 使用 `npm` 作为包管理器时，SvelteKit 自动检测正常生效
- 预热不会再触发随机 POST 请求到应用
- 访问带尾部斜杠的页面不再返回 404
- 抽屉不会因为在背景区域点击、按住并拖动后松开而关闭

## 2025年5月22日

### 新功能

- 应用创建期间可批量导入环境变量，通过将 `.env` 文件粘贴到环境变量抽屉
- SvelteKit 开箱即用，无需手动安装 Deno 适配器
- 提供 Lume 静态站点生成器预设

### Bug 修复

- 环境变量现在在时间线页面正确显示
- 生产时间线页面正确显示所有构建
- app.deno.com 现支持旧版 Firefox
- app.deno.com 各页面标题反映当前所在页面
- DNS 验证失败后，“Provision certificate”按钮不再卡死
- 曾经有证书或附加应用的域名现在可以删除