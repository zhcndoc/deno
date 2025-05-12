---
title: "Deno Namespace APIs"
description: "A guide to Deno's built-in runtime APIs. Learn about file system operations, network functionality, permissions management, and other core capabilities available through the global Deno namespace."
oldUrl:
- /runtime/manual/runtime/
- /runtime/manual/runtime/builtin_apis/
- /runtime/manual/runtime/permission_apis/
- /runtime/manual/runtime/import_meta_api/
- /runtime/manual/runtime/ffi_api/
- /runtime/manual/runtime/program_lifecycle/
---

全局 `Deno` 命名空间包含不符合网络标准的 API，包括用于从文件读取、打开 TCP 套接字、提供 HTTP 服务和执行子进程等的 API。

<a href="/api/deno/" class="docs-cta runtime-cta">Explore all Deno APIs</a>

以下是一些重要的 Deno API 的高亮介绍。

## 文件系统

Deno 运行时提供
[处理文件和目录的各种函数](/api/deno/file-system)。
您需要使用 --allow-read 和 --allow-write 权限才能访问文件系统。

请参考以下链接获取如何使用文件系统函数的代码示例。

- [以流方式读取文件](/examples/file_server_tutorial/)
- [读取文本文件 (`Deno.readTextFile`)](/examples/reading_files/)
- [写入文本文件 (`Deno.writeTextFile`)](/examples/writing_files/)

## 网络

Deno 运行时提供
[用于处理网络端口连接的内置函数](/api/deno/network)。

请参考以下链接获取常用功能的代码示例。

- [连接到主机名和端口 (`Deno.connect`)](/api/deno/~/Deno.connect)
- [在本地传输地址上宣布 (`Deno.listen`)](/api/deno/~/Deno.listen)

## Subprocesses

The Deno runtime comes with
[built-in functions for spinning up subprocesses](/api/deno/subprocess).

Refer to the links below for code samples of how to create a subprocess.

- [Creating a subprocess (`Deno.Command`)](/runtime/tutorials/subprocess/)

## 错误

Deno 运行时提供 [20 种错误类](/api/deno/errors)，可根据多种条件引发。

一些示例为：

```sh
Deno.errors.NotFound;
Deno.errors.WriteZero;
```

它们可以如下使用：

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("未找到文件");
  } else {
    // 否则重新抛出
    throw error;
  }
}
```

## HTTP 服务器

Deno 有两个 HTTP 服务器 API：

- [`Deno.serve`](/api/deno/~/Deno.serve)：原生的、高级的，支持
  HTTP/1.1 和 HTTP2，这是在 Deno 中编写 HTTP 服务器的首选 API。
- [`Deno.serveHttp`](/api/deno/~/Deno.serveHttp)：原生的、底层的，支持
  HTTP/1.1 和 HTTP2。

要在给定端口上启动 HTTP 服务器，请使用 `Deno.serve` 函数。该函数接受一个处理函数，该函数将在每个传入请求时被调用，预计返回响应（或解析为响应的 Promise）。例如：

```ts
Deno.serve((_req) => {
  return new Response("你好，世界！");
});
```

默认情况下 `Deno.serve` 将监听端口 `8000`，但可以通过在选项包中传入一个端口号码作为第一个或第二个参数来更改。

您可以
[阅读有关如何使用 HTTP 服务器 API 的更多信息](/runtime/fundamentals/http_server/)。

## 权限

权限是在运行 `deno` 命令时从 CLI 授予的。用户代码通常会假定自己所需的权限集，但在执行期间，并不能保证**授予的**权限集与其一致。

在某些情况下，确保程序具备容错性需要与运行时的权限系统交互的方式。

### 权限描述符

在 CLI 中，`/foo/bar` 的读取权限表示为 `--allow-read=/foo/bar`。在运行时 JS 中，它表示为以下内容：

```ts
const desc = { name: "read", path: "/foo/bar" } as const;
```

其他示例：

```ts
// 全局写入权限。
const desc1 = { name: "write" } as const;

// 对 `$PWD/foo/bar` 的写入权限。
const desc2 = { name: "write", path: "foo/bar" } as const;

