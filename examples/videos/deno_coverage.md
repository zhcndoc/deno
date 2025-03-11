---
title: "Deno 覆盖率"
description: "Learn how to measure test coverage in Deno projects. Watch how to generate coverage reports, analyze code coverage metrics, and use the HTML report feature."
url: /examples/deno_coverage/
videoUrl: https://www.youtube.com/watch?v=P2BBYNPpgW8
layout: video.tsx
---

## 视频描述

我们在 1.39 版本中更新了 `deno coverage`，使其输出更好，并支持 HTML 生成。

## 摘要与代码

如果你正在使用 `deno test`，你是否查看过 `deno coverage`？

`deno coverage` 是查看测试覆盖率的好方法，只需将覆盖标志添加到 Deno 测试中：

```sh
deno test --coverage
```

这会将覆盖数据保存到 `/coverage`。然后运行覆盖命令：

```sh
deno coverage ./coverage
```

以查看覆盖报告。

在 Deno 1.39 中，`deno coverage` 有两个方面的更新；首先，它现在输出一个简洁的摘要表，其次，如果你添加 `--html` 标志：

```sh
deno coverage ./coverage --html
```

覆盖工具会生成静态 HTML，以便你可以在浏览器中查看你的覆盖率。

我们对 Deno 覆盖率还有更多的计划，比如将步骤简化为一个命令等。