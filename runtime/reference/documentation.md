---
title: "Documentation Tests"
description: "Learn how to write and run documentation tests in Deno. This guide covers how to create testable code examples in documentation comments, type-checking documentation, and running doc tests with the Deno test runner."
oldUrl: /runtime/manual/testing/documentation/
---

Deno 支持对文档示例进行类型检查和评估。

这确保了文档中的示例是最新的并且可以正常工作。

基本思想是这样的：

````ts
/**
 * # 示例
 *
 * ```ts
 * const x = 42;
 * ```
 */
````

三重反引号标记代码块的开始和结束，语言由语言标识符属性决定，该属性可以是以下任一项：

- `js`
- `javascript`
- `mjs`
- `cjs`
- `jsx`
- `ts`
- `typescript`
- `mts`
- `cts`
- `tsx`

如果未指定语言标识符，则语言从提取代码块的源文档的媒体类型推断。

另一个支持的属性是 `ignore`，它告诉测试运行器跳过对代码块的类型检查。

````ts
/**
 * # 不通过类型检查
 *
 * ```typescript ignore
 * const x: string = 42;
 * ```
 */
````

如果这个示例在一个名为 foo.ts 的文件中，运行 `deno test --doc foo.ts` 将提取这个示例，然后对其进行类型检查和评估，作为一个独立的模块，位于与正在文档化的模块相同的目录中。

要文档化你的导出，请使用相对路径说明符导入模块：

````ts
/**
 * # 示例
 *
 * ```ts
 * import { foo } from "./foo.ts";
 * ```
 */
export function foo(): string {
  return "foo";
}
````