// 全局网络权限。
const desc3 = { name: "net" } as const;

// 对 127.0.0.1:8000 的网络权限。
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;

// 高分辨率时间权限。
const desc5 = { name: "hrtime" } as const;
```

有关更多详细信息，请参见 API 参考中的 [`PermissionDescriptor`](/api/deno/~/Deno.PermissionDescriptor)。对于以下描述的所有 API，均存在同步 API 对应版本（例如 `Deno.permissions.querySync`）。

### 查询权限

通过描述符检查某个权限是否被授予。

```ts
// deno run --allow-read=/foo main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "granted", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

如果使用 `--deny-read` 标志来限制某些文件路径，结果将包含 `partial: true`，表示并未授予所有子路径的权限：

```ts
// deno run --allow-read=/foo --deny-read=/foo/bar main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: true }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "denied", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

### 权限状态

权限状态可以是 “granted”、“prompt” 或 “denied”。从 CLI 授予的权限查询将返回 `{ state: "granted" }`。那些未被授予的权限查询将默认返回 `{ state: "prompt" }`，而 `{ state: "denied" }` 则保留给那些被明确拒绝的权限。在 [请求权限](#request-permissions) 中将会遇到这一点。

### 权限强度

在 [查询权限](#query-permissions) 中第二次查询的结果的直观理解是，读取权限被授予给 `/foo` 且 `/foo/bar` 在 `/foo` 之内，所以允许读取 `/foo/bar`。这适用于，除非 CLI 授予的权限对查询的权限是 _partial_（是使用 `--deny-*` 标志的效果）。

我们还可以说 `desc1` 是 _比_ `desc2` 更 _强的_。这意味着对于任何一组 CLI 授予的权限：

1. 如果 `desc1` 查询返回 `{ state: "granted", partial: false }`，则 `desc2` 也必须如此。
2. 如果 `desc2` 查询返回 `{ state: "denied", partial: false }`，则 `desc1` 也必须如此。

更多示例：

```ts
const desc1 = { name: "write" } as const;
// 比较强
const desc2 = { name: "write", path: "/foo" } as const;

const desc3 = { name: "net", host: "127.0.0.1" } as const;
// 比较强
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;
```

### 请求权限

通过 CLI 提示请求未授予的权限。

```ts
// deno run main.ts

const desc1 = { name: "read", path: "/foo" } as const;
const status1 = await Deno.permissions.request(desc1);
// ⚠️ Deno 请求对 "/foo" 的读取权限。允许吗？[y/n (y = 是，允许，n = 否，拒绝)] y
console.log(status1);
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/bar" } as const;
const status2 = await Deno.permissions.request(desc2);
// ⚠️ Deno 请求对 "/bar" 的读取权限。允许吗？[y/n (y = 是，允许，n = 否，拒绝)] n
console.log(status2);
// PermissionStatus { state: "denied", partial: false }
```

如果当前权限状态为 "prompt"，将会在用户的终端中出现一个提示，询问他们是否希望授予请求。`desc1` 的请求被授予，因此其新状态返回并且执行将继续，就像在 CLI 中指定了 `--allow-read=/foo` 一样。`desc2` 的请求被拒绝，因此其权限状态从 "prompt" 降级为 "denied"。

如果当前权限状态已经是 "granted" 或 "denied"，则请求将表现得像查询一样，仅返回当前状态。这可以防止对于已经授予的权限和之前被拒绝的请求出现提示。

### 撤销权限

将权限从 "granted" 降级为 "prompt"。

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
```

当您尝试撤销一个 _部分_ 授予的权限时，会发生什么？

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
const cliDesc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(cliDesc));
// PermissionStatus { state: "prompt", partial: false }
```

CLI 授予的权限，这隐含了被撤销的权限，也被撤销。

要理解这种行为，想象 Deno 存储了一组 _显式授予的权限描述符_。在 CLI 上指定 `--allow-read=/foo,/bar` 时，初始化这一组为：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
];
```

