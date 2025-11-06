---
title: Prisma Postgres
description: 为您的 Deno Deploy 应用程序配置和管理 Prisma Postgres 数据库。
oldUrl: /deploy/reference/prisma-postgres/
---

Prisma Postgres 是一种无服务器的 PostgreSQL 数据库，响应迅速且易于扩展。它基于裸金属基础设施构建，零冷启动，并内置全局缓存，空闲时自动缩减到零，同时能无缝处理流量高峰。通过 Deno Deploy 的数据库配置功能，您可以创建和管理 Prisma Postgres 实例，这些实例会自动与您的应用及其部署环境集成。

## 概述

当您配置一个 Prisma Postgres 数据库并分配给应用后，Deno Deploy 会自动为每个部署环境创建独立的数据库：

- 生产部署使用 `{app-id}-production`
- Git 分支使用 `{app-id}--{branch-name}`
- 预览部署使用 `{app-id}-preview`

您的代码会自动连接到每个环境对应的正确数据库，无需时间线检测或手动配置。

## 配置 Prisma Postgres 数据库

### 创建实例

1. 进入您的组织仪表板，点击导航栏中的“Databases”。
2. 点击“Provision Database”。
3. 从可选项中选择“Prisma Postgres”。
4. 为数据库实例命名。
5. 完成配置流程。

### 分配给应用

成功配置 Prisma Postgres 实例后：

