---
title: "将 Deno 部署到 AWS Lambda"
description: "了解如何使用 Dockerfile 和 aws-lambda-adapter 社区运行时将 Deno 应用程序部署到 AWS Lambda。"
url: /examples/deploy_deno_to_aws_lambda/
videoUrl: https://www.youtube.com/watch?v=_xLOrT3cWK4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=17
layout: video.tsx
---

## 视频说明

展示如何将 Deno 应用程序部署到 AWS Lambda（使用适用于 Lambda 的社区运行时）。

## 文字记录和代码

### 在 AWS Lambda 上运行 Deno

在 AWS Lambda 上运行 Deno？当然可以。使用 AWS Lambda，无服务器定价可能比 VPS 更便宜，而且由于它可以在后台自动扩缩容，因此也更易于维护。

<!-- 我们这里有我们的 tree 应用，并且我们想把它托管到 AWS 上。  -->

为了实现这一点，我们将使用 aws-lambda-adapter 项目，以确保我们的 `Deno.serve` 函数按预期运行。这是将应用部署到 AWS Lambda 的一种流行方法，因为它兼顾了控制力、灵活性和一致性。

如果你想了解更多这些考量因素，博客上有一篇很不错的相关文章。

让我们来看一下可以用来实现这一点的 Dockerfile：

```dockerfile
# 设置基础镜像
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 AS aws-lambda-adapter
FROM denoland/deno:bin-2.0.2 AS deno_bin
FROM debian:bookworm-20230703-slim AS deno_runtime
COPY --from=aws-lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=deno_bin /deno /usr/local/bin/deno
ENV PORT=8000
EXPOSE 8000
RUN mkdir /var/deno_dir
ENV DENO_DIR=/var/deno_dir

# 复制函数代码
WORKDIR "/var/task"
COPY . /var/task

# 预热缓存
RUN timeout 10s deno -A main.ts || [ $? -eq 124 ] || exit 1

CMD ["deno", "-A", "main.ts"]
```

然后我们将构建 Docker 镜像。

```shell
docker build -t my-deno-project .
```

现在我们需要开始与 AWS 交互。如果这是你第一次使用 AWS，你可以创建一个账户：
[https://aws.amazon.com](https://aws.amazon.com)

如果你还没有安装 AWS CLI，也可以安装。你可以在终端或命令提示符中输入 `aws` 来确认是否已安装。如果返回错误，你可以使用 homebrew 安装，或者按照网站上的说明操作：
[https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```
brew install awscli
```

然后你需要确保已经通过 `aws configure` 完成配置。
它所需要的所有内容都在
[AWS 控制台的安全凭证部分](https://us-east-1.console.aws.amazon.com/ecr/private-registry/repositories)。

### 使用 CLI 创建 ECR

ECR 是一个注册表服务，我们可以把 Docker 容器推送到那里

```
aws ecr create-repository --repository-name my-deno-project --region us-east-1 | grep repositoryUri
```

这会输出该仓库的 URI：\`"repositoryUri":
"\<\<myuserid\>\>[.dkr.ecr.us-west-1.amazonaws.com/my-deno-project](http://.dkr.ecr.us-west-1.amazonaws.com/my-deno-project)",\`

然后使用返回的 URI 登录

```shell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <username>.dkr.ecr.us-east-1.amazonaws.com/my-deno-project
```

为镜像打标签

```shell
docker tag my-deno-project:latest <myProject>.dkr.ecr.us-east-1.amazonaws.com/my-deno-project:latest
```

然后将镜像推送到 ECR

```shell
docker push <myproject>.dkr.ecr.us-west-1.amazonaws.com/my-deno-project:latest
```

现在我们需要创建一个用于托管应用的函数：

- [https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1\#/begin](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/begin)
- 可以把函数理解为应用运行的地方
- 选择创建函数
- 选择容器镜像单选按钮
- 将函数命名为 `tree-app`
- 点击 Browse Containers 按钮选择应用
- 在页面中部选择“Configuration”
- 选择 `Function URL`
- 创建一个 URL
- 选择 None，使端点公开
- 选择保存
- 在浏览器中检查应用

关于 Lambda 函数，有一点需要记住，那就是冷启动性能。冷启动发生在 AWS 需要初始化你的函数时，它可能会导致轻微延迟。这里有一篇很不错的
[博客文章，比较了 Deno 与其他工具](https://deno.com/blog/aws-lambda-coldstart-benchmarks)。

将 Deno 与 AWS Lambda 函数结合使用，是在熟悉的环境中快速启动你的应用的绝佳方式。
