---
title: "@std/semver"
description: "语义版本（SemVer）的解析和比较"
jsr: jsr:@std/semver
pkg: semver
version: 1.0.8
generated: true
stability: stable
---

<!-- 自动生成自 JSR 文档。请勿直接编辑。 -->

## 概览

<p>语义版本解析器。</p>
<p>直接改编自 <a href="https://github.com/npm/node-semver" rel="nofollow">semver</a>。</p>

```js
import { format, greaterThan, lessThan, parse, parseRange } from "@std/semver";
import { assertEquals } from "@std/assert";

const semver = parse("1.2.3");
assertEquals(semver, {
  major: 1,
  minor: 2,
  patch: 3,
  prerelease: [],
  build: [],
});

assertEquals(format(semver), "1.2.3");

const range = parseRange("1.x || >=2.5.0 || 5.0.0 - 7.2.3");

const s0 = parse("1.2.3");
const s1 = parse("9.8.7");

assertEquals(greaterThan(s0, s1), false);
assertEquals(lessThan(s0, s1), true);
```

<h2 id="versions">
版本</h2>
<p>“版本”依据 <code>v2.0.0</code> 规范描述，详情见
<a href="https://semver.org" rel="nofollow">https://semver.org</a>。</p>
<p>前导的 <code>"="</code> 或 <code>"v"</code> 字符会被剥离并忽略。</p>
<h2 id="format">
格式</h2>
<p>语义版本可格式化为字符串，默认格式为 <code>full</code>。下图展示了各种格式选项。</p>

```js
          full
       ┌───┴───┐
    release    │
   ┌───┴───┐   │
primary    │   │
 ┌─┴─┐     │   │
 1.2.3-pre.1+b.1
 │ │ │ └─┬─┘ └┬┘
 │ │ │   │    └── build
 │ │ │   └─────── pre
 │ │ └─────────── patch
 │ └───────────── minor
 └─────────────── major
```

<h2 id="ranges">
版本范围</h2>
<p>版本 <a href="https://jsr.io/@std/semver@1.0.8/doc/~/Range" rel="nofollow"><code>Range</code></a> 是一组 <a href="https://jsr.io/@std/semver@1.0.8/doc/~/Comparator" rel="nofollow"><code>Comparator</code></a>，用于指定满足该范围的版本。</p>
<p><a href="https://jsr.io/@std/semver@1.0.8/doc/~/Comparator" rel="nofollow"><code>Comparator</code></a> 由一个 <a href="https://jsr.io/@std/semver@1.0.8/doc/~/Operator" rel="nofollow"><code>Operator</code></a> 和一个 
<a href="https://jsr.io/@std/semver@1.0.8/doc/~/SemVer" rel="nofollow">SemVer</a> 组成。基本的 <code>操作符</code> 集合如下：</p>
<ul>
<li><code>&lt;</code> 小于</li>
<li><code>&lt;=</code> 小于或等于</li>
<li><code>&gt;</code> 大于</li>
<li><code>&gt;=</code> 大于或等于</li>
<li><code>=</code> 等于。如果未指定操作符，则默认等于，因此该操作符是可选的，但可以包含。</li>
</ul>
<p>例如，比较器 <code>&gt;=1.2.7</code> 可以匹配版本 <code>1.2.7</code>、<code>1.2.8</code>、
<code>2.5.3</code> 和 <code>1.3.9</code>，但不匹配版本 <code>1.2.6</code> 或 <code>1.1.0</code>。</p>
<p>比较器可以通过空白字符连接形成一个 <code>比较器集合</code>，满足该集合的版本必须满足所有包含的比较器的<strong>交集</strong>。</p>
<p>版本范围由一个或多个通过 <code>||</code> 连接的比较器集合组成。只有满足至少一个
<code>||</code> 分隔的比较器集合中每个比较器的版本，才匹配该范围。</p>
<p>例如，范围 <code>&gt;=1.2.7 &lt;1.3.0</code> 可以匹配版本 <code>1.2.7</code>、
<code>1.2.8</code> 和 <code>1.2.99</code>，但不匹配版本 <code>1.2.6</code>、<code>1.3.0</code> 或 <code>1.1.0</code>。</p>
<p>范围 <code>1.2.7 || &gt;=1.2.9 &lt;2.0.0</code> 可匹配版本 <code>1.2.7</code>、<code>1.2.9</code> 和 <code>1.4.6</code>，
但不匹配版本 <code>1.2.8</code> 或 <code>2.0.0</code>。</p>
<h3 id="prerelease-tags">
预发布标签</h3>
<p>如果一个版本包含预发布标签（例如 <code>1.2.3-alpha.3</code>），则只有当同一个
<code>[major, minor, patch]</code> 元组至少有一个比较器也带有预发布标签时，该版本才可满足比较器集合。</p>
<p>例如，范围 <code>&gt;1.2.3-alpha.3</code> 可匹配版本
<code>1.2.3-alpha.7</code>，但不会匹配 <code>3.4.5-alpha.9</code>，即使按照 SemVer 排序规则
<code>3.4.5-alpha.9</code> 技术上比 <code>1.2.3-alpha.3</code> 更大。该范围只接受位于 <code>1.2.3</code> 版本的预发布标签。
版本 <code>3.4.5</code> 会满足该范围，因为它没有预发布标记，且比 <code>1.2.3-alpha.7</code> 更高。</p>
<p>这种行为有两个原因。首先，预发布版本通常更新频繁，且可能包含因作者设计而尚未公开的重大变更，因此默认从范围匹配语义中排除。</p>
<p>其次，选择使用预发布版本的用户明确表示其意图使用<em>特定的</em> alpha/beta/rc 版本。通过包含范围中的预发布标签，用户表示已知风险。然而，不应默认用户也已选择承担<em>下一个</em>预发布版本集的类似风险。</p>
<h4 id="prerelease-identifiers">
预发布标识符</h4>
<p><a href="https://jsr.io/@std/semver@1.0.8/doc/~/increment" rel="nofollow"><code>increment</code></a> 方法接受额外的 <code>identifier</code> 字符串参数，用作预发布标识符附加值：</p>

