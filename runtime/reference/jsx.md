---
last_modified: 2026-06-13
title: "JSX 和 React"
description: "在 Deno 中为 React、Preact 或 Hono 配置 JSX：自动运行时、服务器端渲染及其权限注意事项、预编译转换，以及按文件设置的 pragma。"
oldUrl:
  - /deploy/manual/using-jsx/
  - /runtime/manual/advanced/jsx_dom/jsx/
  - /runtime/manual/advanced/jsx/
---

Deno 在 `.jsx` 和 `.tsx` 文件中运行 JSX，无需构建步骤。本页介绍
如何配置它：目标 UI 库、如何在服务器上将 JSX 渲染为 HTML，以及控制转换的选项。
如果你正在使用某个框架构建应用，框架通常会为你完成这些设置。有关 Fresh、Next.js 和其他框架，请参见
[Web 开发](/runtime/fundamentals/web_dev/)。

JSX 需要一个库来在运行时将 `<h1>` 之类的标签转换为值。Deno
支持 [React](https://react.dev/)、[Preact](https://preactjs.com/) 和
[Hono](https://hono.dev/)，通过 `deno.json` 中的 `jsxImportSource` 设置进行选择。

## 设置 JSX

在 `deno.json` 中使用自动运行时一次性配置 JSX。这是
推荐的设置：你编写 JSX，Deno 会为你插入正确的导入，因此
你无需手动导入 JSX 工厂。

对于 React：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react@^19",
    "@types/react": "npm:@types/react@^19"
  }
}
```

`@types/react` 提供 JSX 的类型检查和编辑器自动补全。
编辑完 `imports` 后，运行 `deno install` 以下载并缓存这些
包。

对于 Preact，则将 `jsxImportSource` 指向 `preact`。Preact 自带其
类型，因此不需要单独的 `@types` 包：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "imports": {
    "preact": "npm:preact@^10"
  }
}
```

无论哪种配置，组件都只是返回 JSX 的函数：

```tsx title="hello.tsx"
export function Hello() {
  return <h1>Hello, world!</h1>;
}
```

:::note 传统经典运行时

Deno 内置的默认行为早于自动运行时：它是经典的
`"react"` 转换，会将 JSX 编译为 `React.createElement` 调用，并
期望作用域中存在 `React` 变量。依赖默认设置的代码
如果没有将 React 导入每个 JSX 文件，在运行时会抛出 `ReferenceError: React is not defined`。
新项目应优先使用上面的自动运行时。

:::

## 选择 React、Preact 或 Hono

这三者都可在 Deno 中使用。选择哪一个取决于你要构建什么：

