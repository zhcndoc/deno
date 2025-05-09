---
title: "Deno 风格指南"
description: "为 Deno 的内部运行时代码和标准库贡献提供的全面风格指南。涵盖编码约定、文档标准、测试要求及 TypeScript 和 Rust 开发的最佳实践。"
oldUrl:
- /runtime/manual/contributing/style_guide/
- /runtime/manual/references/contributing/style_guide/
---

:::note

请注意，这是 Deno 运行时和 Deno 标准库中**内部运行时代码**的风格指南。这并不是面向 Deno 用户的一般风格指南。

:::

### 版权头

大多数模块应包含以下版权头：

```ts
// 版权 2018-2024 Deno 作者。保留所有权利。MIT 许可证。
```

如果代码来源于其他地方，请确保文件包含适当的版权头。我们仅允许 MIT、BSD 和 Apache 许可代码。

### 文件名使用下划线而非破折号

示例：使用 `file_server.ts` 而不是 `file-server.ts`。

### 为新功能添加测试

每个模块应包含或伴随有其公共功能的测试。

### TODO 注释

TODO 注释通常应包含一个问题或作者的 GitHub 用户名在括号中。示例：

```ts
// TODO(ry): 添加测试。
// TODO(#123): 支持 Windows。
// FIXME(#349): 有时会崩溃。
```

### 不鼓励元编程，包括使用 Proxy

要明确，即使这意味着更多的代码。

在某些情况下，使用这种技术可能是合情合理的，但在绝大多数情况下并非如此。

### 包容性代码

请遵循在 https://chromium.googlesource.com/chromium/src/+/HEAD/styleguide/inclusive_code.md 中概述的包容性代码指南。

### Rust

遵循 Rust 约定，并与现有代码保持一致。

### TypeScript

代码库的 TypeScript 部分为标准库 `std`。

#### 使用 TypeScript 而不是 JavaScript

#### 不要使用文件名 `index.ts`/`index.js`

Deno 并不会以特殊方式处理 "index.js" 或 "index.ts"。使用这些文件名会暗示可以在模块说明符中省略它们，而实际上并不能。这是困惑的。

如果代码目录需要一个默认入口点，请使用文件名 `mod.ts`。文件名 `mod.ts` 遵循 Rust 的约定，比 `index.ts` 短，并且没有关于它工作方式的任何先入之见。

#### 导出的函数：最多 2 个参数，将其余参数放入选项对象中

设计函数接口时，遵循以下规则。

1. 作为公共 API 一部分的函数接受 0-2 个必需参数，另外（如果需要）一个选项对象（所以最多 3 个）。

2. 可选参数通常应放入选项对象中。

   如果可选参数不在选项对象中并且只有一个，且似乎不可能在未来添加更多可选参数，可能是可以接受的。

3. "options" 参数是唯一的常规 "Object" 参数。

   其他参数可以是对象，但它们必须通过以下方式可与 "plain" 对象运行时区分开：

   - 区分原型（例如 `Array`、`Map`、`Date`、`class MyThing`）。
   - 一个知名的符号属性（例如可迭代的 `Symbol.iterator`）。

   这允许 API 以向后兼容的方式演变，即使选项对象的位置发生变化。

```ts
// 不好：可选参数不在选项对象中。（#2）
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number,
): IPAddress[] {}
```

```ts
// 好。
export interface ResolveOptions {
  family?: "ipv4" | "ipv6";
  timeout?: number;
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {},
): IPAddress[] {}
```

```ts
export interface Environment {
  [key: string]: string;
}

// 不好：`env` 可能是一个常规对象，因此无法区分
// 与选项对象。（#3）
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// 好。
export interface RunShellOptions {
  env: Environment;
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions,
): string {}
```

```ts
// 不好：超过 3 个参数。（#1），多个可选参数。（#2）。
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean,
) {}
```

```ts
// 好。
interface RenameOptions {
  replaceExisting?: boolean;
  followLinks?: boolean;
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {},
) {}
```

```ts
// 不好：参数过多。（#1）
export function pwrite(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
  position: number,
) {}
```

```ts
// 更好。
export interface PWrite {
  fd: number;
  buffer: ArrayBuffer;
  offset: number;
  length: number;
  position: number;
}
export function pwrite(options: PWrite) {}
```

