---
title: "Deno Deployᴱᴬ 更新日志"
description: "列出 Deno Deploy 早期访问版开发和演进中的显著进展"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。正在寻找
Deploy Classic 文档？[请点击这里查看](/deploy/)。

:::

## 2025年7月23日

### 新功能

- 新增：Deno Deploy<sup>EA</sup> 应用支持数据库，允许您轻松连接和使用 Postgres 数据库。
  - 可在 AWS RDS、Neon、Supabase 或其他提供商上配置 Postgres 数据库实例，然后将其链接到您的 Deno Deploy<sup>EA</sup> 组织。
  - 将数据库实例分配给某个应用，使其在该应用环境中可用。
  - 每个时间线（生产环境、每个 git 分支及预览）拥有独立的数据库，使用单独的模式和数据，这样您可以在不影响生产数据的情况下测试迁移和更改。
  - 可以使用任何 Postgres 客户端库进行连接，包括 `npm:pg`、`npm:drizzle` 或 `npm:kysely`。
- 现在应用和 playground 支持重命名。注意，重命名后旧的 `deno.net` URLs 将不再可用，但自定义域名仍然可以使用。
- 现在应用和 playground 可以被删除。
- playground 新增 HTTP Explorer 标签页，允许您向 playground 服务的任意 URL 发起 HTTP 请求，这对于测试不提供网页的 API 或其他服务非常有用。
- 现在可通过点击文件夹名称旁的删除按钮删除 playground 文件浏览器中的整个文件夹。
- 现在支持将 zip 文件拖放至 playground 文件浏览器，自动上传 zip 文件中的所有文件。
- 可以在 playground 中启用保存时自动格式化，保存文件时自动格式化代码。

### Bug 修复

- 以 `DENO_` 前缀的环境变量如 `DENO_CONDITIONS`、`DENO_COMPAT` 和 `DENO_AUTH_TOKENS` 现在可以设置且不会出错。
- `DENO_REVISION_ID` 环境变量现已正确暴露给应用和 playground。
- 自定义域名分配抽屉中，已被其他应用或 playground 占用的自定义域名现显示为禁用状态。
- 监控页面上的网络使用图现在正确显示进出流量，之前显示的数据不正确。
- 新建组织时，首次构建会等待 `<org>.deno.net` 域名被配置完成后再进行路由步骤。
- 在 playground 中按 `Ctrl-S` / `Cmd-S` 会保存当前文件并触发构建，而不是打开浏览器保存对话框。
- 查看某些特定追踪时之前会导致追踪查看器卡死，现在能正确显示。

## 2025年7月9日

### 新功能

