---
title: "使用 deno doc 生成文档"
description: "学习如何使用内置的 deno doc 命令为您的 Deno 项目生成专业文档。本教程涵盖 JSDoc 注释、HTML 输出、代码规范检查以及编写文档的最佳实践。"
url: /examples/deno_doc_tutorial/
---

良好的文档对任何软件项目都至关重要。它帮助其他开发者理解您的代码，简化维护，提高项目的整体质量。Deno 内置了一个名为 `deno doc` 的文档生成器，可以从您的 TypeScript 和 JavaScript 代码自动生成可搜索的文档。

`deno doc` 开箱即用，无需任何配置，可生成 HTML、JSON 或终端输出。它利用 JSDoc 注释进行文档编写，同时会自动提取代码中 TypeScript 类型注解的信息。

:::info 使用 JSR 自动生成文档

如果您将包发布到
[JSR（JavaScript 注册中心）](https://jsr.io)，则可以免费自动获得美观的文档生成！JSR 在底层使用相同的 `deno doc` 技术，为所有发布的包创建可搜索的网页文档。只需通过 `deno publish` 发布带有完善文档的代码，JSR 将为您完成剩余工作。

:::

## 创建示例项目

让我们创建一个示例库来演示 `deno doc` 的功能。我们将构建一个带有良好文档的简单数学工具库。

````ts title="math.ts"
/**
 * 一组数学工具函数集合。
 * @module
 */

/**
 * 将两个数字相加。
 *
 * @example
 * ```ts
 * import { add } from "./math.ts";
 *
 * const result = add(5, 3);
 * console.log(result); // 8
 * ```
 *
 * @param x 第一个数字
 * @param y 第二个数字
 * @returns x 和 y 之和
 */
export function add(x: number, y: number): number {
  return x + y;
}

/**
 * 将两个数字相乘。
 *
 * @example
 * ```ts
 * import { multiply } from "./math.ts";
 *
 * const result = multiply(4, 3);
 * console.log(result); // 12
 * ```
 *
 * @param x 第一个数字
 * @param y 第二个数字
 * @returns x 和 y 的乘积
 */
export function multiply(x: number, y: number): number {
  return x * y;
}

/**
 * 表示二维空间中的一个点。
 *
 * @example
 * ```ts
 * import { Point } from "./math.ts";
 *
 * const point = new Point(5, 10);
 * console.log(point.distance()); // 11.180339887498949
 * ```
 */
export class Point {
  /**
   * 创建一个新的 Point 实例。
   *
   * @param x x 坐标
   * @param y y 坐标
   */
  constructor(public x: number, public y: number) {}

  /**
   * 计算该点到原点 (0, 0) 的距离。
   *
   * @returns 到原点的距离
   */
  distance(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 计算该点到另一个点的距离。
   *
   * @param other 另一个点
   * @returns 两点之间的距离
   */
  distanceTo(other: Point): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

/**
 * 数学操作的配置选项。
 */
export interface MathConfig {
  /** 浮点计算的精度 */
  precision?: number;
  /** 是否将结果四舍五入为整数 */
  roundToInt?: boolean;
}

/**
 * 在配置下执行高级数学运算。
 *
 * @example
 * ```ts
 * import { calculate } from "./math.ts";
 *
 * const result = calculate(10, 3, { precision: 2, roundToInt: false });
 * console.log(result); // 3.33
 * ```
 */
export function calculate(
  dividend: number,
  divisor: number,
  config: MathConfig = {},
): number {
  const { precision = 10, roundToInt = false } = config;

  let result = dividend / divisor;

  if (roundToInt) {
    result = Math.round(result);
  } else {
    result = Math.round(result * Math.pow(10, precision)) /
      Math.pow(10, precision);
  }

  return result;
}
````

## 基础文档生成

生成文档最简单的方式是对源文件运行 `deno doc`：

```bash
deno doc math.ts
```

这会在您的终端输出文档，显示所有导出的函数、类和接口及其 JSDoc 注释。

## 生成 HTML 格式文档

若要创建包含 HTML、CSS 和 JS 的文档网站，使用 `--html` 标志：

```bash
deno doc --html --name="数学工具" math.ts
```

这将在 `./docs/` 目录生成静态网站。该站点包括：

- 可搜索的界面
- 语法高亮
- 符号间的交叉引用
- 移动端友好的响应式设计

您还可以指定自定义输出目录：

```bash
deno doc --html --name="数学工具" --output=./documentation/ math.ts
```

## 文档规范检查

使用 `--lint` 标志检查文档问题：

```bash
deno doc --lint math.ts
```

它会报告多种问题：

1. 导出函数、类或接口缺少 JSDoc 注释
2. 函数缺少返回类型注释
3. 导出符号引用了未导出的类型

我们创建一个带有一些文档问题的文件，来查看 linter 的表现：

```ts title="bad_example.ts"
// 缺少 JSDoc 注释
export function badFunction(x) {
  return x * 2;
}

interface InternalType {
  value: string;
}

// 引用了未导出的类型
export function anotherFunction(param: InternalType) {
  return param.value;
}
```

运行 `deno doc --lint bad_example.ts` 会显示这些问题的错误。

## 同时处理多个文件

您可以同时文档多个文件：

```bash
deno doc --html --name="我的库" ./mod.ts ./utils.ts ./types.ts
```

对于较大项目，创建一个重新导出所有内容的主模块文件：

````ts title="mod.ts"
/**
 * 数学工具库
 *
 * 一个完整的数学函数和工具集合。
 *
 * @example
 * ```ts
 * import { add, multiply, Point } from "./mod.ts";
 *
 * const sum = add(5, 3);
 * const product = multiply(4, 2);
 * const point = new Point(3, 4);
 * ```
 *
 * @module
 */

export * from "./math.ts";
````

然后从主模块生成文档：

```bash
deno doc --html --name="数学工具" mod.ts
```

## 用于自动化的 JSON 输出

生成 JSON 格式的文档以便与其他工具配合使用：

```bash
deno doc --json math.ts > documentation.json
```

JSON 输出提供了代码结构的底层表示，包括符号定义和基本类型信息。此格式主要用于构建自定义文档工具或集成需要程序化访问代码 API 的系统。

## JSDoc 注释的最佳实践

使用 `deno doc` 时，请遵循以下 JSDoc 最佳实践：

### 1. 使用描述性的摘要

```ts
/**
 * 使用递归计算一个数字的阶乘。
 *
 * @param n 要计算阶乘的数字
 * @returns n 的阶乘
 */
export function factorial(n: number): number {
  // 实现...
}
```

### 2. 提供具体示例

````ts
/**
 * 将数字格式化为货币形式。
 *
 * @example
 * ```ts
 * formatCurrency(123.456); // "$123.46"
 * formatCurrency(1000); // "$1,000.00"
 * ```
 *
 * @param amount 要格式化的金额
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(amount: number): string {
  // 实现...
}
````

### 3. 注明参数和返回值

```ts
/**
 * 验证邮箱地址格式。
 *
 * @param email 要验证的邮箱地址
 * @returns 若格式有效返回 true，否则返回 false
 * @throws {Error} 当邮箱为 null 或 undefined 时抛出
 */
export function validateEmail(email: string): boolean {
  // 实现...
}
```

### 4. 使用模块级文档

```ts
/**
 * 邮箱验证工具。
 *
 * 本模块提供根据 RFC 5322 标准验证和格式化邮箱地址的函数。
 *
 * @module
 */
```

### 5. 标记废弃或实验性功能

```ts
/**
 * 兼容旧版的遗留函数。
 *
 * @deprecated 请使用 `newFunction()` 替代
 * @param data 输入数据
 */
export function oldFunction(data: string): void {
  // 实现...
}

/**
 * 新的实验性功能。
 *
 * @experimental 此 API 未来版本可能发生变更
 * @param options 配置选项
 */
export function experimentalFunction(options: unknown): void {
  // 实现...
}
```

## 集成至 CI/CD 流程

您可以将文档生成集成到持续集成管道中：

```yaml title=".github/workflows/docs.yml"
name: 生成文档

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: 设置 Deno
        uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x

      - name: 生成文档
        run: deno doc --html --name="我的库" --output=./docs/ mod.ts

      - name: 部署到 GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## 在 deno.json 中配置

您可以在 `deno.json` 文件中配置文档生成：

```json title="deno.json"
{
  "tasks": {
    "doc": "deno doc --html --name='数学工具' --output=./docs/ mod.ts",
    "doc:lint": "deno doc --lint mod.ts",
    "doc:json": "deno doc --json mod.ts > documentation.json"
  }
}
```

然后轻松运行文档相关任务：

```bash
deno task doc
deno task doc:lint
deno task doc:json
```

🦕 `deno doc` 命令是一个强大的工具，用于从您的 Deno 项目生成专业文档。

良好的文档让您的代码更易维护，帮助其他开发者有效理解和使用您的项目。使用 `deno doc`，全面的文档仅需一条命令！