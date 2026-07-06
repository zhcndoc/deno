---
last_modified: 2026-06-25
title: "deno task"
oldUrl:
  - /runtime/tools/task_runner/
  - /runtime/manual/tools/task_runner/
  - /runtime/reference/cli/task_runner/
command: task
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno task"
description: "Deno 的可配置任务运行器"
---

## 描述

`deno task` 提供了一种跨平台的方式来定义和执行特定于代码库的自定义命令。

要开始使用，请在代码库的
[Deno 配置文件](/runtime/fundamentals/configuration/) 中定义您的命令，位于一个
`"tasks"` 键下。

例如：

```jsonc title="deno.json"
{
  "tasks": {
    "data": "deno task collect && deno task analyze",
    "collect": "deno run --allow-read=. --allow-write=. scripts/collect.js",
    "analyze": {
      "description": "运行分析脚本",
      "command": "deno run --allow-read=. scripts/analyze.js"
    }
  }
}
```

## 仅在任务存在时运行任务

当指定的任务未定义时，`deno task <name>` 会以非零退出码退出。要让任务变为可选，请传入 `--if-present`。这样，如果任务缺失，Deno 会以退出码 0 退出且不输出任何内容，这对于会调用某个任务但只有部分包定义了该任务的共享 CI 脚本很有用：

```sh
deno task --if-present build
```

该标志只会抑制指定任务未找到的情况。使用不带参数的 `deno task` 列出任务、运行一个确实存在的任务，以及诸如缺少任务依赖之类的真实错误，都不受影响。

## 指定当前工作目录

默认情况下，`deno task` 使用 Deno 配置文件（例如 _deno.json_）所在目录作为执行命令时的当前工作目录。这使任务可以使用相对路径，并且无论您从目录树的哪个位置执行 `deno task`，都能继续正常工作。在某些情况下，这可能不是预期行为，此时可以使用 `INIT_CWD` 环境变量覆盖这种行为。

如果未设置，`INIT_CWD` 将被设为任务运行所在目录的完整路径。这与 `npm run` 的行为一致。

例如，以下任务将把任务的当前工作目录更改为用户运行任务时所在的目录，然后输出当前工作目录，此时它就是该目录（请记住，这在 Windows 上也同样适用，因为 `deno task` 是跨平台的）。

```json title="deno.json"
{
  "tasks": {
    "my_task": "cd $INIT_CWD && pwd"
  }
}
```

## 获取 `deno task` 运行的目录

由于任务使用 Deno 配置文件的目录作为当前工作目录，因此了解 `deno task` 是从哪个目录执行的可能会很有用。这可以通过在任务中或从 `deno task` 启动的脚本中使用 `INIT_CWD` 环境变量来实现（此方式与 `npm run` 的方式相同，但以跨平台方式实现）。

例如，要将该目录提供给任务中的脚本，请执行以下操作（注意，目录用双引号括起来，以便在包含空格的情况下将其作为单个参数保持）：

```json title="deno.json"
{
  "tasks": {
    "start": "deno run main.ts \"$INIT_CWD\""
  }
}
```

## 通配符匹配任务

`deno task` 命令可以通过传递通配符模式并行运行多个任务。通配符模式用 `*` 字符指定。

```json title="deno.json"
{
  "tasks": {
    "build:client": "deno run -RW client/build.ts",
    "build:server": "deno run -RW server/build.ts"
  }
}
```

运行 `deno task "build:*"` 将同时运行 `build:client` 和 `build:server` 任务。

对于多词任务名称，我们建议使用 `:` 作为分隔符（例如 `build:client`、`test:unit`、`lint:fix`），以符合 npm 生态系统中使用的约定，并便于将相关任务分组以进行通配符匹配。

:::note

**使用通配符时**，请务必将任务名称加引号（例如 `"build:*"`），否则您的 shell 可能会尝试展开通配符字符，从而导致意外错误。

:::

通过在模式末尾添加排除组 `(!a|b|c)`，可以将任务从通配符匹配中排除。列表中的每个值都会与 `*` 捕获的内容进行匹配。例如，给定 `test:unit`、`test:integration`、`test:e2e` 和 `test:interactive` 任务：