- 新增：Cloud Connect 允许您安全地连接 Deno Deploy<sup>EA</sup> 应用至 AWS 和 GCP，使您能够使用 AWS S3、Google Cloud Storage 等服务，无需管理凭据。
  - 这通过不存储任何长期有效的静态凭据实现，而是使用短期令牌和 OIDC（OpenID Connect）在 Deno Deploy<sup>EA</sup> 和云提供商之间建立信任关系。
  - 在应用设置页面或 playground 抽屉中提供设置流程，指引您将应用连接至 AWS 或 GCP。
  - 您可以使用标准的 AWS 和 GCP SDK 访问服务，无需重写代码以使用不同的 API。
  - [文档中了解更多。](https://docs.deno.com/deploy/early-access/reference/cloud-connections/)
- 应用的监控页面现在展示更多指标，包括 V8 内存指标（如堆大小和垃圾回收统计）以及进程级指标（如 CPU 使用率和整体内存使用）。
- 组织概览新增“监控”标签页，展示组织内所有应用的整体指标，包括请求数量、CPU 使用率和内存使用。
- 您现在可以通过编辑 playground 预览 iframe 上方显示的“地址栏”来修改预览的 URL。
- 当环境变量键名包含 `SECRET`、`KEY`、`TOKEN`、`PRIVATE` 或 `PASSWORD` 时，默认环境变量为机密，您仍可手动切换为纯文本。
- 环境变量值的最大长度限制由 1024 字符提升至 4096 字符。

### Bug 修复

- playground 不再在尝试部署空文件时卡死。
- playground 抽屉调整大小更可靠，尤其是在某些抽屉已折叠时。
- 构建时间显著缩短，尤其对大型项目。之前超过 10 秒的“预热”和“路由”步骤通常现在不到 1 秒。
- 构建过程中的“排队”和“路由”步骤可以取消。
- 组织创建页面现能正确显示组织别名是否已被占用，提交表单前即提示。
- `npm install` 现在可以正常安装 `esbuild`，之前会报通用错误。

## 2025年6月24日

### 新功能

- playground 现在支持实时日志和追踪面板
  - 显示当前修订在过去一小时内的日志和追踪
  - 日志和追踪可过滤，与专用观察页面类似
- 框架自动检测支持更多项目，包含许多基于 Vite 的项目
- 组织下拉菜单中，当前选中的组织高亮更明显

### Bug 修复

- 监控概览中的小面积图形现正常工作
- 错误率指标正常显示
- 由 GitHub 触发的构建不再重复运行
- Next.js 构建在较旧版本中更稳定

## 2025年6月12日

### 新功能

- Deno Deploy<sup>EA</sup> 现支持 playground！
  - playground 可在组织概览的 playgrounds 标签页中创建和访问
  - playground 支持多文件与构建步骤
  - playground 界面提供已部署应用的预览 iframe
  - 目前提供三种模板：hello world、Next.js 与 Hono
- 移动设备新增浮动导航栏，不会遮挡页面内容

## 2025年6月9日

### 新功能

- Deno Deploy<sup>EA</sup> 拥有了新徽标！
- 任何人均可在 [dash.deno.com](https://dash.deno.com/account#early-access) 注册加入早期访问计划
- 构建相关
  - 构建存储空间上限由 2 GB 提升至 8 GB
  - 构建可使用组织或应用设置中配置的环境变量和密钥（位于新“构建”上下文中）
  - 构建最大运行时间设定为 5 分钟
- 监控页面经过全面重构，图表渲染重新编写：
  - 拖拽图表可以缩放选中区域
  - 可显示更多数据，页面加载不卡顿
  - 工具提示跟随鼠标指针，并新增十字线以便精准分析
  - 字体大小和颜色改进，提升可读性

### Bug 修复

- 构建不再卡在待处理状态
- 仪表板页面加载速度显著提升
- 追踪中带有未导出父级的跨度可以正确显示
- 切换时间范围时监控页面正常刷新
- 遥测搜索栏的“清除搜索”按钮正常工作
- 旧版 Next.js 版本（如 Next.js 13）现在能正确构建
- 环境变量抽屉现已全局应用，修复了多个同名环境变量不同上下文冲突的问题
- 构建器中使用绝对路径运行 `node <path>` 不再失败
- 构建器中提供 `npx`
- Astro 构建不再偶发因 `--unstable-vsock` 错误失败
- Svelte 明确指定使用 `@deno/svelte-adapter` 时能正确部署

## 2025年5月26日

### 新功能

- 现在手动触发构建时可选择部署分支
- 支持部署 Astro 静态站点，无需手动安装 Deno 适配器
- 提供了[参考文档](https://docs.deno.com/deploy/early-access/)，方便查阅

### Bug 修复

- 使用 `npm` 作为包管理器时，SvelteKit 自动检测正常工作
- 预热阶段不再随机发送 POST 请求至您的应用
- 访问带尾部斜杠的页面不再导致 404
- 抽屉不会因点击内部、拖动背景并释放而关闭

## 2025年5月22日

### 新功能

- 应用创建时可批量导入环境变量：将 `.env` 文件内容粘贴到环境变量抽屉
- SvelteKit 开箱即用，无需手动安装 Deno 适配器
- 提供 Lume 静态站点生成器预设

### Bug 修复

- 环境变量在时间线页正确显示
- 生产时间线页显示所有构建
- app.deno.com 现支持旧版 Firefox
- app.deno.com 的各页面标题反映当前所在页面
- DNS 验证失败后，“Provision certificate”按钮不再卡死
- 曾经有证书或附加应用的域名现在可以删除