- **Preact** 是一个小巧、快速、兼容 React 的库。对于服务器渲染的 HTML 来说，它是一个很强的选择，
  并且可与
  [预编译转换](#speed-up-server-rendering) 配合以获得最高速度。
  [Fresh](https://fresh.deno.dev/)，Deno 的 Web 框架，使用 Preact。
- **Hono** 提供了自己的 JSX 运行时（`hono/jsx`），面向服务器端
  渲染和边缘部署。当你已经在使用 Hono 构建 API 或站点时，
  请选择它。
- **React** 是当你需要 React 生态系统时的正确选择：仅限 React 的
  库、React Server Components，或现有的 React 代码库。它的服务器渲染器比 Preact 的更重，
  并且不支持预编译转换。

你以后可以通过更改 `jsxImportSource` 和匹配的导入来切换库。
你编写的 JSX 保持不变。

## 在服务器上将 JSX 渲染为 HTML

要从服务器发送 HTML，请将你的组件渲染为字符串并在
[`Response`](/api/web/~/Response) 中返回。不同库的渲染器不同。

使用 Preact 时，使用
[`preact-render-to-string`](https://www.npmjs.com/package/preact-render-to-string)：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "imports": {
    "preact": "npm:preact@^10",
    "preact-render-to-string": "npm:preact-render-to-string@^6"
  }
}
```
## 在服务器响应中渲染 JSX

```tsx title="server.tsx"
import { render } from "preact-render-to-string";

function App() {
  return <h1>Hello from Preact</h1>;
}

Deno.serve((_req) => {
  const html = `<!DOCTYPE html>${render(<App />)}`;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
```

```sh
deno run -N server.tsx
```

使用 React 时，使用 `react-dom/server`：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react@^19",
    "react-dom": "npm:react-dom@^19",
    "@types/react": "npm:@types/react@^19"
  }
}
```

```tsx title="server.tsx"
import { renderToString } from "react-dom/server";

function App() {
  return <h1>Hello from React</h1>;
}

Deno.serve((_req) => {
  const html = `<!DOCTYPE html>${renderToString(<App />)}`;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
```

:::caution React 的服务器渲染器需要 `--allow-env`

`react-dom/server` 会读取 `process.env.NODE_ENV`，因此 React 服务器会失败，
并报出 `NotCapable: Requires env access to "NODE_ENV"`，除非你授予环境
访问权限。请结合网络标志一起使用 `-E`（或 `--allow-env`）运行：

```sh
deno run -N -E server.tsx
```

Preact 的渲染器不会读取环境，因此不需要额外权限。

:::

## 加速服务器渲染

Deno 提供了一个专为服务器端渲染构建的
[预编译转换](https://deno.com/blog/v1.38#fastest-jsx-transform)。它会在构建时分析你的 JSX，并将静态
标记转换为预构建的 HTML 字符串，因此服务器在每个请求中无需再花费大部分时间去
创建 JSX 对象。将 `jsx` 设置为 `"precompile"`：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "preact"
  },
  "imports": {
    "preact": "npm:preact@^10",
    "preact-render-to-string": "npm:preact-render-to-string@^6"
  }
}
```

预编译转换适用于 **Preact 和 Hono**。它 **不** 适用于
React：React 的 `jsx-runtime` 没有导出该转换所依赖的 `jsxTemplate` 辅助函数，
因此按这种方式配置的 React 项目运行时会失败，并报出
`SyntaxError: ... does not provide an export named 'jsxTemplate'`。React 项目应改用
`"react-jsx"` 运行时。

如果某些元素不应被预编译为静态字符串，请在
`jsxPrecompileSkipElements` 中列出它们的标签名：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "preact",
    "jsxPrecompileSkipElements": ["a", "link"]
  },
  "imports": {
    "preact": "npm:preact@^10"
  }
}
```

## 使用 pragma 按文件配置 JSX

当你的项目大部分使用一种设置，但某个文件需要另一种设置时，可以使用 pragma 注释为该文件设置导入源，而不是修改
`deno.json`。这在没有项目
配置的独立脚本中很常见。pragma 必须出现在文件的开头注释中：

```tsx title="snippet.tsx"
/** @jsxImportSource npm:preact */

export function App() {
  return <h1>Hello from a one-off script</h1>;
}
```

如果该库没有自带类型，请使用 `@jsxImportSourceTypes` 将 Deno 指向单独的类型
包：

```tsx
/** @jsxImportSource npm:react@^19 */
/** @jsxImportSourceTypes npm:@types/react@^19 */

export function Hello() {
  return <div>Hello!</div>;
}
```

相同的 `jsxImportSourceTypes` 也可作为 `deno.json` 中的编译器选项供
那些 JSX 库不提供类型的项目使用。

## 转换选项参考

`jsx` 编译器选项决定 Deno 如何编译 JSX。在 `deno.json` 的
`compilerOptions` 下进行设置：

| `jsx` 值         | 作用                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `"react-jsx"`    | 自动运行时。插入来自 `<jsxImportSource>/jsx-runtime` 的导入。推荐。                         |
| `"react-jsxdev"` | 带调试信息（文件、行、列）的自动运行时，添加到每个节点。仅用于开发。                         |
| `"precompile"`   | 为 Preact 和 Hono 优化的服务器渲染转换。SSR 速度最快。                                      |
| `"react"`        | 传统经典转换。编译为 `React.createElement`；需要作用域中有 `React`。                         |

相关设置：

- `jsxImportSource`：JSX 导入来源的模块（`react`、`preact`、
  `hono/jsx`）。Deno 会自动追加 `/jsx-runtime`。
- `jsxImportSourceTypes`：当 JSX 库不提供类型时使用的类型包。
- `jsxPrecompileSkipElements`：在预编译
  转换中排除的标签名。

有关 Deno 支持的完整 TypeScript 编译器选项，请参见
[`deno.json` 参考](/runtime/reference/deno_json/) 和
[配置 TypeScript](/runtime/reference/ts_config_migration/)。

## 下一步

- [Web 开发](/runtime/fundamentals/web_dev/)：使用 Fresh、
  Next.js、Astro 和其他为你配置 JSX 的框架构建应用。
- [HTTP 服务器](/runtime/fundamentals/http_server/)：提供由你的
 组件渲染的 HTML。
- [配置文件](/runtime/reference/deno_json/)：每个 `deno.json` 字段，
  包括 `compilerOptions`。
