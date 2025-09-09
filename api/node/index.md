---
title: "Node.js 内置 API"
description: "Deno 支持的 Node.js 内置模块和全局变量的完整参考。探索包括 fs、http、crypto、process、buffer 等 Node.js API，并附带兼容性信息。"
layout: doc.tsx
oldUrl:
  - /runtime/manual/node/compatibility/
  - /runtime/manual/npm_nodejs/compatibility_mode/
---

Deno 提供对 Node.js 内置模块和全局变量的全面支持，
使 Node.js 应用和库能无缝迁移。这些 API 遵循 Node.js 规范，
为从 Node.js 迁移的开发者提供熟悉的功能。

## 主要特性

- **内置模块支持**：通过 `node:` 前缀访问 Node.js 模块
  （例如，`import fs from "node:fs"`）
- **全局对象**：Node.js 全局对象可在 npm 包作用域中使用
- **兼容层**：与现有 Node.js 代码实现无缝互操作
- **性能**：针对 Deno 运行时优化的原生实现

## 核心模块

### 文件系统

- **`node:fs`** - 文件系统操作（读取、写入、监听、状态）
- **`node:fs/promises`** - 基于 Promise 的文件系统 API
- **`node:path`** - 跨平台路径工具

### 网络与 HTTP

- **`node:http`** - HTTP 服务器与客户端功能
- **`node:https`** - 支持 TLS 的 HTTPS 服务器与客户端
- **`node:http2`** - HTTP/2 服务器与客户端实现
- **`node:net`** - TCP 网络工具
- **`node:dns`** - DNS 解析与查询函数

### 进程与系统

- **`node:process`** - 进程信息与控制
- **`node:os`** - 操作系统工具与信息
- **`node:child_process`** - 创建与管理子进程
- **`node:cluster`** - 多进程集群支持

### 加密与安全

- **`node:crypto`** - 加密功能（哈希、加密、证书）
- **`node:tls`** - TLS/SSL 安全通信层

### 数据与流

- **`node:stream`** - 流接口（可读、可写、转换流）
- **`node:buffer`** - 使用 Buffer 类处理二进制数据
- **`node:zlib`** - 数据压缩与解压
- **`node:string_decoder`** - 将 Buffer 解码为字符串

### 工具类

- **`node:util`** - 实用函数（promisify、inspect、types）
- **`node:events`** - 事件发射器模式实现
- **`node:url`** - URL 解析与格式化工具
- **`node:querystring`** - 查询字符串工具
- **`node:assert`** - 断言测试支持

### 开发与测试

- **`node:vm`** - 用于代码执行的虚拟机上下文
- **`node:repl`** - 读-求值-打印循环功能
- **`node:inspector`** - 用于调试的 V8 inspector 集成

## 全局对象

Node.js 全局对象在 npm 包作用域内可用，并可从相关的 `node:` 模块导入：

- **`Buffer`** - 二进制数据操作
- **`process`** - 进程信息与环境
- **`global`** - 全局命名空间对象
- **`__dirname`** / **`__filename`** - 模块路径信息
- **Web 标准** - `fetch`、`URL`、`TextEncoder`、`crypto` 等

## 使用示例

### 基础模块导入

```javascript
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

// 同步读取文件
const data = fs.readFileSync("file.txt", "utf8");

// 异步读取文件
const content = await readFile("file.txt", "utf8");

// 路径操作
const fullPath = path.join("/users", "documents", "file.txt");
```

### HTTP 服务器

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js API in Deno!");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### 加密操作

```javascript
import crypto from "node:crypto";

// 生成哈希
const hash = crypto.createHash("sha256");
hash.update("Hello World");
const digest = hash.digest("hex");

// 生成随机字节
const randomBytes = crypto.randomBytes(16);
```

## 兼容性

Node 兼容性是一个持续进行的项目。大多数核心 Node.js API 都得到了高保真支持。详细兼容性信息请参阅：

- 查看我们的 [Node.js 兼容性指南](/runtime/reference/node_apis/)
- 查阅 [Node.js 测试结果](https://node-test-viewer.deno.dev/) 以获取具体测试覆盖率
- 在 GitHub 上 [报告兼容性问题](https://github.com/denoland/deno/issues)

## 从 Node.js 迁移

从 Node.js 迁移到 Deno 时：

1. **更新导入**：内置模块使用 `node:` 前缀
2. **检查兼容性**：确认依赖项能在 Deno 下运行
3. **使用 npm 指定符**：导入 npm 包时使用 `npm:` 前缀
4. **审查权限**：根据需要配置 Deno 的权限系统

更多指导，请参阅我们的
[迁移指南](/runtime/reference/migration_guide/)。