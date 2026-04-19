---
last_modified: 2025-08-20
title: "How to Deploy Deno to AWS Lambda"
description: "Step-by-step tutorial on deploying Deno applications to AWS Lambda. Learn about Docker containerization, ECR repositories, function configuration, and how to set up serverless Deno apps on AWS."
url: /examples/aws_lambda_tutorial/
oldUrl:
  - /runtime/tutorials/aws_lambda/
---

AWS Lambda 是由亚马逊网络服务提供的一种无服务器计算服务。它允许您在无需配置或管理服务器的情况下运行代码。

以下是将 Deno 应用程序部署到 AWS Lambda 的逐步指南，使用 Docker。

这需要的前提条件是：

- [`docker` CLI](https://docs.docker.com/reference/cli/docker/)
- 一个 [AWS 账户](https://aws.amazon.com)
- [`aws` CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## 第一步：创建一个 Deno 应用

使用以下代码创建一个新的 Deno 应用：

```ts title="main.ts"
Deno.serve((req) => new Response("Hello World!"));
```

将此代码保存在名为 `main.ts` 的文件中。

## 第二步：创建一个 Dockerfile

创建一个名为 `Dockerfile` 的新文件，内容如下：

```Dockerfile
# 设置基础镜像
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 AS aws-lambda-adapter
FROM denoland/deno:bin-1.45.2 AS deno_bin
FROM debian:bookworm-20230703-slim AS deno_runtime
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=deno_bin /deno /usr/local/bin/deno
ENV PORT=8000
EXPOSE 8000
RUN mkdir /var/deno_dir
ENV DENO_DIR=/var/deno_dir

# 复制功能代码
WORKDIR "/var/task"
COPY . /var/task

# 预热缓存
RUN timeout 10s deno run -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["deno", "run", "-A", "main.ts"]
```

此 Dockerfile 使用
[`aws-lambda-adapter`](https://github.com/awslabs/aws-lambda-web-adapter)
项目将常规 HTTP 服务器（如 Deno 的 `Deno.serve`）适配到 AWS
Lambda 运行时 API。

我们还使用 `denoland/deno:bin-1.45.2` 镜像获取 Deno 二进制文件，使用 `debian:bookworm-20230703-slim` 作为基础镜像。`debian:bookworm-20230703-slim` 镜像用于保持镜像大小较小。

将 `PORT` 环境变量设置为 `8000`，以通知 AWS Lambda 适配器我们正在监听端口 `8000`。

将 `DENO_DIR` 环境变量设置为 `/var/deno_dir`，以在 `/var/deno_dir` 目录中存储缓存的 Deno 源代码和转译模块。

预热缓存步骤用于在调用函数之前预热 Deno 缓存。这样做是为了减少函数的冷启动时间。这些缓存包含您函数代码的编译代码和依赖项。此步骤启动您的服务器 10 秒钟，然后退出。

在使用 package.json 时，请记得在预热缓存或运行函数之前运行 `deno install` 以从 `package.json` 文件中安装 `node_modules`。

## 第三步：构建 Docker 镜像

使用以下命令构建 Docker 镜像：

```bash
docker build -t hello-world .
```

## 第四步：创建 ECR Docker 存储库并推送镜像

使用 AWS CLI，创建一个 ECR 存储库并将 Docker 镜像推送到其中：

```bash
aws ecr create-repository --repository-name hello-world --region us-east-1 | grep repositoryUri
```

这应该会输出一个类似 `<account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world` 的存储库 URI。

使用上一步的存储库 URI 对 Docker 进行 ECR 身份验证：

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account_id>.dkr.ecr.us-east-1.amazonaws.com
```

使用存储库 URI 对 Docker 镜像进行标记，再次使用上一步的存储库 URI：

```bash
docker tag hello-world:latest <account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```

最后，使用上一步的存储库 URI 将 Docker 镜像推送到 ECR 存储库：

```bash
docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/hello-world:latest
```

## 第五步：创建 AWS Lambda 函数

现在您可以通过 AWS 管理控制台创建一个新的 AWS Lambda 函数。

1. 转到 AWS 管理控制台并 
   [导航到 Lambda 服务](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1)。
2. 点击 "创建函数" 按钮。
3. 选择 "容器镜像"。
4. 输入函数的名称，例如 "hello-world"。
5. 点击 "浏览镜像" 按钮并选择您推送到 ECR 的镜像。
6. 点击 "创建函数" 按钮。
7. 等待函数创建完成。
8. 在 "配置" 选项卡中，转到 "函数 URL" 部分并点击 
   "创建函数 URL"。
9. 选择 "无" 作为身份验证类型（这将使 Lambda 函数公开可访问）。
10. 点击 "保存" 按钮。

## 第六步：测试 Lambda 函数

您现在可以访问 Lambda 函数的 URL，以查看来自 Deno 应用的响应。

🦕 您已成功使用 Docker 将 Deno 应用程序部署到 AWS Lambda。现在您可以使用此设置将更复杂的 Deno 应用程序部署到 AWS Lambda。