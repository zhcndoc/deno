---
title: "Deno 命名空间 API"
description: "Deno 内置运行时 API 指南。了解通过全局 Deno 命名空间可用的文件系统操作、网络功能、权限管理以及其他核心功能。"
layout: doc.tsx
oldUrl:
  - /runtime/manual/runtime/
  - /runtime/manual/runtime/builtin_apis/
  - /runtime/manual/runtime/permission_apis/
  - /runtime/manual/runtime/import_meta_api/
  - /runtime/manual/runtime/ffi_api/
  - /runtime/manual/runtime/program_lifecycle/
  - /runtime/reference/deno_namespace_apis/
---

全局的 `Deno` 命名空间包含非 Web 标准的 API，
包括用于读取文件、打开 TCP 套接字、提供 HTTP 服务和执行子进程等 API。

## API 文档

本节提供通过全局 `Deno` 命名空间可用的所有 Deno 特定 API 的完整文档。
你可以[浏览所有符号](/api/deno/all_symbols)查看所有可用 API 列表，或根据类别进行搜索。
点击任何函数或接口，将显示包含示例的详细文档。

以下突出介绍了一些最重要的 Deno API。

## 文件系统

Deno 运行时附带了
[多种用于操作文件和目录的函数](/api/deno/file-system)。
你需要使用 `--allow-read` 和 `--allow-write` 权限以访问文件系统。

请参阅以下链接，了解如何使用文件系统函数的代码示例。

- [通过流读取文件](/examples/file_server_tutorial/)
- [读取文本文件（`Deno.readTextFile`）](/examples/reading_files/)
- [写入文本文件（`Deno.writeTextFile`）](/examples/writing_files/)

## 网络

Deno 运行时附带了
[处理网络端口连接的内置函数](/api/deno/network)。

请参阅以下链接，了解常用函数的代码示例。

- [连接到主机名和端口（`Deno.connect`）](/api/deno/~/Deno.connect)
- [在本地传输地址上监听（`Deno.listen`）](/api/deno/~/Deno.listen)

实用网络功能示例：

- [HTTP 服务器：Hello world](/examples/http_server/)
- [HTTP 服务器：路由](/examples/http_server_routing/)
- [TCP 回显服务器](/examples/tcp_echo_server/)
- [WebSockets 示例](/examples/http_server_websocket/)
- [使用 WebSockets 构建聊天应用教程](/examples/chat_app_tutorial/)

## 子进程

Deno 运行时附带了
[用于启动子进程的内置函数](/api/deno/subprocess)。

请参阅以下链接，了解如何创建子进程的代码示例。

- [创建子进程（`Deno.Command`）](/examples/subprocess_tutorial/)
- [收集子进程输出](/examples/subprocesses_output/)

## 错误

Deno 运行时提供了 [20 个错误类](/api/deno/errors)，
可用于响应多种情况。

例如：

```sh
Deno.errors.NotFound;
Deno.errors.WriteZero;
```

使用示例：

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("文件未找到");
  } else {
    // 其他情况重新抛出
    throw error;
  }
}
```

## HTTP 服务器

Deno 提供两个 HTTP 服务器 API：

- [`Deno.serve`](/api/deno/~/Deno.serve)：原生的、_高级_，支持 HTTP/1.1 和 HTTP/2，
  是在 Deno 中编写 HTTP 服务器的首选 API。
- [`Deno.serveHttp`](/api/deno/~/Deno.serveHttp)：原生的、_低级_，支持 HTTP/1.1 和 HTTP/2。

要在指定端口启动 HTTP 服务器，请使用 `Deno.serve` 函数。
该函数接收一个处理函数，对每个传入请求调用，期望返回响应（或解析为响应的 Promise）。
例如：

```ts
Deno.serve((_req) => {
  return new Response("Hello, World!");
});
```

默认情况下，`Deno.serve` 监听端口 `8000`，但可通过选项对象的第一个或第二个参数传入端口号修改。

你可以
[阅读更多 HTTP 服务器 API 的使用说明](/runtime/fundamentals/http_server/)。

HTTP 服务器实用示例：

- [简单文件服务器教程](/examples/file_server_tutorial/)
- [HTTP 服务器提供文件服务](/examples/http_server_files/)
- [带流式处理的 HTTP 服务器](/examples/http_server_streaming/)
- [HTTP 服务器 WebSockets](/examples/http_server_websocket/)

## 权限

权限由 CLI 运行 `deno` 命令时授予。
用户代码通常假设自身具备一套必需的权限，但执行时不能保证**已授予**的权限集与之匹配。

某些情况下，确保容错程序需要在运行时与权限系统交互。

### 权限描述符

命令行中，`/foo/bar` 的读取权限表示为 `--allow-read=/foo/bar`。
在运行时 JS 中表示为：

```ts
const desc = { name: "read", path: "/foo/bar" } as const;
```

其他示例：

```ts
// 全局写入权限。
const desc1 = { name: "write" } as const;

