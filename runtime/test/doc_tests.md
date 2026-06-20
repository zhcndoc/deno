---
last_modified: 2026-06-15
title: "文档测试"
description: "使用 deno test --doc 运行你 JSDoc 注释和 markdown 文件中的代码示例作为测试，这样你的文档就永远不会过时。"
oldUrl:
  - /runtime/manual/testing/documentation/
  - /runtime/manual/basics/testing/documentation/
  - /runtime/reference/documentation/
---

Deno 可以对你在 JSDoc 注释和 markdown 文件中编写的代码片段进行求值，并将它们作为测试运行。这样可以让文档中的示例保持真实：当 API 发生变化时，过时的示例会在 CI 中失败，而不是误导读者。

## 示例代码块

````ts title="example.ts"
/**
 * # 示例
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(1, 2);
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
````

三重反引号标记代码块的开始和结束，语言由语言标识符属性决定，它可以是以下之一：

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

如果没有指定语言标识符，则语言将根据提取该代码块的源文档的媒体类型推断。

```sh
deno test --doc example.ts
```

上面的命令会提取这个示例，将其转换为如下所示的伪测试用例：

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add } from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(1, 2);
  assertEquals(sum, 3);
});
```

然后将其作为一个独立模块运行，该模块位于被文档化的模块所在的同一目录中。

:::tip 只想进行类型检查？

如果你只想对 JSDoc 和 markdown 文件中的代码片段进行类型检查，而不实际运行它们，可以使用 [`deno check`](/runtime/reference/cli/check/) 命令，并为 JSDoc 使用 `--doc` 选项，或为 markdown 使用 `--doc-only` 选项。

:::

## 导出的项目会自动导入

查看上面的生成测试代码时，你会注意到其中包含了用于导入 `add` 函数的 `import` 语句，尽管原始代码块并没有它。在为模块编写文档时，模块中导出的任何项目都会使用相同的名称自动包含在生成的测试代码中。

假设我们有以下模块：

````ts title="example.ts"
/**
 * # 示例
 *
 * ```ts
 * import { assertEquals } from "jsr:@std/assert/equals";
 *
 * const sum = add(ONE, getTwo());
 * assertEquals(sum, 3);
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}

export const ONE = 1;
export default function getTwo() {
  return 2;
}
````

这将被转换为以下测试用例：

```ts title="example.ts$4-10.ts" ignore
import { assertEquals } from "jsr:@std/assert/equals";
import { add, ONE }, getTwo from "file:///path/to/example.ts";

Deno.test("example.ts$4-10.ts", async () => {
  const sum = add(ONE, getTwo());
  assertEquals(sum, 3);
});
```

## Hashbang 和受限权限

如果代码示例以 [hashbang](/examples/hashbang_tutorial/) 开头，它会针对受支持的 Deno CLI 标志进行验证，并且权限标志会传递给生成的 [`Deno.test`](/api/deno/~/Deno.test)。

````ts
/**
 * 打印环境变量的值。
 *
 * ```ts
 * #!/usr/bin/env -S deno run --allow-env=MY_ENV_VAR
 * console.log(Deno.env.get("MY_ENV_VAR"));
 * ```
 */
````

下面是每个权限标志的解释方式：

| 标志                | 生成的权限                                             |
| ------------------- | ------------------------------------------------------ |
| `--allow-all`       | 从 `deno test` 继承所有权限                              |
| `--allow-*`         | 从 `deno test` 继承指定的权限                           |
| `--allow-*=…`       | 将指定权限限制为提供的值                               |
| `--deny-*`          | 明确撤销指定的权限                                       |
| `--deny-*=…`        | 目前不支持（会导致测试失败）                             |
| `--permission-set`  | 目前不支持（会被忽略）                                   |
| `--ignore-*`        | 目前不支持（会被忽略）                                   |
| 无权限标志           | 无                                                    |

:::note

即使 hashbang 本身指定了更宽松的权限，代码示例运行时获得的权限也不会比 `deno test` 被授予的更宽松。

:::

## 跳过代码块

你可以通过添加 `ignore` 属性来跳过对代码块的求值。

````ts
/**
 * 这段代码块不会被运行。
 *
 * ```ts ignore
 * await sendEmail("deno@example.com");
 * ```
 */
export async function sendEmail(to: string) {
  // 向指定地址发送电子邮件...
}
```
