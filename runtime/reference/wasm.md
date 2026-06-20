---
last_modified: 2026-06-18
title: "WebAssembly"
description: "在 Deno 中使用 WebAssembly (Wasm) 的指南。了解模块导入、类型检查、流式 API、优化技术以及如何与编译为 Wasm 的各种编程语言进行协作。"
oldUrl:
  - /runtime/manual/getting_started/webassembly/
  - /runtime/manual/runtime/webassembly/
  - /runtime/manual/runtime/webassembly/using_wasm/
  - /runtime/manual/runtime/webassembly/using_streaming_wasm/
  - /runtime/manual/runtime/webassembly/wasm_resources/
---

WebAssembly（Wasm）旨在与 JavaScript 一起使用，以加快关键应用程序组件的速度，其执行速度可以比 JavaScript 高得多且更一致——类似于 C、C++ 或 Rust。Deno 可以使用与 [浏览器提供的](https://developer.mozilla.org/en-US/docs/WebAssembly) 相同的接口执行 WebAssembly 模块，并通过将其作为模块导入来使用它们。

## Wasm 模块

从 Deno 2.1 开始，可以导入 WebAssembly 模块并对其使用进行类型检查。

假设我们有一个 [WebAssembly 文本格式](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format) 文件，它导出一个 `add` 函数，该函数将两个数字相加并返回结果：

```wat title="add.wat"
(module
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
)
```

我们可以通过 [wat2wasm](https://github.com/webassembly/wabt) 将其编译为 `add.wasm`：

```sh
wat2wasm add.wat
```

然后通过导入语句使用此 WebAssembly 模块：

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, 2));
```

```shellsession
> deno run main.ts
3
```

### 类型检查

Deno 理解 Wasm 模块的导出并对其使用进行类型检查。如果在前面的示例中，我们错误地调用 `add` 函数，则会看到类型检查错误。

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, ""));
```

```shellsession
> deno check main.ts   
Check file:///.../main.ts
error: TS2345 [ERROR]: 参数类型为 'string' 的实参不能赋给参数类型为 'number' 的形参。
console.log(add(1, ""));
                   ~~
    at file:///.../main.ts:3:20
```

### 导入

与 JavaScript 类似，Wasm 模块也可以导入其他模块。

例如，我们可以创建一个 Wasm 模块，导入 `"./values.js"` 说明符并调用 `getValue` 导出：

```wat title="toolkit.wat"
(module
  (import "./time.ts" "getTimeInSeconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="time.ts"
export function getTimeInSeconds() {
  return Date.now() / 1000;
}
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

现在运行：

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
1732147633
V:\scratch
> deno run main.ts
1732147637
```

#### 重写导入说明符

通常，Wasm 模块不会使用相对说明符来方便地导入另一个 JavaScript 模块。假设我们有以下与之前类似的设置，但注意 Wasm 模块通过 "env" 说明符进行导入。

```wat title="toolkit.wat"
(module
  (import "env" "get_time_in_seconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="env.ts"
function getTimeInSeconds() {
  return Date.now() / 1000;
}

export { getTimeInSeconds as get_time_in_seconds };
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
error: 相对导入路径 "env" 未以前缀 /、./ 或 ../ 开头
    at file:///.../toolkit.wasm
```

这并不是很方便，因为我们希望它导入 `"./env.ts"`。

