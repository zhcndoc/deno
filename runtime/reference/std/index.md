---
title: "标准库 (@std)"
description: "Deno 标准库简介。了解以 TypeScript 为首的模块、跨平台兼容性、版本控制、包管理以及如何在你的 Deno 项目中使用标准模块。"
oldUrl:
  - /runtime/manual/basics/standard_library/"
  - /runtime/reference/std/"
---

Deno 提供了一个用 TypeScript 编写的标准库。它是一组可被程序重用的标准模块，让你专注于应用逻辑，而不是为常见任务“重新发明轮子”。Deno 标准库中的所有模块都经过核心团队审查，保证能够与 Deno 兼容，确保一致性和可靠性。

Deno 标准库中的许多包也兼容 Node.js、Cloudflare Workers 以及其他 JavaScript 环境。这让你可以编写无需修改即可在多个环境中运行的代码。

标准库托管在 JSR 上，地址为：[https://jsr.io/@std](https://jsr.io/@std)。包都有文档、测试，并且包含用法示例。

## 包

<!-- packages:start -->
- [@std/assert](./assert/) – 常用断言函数，特别适合测试
- [@std/async](./async/) – 异步操作工具，如延迟、去抖动或池化
- [@std/bytes](./bytes/) – 用于操作 Uint8Array 的工具，JavaScript 未内置
- [@std/cache](./cache/) – 不稳定版：缓存工具
- [@std/cbor](./cbor/) – 不稳定版：用于解析和序列化简洁二进制对象表示法（CBOR）的工具
- [@std/cli](./cli/) – 用于创建交互式命令行工具的工具
- [@std/collections](./collections/) – 与数组、对象等集合类型相关的纯函数常用工具
- [@std/crypto](./crypto/) – Web Crypto API 的扩展
- [@std/csv](./csv/) – 读写逗号分隔值（CSV）文件
- [@std/data-structures](./data-structures/) – 常用数据结构，如红黑树、二叉堆
- [@std/datetime](./datetime/) – 不稳定版：处理 Date 对象的工具
- [@std/dotenv](./dotenv/) – 不稳定版：从 `.env` 文件解析并加载环境变量
- [@std/encoding](./encoding/) – 编解码常见格式的工具，如 hex、base64、varint
- [@std/expect](./expect/) – 兼容 Jest 的 `expect` 断言函数
- [@std/fmt](./fmt/) – 格式化值的工具，如给文本添加颜色、格式化时间、printf 工具、格式化字节数
- [@std/front-matter](./front-matter/) – 从字符串中提取 front matter
- [@std/fs](./fs/) – 文件系统操作辅助
- [@std/html](./html/) – HTML 相关函数，如转义或反转义 HTML 实体
- [@std/http](./http/) – 构建 HTTP 服务器的工具
- [@std/ini](./ini/) – 不稳定版：解析和序列化 INI 文件
- [@std/internal](./internal/) – 内部包，用于 @std。请勿直接使用。
- [@std/io](./io/) – 不稳定版：基于 Reader 和 Writer 接口的高级 I/O 操作工具
- [@std/json](./json/) – (流式) 解析和序列化 JSON 文件
- [@std/jsonc](./jsonc/) – 解析和序列化 JSONC 文件
- [@std/log](./log/) – 不稳定版：可定制的日志框架
- [@std/math](./math/) – 基本数学工具
- [@std/media-types](./media-types/) – 媒体类型（MIME 类型）工具函数
- [@std/msgpack](./msgpack/) – msgpack 格式的编解码
- [@std/net](./net/) – 网络相关工具
- [@std/path](./path/) – 文件系统路径相关工具
- [@std/random](./random/) – 不稳定版：使用随机数生成器的各种工具，也提供支持种子伪随机数生成器
- [@std/regexp](./regexp/) – RegExp 工作相关工具
- [@std/semver](./semver/) – 语义版本（SemVer）的解析和比较
- [@std/streams](./streams/) – Web Streams API 相关工具
- [@std/tar](./tar/) – 不稳定版：流式处理 tar 归档的工具
- [@std/testing](./testing/) – 测试 Deno 代码工具，如快照测试、bdd 测试以及时间模拟
- [@std/text](./text/) – 文本处理工具
- [@std/toml](./toml/) – 解析和序列化 TOML 文件
- [@std/ulid](./ulid/) – 生成通用唯一字典顺序标识符（ULIDs）
- [@std/uuid](./uuid/) – UUID 生成器和校验工具
- [@std/webgpu](./webgpu/) – 不稳定版：Web GPU API 工作工具
- [@std/yaml](./yaml/) – 解析和序列化 YAML 文件
<!-- packages:end -->

## 版本控制和稳定性

标准库的每个包都独立版本管理。包遵循[语义版本控制规则](https://jsr.io/@std/semver)。你可以使用[版本锁定或版本范围](/runtime/fundamentals/modules/#package-versions)来防止主版本发布影响你的代码。

## 导入标准库模块

要安装 Deno 标准库的包，你可以使用 `deno add` 子命令将包添加到你的 `deno.json` 导入映射中。

```sh
deno add jsr:@std/fs jsr:@std/path
```

`deno.json` 文件的 `imports` 字段将更新，包含这些导入：

```json
{
  "imports": {
    "@std/fs": "jsr:@std/fs@^1.0.2",
    "@std/path": "jsr:@std/path@^1.0.3"
  }
}
```

然后你可以在源代码中导入这些包：

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```

或者，你也可以直接使用 `jsr:` 规范符导入模块：

```js
import { copy } from "jsr:@std/fs@^1.0.2";
import { join } from "jsr:@std/path@^1.0.3";

await copy("foo.txt", join("dist", "foo.txt"));
```

## Node.js 兼容性

Deno 标准库设计时兼顾兼容 Node.js、Cloudflare Workers 及其他 JavaScript 环境。标准库以 TypeScript 编写并编译为 JavaScript，因此可以在任何 JavaScript 环境中使用。

```sh
npx jsr add @std/fs @std/path
```

执行此命令会将这些包添加到你的 `package.json` 中：

```json
{
  "dependencies": {
    "@std/fs": "npm:@jsr/std__fs@^1.0.2",
    "@std/path": "npm:@jsr/std__path@^1.0.3"
  }
}
```

然后你可以像使用其他 Node.js 包一样在源代码中导入它们。TypeScript 会自动找到这些包的类型定义。

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```