为 `{ name: "write", path: "/foo" }` 的运行时请求授予将更新这一组为：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
  { name: "write", path: "/foo" },
];
```

Deno 的权限撤销算法通过删除该组中每个 _比_ 参数权限描述符更 _强的_ 元素来工作。

Deno 不允许存在 “分片” 权限状态，其中某个强权限被授予而其隐含的弱权限被排除。这样的系统在考虑更广泛的用例和 “denied” 状态时将变得越来越复杂且不可预测。这是对安全性的一个经过计算的粒度权衡。

## import.meta

Deno 支持 [`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta) API 上的一系列属性和方法。它可用于获取有关模块的信息，例如模块的 URL。

### import.meta.url

返回当前模块的 URL。

```ts title="main.ts"
console.log(import.meta.url);
```

```sh
$ deno run main.ts
file:///dev/main.ts

$ deno run https:/example.com/main.ts
https://example.com/main.ts
```

### import.meta.main

返回当前模块是否是程序的入口点。

```ts title="main.ts"
import "./other.ts";

console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```ts title="other.ts"
console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```sh
$ deno run main.ts
Is file:///dev/other.ts the main module? false
Is file:///dev/main.ts the main module? true
```

### import.meta.filename

_此属性仅适用于本地模块（具有 `file:///...` 说明的模块），并且对远程模块返回 `undefined`。_

返回当前模块的完全解析路径。该值包含操作系统特定的路径分隔符。

```ts title="main.ts"
console.log(import.meta.filename);
```

在 Unix 上：

```sh
$ deno run main.ts
/dev/main.ts

$ deno run https://example.com/main.ts
undefined
```

在 Windows 上：

```sh
$ deno run main.ts
C:\dev\main.ts

$ deno run https://example.com/main.ts
undefined
```

### import.meta.dirname

_此属性仅适用于本地模块（具有 `file:///...` 说明的模块），并且对远程模块返回 `undefined`。_

返回当前模块所在目录的完全解析路径。该值包含操作系统特定的路径分隔符。

```ts title="main.ts"
console.log(import.meta.dirname);
```

在 Unix 上：

```sh
$ deno run main.ts
/dev/

$ deno run https://example.com/main.ts
undefined
```

在 Windows 上：

```sh
$ deno run main.ts
C:\dev\

$ deno run https://example.com/main.ts
undefined
```

### import.meta.resolve

解析相对于当前模块的说明符。

```ts
const worker = new Worker(import.meta.resolve("./worker.ts"));
```

`import.meta.resolve` API 考虑当前应用的导入映射，这使您能够解析 “裸” 说明符。

加载这样的导入映射后……

```json
{
  "imports": {
    "fresh": "https://deno.land/x/fresh@1.0.1/dev.ts"
  }
}
```

……您现在可以解析：

```js title="resolve.js"
console.log(import.meta.resolve("fresh"));
```

```sh
$ deno run resolve.js
https://deno.land/x/fresh@1.0.1/dev.ts
```

## FFI

FFI（外国函数接口）API 允许用户调用以支持 C ABI（C/C++、Rust、Zig、V 等）编写的库，使用 `Deno.dlopen`。

以下是一个展示如何从 Deno 调用 Rust 函数的示例：

```rust
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

将其编译为一个 C 动态库（在 Linux 上为 `libadd.so`）：

```sh
rustc --crate-type cdylib add.rs
```

在 C 中，您可以写成：

```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

并编译它：

```sh
// unix
cc -c -o add.o add.c
cc -shared -W -o libadd.so add.o
// Windows
cl /LD add.c /link /EXPORT:add
```

从 Deno 调用该库：

```typescript
// ffi.ts

// 根据您的操作系统确定库后缀。
let libSuffix = "";
switch (Deno.build.os) {
  case "windows":
    libSuffix = "dll";
    break;
  case "darwin":
    libSuffix = "dylib";
    break;
  default:
    libSuffix = "so";
    break;
}

const libName = `./libadd.${libSuffix}`;
// 打开库并定义导出符号
const dylib = Deno.dlopen(
  libName,
  {
    "add": { parameters: ["isize", "isize"], result: "isize" },
  } as const,
);

// 调用符号 `add`
const result = dylib.symbols.add(35, 34); // 69

console.log(`外部加法 35 和 34 的结果：${result}`);
```