// 写入权限针对 `$PWD/foo/bar`。
const desc2 = { name: "write", path: "foo/bar" } as const;

// 全局网络权限。
const desc3 = { name: "net" } as const;

// 网络权限针对 127.0.0.1:8000。
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;

// 高精度时间权限。
const desc5 = { name: "hrtime" } as const;
```

更多细节参见 API 参考中的[`PermissionDescriptor`](/api/deno/~/Deno.PermissionDescriptor)。
下面描述的所有 API 都有同步版本（如 `Deno.permissions.querySync`）。

### 查询权限

根据描述符检查权限是否被授予。

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

使用 `--deny-read` 限制某些文件路径时，结果会包含 `partial: true`，
表示未完全授予所有子路径权限：

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

权限状态为 `"granted"`、`"prompt"` 或 `"denied"`。

- 从 CLI 授予的权限查询结果是 `{ state: "granted" }`。
- 未授予的默认查询为 `{ state: "prompt" }`。
- 显式拒绝的权限状态为 `{ state: "denied" }`。
后者将在[请求权限](#request-permissions)部分详细介绍。

### 权限强度

第二个查询结果的直观理解是，读取访问权授予了 `/foo`，
且 `/foo/bar` 位置于 `/foo` 之内，因此 `/foo/bar` 也允许读取。
该原则成立，除非 CLI 授予的权限对于查询的权限是 _部分的_（使用 `--deny-*` 标志的结果）。

我们也可以说 `desc1` 比 `desc2` _[更强](https://www.w3.org/TR/permissions/#ref-for-permissiondescriptor-stronger-than)_。
这意味着对于任何一组 CLI 授予的权限：

1. 如果 `desc1` 查询到 `{ state: "granted", partial: false }`，
   则 `desc2` 也必须是。
2. 如果 `desc2` 查询到 `{ state: "denied", partial: false }`，
   则 `desc1` 也必须是。

更多示例：

```ts
const desc1 = { name: "write" } as const;
// 比以下权限更强
const desc2 = { name: "write", path: "/foo" } as const;

const desc3 = { name: "net", host: "127.0.0.1" } as const;
// 比以下权限更强
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;
```

### 请求权限

通过 CLI 提示向用户请求未授予的权限。

```ts
// deno run main.ts

const desc1 = { name: "read", path: "/foo" } as const;
const status1 = await Deno.permissions.request(desc1);
// ⚠️ Deno 请求读取 "/foo" 权限。允许？[y/n (y = 允许, n = 拒绝)] y
console.log(status1);
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/bar" } as const;
const status2 = await Deno.permissions.request(desc2);
// ⚠️ Deno 请求读取 "/bar" 权限。允许？[y/n (y = 允许, n = 拒绝)] n
console.log(status2);
// PermissionStatus { state: "denied", partial: false }
```

如果当前权限状态是 `"prompt"`，终端会出现提示，询问用户是否授予权限。
`desc1` 的请求被授予，返回新的状态，执行继续，仿佛 CLI 中指定了 `--allow-read=/foo`。
`desc2` 的请求被拒绝，状态从 `"prompt"` 降级为 `"denied"`。

如果当前权限状态已经是 `"granted"` 或 `"denied"`，请求将表现为查询，直接返回当前状态。
这避免了已授予或已拒绝的请求再次弹出提示。

### 撤销权限

将权限状态从 `"granted"` 降级为 `"prompt"`。

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
```

