---
title: "`deno doc`, 文档生成器"
oldUrl:
 - /runtime/manual/tools/documentation_generator/
 - /runtime/reference/cli/documentation_generator/
command: doc
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno doc"
description: "Generate documentation from your code"
---

## 示例

`deno doc` 后接一个或多个源文件的列表，将打印该模块的 **导出** 成员的 JSDoc 文档。

例如，给定一个文件 `add.ts`，其内容为：

```ts
/**
 * 将 x 和 y 相加。
 * @param {number} x
 * @param {number} y
 * @returns {number} x 和 y 的和
 */
export function add(x: number, y: number): number {
  return x + y;
}
```

运行 Deno 的 `doc` 命令，将函数的 JSDoc 注释输出到 `stdout`：

```shell
deno doc add.ts
function add(x: number, y: number): number
  将 x 和 y 相加。 @param {number} x @param {number} y @returns {number} x 和 y 的和
```

## 检查

您可以使用 `--lint` 标志在生成文档时检查文档中的问题。`deno doc` 将指出三种类型的问题：

1. 从根模块导出的类型引用未导出的类型的错误。
   - 确保 API 使用者可以访问 API 使用的所有类型。如果根模块（在命令行中指定给 `deno doc` 的文件之一）导出了该类型，或者使用 `@internal` jsdoc 标签标记该类型，可以抑制此警告。
2. **公共** 类型上缺少返回类型或属性类型的错误。
   - 确保 `deno doc` 显示返回/属性类型，并帮助提高类型检查性能。
3. **公共** 类型上缺少 JS 文档注释的错误。
   - 确保代码得到了文档。如果添加 jsdoc 注释，或者通过 `@ignore` jsdoc 标签将其排除在文档之外，可以抑制此警告。或者，添加 `@internal` 标签以将其保留在文档中，但表示它是内部的。

例如：

```ts title="/mod.ts"
interface Person {
  name: string;
  // ...
}

export function getName(person: Person) {
  return person.name;
}
```

```shell
$ deno doc --lint mod.ts
类型 'getName' 引用了未从根模块导出的类型 'Person'。
缺少 JS 文档注释。
缺少返回类型。
    at file:///mod.ts:6:1
```

这些检查旨在帮助您编写更好的文档，并加速项目中的类型检查。如果发现任何问题，程序将以非零退出代码退出，输出将报告到标准错误。

## 支持的 JSDoc 特性和标签

