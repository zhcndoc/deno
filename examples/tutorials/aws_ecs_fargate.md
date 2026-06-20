---
last_modified: 2026-06-18
title: "将 Deno 部署到 AWS ECS Fargate"
description: "将 Deno 应用部署到 AWS ECS Fargate 的分步教程。学习如何将 Deno 应用容器化、将镜像推送到 Amazon ECR，并在负载均衡器后面作为无服务器 Fargate 服务运行它。"
url: /examples/aws_ecs_fargate_tutorial/
---

[AWS Fargate](https://aws.amazon.com/fargate/) 是一种无服务器容器计算引擎，
可与 Amazon Elastic Container Service (ECS) 配合使用。你将应用打包为容器镜像，
把任务定义交给 ECS，而 Fargate 会为你提供并扩展底层计算资源，因此无需管理
EC2 实例。

本教程将介绍如何将一个 Deno 应用容器化、将镜像推送到
[Amazon ECR](https://aws.amazon.com/ecr/)，并将其作为 Fargate 服务运行。

继续之前，请确保你已具备：

- [`docker` CLI](https://docs.docker.com/engine/reference/commandline/cli/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)，
  并已使用可管理 ECR 和 ECS 的账户完成身份验证
- 一个 [AWS 账户](https://aws.amazon.com/)

## 创建应用和 Dockerfile

为了专注于部署，我们的应用是一个单独的 `main.ts`，用于提供一个
HTTP 响应：

```ts title="main.ts"
Deno.serve({ port: 8000 }, () => new Response("Hello from Deno on Fargate!"));
```

在旁边添加一个 `Dockerfile`：

```Dockerfile title="Dockerfile"
FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno install --entrypoint main.ts

CMD ["run", "--allow-net", "main.ts"]
```

在部署之前先在本地测试它：

```shell
docker build -t deno-fargate .
docker run -p 8000:8000 deno-fargate
```

访问 `localhost:8000`，你应该能看到响应。Fargate 要求使用
`linux/amd64` 镜像，除非你创建 ARM 任务，因此如果你使用的是 Apple
Silicon 机器，在推送时请为该平台构建：

```shell
docker build --platform linux/amd64 -t deno-fargate .
```

## 将镜像推送到 Amazon ECR

为方便起见，设置几个 shell 变量，并将其值替换为你的
账户 ID 和首选区域：

```shell
export AWS_ACCOUNT_ID=123456789012
export AWS_REGION=us-east-1
export REPO=deno-fargate
```

创建一个 ECR 仓库来存放镜像：

```shell
aws ecr create-repository --repository-name $REPO --region $AWS_REGION
```

使用 ECR 对 Docker 进行身份验证，然后标记并推送镜像：

```shell
aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin \
    $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

docker tag deno-fargate \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO:latest
```

## 创建任务定义

[任务定义](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
告诉 ECS 如何运行你的容器：使用哪个镜像、需要多少 CPU 和内存，以及
要暴露哪些端口。将以下内容保存为 `task-definition.json`，
并替换为你的账户 ID 和区域：

```json title="task-definition.json"
{
  "family": "deno-fargate",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "deno-fargate",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/deno-fargate:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ]
    }
  ]
}
```

`executionRoleArn` 指向 `ecsTaskExecutionRole`，它允许 ECS 从 ECR 拉取
镜像并将日志写入 CloudWatch。如果你之前没有使用过 ECS，请按照
[AWS 指南](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html)
创建一次。

注册任务定义：

```shell
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region $AWS_REGION
```

## 将其作为 Fargate 服务运行

创建一个用于承载该服务的集群：

```shell
aws ecs create-cluster --cluster-name deno-cluster --region $AWS_REGION
```

现在创建一个保持一个任务副本运行的服务。Fargate 需要知道要启动到哪些子网和安全组中，
而 `assignPublicIp` 允许任务拉取镜像并在没有 NAT 网关的情况下可被访问。将子网和安全组
ID 替换为你 VPC 中的对应值，并确保安全组允许端口 `8000` 的入站流量：

```shell
aws ecs create-service \
  --cluster deno-cluster \
  --service-name deno-fargate \
  --task-definition deno-fargate \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-abc123],securityGroups=[sg-abc123],assignPublicIp=ENABLED}" \
  --region $AWS_REGION
```

一旦服务达到稳定状态，找到任务的公网 IP：

```shell
TASK_ARN=$(aws ecs list-tasks --cluster deno-cluster \
  --service-name deno-fargate --query "taskArns[0]" --output text --region $AWS_REGION)

ENI_ID=$(aws ecs describe-tasks --cluster deno-cluster --tasks $TASK_ARN \
  --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" \
  --output text --region $AWS_REGION)

aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID \
  --query "NetworkInterfaces[0].Association.PublicIp" --output text --region $AWS_REGION
```

打开 `http://<public-ip>:8000`，你应该能看到你的 Deno 应用从
Fargate 返回响应。

## 生产环境注意事项

对于除演示之外的任何场景，都应将服务置于
[Application Load Balancer](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html)
之后，而不是直接暴露任务的公网 IP。负载均衡器会提供稳定的 DNS 名称、TLS 终止和健康检查，
并允许 ECS 在不停机的情况下滚动发布新部署。你还可以提高 `desired-count`
来运行多个任务，并启用
[服务自动扩缩容](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)
以根据负载调整容量。

🦕 现在你可以通过将 Deno 应用容器化、将镜像推送到 Amazon ECR，并将其作为 Fargate 服务运行，来将其部署到 AWS ECS Fargate。