```js
import { increment, parse } from "@std/semver";
import { assertEquals } from "@std/assert";

assertEquals(
  increment(parse("1.2.3"), "prerelease", { prerelease: "alpha" }),
  parse("1.2.4-alpha.0"),
);
```

<h3 id="build-metadata">
构建元数据</h3>
<p>构建元数据是以 <code>.</code> 分隔的字母数字字符串。解析版本时，保持在 SemVer 实例的 <code>build: string[]</code> 字段中。
增量操作时，可通过额外参数设置 SemVer 实例的构建元数据。</p>
<h3 id="advanced-range-syntax">
高级范围语法</h3>
<p>高级范围语法可确定性地转换为基本比较器。</p>
<p>高级范围可通过空白字符或 <code>||</code> 与基本比较器同样方式组合。</p>
<h4 id="hyphen-ranges-x.y.z---a.b.c">
短横范围 <code>X.Y.Z - A.B.C</code></h4>
<p>指定包含区间。</p>
<ul>
<li><code>1.2.3 - 2.3.4</code> 等同于 <code>&gt;=1.2.3 &lt;=2.3.4</code></li>
</ul>
<p>如果起始版本为部分版本，则缺失部分均补零。</p>
<ul>
<li><code>1.2 - 2.3.4</code> 等同于 <code>&gt;=1.2.0 &lt;=2.3.4</code></li>
</ul>
<p>如果结束版本为部分版本，则接受所有以该部分元组开头的版本，但不接受比该元组更大的版本。</p>
<ul>
<li><code>1.2.3 - 2.3</code> 等同于 <code>&gt;=1.2.3 &lt;2.4.0</code></li>
<li><code>1.2.3 - 2</code> 等同于 <code>&gt;=1.2.3 &lt;3.0.0</code></li>
</ul>
<h4 id="x-ranges-1.2.x-1.x-1.2.*-*">
X 范围 <code>1.2.x</code> <code>1.X</code> <code>1.2.*</code> <code>*</code></h4>
<p><code>X</code>、<code>x</code> 或 <code>*</code> 可用作 <code>[major, minor, patch]</code> 元组中的数字占位符。</p>
<ul>
<li><code>*</code> 等同于 <code>&gt;=0.0.0</code>（任意版本满足）</li>
<li><code>1.x</code> 等同于 <code>&gt;=1.0.0 &lt;2.0.0</code>（匹配主版本）</li>
<li><code>1.2.x</code> 等同于 <code>&gt;=1.2.0 &lt;1.3.0</code>（匹配主版本和次版本）</li>
</ul>
<p>部分版本范围视为 X 范围，因此特殊字符实际上是可选的。</p>
<ul>
<li><code>""</code>（空字符串）等价于 <code>*</code>，即 <code>&gt;=0.0.0</code></li>
<li><code>1</code> 等价于 <code>1.x.x</code>，即 <code>&gt;=1.0.0 &lt;2.0.0</code></li>
<li><code>1.2</code> 等价于 <code>1.2.x</code>，即 <code>&gt;=1.2.0 &lt;1.3.0</code></li>
</ul>
<h4 id="tilde-ranges-1.2.3-1.2-1">
波浪符范围 <code>~1.2.3</code> <code>~1.2</code> <code>~1</code></h4>
<p>如果比较器指定了次版本，则允许修订版本修改；否则允许次版本修改。</p>
<ul>
<li><code>~1.2.3</code> 等同于 <code>&gt;=1.2.3 &lt;1.(2+1).0</code>，即 <code>&gt;=1.2.3 &lt;1.3.0</code></li>
<li><code>~1.2</code> 等同于 <code>&gt;=1.2.0 &lt;1.(2+1).0</code>，即 <code>&gt;=1.2.0 &lt;1.3.0</code>（同 <code>1.2.x</code>）</li>
<li><code>~1</code> 等同于 <code>&gt;=1.0.0 &lt;(1+1).0.0</code>，即 <code>&gt;=1.0.0 &lt;2.0.0</code>（同 <code>1.x</code>）</li>
<li><code>~0.2.3</code> 等同于 <code>&gt;=0.2.3 &lt;0.(2+1).0</code>，即 <code>&gt;=0.2.3 &lt;0.3.0</code></li>
<li><code>~0.2</code> 等同于 <code>&gt;=0.2.0 &lt;0.(2+1).0</code>，即 <code>&gt;=0.2.0 &lt;0.3.0</code>（同 <code>0.2.x</code>）</li>
<li><code>~0</code> 等同于 <code>&gt;=0.0.0 &lt;(0+1).0.0</code>，即 <code>&gt;=0.0.0 &lt;1.0.0</code>（同 <code>0.x</code>）</li>
<li><code>~1.2.3-beta.2</code> 等同于 <code>&gt;=1.2.3-beta.2 &lt;1.3.0</code>。注意，<code>1.2.3</code> 版本范围内的预发布版本只要大于或等于 <code>beta.2</code> 都会被允许，例如 <code>1.2.3-beta.4</code>。但是 <code>1.2.4-beta.2</code> 不被允许，因为它属于不同的 <code>[major, minor, patch]</code> 元组的预发布版本。</li>
</ul>
<h4 id="caret-ranges-^1.2.3-^0.2.5-^0.0.4">
插入符范围 <code>^1.2.3</code> <code>^0.2.5</code> <code>^0.0.4</code></h4>
<p>允许不修改 <code>[major, minor, patch]</code> 元组中最左边非零元素的更改。换言之，对于版本 <code>1.0.0</code> 及以上，允许次版本和修订版本更新；对于版本 <code>0.X &gt;= 0.1.0</code>，允许修订版本更新；而对版本 <code>0.0.X</code> 则不允许任何更新。</p>
<p>许多作者将 <code>0.x</code> 版本视为 <code>x</code> 是主要“破坏性变更”指标。</p>
<p>插入符范围适合作者在 <code>0.2.4</code> 到 <code>0.3.0</code> 之间可能引入破坏性变更的情况，这很常见。但它假定 <code>0.2.4</code> 到 <code>0.2.5</code> 之间不会有破坏性变更，只允许可认为是添加且非破坏的变更，符合公认实践。</p>
<ul>
<li><code>^1.2.3</code> 等同于 <code>&gt;=1.2.3 &lt;2.0.0</code></li>
<li><code>^0.2.3</code> 等同于 <code>&gt;=0.2.3 &lt;0.3.0</code></li>
<li><code>^0.0.3</code> 等同于 <code>&gt;=0.0.3 &lt;0.0.4</code></li>
<li><code>^1.2.3-beta.2</code> 等同于 <code>&gt;=1.2.3-beta.2 &lt;2.0.0</code>。注意，<code>1.2.3</code> 版本范围内的预发布版本只要大于或等于 <code>beta.2</code> 都会被允许，例如 <code>1.2.3-beta.4</code>。但 <code>1.2.4-beta.2</code> 不被允许，因为它属于不同的 <code>[major, minor, patch]</code> 元组预发布版本。</li>
<li><code>^0.0.3-beta</code> 等同于 <code>&gt;=0.0.3-beta &lt;0.0.4</code>。该范围仅允许 <code>0.0.3</code> 版本的预发布，只要它们大于或等于 <code>beta</code>，例如 <code>0.0.3-pr.2</code> 会被允许。</li>
</ul>
<p>解析插入符范围时，缺失的 <code>patch</code> 值默认为 <code>0</code>，但即使主版本和次版本均为 <code>0</code>，该部分仍允许灵活变化。</p>
<ul>
<li><code>^1.2.x</code> 等同于 <code>&gt;=1.2.0 &lt;2.0.0</code></li>
<li><code>^0.0.x</code> 等同于 <code>&gt;=0.0.0 &lt;0.1.0</code></li>
<li><code>^0.0</code> 等同于 <code>&gt;=0.0.0 &lt;0.1.0</code></li>
</ul>
<p>缺失 <code>minor</code> 和 <code>patch</code> 值时，默认补零，但即使主版本为零，仍允许该部分灵活变化。</p>
<ul>
<li><code>^1.x</code> 等同于 <code>&gt;=1.0.0 &lt;2.0.0</code></li>
<li><code>^0.x</code> 等同于 <code>&gt;=0.0.0 &lt;1.0.0</code></li>
</ul>
<h3 id="range-grammar">
范围语法</h3>
<p>综上所述，为方便解析器作者，以下是范围的巴科斯-诺尔范式（BNF）：</p>

