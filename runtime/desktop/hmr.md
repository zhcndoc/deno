---
last_modified: 2026-06-16
title: "热模块替换"
description: "deno desktop --hmr 在编辑过程中保持运行时和渲染后端持续运行：在框架项目中使用框架开发服务器，在其他所有场景中使用 V8 热切换。"
---

:::info 将于 Deno 2.9 中推出

`deno desktop` 随 Deno v2.9.0 发布，目前尚未进入稳定版本。要立即试用，请运行 `deno upgrade canary` 来安装 [`canary`](/runtime/reference/cli/upgrade/) 构建。该命令、配置键以及 TypeScript API 在功能稳定之前仍可能发生变化。

:::

```sh
deno desktop --hmr .
```

`--hmr` 在开发期间启用热模块替换。该模式会根据你的项目特征自动选择：

| 项目类型                                              | HMR 机制                                   |
| ----------------------------------------------------- | ------------------------------------------ |
| 检测到框架（Next.js 等）                              | 框架自身的开发服务器。                     |
| 普通 [`Deno.serve()`](/api/deno/~/Deno.serve) 脚本   | 文件监视器 + `Debugger.setScriptSource`。 |

在这两种模式下，Deno 运行时和渲染后端（CEF、WebView、……）都会在变更期间持续运行。不会进行完全重启，不会拆除 webview，也不会重新连接。

## 框架 HMR

当框架检测识别出你的项目时（参见 [Frameworks](/runtime/desktop/frameworks/)），`--hmr` 会运行框架自身的开发服务器，而不是其生产服务器。webview 会直接连接到该开发服务器：快速刷新、状态保留以及错误覆盖层的表现都与浏览器标签页中相同。

```sh
deno desktop --hmr .       # 在 Next.js / Astro / Fresh / … 项目中
```

开发服务器的具体行为由框架决定。如果 `next dev` 在浏览器中能在编辑后保留组件状态，那么它在你的桌面应用中也会保留。如果 `astro dev` 在语法错误时显示页面内错误覆盖层，你也会看到同样的覆盖层。

你无需单独运行框架的开发脚本；`deno desktop --hmr` 会作为桌面运行时的一部分自动启动它。

## 普通应用 HMR

对于未检测到框架的项目，`--hmr` 会监视你的源文件，并使用 V8 的 `Debugger.setScriptSource` 将模块热切换到正在运行的 isolate 中。

```ts title="main.ts"
Deno.serve((req) => {
  return new Response("hello world");
});
```

```sh
deno desktop --hmr main.ts
```

编辑 `main.ts`（更改响应体，添加路由），更改会在保存后立即生效。运行时不会重启，webview 不会重新加载，监听套接字也会保持绑定状态。

### 重新加载后哪些内容会保留

`Debugger.setScriptSource` 会用新代码替换函数的**代码**。现有值保持不变：

- 模块级状态（顶层 `let`、顶层 `Map` 等）会被保留。
- 已打开的文件句柄、网络连接、子进程：全部保留。
- HTTP 监听器会被保留。
- 定时器和间隔器会按其原始计划继续触发，除非你对它们调用 `clearTimeout` / `clearInterval`。

### 下一次调用时会发生什么变化

被替换的函数会在下一次被调用时执行新的函数体。因此：

- 请求处理器的更改会在下一次请求时生效。
- 定时器回调的更改会在下一次触发时生效。
- 事件监听器的更改会在下一次事件时生效。

### HMR 无法做到什么

`Debugger.setScriptSource` 有其限制。它无法替换：

- 已经执行过的顶层语句（模块作用域中的 `console.log` 只会在模块首次加载时运行）。
- 类的签名，例如添加字段或更改构造函数。类声明会被替换；现有实例会保留其旧形状。
- 导入集合。添加新的 `import` 行需要完全重新加载。

当某个变更过于破坏性，无法增量应用时，`--hmr` 会回退到对受影响模块进行完全重新加载。如果即使这样也不安全（例如，顶层状态会以运行时无法恢复的方式丢失），它会记录一条警告，建议进行完全重启。

## 浏览器端 HMR

webview 本身就是浏览器。浏览器 HMR（React 中的 fast refresh、Vue 的 HMR 运行时等）完全在渲染后端内部运行，并与开发服务器通信。`deno desktop --hmr` 不会干扰它；如果你的框架已经配置了浏览器端 HMR，它会按设计正常工作。

本页所述的 Deno 侧 HMR 与浏览器 HMR 是**分开的**。两者可以同时存在：

- 对 React 组件文件的更改 → 浏览器 HMR 会在 webview 内部应用它。
- 对你的 [`Deno.serve()`](/api/deno/~/Deno.serve) 处理器或某个绑定实现的更改 → Deno 侧 HMR 会在运行时内部应用它。

你几乎不需要考虑这种分工；两者都会在保存时发生。

## 限制和注意事项

- `--hmr` 仅用于开发。不要发布使用 `--hmr` 构建的二进制文件；文件监视器和调试器开销并不适合最终用户。
- 热切换后，为了在堆栈跟踪中获得准确的行号，需要 source map。默认会生成；不要在 bundler 配置中将其禁用。
- HMR 可与 `--inspect` 配合使用（参见 [DevTools](/runtime/desktop/devtools/)）。你可以将调试器附加到正在运行的 `--hmr` 会话，并单步调试新切换的代码。
