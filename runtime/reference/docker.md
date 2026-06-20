---
last_modified: 2026-06-14
title: Deno 和 Docker
description: "在 Docker 容器中使用 Deno 的完整指南。了解官方 Deno 镜像、编写 Dockerfile、多阶段构建、工作区容器化，以及 Deno 应用的 Docker 最佳实践。"
---

Docker 是打包和分发 Deno 应用的一种常见方式：你只需构建一次可复现的镜像，然后在任何地方以相同方式运行它。Deno 提供官方基础镜像，因此 Dockerfile 通常很简短。本页涵盖编写该 Dockerfile、通过多阶段构建保持镜像精简，以及在生产环境中常用的 Compose、工作区、安全性和健康检查配置。

## 在 Docker 中使用 Deno

Deno 提供了[官方 Docker 文件](https://github.com/denoland/deno_docker)
和[镜像](https://hub.docker.com/r/denoland/deno)。

要使用官方镜像，请在项目目录中创建一个 `Dockerfile`：

```dockerfile
FROM denoland/deno:latest

WORKDIR /app

# 先复制清单文件，以便依赖安装层在仅源代码变更时仍可缓存
COPY deno.json deno.lock package.json* ./
RUN deno ci --prod --skip-types

# 然后复制其余源码
COPY . .

CMD ["deno", "run", "--allow-net", "main.ts"]
```

[`deno ci`](/runtime/reference/cli/ci/) 会从 `deno.lock` 执行可复现安装。`--prod` 会跳过 `devDependencies`，`--skip-types` 会移除 `@types/*` 包。这两者都能在不影响运行时行为的前提下减小最终镜像体积。

### 最佳实践

#### 使用多阶段构建

用于更小的生产镜像：

```dockerfile
# 构建阶段
FROM denoland/deno:latest AS builder
# 将 Deno 的缓存指向一个已知位置，以便在下一阶段复制
ENV DENO_DIR=/deno-dir
WORKDIR /app

# 先复制清单文件，以便依赖安装层在仅源代码变更时仍可缓存
COPY deno.json deno.lock package.json* ./
RUN deno ci --prod --skip-types

# 然后复制其余源码
COPY . .

# 生产阶段
FROM denoland/deno:latest
ENV DENO_DIR=/deno-dir
WORKDIR /app
COPY --from=builder /app .
# 复制已填充的 Deno 缓存，以便运行时阶段拥有这些依赖
COPY --from=builder /deno-dir /deno-dir
CMD ["deno", "run", "--allow-net", "main.ts"]
```

如果不复制 `$DENO_DIR`，`deno ci` 只会写入构建阶段内 Deno 的全局缓存。这些文件不会随着 `COPY --from=builder /app .` 一起传到后续阶段，因此容器会在首次运行时重新下载依赖。

#### 权限标志

明确指定所需权限：

```dockerfile
CMD ["deno", "run", "--allow-net=api.example.com", "--allow-read=/data", "main.ts"]
```

#### 开发容器

用于支持热重载的开发：

```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY . .

CMD ["deno", "run", "--watch", "--allow-net", "main.ts"]
```

### 常见问题与解决方案

1. **权限被拒绝（Permission Denied）错误**
   - 使用 `--allow-*` 标志
   - 考虑使用 `deno.json` 权限

2. **镜像体积过大**
   - 使用多阶段构建
   - 仅包含必要文件
   - 添加合适的 `.dockerignore`

3. **缓存失效（Cache Invalidation）**
   - 分离依赖缓存
   - 使用正确的镜像层顺序

### 示例 .dockerignore

```text
.git
.gitignore
Dockerfile
README.md
*.log
_build/
node_modules/
```

### 可用的 Docker 标签

Deno 提供了多个官方标签：

- `denoland/deno:latest` - 最新稳定版
- `denoland/deno:alpine` - 基于 Alpine 的更小镜像
- `denoland/deno:distroless` - 基于 Google distroless 的镜像
- `denoland/deno:ubuntu` - 基于 Ubuntu 的镜像
- `denoland/deno:2.x` - 锁定到特定发布线（使用你
  目标版本）

### 环境变量

Docker 中常见的 Deno 环境变量：

```dockerfile
ENV DENO_DIR=/deno-dir/
ENV DENO_INSTALL_ROOT=/usr/local
ENV PATH=${DENO_INSTALL_ROOT}/bin:${PATH}

# 可选环境变量
ENV DENO_NO_UPDATE_CHECK=1
ENV DENO_NO_PROMPT=1
```

### 在 Docker 中运行测试

```dockerfile
FROM denoland/deno:latest

WORKDIR /app
COPY . .

# 运行测试
CMD ["deno", "test", "--allow-none"]
```

### 使用 Docker Compose

用于带热重载的开发的基础 Compose 文件：

```yaml title="docker-compose.yml"
services:
  deno-app:
    build: .
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      - DENO_ENV=development
    command: ["deno", "run", "--watch", "--allow-net", "main.ts"]
```

对于带数据库的更真实场景：

```yaml title="docker-compose.yml"
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://deno:${POSTGRES_PASSWORD}@db:5432/app
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    command:
      [
        "deno",
        "run",
        "--allow-net=db:5432",
        "--allow-env=DATABASE_URL",
        "main.ts",
      ]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: deno
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U deno"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

volumes:
  pgdata:
```

将诸如 `POSTGRES_PASSWORD` 之类的密钥放在与
`docker-compose.yml` 相邻的 `.env` 文件中。Compose 会自动加载它。不要提交该文件。

使用 `docker compose up` 启动服务，或者使用
`docker compose up -d` 在后台运行。

### 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD deno eval "try { await fetch('http://localhost:8000/health'); } catch { Deno.exit(1); }"
```

### 常见开发工作流

本地开发：

1. 构建镜像：`docker build -t my-deno-app .`
2. 使用数据卷挂载运行：

```bash
docker run -it --rm \
  -v ${PWD}:/app \
  -p 8000:8000 \
  my-deno-app
```

### 安全注意事项

- 以非 root 用户运行：

```dockerfile
# 创建 deno 用户
RUN addgroup --system deno && \
    adduser --system --ingroup deno deno

# 切换到 deno 用户
USER deno

# 继续 Dockerfile 的其余部分
```

- 使用最小权限：

```dockerfile
CMD ["deno", "run", "--allow-net=api.example.com", "--allow-read=/app", "main.ts"]
```

- 考虑使用 `--deny-*` 标志以增强安全性

## 在 Docker 中使用工作区

当在 Docker 中处理 Deno 的工作区（monorepos，单仓多包）时，主要有两种方案：

### 1. 完整工作区容器化

当你需要所有依赖时，将整个工作区包含进去：

```dockerfile
FROM denoland/deno:latest

WORKDIR /app

# 复制整个工作区
COPY deno.json .
COPY project-a/ ./project-a/
COPY project-b/ ./project-b/

WORKDIR /app/project-a
CMD ["deno", "run", "-A", "mod.ts"]
```

### 2. 最小化工作区容器化

对于更小的镜像，只包含所需的工作区成员：

1. 创建构建上下文目录结构：

```sh
project-root/
├── docker/
│   └── project-a/
│       ├── Dockerfile
│       ├── .dockerignore
│       └── build-context.sh
├── deno.json
├── project-a/
└── project-b/
```

2. 创建一个 `.dockerignore`：

```text title="docker/project-a/.dockerignore"
*
!deno.json
!project-a/**
!project-b/**  # 仅在需要时
```

3. 创建构建上下文脚本：

```bash title="docker/project-a/build-context.sh"
#!/bin/bash

# 创建临时构建上下文
BUILD_DIR="./tmp-build-context"
mkdir -p $BUILD_DIR

# 复制工作区配置
cp ../../deno.json $BUILD_DIR/

# 复制主项目
cp -r ../../project-a $BUILD_DIR/

# 仅复制所需依赖
if grep -q "\"@scope/project-b\"" "../../project-a/mod.ts"; then
    cp -r ../../project-b $BUILD_DIR/
fi
```

4. 创建一个最小的 Dockerfile：

```dockerfile title="docker/project-a/Dockerfile"
FROM denoland/deno:latest

WORKDIR /app

# 复制必要文件
COPY deno.json .
COPY project-a/ ./project-a/
# 仅在需要时复制依赖
COPY project-b/ ./project-b/

WORKDIR /app/project-a

CMD ["deno", "run", "-A", "mod.ts"]
```

5. 构建容器：

```bash
cd docker/project-a
./build-context.sh
docker build -t project-a -f Dockerfile tmp-build-context
rm -rf tmp-build-context
```

### 最佳实践

- 始终包含根目录下的 `deno.json` 文件
- 保持与开发时相同的目录结构
- 清晰记录工作区依赖
- 使用构建脚本管理上下文
- 仅包含所需的工作区成员
- 当依赖发生变化时更新 `.dockerignore`
