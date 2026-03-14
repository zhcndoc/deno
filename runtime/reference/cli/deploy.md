---
title: "deno deploy"
command: deploy
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno deploy"
description: "管理和发布您的网络项目"
---

`deno deploy` 命令提供了一个命令行接口，用于管理和部署应用到 [Deno Deploy EA](https://deno.com/deploy)，这是 Deno 用来托管 JavaScript、TypeScript 和 WebAssembly 应用的平台。

当不带任何子命令调用时，`deno deploy` 会将您本地的目录部署到指定的应用中。

## 认证

deploy 命令使用基于令牌的安全认证，令牌存储在系统的密钥环中：

- **自动认证**：CLI 会在需要时提示进行认证
- **令牌存储**：部署令牌通过系统密钥环安全存储
- **令牌管理**：CLI 提供获取、设置和删除认证令牌的操作

## 全局选项

- `-h, --help` - 显示帮助信息
- `--org <name>` - 指定组织名称
- `--app <name>` - 指定应用名称
- `--prod` - 直接部署到生产环境

## 子命令

### 创建应用

在 Deno Deploy 中创建一个新应用。无标志运行时，会启动交互式向导引导每一步。当提供任何配置标志时，命令以非交互模式运行（适用于 CI/CD 流水线和脚本）。

```bash
deno deploy create [root-path]
```

可选的 `[root-path]` 参数设置本地项目目录。默认是当前工作目录。

#### 通用选项

- `-h, --help` - 显示帮助信息
- `--org <name>` - 创建应用的组织
- `--app <name>` - 应用名称（用于默认 URL）
- `--allow-node-modules` - 上传时包含 `node_modules`
- `--no-wait` - 跳过等待首次构建完成
- `--dry-run` - 验证标志并模拟流程，但不实际创建任何内容

#### 源代码选项

这些标志控制应用代码来源：

- `--source <github|local>` - 从 GitHub 仓库或本地文件系统部署
- `--owner <name>` - GitHub 拥有者/组织名（源为 `github` 时必需）
- `--repo <name>` - GitHub 仓库名（源为 `github` 时必需）

#### 构建配置选项

- `--app-directory <path>` - 项目中应用目录的路径
- `--framework-preset <preset>` - 使用框架预设的构建默认配置。支持的值：`astro`、`nextjs`、`nuxt`、`remix`、`solidstart`、`sveltekit`、`fresh`、`lume`，或 `""`（无）
- `--do-not-use-detected-build-config` - 跳过自动检测的构建设置，仅使用提供的标志
- `--install-command <command>` - 安装命令（例如 `"deno install"`）
- `--build-command <command>` - 构建命令（例如 `"deno task build"`）
- `--pre-deploy-command <command>` - 构建后部署前运行的命令

#### 运行时模式选项

- `--runtime-mode <dynamic|static>` - 应用运行模式，服务器端或静态站点

**动态模式**（服务器）：

- `--entrypoint <file>` - 入口文件（例如 `main.ts`）
- `--arguments <arg>` - 传递给入口文件的参数（可多次指定）
- `--working-directory <path>` - 进程的工作目录

**静态模式**（静态站点）：

- `--static-dir <dir>` - 存放静态文件的目录
- `--single-page-app` - 对匹配不到文件的路由返回 `index.html`（替代 404）

#### 构建资源选项

- `--build-timeout <minutes>` - 构建超时时间。允许值：`5`、`10`、`15`、`20`、`25`、`30`
- `--build-memory-limit <megabytes>` - 构建内存限制（MB）。允许值：`1024`、`2048`、`3072`、`4096`
- `--region <region>` - 部署区域。允许值：`us`、`eu`、`global`

#### 交互式向导

运行 `deno deploy create` 无标志时，交互式向导会引导你完成每步配置：

1. **组织** - 选择创建应用的组织
2. **应用名** - 选择应用名称
3. **来源** - 从 GitHub 或本地目录部署
4. **GitHub 仓库** _(如果来源是 GitHub)_ - 选择拥有者和仓库
5. **应用目录** - 选择项目内的目录（自动检测工作区成员）
6. **构建配置** - 自动检测框架设置，可接受或手动配置（框架预设、安装/构建命令、运行时模式等）
7. **构建超时** - 构建允许最长时间
8. **构建内存限制** - 分配给构建的内存大小
9. **区域** - 部署到哪里（`us`、`eu` 或 `global`）
10. **确认** - 创建前预览和确认

#### 示例

交互式创建应用：

```bash
deno deploy create
```

使用所有标志创建本地动态应用（非交互）：

```bash
deno deploy create \
  --org my-org \
  --app my-api \
  --source local \
  --runtime-mode dynamic \
  --entrypoint main.ts \
  --install-command "deno install" \
  --build-command "deno task build" \
  --build-timeout 5 \
  --build-memory-limit 1024 \
  --region us
```

创建静态站点：

```bash
deno deploy create \
  --org my-org \
  --app my-site \
  --source local \
  --runtime-mode static \
  --static-dir dist \
  --single-page-app \
  --build-command "deno task build" \
  --build-timeout 10 \
  --build-memory-limit 2048 \
  --region us
```

使用框架预设（因为预设提供默认配置，使用的标志更少）：

```bash
deno deploy create \
  --org my-org \
  --app my-fresh-app \
  --source local \
  --framework-preset fresh \
  --build-timeout 5 \
  --build-memory-limit 1024 \
  --region us
```

从 GitHub 仓库部署：

```bash
deno deploy create \
  --org my-org \
  --app my-app \
  --source github \
  --owner my-github-org \
  --repo my-repo \
  --framework-preset astro \
  --build-timeout 10 \
  --build-memory-limit 2048 \
  --region global
```

### 环境变量管理

管理已部署应用的环境变量。

```bash
deno deploy env
```

**选项：**

- `-h, --help` - 显示帮助信息
- `--org <name>` - 组织名称
- `--app <name>` - 应用名称

#### 列出环境变量

```bash
deno deploy env list
```

列出应用中的所有环境变量。

#### 添加环境变量

```bash
deno deploy env add <variable> <value>
```

向应用添加环境变量。

**选项：**

- `--secret` - 标记变量为秘密。秘密值在仪表盘和 `env list` 输出中隐藏。

示例：

```bash
deno deploy env add DATABASE_URL "postgresql://user:pass@localhost/db"

# 添加一个秘密环境变量
deno deploy env add API_KEY "sk-secret-value" --secret
```

#### 更新环境变量值

```bash
deno deploy env update-value <variable> <value>
```

更新已有环境变量的值。

示例：

```bash
deno deploy env update-value API_KEY "new-api-key-value"
```

#### 指定环境变量上下文

环境变量可以指定可用的上下文，如生产、预览、本地和构建环境。

```bash
deno deploy env update-contexts <variable> [contexts...]
```

更新应用中环境变量的上下文：

#### 删除环境变量

```bash
deno deploy env delete <variable>
```

从应用中删除环境变量。

示例：

```bash
deno deploy env delete OLD_API_KEY
```

#### 从文件加载环境变量

```bash
deno deploy env load <file>
```

从 `.env` 文件加载环境变量到应用。CLI 根据变量名自动检测其是否为秘密（例如包含 `SECRET`、`TOKEN`、`PASSWORD` 等关键字的变量），并相应标记。

**选项：**

- `--non-secrets <keys...>` - 指定 `.env` 文件中应被当作非秘密的键，覆盖自动检测

示例：

```bash
deno deploy env load .env.production

# 加载并指定某些键为非秘密
deno deploy env load .env.production --non-secrets PUBLIC_URL SITE_NAME
```

### 数据库管理

管理组织的数据库实例。

```bash
deno deploy database
```

**选项：**

- `-h, --help` - 显示帮助信息
- `--org <name>` - 组织名称

#### 预置数据库

```bash
deno deploy database provision <name> --kind <denokv|prisma> [--region <region>]
```

创建新的数据库实例。

**选项：**

- `--kind <denokv|prisma>` - 要预置的数据库类型（必填）
- `--region <region>` - 数据库的主区域（Prisma 类型必填）

示例：

```bash
# 预置一个 Deno KV 数据库
deno deploy database provision my-kv-db --kind denokv

# 预置一个 Prisma Postgres 数据库
deno deploy database provision my-pg-db --kind prisma --region us-east-1
```

#### 关联外部数据库

```bash
deno deploy database link <name> [connectionString]
```

将外部 PostgreSQL 数据库连接到组织。可以提供连接字符串或使用单独的标志。

**选项：**

- `--hostname <host>` - 数据库域名（与连接字符串冲突）
- `--username <user>` - 数据库用户名（与连接字符串冲突）
- `--password <pass>` - 数据库密码（与连接字符串冲突）
- `--port <number>` - 数据库端口（与连接字符串冲突）
- `--cert <cert>` - SSL 证书用于连接
- `--dry-run` - 测试连接但不实际关联

示例：

```bash
# 使用连接字符串关联
deno deploy database link my-db "postgres://user:pass@host:5432/mydb"

# 使用单独标志关联
deno deploy database link my-db \
  --hostname db.example.com \
  --username admin \
  --password secret \
  --port 5432

# 先测试连接
deno deploy database link my-db "postgres://user:pass@host:5432/mydb" --dry-run
```

#### 给应用分配数据库

```bash
deno deploy database assign <name> [--app <name>]
```

将数据库实例分配给应用。如果没提供 `--app`，会交互式提示选择应用。

示例：

```bash
deno deploy database assign my-db --app my-api
```

#### 从应用解除数据库

```bash
deno deploy database detach <name> [--app <name>]
```

移除数据库实例与应用的连接。

示例：

```bash
deno deploy database detach my-db --app my-api
```

#### 查询数据库

```bash
deno deploy database query <name> <database> [query...]
```

对数据库执行 SQL 查询。

示例：

```bash
deno deploy database query my-db mydb "SELECT * FROM users LIMIT 10"
```

#### 列出数据库

```bash
deno deploy database list [search]
```

列出组织中所有数据库实例。也支持 `database ls`。

示例：

```bash
# 列出所有数据库
deno deploy database list

# 根据名称过滤
deno deploy database list my-db
```

#### 删除数据库

```bash
deno deploy database delete <name>
```

永久删除数据库实例。也可用 `database remove` 或 `database rm`。

示例：

```bash
deno deploy database delete my-old-db
```

### 切换组织和应用

设置默认组织和应用，后续命令无需重复传递 `--org` 和 `--app`。

```bash
deno deploy switch [--org <name>] [--app <name>]
```

无标志运行时，交互式提示选择组织和应用。

**选项：**

- `--org <name>` - 切换到的组织
- `--app <name>` - 切换到的应用

示例：

```bash
# 交互式切换
deno deploy switch

# 切换到特定组织和应用
deno deploy switch --org my-company --app my-api
```

### 登出

移除存储的认证令牌。

```bash
deno deploy logout
```

### 应用日志

流式查看已部署应用日志。

```bash
deno deploy logs
```

**选项：**

- `-h, --help` - 显示帮助信息
- `--org <name>` - 组织名称
- `--app <name>` - 应用名称
- `--start <date>` - 日志的起始时间戳
- `--end <date>` - 日志的结束时间戳（需要 `--start`）

示例：

```bash
deno deploy logs --org my-org --app my-app --start "2024-01-01T00:00:00Z"
```

### 沙箱管理

从 Deploy CLI 直接操作运行中的沙箱。

```bash
deno deploy sandbox --help
```

**选项：**

- `-h, --help` - 显示帮助信息
- `--token <token>` - 覆盖沙箱操作使用的认证令牌
- `--config <path>` - 自定义 Deploy CLI 配置文件路径
- `--org <name>` - 拥有沙箱的组织

#### 列出沙箱

```bash
deno deploy sandbox list --org my-org
```

列出组织中的所有沙箱及状态信息。

#### 终止沙箱

```bash
deno deploy sandbox kill <sandbox-id> --org my-org
```

即时终止指定沙箱，适用于不再需要时。

#### SSH 连接沙箱

```bash
deno deploy sandbox ssh <sandbox-id> --org my-org
```

启动 SSH 会话，用于交互式调试运行中的沙箱。

### 配置云连接

`deploy` 命令包含工具，帮助您配置集成程序，以供应用中使用的[云连接](/deploy/reference/cloud_connections/)。

#### AWS 集成配置

[配置 AWS 集成](/deploy/reference/cloud_connections/#aws%3A-easy-setup-with-deno-deploy-setup-aws)，供应用中作为云连接使用。

```bash
deno deploy setup-aws --org <name> --app <name>
```

**选项：**

- `-h, --help` - 显示帮助信息
- `--org <name>` - 组织名称（必填）
- `--app <name>` - 应用名称（必填）

示例：

```bash
deno deploy setup-aws --org my-org --app my-app
```

### Google Cloud Platform 集成配置

[配置 Google Cloud Platform 集成](/deploy/reference/cloud_connections/#setting-up-gcp)，供应用中作为云连接使用。

```bash
deno deploy setup-gcp --org <name> --app <name>
```

**选项：**

- `-h, --help` - 显示帮助信息
- `--org <name>` - 组织名称（必填）
- `--app <name>` - 应用名称（必填）

示例：

```bash
deno deploy setup-gcp --org my-org --app my-app
```

## 使用示例

### 基础部署

```bash
# 将当前目录部署到生产环境
deno deploy --prod

# 使用特定组织和应用部署
deno deploy --org my-company --app my-api --prod
```

### 创建应用

```bash
# 启动交互式创建向导
deno deploy create

# 使用框架预设创建
deno deploy create --org my-company --app my-site \
  --source local --framework-preset fresh \
  --build-timeout 5 --build-memory-limit 1024 --region us

# 从 GitHub 仓库创建静态站点
deno deploy create --org my-company --app my-docs \
  --source github --owner my-github-org --repo my-docs-repo \
  --runtime-mode static --static-dir dist --single-page-app \
  --build-command "npm run build" \
  --build-timeout 10 --build-memory-limit 2048 --region global
```

### 切换上下文

```bash
# 设置默认组织和应用，无需每次传递 --org/--app
deno deploy switch --org my-company --app my-api

# 后续命令自动使用保存的组织和应用
deno deploy env list
deno deploy logs
```

### 数据库管理

```bash
# 预置 Deno KV 数据库
deno deploy database provision my-kv --kind denokv --org my-company

# 关联外部 PostgreSQL 数据库
deno deploy database link my-pg "postgres://user:pass@host:5432/db" --org my-company

# 给应用分配数据库
deno deploy database assign my-kv --app my-api

# 查询数据库
deno deploy database query my-pg mydb "SELECT count(*) FROM users"
```

### 环境变量配置

```bash
# 设置环境变量
deno deploy env add DATABASE_URL "postgresql://..." --secret
deno deploy env add SITE_NAME "My App"

# 从 .env 文件加载
deno deploy env load .env.production
```

### 监控

```bash
# 查看最近日志
deno deploy logs --org my-company --app my-api

# 查看特定时间段日志
deno deploy logs --org my-company --app my-api \
  --start "2024-01-01T00:00:00Z" \
  --end "2024-01-01T23:59:59Z"
```

### 云集成

```bash
# 设置 AWS 集成
deno deploy setup-aws --org my-company --app my-api

# 设置 GCP 集成
deno deploy setup-gcp --org my-company --app my-api
```

## 获取帮助

- 使用 `deno deploy --help` 获取通用帮助
- 使用 `deno deploy <subcommand> --help` 获取具体子命令帮助
- 查阅 [Deno Deploy 文档](/deploy/) 了解平台相关信息