尝试撤销 CLI 授予权限的 _部分_ 权限时会发生什么？

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
const cliDesc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(cliDesc));
// PermissionStatus { state: "prompt", partial: false }
```

CLI 授予并暗示被撤销权限的权限也被撤销。

理解该行为的方式是，Deno 内部存储了一组 _显式授予的权限描述符_。
CLI 指定 `--allow-read=/foo,/bar` 初始化为：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
];
```

运行时授予 `{ name: "write", path: "/foo" }` 更新为：

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
  { name: "write", path: "/foo" },
];
```

Deno 的权限撤销算法会去除所有 _比传入权限描述符更强的_ 元素。

Deno 不允许存在“碎片权限”状态，即强权限授予时排除了其暗示的弱权限。
随着更多用例和 `"denied"` 状态的加入，此系统将变得复杂且不可预测。
这是为安全性权衡而牺牲的粒度。

## import.meta

Deno 支持 [`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta) API 的多个属性和方法，
可用于获取模块信息，如模块 URL。

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

返回当前模块是否为程序入口点。

```ts title="main.ts"
import "./other.ts";

console.log(`模块 ${import.meta.url} 是否为主模块？`, import.meta.main);
```

```ts title="other.ts"
console.log(`模块 ${import.meta.url} 是否为主模块？`, import.meta.main);
```

```sh
$ deno run main.ts
模块 file:///dev/other.ts 是否为主模块？ false
模块 file:///dev/main.ts 是否为主模块？ true
```

### import.meta.filename

_此属性仅对本地模块（`file:///...` 指定符）有效，远程模块返回 `undefined`。_

返回当前模块的完整解析路径，包含操作系统特定的路径分隔符。

```ts title="main.ts"
console.log(import.meta.filename);
```

Unix 系统：

```sh
$ deno run main.ts
/dev/main.ts

$ deno run https://example.com/main.ts
undefined
```

Windows 系统：

```sh
$ deno run main.ts
C:\dev\main.ts

$ deno run https://example.com/main.ts
undefined
```

### import.meta.dirname

_此属性仅对本地模块（`file:///...` 指定符）有效，远程模块返回 `undefined`。_

返回包含当前模块目录的完整解析路径，包含操作系统特定的路径分隔符。

```ts title="main.ts"
console.log(import.meta.dirname);
```

Unix 系统：

```sh
$ deno run main.ts
/dev/

$ deno run https://example.com/main.ts
undefined
```

Windows 系统：

```sh
$ deno run main.ts
C:\dev\

$ deno run https://example.com/main.ts
undefined
```

### import.meta.resolve

相对于当前模块解析指定符。

```ts
const worker = new Worker(import.meta.resolve("./worker.ts"));
```

`import.meta.resolve` API 会考虑当前应用的导入映射，使你能够解析“裸”指定符。

假设加载了如下导入映射...

```json
{
  "imports": {
    "fresh": "https://deno.land/x/fresh@1.0.1/dev.ts"
  }
}
```

你现在可以解析：

```js title="resolve.js"
console.log(import.meta.resolve("fresh"));
```

```sh
$ deno run resolve.js
https://deno.land/x/fresh@1.0.1/dev.ts
```

## FFI

FFI（外部函数接口）API 允许用户调用支持 C ABI 的原生语言库（如 C/C++、Rust、Zig、V 等），通过 `Deno.dlopen` 实现。

以下示例展示如何从 Deno 调用 Rust 函数：

```rust
// add.rs
#[unsafe(no_mangle)]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

编译为 C 动态库（Linux 下为 `libadd.so`）：

```sh
rustc --crate-type cdylib add.rs
```

用 C 语言代码实现：

```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

并编译：

```sh
// unix
cc -c -o add.o add.c
cc -shared -W -o libadd.so add.o
// Windows
cl /LD add.c /link /EXPORT:add
```

从 Deno 调用库：

```typescript
// ffi.ts

// 根据操作系统确定库后缀名。
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

console.log(`来自外部对 35 和 34 加法的结果: ${result}`);
```

带 `--allow-ffi` 和 `--unstable` 标志运行：

```sh
deno run --allow-ffi ffi.ts
```

### 非阻塞 FFI

许多用例中，用户可能希望在后台运行 CPU 密集型 FFI 函数，而不阻塞主线程的其他任务。

从 Deno 1.15 起，可在 `Deno.dlopen` 中标记符号为 `nonblocking`。
此类函数调用将在专用阻塞线程上运行，并返回解析所需结果的 `Promise`。

