---
last_modified: 2025-06-19
title: "文档测试"
description: "了解如何在 Deno 中编写和运行文档测试。本指南涵盖如何在文档注释中创建可测试的代码示例、对文档进行类型检查，以及使用 Deno 测试运行器运行 doc tests。"
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

另一个支持的属性是 `ignore`，它告诉测试运行器跳过
该代码块的评估和类型检查。

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

要对导出进行文档化，请使用相对路径说明符导入模块：

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
有关 Deno 中测试的更多指南，请查看：

- [基本测试教程](/examples/testing_tutorial/)
- [测试中的数据模拟教程](/examples/mocking_tutorial/)
- [Web 应用程序测试教程](/examples/web_testing_tutorial/)
