---
title: "Deno Deploy 应用的程序化管理"
description: "使用 @deno/sandbox 客户端程序化地创建、列出、更新和删除 Deno Deploy 应用。"
---

除了提供 microVM，SDK 还提供了用于在组织内部创建和管理 Deploy 应用的 API。自动化这些工作流程在以下情况下非常有用：

- 启动隔离的应用用于预览或质量保证
- 保持多个环境同步
- 将 Deploy 资源配置直接集成进 CI/CD
- 按计划清理过时或未使用的应用

SDK 封装了 [Deno Deploy REST API](https://console.deno.com/api/v2/docs)。

## 快速开始

### 认证

你需要一个具有相应权限的 Deno Deploy API 令牌来管理应用。你可以在 Deno Deploy 控制台的 **沙箱 (Sandboxes)** > **集成到你的应用中 (Integrate into your app)** 下找到你的令牌。

如果还没有令牌，可以点击 **+ 创建令牌 (+ Create Token)** 按钮生成一个新令牌。

在实例化客户端或创建沙箱管理应用时，应传入作用域限定为你的组织的 `DENO_DEPLOY_TOKEN` 环境变量。`Client` 类为该令牌作用域内的组织中的每个应用暴露了创建、列出、获取、更新和删除方法。

### 初始化客户端

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
from deno_sandbox import DenoDeploy

sdk = DenoDeploy()
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
from deno_sandbox import AsyncDenoDeploy

sdk = AsyncDenoDeploy()
```

</deno-tab>
</deno-tabs>

SDK 使用相同的 `DENO_DEPLOY_TOKEN` 环境变量进行认证。请提供作用域限定为你希望管理的组织的令牌。

## 创建应用

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const app = await client.apps.create({
  slug: "my-app-from-sdk",
});

console.log(app);
// {
//   id: "4416a358-4a5f-45b2-99b5-3ebcb4b63b5f",
//   slug: "my-app-from-sdk",
//   updated_at: "2025-11-25T05:29:08.777Z",
//   created_at: "2025-11-25T05:29:08.777Z"
// }
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
app = sdk.apps.create(slug="my-app-from-sdk")

print(app)
# {
#   "id": "4416a358-4a5f-45b2-99b5-3ebcb4b63b5f",
#   "slug": "my-app-from-sdk",
#   "updated_at": "2025-11-25T05:29:08.777Z",
#   "created_at": "2025-11-25T05:29:08.777Z"
# }
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
app = await sdk.apps.create(slug="my-app-from-sdk")

print(app)
# {
#   "id": "4416a358-4a5f-45b2-99b5-3ebcb4b63b5f",
#   "slug": "my-app-from-sdk",
#   "updated_at": "2025-11-25T05:29:08.777Z",
#   "created_at": "2025-11-25T05:29:08.777Z"
# }
```

</deno-tab>
</deno-tabs>

`slug` 为必填项，且必须在组织内唯一。随着 API 的演进，你还可以提供诸如 `name` 和 `description` 等可选元数据。

## 列出应用

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const list = await client.apps.list();
console.log(list.items); // 第一页（最近的 30 个应用）

for await (const app of list) {
  console.log(app.slug); // 分页迭代器
}
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
page = sdk.apps.list()
print(page.items)  # 第一页（最近的 30 个应用）

for item in page.items:
  print(item["slug"])
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
page = await sdk.apps.list()
print(page.items)  # 第一页（最近的 30 个应用）

async for item in page:
  print(item["slug"])  # 分页迭代器
```

</deno-tab>
</deno-tabs>

通过迭代可以遍历组织中的所有应用，无需自行管理游标。

## 获取应用详情

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const appBySlug = await client.apps.get("my-app-from-sdk");
const appById = await client.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
app_by_slug = sdk.apps.get("my-app-from-sdk")
app_by_id = sdk.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
app_by_slug = await sdk.apps.get("my-app-from-sdk")
app_by_id = await sdk.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
</deno-tabs>

获取应用支持通过 slug 或 UUID，方便使用你手头上已有的任意标识符。

## 更新应用元数据

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
const updated = await client.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  { slug: "my-cool-app" },
);
console.log(updated.slug); // "my-cool-app"
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
updated = sdk.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  slug="my-cool-app"
)
print(updated["slug"])  # "my-cool-app"
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
updated = await sdk.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  slug="my-cool-app"
)
print(updated["slug"])  # "my-cool-app"
```

</deno-tab>
</deno-tabs>

当团队重命名服务或你想在组织内统一 slug 规则时，这个功能很实用。

## 删除应用

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await client.apps.delete("legacy-chaotic-app");
await client.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk.apps.delete("legacy-chaotic-app")
sdk.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
await sdk.apps.delete("legacy-chaotic-app")
await sdk.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88")
```

</deno-tab>
</deno-tabs>

删除时可使用任意一种标识符。移除后，相关的构建和路由会被自动清理。

## 从沙箱发布到 Deploy 应用

`sandbox.deno.deploy()` 方法可用于将资源从沙箱发布到已有的 Deno Deploy 应用。这允许你将沙箱用作托管在 Deno Deploy 上的应用的部署流水线。

<deno-tabs group-id="sandbox-sdk">
<deno-tab value="js" label="JavaScript" default>

```tsx
await using sandbox = await Sandbox.create();

// ... 构建你的应用 ...

const app = await sandbox.deno.deploy("my-app", {
  options: {
    path: "build-output", // 可选：包含要部署的应用的目录路径
    production: true, // 可选：部署到生产环境
    build: {
      entrypoint: "server.ts", // 可选：部署入口文件
    },
  },
});

console.log(`已部署到 ${app.slug}`);
```

</deno-tab>
<deno-tab value="python" label="Python">

```py
sdk = DenoDeploy()

with sdk.sandbox.create() as sandbox:
  # ... 构建你的应用 ...

  build = sandbox.deno.deploy(
    "my-app",
    path="build-output",  # 可选：包含要部署的应用的目录路径
    production=True,  # 可选：部署到生产环境
    entrypoint="server.ts",  # 可选：部署入口文件
  )

  print(f"已部署的修订版 ID: {build.id}")
```

</deno-tab>
<deno-tab value="python-async" label="Python (异步)">

```py
sdk = AsyncDenoDeploy()

async with sdk.sandbox.create() as sandbox:
  # ... 构建你的应用 ...

  build = await sandbox.deno.deploy(
    "my-app",
    path="build-output",  # 可选：包含要部署的应用的目录路径
    production=True,  # 可选：部署到生产环境
    entrypoint="server.ts",  # 可选：部署入口文件
  )

  print(f"已部署的修订版 ID: {build.id}")
```

</deno-tab>
</deno-tabs>