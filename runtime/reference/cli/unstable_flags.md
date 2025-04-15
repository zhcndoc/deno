---
title: "不稳定功能标志"
oldUrl:
 - /runtime/tools/unstable_flags/
 - /runtime/manual/tools/unstable_flags/
---

Deno 运行时的新功能通常会在功能标志后发布，因此用户可以在功能最终确定之前尝试新的 API 和功能。当前的不稳定功能标志列在此页面上，也可以通过运行以下命令在 CLI 帮助文本中找到：

```sh
deno --help
```

## 在命令行中使用标志

您可以通过将标志作为选项传递给 CLI 来在从命令行运行 Deno 程序时启用功能标志。以下是启用 `--unstable-node-globals` 标志运行程序的示例：

```sh
deno run --unstable-node-globals main.ts
```

## 在 `deno.json` 中配置标志

您可以使用 [`deno.json`](/runtime/fundamentals/configuration/) 中的配置选项指定要为项目启用的哪些不稳定功能。

```json title="deno.json"
{
  "unstable": ["bare-node-builtins", "webgpu"]
}
```

`unstable` 数组中的可能值是标志名称，去掉了 `--unstable-` 前缀。

## 通过环境变量配置

有些标志可以通过为特定名称的环境变量设置一个值（任何值）来启用，而不是作为标志或 `deno.json` 配置选项传递。可以通过环境变量设置的标志将在下面进行说明。

以下是通过环境变量设置 `--unstable-bare-node-builtins` 标志的示例：

```sh
export DENO_UNSTABLE_BARE_NODE_BUILTINS=true
```

## `--unstable-bare-node-builtins`

**环境变量：** `DENO_UNSTABLE_BARE_NODE_BUILTINS`

此标志允许您
[导入 Node.js 内置模块](/runtime/fundamentals/node/#node-built-in-modules)
而不使用 `node:` 说明符，如下面的示例所示。您还可以使用此标志在手动管理 Node.js 依赖项时启用 npm 包，而不使用 `npm:` 说明符（[参见 `byonm` 标志](#--unstable-byonm)）。

```ts title="example.ts"
import { readFileSync } from "fs";

console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

## `--unstable-detect-cjs`

**环境变量：** `DENO_UNSTABLE_DETECT_CJS`

在以下附加场景中，将 `.js`、`.jsx`、`.ts` 和 `.tsx` 模块加载为可能的 CommonJS：

1. _package.json_ 没有 `"type"` 字段。
2. 不存在 _package.json_。

默认情况下，Deno 仅在您处于具有 _package.json_ 且最近的 _package.json_ 拥有 `{ "type": "commonjs" }` 时，将这些模块加载为可能的 CommonJS。

需要 Deno >= 2.1.2

## `--unstable-node-globals`

此标志将 Node 特定的全局变量注入到全局作用域中。注入的全局变量包括：

- `Buffer`
- `global`
- `setImmediate`
- `clearImmediate`

请注意，从 Deno 2.0 开始，`process` 已作为全局变量可用。

需要 Deno >= 2.1.0

## `--unstable-sloppy-imports`

**环境变量：** `DENO_UNSTABLE_SLOPPY_IMPORTS`

此标志启用一种行为，推断导入中缺少的文件扩展名。通常，下面的导入语句将产生错误：

```ts title="foo.ts"
import { Example } from "./bar";
console.log(Example);
```

```ts title="bar.ts"
export const Example = "Example";
```

在启用不严格导入的情况下执行脚本将消除错误，但会提供指导，建议使用更高效的语法。

不严格导入将允许（但会打印警告）以下内容：

- 从导入中省略文件扩展名
- 使用不正确的文件扩展名（例如，当实际文件为 `.ts` 时，使用 `.js` 扩展名导入）
- 导入目录路径，并自动使用 `index.js` 或 `index.ts` 作为该目录的导入

[`deno compile`](/runtime/reference/cli/compile/) 不支持不严格导入。

## `--unstable-unsafe-proto`

Deno 出于安全原因做出了不支持 `Object.prototype.__proto__` 的明确决定。然而，仍然有许多依赖于此属性正常工作的 npm 包。

此标志启用此属性。请注意，不建议使用此选项，但如果您确实需要使用依赖于它的包，现在可以使用解除限制的功能。

## `--unstable-webgpu`

在全局作用域中启用 [`WebGPU` API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)，类似于浏览器。以下是使用此 API 获取 GPU 基本信息的简单示例：

```ts
// 尝试从用户代理获取适配器。
const adapter = await navigator.gpu.requestAdapter();
if (adapter) {
  // 打印适配器的一些基本信息。
  const adapterInfo = await adapter.requestAdapterInfo();

  // 在某些系统上，这将是空白...
  console.log(`找到适配器: ${adapterInfo.device}`);

  // 打印 GPU 功能列表
  const features = [...adapter.features.values()];
  console.log(`支持的功能: ${features.join(", ")}`);
} else {
  console.error("未找到适配器");
}
```

查看 [这个仓库](https://github.com/denoland/webgpu-examples) 获取更多使用 WebGPU 的示例。

## `--unstable-broadcast-channel`

启用此标志将使 [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) Web API 可在全局作用域中使用，类似于浏览器。

## `--unstable-worker-options`

启用不稳定的 [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) API 选项。具体而言，它允许您指定可用的权限给工作者：

```ts
new Worker(`data:application/javascript;base64,${btoa(`postMessage("ok");`)}`, {
  type: "module",
  deno: {
    permissions: {
      read: true,
    },
  },
}).onmessage = ({ data }) => {
  console.log(data);
};
```

## `--unstable-cron`

启用此标志将使 [`Deno.cron`](/deploy/kv/manual/cron) API 可用于 `Deno` 命名空间。

## `--unstable-kv`

启用此标志将使 [Deno KV](/deploy/kv/manual) API 可用于 `Deno` 命名空间。

## `--unstable-net`

在 `Deno` 命名空间中启用不稳定网络 API。这些 API 包括：

- [`WebSocketStream`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocketStream)
- [`Deno.DatagramConn`](https://docs.deno.com/api/deno/~/Deno.DatagramConn)

## `--unstable-otel`

启用 [Deno 的 OpenTelemetry 集成](/runtime/fundamentals/open_telemetry)。

## `--unstable`

:::caution --unstable 已被弃用 - 请改用更细粒度的标志

`--unstable` 标志不再用于新功能，并将在未来的版本中移除。通过此标志可以使用的所有不稳定功能现在都作为独立的不稳定标志可用，特别是：

- `--unstable-kv`
- `--unstable-cron`

请在今后使用这些功能标志。

:::

在较早的 Deno 版本（1.38+）之前，不稳定 API 是通过 `--unstable` 标志一次性提供的。值得注意的是，[Deno KV](/deploy/kv/manual) 和其他云原语 API 是通过此标志提供的。要运行一个具有访问这些不稳定功能的程序，您可以运行你的脚本：

```sh
deno run --unstable your_script.ts
```

建议您使用更细粒度的不稳定标志，而不是使用此标志，`--unstable` 标志现在已被弃用，并将在 Deno 2 中移除。
