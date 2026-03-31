---
title: "使用 sv 和 Deno 构建 SvelteKit 应用"
url: /examples/sveltekit_tutorial/
---

自上线以来，SvelteKit 一直深受欢迎，而随着 Svelte 版本 5 最近发布，截至撰写本文时，没有比现在更合适的时机来展示如何用 Deno 运行它！

通过本教程，我们将演示如何使用 sv CLI 工具轻松搭建一个 SvelteKit 项目，并讲解数据加载的模式。

你可以在[GitHub](https://github.com/s-petey/deno-sveltekit)上查看完成的应用。

## 入门

我们可以通过 `npx sv create` 快速生成一个项目。这是[SvelteKit 的 CLI](https://github.com/sveltejs/cli)，功能强大且实用。

如果你已经观看了上面的视频，那就太好了！如果没有，下面是选择设置：

- 模板
  - SvelteKit minimal
- 类型检查
  - Typescript
- 项目附加
  - tailwindcss
- Tailwind 插件
  - typography
  - forms
- 包管理器
  - Deno

接下来，我们需要保持后台运行 `deno task dev`，这样可以在本地实时查看改动和应用运行状态。

### Deno 配置

`sv` 命令会生成一个 `package.json` 文件，我们需要将其转换为 `deno.json`。具体来说，将`scripts`改为`tasks`，并且把基于 `vite` 的命令加上 `npm:` 前缀。

示例：

```json
"dev": "vite dev",
```

转换为：

```json
"dev": "deno run -A npm:vite dev",
```

此时我们还希望集成 Deno 的格式化和代码检查工具，因此也加上这些任务。

```json
{
  "tasks": {
    "dev": "deno run -A npm:vite dev",
    "format": "deno fmt",
    "lint": "deno lint",
    "lint:fix": "deno lint --fix"
  }
}
```

配置好这些任务后，我们还需要针对 `format` 和 `lint` 命令设置规则。这里使用了 `unstable` 标记启用 `fmt-component`，它支持[svelte 组件文件](https://docs.deno.com/runtime/reference/cli/fmt/#supported-file-types)格式化。同时根据推荐设置增加了部分 lint 规则。

```json
{
  "fmt": {},
  "lint": {
    "include": ["src/**/*.{ts,js,svelte}"],
    "exclude": ["node_modules", ".svelte-kit", ".vite", "dist", "build"],
    "rules": {
      "tags": ["recommended"]
    }
  },
  "unstable": ["fmt-component"]
}
```

我们还需要在 `deno.json` 文件中设置 `nodeModulesDir`，以便命令能够正确找到 `node_modules` 目录。

```json
{
  "nodeModulesDir": "auto"
}
```

如果你使用 VSCode 或其他支持 `settings.json` 的编辑器，下面是一些推荐配置，实现保存自动格式化和代码检查。

```json
{
  "deno.enable": true,
  "deno.enablePaths": [
    "./deno.json"
  ],
  "editor.defaultFormatter": "denoland.vscode-deno"
}
```

### 目录结构讲解

需要注意几个不同的目录：

- `src`：应用代码根目录，大部分时间和精力都会在这里。
- `src/lib`：SvelteKit 的别名目录，用于快速导入，存放辅助函数或库代码。
- `src/routes`：存放应用渲染页面的目录，SvelteKit 采用文件夹路由机制。

#### 重要信息

SvelteKit 应用中我们将遵循一些约定（这里只介绍本教程涉及的）：

- 文件或文件夹名称中包含 `server` 的，**只允许在服务器端运行**，在客户端运行会报错。
- 在 `src/routes` 中，文件的命名有规范：
  - `+page.svelte` —— 浏览器端渲染的文件
  - `+page.server.ts` —— 服务端运行的文件，允许向相邻的 `+page.svelte` 发送和接收类型安全的数据
  - `+layout.svelte` —— 定义布局文件，能为同一目录或子目录的所有 `+page.svelte` 提供出口
  - `+error.svelte` —— 自定义错误页，可以美化错误展示界面

稍后你会看到我们将恐龙数据文件 `dinosaurs.ts` 放在 `lib/server` 中，这表示该文件**只应被其他服务端文件访问**。

### 设置“数据库”

出于简化考虑，我们会使用 TypeScript 文件中保存一个 `Map` 来访问和查找数据。新建文件及路径：

```
src/lib/server/dinosaurs.ts
```

文件内容，定义 Dinosaur 类型，并存储恐龙数据转成 Map 导出。

```ts
export type Dinosaur = { name: string; description: string };

const dinosaurs = new Map<string, Dinosaur>();

const allDinosaurs: Dino[] = [
  // 在这里粘贴你的所有恐龙信息
];

for (const dino of allDinosaurs) {
  dinosaurs.set(dino.name.toLowerCase(), dino);
}

export { dinosaurs };
```

通过以上设置，我们完成了“数据库”的搭建！接下来学习如何在页面调用它。

### 加载用于渲染的数据

现在我们需要创建一个位于 routes 根目录的新文件 `+page.server.ts`，此目录下应已有对应的 `+page.svelte`。

```
src/routes/+page.server.ts
```

新建文件后，初始化加载函数以载入恐龙数据！

```ts
/// src/routes/+page.server.ts
import { dinosaurs } from '$lib/server/dinosaurs.js';

export const load = async ({ url }) => {
  return { dinosaurs: Array.from(dinosaurs) };
};
```

这里做的事情是将 Map 转为数组，以便 `+page.svelte` 里渲染。你可在页面内移除不需要内容或简单添加以下内容：

```html
<script lang="ts">
  /// src/routes/+page.svelte
  let { data } = $props();
</script>

<section class="mb-4 grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
  {#each data.dinosaurs as item}
  <a class="rounded border p-4" href="/{item.name}">{item.name}</a>
  {/each}
</section>
```

注意在操作 `data` 时我们拥有类型安全，能确认 `data.dinosaurs` 存在且类型正确！

### 添加单独的恐龙详情页

既然我们渲染了恐龙列表并为每个添加了链接，可以添加相应路由来渲染详情。

```
src/routes/[name]/+page.server.ts
src/routes/[name]/+page.svelte
```

这里有个特别点在于使用了带方括号的 `[name]` 文件夹名，代表路由参数命名。我们可以任意命名，但因为希望路由能访问形如 `localhost:5173/Ingenia` 的地址，故用参数 `name`。

理解后可以编写 server loader 获取恐龙数据并传递给页面：

```ts
/// src/routes/[name]/+page.server.ts
import { dinosaurs } from "$lib/server/dinosaurs.js";
import { error } from "@sveltejs/kit";

export const load = async ({ params: { name } }) => {
  const dino = dinosaurs.get(name.toLowerCase());

  if (!dino) {
    throw error(404, { message: "Dino not found" });
  }

  return { name: dino.name, description: dino.description };
};
```

这里我们抛出错误，提醒找不到恐龙。当前还未设置自定义错误页，因此访问不存在路径时会出现默认错误页。现在我们创建一个根目录级的错误页处理。

```
src/routes/+error.svelte
```

页面简单，可自行添加美化：

```html
<script lang="ts">
  import { page } from "$app/state";
</script>

<h1>{page.status}: {page.error?.message}</h1>
```

显示错误状态码及错误信息即可。

解决了错误页干扰后，我们继续显示具体恐龙详情！

```html
<script lang="ts">
  /// src/routes/[name]/+page.svelte
  let { data } = $props();
</script>

<h1>{data.name}</h1>

<p>{data.description}</p>
```

可以看到依然保持类型安全，确认 `name` 和 `description` 存在，并正常渲染。

但有个问题是：用户访问该详情页，无论是从首页链接点击或手动输入网址，无法方便返回首页。

### 布局

希望所有页面共享一些通用信息或链接，可以利用 `+layout.svelte` 文件。我们来更新 routes 根目录下的布局。

目标是实现：

1. 允许用户导航到主页
2. 展示 Deno 和 SvelteKit 的优质文档链接
3. 页面显示萌萌的恐龙图片！

```html
<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<header class="flex flex-row place-content-between items-center p-4">
  <h1 class="text-2xl"><a href="/">Deno Sveltekit</a></h1>
  <img id="deno" class="w-32" src="/vite-deno.svg" alt="Vite with Deno" />
</header>

<main class="container mx-auto p-4">
  {@render children()}
</main>

<footer class="my-4 flex flex-row justify-center gap-4">
  <p class="font-bold">
    <a href="https://svelte.dev/docs/kit">Sveltekit 文档</a>
  </p>
  <p class="font-bold">
    <a href="https://docs.deno.com/">Deno 文档</a>
  </p>
</footer>
```

这是我们第一次看到 `{@render children()}`，它相当于 React 里的“插槽”，渲染对应子页面内容。

回到应用，发现标题已带有返回首页的链接，十分方便。

### 进阶路由、搜索参数及样式

我们不想一次性渲染所有恐龙，那样滚动太长。希望用户能搜索并分页浏览恐龙，同时体现 Svelte 5 靓功能——代码片段(snippets)！

打开首页和对应的服务端代码，做一些修改。

之前简单返回了恐龙数组，现在加入搜索和分页逻辑。

```ts
import { dinosaurs } from "$lib/server/dinosaurs.js";

export const load = async ({ url }) => {
  // 通过 SvelteKit 注入的 url 获取搜索参数
  const queryParams = url.searchParams;

  // 使用 q 作为搜索关键字
  const q = queryParams.get("q");

  // 使用 page 确定当前页码
  const pageParam = queryParams.get("page");
  let page = 1;
  // 校验 page 参数，非数字则使用默认1
  if (pageParam) {
    const parsedPage = parseInt(pageParam);
    if (!isNaN(parsedPage)) {
      page = parsedPage;
    }
  }

  // 使用 limit 控制每页数量
  const limitParam = queryParams.get("limit");
  let limit = 25;
  // 校验 limit 参数，非数字则默认25
  if (limitParam) {
    const parsedLimit = parseInt(limitParam);
    if (!isNaN(parsedLimit)) {
      limit = parsedLimit;
    }
  }

  // 搜索处理：无 q 时展示全部，有 q 时进行名称匹配
  const filteredDinosaurs = Array.from(dinosaurs.values()).filter((d) => {
    if (!q) {
      return true;
    }

    return d.name.toLowerCase().includes(q.toLowerCase());
  });

  // 计算分页数据
  const offset = Math.abs((page - 1) * limit);
  const paginatedDinosaurs = Array.from(filteredDinosaurs).slice(
    offset,
    offset + limit,
  );
  const totalDinosaurs = filteredDinosaurs.length;
  const totalPages = Math.ceil(totalDinosaurs / limit);

  // 最后返回更多分页信息以便前端展示
  return {
    dinosaurs: paginatedDinosaurs,
    q,
    page,
    limit,
    totalPages,
    totalDinosaurs,
  };
};
```

呼，工作量不小，完成后添加分页和搜索输入控件到页面中。

```html
<script lang="ts">
	import { goto, invalidate, replaceState } from '$app/navigation';
	import { page as sveltePage } from '$app/state';

	let { data } = $props();

	// 改变页码，更新 URL 查询参数
	function handlePageChange(page: number) {
		const params = new URLSearchParams(sveltePage.url.searchParams);

		params.set('page', page.toString());
		goto(`?${params.toString()}`, { keepFocus: true });
	}

	// 处理搜索表单提交，根据是否有 q 设置对应参数并重置页码
	function handleQueryChange(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		event.preventDefault();
		const q = event.currentTarget.q.value;
		const params = new URLSearchParams(sveltePage.url.searchParams);

		if (q) {
			params.set('q', q);
			params.set('page', '1');
			goto(`?${params.toString()}`, { keepFocus: true });
		} else {
			params.delete('q');
			params.delete('page');
			goto(`?${params.toString()}`, { keepFocus: true });
		}
	}
</script>

<form onsubmit={handleQueryChange} class="mb-4">
	<label class="mb-2 block text-sm font-bold" for="q">搜索</label>
	<input
		class="focus:shadow-outline w-full form-input appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
		type="text"
		id="q"
		name="q"
		placeholder="搜索"
		defaultValue={data.q ?? ''}
	/>
</form>

<section class="mb-4 grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
	{#each data.dinosaurs as item}
		<a class="rounded border p-4" href="/{item.name}">{item.name}</a>
	{/each}

	{#if data.dinosaurs.length === 0}
		<p>未找到恐龙</p>
	{/if}
</section>

<!-- 分页 -->
{#if data.totalPages > 0}
	<div class="mb-4 flex justify-center">
		<div class="grid w-1/2 grid-flow-col gap-2">
			{@render pageButton(data.page - 1, data.page === 1, false, '←')}

			{#each { length: data.totalPages }, page}
				{#if page >= data.page - 2 && page <= data.page + 2}
					{@render pageButton(page + 1, data.page === page + 1, data.page === page + 1, page + 1)}
				{:else if (page === 0 || page === 1) && page !== data.page - 1}
					{@render pageButton(page + 1, data.page === page + 1, data.page === page + 1, page + 1)}
				{:else if page >= data.totalPages - 2 && page !== data.page - 1}
					{@render pageButton(page + 1, data.page === page + 1, data.page === page + 1, page + 1)}
				{/if}
			{/each}

			{@render pageButton(data.page + 1, data.page === data.totalPages, false, '→')}
		</div>
	</div>
{/if}

{#snippet pageButton(page: number, disabled: boolean, active: boolean, child: string | number)}
	<button
		class="rounded border p-4"
		class:disabled
		{disabled}
		class:active
		type="button"
		onclick={() => handlePageChange(page)}
	>
		{child}
	</button>
{/snippet}

<style lang="postcss">
	.active {
		@apply bg-emerald-400 text-white;
	}

	.disabled {
		@apply cursor-not-allowed opacity-50;
	}
</style>
```

注意搜索框使用了 `defaultValue={data.q ?? ''}`，防止页面渲染时显示 `undefined` 或 `null`。

利用 Snippets，可以定义可复用的 Svelte 代码片段，`{#snippet pageButton(...)}` 定义内容，后续用 `{@render pageButton(...)}` 调用并传递类型安全参数。分页按钮运用了该特性。

还有个 Svelte 巧妙点是页面中的 `<style>` 局部生效，不会影响其他文件。所以我们为分页按钮添加的 `.active` 和 `.disabled` 类样式不会全局污染。

此处稍微美化了样式，当然你可以根据个人喜好继续调整布局和风格！
