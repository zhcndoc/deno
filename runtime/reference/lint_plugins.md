---
title: "Lint Plugins"
description: "Guide to creating and using custom lint plugins in Deno. Learn how to write custom lint rules, use selectors for AST matching, implement fixes, and test your plugins using Deno's lint plugin API."
---

:::caution

这是一个实验性功能，要求 Deno 版本为 `2.2.0` 或更高。

插件 API 目前被标记为"不稳定"，因为它在未来可能会发生变化。

:::

内置的 linter 可以通过插件进行扩展，以添加自定义 lint 规则。

虽然 Deno 默认提供了[许多 lint 规则](/lint/)，但在某些情况下，您可能需要特别为您的项目量身定制的自定义规则——无论是为了捕捉特定上下文的问题，还是为了强制执行全公司的约定。

这就是 lint 插件 API 的用武之地。

lint 插件 API 有意模拟了
[ESLint API](https://eslint.org/docs/latest/extend/custom-rules)。虽然此 API
没有提供 100% 的兼容性，但如果您曾经编写过自定义
[ESLint](https://eslint.org/) 规则，那么现有的知识大部分可以重新利用。

插件通过 `deno.json` 中的 `lint.plugins` 设置加载。

该值是一个插件描述符数组。这些描述符可以是路径、`npm:`或
`jsr:` 描述符。

```json title="deno.json"
{
  "lint": {
    "plugins": ["./my-plugin.ts"]
  }
}
```

## 示例插件

插件始终具有相同的结构。它有一个默认导出，即您的插件对象。

:::info

Deno 为 lint 插件 API 提供了类型声明。

所有类型定义都在 `Deno.lint` 命名空间下可用。

:::

```ts title="my-plugin.ts"
const plugin: Deno.lint.Plugin = {
  // 您插件的名称。将在错误输出中显示
  name: "my-plugin",
  // 规则对象。属性名是规则名称，并且
  // 将在错误输出中显示。
  rules: {
    "my-rule": {
      // 在 `create(context)` 方法中放置您的逻辑。
      // 当文件被 lint 时会调用该方法。
      create(context) {
        // 返回一个 AST 访问者对象
        return {
          // 在这个示例中，我们禁止任何标识符被命名为 `_a`
          Identifier(node) {
            if (node.name === "_a") {
              // 报告一个 lint 错误，并附带自定义消息
              context.report({
                node,
                message: "应该是 _b",
                // 可选：提供一个修复，当用户运行 `deno lint --fix`
                // 时可以应用该修复
                fix(fixer) {
                  return fixer.replaceText(node, "_b");
                },
              });
            }
          },
        };
      },
    },
  },
};
export default plugin;
```

## 使用选择器匹配节点

如果您直接在普通 JavaScript 中编写代码来匹配特定节点，有时可能会变得有些乏味。有时，通过选择器表达此匹配逻辑会更容易，类似于 CSS 选择器。通过在返回的访问者对象中使用字符串作为属性名，我们可以指定一个自定义选择器。

```ts title="my-plugin.ts"
const plugin: Deno.lint.Plugin = {
  name: "my-plugin",
  rules: {
    "my-rule": {
      create(context) {
        return {
          // 选择器也可以使用。在这里我们检查
          // `require("...")` 调用。
          'CallExpression[callee.name="require"]'(node) {
            context.report({
              node,
              message: "请不要使用 require() 调用来加载模块",
            });
          },
        };
      },
    },
  },
};
export default plugin;
```

注意，如果匹配逻辑太复杂而无法仅用选择器表达，我们始终可以进一步在 JavaScript 中细化匹配。支持的选择器语法完整列表如下：

| 语法                       | 描述                                   |
| -------------------------- | ------------------------------------- |
| `Foo + Foo`                | 下一个兄弟选择器                      |
| `Foo > Bar`                | 子组合器                               |
| `Foo ~ Bar`                | 后续兄弟组合器                        |
| `Foo Bar`                  | 后代组合器                           |
| `Foo[attr]`                | 属性存在性                             |
| `Foo[attr.length < 2]`     | 属性值比较                             |
| `Foo[attr=/(foo\|bar)*/]` | 属性值正则检查                        |
| `:first-child`             | 第一个子元素伪类                     |
| `:last-child`              | 最后一个子元素伪类                   |
| `:nth-child(2n + 1)`       | 第 n 个子元素伪类                     |
| `:not(> Bar)`              | 非伪类                               |
| `:is(> Bar)`               | 是伪类                              |
| `:where(> Bar)`            | 位于伪类（与 `:is()` 相同）          |
| `:matches(> Bar)`          | 匹配伪类（与 `:is()` 相同）          |
| `:has(> Bar)`              | 有伪类                               |
| `IfStatement.test`         | 字段选择器 `.<field>`                |

还有一个 `:exit` 伪类，仅在整个选择器的末尾有效。当它存在时，Deno 会在向上遍历树时调用该函数，而不是向下遍历时。

:::tip

我们强烈建议在开发 lint 规则时使用
[typescript-eslint playground](https://typescript-eslint.io/play/)。它允许您检查代码和生成的 AST 格式。这使得更容易看到哪个选择器匹配哪个节点。

:::

## 应用修复

自定义 lint 规则可以提供一个函数，在报告问题时应用修复。可选的 `fix()` 方法在运行 `deno lint --fix` 或通过 Deno LSP 在编辑器内部应用修复时被调用。

`fix()` 方法接收一个包含辅助方法的 `fixer` 实例，以方便创建修复。修复由起始位置、结束位置和应放入该范围内的新文本组成。

```ts
context.report({
  node,
  message: "应该是 _b",
  fix(fixer) {
    return fixer.replaceText(node, "_b");
  },
});
```

`fixer` 对象具有以下方法：

- `insertTextAfter(node, text)`：在给定节点之后插入文本。
- `insertTextAfterRange(range, text)`：在给定范围之后插入文本。
- `insertTextBefore(node, text)`：在给定节点之前插入文本。
- `insertTextBeforeRange(range, text)`：在给定范围之前插入文本。
- `remove(node)`：移除给定节点。
- `removeRange(range)`：移除给定范围内的文本。
- `replaceText(node, text)`：替换给定节点中的文本。
- `replaceTextRange(range, text)`：替换给定范围内的文本。

`fix()` 方法还可以返回一个修复数组，或者如果是生成器函数，则可以 yield 多个修复。

有时需要节点的原始源文本来创建修复。要获取任何节点的源代码，请使用 `context.sourceCode.getText()`：

```ts
context.report({
  node,
  message: "应该是 _b",
  fix(fixer) {
    const original = context.sourceCode.getText(node);
    const newText = `{ ${original} }`;
    return fixer.replaceText(node, newText);
  },
});
```

## 运行清理代码

如果您的插件在文件被 lint 后需要运行清理代码，您可以通过 `destroy()` 钩子连接到 linter。它在文件被 lint 后以及插件上下文被销毁之前调用。

```ts title="my-plugin.ts"
const plugin: Deno.lint.Plugin = {
  name: "my-plugin",
  rules: {
    "my-rule": {
      create(context) {
        // ...
      },
      // 可选：在文件的 lint 完成后
      // 以及每个规则上下文被销毁后运行代码。
      destroy() {
        // 如果需要，做一些清理工作
      },
    },
  },
};
export default plugin;
```

:::caution

假设您的插件代码会在每个被 lint 的文件上再次执行并不安全。

最好不要保持全局状态，并在 `destroy` 钩子中进行清理，以防 `deno lint` 决定重用现有的插件实例。

:::

## 排除自定义规则

与内置规则类似，您可以禁用插件提供的自定义规则。为此，请将其添加到 `deno.json` 中的 `lint.rules.exclude` 键。自定义 lint 规则的格式始终为 `<plugin-name>/<rule-name>`。

```json title="deno.json"
{
  "lint": {
    "plugins": ["./my-plugin.ts"],
    "rules": {
      "exclude": ["my-plugin/my-rule"]
    }
  }
}
```

## 忽略自定义 lint 报告

有时您希望在代码的特定位置禁用报告的 lint 错误。您可以通过在该位置之前放置代码注释来禁用报告的位置，而不是完全禁用自定义 lint 规则。

```ts
// deno-lint-ignore my-custom-plugin/no-console
console.log("hey");
```

这将禁用特定行的 lint 插件中的 lint 规则。

忽略注释的语法是：

```ts
// deno-lint-ignore <my-plugin>/<my-rule>
```

## 测试插件

`Deno.lint.runPlugin` API 提供了一种方便的方式来测试您的插件。它允许您断言插件根据特定输入生成预期的诊断信息。

让我们使用上面定义的示例插件：

```ts title="my-plugin_test.ts"
import { assertEquals } from "jsr:@std/assert";
import myPlugin from "./my-plugin.ts";

Deno.test("my-plugin", () => {
  const diagnostics = Deno.lint.runPlugin(
    myPlugin,
    "main.ts", // 虚拟文件名，文件不需要存在。
    "const _a = 'a';",
  );

  assertEquals(diagnostics.length, 1);
  const d = diagnostics[0];
  assertEquals(d.id, "my-plugin/my-rule");
  assertEquals(d.message, "应该是 _b");
  assertEquals(d.fix, [{ range: [6, 8], text: "_b" }]);
});
```

:::info

`Deno.lint.runPlugin` API 仅在 `deno test` 和
`deno bench` 子命令中可用。

尝试在其他子命令中使用它将会抛出错误。

:::

请参考[API 参考文档](/api/deno/)以获取有关
[`Deno.lint.runPlugin`](/api/deno/~/Deno.lint.runPlugin) 和
[`Deno.lint.Diagnostic`](/api/deno/~/Deno.lint.Diagnostic) 的更多信息。