```js
range-set  ::= range ( logical-or range ) *
logical-or ::= ( " " ) * "||" ( " " ) *
range      ::= hyphen | simple ( " " simple ) * | ""
hyphen     ::= partial " - " partial
simple     ::= primitive | partial | tilde | caret
primitive  ::= ( "<" | ">" | ">=" | "<=" | "=" ) partial
partial    ::= xr ( "." xr ( "." xr qualifier ? )? )?
xr         ::= "x" | "X" | "*" | nr
nr         ::= "0" | ["1"-"9"] ( ["0"-"9"] ) *
tilde      ::= "~" partial
caret      ::= "^" partial
qualifier  ::= ( "-" pre )? ( "+" build )?
pre        ::= parts
build      ::= parts
parts      ::= part ( "." part ) *
part       ::= nr | [-0-9A-Za-z]+
```

<p>注意，由于范围可能非连续，一个版本可能既不大于范围，也不小于范围，且不满足范围！例如，范围
<code>1.2 &lt;1.2.9 || &gt;2.0.0</code> 会在 <code>1.2.9</code> 到 <code>2.0.0</code> 之间有空隙，
版本 <code>1.2.10</code> 既不大于范围（因为 <code>2.0.1</code> 满足，且更大），也不小于范围（因为 <code>1.2.8</code> 满足，且更小），
同时也不满足该范围。</p>
<p>如果您想判断版本是否满足某个范围，请使用 <a href="https://jsr.io/@std/semver@1.0.8/doc/~/satisfies" rel="nofollow"><code>satisfies</code></a> 函数。</p>

### 添加到您的项目

```sh
deno add jsr:@std/semver
```

<a href="https://jsr.io/@std/semver/doc" class="docs-cta jsr-cta">查看 @std/semver 中的所有符号
<svg class="inline ml-1" viewBox="0 0 13 7" aria-hidden="true" height="20"><path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#083344"></path><g fill="#f7df1e"><path d="M1,3h1v1h1v-3h1v4h-3"></path><path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2"></path><path d="M9,2h3v2h-1v-1h-1v3h-1"></path></g></svg></a>

<!-- custom:start -->

## 为什么使用 @std/semver？

正确比较、排序和检测版本范围—避免临时字符串比较。

## 示例

```ts
import { parse, parseRange, satisfies } from "@std/semver";

const v = parse("1.2.3");
const r = parseRange("^1.2.0");
console.log(satisfies(v, r)); // true
```

## 小贴士

- 使用版本范围（`^`、`~`、`x`，短横线）表达兼容性窗口。
- 对预发布版本保持明确；范围匹配默认排除预发布版本，除非包括它们。

<!-- custom:end -->