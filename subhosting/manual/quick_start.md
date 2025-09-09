---
title: 子托管快速入门
oldUrl:
  - /deploy/manual/subhosting/projects_and_deployments/
---

想要寻找一个尽可能小的示例，展示如何将代码部署到 Deno 的隔离云吗？我们在下面为您提供了相关信息，或者您可以跳到[更详细的入门指南](#getting-started-with-subhosting)。

```ts
// 1.) 准备 API 访问信息
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";
const headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
};

// 2.) 创建一个新项目
const pr = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: null, // 随机生成项目名称
  }),
});

const project = await pr.json();

// 3.) 将 "hello world" 服务器部署到新项目
const dr = await fetch(`${API}/projects/${project.id}/deployments`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    entryPointUrl: "main.ts",
    assets: {
      "main.ts": {
        "kind": "file",
        "content":
          `export default { async fetch(req) { return new Response("Hello, World!"); } }`,
        "encoding": "utf-8",
      },
    },
    envVars: {},
  }),
});

const deployment = await dr.json();

console.log(dr.status);
console.log(
  "访问您的网站：",
  `https://${project.name}-${deployment.id}.deno.dev`,
);
```

## 子托管入门

要开始使用子托管，您需要在[Deno Deploy 控制台](https://dash.deno.com/orgs/new)中创建一个组织。请按照屏幕上的说明为子托管创建一个新组织。

在完成入职流程时，您可能还会生成一个**访问令牌**，您将用它来访问[REST API](../api/index.md)。如果您没有这样做（或您的令牌已过期），您可以[在这里生成一个新令牌](https://dash.deno.com/account#access-tokens)。

:::caution 将您的令牌保存在安全的地方

一旦您生成了访问令牌，**它将不会再在 Deploy 控制台 UI 中显示**。请确保将此令牌存储在安全的地方。

:::

## 设置测试环境

在接下来的教程页面中，我们将假设您通过 Deno 脚本（TypeScript 代码）与 Deploy REST API 进行交互，并将以这种方式展示与 API 交互的示例。然而，这里展示的技术在任何能够执行 HTTP 请求的环境中同样适用。

这里以及后续章节中的示例代码假设您已经安装了[Deno 1.38 或更高版本](/runtime/getting_started/installation)。

在与 REST API 配合使用时，最好将身份验证凭据存储在[系统环境](/runtime/reference/env_variables)中，以防止您意外地将其提交到源代码管理中。

在本教程中，我们将使用在 Deno 1.38 中引入的新 `--env` 标志来管理环境变量。请在本地计算机上创建一个新目录以存储我们的管理脚本，并创建三个文件：

- `.env` - 存放我们的 API 访问信息
- `.gitignore` - 忽略我们的 `.env` 文件，以免我们意外地将其放入源代码管理中
- `create_project.ts` - 我们稍后将用于第一次请求 REST API 的文件

### 配置 `.env` 文件和 `.gitignore` 文件

首先，将您的[访问令牌](https://dash.deno.com/account#access-tokens)和组织 ID 存储在您之前创建的 `.env` 文件中。

```bash title=".env"
DEPLOY_ACCESS_TOKEN=your_token_here
DEPLOY_ORG_ID=your_org_id_here
```

用您自己 Deploy 账户中的值替换文件中的值。

接下来，创建一个 `.gitignore` 文件，以确保我们不会意外地将 `.env` 文件提交到源代码管理中：

```bash title=".gitignore"
# 在 git 中忽略此文件
.env

# 可选：忽略在 mac OS 上常常生成的这个垃圾文件
.DS_Store
```

现在我们已经设置好凭据，接下来我们来写一些代码以访问 REST API。

## 创建我们的第一个项目

为了在子托管或 REST API 上进行任何有趣的操作，我们需要[创建一个项目](https://apidocs.deno.com/#get-/projects/-projectId-/deployments)。将以下代码复制到与 `.env` 和 `.gitignore` 文件在同一目录中的 `create_project.ts` 文件中。

```ts title="create_project.ts"
const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const orgId = Deno.env.get("DEPLOY_ORG_ID");
const API = "https://api.deno.com/v1";

// 创建一个新项目
const res = await fetch(`${API}/organizations/${orgId}/projects`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: null, // 随机生成项目名称
  }),
});

const project = await res.json();
console.log(project);
```

在终端中使用以下命令执行此代码：

```bash
deno run -A --env create_project.ts
```

如果一切顺利，您应该会看到类似于以下内容的输出：

```console
{
  id: "f084712a-b23b-4aba-accc-3c2de0bfa26a",
  name: "strong-fox-44",
  createdAt: "2023-11-07T01:01:14.078730Z",
  updatedAt: "2023-11-07T01:01:14.078730Z"
}
```

请注意返回的项目 `id` - 这是我们在下一步将使用的项目 ID。

现在我们已经配置好 REST API 访问并设置好了项目，我们可以继续[创建我们的第一个部署](./planning_your_implementation)。