---
title: "从 subhosting API v1 迁移到 v2"
description: "Deno Deploy subhosting API v1 到 v2 的详细迁移指南，涵盖端点变更、部署模型差异，以及标签和层等新特性。"
oldUrl:
  - /deploy/api_migration_guide/
---

本指南介绍如何将 Deno Deploy subhosting API v1
(`api.deno.com/v1`) 迁移到 v2 (`api.deno.com/v2`)。v1 API 将于
**2026 年 7 月 20 日** 关闭。有关通用平台迁移（应用、域名、环境变量），请参阅
[Deploy Classic 迁移指南](/deploy/migration_guide/)。

完整的 v2 API 参考文档：[api.deno.com/v2/docs](https://api.deno.com/v2/docs)

官方 SDK：

- **TypeScript/JavaScript**：
  [@deno/sandbox](https://www.npmjs.com/package/@deno/sandbox)
- **Python**: PyPI 上的 [deno-sandbox](https://pypi.org/project/deno-sandbox/)
  ([源代码](https://github.com/denoland/sandbox-py))

这些 SDK 的品牌名是 "sandbox"，但可用于 subhosting 场景。

## 为什么要迁移到 v2

v2 运行在一个完全不同的新平台上，并带来了显著改进：

- 不再有每个请求的 CPU 时间限制（不再出现 `TIME_LIMIT` 错误）
- 可配置的内存限制，最高 4 GB（v1 固定为 512 MB）
- 可将自定义 OpenTelemetry 导出（日志、指标、追踪）发送到你自己的端点
- 自定义构建步骤和框架支持（Next.js、Astro、SvelteKit 等）
- 内置 HTTP 缓存
- 通过 layers 在不重新部署的情况下，跨多个应用即时批量更新配置
- Web 应用防火墙（WAF）

## 关键概念变化

| v1           | v2           | 备注                                          |
| ------------ | ------------ | ---------------------------------------------- |
| Organization | Organization | 无变化                                      |
| Project      | App          | 一个函数对应一个 app                           |
| Deployment   | Revision     | 代码 + 配置的不可变快照            |
| Project name | App slug     | 用于 URL；在组织内唯一            |
| —            | Labels       | 用于分组/筛选 app 的键值对 |
| —            | Layers       | 跨 app 共享的配置（环境变量）    |
| —            | Config       | 构建和运行时配置                |
| —            | Timeline     | app 内的部署目标                |

## 架构变化：一个函数对应一个 app

在 v1 中，你可能使用一个包含多个活动部署的项目来表示不同的函数。**在 v2 中，请为每个函数创建一个单独的 app。**

v2 引入了 **timelines**。每个 timeline 在任意时刻只有一个活动 revision——部署新的 revision 会替换之前的 revision。通过 API 部署时，revision 会自动标记为 production，因此每个 app 实际上只有一个活动 revision。

这意味着 v2 的 revisions **并不**与 v1 的 deployments 一一对应。在 v1 中，同一个项目内可以同时存在多个活动部署。在 v2 中，每个 timeline 只有一个活动 revision。

推荐做法：

- 为每个函数创建一个 app，并使用具有描述性的 slug（例如 `my-service-auth`、
  `my-service-billing`）
- 使用 **labels** 对相关 app 分组——可通过
  `GET /apps?labels[service]=my-service` 过滤
- 使用 **layers** 在多个 app 之间共享环境变量

## 配置继承

在 v1 中，每个部署都是自包含的：环境变量、入口点以及其他选项都必须在每次 deploy 请求中指定。

在 v2 中，app 会携带配置，并由 revision 继承：

- **构建配置** (`config`)：安装命令、构建命令、运行时入口点。只需在 app 上设置一次，所有 revision 都会继承。
- **环境变量** (`env_vars`)：可在 app 或 layer 上设置，所有 revision 都会继承。
- **Layers**：设置在 app 上，所有 revision 都会继承。

你可以通过在 deploy 请求中包含这些字段，按 revision 进行覆盖。若省略，则使用 app 的配置。这意味着在初始设置后，通常只需要发送 `assets`：

```json
{
  "assets": {
    "main.ts": {
      "kind": "file",
      "content": "Deno.serve((req) => new Response('Hello'));"
    }
  }
}
```

## 身份验证

| Aspect       | v1                              | v2                              |
| ------------ | ------------------------------- | ------------------------------- |
| Token prefix | `dd...`                         | `ddo_...`                       |
| Header       | `Authorization: Bearer <token>` | `Authorization: Bearer <token>` |
| Scope        | Organization                    | Organization                    |
| Base URL     | `https://api.deno.com/v1`       | `https://api.deno.com/v2`       |

请在 Deno Deploy 控制台的组织设置中创建 v2 token。

## 端点映射

### 列出 projects / apps

**v1**: `GET /organizations/{orgId}/projects`

**v2**: `GET /apps`

v2 API 会根据你的 token 自动作用于对应的组织。URL 中不需要组织 ID。

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/organizations/$ORG_ID/projects?page=1&limit=20"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps?limit=30"
```

| Aspect     | v1                            | v2                                |
| ---------- | ----------------------------- | --------------------------------- |
| Pagination | `page` + `limit`（基于页码） | `cursor` + `limit`（基于游标） |
| Filtering  | `q`（按名称/ID 搜索）       | `labels`、`layer`                 |
| Response   | Project 对象数组      | AppListItem 对象数组      |

响应字段映射：

| v1 Project    | v2 AppListItem                   |
| ------------- | -------------------------------- |
| `id` (UUID)   | `id` (UUID)                      |
| `name`        | `slug`                           |
| `description` | _不可用_                  |
| `createdAt`   | `created_at`                     |
| `updatedAt`   | `updated_at`                     |
| —             | `labels`（对象）                |
| —             | `layers`（`{id, slug}` 数组） |

v2 对所有字段名使用 `snake_case`（v1 使用 `camelCase`）。

### 获取 project / app 详情

**v1**: `GET /projects/{projectId}`

**v2**: `GET /apps/{app}`

v2 端点接受 app 的 UUID 或 slug。

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/projects/$PROJECT_ID"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps/my-app-slug"
```

v2 响应包含 `env_vars`、`config`、`labels` 和 `layers`。

### 创建 deployment / revision

**v1**: `POST /projects/{projectId}/deployments`

**v2**: `POST /apps/{app}/deploy`

这是最重要的 API 变更。

#### v1 请求

```json
{
  "entryPointUrl": "main.ts",
  "assets": {
    "main.ts": {
      "content": "Deno.serve((req) => new Response('Hello'));",
      "encoding": "utf-8"
    }
  },
  "envVars": {
    "MY_VAR": "my_value"
  }
}
```

#### v2 请求

```json
{
  "assets": {
    "main.ts": {
      "kind": "file",
      "content": "Deno.serve((req) => new Response('Hello'));",
      "encoding": "utf-8"
    }
  },
  "config": {
    "install": "deno install",
    "runtime": {
      "type": "dynamic",
      "entrypoint": "main.ts"
    }
  },
  "env_vars": [
    { "key": "MY_VAR", "value": "my_value" }
  ]
}
```

主要差异：

| Aspect           | v1                                | v2                                                                           |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| Entrypoint       | 顶层 `entryPointUrl`         | `config.runtime.entrypoint`                                                  |
| Assets           | `content`+`encoding` 或 `gitSha1` | `kind: "file"` 搭配 `content`+`encoding`，或 `kind: "symlink"` 搭配 `target` |
| Env vars         | 对象 `{"KEY": "value"}`         | 数组 `[{"key": "KEY", "value": "value"}]`                                   |
| Import map       | `importMapUrl` 字段              | 不需要；Deno 会自动发现 `deno.json`                                  |
| Lock file        | `lockFileUrl` 字段               | 不需要；由 `deno install` 处理                                        |
| Compiler options | `compilerOptions` 字段           | 不需要；使用 `deno.json`                                                  |
| Build config     | 无（仅导入缓存）        | `config.install` 和 `config.build`                                          |
| Response status  | `200`                             | `202 Accepted`（构建是异步的）                                              |
| Databases/KV     | `databases` 字段                 | 不可用                                                                |
| Request timeout  | `requestTimeout` 字段            | 不可用                                                                |
| Permissions      | `permissions` 字段               | 不可用                                                                |

**构建配置：** 在 v1 中，"build" 步骤仅用于缓存导入。在 v2 中，对应的是 `config.install: "deno install"` 搭配 `config.build: null`。
不需要框架预设（将 `config.framework` 保持为 `""`）。

**配置继承：** `config`、`env_vars` 和 `layers` 在 deploy 请求中都是可选的。若省略，revision 将继承 app 的配置。请在创建 app 时一次性设置这些内容，之后的部署只需发送 `assets`。

#### 状态值

| v1        | v2          | 含义               |
| --------- | ----------- | --------------------- |
| `pending` | `queued`    | 构建尚未开始 |
| _(none)_  | `building`  | 构建中     |
| `success` | `succeeded` | 已部署并生效     |
| `failed`  | `failed`    | 构建失败          |
| _(none)_  | `skipped`   | 构建已跳过     |

### 获取 deployment / revision 状态

**v1**: `GET /deployments/{deploymentId}`

**v2**: `GET /revisions/{revisionId}`

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/deployments/$DEPLOYMENT_ID"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/revisions/$REVISION_ID"
```

当状态为 `failed` 时，v2 响应会包含 `failure_reason`。

### 列出 deployments / revisions

**v1**: `GET /projects/{projectId}/deployments`

**v2**: `GET /apps/{app}/revisions`

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/projects/$PROJECT_ID/deployments?page=1&limit=20"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps/my-app-slug/revisions?limit=30"
```

| Aspect     | v1                 | v2                 |
| ---------- | ------------------ | ------------------ |
| Pagination | `page` + `limit`   | `cursor` + `limit` |
| Filtering  | `q`（按 ID 搜索） | `status`           |

### 追踪构建日志

**v1**: `GET /deployments/{deploymentId}/build_logs`（轮询）

**v2** 提供两种方式：

#### 流式获取 revision 进度（推荐）

`GET /revisions/{revisionId}/progress`

在构建进展时发出事件。会在 revision 到达终止状态（`succeeded`、`failed` 或 `skipped`）时结束。替代了 v1 中循环轮询 deployment 状态的模式。

```bash
curl -H "Authorization: Bearer $TOKEN" \
  -H "Accept: text/event-stream" \
  "https://api.deno.com/v2/revisions/$REVISION_ID/progress"
```

#### 流式获取构建日志

`GET /revisions/{revisionId}/build_logs`

```bash
curl -H "Authorization: Bearer $TOKEN" \
  -H "Accept: text/event-stream" \
  "https://api.deno.com/v2/revisions/$REVISION_ID/build_logs"
```

| Aspect         | v1                                         | v2                                                     |
| -------------- | ------------------------------------------ | ------------------------------------------------------ |
| Formats        | `application/x-ndjson`、`application/json` | `text/event-stream`（SSE）、`application/x-ndjson`      |
| Log fields     | `level`、`message`                         | `timestamp`、`level`、`message`、`step`、`timeline`    |
| Filter by step | 不支持                              | `step` 参数（preparing/installing/building/deploying） |

### 查询 app 日志

**v1**: `GET /deployments/{deploymentId}/app_logs`

**v2**: `GET /apps/{app}/logs`

在 v1 中，日志仅限于单个 deployment。v2 中，日志作用于整个 app，并可选按 `revision_id` 过滤。

```bash
# v1
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v1/deployments/$DEPLOYMENT_ID/app_logs?since=2024-01-01T00:00:00Z&until=2024-01-01T01:00:00Z"

# v2
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps/my-app-slug/logs?start=2024-01-01T00:00:00Z&end=2024-01-01T01:00:00Z"
```

参数映射：

| v1       | v2       | 备注                                |
| -------- | -------- | ------------------------------------ |
| `since`  | `start`  | v2 中必需                       |
| `until`  | `end`    | 可选                             |
| `limit`  | `limit`  | v1：最大 10000。v2：最大 1000          |
| `order`  | _(none)_ | v2 返回按时间顺序的结果       |
| `q`      | `query`  | 文本搜索                          |
| `level`  | `level`  | v1：`warning`。v2：`warn`            |
| `region` | _(none)_ | v2 不支持按区域过滤 |

响应字段映射：

| v1 field  | v2 field      |
| --------- | ------------- |
| `time`    | `timestamp`   |
| `level`   | `level`       |
| `message` | `message`     |
| `region`  | `region`      |
| —         | `revision_id` |
| —         | `trace_id`    |
| —         | `span_id`     |

v2 会将日志封装在一个带有 `next_cursor` 的对象中，以便分页：

```json
{
  "logs": [
    {
      "timestamp": "2024-01-01T00:00:01Z",
      "level": "info",
      "message": "Listening on http://0.0.0.0:8000",
      "region": "us-east-1",
      "revision_id": "abcdef12"
    }
  ],
  "next_cursor": "eyJsYXN0X3RzIjoiMjAy..."
}
```

**流式传输：** 在 v1 中，省略 `since` 和 `until` 可启用实时流式传输。
在 v2 中，省略 `end` 参数即可流式传输。将 `Accept` 头设置为
`text/event-stream` 可使用 SSE 格式，或设置为 `application/x-ndjson` 可使用 NDJSON。
如果在没有 `end` 的情况下请求 `application/json`，将返回错误。

## 使用标签对应用分组

标签取代了 v1 中将多个部署归组到单个
项目下的模式：

```bash
# 使用标签创建应用
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.deno.com/v2/apps" \
  -d '{
    "slug": "my-service-auth",
    "labels": {
      "service": "my-service",
      "function": "auth"
    },
    "config": {
      "install": "deno install",
      "runtime": {
        "type": "dynamic",
        "entrypoint": "main.ts"
      }
    }
  }'

# 列出某个服务中的所有应用
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.deno.com/v2/apps?labels[service]=my-service"
```

## 使用层进行共享配置

层允许你在多个应用之间共享环境变量。这在 v1 中是不可能的，
因为环境变量必须在每次部署请求中重复传入。

```bash
# 创建一个包含共享环境变量的层
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.deno.com/v2/layers" \
  -d '{
    "slug": "my-service-shared",
    "env_vars": [
      {"key": "DATABASE_URL", "value": "postgres://...", "secret": true},
      {"key": "API_KEY", "value": "sk-...", "secret": true}
    ]
  }'

# 创建一个使用该层的应用
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.deno.com/v2/apps" \
  -d '{
    "slug": "my-service-auth",
    "layers": ["my-service-shared"],
    "labels": {"service": "my-service"},
    "config": {
      "install": "deno install",
      "runtime": {
        "type": "dynamic",
        "entrypoint": "main.ts"
      }
    }
  }'
```

当某个层的环境变量更新时，使用该层的所有应用会立即获取到
这些变化。

## 迁移清单

1. **在 Deno Deploy 仪表板中创建一个 v2 组织令牌**（`ddo_`
   前缀）。
2. **每个函数创建一个应用**，而不是将多个函数部署到一个
   项目中。使用标签对相关应用进行分组。
3. **设置层**，用于在多个函数之间共享环境变量。
4. **更新部署请求：**
   - 将 `entryPointUrl` 移动到 `config.runtime.entrypoint`
   - 将 `config.install` 设置为 `"deno install"`
   - 将 `envVars` 对象转换为 `env_vars` 数组，或设置在应用/层上
   - 为资源添加 `kind: "file"`
5. **更新构建日志尾随**，改为使用 `GET /revisions/{id}/progress`（SSE）
   而不是轮询。
6. **更新日志查询：**
   - `since`/`until` → `start`/`end`
   - `warning` → `warn`
   - 日志响应体中的 `time` → `timestamp`
   - 处理 `{logs: [...], next_cursor: ...}` 响应包装
7. **分页方式更新**：从基于页码改为基于游标。
8. **更新状态值**：`pending` → `queued`，`success` → `succeeded`。
9. **将字段名从 camelCase 更新为 snake_case。**
