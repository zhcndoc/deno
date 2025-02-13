---
title: "`deno repl`，交互式脚本提示"
oldUrl: /runtime/manual/tools/repl/
command: repl
---

## 特殊变量

REPL 提供了一些特殊变量，始终可用：

| 标识符    | 描述                             |
| -------- | --------------------------------- |
| _        | 返回最后评估的表达式              |
| _error   | 返回最后抛出的错误                 |

```console
Deno 1.14.3
使用 ctrl+d 或 close() 退出
> "hello world!"
"hello world!"
> _
"hello world!"
> const foo = "bar";
undefined
> _
undefined
```

## 特殊函数

REPL 在全局作用域提供了几个函数：

| 函数     | 描述                           |
| -------- | ------------------------------- |
| clear()  | 清除整个终端屏幕                 |
| close()  | 关闭当前 REPL 会话               |

## `--eval` 标志

`--eval` 标志允许您在进入 REPL 之前运行一些代码。这对于导入您在 REPL 中常用的一些代码或以某种方式修改运行时尤其有用：

```console
$ deno repl --allow-net --eval 'import { assert } from "jsr:@std/assert@1"'
Deno 1.45.3
使用 ctrl+d、ctrl+c 或 close() 退出
> assert(true)
undefined
> assert(false)
未捕获 AssertionError
    at assert (https://jsr.io/@std/assert/1.0.0/assert.ts:21:11)
    at <anonymous>:1:22
```

## `--eval-file` 标志

`--eval-file` 标志允许您在进入 REPL 之前从指定文件运行代码。与 `--eval` 标志类似，这对于导入您在 REPL 中常用的代码或以某种方式修改运行时也很有用。

可以将文件指定为路径或 URL。URL 文件会被缓存，并可以通过 `--reload` 标志重新加载。

如果同时指定了 `--eval`，则 `--eval-file` 文件将在 `--eval` 代码之前运行。

```console
$ deno repl --eval-file=https://docs.deno.com/examples/welcome.ts,https://docs.deno.com/examples/local.ts
下载 https://docs.deno.com/examples/welcome.ts
欢迎使用 Deno！
下载 https://docs.deno.com/examples/local.ts
Deno 1.45.3
使用 ctrl+d 或 close() 退出
> local // 这个变量在 local.ts 中被本地定义，但未被导出
"This is a local variable inside of local.ts"
```

### 相对导入路径解析

如果 `--eval-file` 指定的代码文件包含相对导入，则运行时将尝试将导入相对于当前工作目录解析。它不会尝试相对于代码文件的位置解析。这可能导致使用模块文件时出现 "Module not found" 错误：

```console
$ deno repl --eval-file=https://jsr.io/@std/encoding/1.0.0/ascii85.ts
--eval-file 文件 https://jsr.io/@std/encoding/1.0.0/ascii85.ts 中出错。未捕获 TypeError: 找不到模块 "file:///home/_validate_binary_like.ts"。
    at async <anonymous>:2:13
Deno 1.45.3
使用 ctrl+d 或 close() 退出
>
```

## Tab 补全

Tab 补全是 REPL 中快速导航的重要功能。在按下 `tab` 键后，Deno 会显示所有可能补全的列表。

```console
$ deno repl
Deno 1.45.3
使用 ctrl+d 或 close() 退出
> Deno.read
readTextFile      readFile          readDirSync       readLinkSync      readAll           read
readTextFileSync  readFileSync      readDir           readLink          readAllSync       readSync
```

## 快捷键

| 按键组合             | 操作                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Ctrl-A, Home        | 将光标移动到行首                                                                              |
| Ctrl-B, Left        | 将光标向左移动一个字符                                                                        |
| Ctrl-C              | 中断并取消当前编辑                                                                             |
| Ctrl-D              | 如果当前行为空，表示行的结束                                                                   |
| Ctrl-D, Del         | 如果当前行不为空，删除光标下的字符                                                           |
| Ctrl-E, End         | 将光标移动到行尾                                                                              |
| Ctrl-F, Right       | 将光标向右移动一个字符                                                                        |
| Ctrl-H, Backspace   | 删除光标前的字符                                                                              |
| Ctrl-I, Tab         | 下一个补全                                                                                     |
| Ctrl-J, Ctrl-M, Enter | 完成行输入                                                                                   |
| Ctrl-K              | 删除光标到行尾的内容                                                                          |
| Ctrl-L              | 清除屏幕                                                                                      |
| Ctrl-N, Down        | 历史记录中的下一个匹配                                                                        |
| Ctrl-P, Up          | 历史记录中的上一个匹配                                                                        |
| Ctrl-R              | 反向搜索历史记录 (Ctrl-S 向前，Ctrl-G 取消)                                                  |
| Ctrl-T              | 交换前一个字符与当前字符                                                                      |
| Ctrl-U              | 从行首删除到光标的内容                                                                        |
| Ctrl-V              | 插入任何特殊字符而不执行其关联的操作                                                          |
| Ctrl-W              | 删除光标前的一个单词（以空格为字边界）                                                      |
| Ctrl-X Ctrl-U       | 撤销                                                                                          |
| Ctrl-Y              | 从 Yank 缓冲区粘贴                                                                            |
| Ctrl-Y              | 从 Yank 缓冲区粘贴 (Meta-Y 粘贴下一个 yank)                                                   |
| Ctrl-Z              | 暂停 (仅限 Unix)                                                                              |
| Ctrl-_              | 撤销                                                                                          |
| Meta-0, 1, ..., -   | 指定数字参数。`–` 代表一个负数参数。                                                         |
| Meta &lt;           | 移动到历史记录的第一个条目                                                                    |
| Meta &gt;           | 移动到历史记录的最后一个条目                                                                   |
| Meta-B, Alt-Left    | 将光标移动到前一个单词                                                                        |
| Meta-Backspace      | 从当前单词的开始删除，或者如果在单词之间，则删除到前一个单词的开始                                   |
| Meta-C              | 将当前单词的首字母大写                                                                        |
| Meta-D              | 向前删除一个单词                                                                              |
| Meta-F, Alt-Right   | 将光标移动到下一个单词                                                                        |
| Meta-L              | 将下一个单词转换为小写                                                                        |
| Meta-T              | 交换单词                                                                                      |
| Meta-U              | 将下一个单词转换为大写                                                                        |
| Meta-Y              | 参见 Ctrl-Y                                                                                   |
| Ctrl-S              | 插入新行                                                                                      |

## `DENO_REPL_HISTORY`

您可以使用 `DENO_REPL_HISTORY` 环境变量来控制 Deno 存储 REPL 历史文件的位置。您可以将其设置为空值，Deno 将不会存储历史文件。