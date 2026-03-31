---
title: "deno fmt"
oldUrl:
  - /runtime/tools/formatter/
  - /runtime/manual/tools/formatter/
  - /runtime/manual/tools/fmt/
  - /runtime/reference/cli/formatter/
command: fmt
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno fmt"
description: "使用 Deno 内置的格式化工具格式化你的代码"
---

Deno 自带一个基于 [dprint](https://dprint.dev/) 的内置代码格式化工具，
它会自动将你的代码格式化为一致的风格。有关更广泛的概述，请参见
[Linting and Formatting](/runtime/fundamentals/linting_and_formatting/)。

## 基本用法

格式化当前目录中所有受支持的文件：

```sh
deno fmt
```

格式化特定文件或目录：

```sh
deno fmt main.ts src/
```

## 监视模式

在文件发生更改时自动重新格式化文件：

```sh
deno fmt --watch
```

## 在 CI 中检查格式

使用 `--check` 验证文件是否已格式化，而不修改它们。若有任何文件未格式化，该命令
会以非零状态码退出：

```sh
deno fmt --check
```

添加 `--fail-fast` 可在遇到第一个未格式化文件时停止，而不是报告全部
文件，这在大型代码库中很有用：

```sh
deno fmt --check --fail-fast
```

## 格式化 stdin

格式化通过 stdin 传入的代码——这对编辑器集成很有用：

```sh
cat main.ts | deno fmt -
```

## 配置格式化器

在你的 `deno.json` 中自定义格式化选项：

```json title="deno.json"
{
  "fmt": {
    "useTabs": false,
    "lineWidth": 80,
    "indentWidth": 2,
    "semiColons": true,
    "singleQuote": false,
    "proseWrap": "preserve"
  }
}
```

查看 [Configuration](/runtime/fundamentals/configuration/#formatting) 页面
了解所有可用选项。

## 包含和排除文件

在 `deno.json` 中指定要格式化的文件：

```json title="deno.json"
{
  "fmt": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/generated/**/*.ts"]
  }
}
```

你也可以在命令行中排除文件：

```sh
deno fmt --ignore=dist/,build/
```

## 支持的文件类型

<!-- This list needs to be updated along with https://github.com/denoland/deno/blob/main/cli/tools/fmt.rs -->

| 文件类型            | 扩展名                                              | 备注                                                                                          |
| -------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| JavaScript           | `.js`, `.cjs`, `.mjs`                              |                                                                                                |
| TypeScript           | `.ts`, `.mts`, `.cts`                              |                                                                                                |
| JSX                  | `.jsx`                                             |                                                                                                |
| TSX                  | `.tsx`                                             |                                                                                                |
| Markdown             | `.md`, `.mkd`, `.mkdn`, `.mdwn`, `.mdown`, `.markdown` |                                                                                                |
| JSON                 | `.json`                                            |                                                                                                |
| JSONC                | `.jsonc`                                           |                                                                                                |
| CSS                  | `.css`                                             |                                                                                                |
| HTML                 | `.html`                                            |                                                                                                |
| [Nunjucks][Nunjucks] | `.njk`                                             |                                                                                                |
| [Vento][Vento]       | `.vto`                                             |                                                                                                |
| YAML                 | `.yml`, `.yaml`                                    |                                                                                                |
| Sass                 | `.sass`                                            |                                                                                                |
| SCSS                 | `.scss`                                            |                                                                                                |
| LESS                 | `.less`                                            |                                                                                                |
| Jupyter Notebook     | `.ipynb`                                           |                                                                                                |
| Astro                | `.astro`                                           | 需要 `--unstable-component` 标志或 `"unstable": ["fmt-component"]` 配置选项。                  |
| Svelte               | `.svelte`                                          | 需要 `--unstable-component` 标志或 `"unstable": ["fmt-component"]` 配置选项。                  |
| Vue                  | `.vue`                                             | 需要 `--unstable-component` 标志或 `"unstable": ["fmt-component"]` 配置选项。                  |
| SQL                  | `.sql`                                            | 需要 `--unstable-sql` 标志或 `"unstable": ["fmt-sql"]` 配置选项。                            |

[Nunjucks]: https://mozilla.github.io/nunjucks/
[Vento]: https://github.com/ventojs/vento

:::note

**`deno fmt` 可以格式化 Markdown 文件中的代码块。** 代码块必须用三重反引号括起来，并具有语言属性。

:::

## 忽略代码

### JavaScript / TypeScript / JSONC

通过在代码前加上 `// deno-fmt-ignore` 注释来忽略格式化：

```ts
// deno-fmt-ignore
export const identity = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];
```

或者在文件顶部添加 `// deno-fmt-ignore-file` 注释以忽略整个文件。

### Markdown / HTML / CSS

通过在接下来的项目前加上 `<!--- deno-fmt-ignore -->` 注释来忽略格式化：

```html title="HTML"
<html>
  <body>
    <p>
      你好
      <!-- deno-fmt-ignore -->
    </p>
  </body>
</html>
```

要忽略一段代码，将代码用 `<!-- deno-fmt-ignore-start -->` 和 `<!-- deno-fmt-ignore-end -->` 注释包围。

或者在文件顶部添加 `<!-- deno-fmt-ignore-file -->` 注释以忽略整个文件。

### YAML

通过在接下来的项目前加上 `# deno-fmt-ignore` 注释来忽略格式化：

```html title="HTML"
# deno-fmt-ignore aaaaaa: bbbbbbb
```
