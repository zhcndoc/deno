---
title: "使用 Deno JSON 进行配置"
description: "了解如何使用 deno.json 管理依赖项、配置任务、自定义格式化和代码检查，并使用导入映射。"
url: /examples/configuration_with_deno_json/
videoUrl: https://www.youtube.com/watch?v=bTmO5Tfgke4
layout: video.tsx
---

## 视频说明

在本视频中，我们使用 deno.json 文件来管理您 Deno 项目中的依赖和配置。学习如何创建和配置像 'start' 和 'format' 这样的任务来简化您的工作流程。我们还将探索如何自定义格式化和代码检查规则，并理解导入映射的概念以实现更清晰的导入。然后我们将看看 Deno 的 deno.json 和 Node 的 package.json 之间的兼容性，从而实现无缝的项目集成。

## 文本记录和代码

### JSR 包管理简介

每次我们使用 JSR 安装包时，它都会被放入这个 `deno.json` 文件中作为一个导入。

```json title="deno.json"
{
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

### 创建和运行任务

所以，我们可以使用这个文件来管理我们的依赖，但我们也可以将它用于许多其他配置任务。具体来说，为了让我们快速开始，先配置一些实际的任务。我们将创建一个 `"start"` 任务。这个任务会运行 `deno --allow-net main.ts`。

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts"
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

所以，把它想象成运行命令的快捷方式。我们可以这样说：

```sh
deno task start
```

这会运行该命令，类似的，

```sh
deno run start
```

也可以用。

我们再添加一个任务，命名为 `"format"`。这个任务会结合两个操作，我们说 `deno fmt && deno lint`。

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

现在运行

```sh
deno task format
```

这样它会帮我们运行所有操作。

### 格式化和代码检查配置

您也可以使用此文件为这些类型的命令设置配置。所以我们可以说 `"fmt"`，然后使用几个不同的规则，文档中关于格式化的部分[这里](/runtime/reference/deno_json/#formatting)会带您了解整个过程。这里有几个不同的选项可供利用，我们先来说 `"useTabs"`，这里设置为 `true`，然后我们再使用 `”lineWidth”: 80`。

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

现在运行

```sh
deno task format
```

这会带着这些规则运行全部格式化和代码检查。

代码检查也可以这样设置。所以我们说 `"lint"`。这也在上面的文档中，代码检查[这里](/runtime/reference/deno_json/#linting)会引导您了解根据项目需求可用的各种配置选项，不过在这种情况下，我们为 `"rules"` 添加一个键，您可以包含它们，也可以排除它们。

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "lint": {
    "rules": {}
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

假设代码里有

```typescript title="main.ts"
// @ts-ignore
import { sing } from "jsr:@eveporcello/sing";

console.log(sing("sun", 3));
```

这个规则的作用是防止您通过在文件顶部添加 `// @ts-ignore` 或类似注释来屏蔽 TypeScript 错误。换句话说，您不能在没有明确说明原因的情况下，仅仅告诉 TypeScript 忽略某个文件中的类型检查。这才是预期的行为：如果您要绕过类型系统，就应该解释原因。

不过，当您运行

```sh
deno task format
```

时，Deno 会强制执行这条规则，如果发现被忽略的 TypeScript 检查却没有附带注释，就会报错。如果您确实想允许这种行为，可以通过在配置中禁用该规则来完全取消它。我们说 `”exclude”: [“ban-ts-comment”]`。

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "lint": {
    "rules": {
      "exclude": ["ban-ts-comment"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "@eveporcello/sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

然后运行

```sh
deno task format
```

这次就能顺利运行了，我们的 `// @ts-ignore` 就奏效了。

### 处理导入映射

在 `deno.json` 文件中还有一个导入映射的概念。现在我们导入的是 `"@eveporcello/sing"`，但也可以简写。比如直接用 `"sing"`。

```json title="deno.json"
{
  "tasks": {
    "start": "deno --allow-net main.ts",
    "format": "deno fmt && deno lint"
  },
  "lint": {
    "rules": {
      "exclude": ["ban-ts-comment"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80
  },
  "imports": {
    "sing": "jsr:@eveporcello/sing@^0.1.0"
  }
}
```

然后将代码换成只用 `"sing"`：

```typescript title="main.ts"
// @ts-ignore
import { sing } from "sing";

console.log(sing("sun", 3));
```

再运行

```sh
deno main.ts
```

它会按预期工作。这就是所谓的“裸模块标识符”，它是通过导入映射把这个特定依赖映射到该 JSR 包，允许我们写出干净简洁的导入。

如果想了解更多不同的配置选项，请查看文档[这里](/runtime/fundamentals/configuration/)关于配置。Deno 也支持 `package.json`，以兼容 Node.js 项目。如果在同一目录中同时存在 `deno.json` 和 `package.json`，Deno 会理解两个文件中指定的依赖。所以这里有很多选项可用，这对你在工作 Deno 项目中会非常有用。