运行时使用 `--allow-ffi` 和 `--unstable` 标志：

```sh
deno run --allow-ffi --unstable ffi.ts
```

### 非阻塞 FFI

在许多用例中，用户可能希望在后台运行 CPU 密集型的 FFI 函数而不阻塞主线程上的其他任务。

自 Deno 1.15 起，符号可以在 `Deno.dlopen` 中标记为 `nonblocking`。这些函数调用将在专用的阻塞线程上运行，并返回一个 Promise，解析为所需的结果。

以下是使用 Deno 执行耗时 FFI 调用的示例：

```c
// sleep.c
#ifdef _WIN32
#include <Windows.h>
#else
#include <time.h>
#endif

int sleep(unsigned int ms) {
  #ifdef _WIN32
  Sleep(ms);
  #else
  struct timespec ts;
  ts.tv_sec = ms / 1000;
  ts.tv_nsec = (ms % 1000) * 1000000;
  nanosleep(&ts, NULL);
  #endif
}
```

从 Deno 调用它：

```typescript
// nonblocking_ffi.ts
const library = Deno.dlopen(
  "./sleep.so",
  {
    sleep: {
      parameters: ["usize"],
      result: "void",
      nonblocking: true,
    },
  } as const,
);

library.symbols.sleep(500).then(() => console.log("完成之后"));
console.log("完成之前");
```

结果：

```sh
$ deno run --allow-ffi --unstable nonblocking_ffi.ts
完成之前
完成之后
```

### 回调

Deno FFI API 支持从 JavaScript 函数创建 C 回调，以便从动态库回调到 Deno。以下是创建和使用回调的示例：

```typescript
// callback_ffi.ts
const library = Deno.dlopen(
  "./callback.so",
  {
    set_status_callback: {
      parameters: ["function"],
      result: "void",
    },
    start_long_operation: {
      parameters: [],
      result: "void",
    },
    check_status: {
      parameters: [],
      result: "void",
    },
  } as const,
);

const callback = new Deno.UnsafeCallback(
  {
    parameters: ["u8"],
    result: "void",
  } as const,
  (success: number) => {},
);

// 将回调指针传递给动态库
library.symbols.set_status_callback(callback.pointer);
// 开始一些不阻塞线程的长操作
library.symbols.start_long_operation();

// 过后，触发库检查操作是否完成。
// 如果完成了，这次调用将触发回调。
library.symbols.check_status();
```

如果 `UnsafeCallback` 的回调函数抛出错误，该错误将被传播到触发回调的函数（在上面是 `check_status()`），并可以在那里捕获。如果一个返回值的回调抛出错误，Deno 将返回 0（对于指针为 null 指针）。

`UnsafeCallback` 默认不被释放，因为这可能导致使用后释放错误。要正确处置 `UnsafeCallback`，必须调用其 `close()` 方法。

```typescript
const callback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" } as const,
  () => {},
);

// 在回调不再需要后
callback.close();
// 现在再传递回调作为参数是不安全的。
```

原生库也可以设置中断处理程序，并直接触发回调。但这不建议使用，可能导致意外的副作用和未定义的行为。优先考虑任何中断处理程序仅设置一个标志，稍后可以通过类似于上面 `check_status()` 的方式进行轮询。

### 支持的类型

以下是 Deno FFI API 当前支持的类型列表。

