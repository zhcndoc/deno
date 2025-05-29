---
title: "使用 Deno JSON 进行配置"
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

你也可以使用这个文件为这些命令设置配置项。比如说 `"fmt"` ，然后使用一些不同的规则，文档中关于格式化的部分[这里](/runtime/fundamentals/configuration/#formatting)有详细说明。你可以使用多种选项，比如我们设置 `"useTabs"` 为 `true` ，然后设置 `"lineWidth": 80`。

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

代码检查你也可以设置。我们添加 `"lint"` 配置。这同样在文档中，紧接着格式化规则的文档[这里](/runtime/fundamentals/configuration/#linting)可以看到各种配置选项，根据你的项目需求进行配置。在这里，我们增加一个 `"rules"` 键，里面可以包含想要包含或排除的规则。

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

这个规则会使得，如果我在文件顶部加上这条注释，在项目中的预期行为是让 TypeScript 忽略该文件中的类型检查，不管是否符合类型规则。但是如果我再运行

```sh
deno task format
```

它会告诉我：“嘿，你不能这样，你不能不带注释地忽略这些文件。” 这是规则的一部分。但我们知道有办法绕过这个限制，虽然有些人可能不想去避开规则，但我还是给大家演示一下。我们设置一个 `"exclude": ["ban-ts-comment"]`。

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