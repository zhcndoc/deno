---
title: "标题：将数据库连接到本地开发环境"
description: "使用 Deno Deploy 和 Deno 的隧道功能，将 Postgres 数据库连接到本地开发服务器"
url: /examples/tunnel_database_tutorial/
---

在本教程中，我们将展示如何使用 Deno 的隧道功能和 Deno Deploy，将数据库连接到本地开发服务器。这样，您可以在本地环境中轻松操作数据库，而无需复杂的配置。

## 设置应用程序

如果您还没有本地服务器应用，可以使用 Svelte 创建一个简单的应用。在本教程中，我们将用 Svelte 创建一个基础的笔记应用：

```sh
npx sv create svelte-app
```

选择默认选项完成提示，然后进入新项目目录：

```sh
cd svelte-app
deno run dev
```

## 安装 Postgres 驱动及类型定义

要连接到 Postgres 数据库，我们将使用流行的 [pg](https://www.npmjs.com/package/pg) 客户端。使用 npm 规范安装 `pg` 包及其类型定义：

```sh
deno add npm:pg npm:@types/pg
```

这会将必要的依赖添加到您的 `deno.json` 文件中。

## 创建数据库迁移脚本

接下来，在项目目录中新建一个名为 `migrate.ts` 的文件。该脚本将连接到 Postgres 数据库并创建示例表。

```ts title="migrate.ts"
import { Client } from "pg";
const client = new Client();
await client.connect();
await client.query(
  `CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, note TEXT)`,
);
await client.query(
  `INSERT INTO notes (note) VALUES ('hello, this is seed data')`,
);
await client.end();
```

### 配置 Vite 以允许隧道连接

Svelte 使用的 Vite 服务器默认仅允许 localhost 访问，为了让其更广泛地可用，我们需要对 `vite.config.js` 文件做些小修改。打开 `vite.config.js`，添加一个 `server` 配置项，设置 `allowedHosts: true`：

```js title="vite.config.js"
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    allowedHosts: true,
  },
});
```

## 将应用部署到 Deno Deploy

接着，我们使用 `deno deploy` 子命令将 Svelte 应用部署到 Deno Deploy。这将帮我们设置一个项目，供后续连接数据库。

在终端运行：

```sh
deno deploy
```

按照终端提示，创建新的 Deno Deploy 应用，您可能需要登录 Deno Deploy 控制台，若属于多个组织，请选择一个并为该项目创建应用。

## 在 Deno Deploy 上配置数据库

现在是为应用配置数据库的时候了。登录您的 [Deno Deploy 控制台](https://console.deno.com/)，点击 **Databases**（数据库）标签页。然后：

1. 点击 **+ Provision database**（添加数据库）按钮。
2. 选择 Prisma Postgres 数据库，点击 **Provision**。
3. 输入数据库名称缩写（例如 `my-test-db`）。
4. 选择最接近您用户的地区。
5. 点击 **Provision database**。

数据库配置完成后，在数据库标签页点击所创建的数据库，您可以将其分配给刚部署的应用。点击 _Assign_ 按钮，从下拉菜单中选择您的应用。

点击数据库名称，您可以看到配置页面，列出已分配应用及三个数据库“上下文”，分别对应不同环境（本地、预览、生产）。这些上下文使您可以在不影响生产数据的情况下测试数据库连接。

## 运行迁移脚本

数据库配置完成后，运行迁移脚本以创建示例表。可以直接使用 `--tunnel` 标志：

```sh
deno run --tunnel -A migrate.ts
```

这会自动获取数据库连接信息，并针对本地数据库上下文执行迁移脚本。

您可以通过 Deno Deploy 控制台内置的数据库浏览器确认表和种子数据是否创建。进入您的数据库页面，点击本地数据库上下文中的 **Explore** 按钮，应看到一张包含一条数据的表。

## 在应用中显示数据库数据

接下来，更新 Svelte 应用以展示数据库数据。打开 `src/routes/+page.svelte` 文件，更新代码以从数据库获取笔记。

```svelte title="src/routes/+page.svelte"
import { Client } from "pg";

export const load = async () => {
  const client = new Client();
  await client.connect();
  const res = await client.query(` SELECT note from notes; `);
  await client.end();
  return { notes: res.rows };
};
```

然后更新 HTML 部分以显示笔记：

```svelte title="src/routes/+page.svelte"
<script>
  let { data } = $props();
</script>
<h1>Welcome to SvelteKit</h1>
<ul>
  {#each data.notes as row}
    <li>{row.note}</li>
  {/each}
</ul>
```

## 使用隧道运行您的应用

现在，您可以使用 `--tunnel` 标志本地运行 Svelte 应用并查看本地数据库上下文中的数据：

```sh
deno run --tunnel dev
```

您应该能看到一个简单网页，显示种子数据。

## 使用预部署命令运行数据库迁移

每次部署到 Deno Deploy 时，不希望手动运行迁移脚本，而是希望自动在每次部署前运行数据库迁移。

在 Deno Deploy 控制台编辑应用配置，添加一个预部署命令，在每次部署前自动运行迁移脚本。

步骤：

1. 进入 Deno Deploy 项目仪表盘。
2. 点击 **Settings**（设置）标签页。
3. 滚动到 **App Configuration**（应用配置）区域，点击 **Edit**（编辑）按钮。
4. 在 **Pre-deploy Command** 字段中输入以下命令：

```sh
deno run -A migrate.ts
```

现在每次部署应用前，迁移脚本会先行运行，确保数据库模式保持最新。

您可以通过以下命令测试：

```sh
deno deploy --prod
```

直接部署到生产环境。部署完成后，您可以在 Deno Deploy 控制台中浏览生产数据库上下文，确认表已被创建且种子数据已插入。

## 更新数据库中的数据

您现在可以通过 Deno Deploy 控制台内置的数据库浏览器更新数据库中的数据（或通过更新迁移脚本并运行它）。在数据库浏览器中点击 `notes` 表，编辑文本并保存。刷新包含 Svelte 应用的标签页，即可查看更新后的数据。

可以尝试分别在本地、预览和生产数据库上下文中更新数据，观察它们如何彼此独立。

🦕 现在，您已经可以通过隧道功能将数据库连接到本地开发环境，实现使用真实数据开发和测试应用，而无须复杂配置！