示例：用 Deno 执行耗时 FFI 调用：

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

从 Deno 调用：

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

library.symbols.sleep(500).then(() => console.log("After"));
console.log("Before");
```

结果：

```sh
$ deno run --allow-ffi unblocking_ffi.ts
Before
After
```

### 回调函数

Deno FFI API 支持从 JavaScript 函数创建 C 回调，以供动态库回调调用 Deno。
以下示例展示如何创建并使用回调：

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

// 将回调指针传入动态库
library.symbols.set_status_callback(callback.pointer);
// 启动不会阻塞线程的长操作
library.symbols.start_long_operation();

// 稍后触发库检测操作是否完成。
// 若完成，该调用会触发回调。
library.symbols.check_status();
```

若 `UnsafeCallback` 的回调函数抛出错误，该错误会传播回触发回调的函数（如上述的 `check_status()`），且可在那里捕获。
若抛出错误的回调函数有返回值，Deno 将返回 0（指针类型为 null 指针）。

`UnsafeCallback` 默认不会被释放，以避免使用后释放（use-after-free）错误。
正确释放 `UnsafeCallback` 应调用其 `close()` 方法。

```typescript
const callback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" } as const,
  () => {},
);

// 当回调不再需要时
callback.close();
// 此后不再安全将该回调作为参数传递。
```

本地库也可设置中断处理器，直接触发回调。
但不推荐这样做，可能导致意外副作用和未定义行为。
建议中断处理器仅设置标志，稍后使用轮询方式检测完成情况，类似上面 `check_status()` 的使用方法。

### 支持的类型

下面列出了当前 Deno FFI API 支持的类型。

| FFI 类型               | Deno 类型            | C 类型                     | Rust 类型                 |
| ---------------------- | -------------------- | -------------------------- | ------------------------- |
| `i8`                   | `number`             | `char` / `signed char`     | `i8`                      |
| `u8`                   | `number`             | `unsigned char`            | `u8`                      |
| `i16`                  | `number`             | `short int`                | `i16`                     |
| `u16`                  | `number`             | `unsigned short int`       | `u16`                     |
| `i32`                  | `number`             | `int` / `signed int`       | `i32`                     |
| `u32`                  | `number`             | `unsigned int`             | `u32`                     |
| `i64`                  | `bigint`             | `long long int`            | `i64`                     |
| `u64`                  | `bigint`             | `unsigned long long int`   | `u64`                     |
| `usize`                | `bigint`             | `size_t`                   | `usize`                   |
| `isize`                | `bigint`             | `size_t`                   | `isize`                   |
| `f32`                  | `number`             | `float`                    | `f32`                     |
| `f64`                  | `number`             | `double`                   | `f64`                     |
| `void`[1]              | `undefined`          | `void`                     | `()`                      |
| `pointer`              | `{}` \| `null`       | `void *`                   | `*mut c_void`             |
| `buffer`[2]            | `TypedArray \| null` | `uint8_t *`                | `*mut u8`                 |
| `function`[3]          | `{}` \| `null`       | `void (*fun)()`            | `Option<extern "C" fn()>` |
| `{ struct: [...] }`[4] | `TypedArray`         | `struct MyStruct`          | `MyStruct`                |

自 Deno 1.25 起，`pointer` 类型被拆分为 `pointer` 和 `buffer`，
以保证用户利用 Typed Arrays 优化。
自 Deno 1.31 起，JavaScript 表示的 `pointer` 改为不透明指针对象或 null 指针。

- [1] `void` 类型只能用作返回类型。
- [2] `buffer` 类型作为参数接受 TypedArrays，但作为返回值时总是返回指针对象或 null，类似 `pointer` 类型。
- [3] `function` 类型作为参数和返回值功能同 `pointer` 类型。
- [4] `struct` 类型用于按值传递和返回 C 结构体（复制）。
  `struct` 数组应依序枚举结构体各字段类型。
  结构体自动填充：可用适当数量的 `u8` 字段避免填充以定义-packed结构体。
  结构体只支持 TypedArrays，且总以 `Uint8Array` 返回。

### deno_bindgen