Deno 实现了一大套 JSDoc 标签，但并不严格遵循 JSDoc 标准，而是与同一特性空间中广泛使用的工具和生态系统提供的合理标准和特性保持一致，如 [TSDoc](https://tsdoc.org/) 和 [TypeDoc](https://typedoc.org/)。

对于任何自由文本的地方，即 JSDoc 评论的主描述、参数的描述等，接受 markdown。

### 支持的标签

以下标签是支持的，是 JSDoc、TSDoc 和 TypeDoc 使用和指定的标签的选择：

- [`constructor`/`class`](https://jsdoc.app/tags-class): 标记一个函数为构造函数。
- [`ignore`](https://jsdoc.app/tags-ignore): 忽略一个符号以从输出中包含。
- internal: 将符号标记为仅用于内部。在 HTML 生成器中，该符号不会得到列出的条目，但它仍然会被生成，并且可以通过非内部符号链接到它。
- [`public`](https://jsdoc.app/tags-public): 将符号视为公共 API。相当于 TypeScript 的 `public` 关键字。
- [`private`](https://jsdoc.app/tags-private): 将符号视为私有 API。相当于 TypeScript 的 `private` 关键字。
- [`protected`](https://jsdoc.app/tags-protected): 将属性或方法视为受保护的 API。相当于 TypeScript 的 `protected` 关键字。
- [`readonly`](https://jsdoc.app/tags-readonly): 将符号标记为只读，意味着它不能被重写。
- [`experimental`](https://tsdoc.org/pages/tags/experimental): 将符号标记为实验性，意味着 API 可能会更改或被删除，或行为不明确。
- [`deprecated`](https://jsdoc.app/tags-deprecated): 将符号标记为不推荐使用，意味着不再支持，并可能在未来版本中被移除。
- [`module`](https://jsdoc.app/tags-module): 此标签可以在顶级 JSDoc 注释中定义，将使该注释用于该文件而不是后续符号。可以指定一个值，该值将用作模块的标识符（即用于默认导出）。
- `category`/`group`: 将符号标记为特定的类别/组。这对于将各种符号归类在一起非常有用。
- [`see`](https://jsdoc.app/tags-see): 定义与符号相关的外部参考。
- [`example`](https://jsdoc.app/tags-example): 为符号定义一个示例。与 JSDoc 不同，代码示例需要用三个反引号（markdown 风格代码块）包裹，这更符合 TSDoc 而非 JSDoc。
- `tags`: 为符号定义额外的自定义标签，通过逗号分隔的列表。
- [`since`](https://jsdoc.app/tags-since): 定义该符号从何时可用。
- [`callback`](https://jsdoc.app/tags-callback): 定义一个回调。
- [`template`/`typeparam`/`typeParam`](https://tsdoc.org/pages/tags/typeparam): 定义一个回调。
- [`prop`/`property`](https://jsdoc.app/tags-property): 在符号上定义一个属性。
- [`typedef`](https://jsdoc.app/tags-typedef): 定义一种类型。
- [`param`/`arg`/`argument`](https://jsdoc.app/tags-param): 在函数上定义一个参数。
- [`return`/`returns`](https://jsdoc.app/tags-returns): 定义函数的返回类型和/或注释。
- [`throws`/`exception`](https://jsdoc.app/tags-throws): 定义当调用函数时会抛出的内容。
- [`enum`](https://jsdoc.app/tags-enum): 将对象定义为枚举。
- [`extends`/`augments`](https://jsdoc.app/tags-augments): 定义一个函数扩展的类型。
- [`this`](https://jsdoc.app/tags-this): 定义函数中 `this` 关键字所指的内容。
- [`type`](https://jsdoc.app/tags-type): 定义符号的类型。
- [`default`](https://jsdoc.app/tags-default): 定义变量、属性或字段的默认值。

### 内联链接

内联链接允许您指定指向页面其他部分、其他符号或模块的链接。除了支持 markdown 风格的链接外，
还支持 [JSDoc 风格的内联链接](https://jsdoc.app/tags-inline-link)。

例如，您可以这样做 `{@link https://docs.deno.com}`，其将渲染为以下 'https://docs.deno.com'。也可以使用 `{@linkcode https://docs.deno.com}`，以便使用等宽字体渲染，大致渲染为： '`https://docs.deno.com`'。

您还可以通过 `{@link https://docs.deno.com | Deno Docs}` 指定替换标签，这将使用 `|` 后的文本作为要显示的文本，而不是链接。前面的示例将渲染为 '[Deno Docs](https://docs.deno.com)'。

您可以在描述中添加指向其他符号的内联链接，例如 `{@link MySymbol}`。

对于模块链接，同样适用，但您使用 `{@link [myModule]}` 语法。您还可以通过 `{@link [myModule].mysymbol}` 链接到不同模块中的符号。

## HTML 输出

使用 `--html` 标志生成带有文档的静态站点。

```console
$ deno doc --html --name="我的库" ./mod.ts

$ deno doc --html --name="我的库" --output=./documentation/ ./mod.ts

$ deno doc --html --name="我的库" ./sub1/mod.ts ./sub2/mod.ts
```

生成的文档是一个静态网站，包含多个页面，可以部署到任何静态网站托管服务。

生成的网站中包含客户端搜索，但如果用户的浏览器禁用了 JavaScript，则不可用。

## JSON 输出

使用 `--json` 标志将文档以 JSON 格式输出。此 JSON 格式由
[deno doc 网站](https://github.com/denoland/docland) 消费，并用于生成模块文档。