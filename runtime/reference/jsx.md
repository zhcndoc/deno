---
title: "JSX"
description: "Complete guide to using JSX in Deno. Learn about JSX configuration options, automatic runtime features, development transforms, and Deno's optimized precompile transform for server-side rendering."
oldUrl:
  - /deploy/manual/using-jsx/
  - /runtime/manual/advanced/jsx_dom/jsx/
  - /runtime/manual/advanced/jsx/
---

Deno 内置支持 `.jsx` 文件和 `.tsx` 文件中的 JSX。Deno 中的 JSX 对于服务器端渲染或为浏览器生成代码非常有用。

## 默认配置

Deno CLI 对 JSX 有默认配置，这与 `tsc` 的默认配置不同。实际上，Deno 默认使用以下 [TypeScript 编译器](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 选项：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "jsxFragmentFactory": "React.Fragment"
  }
}
```

使用 `"react"` 选项时，将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出:
const jsx = React.createElement(
  "div",
  { className: "foo" },
  React.createElement(MyComponent, { value: 2 }),
);
```

## JSX 自动运行时（推荐）

在 React 17 中，React 团队添加了他们所称之为 [新 JSX 转换](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)。这增强了 JSX 转换的 API，并提供了一种机制，可以自动添加相关的 JSX 导入，以便您无需手动添加。这是推荐使用 JSX 的方式。

要使用更新的 JSX 运行时转换，请在您的 `deno.json` 中更改编译器选项。

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react"
  }
}
```

在后台，`jsxImportSource` 设置将始终在导入说明符后附加 `/jsx-runtime`。

```js
// 此导入将被自动插入
import { jsx as _jsx } from "react/jsx-runtime";
```

使用 `"react-jsx"` 选项将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出
import { jsx as _jsx } from "react/jsx-runtime";
const jsx = _jsx(
  "div",
  {
    className: "foo",
    children: _jsx(MyComponent, { value: 2 }),
  },
);
```

如果您希望使用 [Preact](https://preactjs.com/) 而不是 React，您可以相应地更新 `jsxImportSource` 值。

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "react-jsx",
-     "jsxImportSource": "react"
+     "jsxImportSource": "preact"
    },
    "imports": {
-     "react": "npm:react"
+     "preact": "npm:preact"
    }
  }
```

### 开发转换

将 `"jsx"` 选项设置为 `"react-jsxdev"` 而不是 `"react-jsx"` 将为每个 JSX 节点传递额外的调试信息。额外的信息包括每个 JSX 节点调用位置的文件路径、行号和列号。

这些信息通常在框架中用于增强开发期间的调试体验。在 React 中，这些信息用于增强堆栈跟踪，并显示组件在哪个位置被实例化，通常在 React 开发者工具浏览器扩展中显示。

使用 `"react-jsxdev"` 选项将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
const _jsxFileName = "file:///input.tsx";
const jsx = _jsxDEV(
  "div",
  {
    className: "foo",
    children: _jsxDEV(
      MyComponent,
      {
        value: 2,
      },
      void 0,
      false,
      {
        fileName: _jsxFileName,
        lineNumber: 3,
        columnNumber: 5,
      },
      this,
    ),
  },
  void 0,
  false,
  {
    fileName: _jsxFileName,
    lineNumber: 1,
    columnNumber: 14,
  },
  this,
);
```

:::caution

仅在开发期间使用 `"react-jsxdev"` 信息，而不是在生产中。

:::

### 使用 JSX 导入源谕语

无论您是否为项目配置了 JSX 导入源，还是使用默认的“旧版”配置，您都可以向 `.jsx` 或 `.tsx` 模块添加 JSX 导入源谕语，并且 Deno 会尊重它。

`@jsxImportSource` 谕语需要位于模块的开头注释中。例如，要使用来自 esm.sh 的 Preact，您可以这样做：

