---
title: 基础知识
---

Deno 的设计考虑了开发者的需求，旨在提供顺畅而愉快的开发体验。它的简单性和高效性使得即使是后端开发的新手也能迅速上手。

## 内置工具

Deno 的内置工具显著简化了上手过程。只需一个可执行文件，您就可以开始，而无需担心复杂的设置或依赖关系。这使您可以专注于编写代码，而不是配置环境。

- [配置您的项目](/runtime/fundamentals/configuration/)
- [TypeScript 支持](/runtime/fundamentals/typescript/)
- [代码检查与格式化](/runtime/fundamentals/linting_and_formatting/)
- [测试](/runtime/fundamentals/testing/)
- [调试](/runtime/fundamentals/debugging/)
- [HTTP 服务器](/runtime/fundamentals/http_server/)

## Node 和 npm 支持

Deno 支持 Node.js 和 npm 包，使您能够利用现有库和工具的庞大生态系统。这种兼容性确保了您可以将 Deno 无缝集成到您的项目中。

- [Node.js 兼容性](/runtime/fundamentals/node/)
- [npm 兼容性](/runtime/fundamentals/node/#using-npm-packages)

## 标准库

Deno 附带一个用 TypeScript 编写的全面标准库。这个库包括用于常见任务的模块，例如 HTTP 服务器、文件系统操作等，让您避免“重复造轮子”，并专注于应用程序的功能。

- [标准库](/runtime/fundamentals/standard_library/)

## 默认安全

安全性是 Deno 的首要任务。默认情况下，它需要对文件、网络和环境访问的明确许可，从而降低安全漏洞的风险。这种默认安全的做法有助于保护您的应用程序免受潜在威胁。

- [安全性和权限](/runtime/fundamentals/security/)

## 现代语言特性

Deno 支持现代 JavaScript 特性，包括 ES 模块。这意味着您可以使用语言的最新语法和功能，确保您的代码是最新的，并利用行业最佳实践。

- [使用 ESModules](/runtime/fundamentals/modules/)
- [从 CJS 迁移到 ESM](/runtime/tutorials/cjs_to_esm/)