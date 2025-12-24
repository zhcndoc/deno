---
title: "管理 Deploy 应用"
description: "使用 @deno/sandbox 客户端以编程方式创建、列出、更新和删除 Deploy 应用。"
---

除了配置微型虚拟机（microVMs）之外，`@deno/sandbox` SDK 还暴露了一个 `Client` 类，用于管理组织内部的 Deploy 应用。当你需要实现团队入驻自动化、克隆环境或清理未使用的应用，而不必访问仪表盘时，这非常有用。

## 快速开始

```tsx
import { Client } from "@deno/sandbox";

const client = new Client();
```

该客户端使用与 `Sandbox.create()` 相同的 `DENO_DEPLOY_TOKEN` 环境变量。请提供针对你想管理的组织作用域的令牌。

## 创建应用

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

随着 API 的完善，可以提供更多字段（如 `name`、`description`）。

## 列出应用

```tsx
const list = await client.apps.list();
console.log(list.items); // 第一页（最新的30个应用）

for await (const app of list) {
  console.log(app.slug); // 分页迭代器
}
```

使用异步迭代器遍历组织中的所有应用，无需自行管理游标。

## 获取应用

```tsx
const appBySlug = await client.apps.get("my-app-from-sdk");
const appById = await client.apps.get("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

获取操作支持使用 slug 或 UUID，方便根据手头的标识符使用。

## 更新应用元数据

```tsx
const updated = await client.apps.update(
  "bec265c1-ed8e-4a7e-ad24-e2465b93be88",
  { slug: "my-cool-app" },
);
console.log(updated.slug); // "my-cool-app"
```

当团队重命名服务或你想在组织内强制执行一致的 slug 规范时，这非常方便。

## 删除应用

```tsx
await client.apps.delete("legacy-chaotic-app");
await client.apps.delete("bec265c1-ed8e-4a7e-ad24-e2465b93be88");
```

删除时同样支持这两种标识符。移除后，相关的构建和路由会自动清理。

## 从 sandbox 发布到 Deploy 应用

`sandbox.deploy()` 方法可用于将资源从 sandbox 发布到现有的 Deno Deploy 应用。这允许你将 sandbox 用作托管在 Deno Deploy 上应用的部署管道。

```tsx
await using sandbox = await Sandbox.create();

// ... 构建你的应用 ...

const app = await sandbox.deploy({
  name: "my-app",
  options: {
    path: "build-output", // 可选：包含要部署应用的目录路径
    production: true, // 可选：部署到生产环境
    build: {
      entrypoint: "server.ts", // 可选：部署的入口文件
    },
  },
});

console.log(`${app.slug} 已部署。`);
```

## 提示

- 为管理脚本维护一个最低权限的专用自动化令牌。
- 将这些 API 与 `sandbox.deploy()` 配合使用，可从 sandbox 试验中初始化应用，然后持续管理它们。
- 记录每次变更（slug 重命名、删除），以便在仪表盘外有审计轨迹。