1. 在数据库实例列表中，点击对应实例旁的“Assign”。
2. 从下拉菜单中选择应用。
3. （可选）配置在每次构建后自动运行的迁移命令（详见[自动迁移](#自动迁移)）。
4. Deno Deploy 会自动为生产、Git 分支和预览环境创建独立数据库。
5. 监控配置状态，直到显示“Connected”。

## 在代码中使用 Prisma Postgres

### 零配置需求

分配后，您的代码会自动连接到每个环境对应的正确 Prisma Postgres 数据库。Deno Deploy 会将标准的 PostgreSQL 环境变量注入运行时：

- `PGHOST` - 数据库主机（db.prisma.io）
- `PGPORT` - 数据库端口（5432）
- `PGDATABASE` - 数据库名称（自动匹配环境）
- `PGUSER` - 数据库用户名
- `PGPASSWORD` - 数据库密码
- `PGSSLMODE` - SSL 模式配置
- `DATABASE_URL` - 标准 PostgreSQL 连接字符串
  (`postgresql://user:password@db.prisma.io:5432/database`)
- `PRISMA_ACCELERATE_URL` - Prisma Accelerate 的连接 URL，Prisma Accelerate 是一个全球连接池和缓存层，提供优化的数据库访问和更低延迟

### 使用 pg 的示例

```typescript
import { Pool } from "npm:pg";

// 无需配置，Deno Deploy 自动处理
const pool = new Pool();

Deno.serve(async () => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [123]);

  return new Response(JSON.stringify(result.rows), {
    headers: { "content-type": "application/json" },
  });
});
```

### 使用 Prisma ORM 的示例

```typescript
import { PrismaClient } from "@prisma/client";

// Prisma Client 自动使用 DATABASE_URL 环境变量
const prisma = new PrismaClient();

Deno.serve(async () => {
  const users = await prisma.user.findMany();

  return new Response(JSON.stringify(users), {
    headers: { "content-type": "application/json" },
  });
});
```

## 环境专用数据库

每个环境自动拥有自身独立数据库：

- **生产环境**：部署到生产时，连接 `{app-id}-production`
- **Git 分支**：分支部署连接 `{app-id}--{branch-name}`
- **预览部署**：预览时间线连接 `{app-id}-preview`

这样的隔离确保生产数据的安全，同时方便开发和测试。

## 架构管理与迁移

由于每个环境拥有独立数据库，您可以安全地测试架构变更和迁移而无影响生产数据。

### 自动迁移

将 Prisma Postgres 数据库分配给应用时，可以配置一个迁移命令，该命令会在每次成功构建后自动运行，确保数据库架构与应用代码在所有环境同步。

**设置自动迁移：**

1. 在分配数据库给应用（或编辑已有分配）时，在“Migration Command”字段输入迁移命令。
2. 每次新版本成功构建后，该命令会自动执行。
3. 命令针对该版本可连接的每个数据库分别执行——即生产、各 Git 分支数据库和预览数据库分别执行一次。
4. 迁移命令拥有与应用相同的环境变量，包括 `DATABASE_URL`。

**使用 Prisma Migrate 示例：**

在 `deno.json` 中添加任务：

```json
{
  "tasks": {
    "migrate": "deno run --allow-net --allow-env --allow-read npm:prisma migrate deploy"
  }
}
```

然后在分配数据库给应用时，将迁移命令设置为 `deno task migrate`。Deno Deploy 会在每次构建后自动执行该命令，将迁移应用到所有环境数据库。

### 在本地使用 Prisma 工具

要从本地管理您的数据库架构，需要获取要操作的环境数据库的连接字符串。您可以在 Deno Deploy 仪表板数据库实例详情页的数据库表中点击链接按钮获取 `DATABASE_URL`。

#### 生成 Prisma Client

定义或更新 Prisma schema 后，生成 Prisma Client：

```bash
npx prisma generate
```

该命令基于 schema 创建类型安全的数据库客户端。

#### 运行迁移

要将迁移应用到特定环境数据库，使用对应环境的连接字符串：

```bash
# 应用迁移到生产数据库
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-production" npx prisma migrate deploy

# 应用迁移到分支数据库
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b--feature-branch" npx prisma migrate deploy

# 应用迁移到预览数据库
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-preview" npx prisma migrate deploy
```

开发阶段，您可以交互式创建和应用迁移：

```bash
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-dev" npx prisma migrate dev
```

#### 初始化数据库数据

通过 Prisma 的种子功能填充初始数据：

```bash
# 为生产数据库种子数据
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b-production" npx prisma db seed

# 为分支数据库种子数据
DATABASE_URL="postgresql://user:pass@db.prisma.io:5432/3ba03b--feature-branch" npx prisma db seed
```

## 本地开发

在本地使用 Deploy 的 Prisma Postgres 数据库时，请在项目根目录创建 `.env` 文件，并填入连接详情。您可以在 Deno Deploy 仪表板数据库实例详情页的数据库表中点击 URL 获取 `DATABASE_URL`。

```bash
PGHOST=db.prisma.io
PGPORT=5432
PGDATABASE=3ba03b-dev
PGUSER=your-username
PGPASSWORD=your-password
PGSSLMODE=require
DATABASE_URL=postgresql://your-username:your-password@db.prisma.io:5432/3ba03b-dev
```

使用 `--env` 参数运行应用：

```bash
deno run --env --allow-all main.ts
```

## 管理您的 Prisma Postgres 实例

### 查看详情

点击数据库仪表板中的 Prisma Postgres 实例查看：

- 连接信息
- 分配的应用
- 针对每个环境创建的独立数据库
- 健康和连接状态

### 认领您的 Prisma 项目

配置 Prisma Postgres 时，Deno Deploy 会在 prisma.io 创建一个免费层项目，该免费层包含每月 10 万次操作、500 MB 存储和 5 个数据库。

若要升级 Prisma 订阅计划，解除免费层限制，需在 prisma.io 上认领您的数据库项目：

1. 进入 Deno Deploy 仪表板的数据库实例详情页。
2. 点击“Claim on Prisma”按钮。
3. 按流程完成 Prisma 项目认领。
4. 选择您想认领项目的 Prisma 工作区。

认领后，您可以通过 prisma.io 管理订阅，升级计划以增加操作次数限制、存储空间及获得更多功能。

### 状态指示

- **🟢 Connected** - 所有数据库均已就绪并正常工作
- **🟡 Creating** - 数据库正在配置中
- **🔴 Error** - 某些数据库创建失败
- **⚪ Unassigned** - 尚未有应用使用此数据库

### 管理应用分配

编辑已有应用与数据库的分配（包含更新迁移命令）：

1. 进入数据库详情页
2. 在“Assigned Apps”表中找到对应应用
3. 点击应用旁的“Edit”

断开应用与 Prisma Postgres 实例的连接：

1. 进入数据库详情页
2. 在“Assigned Apps”表中找到对应应用
3. 点击应用旁的“Remove”

数据库将保留在您的 Prisma Postgres 实例中，仅移除应用与实例间的连接。

## 故障排查

### 配置失败

“数据库创建失败”可能由以下原因导致：

- 容量不足或配额限制
- 数据库名称冲突
- 临时服务问题

尝试点击“Fix”按钮重试失败操作。

### 连接失败

“Error”状态可通过以下方式解决：

- 点击“Fix”按钮重试失败操作
- 查看数据库详情页获取更多信息
- 确认应用已成功部署并运行

## 常见问题

**问：多个应用可以共享同一个 Prisma Postgres 实例吗？**

可以！多个应用可以分配到同一个 Prisma Postgres 实例。每个应用在该实例中拥有独立隔离的数据库。

**问：移除应用分配时，数据会怎么样？**

数据库仍保留在您的 Prisma Postgres 实例中，仅移除应用与数据库的连接。

**问：如何直接访问我的 Prisma Postgres 数据库？**

使用 Deno Deploy 仪表板中的连接信息，借助任何 PostgreSQL 客户端工具（如 psql、pgAdmin、TablePlus 等）连接，指定对应环境的数据库名称。

**问：可以多个环境共用同一个数据库吗？**

默认每个环境拥有独立数据库以实现隔离。您可在代码中显式配置数据库连接覆盖此行为，但不建议用于生产环境。

**问：如何删除 Prisma Postgres 实例？**

先移除所有应用分配，然后点击数据库实例页的“Delete”，这会永久删除该 Prisma Postgres 实例及所有数据。