注意：当一个参数是函数时，您可以灵活调整顺序。请参见[Deno.serve](https://docs.deno.com/api/deno/~/Deno.serve)、[Deno.test](https://docs.deno.com/api/deno/~/Deno.test)、[Deno.addSignalListener](https://docs.deno.com/api/deno/~/Deno.addSignalListener)等示例。另见[this post](https://twitter.com/jaffathecake/status/1646798390355697664)。

#### 导出所有被用作导出成员参数的接口

每当您使用的接口包含在导出成员的参数或返回类型中时，您应该导出该接口。以下是一个示例：

```ts
// my_file.ts
export interface Person {
  name: string;
  age: number;
}

export function createPerson(name: string, age: number): Person {
  return { name, age };
}

// mod.ts
export { createPerson } from "./my_file.ts";
export type { Person } from "./my_file.ts";
```

#### 最小化依赖；不应产生循环导入

尽管 `std` 没有外部依赖，但我们仍然必须小心保持内部依赖关系简单且可管理。特别要小心不要引入循环导入。

#### 如果文件名以下划线开头：`_foo.ts`，请勿链接至此文件

在某些情况下，内部模块是必要的，但其 API 并不打算稳定或链接。在这种情况下，请以下划线作为前缀。按照约定，只有它自己目录中的文件应导入它。

#### 对导出的符号使用 JSDoc

我们追求完整的文档。每个导出的符号理想上都应有一个文档行。

如果可能，使用单行 JSDoc。示例：

```ts
/** foo 做 bar。 */
export function foo() {
  // ...
}
```

重要的是文档易于人们阅读，但也需要提供附加的样式信息，以确保生成的文档更丰富。因此 JSDoc 通常应遵循 markdown 标记以增强文本。

虽然 markdown 支持 HTML 标签，但在 JSDoc 块中是禁止使用的。

代码字符串文字应使用反引号 (\`) 括起来，而不是引号。
例如：

```ts
/** 从 `deno` 模块导入某些内容。 */
```

除非参数的意图不是很明显，否则请勿对函数参数进行文档化（尽管如果它们的意图不明显，则应考虑 API）。因此，`@param` 通常不应使用。如果使用 `@param`，则不应包含 `type`，因为 TypeScript 已经是强类型的。

```ts
/**
 * 带有不明显参数的函数。
 * @param foo 不明显参数的描述。
 */
```

在任何可能的情况下，垂直间距应最小化。因此，单行注释应写成：

```ts
/** 这是一个好的单行 JSDoc。 */
```

而不是：

```ts
/**
 * 这是一个坏的单行 JSDoc。
 */
```

代码示例应使用 markdown 格式，如下所示：

````ts
/** 一个简单的注释和示例：
 * ```ts
 * import { foo } from "deno";
 * foo("bar");
 * ```
 */
````

代码示例不应包含额外的注释，并且必须没有缩进。
它已经在注释内。如果需要进一步的注释，它就不是一个好的示例。

#### 使用指令解决 lint 问题

目前，构建过程使用 `dlint` 来检查代码中的 lint 问题。如果任务需要不符合 linter 的代码，请使用 `deno-lint-ignore <code>` 指令来抑制警告。

```typescript
// deno-lint-ignore no-explicit-any
let x: any;
```

这确保持续集成过程不会因 lint 问题而失败，但它应该被稀少使用。

#### 每个模块应配有测试模块

每个具有公共功能的模块 `foo.ts` 应配有测试模块 `foo_test.ts`。对于 `std` 模块的测试，应该放在 `std/tests` 中，由于它们的上下文不同；否则，它应与被测试模块同级。

#### 单元测试应明确

为了更好地理解测试，函数应被正确命名，因为它在测试命令中已提示。像是：

```console
foo() 返回 bar 对象 ... ok
```

测试示例：

```ts
import { assertEquals } from "@std/assert";
import { foo } from "./mod.ts";

Deno.test("foo() 返回 bar 对象", function () {
  assertEquals(foo(), { bar: "bar" });
});
```

注意：有关更多信息，请参见 [跟踪问题](https://github.com/denoland/deno_std/issues/3754)。

#### 顶级函数应使用 function 语法，而不是箭头语法

顶级函数应使用 `function` 关键字。箭头语法应限于闭包。

不好的：

```ts
export const foo = (): string => {
  return "bar";
};
```

好的：

```ts
export function foo(): string {
  return "bar";
}
```

常规函数和箭头函数在提升、绑定、参数和构造等方面的行为不同。`function` 关键字清楚地表明了定义函数的意图，提高了可读性和调试追踪能力。

#### 错误消息

从 JavaScript / TypeScript 抛出的面向用户的错误消息应清晰、简洁且一致。错误消息应采用句首字母大写的形式，但不应以句号结束。错误消息应避免语法错误和拼写错误，并应使用美式英语书写。

:::note

请注意，错误消息风格指南仍在进行中，并非所有错误消息都已更新以符合当前风格。

:::

应遵循的错误消息风格：

1. 消息应以大写字母开头：

```sh
不好的：无法解析输入
好的：无法解析输入
```

2. 消息不应以句号结束：

```sh
不好的：无法解析输入。
好的：无法解析输入
```

3. 消息应使用引号包裹字符串值：

```sh
不好的：无法解析输入 hello, world
好的：无法解析输入 "hello, world"
```

4. 消息应说明导致错误的操作：

```sh
不好的：无效输入 x
好的：无法解析输入 x
```

5. 应使用主动语态：

```sh
不好的：输入 x 无法被解析
好的：无法解析输入 x
```

6. 消息不应使用缩写：

```sh
不好的：无法解析输入 x
好的：无法解析输入 x
```

7. 消息在提供额外信息时应使用冒号。绝不要使用句号。可根据需要使用其他标点：

```sh
不好的：无法解析输入 x。值为空
好的：无法解析输入 x：值为空
```

8. 附加信息应描述当前状态，尽可能地，也应描述以肯定的声音所需的状态：

```sh
不好的：无法计算 x 的平方根：值不得为负
好的：无法计算 x 的平方根：当前值为 ${x}
更好：无法计算 x 的平方根，因为 x 必须 >= 0：当前值为 ${x}
```

### std

#### 不要依赖外部代码。

`https://jsr.io/@std` 旨在成为所有 Deno 程序可以依赖的基础功能。我们希望向用户保证，这段代码不包括潜在未经审查的第三方代码。

#### 记录并维护浏览器兼容性。

如果模块与浏览器兼容，请在模块顶部的 JSDoc 中包含以下内容：

```ts
// 此模块与浏览器兼容。
```

通过不使用全局的 `Deno` 命名空间或针对其进行特性检测来维护此类模块的浏览器兼容性。确保任何新的依赖项也与浏览器兼容。

#### 优先使用 # 而不是 private 关键字

我们更喜欢在标准模块代码库中使用私有字段（`#`）语法，而不是 TypeScript 的 `private` 关键字。私有字段使得属性和方法在运行时也保持私有。而 TypeScript 的 `private` 关键字仅保证在编译时私有，并且这些字段在运行时是可公开访问的。

好的：

```ts
class MyClass {
  #foo = 1;
  #bar() {}
}
```

不好的：

```ts
class MyClass {
  private foo = 1;
  private bar() {}
}
```

#### 命名约定

函数、方法、字段和局部变量使用 `camelCase`。类、类型、接口和枚举使用 `PascalCase`。静态顶级项目如 `string`、`number`、`bigint`、`boolean`、`RegExp`、静态项目数组、静态键值记录等使用 `UPPER_SNAKE_CASE`。

好的：

```ts
function generateKey() {}

let currentValue = 0;

class KeyObject {}

type SharedKey = {};

enum KeyType {
  PublicKey,
  PrivateKey,
}

const KEY_VERSION = "1.0.0";

const KEY_MAX_LENGTH = 4294967295;

const KEY_PATTERN = /^[0-9a-f]+$/;
```

不好的：

```ts
function generate_key() {}

let current_value = 0;

function GenerateKey() {}

class keyObject {}

type sharedKey = {};

enum keyType {
  publicKey,
  privateKey,
}

const key_version = "1.0.0";

const key_maxLength = 4294967295;

const KeyPattern = /^[0-9a-f]+$/;
```

当名称为 `camelCase` 或 `PascalCase` 时，请始终遵循它们的规则，即使它们的部分是首字母缩略词。

注意：Web API 使用大写缩略词（`JSON`、`URL`、`URL.createObjectURL()` 等）。Deno 标准库不遵循此约定。

好的：

```ts
class HttpObject {
}
```

不好的：

```ts
class HTTPObject {
}
```

好的：

```ts
function convertUrl(url: URL) {
  return url.href;
}
```

不好的：

```ts
function convertURL(url: URL) {
  return url.href;
}
```