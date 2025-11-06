---
title: "@std/ini"
description: "INI 文件的解析与序列化"
jsr: jsr:@std/ini
pkg: ini
version: 0.225.2
generated: true
stability: unstable
---

<!-- 自动从 JSR 文档生成。请勿直接编辑。 -->

:::info 不稳定

此 @std 包是实验性的，其 API 可能在未增加主版本号的情况下发生变化。

:::

## 概览

<p><a href="https://jsr.io/@std/ini@0.225.2/doc/~/parse" rel="nofollow"><code>parse</code></a> 和 <a href="https://jsr.io/@std/ini@0.225.2/doc/~/stringify" rel="nofollow"><code>stringify</code></a> 用于处理
<a href="https://en.wikipedia.org/wiki/INI_file" rel="nofollow">INI</a> 编码数据，比如
<a href="https://specifications.freedesktop.org/desktop-entry-spec/latest/ar01s03.html" rel="nofollow">桌面条目规范</a>。
默认情况下，数值被解析为字符串，以保持与原始数据一致性。
也可以通过类似 <code>JSON.parse</code> 及 <code>JSON.stringify</code> 中的 reviver/replacer 函数进行自定义。
不支持嵌套节、小节内重复键名和键/值数组，但使用 <a href="https://jsr.io/@std/ini@0.225.2/doc/~/IniMap" rel="nofollow"><code>IniMap</code></a> 时这些会被保留。
多行值不支持，遇到会抛出语法错误。
空白填充和以 '#', ';' 或 '//' 开头的行将被视为注释。</p>

```js
import * as ini from "@std/ini";
import { assertEquals } from "@std/assert";

const iniFile = `# 例子配置文件
Global Key=Some data here

[Section #1]
Section Value=42
Section Date=1977-05-25`;

const parsed = ini.parse(iniFile, {
  reviver(key, value, section) {
    if (section === "Section #1") {
      if (key === "Section Value") return Number(value);
      if (key === "Section Date") return new Date(value);
    }
    return value;
  },
});

assertEquals(parsed, {
  "Global Key": "Some data here",
  "Section #1": {
    "Section Value": 42,
    "Section Date": new Date("1977-05-25T00:00:00.000Z"),
  },
});

const text = ini.stringify(parsed, {
  replacer(key, value, section) {
    if (section === "Section #1" && key === "Section Date") {
      return (value as Date).toISOString().split("T")[0];
    }
    return value;
  },
});

assertEquals(text, `Global Key=Some data here
[Section #1]
Section Value=42
Section Date=1977-05-25`);
```

<p>也可以使用 <a href="https://jsr.io/@std/ini@0.225.2/doc/~/IniMap" rel="nofollow"><code>IniMap</code></a> 来进行更精细的 INI 操作。使用此类可以保留注释，
像使用映射一样访问值，迭代键/值/节条目等更多功能。</p>

```js
import { IniMap } from "@std/ini/ini-map";
import { assertEquals } from "@std/assert";

const ini = new IniMap();
ini.set("section1", "keyA", 100);
assertEquals(
  ini.toString(),
  `[section1]
keyA=100`,
);

ini.set("keyA", 25);
assertEquals(ini.toObject(), {
  keyA: 25,
  section1: {
    keyA: 100,
  },
});
```

<p>reviver 和 replacer API 可用于扩展 IniMap 的行为，例如为重复键提供像值数组一样的支持。</p>

```js
import { IniMap } from "@std/ini/ini-map";
import { assertEquals } from "@std/assert";

const iniFile = `# key/value 数组示例
[section1]
key1=This key
key1=is non-standard
key1=but can be captured!`;

const ini = new IniMap({ assignment: "=", deduplicate: true });
ini.parse(iniFile, (key, value, section) => {
  if (section) {
    if (ini.has(section, key)) {
      const exists = ini.get(section, key);
      if (Array.isArray(exists)) {
        exists.push(value);
        return exists;
      } else {
        return [exists, value];
      }
    }
  }
  return value;
});

assertEquals(
  ini.get("section1", "key1"),
  ["This key", "is non-standard", "but can be captured!"],
);

const result = ini.toString((key, value) => {
  if (Array.isArray(value)) {
    return value.join(
      `${ini.formatting.lineBreak}${key}${ini.formatting.assignment}`,
    );
  }
  return value;
});

assertEquals(result, iniFile);
```

### 添加到你的项目

```sh
deno add jsr:@std/ini
```

<a href="https://jsr.io/@std/ini/doc" class="docs-cta jsr-cta">查看 @std/ini 中所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 什么是 INI 文件？

INI 文件是用作配置的简单文本文件。它们由键值对组成，按节分组，便于人类阅读和编辑。INI 文件常用于应用设置、偏好和其他配置数据。

## 为什么使用 @std/ini？

- INI 规范较宽松；推荐使用简单的键/值及扁平化的节以获得最佳互操作性。
- 默认解析值为字符串。使用 reviver/replacer 明确转换为数字/日期/布尔值。
- 多行值和数组非标准；若需要可通过 `IniMap` 结合自定义 reviver/replacer 模拟。
- 注释以 `#`、`;` 或 `//` 开头，`IniMap` 能保留注释。

## 示例

类型强制转换

```ts
import * as ini from "@std/ini";

const cfg = ini.parse(text, {
  reviver(key, value) {
    if (/^(true|false)$/i.test(value)) return value.toLowerCase() === "true";
    if (/^\d+$/.test(value)) return Number(value);
    return value;
  },
});
```

自定义赋值运算符及美化格式化

```ts
import * as ini from "@std/ini";

const txt = `name: Deno\nversion: 1`;

// 解析时使用 ':' 替代 '='
const parsed = ini.parse(txt, { assignment: ":" });

// 写出时继续使用 ':' 并进行美化间距
const out = ini.stringify(parsed, { assignment: ":", pretty: true });
// out => "name : Deno\nversion : 1"
```

使用 IniMap 保留注释和顺序

```ts
import { IniMap } from "@std/ini/ini-map";

const text = `# Global
[app]
# 监听端口
port=8080`;

const im = new IniMap();
im.parse(text);

// 修改值同时保留注释和顺序
im.set("app", "port", "9090");

// 输出时保留注释和结构
const roundTrip = im.toString();
```

合并分层配置（基础 + 本地覆盖）

```ts
import { IniMap } from "@std/ini/ini-map";

const baseText = `[db]\nhost=localhost\nport=5432\n[app]\nmode=prod`;
const localText = `[db]\nport=6543\n[app]\nmode=dev`;

const base = new IniMap();
base.parse(baseText);

const local = new IniMap();
local.parse(localText);

// 将本地覆盖的值叠加到基础配置
const overlay = (target: IniMap, source: IniMap) => {
  const obj = source.toObject() as Record<string, unknown>;
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [kk, vv] of Object.entries(v as Record<string, string>)) {
        target.set(k, kk, vv);
      }
    } else {
      target.set(k, v as string);
    }
  }
};

overlay(base, local);
const merged = base.toString();
```

重复键：后者覆盖与保留

```ts
import * as ini from "@std/ini";
import { IniMap } from "@std/ini/ini-map";

const dup = `x=1\nx=2`;

// 简单解析：以最后一个值为准
const simple = ini.parse(dup); // { x: "2" }

// 使用 IniMap 保留重复键（你可以实现自定义处理）
const im = new IniMap({ deduplicate: true });
im.parse(dup);
// 例如 im.get("x") 默认返回 "2"；可利用自定义 reviver 收集所有值
```

<!-- custom:end -->