```sh
deno task "test:*(!e2e|interactive)"
```

会运行 `test:unit` 和 `test:integration`，但会跳过 `test:e2e` 和 `test:interactive`。带有排除组但没有 `*` 的模式会被拒绝，因为没有可供排除的内容。

## 从文件中加载环境变量

传递 `--env-file` 可将 dotenv 文件中的变量加载到任务的 shell
环境中，因此任务正文中的每个命令都会继承它们：

```sh
# 加载 .env
deno task --env-file start

# 加载特定文件
deno task --env-file=.env.production start
```

该标志可以重复使用以加载多个文件，后面的文件
优先级更高。若不指定值，则默认为 `.env`。

## 任务依赖

您可以为任务指定依赖项：

```json title="deno.json"
{
  "tasks": {
    "build": "deno run -RW build.ts",
    "generate": "deno run -RW generate.ts",
    "serve": {
      "command": "deno run -RN server.ts",
      "dependencies": ["build", "generate"]
    }
  }
}
```

在上面的示例中，运行 `deno task serve` 将首先并行执行 `build` 和 `generate` 任务，一旦它们都成功完成，`serve` 任务将被执行：

```sh
deno task serve
Task build deno run -RW build.ts
Task generate deno run -RW generate.ts
Generating data...
Starting the build...
Build finished
Data generated
Task serve deno run -RN server.ts
Listening on http://localhost:8000/
```

依赖任务会并行执行，默认并行上限等于您机器上的 CPU 核心数。要为单次调用更改此限制，请传递 `--jobs`（简称 `-j`，也可写作 `--concurrency`）；要为环境设置它，请使用 `DENO_JOBS` 环境变量。该标志具有优先级：

```sh
# 以完全顺序方式运行工作区任务
deno task --recursive --jobs 1 build
```

:::info Deno 2.8

当任务并行运行时，每一行输出都会带有产生该输出的任务名称前缀（每个任务的颜色不同）。即使任务派生了子进程，前缀也会保持附着，因此并行运行的 `build` + `test` + `lint` 仍然清晰可读，无需外部多路复用器。

:::

依赖关系会被跟踪，如果多个任务依赖同一个任务，则该任务只会运行一次：

```jsonc title="deno.json"
{
  //   a
  //  / \
  // b   c
  //  \ /
  //   d
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b", "c"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["d"]
    },
    "c": {
      "command": "deno run c.js",
      "dependencies": ["d"]
    },
    "d": "deno run d.js"
  }
}
```

```sh
deno task a
Task d deno run d.js
正在运行 d
Task c deno run c.js
正在运行 c
Task b deno run b.js
正在运行 b
Task a deno run a.js
正在运行 a
```

如果发现依赖之间存在循环，将返回错误：

```jsonc title="deno.json"
{
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["a"]
    }
  }
}
```

```sh
deno task a
检测到任务循环：a -> b -> a
```

您还可以指定没有 `command` 的依赖任务。这对于逻辑上将几个任务分组在一起很有用：

```json title="deno.json"
{
  "tasks": {
    "dev:client": "deno run --watch client/mod.ts",
    "dev:server": "deno run --watch server/mod.ts",
    "dev": {
      "dependencies": ["dev:client", "dev:server"]
    }
  }
}
```

运行 `deno task dev` 将并行运行 `dev:client` 和 `dev:server`。

## 缓存任务结果

当任务的输入都没有变化时，它可以跳过工作。添加一个 `files` 字段，列出任务读取的输入 glob，Deno 会为命令、其附加参数、匹配文件的内容以及所列环境变量的值生成指纹，然后在下次运行时，如果这些内容都没有变化，就跳过该任务。缓存是按需启用的：没有 `files` 字段的任务总是会运行。

```jsonc title="deno.json"
{
  "tasks": {
    "build": {
      "command": "deno run -RW build.ts",
      "files": ["src/**/*.ts", "deno.json"],
      "output": ["dist/"],
      "env": ["NODE_ENV"]
    }
  }
}
```

