---
title: 数据库
description: 连接到外部数据库实例，实现您的应用及其环境无缝集成。
---

Deno Deploy 的数据库功能让您的应用轻松连接多种数据库，实现应用状态的无缝管理。目前支持 PostgreSQL 和 Deno KV。

创建或链接数据库实例后，Deno Deploy 会在该实例内自动为每个部署环境创建隔离的（逻辑）数据库，包括生产环境、Git 分支和预览时间线。您的应用代码根据当前环境，使用自动注入的环境变量连接到相应的数据库。这确保了数据在不同的开发和部署阶段保持一致且隔离。

Deno Deploy 当前支持两种数据库引擎：

- **PostgreSQL** — 连接已有的外部托管 PostgreSQL 实例，或者通过 Deno Deploy 由 Prisma 托管的托管 PostgreSQL 数据库。
- **Deno KV** — 一个快速的、全球分布的面向边缘计算的键值存储。

## 创建数据库实例

有两种方式将数据库实例添加到您的 Deno Deploy 组织：

- **链接数据库**：连接已有的外部数据库实例（例如您自行运行的 PostgreSQL 服务器或云服务商托管的实例）。
- **供应数据库**：创建并附加 Deno Deploy 提供的托管数据存储（Deno KV 或 Prisma Postgres）。

### 链接外部数据库

要链接已有的外部数据库实例，可以：

- 访问组织仪表盘中的“Databases”页面，点击“Link Database”按钮；
- 进入应用设置的“Databases”标签页，点击“Attach Database”，然后在数据库实例选择下拉菜单中选择“Link Database”。

接下来，填写外部数据库实例的连接详情。您需要提供：

- **引擎**：选择数据库引擎（当前仅支持 PostgreSQL）。
- **连接详情**：输入主机名、端口、用户名、密码，必要时提供 CA 证书。您也可以粘贴连接字符串，自动填充以上字段。
- **Slug**：给数据库实例起一个描述性名称，在仪表盘中识别此实例。该名称仅供 Deno Deploy 内部使用，不影响实际数据库服务器。

填写完成后，点击“Test Connection”验证设置。连接成功后，点击“Save”将实例添加到组织。

如果连接失败，请核对连接详情，确认数据库服务器能从 Deno Deploy 网络访问。目前无法提供 Deno Deploy 的 IP 地址列表，请确保数据库服务器允许所有 IP 连接。如有困难，可[联系客服](/deploy/support/)寻求帮助。

:::info

由于 Deno Deploy 会为每个环境（生产、Git 分支和预览）创建隔离数据库，请确保您提供的数据库用户拥有在服务器上创建新数据库的足够权限。

:::

#### TLS/SSL 配置

链接外部数据库时，Deno Deploy 支持安全的 SSL/TLS 连接。根据您的数据库提供商，您可能需要上传 CA 证书以验证服务器身份。

如果数据库提供商使用受信任的根 CA （如 Let's Encrypt），则无需上传证书，SSL 连接会自动生效。

使用 AWS RDS 的用户，Deno Deploy 会自动检测 RDS 实例，并提供“使用 AWS 证书包”的选项，无需手动下载证书。

Google Cloud SQL 用户需从 Google Cloud 控制台下载 Google Cloud SQL CA 证书，并在链接数据库时上传。

其他使用自签名证书或私有 CA 的提供商，您需上传用于签署数据库证书的具体 CA 证书。通常可从提供商的文档或控制台获得。

### 供应托管数据库

要创建并附加 Deno Deploy 托管的数据库实例，您可以：

- 在组织仪表盘的“Databases”页面点击“Provision Database”按钮；
- 进入应用设置的“Databases”标签页，点击“Attach Database”，然后在下拉菜单中选择“Provision Database”。

然后选择要供应的数据库引擎。当前可用：