[`deno_bindgen`](https://github.com/denoland/deno_bindgen) 是官方工具，用于简化用 Rust 编写的 Deno FFI 库的胶水代码生成。

它类似于 Rust Wasm 生态中的 [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen)。

示例用法：

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

运行 `deno_bindgen` 生成绑定。
你现在可以直接在 Deno 中导入：

```ts
// mul.ts
import { mul } from "./bindings/bindings.ts";
mul({ a: 10, b: 2 }); // 20
```

关于 `deno_bindgen` 的任何问题请在
<https://github.com/denoland/deno_bindgen/issues> 反馈。

## 程序生命周期

Deno 支持浏览器兼容的生命周期事件：

- [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#:~:text=The%20load%20event%20is%20fired,for%20resources%20to%20finish%20loading.)：
  当整个页面加载完毕，包括所有依赖资源（样式表和图像）时触发。
- [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#:~:text=The%20beforeunload%20event%20is%20fired,want%20to%20leave%20the%20page.)：
  当事件循环没有更多工作要做且即将退出时触发。
  安排更多异步工作（如定时器或网络请求）将使程序继续运行。
- [`unload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event)：
  当文档或子资源被卸载时触发。
- [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)：
  当没有拒绝处理程序的 Promise 被拒绝时触发，即没有 `.catch()` 处理程序或 `.then()` 的第二参数。
- [`rejectionhandled`](https://developer.mozilla.org/en-US/docs/Web/API/Window/rejectionhandled_event)：
  当给已拒绝的 Promise 添加 `.catch()` 处理器时触发。
  该事件仅在安装了 `unhandledrejection` 监听器且阻止事件传播（防止程序因错误终止）时触发。

你可以利用这些事件编写程序初始化和清理代码。

`load` 事件监听器可异步，且会被等待，事件无法被取消。
`beforeunload` 监听器必须同步，可取消以保持程序运行。
`unload` 监听器必须同步，且无法取消。

## main.ts

```ts title="main.ts"
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`事件处理器（main）收到 ${e.type} 事件`);
};

globalThis.addEventListener("load", handler);

globalThis.addEventListener("beforeunload", handler);

globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`onload 函数（main）收到 ${e.type} 事件`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`onbeforeunload 函数（main）收到 ${e.type} 事件`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`onunload 函数（main）收到 ${e.type} 事件`);
};

console.log("主脚本日志");
```

```ts title="imported.ts"
const handler = (e: Event): void => {
  console.log(`事件处理器（imported）收到 ${e.type} 事件`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`onload 函数（imported）收到 ${e.type} 事件`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`onbeforeunload 函数（imported）收到 ${e.type} 事件`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`onunload 函数（imported）收到 ${e.type} 事件`);
};

console.log("导入脚本日志");
```

关于此示例的几点说明：

- `addEventListener` 和 `onload`/`onunload` 带有 `globalThis` 前缀，但也可以使用 `self` 或不加前缀。
  [不建议使用 `window` 作为前缀](https://docs.deno.com/lint/rules/no-window-prefix)。
- 可以使用 `addEventListener` 和/或 `onload`/`onunload` 定义事件处理器。
  二者有重大区别，运行示例如下：

```shell
$ deno run main.ts
导入脚本日志
主脚本日志
事件处理器（imported）收到 load 事件
事件处理器（main）收到 load 事件
onload 函数（main）收到 load 事件
事件处理器（imported）收到 onbeforeunload 事件
事件处理器（main）收到 onbeforeunload 事件
onbeforeunload 函数（main）收到 onbeforeunload 事件
事件处理器（imported）收到 unload 事件
事件处理器（main）收到 unload 事件
onunload 函数（main）收到 unload 事件
```

通过 `addEventListener` 添加的所有监听器都会执行，但 `main.ts` 中定义的 `onload`、
`onbeforeunload` 和 `onunload` 会覆盖 `imported.ts` 中的。

换言之，`addEventListener` 可以注册多个 `"load"` 或 `"unload"` 事件处理器，
但 `<last_defined_onload>`、`onbeforeunload` 和 `onunload` 事件处理器只会执行最后一个定义的。
出于此原因，建议优先使用 `addEventListener`。

### beforeunload

```js
// beforeunload.js
let count = 0;

console.log(count);

globalThis.addEventListener("beforeunload", (e) => {
  console.log("即将退出...");
  count++;
});

globalThis.addEventListener("unload", (e) => {
  console.log("退出中");
});

count++;
```