---
last_modified: 2025-10-15
title: "外部函数接口（Foreign Function Interface，FFI）"
description: "了解如何使用 Deno 的外部函数接口（FFI）直接从 JavaScript 或 TypeScript 调用原生库。包含示例、最佳实践和安全注意事项。"
---

Deno 的外部函数接口（FFI）允许 JavaScript 和 TypeScript 代码
调用以 C、C++ 或 Rust 等语言编写的动态库中的函数。
这使你能够将本地代码的性能和能力直接集成到你的 Deno 应用程序中。

<a href="/api/deno/ffi" class="docs-cta runtime-cta">Deno FFI 参考文档</a>

## FFI 简介

FFI 在 Deno 的 JavaScript 运行时与本地代码之间提供了一座桥梁。这样
你可以：

- 在 Deno 应用程序中使用现有的本地库
- 使用 Rust 或 C 等语言实现性能关键代码
- 访问 JavaScript 中无法直接使用的操作系统 API 和硬件功能

Deno 的 FFI 实现基于
[`Deno.dlopen`](/api/deno/~/Deno.dlopen) API，它会加载动态库并
为其导出的函数创建 JavaScript 绑定。

## 安全注意事项

FFI 需要使用
[`--allow-ffi`](/runtime/fundamentals/security#ffi-foreign-function-interface)
标志显式授予权限，因为本地代码运行在 Deno 安全沙箱之外：

```sh
deno run --allow-ffi my_ffi_script.ts
```

:::info

<strong>重要安全警告</strong>：与在 Deno 沙箱中运行的 JavaScript 代码不同，
通过 FFI 加载的本地库拥有与 Deno 进程本身相同的访问级别。这意味着它们可以：

- 访问文件系统
- 建立网络连接
- 访问环境变量
- 执行系统命令

务必确保你信任通过 FFI 加载的本地库。

:::

## 基本用法

在 Deno 中使用 FFI 的基本模式包括：

1. 定义你想调用的本地函数接口
2. 使用 [`Deno.dlopen()`](/api/deno/~/Deno.dlopen) 加载动态库
3. 调用已加载的函数

下面是一个加载 C 库的简单示例：

```ts
const dylib = Deno.dlopen("libexample.so", {
  add: { parameters: ["i32", "i32"], result: "i32" },
});

console.log(dylib.symbols.add(5, 3)); // 8

dylib.close();
```

## 支持的类型

Deno 的 FFI 支持多种参数和返回值数据类型：

| FFI 类型               | Deno                 | C                        | Rust                      |
| ---------------------- | -------------------- | ------------------------ | ------------------------- |
| `i8`                   | `number`             | `char` / `signed char`   | `i8`                      |
| `u8`                   | `number`             | `unsigned char`          | `u8`                      |
| `i16`                  | `number`             | `short int`              | `i16`                     |
| `u16`                  | `number`             | `unsigned short int`     | `u16`                     |
| `i32`                  | `number`             | `int` / `signed int`     | `i32`                     |
| `u32`                  | `number`             | `unsigned int`           | `u32`                     |
| `i64`                  | `bigint`             | `long long int`          | `i64`                     |
| `u64`                  | `bigint`             | `unsigned long long int` | `u64`                     |
| `usize`                | `bigint`             | `size_t`                 | `usize`                   |
| `isize`                | `bigint`             | `size_t`                 | `isize`                   |
| `f32`                  | `number`             | `float`                  | `f32`                     |
| `f64`                  | `number`             | `double`                 | `f64`                     |
| `void`[1]              | `undefined`          | `void`                   | `()`                      |
| `pointer`              | `{} \| null`         | `void *`                 | `*mut c_void`             |
| `buffer`[2]            | `TypedArray \| null` | `uint8_t *`              | `*mut u8`                 |
| `function`[3]          | `{} \| null`         | `void (*fun)()`          | `Option<extern "C" fn()>` |
| `{ struct: [...] }`[4] | `TypedArray`         | `struct MyStruct`        | `MyStruct`                |

截至 Deno 1.25，`pointer` 类型已拆分为 `pointer` 和
`buffer` 类型，以确保用户能够利用 Typed Array 的优化；截至 Deno 1.31，`pointer` 的 JavaScript 表示已变为
不透明指针对象，空指针则为 `null`。

- [1] `void` 类型只能用作返回类型。
- [2] `buffer` 类型接受 TypedArray 作为参数，但当它作为返回类型时，
  它总是返回一个指针对象或 `null`，这一点与 `pointer` 类型相同。
- [3] `function` 类型作为参数类型和返回类型时，其工作方式与 `pointer` 类型完全相同。
- [4] `struct` 类型用于按值（复制）传递和返回 C 结构体。`struct` 数组必须按顺序列出结构体每个字段的类型。结构体会自动填充对齐：可以通过使用适当数量的 `u8` 字段来避免填充，从而定义紧凑结构体。只支持 TypedArray 作为结构体，并且结构体总是以 `Uint8Array` 的形式返回。

## 处理结构体

你可以在 FFI 代码中定义并使用 C 结构体：

```ts
// 为 Point 定义一个结构体类型
const pointStruct = {
  fields: {
    x: "f64",
    y: "f64",
  },
} as const;

// 定义库接口
const signatures = {
  distance: {
    parameters: [
      { struct: pointStruct },
      { struct: pointStruct },
    ],
    result: "f64",
  },
} as const;

// 创建结构体实例
const point1 = new Deno.UnsafePointer(
  new BigUint64Array([
    BigInt(Float64Array.of(1.0).buffer),
    BigInt(Float64Array.of(2.0).buffer),
  ]).buffer,
);

const point2 = new Deno.UnsafePointer(
  new BigUint64Array([
    BigInt(Float64Array.of(4.0).buffer),
    BigInt(Float64Array.of(6.0).buffer),
  ]).buffer,
);

// 使用结构体调用函数
const dist = dylib.symbols.distance(point1, point2);
```

## 处理回调

你可以将 JavaScript 函数作为回调传递给本地代码：

```ts
const signatures = {
  setCallback: {
    parameters: ["function"],
    result: "void",
  },
  runCallback: {
    parameters: [],
    result: "void",
  },
} as const;

// 创建回调函数
const callback = new Deno.UnsafeCallback(
  { parameters: ["i32"], result: "void" } as const,
  (value) => {
    console.log("收到回调：", value);
  },
);

// 将回调传递给本地库
dylib.symbols.setCallback(callback.pointer);

// 之后，这将触发我们的 JavaScript 函数
dylib.symbols.runCallback();

// 完成后始终清理资源
callback.close();
```

## FFI 最佳实践

1. 始终关闭资源。完成后使用 `dylib.close()` 关闭库，并使用 `callback.close()`
   关闭回调。

2. 优先使用 TypeScript。在处理
   FFI 时，使用 TypeScript 可获得更好的类型检查。

3. 将 FFI 调用包装在 try/catch 块中，以优雅地处理错误。

4. 使用 FFI 时务必格外小心，因为本地代码可以绕过 Deno 的
   安全沙箱。

5. 尽量保持 FFI 接口尽可能小，以减少攻击面。

## 示例

### 使用 Rust 库

下面是一个在 Deno 中创建并使用 Rust 库的示例：

首先，创建一个 Rust 库：

```rust
// lib.rs
#[unsafe(no_mangle)]
pub extern "C" fn fibonacci(n: u32) -> u32 {
  if n <= 1 {
    return n;
  }
  fibonacci(n - 1) + fibonacci(n - 2)
}
```

将其编译为动态库：

```sh
rustc --crate-type cdylib lib.rs
```

然后在 Deno 中使用它：

```ts
const libName = {
  windows: "./lib.dll",
  linux: "./liblib.so",
  darwin: "./liblib.dylib",
}[Deno.build.os];

const dylib = Deno.dlopen(
  libName,
  {
    fibonacci: { parameters: ["u32"], result: "u32" },
  } as const,
);

// 计算第 10 个斐波那契数
const result = dylib.symbols.fibonacci(10);
console.log(`Fibonacci(10) = ${result}`); // 55

dylib.close();
```

### 示例

- [Netsaur](https://github.com/denosaurs/netsaur/blob/c1efc3e2df6e2aaf4a1672590a404143203885a6/packages/core/src/backends/cpu/mod.ts)
- [WebView_deno](https://github.com/webview/webview_deno/blob/main/src/ffi.ts)
- [Deno_sdl2](https://github.com/littledivy/deno_sdl2/blob/main/mod.ts)
- [Deno FFI 示例仓库](https://github.com/denoffi/denoffi_examples)

这些由社区维护的仓库包含了在不同操作系统上与各种本地库集成的
可运行 FFI 示例。

## 本地代码集成的相关方式

虽然 Deno 的 FFI 提供了直接调用本地函数的方法，但还有其他
集成本地代码的方式：

### 在 Deno 中使用 Node-API（N-API）

Deno 支持 [Node-API (N-API)](https://nodejs.org/api/n-api.html)，以
兼容原生 Node.js addon。这使你能够使用为 Node.js 编写的现有
本地模块。

直接加载 Node-API addon：

```ts
import process from "node:process";
process.dlopen(module, "./native_module.node", 0);
```

使用依赖 Node-API addon 的 npm 包：

```ts
import someNativeAddon from "npm:some-native-addon";
console.log(someNativeAddon.doSomething());
```

这与 FFI 有何不同？

| **方面**  | **FFI**                | **Node-API 支持**                        |
| ----------- | ---------------------- | ------------------------------------------- |
| 设置       | 无需构建步骤           | 需要预编译二进制文件或构建步骤 |
| 可移植性   | 绑定到库 ABI           | 在不同版本间保持 ABI 稳定                  |
| 使用场景   | 直接库调用             | 复用 Node.js addon                        |

Node-API 支持非常适合利用现有的 Node.js 本地模块，
而 FFI 则最适合直接、轻量地调用本地库。

## FFI 的替代方案

在使用 FFI 之前，请考虑以下替代方案：

- [WebAssembly](/runtime/reference/wasm/)，用于在 Deno 沙箱内运行的可移植本地代码。
- 使用 [`Deno.command`](/api/deno/~/Deno.command) 在受控权限下执行外部二进制文件
  和子进程。
- 检查 [Deno 的原生 API](/api/deno) 是否已经提供了
  你需要的功能。

Deno 的 FFI 能力为本地代码提供了强大的集成方式，可实现
性能优化并访问系统级功能。然而，
这种能力伴随着重大的安全考量。使用 FFI 时务必谨慎，
并确保你信任所使用的本地库。
