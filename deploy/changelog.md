---
title: "Deno Deploy 更新日志"
description: "列出 Deno Deploy 开发与演进过程中的显著进展"
---

## 2026年1月27日

### 新功能

- Deno Deploy 应用现在可以通过 `deno.json` / `deno.jsonc` 文件配置，除了仪表盘设置之外。
  - 仪表盘中可用的所有应用配置选项也可以在 `deno.json` 文件的 `deploy` 部分找到，包括安装和构建命令、运行时配置和框架预设。
  - 当同时存在仪表盘和 `deno.json` 配置时，`deno.json` 的配置优先，完全覆盖仪表盘中的应用配置。
  - 这使得以代码管理应用配置更加方便，并且可以将其与应用代码一同纳入版本控制。
  - [在文档中了解更多。](/deploy/reference/builds/#editing-app-configuration-from-source-code)
- 现在可以从组织设置页面重命名组织并更改其别名（slug）。
  - [重命名组织](/deploy/reference/organizations/#rename-an-organization) 会更新仪表盘和邀请邮件中的显示名称。
  - [更改组织别名](/deploy/reference/organizations/#update-the-organization-slug) 会更新该组织所有应用的默认域名，注意这将移除旧的默认域名。
  - 详细信息请参见文档。
- 现在可以从 Deno Deploy 仪表盘查看支持工单。
  - 通过发送邮件到 support@deno.com 提交支持请求后，会收到一封自动回复邮件，包含认领工单的链接。
  - 认领工单后，该工单会关联到您的 Deno Deploy 账户，您可以通过[tickets 仪表盘](https://console.deno.com/tickets)跟踪支持请求状态。
- 运行时现可通过环境变量[`DENO_TIMELINE`](/deploy/reference/env-vars-and-contexts/#built-in-environment-variables)访问应用当前运行所在的时间线信息。

### Bug 修复

- 修复了有时链接的 Postgres 数据库的数据库浏览器无法加载的问题。
- 修复了一些构建因无效构建缓存而卡住的问题，这需要通过支持手动干预解决。

## 2025年8月27日

### 新功能

- Deno Deploy 现在可以检测 Deno 和 NPM 的工作区 / 单仓库配置，  
  允许您部署位于大型仓库子目录中的应用。
  - 在创建应用时，会扫描仓库中的工作区配置，允许您选择要部署的工作区成员。
  - 构建期间，工作目录设置为工作区成员目录。
  - 应用目录可在应用配置设置中自定义（创建后可修改）。
- 构建日志新增专门的“Deploy”部分，取代之前的“Warmup”和“Routing”阶段，提升部署时的清晰度。
  - “Deploy”部分包含每个时间线的子部分，包括生产环境、Git 分支和预览部署。
  - “Warmup”子部分显示与应用预热相关的日志。
  - “Pre-deploy”子部分显示运行用户定义的预部署命令（如执行迁移）的日志。
  - “Database creation”子部分显示为时间线创建链接数据库的日志。
- 顶部导航栏重新设计，新增当前仪表盘部分的面包屑下拉菜单，方便在应用和域名等间快速导航。
- GitHub 集成中，提交信息包含 `[skip ci]` 或 `[skip deploy]` 字符串时，可跳过该提交的部署。
- 超过30天未收到流量的修订版本将自动禁用，7天后无活动进一步删除。
  - 禁用的修订版本可在删除前在修订页面重新启用。
- `deno deploy` CLI 及 `deno run` 和 `deno task` 的 `--tunnel` 选项现支持使用组织令牌认证，除用户令牌外。
  - 使用组织令牌时，将其按惯例传入 `DENO_DEPLOY_TOKEN` 环境变量。
- 发布了多项运行时安全补丁，修复近期公开的 React 和 Next.js 漏洞：  
  [CVE-2025-55182](https://deno.com/blog/react-server-functions-rce)（远程代码执行）及  
  [CVE-2025-55184/CVE-2025-67779](https://deno.com/blog/cve-2025-55184)（拒绝服务）。
- 另外，我们悄然为所有 Deno Deploy 用户启用了新的 Deno Sandbox 基础设施，欢迎体验。
  - Deno Sandbox 提供完全隔离的 Linux 微型虚拟机，运行不受信任代码。
  - 适合运行第三方代码（如插件、扩展、用户生成或大型语言模型生成代码），无需担心应用安全。
  - 明年将公布更多关于 Deno Sandbox 的详情，敬请期待！
  - 可从 Deno Deploy 控制台的“Sandboxes”标签页体验。
  - [了解更多关于 Deno Sandbox。](https://deno.com/deploy/sandbox)

### Bug 修复

- 在允许数据库实例链接到组织前，检查 Postgres 数据库实例是否支持数据库动态配置。
- 确保已删除的 Deno Deploy 应用在推送至之前关联的仓库时不会触发 GitHub 状态检查。
- playground HTTP 探索器在发送请求时正确带上设置的请求头。
- playground 不再因为顶层 `await` 报错。
- 现在可以向 Deno Deploy 应用添加名为 `GOOGLE_APPLICATION_CREDENTIALS` 的环境变量。
- 批量导入环境变量时，正确将它们导入到对应应用，而非错误地导入组织环境变量。
- 一些不支持 `using` 声明的 Next.js 版本现能正确构建。
- 构建步骤中的 `npm install` 现在更稳定，不会再因证书问题失败。

## 2025年7月23日

### 新功能

- 新增：Deno Deploy 应用支持数据库功能，轻松连接和使用 Postgres 数据库。
  - 可在 AWS RDS、Neon、Supabase 或其他供应商处配置 Postgres 数据库实例，然后将其链接到您的 Deno Deploy 组织。
  - 将数据库实例分配给某个应用，使其可在该应用环境中使用。
  - 每个时间线（生产环境、每个 git 分支及预览）拥有独立数据库，使用单独模式和数据，允许您在不影响生产数据的情况下测试迁移和更改。
  - 可使用任何 Postgres 客户端库连接，包括 `npm:pg`、`npm:drizzle` 或 `npm:kysely`。
- 应用和 playground 现支持重命名。注意，重命名后旧的 `deno.net` URL 将不再有效，但自定义域名仍然可用。
- 应用和 playground 现支持删除。
- playground 新增 HTTP 探索者标签页，允许您向 playground 服务的任意 URL 发起 HTTP 请求，便于测试不提供网页的 API 或其他服务。
- 您现在可通过点击文件夹名称旁的删除按钮，删除 playground 文件浏览器中的整个文件夹。
- playground 文件浏览器现支持拖放 ZIP 文件，自动上传 ZIP 中所有文件。
- playground 中可启用“保存时自动格式化”，保存文件时自动格式化代码。

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

- 新增：Cloud Connect 允许您安全地将 Deno Deploy 应用连接至 AWS 和 GCP，使您能够使用 AWS S3、Google Cloud Storage 等服务，无需管理凭据。
  - 通过不存储任何长期有效静态凭据，而是使用短期令牌及 OIDC（OpenID Connect）在 Deno Deploy 与云提供商之间建立信任关系。
  - 在应用设置页面或 playground 抽屉中提供设置流程，指引您连接应用至 AWS 或 GCP。
  - 可以使用标准的 AWS 和 GCP SDK 访问服务，无需重写代码使用不同 API。
  - [查看文档以了解更多。](https://docs.deno.com/deploy/early-access/reference/cloud-connections/)
- 应用监控页面现显示更多指标，包括 V8 内存指标（如堆大小与垃圾回收统计）及进程级指标（如 CPU 使用率和整体内存占用）。
- 组织概览中新增“监控”标签页，展示组织内所有应用的整体指标，包括请求数、CPU 使用率和内存使用。
- 您现在可以通过编辑 playground 预览 iframe 上方显示的“地址栏”来修改预览 URL。
- 当环境变量键名包含 `SECRET`、`KEY`、`TOKEN`、`PRIVATE` 或 `PASSWORD` 时，默认环境变量被视为机密，您仍可手动切换为纯文本。
- 环境变量值最大长度限制从 1024 字符提升至 4096 字符。

### Bug 修复

- playground 不再在尝试部署空文件时卡死。
- playground 抽屉调整大小更可靠，尤其是在某些抽屉已折叠时。
- 构建时间显著缩短，特别是大型项目中，之前超过 10 秒的“预热”和“路由”步骤现在通常少于 1 秒。
- 构建过程中的“排队”和“路由”步骤可取消。
- 创建组织页面现可正确反馈组织别名是否已被占用，提交前即提示。
- `npm install` 现能正常安装 `esbuild`，避免之前的通用错误。

## 2025年6月24日

### 新功能

- playground 现在支持实时日志和追踪面板：
  - 显示当前修订过去一小时内的日志和追踪。
  - 日志和追踪可过滤，类似专用观察页面。
- 框架自动检测支持更多项目，包括许多基于 Vite 的项目。
- 组织下拉菜单中，当前选中的组织高亮更明显。

### Bug 修复

- 监控概览中的小面积图形现正常工作。
- 错误率指标正确显示。
- 由 GitHub 触发的构建不再重复运行。
- Next.js 构建在较旧版本中更稳定。

## 2025年6月12日

### 新功能

- Deno Deploy 现支持 playground！
  - playground 可在组织概览的 playgrounds 标签页中创建和访问
  - playground 支持多文件和构建步骤
  - playground 界面提供已部署应用的预览 iframe
  - 目前提供三种模板：hello world、Next.js 和 Hono
- 移动设备新增浮动导航栏，不会遮挡页面内容

## 2025年6月9日

### 新功能

- Deno Deploy 拥有了新徽标！
- 任何人均可在 [console.deno.com](https://console.deno.com) 注册加入早期访问计划
- 构建相关
  - 构建存储空间上限从 2 GB 提升至 8 GB
  - 构建可使用组织或应用设置中配置的环境变量和密钥（位于新的“构建”上下文中）
  - 构建最大运行时间为 5 分钟
- 监控页面全面重构，图表渲染部分重新编写：
  - 拖拽图表可缩放选中区域
  - 可显示更多数据且页面加载不卡顿
  - 工具提示跟随鼠标指针，并新增十字线以便精准分析
  - 改进字体大小与颜色，提升可读性

### Bug 修复

- 构建不再卡在待处理状态。
- 仪表板页面加载速度显著提升。
- 追踪中的跨度有未导出的父级时可正确显示。
- 切换时间范围时监控页面正常刷新。
- 遥测搜索栏的“清除搜索”按钮正常工作。
- 旧版 Next.js 版本（如 Next.js 13）现能正确构建。
- 环境变量抽屉已全局应用，修复了同名环境变量在不同上下文间冲突的问题。
- 构建器中使用绝对路径运行 `node <path>` 不再失败。
- 构建器中提供了 `npx`。
- Astro 构建不再偶发因 `--unstable-vsock` 错误失败。
- 明确指定使用 `@deno/svelte-adapter` 的 Svelte 部署正常。

## 2025年5月26日

### 新功能

- 手动触发构建时可以选择部署的分支。
- 支持部署 Astro 静态站点，无需手动安装 Deno 适配器。
- 提供了[参考文档](/deploy/)，方便查阅。

### Bug 修复

- 使用 `npm` 作为包管理器时，SvelteKit 自动检测正常工作。
- 预热阶段不再随机发送 POST 请求至您的应用。
- 访问带尾部斜杠的页面不再导致 404。
- 抽屉不会因拖动背景并释放或点击内部而关闭。

## 2025年5月22日

### 新功能

- 现在可以在创建应用时通过粘贴 `.env` 文件批量导入环境变量，位于环境变量抽屉中。
- SvelteKit 现开箱即用，无需手动安装 Deno 适配器。
- 新增对 Lume 静态站点生成器的预设支持。

### Bug 修复

- 时间线页面中环境变量现正确显示。
- 生产时间线页面正确显示所有构建历史。
- console.deno.com 在旧版 Firefox 上能正常使用。
- console.deno.com 各页面标题现反映当前所在页面。
- “申请证书”按钮在 DNS 验证失败后不再卡死。
- 曾申请证书或绑定过应用的域名现可删除。