```jsx
/** @jsxImportSource https://esm.sh/preact */

export function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

### `jsxImportSourceTypes`

在某些情况下，库可能不提供类型。要指定类型，您可以使用 `@jsxImportSourceTypes` 谕语：

```jsx
/** @jsxImportSource npm:react@^18.3 */
/** @jsxImportSourceTypes npm:@types/react@^18.3 */

export function Hello() {
  return <div>Hello!</div>;
}
```

或者通过 _deno.json_ 中的 `jsxImportSourceTypes` 编译器选项进行指定：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "npm:react@^18.3",
    "jsxImportSourceTypes": "npm:@types/react@^18.3"
  }
}
```

## JSX 预编译转换

Deno 附带了一种 [新 JSX 转换](https://deno.com/blog/v1.38#fastest-jsx-transform)，其针对服务器端渲染进行了优化。与其他 JSX 转换选项相比，它可能快 **7-20 倍**。区别在于，预编译转换静态分析您的 JSX，并在可能的情况下存储预编译的 HTML 字符串。这可以避免在创建 JSX 对象时消耗大量时间。

要使用预编译转换，请将 `jsx` 选项设置为 `"precompile"`。

```diff title="deno.json"
  {
    "compilerOptions": {
+     "jsx": "precompile",
      "jsxImportSource": "preact"
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

为了防止代表 HTML 元素的 JSX 节点被预编译，您可以将它们添加到 `jsxPrecompileSkipElements` 设置中。

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "precompile",
      "jsxImportSource": "preact",
+     "jsxPrecompileSkipElements": ["a", "link"]
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

:::note

`precompile` 转换与 [Preact](https://preactjs.com/) 或 [Hono](https://hono.dev/) 最为兼容。它在 React 中不支持。

:::

使用 `"precompile"` 选项将 JSX 转换为以下 JavaScript 代码：

```jsx
// 输入
const jsx = (
  <div className="foo">
    <MyComponent value={2} />
  </div>
);

// 输出:
import {
  jsx as _jsx,
  jsxTemplate as _jsxTemplate,
} from "npm:preact/jsx-runtime";
const $$_tpl_1 = [
  '<div class="foo">',
  "</div>",
];
function MyComponent() {
  return null;
}
const jsx = _jsxTemplate(
  $$_tpl_1,
  _jsx(MyComponent, {
    value: 2,
  }),
);
```
## 在服务器响应中渲染 JSX

在 Deno 中使用 JSX 进行服务器端渲染时，您需要将 JSX 组件转换为可以在响应中发送的 HTML 字符串。这在使用 Deno.serve 构建 Web 应用程序时特别有用。

### 使用 Preact 和 renderToString

对于 Preact 应用程序，您可以使用 `preact-render-to-string` 包：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "preact"
  },
  "imports": {
    "preact": "npm:preact@^10.26.6",
    "preact-render-to-string": "npm:preact-render-to-string@^6.5.13"
  }
}
```

然后在你的服务器代码中：

```tsx title="server.tsx"
import { renderToString } from "preact-render-to-string";

const App = () => {
  return <h1>Hello world</h1>;
};

Deno.serve(() => {
  const html = `<!DOCTYPE html>${renderToString(<App />)}`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
```

这种方法与预编译转换配合良好，提供了最佳的服务器端渲染性能。

### 使用 React 的 renderToString

如果你使用 React 而不是 Preact，可以使用 React 自身的服务器渲染能力：

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react@^18.2.0",
    "react-dom": "npm:react-dom@^18.2.0",
    "react-dom/server": "npm:react-dom@^18.2.0/server"
  }
}
```

在您的服务器代码中：

```tsx title="server.tsx"
import { renderToString } from "react-dom/server";

const App = () => {
  return <h1>Hello from React</h1>;
};

Deno.serve(() => {
  const html = `<!DOCTYPE html>${renderToString(<App />)}`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
```

使用这些配置，您的 Deno 服务器可以高效地将 JSX 组件渲染为 HTML 并将其提供给客户端。