- **Deno KV** — 一个快速的、全球分布的边缘键值存储，由 Deno 代表您托管。
- **Prisma Postgres** — 世界上最先进的开源关系型数据库，由 [Prisma](https://www.prisma.io/) 托管。

您需要提供一个 **Slug**，用于在仪表盘中标识数据库实例。该名称仅供 Deno Deploy 内部使用，不影响实际数据库服务器。

根据所选引擎，可能还会有额外配置选项，比如选择区域。选择靠近应用用户的区域有助于降低延迟，提升查询性能。

准备好后，点击“Provision”创建数据库实例。Deno Deploy 会处理配置过程并为您搭建必要基础设施。

## 将数据库关联到应用

创建或链接数据库实例后，您可以将它们分配给应用。每个数据库实例可分配给多个应用。每个应用在实例中对应环境（生产、Git 分支、预览时间线）会拥有自己的隔离数据库。

:::info

当前单个应用不能关联多个数据库实例。因此暂不支持同时关联 Deno KV 和 PostgreSQL 数据库到同一应用。

:::

分配后，Deno Deploy 会为应用中的每个时间线自动创建隔离数据库，命名规则如下：

- 生产环境数据库格式为 `{app-id}-production`
- 每个 Git 分支数据库格式为 `{app-id}--{branch-name}`
- 单个预览数据库格式为 `{app-id}-preview`

:::info

当前每个应用仅创建一个预览数据库，所有预览部署共享该数据库。未来版本将为每个预览部署创建独立数据库。

:::

要分配数据库给应用，您可以：

- 在组织仪表盘“Databases”页面找到数据库实例，点击“Assign”，然后从下拉菜单选择应用。
- 进入应用设置的“Databases”标签页，点击“Attach Database”，然后选择数据库实例。

分配后，Deno Deploy 会自动为应用每个环境创建所需的隔离数据库。

## 从代码连接数据库

分配数据库给应用后，连接数据库非常简单。Deno Deploy 会自动处理连接详情、凭证和环境变量。

### Deno KV

对于 Deno KV，您可以使用内置的 `Deno.openKv()` API 连接分配的 Deno KV 实例。无需额外配置，Deno Deploy 会根据当前环境自动连接到正确的实例。

```typescript
// 无需参数，Deno Deploy 自动处理
const kv = await Deno.openKv();

Deno.serve(async () => {
  // 使用 Deno KV 实例
  await kv.set(["user", "123"], { name: "Alice", age: 30 });
  const user = await kv.get(["user", "123"]);

  return new Response(JSON.stringify(user.value), {
    headers: { "content-type": "application/json" },
  });
});
```

### PostgreSQL

针对 PostgreSQL 数据库（包括外部和供应的），Deno Deploy 会自动将标准数据库环境变量注入应用运行环境：

- `DATABASE_URL`：当前环境的完整连接字符串，格式为 `postgresql://username:password@hostname:port/database`。
- `PGHOST`：数据库服务器主机名。
- `PGPORT`：数据库服务器端口。
- `PGDATABASE`：当前环境数据库名。
- `PGUSER`：数据库用户名。
- `PGPASSWORD`：数据库密码。

若您的数据库需要自定义 SSL/TLS 证书，Deno Deploy 也会将该证书注入默认证书存储，确保 SSL 连接自动生效。

您可以使用喜欢的 PostgreSQL 客户端库（如 npm 包 `pg`）通过这些环境变量连接数据库。大多数库都会自动识别并使用这些标准环境变量，无需额外配置。

以下是示例代码，展示在 Deno Deploy 应用中如何连接 PostgreSQL：

```typescript
import { Pool } from "npm:pg";

// 无需参数，库自动从环境变量读取连接信息
const pool = new Pool();

Deno.serve(async () => {
  // 使用数据库
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [123]);

  return new Response(JSON.stringify(result.rows), {
    headers: { "content-type": "application/json" },
  });
});
```

## 执行迁移和数据填充（seeding）

由于每个环境都有自己的隔离数据库，通常每个应用都会涉及多个独立数据库。每次部署新版本时，手动对每个数据库执行迁移或插入种子数据不现实。

为简化该过程，Deno Deploy 允许您配置自动化预部署命令，每当版本发布到时间线时，在部署开始前运行该命令。

该命令拥有与应用相同的环境变量可用，包括 `PGHOST`、`PGPORT`、`PGDATABASE` 等，便于使用现有迁移工具执行迁移或填充数据。

要设置自动化迁移命令，前往应用设置页面的“App Config”部分，在“Pre-Deploy Command”字段编辑预部署命令（例如 `deno task migrate` 或 `npm run migrate`）。

您可以在修订构建日志的“Deployment”部分查看预部署命令执行的详细日志。

例如，您可以使用 [`node-pg-migrate`](https://github.com/salsita/node-pg-migrate) 设置迁移脚本：

1. 在 `deno.json` 中添加任务：
   ```json
   {
     "tasks": {
       "migrate": "deno run --allow-net --allow-env --allow-read --allow-write npm:node-pg-migrate up"
     }
   }
   ```
2. 创建 migrations 目录并添加迁移文件，如 `migrations/1234567890_create-users-table.js`：
   ```javascript
   exports.up = (pgm) => {
     pgm.createTable("users", {
       id: "id",
       name: { type: "varchar(100)", notNull: true },
       email: { type: "varchar(100)", notNull: true },
       created_at: {
         type: "timestamp",
         notNull: true,
         default: pgm.func("current_timestamp"),
       },
     });
   };
   exports.down = (pgm) => {
     pgm.dropTable("users");
   };
   ```
3. 在应用设置中将预部署命令设置为 `deno task migrate`。

Deno Deploy 会在每次部署之前自动运行该命令，确保您的环境特定数据库保持最新。

其他迁移工具，如 Prisma Migrate、Drizzle 或 Kysely，也可以用类似方式配置。

## 本地开发

本地开发时，您有两种方案配置数据库：

- 使用本地运行的数据库实例，如本地 PostgreSQL 服务器或 Deno 内置的 Deno KV 后端。
- 通过 `--tunnel` 连接 Deno Deploy 上供应的托管隔离本地开发实例。

### 使用本地数据库实例

#### Deno KV

对于 Deno KV，您可以调用内置的 `Deno.openKv()` API 连接本地 Deno KV 实例。默认使用存储在主目录的本地文件后端。

```typescript
const kv = await Deno.openKv(); // 连接本地 Deno KV 实例

Deno.serve(async () => {
  // 使用 Deno KV 实例
  await kv.set(["user", "123"], { name: "Alice", age: 30 });
  const user = await kv.get(["user", "123"]);

  return new Response(JSON.stringify(user.value), {
    headers: { "content-type": "application/json" },
  });
});
```

#### PostgreSQL

要在本地安装 PostgreSQL，请参考 [postgresql.org](https://www.postgresql.org/download/) 上针对您操作系统的说明。macOS 用户可使用 `brew install postgresql`，多数 Linux 发行版通过软件包管理器提供 PostgreSQL 包。

安装后，为本地开发创建新数据库和用户：

```bash
createdb myapp_dev
createuser myuser --pwprompt
```

在项目根目录设置 `.env` 文件，填写本地 PostgreSQL 连接信息：

```bash
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/myapp_dev
```

然后，您可以使用喜欢的 PostgreSQL 客户端库（例如 npm 包 `pg`）通过 `DATABASE_URL` 环境变量连接本地数据库。

若使用 Deno 本地开发，可通过 `--env-file` 标志从 `.env` 文件自动加载环境变量：

```bash
deno run -A --env-file main.ts
```

### 使用托管隔离的本地开发实例

Deno Deploy 支持使用 [`--tunnel` 标志](https://docs.deno.com/deploy/reference/tunnel) 连接托管隔离的本地开发数据库。

操作流程：

1. 在您的 Deno Deploy 组织中供应一个数据库实例，像往常一样分配给应用。
2. 使用 `--tunnel` 标志启动本地开发服务器：

```bash
deno task --tunnel dev
# 或
deno run -A --tunnel main.ts
```

Deno Deploy 会自动注入相应的数据库环境变量，使代码能连接托管的隔离数据库。请注意，该实例在使用同一应用的所有开发者间共享，修改数据时请谨慎。

:::info

使用 `--tunnel` 标志时，Deno Deploy 同时启用其他功能，如：

- 将日志、跟踪和指标从本地导出到 Deno Deploy 仪表盘
- 将“Local”环境变量拉取至本地环境
- 将本地服务器暴露到公共 URL，方便分享和测试

若不需要这些功能，建议使用本地数据库实例。

:::

## 数据库管理

### 组织层面

您可在组织仪表盘的“Databases”页面查看和管理所有数据库实例。这里列出所有链接和供应的数据库实例及其状态、分配的应用和连接详情（如适用）。

点击数据库实例进入详细页面，可查看实例信息，包括分配的应用和实例内创建的各个数据库。每个数据库显示名称、状态及关联的应用和时间线。

若数据库创建失败，将显示错误状态和“Fix”按钮，您可以重试或查看详细错误信息。

在该页面，您还可将数据库实例从应用分离，或完全删除实例。

每个数据库旁边可以打开数据库浏览器（仅限 PostgreSQL），或复制连接字符串（`DATABASE_URL`），方便在本地调试时连接数据库。

### 应用层面

在应用设置的“Databases”标签页，也可以管理数据库实例。这里能看到分配给应用的数据库实例及其状态和连接详情。

可以查看为应用内所分配实例创建的所有数据库，包括生产环境、Git 分支和预览时间线。每个数据库显示名称和状态。

支持打开数据库浏览器（PostgreSQL）以及复制每个数据库的连接字符串（`DATABASE_URL`），方便本地调试。

## 数据库浏览器

Deno Deploy 为 PostgreSQL 数据库内置数据库浏览器，允许您直接在仪表盘浏览和管理数据。

访问方法：

进入应用设置“Databases”标签页，找到分配的 PostgreSQL 数据库实例，点击“Explore Database”打开数据库浏览界面，您可以查看表格、执行查询及管理数据。

:::info

数据库浏览器目前不支持 Deno KV 数据库。

:::

## Prisma Postgres 实例及“认领”操作

通过 Deno Deploy 供应的托管 Prisma Postgres 实例初始为“未认领”状态。这意味着实例由 Deno Deploy 代表您管理，您无法直接访问拥有该实例的 Prisma 账户。未认领实例会根据 Deno Deploy 计划有限制数据库数量和大小。

如果希望完全控制 Prisma Postgres 实例（包括升级 Prisma 计划），可以“认领”该实例到您自己的 Prisma 账户。操作方法：在 Deno Deploy 仪表盘数据库实例详情页点击“Claim Instance”按钮，按照指引将实例关联到您的 Prisma 账户。

:::warning

认领 Prisma Postgres 实例为永久操作，无法撤销。认领后，实例归您的 Prisma 账户管理，并适用您的 Prisma 账户配额（基于计划）。Deno Deploy 自动为每个应用创建隔离数据库的功能依然正常工作。

:::

## 限制

您在组织内可以创建无限数量的链接数据库实例和 Deno KV 实例。

托管的 Prisma Postgres 实例，每个组织只能创建少数几个实例。每个实例有数据库数量限制，直接影响可分配给该实例的应用数量。达到限制后，该实例将无法再创建新数据库。

若 Prisma Postgres 实例被“认领”，数据库数量限制由您的 Prisma 计划决定。未认领实例则适用默认限制。

托管 Prisma Postgres 实例的数据库大小和操作次数限制也根据您所选计划而设。在实例详情页底部展示使用情况。若实例被认领，限制由 Prisma 计划决定，未认领实例则适用默认限制。

## 常见问题

**问：多个应用可以共享同一个数据库实例吗？**

答：可以！多个应用可以分配到同一个数据库实例，每个应用在该实例内拥有自己的隔离数据库。

**问：将应用从数据库实例中移除后，数据会怎样？**

答：数据库仍保留在服务器上，仅移除应用与数据库实例的连接关系。

**问：多个环境可以使用同一个数据库吗？**

答：默认每个环境（生产、分支、预览）拥有独立数据库，以确保隔离和防止数据冲突。但您可通过数据库库中的选项自定义代码连接的数据库。

**问：如何直接访问我的数据库？**

答：您可以使用提供的连接详情直接连接数据库服务器。请使用 Deno Deploy 仪表盘中显示的数据库名称。

**问：可以修改数据库连接信息吗？**

答：可以，点击任意数据库实例的“Edit”更新连接详情。保存前请测试连接确保有效。

**问：如何删除数据库实例？**

答：先移除实例的所有应用分配，然后点击数据库实例的“Delete”。此操作仅从 Deno Deploy 中移除连接，实际数据库服务器不受影响。