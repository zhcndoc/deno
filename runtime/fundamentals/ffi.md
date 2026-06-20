---
last_modified: 2026-06-18
title: "外部函数接口（FFI）"
description: "了解如何使用 Deno 的外部函数接口（FFI）从 JavaScript 或 TypeScript 直接调用本地库。包含示例、最佳实践和安全注意事项。"
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
[`--allow-ffi`](/runtime/reference/permissions/#ffi-(foreign-function-interface))
标志显式授权，因为本地代码运行在 Deno 的安全沙箱之外：

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

## 加载库

[`Deno.dlopen()`](/api/deno/~/Deno.dlopen) 的第一个参数是动态库的路径。Deno 会将此路径交给操作系统的动态加载器（Linux 和 macOS 上是 `dlopen`，Windows 上是 `LoadLibrary`），因此文件的定位方式遵循操作系统规则，而不是 Deno 的模块解析规则。

指定库有两种方式：

- **带分隔符的路径**（例如 `"./libexample.so"` 或
  `"/usr/lib/libexample.so"`）会从该确切位置打开。像 `"./libexample.so"` 这样的 _相对_ 路径是相对于**进程的当前工作目录**解析的，而不是相对于你的 `.ts` 文件位置。这是“无法打开库”错误的常见来源：从不同目录运行同一个脚本会改变 Deno 的查找位置。
- **裸名称**，即不带分隔符的名称（例如 `"libexample.so"`），则由操作系统在其标准搜索路径中查找。在 Linux 上，这意味着 `LD_LIBRARY_PATH` 和系统缓存（如 `/usr/lib`）；在 macOS 上是 `DYLD_*` 路径；在 Windows 上是可执行文件所在目录、系统目录以及 `PATH`。对于已经系统级安装的库，请使用这种形式。

### 让路径相对于你的模块解析

如果你想加载与源文件放在一起的库，而不受当前工作目录影响，请使用 `import.meta.url` 来解析路径，而不是使用裸相对字符串：

```ts
// 始终指向位于此模块旁边的 libexample.so。
const path = new URL("./libexample.so", import.meta.url).pathname;

const dylib = Deno.dlopen(
  path,
  {
    add: { parameters: ["i32", "i32"], result: "i32" },
  } as const,
);
```

这种模式在由 [`deno compile`](/runtime/reference/cli/compile/) 生成的可执行文件中也同样适用（见下文）。

### 使用 `deno compile` 捆绑库

[`Deno.dlopen`](/api/deno/~/Deno.dlopen) 需要磁盘上的真实文件，因此动态库不会自动嵌入到编译后的二进制文件中。请使用 `--include` 标志显式包含它：

```sh
deno compile --allow-ffi --include libexample.so main.ts
```

运行时，Deno 会将包含的库解压到临时目录，并将 `import.meta.url` 指向那里，因此使用 `new URL("./libexample.so", import.meta.url).pathname` 解析其路径的模块（如上所示）能够找到打包后的副本，而生成的二进制文件也能在未安装该库的机器上运行。如果你不捆绑该库，可以将其与可执行文件一起分发，并通过相对于二进制文件的路径加载，或者依赖上面描述的系统搜索路径。

### 处理加载失败

当库无法加载或声明的符号缺失时，[`Deno.dlopen`](/api/deno/~/Deno.dlopen) 会同步抛出错误，因此请将调用包裹在 `try`/`catch` 中，以优雅地失败：

```ts
let dylib;
try {
  dylib = Deno.dlopen(
    "./libexample.so",
    {
      add: { parameters: ["i32", "i32"], result: "i32" },
    } as const,
  );
} catch (err) {
  // 文件缺失或不可读会报告 "Could not open library: ..."。
  // 缺失函数会报告 "Failed to register symbol <name>: ..."。
  console.error("加载本地库失败：", err.message);
  Deno.exit(1);
}
```

错误信息会区分这两种常见情况：文件本身无法打开（路径错误、文件缺失或架构不匹配），或者文件已加载但你声明的某个符号在其中未找到。

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
| `{ struct: [...] }[4]` | `TypedArray`         | `struct MyStruct`        | `MyStruct`                |

截至 Deno 1.25，`pointer` 类型已拆分为 `pointer` 和
`buffer` 类型，以确保用户能够利用 Typed Array 的优化；截至 Deno 1.31，`pointer` 的 JavaScript 表示已变为
不透明指针对象，空指针则为 `null`。

- [1] `void` 类型只能用作返回类型。
- [2] `buffer` 类型接受 TypedArray 作为参数，但当它作为返回类型时，
  它总是返回一个指针对象或 `null`，这一点与 `pointer` 类型相同。
- [3] `function` 类型作为参数类型和返回类型时，其工作方式与 `pointer` 类型完全相同。
- [4] `struct` 类型用于按值（复制）传递和返回 C 结构体。`struct` 数组必须按顺序列出结构体每个字段的类型。结构体会自动填充对齐：可以通过使用适当数量的 `u8` 字段来避免填充，从而定义紧凑结构体。只支持 TypedArray 作为结构体，并且结构体总是以 `Uint8Array` 的形式返回。

## 处理结构体

要按值传递或返回 C 结构体，请使用
`{ struct: [...] }` 描述其布局——这是一个按声明顺序列出每个字段 FFI 类型的数组。结构体值会以字节布局与 C 一致的
`TypedArray` 传递，而按值返回的结构体会以正确长度的
`Uint8Array` 返回。前面类型表中的 `struct` 数组就是权威的形状定义。

假设你有一个这样的小型 C 库，它操作一个二维 `Point`：

```c title="point.c"
typedef struct {
  double x;
  double y;
} Point;

double distance(Point a, Point b) {
  double dx = a.x - b.x;
  double dy = a.y - b.y;
  return __builtin_sqrt(dx * dx + dy * dy);
}

Point midpoint(Point a, Point b) {
  Point m;
  m.x = (a.x + b.x) / 2.0;
  m.y = (a.y + b.y) / 2.0;
  return m;
}
```

将其构建为共享库。编译器参数和输出文件名会因平台而异：

<deno-tabs group-id="operating-systems">
<deno-tab value="linux" label="Linux" default>

```sh
cc -shared -fPIC -O2 -o libpoint.so point.c
```

</deno-tab>
<deno-tab value="mac" label="macOS">

```sh
cc -dynamiclib -O2 -o libpoint.dylib point.c
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```sh
cl /LD /O2 point.c /Fe:point.dll
```

</deno-tab>
</deno-tabs>

然后在 Deno 中调用它，在 [`Deno.dlopen`](/api/deno/~/Deno.dlopen) 中使用适合你平台的文件名。请注意，`struct` 定义是按声明顺序排列的 _字段类型数组_，而不是带有命名字段的对象：

```ts title="point.ts"
// `Point` 对应 C 的 `struct Point { double x; double y; }`。
const Point = { struct: ["f64", "f64"] } as const;

const lib = Deno.dlopen(
  "./libpoint.so",
  {
    distance: { parameters: [Point, Point], result: "f64" },
    midpoint: { parameters: [Point, Point], result: Point },
  } as const,
);

// 构建与 C 布局匹配的 TypedArray 结构体值。
// 两个 f64 字段 → Float64Array 中的两个槽位。
const a = new Float64Array([1.0, 2.0]); // Point { x: 1.0, y: 2.0 }
const b = new Float64Array([4.0, 6.0]); // Point { x: 4.0, y: 6.0 }

// FFI 会读取底层字节，因此将 buffer 作为 Uint8Array 视图传入。
const aBytes = new Uint8Array(a.buffer);
const bBytes = new Uint8Array(b.buffer);

console.log("distance =", lib.symbols.distance(aBytes, bBytes));

// 按值返回的结构体会以与结构体大小相同的 Uint8Array 形式返回。
// 用 Float64Array 包装它，以读取回字段值。
const midBytes = lib.symbols.midpoint(aBytes, bBytes);
const mid = new Float64Array(midBytes.buffer);
console.log("midpoint =", { x: mid[0], y: mid[1] });

lib.close();
```

使用 `--allow-ffi` 权限运行它：

```sh
deno run --allow-ffi point.ts
```

你应该会看到：

```console
distance = 5
midpoint = { x: 2.5, y: 4 }
```

在处理结构体时，请记住以下几点：

- **布局与 C 编译器一致。** Deno 对结构体字段的填充方式与 C 编译器相同。如果你需要紧凑结构体，请像上面的类型表中所述那样，使用 `u8` 字段显式填充。
- **字段顺序按位置决定。** `struct` 数组只是一组类型，按照声明顺序排列——在 JavaScript 端没有字段名。你传入的 `TypedArray` 必须以相同顺序排列这些字段。
- **返回的结构体是字节。** 结构体结果始终是 `Uint8Array`；请通过合适的 `TypedArray`（或 `DataView`）来查看它，以读取字段。

## 使用回调

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
