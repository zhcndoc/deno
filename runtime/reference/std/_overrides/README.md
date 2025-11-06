# @std 包重写与自定义区块

此目录包含编辑用的 _重写_ Markdown 文件，这些文件会附加到自动生成的标准库包页面中。

## 生成流程

1. 脚本 `scripts/generate_std_docs.ts` 会从 JSR 获取每个 `@std/*` 包的概览 HTML。
2. 它会写入（或重写）`runtime/reference/std/<package>.md`，内容包括：
   - Frontmatter（标题、描述、版本、稳定性）
   - （可选的）稳定性横幅
   - 包概览（HTML 片段）
   - `## Additional Examples` 部分，包含重写的 Markdown（如果存在名为 `_overrides/<package>.md` 的文件）。
   - 保留的自定义区块（见下文）。

## 添加重写内容

创建一个以包名命名的文件，例如：

```text
_overrides/internal.md
```

在该文件中写入任何额外的示例、指南等。下一次生成时，它会显示在 “Additional Examples” 标题下。

重要提示：

- 不要在重写文件中包含 frontmatter（`--- ... ---`）。它们会被逐字追加到生成页面主体，frontmatter 会作为纯文本显示。
- 重写内容应限于内容区块（标题、段落、代码块、图片）。
- 如需更改标题/描述/稳定性，请编辑生成页面的 frontmatter 或调整上游 JSR 包元数据，而非此处。

`_overrides/internal.md` 的最小示例：

### 使用 diff 工具

```ts
import { diffStr } from "jsr:@std/internal";
console.log(diffStr("a", "b"));
```

## 在生成页面内持久化自定义编辑

如果需要**直接**在生成页面内添加内容并保持跨次生效，请使用生成器识别的自定义区块标记：

```markdown
<!-- custom:start -->

你的自定义内容在这里（额外章节、说明等）

<!-- custom:end -->
```

每次生成时，标记之间的内容都会被保留。如果页面暂无自定义区块，会自动添加注释占位符以方便编辑。

## 安全注意事项

- 不要编辑自定义区块外的区域，这些区域会被覆盖。
- 如果重命名或删除标记，内容将在下一次生成时丢失。
- 重写文件（`_overrides/<pkg>.md`）不会被生成器修改，仅被读取并注入。

## 重新生成

运行：

```sh
deno task generate:std-docs
```

这会重建所有页面，同时保留重写内容和自定义区块内容。

## 跳过某页面的生成（未来选项）

当前所有页面都会重新生成。若未来需要跳过或手动模式，可添加 frontmatter 标记（例如 `generated: false`）。