幸运的是，通过在 _deno.json_ 中通过 [导入映射](https://github.com/WICG/import-maps) 将说明符映射，可以很简单地使其工作：

```json title="deno.json"
{
  "imports": {
    "env": "./env.ts"
  }
}
```

现在它可以正常工作：

```shellsession
> deno run main.ts
1732148355
```

## 通过 WebAssembly API 使用 WebAssembly

要在 Deno 中运行 WebAssembly，您只需要一个要运行的 Wasm 模块。以下模块导出一个 `main` 函数，该函数在调用时仅返回 `42`：

```ts
// deno-fmt-ignore
const wasmCode = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127,
  3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0,
  5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145,
  128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97,
  105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0,
  65, 42, 11
]);

const wasmModule = new WebAssembly.Module(wasmCode);

const wasmInstance = new WebAssembly.Instance(wasmModule);

const main = wasmInstance.exports.main as CallableFunction;
console.log(main().toString());
```

为了通过 WebAssembly API 加载 WebAssembly，需要执行以下步骤：

1. 获取二进制文件（通常为 `.wasm` 文件，尽管我们现在使用一个简单的字节数组）
2. 将二进制文件编译为 `WebAssembly.Module` 对象
3. 实例化 WebAssembly 模块

WebAssembly 是一种二进制数据格式，旨在不易于人类阅读，也不应手动编写。您的 `.wasm` 文件应由如 [Rust](https://www.rust-lang.org/)、[Go](https://golang.org/) 或 [AssemblyScript](https://www.assemblyscript.org/) 等语言的编译器生成。

例如，编译成上述字节的 Rust 程序可能看起来像这样：

```rust
#[unsafe(no_mangle)]
pub fn main() -> u32 { // u32 表示使用 32 位内存的无符号整数。
  42
}
```

## 使用流式 WebAssembly API

获取、编译和实例化 WebAssembly 模块的 [最有效](/api/web/~/WebAssembly.instantiateStreaming) 方法是使用 WebAssembly API 的流式变体。例如，您可以使用 `instantiateStreaming` 结合 `fetch` 一次性执行这三步：

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

请注意，`.wasm` 文件必须使用 `application/wasm` MIME 类型提供。如果您希望在实例化之前对模块执行其他操作，您可以改为使用 [`compileStreaming`](/api/web/~/WebAssembly.compileStreaming)：

```ts
const module = await WebAssembly.compileStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

/* 再做一些其他操作 */

const instance = await WebAssembly.instantiate(module);
instance.exports.increment as (input: number) => number;
```

如果由于某种原因您无法使用流式方法，则可以回退到效率较低的 [`compile`](/api/web/~/WebAssembly.compile) 和 [`instantiate`](/api/web/~/WebAssembly.instantiate) 方法。

有关流式方法为何更高效的更深入了解，请 [查看这篇文章](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/)。

## WebAssembly API

有关 WebAssembly API 所有部分的更多信息，请参见
[Deno 参考指南](/api/web/~/WebAssembly) 和
[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)。

## 处理非数字类型

本文档中的代码示例仅使用了 WebAssembly 模块中的数字类型。要使用更复杂的类型（如字符串或类）运行 WebAssembly，您需要使用生成 JavaScript 和编译为 WebAssembly 的语言之间类型绑定的工具。

关于如何在 JavaScript 和 Rust 之间创建类型绑定、将其编译为二进制文件并从 JavaScript 程序调用的示例，可以在 [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm) 上找到。

如果您计划在 Rust+WebAssembly 中进行大量 Web API 工作，您可能会发现 [web_sys](https://rustwasm.github.io/wasm-bindgen/web-sys/index.html) 和 [js_sys](https://rustwasm.github.io/wasm-bindgen/contributing/js-sys/index.html) Rust crate 很有用。`web_sys` 包含 Deno 中可用的大多数 Web API 的绑定，而 `js_sys` 提供 JavaScript 标准内置对象的绑定。

## 在 Deno 中使用 wasmbuild 进行 Rust WebAssembly 开发

[wasmbuild](https://github.com/denoland/wasmbuild) 是一个官方的 Deno 工具，简化了在 Deno 项目中使用 Rust 和 WebAssembly。它自动化了将 Rust 代码编译为 WebAssembly 和生成 TypeScript 绑定的过程，使从 JavaScript 调用 Rust 函数变得简单。

wasmbuild 为您的 Rust 函数生成 TypeScript 定义，提供完整的类型检查。生成的 JavaScript 可以与 esbuild 等打包器一起使用。生成的文件可以直接提交到源代码控制中，以便于部署。

## WebAssembly System Interface (WASI)

上面的示例实例化了仅与 JavaScript 交换数字和内存的 Wasm 模块。
[WebAssembly System Interface (WASI)](https://wasi.dev/) 是一组标准导入，
它使 Wasm 模块能够访问类似操作系统的功能，
例如读取命令行参数和环境变量、时钟，以及
（在您授予权限时）文件系统。它使得用 Rust、
C 或其他语言编写并编译为 Wasm 的程序能够在浏览器之外运行，
就像它作为原生命令行二进制文件运行一样。

Deno 支持两个版本的 WASI：

- **WASI Preview 1** (`wasip1`) 模块通过
  [`node:wasi`](https://nodejs.org/api/wasi.html) 模块运行。
- **WASI Preview 2** (`wasip2`) 组件，建立在
  [component model](https://component-model.bytecodealliance.org/) 之上，通过
  Bytecode Alliance 的 [`jco`](https://github.com/bytecodealliance/jco) 工具运行，
  该工具还可以将组件转译为您像导入任何模块一样导入的 JavaScript。

### 运行 WASI Preview 1 模块

将程序编译为 `wasm32-wasip1` 目标。任何面向 WASI 的工具链都可以；以 Rust 为例：

```sh
rustc --target wasm32-wasip1 -O hello.rs -o hello.wasm
```

使用 `node:wasi` 模块从 Deno 运行它。使用访客应看到的参数和环境变量构造一个 `WASI` 实例，使用 WASI 导入实例化模块，然后调用 `start`：

```ts title="run.ts"
import { WASI } from "node:wasi";

const wasi = new WASI({
  version: "preview1",
  args: ["hello", "alpha", "beta"],
  env: { GREETING: "hello-wasi" },
});

const bytes = await Deno.readFile(new URL("./hello.wasm", import.meta.url));
const module = await WebAssembly.compile(bytes);
const instance = await WebAssembly.instantiate(module, wasi.getImportObject());

wasi.start(instance);
```

```sh
deno run --allow-read run.ts
```

WASI 实例在开始时无法访问真实文件系统。要向访客公开目录，请传递一个 `preopens` 映射，将模块看到的路径映射到磁盘上的真实路径，例如 `preopens: { "/data": "./data" }`。然后模块可以在 `./data` 内部读取和写入（并且您的 Deno 进程需要相应的 `--allow-read` 和 `--allow-write` 权限）。

:::note

`node:wasi` 是一个实验性的 Node.js API，因此当您使用它时，Deno 会打印实验性警告。

:::

### 运行 WASI Preview 2 组件

Preview 2 组件编译为 `wasm32-wasip2` 目标：

```sh
rustc --target wasm32-wasip2 -O hello.rs -o hello.wasm
```

组件不是普通的 Wasm 模块，因此不能通过 `WebAssembly` API 或 `node:wasi` 加载。请使用 `jco` 直接运行它：

```sh
deno run -A npm:@bytecodealliance/jco run hello.wasm alpha beta
```

要从您自己的代码中调用组件，而不是将其作为命令运行，请使用绑定将其转译为 JavaScript：

```sh
deno run -A npm:@bytecodealliance/jco transpile hello.wasm -o out
```

这会将一个 ES 模块写入 `out/`，您可以像导入任何其他 JavaScript 模块一样导入它。

## 优化

对于生产构建，您可以对 WebAssembly 二进制文件进行优化。如果您通过网络提供二进制文件，则优化大小可以产生真正的差异。如果您主要在服务器上执行 WebAssembly 以执行计算密集型任务，则优化速度可能是有益的。您可以在 [这里](https://rustwasm.github.io/docs/book/reference/code-size.html) 找到有关优化（生产）构建的良好指南。此外， [rust-wasm 小组](https://rustwasm.github.io/docs/book/reference/tools.html) 提供了一些用于优化和处理 WebAssembly 二进制文件的工具列表。