| FFI 类型               | Deno                 | C                        | Rust                      |
| ---------------------- | ------------------- | ------------------------ | ------------------------- |
| `i8`                   | `number`            | `char` / `signed char`   | `i8`                      |
| `u8`                   | `number`            | `unsigned char`          | `u8`                      |
| `i16`                  | `number`            | `short int`              | `i16`                     |
| `u16`                  | `number`            | `unsigned short int`     | `u16`                     |
| `i32`                  | `number`            | `int` / `signed int`     | `i32`                     |
| `u32`                  | `number`            | `unsigned int`           | `u32`                     |
| `i64`                  | `bigint`            | `long long int`          | `i64`                     |
| `u64`                  | `bigint`            | `unsigned long long int` | `u64`                     |
| `usize`                | `bigint`            | `size_t`                 | `usize`                   |
| `isize`                | `bigint`            | `size_t`                 | `isize`                   |
| `f32`                  | `number`            | `float`                  | `f32`                     |
| `f64`                  | `number`            | `double`                 | `f64`                     |
| `void`[1]              | `undefined`         | `void`                   | `()`                      |
| `pointer`              | `{} \| null`        | `void *`                 | `*mut c_void`             |
| `buffer`[2]            | `TypedArray \| null`| `uint8_t *`              | `*mut u8`                 |
| `function`[3]          | `{} \| null`        | `void (*fun)()`          | `Option<extern "C" fn()>` |
| `{ struct: [...] }`[4] | `TypedArray`        | `struct MyStruct`        | `MyStruct`                |

自 Deno 1.25 起，`pointer` 类型已分为 `pointer` 和 `buffer` 类型，以确保用户利用 Typed Arrays 的优化，自 Deno 1.31 起，`pointer` 的 JavaScript 表示已变为不透明指针对象或空指针的 `null`。

- [1] `void` 类型仅可以用作结果类型。
- [2] `buffer` 类型接受 TypedArrays 作为参数，但当用作结果类型时通常返回指针对象或 `null`，类似于 `pointer` 类型。
- [3] `function` 类型在参数和结果类型上与 `pointer` 类型完全相同。
- [4] `struct` 类型用于按值（复制）传递和返回 C 结构体。`struct` 数组必须按顺序列出每个结构体字段的类型。结构体会自动填充：可以通过使用适当数量的 `u8` 字段来避免填充定义紧凑的结构体。仅支持 TypedArrays 用作结构体，并且结构体始终返回为 `Uint8Array`。

### deno_bindgen

[`deno_bindgen`](https://github.com/denoland/deno_bindgen) 是官方工具，用于简化用 Rust 编写的 Deno FFI 库的粘合代码生成。

它类似于 Rust Wasm 生态系统中的 [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen)。

以下是一个展示其用法的示例：

```rust
// mul.rs
use deno_bindgen::deno_bindgen;

#[deno_bindgen]
struct Input {
  a: i32,
  b: i32,
}

#[deno_bindgen]
fn mul(input: Input) -> i32 {
  input.a * input.b
}
```

运行 `deno_bindgen` 生成绑定。您现在可以直接将它们导入到 Deno 中：

```ts
// mul.ts
import { mul } from "./bindings/bindings.ts";
mul({ a: 10, b: 2 }); // 20
```

与 `deno_bindgen` 相关的任何问题应报告至 https://github.com/denoland/deno_bindgen/issues

## 程序生命周期

Deno 支持与浏览器兼容的生命周期事件：

- [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#:~:text=The%20load%20event%20is%20fired,for%20resources%20to%20finish%20loading.)：
  在整个页面加载完成时触发，包括所有依赖资源，例如样式表和图像。
- [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#:~:text=The%20beforeunload%20event%20is%20fired,want%20to%20leave%20the%20page.)：
  当事件循环没有更多工作要做并即将退出时触发。调度更多异步工作（如定时器或网络请求）将导致程序继续。
- [`unload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event)：
  当文档或子资源正在卸载时触发。
- [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)：
  当未处理的 promise 被拒绝时触发，即一个没有 `.catch()` 处理程序或 `.then()` 的第二个参数的 promise。
- [`rejectionhandled`](https://developer.mozilla.org/en-US/docs/Web/API/Window/rejectionhandled_event)：
  当 `.catch()` 处理程序被添加到一个已经被拒绝的 promise 时触发。仅当安装了 `unhandledrejection` 监听器以防止事件传播时（这会导致程序以错误终止）才触发此事件。

您可以使用这些事件为程序提供设置和清理代码。

`load` 事件的监听器可以是异步的并将被等待，这个事件无法被取消。`beforeunload` 监听器需要是同步的，可以被取消以保持程序运行。`unload` 事件的监听器需要是同步的且不能被取消。

**main.ts**

```ts title="main.ts"
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`在事件处理程序 (main) 中获得了 ${e.type} 事件`);
};

globalThis.addEventListener("load", handler);

globalThis.addEventListener("beforeunload", handler);

globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`在 onload 函数 (main) 中获得了 ${e.type} 事件`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`在 onbeforeunload 函数 (main) 中获得了 ${e.type} 事件`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`在 onunload 函数 (main) 中获得了 ${e.type} 事件`);
};