- `files` 列出构成缓存键的输入 glob。声明它们才会为该任务开启缓存。
- `output` 列出任务生成的 glob。命中缓存时，这些内容会从缓存中恢复，因此删除 `dist/` 后重新运行会重新生成它。
- `env` 列出其值作为缓存键一部分的环境变量名，因此当其中一个发生变化时，任务会重新运行。

任务的 [依赖项](#task-dependencies) 指纹会合并到其自身的缓存键中，因此只要上游任务发生变化，该任务也会重新运行。

## Node 和 npx 二进制支持

默认情况下，`deno task` 将使用 `deno` 二进制执行命令。如果您需要确保命令使用 `npm` 或 `npx` 二进制运行，您可以通过分别调用 `npm` 或 `npx` 的 `run` 命令来实现。例如：

```json title="deno.json"
{
  "tasks": {
    "test:node": "npm run test"
  }
}
```

## 工作空间支持

`deno task` 可用于工作空间，从多个成员目录并行运行任务。要执行所有工作空间成员的 `dev` 任务，请使用 `--recursive` 标志：

```jsonc title="deno.json"
{
  "workspace": [
    "client",
    "server"
  ]
}
```

```jsonc title="client/deno.json"
{
  "name": "@scope/client",
  "tasks": {
    "dev": "deno run -RN build.ts"
  }
}
```

```jsonc title="server/deno.json"
{
  "name": "@scope/server",
  "tasks": {
    "dev": "deno run -RN server.ts"
  }
}
```

```sh
deno task --recursive dev
Task dev deno run -RN build.ts
Task dev deno run -RN server.ts
Bundling project...
Listening on http://localhost:8000/
Project bundled
```

要运行的任务可以根据工作空间成员进行过滤：

```sh
deno task --filter "client" dev
Task dev deno run -RN build.ts
Bundling project...
Project bundled
```

请注意，过滤器会根据工作空间成员名称进行匹配，这些名称由每个成员的
[`deno.json`](/runtime/fundamentals/configuration/) 文件中的
`name` 字段指定。

## 语法

`deno task` 使用一个跨平台的 shell，这是一个 sh/bash 的子集，用于执行定义的任务。

### 布尔列表

布尔列表提供了一种根据初始命令的退出代码执行额外命令的方法。它们使用 `&&` 和 `||` 运算符分隔命令。

`&&` 运算符提供了一种执行命令的方法，如果它 _成功_（退出码为 `0`），则执行下一个命令：

```sh
deno run --allow-read=. --allow-write=. collect.ts && deno run --allow-read=. analyze.ts
```

`||` 运算符正好相反。它提供了一种执行命令的方法，仅在 _失败_（退出码非零）时执行下一个命令：

```sh
deno run --allow-read=. --allow-write=. collect.ts || deno run play_sad_music.ts
```

### 顺序列表

顺序列表类似于布尔列表，但无论列表中前一个命令是否通过，都将执行。命令用分号 (`;`) 分隔。

```sh
deno run output_data.ts ; deno run --allow-net server.ts
```

### 异步命令

异步命令提供了一种使命令异步执行的方法。这在启动多个进程时可能很有用。要使命令异步，请在命令末尾添加 `&`。例如，以下命令将在同一时间执行
`sleep 1 && deno run --allow-net server.ts` 和 `deno run --allow-net client.ts`：

```sh
sleep 1 && deno run --allow-net server.ts & deno run --allow-net client.ts
```

与大多数 shell 不同，第一个失败的异步命令将导致所有其他命令立即失败。在上面的例子中，这意味着如果服务器命令失败，则客户端命令也会失败并退出。您可以通过在命令末尾添加 `|| true` 来选择退出此行为，这将强制返回 `0` 的退出代码。例如：

```sh
deno run --allow-net server.ts || true & deno run --allow-net client.ts || true
```

### 环境变量

环境变量的定义方式如下：

```sh
export VAR_NAME=value
```

以下是如何在任务中使用一个环境变量的示例，使用 shell 变量替换，然后将其作为启动 Deno 进程的环境的一部分导出（注意，在 JSON 配置文件中，双引号需要用反斜杠转义）：

```sh
export VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

将输出：

```sh
hello
Deno: hello
```

#### 为命令设置环境变量

要在命令之前指定环境变量，请像下面这样列出：

```sh
VAR=hello VAR2=bye deno run main.ts
```

这将仅为以下命令使用这些环境变量。

### Shell 变量

Shell 变量与环境变量类似，但不会导出到已生成的命令中。它们使用以下语法定义：

```sh
VAR_NAME=value
```

如果我们在之前的 "环境变量" 部分的类似示例中使用 shell 变量而不是环境变量：

```sh
VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

我们将得到以下输出：

```sh
hello
Deno: undefined
```

Shell 变量在我们想重用某个值但又不希望在任何生成的进程中可用时非常有用。

### 退出状态变量

以前运行命令的退出码在 `$?` 变量中可用。

```sh
# 输出 10
deno eval 'Deno.exit(10)' || echo $?
```

### 管道

管道提供了一种将一个命令的输出管道到另一个命令的方法。

以下命令将标准输出 "Hello" 管道到启动的 Deno 进程的标准输入：

```sh
echo Hello | deno run main.ts
```

要管道标准输出和标准错误，请使用 `|&`：

```sh
deno eval 'console.log(1); console.error(2);' |& deno run main.ts
```

### 命令替换

`$(command)` 语法提供了一种在执行的其他命令中使用命令输出的方法。

例如，要将获取最新 git 修订版的输出提供给另一个命令，您可以这样做：

```sh
deno run main.ts $(git rev-parse HEAD)
```

另一个示例使用 shell 变量：

```sh
REV=$(git rev-parse HEAD) && deno run main.ts $REV && echo $REV
```

### 取反退出码

要取反退出码，请在命令前添加感叹号和空格：

```sh
# 将退出码从 1 改为 0
! deno eval 'Deno.exit(1);'
```

### 重定向

重定向提供了一种将标准输出和/或标准错误管道到文件的方法。

例如，以下命令将 `deno run main.ts` 的 _标准输出_ 重定向到文件系统中的 `file.txt`：

```sh
deno run main.ts > file.txt
```

要重定向 _标准错误_，请使用 `2>`：

```sh
deno run main.ts 2> file.txt
```

要同时重定向标准输出 _和_ 标准错误，请使用 `&>`：

```sh
deno run main.ts &> file.txt
```

要追加到文件，而不是覆盖现有文件，请使用两个右尖括号而不是一个：

```sh
deno run main.ts >> file.txt
```

抑制命令的标准输出、标准错误或两者的可能性，通过重定向到 `/dev/null`。这在包含 Windows 的跨平台方式下有效。

```sh
# 抑制标准输出
deno run main.ts > /dev/null
# 抑制标准错误
deno run main.ts 2> /dev/null
# 同时抑制标准输出和标准错误
deno run main.ts &> /dev/null
```

或者将标准输出重定向到标准错误，反之亦然：

```sh
# 将标准输出重定向到标准错误
deno run main.ts >&2
# 将标准错误重定向到标准输出
deno run main.ts 2>&1
```

输入重定向也被支持：

```sh
# 将 file.txt 重定向到 gzip 的标准输入
gzip < file.txt
```

请注意，当前不支持多重重定向。

### 跨平台 Shebang

从 Deno 1.42 开始，`deno task` 将以相同的方式执行以 `#!/usr/bin/env -S` 开头的脚本，适用于所有平台。

例如：

```ts title="script.ts"
#!/usr/bin/env -S deno run
console.log("Hello there!");
```

```json title="deno.json"
{
  "tasks": {
    "hi": "./script.ts"
  }
}
```

然后在 Windows 机器上：

```sh
> pwd
C:\Users\david\dev\my_project
> deno task hi
Hello there!
```

### Glob 扩展

在 Deno 1.34 及以上版本中支持 glob 扩展。这允许以跨平台方式指定 glob 来匹配文件。

```sh
# 匹配当前目录及其子目录中的 .ts 文件
echo **/*.ts
# 匹配当前目录中的 .ts 文件
echo *.ts
# 匹配以 "data" 开头，后跟一个数字，然后以 .csv 结尾的文件
echo data[0-9].csv
```

支持的 glob 字符包括 `*`、`?` 和 `[`/`]`。

:::caution

由于默认启用了 `globstar`（参见[Shell 选项](#shell-options)），`**` 会递归进入**所有**子目录，包括 `node_modules`。
这与某些交互式 shell 不同，在这些 shell 中，除非显式启用，否则 `**` 不会递归，因此像 `deno check **/*.ts` 这样的任务可能会展开为比在终端中输入相同命令更多得多的文件，并把依赖文件也一起扫描进去。这可能会导致诸如 `Argument list too long` 之类的错误，或者对您并不打算检查的文件进行类型检查。

对于 `deno check` 和 `deno fmt`，建议不要使用 glob 参数运行它们，并在您的 `deno.json` 中使用 [`exclude`](/runtime/reference/deno_json/#include-and-exclude) 选项（`node_modules` 默认已排除），或者使用 `shopt -u globstar` 为该任务禁用递归。

:::

### Shell 选项

从 Deno 2.6.6 及以上版本，`deno task` 支持 shell 选项以控制 glob 扩展和管道行为。默认情况下启用 `failglob` 和 `globstar`。

- **failglob** - 启用后，不匹配任何文件的 glob 会导致错误。可使用 `shopt -u failglob` 禁用。
- **globstar** - 启用后，`**` 匹配零个或多个目录。可使用 `shopt -u globstar` 禁用。
- **nullglob** - 启用后，不匹配任何文件的 glob 会展开为空，而不是字面上的 glob 模式。可使用 `shopt -s nullglob` 启用。
- **pipefail** - 启用后，管道的退出码将是最后一个以非零状态退出的命令的退出码；如果所有命令都成功退出，则为零。可使用 `set -o pipefail` 启用。
- **errexit**（Deno 2.8+）- 启用后，顺序列表会在第一个非零退出的命令处中止。可使用 `set -e` 或 `set -o errexit` 启用；可使用 `set +e` 或 `set +o errexit` 再次禁用。当将依赖 `set -e` 语义的 shell 脚本迁移到 `tasks` 块中时，这非常有用。

示例：

```jsonc title="deno.jsonc"
{
  "tasks": {
    // 禁用 failglob
    "task1": "shopt -u failglob && rm -rf *.ts",
    // 禁用 failglob 并启用 nullglob
    "task2": "shopt -u failglob && shopt -s nullglob && rm -rf *.ts",
    // 禁用 globstar
    "task3": "shopt -u globstar && echo **/*.ts",
    // 启用 pipefail
    "task4": "set -o pipefail && cat missing.txt | echo 'hello'",
    // 在第一个失败的命令处中止顺序列表
    "task5": "set -e; build_step_one; build_step_two; build_step_three"
  }
}
```

:::note

Shell 选项不会传递给 `deno task` 的子进程。每次调用 `deno task` 都从默认选项开始。

:::

## 内置命令

`deno task` 附带多个内置命令，在 Windows、Mac 和 Linux 上默认工作相同。

- [`cp`](https://man7.org/linux/man-pages/man1/cp.1.html) - 复制文件。
- [`mv`](https://man7.org/linux/man-pages/man1/mv.1.html) - 移动文件。
- [`rm`](https://man7.org/linux/man-pages/man1/rm.1.html) - 删除文件或
  目录。
  - 例如：`rm -rf [FILE]...` - 常用于递归删除文件或
    目录。
- [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) - 创建
  目录。
  - 例如：`mkdir -p DIRECTORY...` - 常用于创建目录及其所有
    父目录；如果目录已存在则不会报错。
- [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) - 打印
  当前/工作目录的名称。
- [`sleep`](https://man7.org/linux/man-pages/man1/sleep.1.html) - 延迟
  指定的时间。
  - 例如：`sleep 1` 表示睡眠 1 秒，`sleep 0.5` 表示睡眠半秒，
    或 `sleep 1m` 表示睡眠一分钟
- [`echo`](https://man7.org/linux/man-pages/man1/echo.1.html) - 显示一行
  文本。
- [`cat`](https://man7.org/linux/man-pages/man1/cat.1.html) - 连接文件并将其输出到 stdout。未提供参数时，它会读取并
  输出 stdin。
- [`exit`](https://man7.org/linux/man-pages/man1/exit.1p.html) - 使
  shell 退出。
- [`head`](https://man7.org/linux/man-pages/man1/head.1.html) - 输出文件的
  前半部分。
- [`export`](https://man7.org/linux/man-pages/man1/export.1p.html) - 设置
  环境变量并将其导出给启动的命令。
- [`unset`](https://man7.org/linux/man-pages/man1/unset.1p.html) - 取消设置
  环境变量。
- [`xargs`](https://man7.org/linux/man-pages/man1/xargs.1p.html) - 根据 stdin 构建
  参数并执行命令。
- [`:`](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/colon.html) -
  POSIX 空命令。不执行任何操作，并且总是以状态 `0` 退出（Deno
  2.8+）。在条件语句中作为 no-op 占位符，或用于参数展开的
  副作用时很方便。

如果您发现缺少某个命令的有用标志或有任何应该支持的其他命令的建议，请
[报告问题](https://github.com/denoland/deno_task_shell/issues) 到
[deno_task_shell](https://github.com/denoland/deno_task_shell/) 仓库。

请注意，如果您希望通过非跨平台方式在 Mac 或 Linux 上执行任何这些命令，则可以通过 `sh` 运行它：`sh -c <command>`（例如 `sh -c cp source destination`）。

## package.json 支持

如果发现了 `package.json` 文件，`deno task` 会回退到读取其中的 `"scripts"` 条目。请注意，Deno 不遵循也不支持任何 npm
生命周期事件，例如 `preinstall` 或 `postinstall`——您必须显式运行
您想要运行的脚本条目（例如
`deno install --entrypoint main.ts && deno task postinstall`）。

当 `deno task` 运行 `package.json` 脚本时，它会设置 npm 暴露的 `npm_*` 环境
变量，因此读取这些变量的脚本仍可正常工作。这些变量
包括 `npm_package_name`、`npm_package_version`、`npm_lifecycle_event`（
脚本名称）、`npm_lifecycle_script`（其命令字符串）以及
`npm_config_user_agent`，还有 `npm_execpath` 和 `npm_node_execpath`（二者都
设置为正在运行的 `deno` 可执行文件的路径），以及 `npm_command`（设置为
`run-script`）。这些变量仅对 `package.json` 脚本设置。`deno.json` 中定义的
任务不会接收它们。

## 命令解析

当某个任务命令引用了一个二进制文件（例如 `ohm`、`tsc`、`eslint`）时，Deno
会按以下顺序解析它：

1. `node_modules/.bin/` - 如果任务所在目录或其父目录中有
   `node_modules/.bin/` 文件夹，Deno 会先在那里查找。请注意
   `deno add npm:<pkg>` 会更新 `deno.json` imports 和 `deno.lock`，但不会
   创建 `node_modules` 目录。`node_modules` 目录仅在使用 `deno install` 或其他与 npm 兼容的工具时才会创建。

2. `package.json` 的 `bin` 字段 - 当某个依赖在其
   `package.json` 中定义了 `bin` 字段时，Deno 会通过其 npm 兼容层自动
   让这些命令在任务脚本中可用。

3. 系统 `PATH` - 如果在上述位置都找不到该命令，Deno 会回退到
   搜索系统 `PATH`。

### 示例

给定一个包含以下内容的 `package.json`：

```json
{
  "dependencies": {
    "@ohm-js/cli": "^2.0.0"
  }
}
```

以及一个包含以下内容的 `deno.json`：

```json
{
  "tasks": {
    "generate": "ohm src/grammar.ohm -o src/grammar.js"
  }
}
```

运行 `deno task generate` 将会：

1. 在 `node_modules/.bin/ohm` 中查找 `ohm`
2. 如果找到，则使用 Deno 的 Node.js 兼容层执行它
3. 该命令在 Deno 的运行时下运行，而不是 Node.js。
