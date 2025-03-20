---
title: Fundamentals
description: "A guide to Deno's fundamental concepts and features. Learn about built-in tooling, TypeScript support, Node.js compatibility, security model, and modern JavaScript features that make Deno powerful and developer-friendly."
---

Deno is designed with the developer in mind, aiming to provide a smooth and
enjoyable development process. Its simplicity and efficiency make it quick and
easy to pick up, even for those new to the backend development.

## Built in tooling

Deno's inbuilt tooling significantly eases the onboarding process. With a single
executable, you can get started without worrying about complex setups or
dependencies. This allows you to focus on writing code rather than configuring
your environment.

- [Configuring your project](/runtime/fundamentals/configuration/)
- [TypeScript support](/runtime/fundamentals/typescript/)
- [Linting and formatting](/runtime/fundamentals/linting_and_formatting/)
- [Testing](/runtime/fundamentals/testing/)
- [Debugging](/runtime/fundamentals/debugging/)
- [HTTP server](/runtime/fundamentals/http_server/)

## Node 和 npm 支持

Deno 支持 Node.js 和 npm 包，使您能够利用现有库和工具的庞大生态系统。这种兼容性确保了您可以将 Deno 无缝集成到您的项目中。

- [Node.js 兼容性](/runtime/fundamentals/node/)
- [npm 兼容性](/runtime/fundamentals/node/#using-npm-packages)

## Standard Library

Deno comes with a comprehensive standard library written in TypeScript. This
library includes modules for common tasks such as HTTP servers, file system
operations, and more, allowing you to avoid "reinventing the wheel" and focus on
your application's features.

- [Standard Library](/runtime/fundamentals/standard_library/)

## Secure by Default

Security is a top priority for Deno. By default, it requires explicit permission
for file, network, and environment access, reducing the risk of security
vulnerabilities. This secure-by-default approach helps protect your applications
from potential threats.

- [Security and permissions](/runtime/fundamentals/security/)
- [Foreign Function Interface (FFI)](/runtime/fundamentals/ffi/)

## 现代语言特性

Deno 支持现代 JavaScript 特性，包括 ES 模块。这意味着您可以使用语言的最新语法和功能，确保您的代码是最新的，并利用行业最佳实践。

- [使用 ESModules](/runtime/fundamentals/modules/)
- [从 CJS 迁移到 ESM](/runtime/tutorials/cjs_to_esm/)