console.log("来自主脚本的日志");
```

```ts title="imported.ts"
const handler = (e: Event): void => {
  console.log(`在事件处理程序 (imported) 中获得了 ${e.type} 事件`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`在 onload 函数 (imported) 中获得了 ${e.type} 事件`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`在 onbeforeunload 函数 (imported) 中获得了 ${e.type} 事件`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`在 onunload 函数 (imported) 中获得了 ${e.type} 事件`);
};

console.log("来自导入脚本的日志");
```

此示例的一些说明：

- `addEventListener` 和 `onload`/`onunload` 使用 `globalThis` 前缀，但您也可以使用 `self` 或者根本不使用前缀。 
  [不建议使用 `window` 作为前缀](https://docs.deno.com/lint/rules/no-window-prefix)。
- 您可以使用 `addEventListener` 和/或 `onload`/`onunload` 为事件定义处理程序。它们之间存在重大差异，让我们运行示例：

```shell
$ deno run main.ts
来自导入脚本的日志
来自主脚本的日志
在事件处理程序 (imported) 中获得了 load 事件
在事件处理程序 (main) 中获得了 load 事件
在 onload 函数 (main) 中获得了 load 事件
在事件处理程序 (imported) 中获得了 onbeforeunload 事件
在事件处理程序 (main) 中获得了 onbeforeunload 事件
在 onbeforeunload 函数 (main) 中获得了 onbeforeunload 事件
在事件处理程序 (imported) 中获得了 unload 事件
在事件处理程序 (main) 中获得了 unload 事件
在 onunload 函数 (main) 中获得了 unload 事件
```

所有通过 `addEventListener` 注册的监听器都会被调用，但在 `main.ts` 中定义的 `onload`、`onbeforeunload` 和 `onunload` 处理程序会覆盖在 `imported.ts` 中定义的处理程序。

换句话说，您可以使用 `addEventListener` 注册多个 `"load"` 或 `"unload"` 事件处理程序，但只有最后定义的 `onload`、`onbeforeunload`、`onunload` 事件处理程序会被执行。由于这个原因，建议尽可能使用 `addEventListener`。

### beforeunload

```js
// beforeunload.js
let count = 0;

console.log(count);

globalThis.addEventListener("beforeunload", (e) => {
  console.log("即将退出...");
  if (count < 4) {
    e.preventDefault();
    console.log("调度更多工作...");
    setTimeout(() => {
      console.log(count);
    }, 100);
  }

  count++;
});

globalThis.addEventListener("unload", (e) => {
  console.log("退出中");
});

count++;
console.log(count);

setTimeout(() => {
  count++;
  console.log(count);
}, 100);
```

运行此程序将输出：

```sh
$ deno run beforeunload.js
0
1
2
即将退出...
调度更多工作...
3
即将退出...
调度更多工作...
4
即将退出...
退出中
```

### 未处理的拒绝事件

当未处理的 promise 被拒绝时触发此事件，即没有拒绝处理程序的 promise，例如没有 `.catch()` 处理程序或 `.then()` 的第二个参数的 promise。

```js
// unhandledrejection.js
globalThis.addEventListener("unhandledrejection", (e) => {
  console.log("未处理的拒绝发生在:", e.promise, "原因:", e.reason);
  e.preventDefault();
});

function Foo() {
  this.bar = Promise.reject(new Error("条目不可用"));
}

new Foo();
Promise.reject();
```

运行此程序将输出：

```sh
$ deno run unhandledrejection.js
未处理的拒绝发生在: Promise { <rejected> Error: 条目不可用 } 原因: Error: 条目不可用
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
未处理的拒绝发生在: Promise { <rejected> undefined } 原因: undefined
```
