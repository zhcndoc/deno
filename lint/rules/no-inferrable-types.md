---
tags: []
---

禁止容易推断的类型。

对 JavaScript 原始类型（以及 `null`）的变量初始化在其类型上是显而易见的。指定它们的类型可能会增加代码的冗长性。例如，对于 `const x: number = 5`，指定 `number` 是不必要的，因为 `5` 显然是一个数字。

**无效的例子：**

```typescript
const a: bigint = 10n;
const b: bigint = BigInt(10);
const c: boolean = true;
const d: boolean = !0;
const e: number = 10;
const f: number = Number("1");
const g: number = Infinity;
const h: number = NaN;
const i: null = null;
const j: RegExp = /a/;
const k: RegExp = RegExp("a");
const l: RegExp = new RegExp("a");
const m: string = "str";
const n: string = `str`;
const o: string = String(1);
const p: symbol = Symbol("a");
const q: undefined = undefined;
const r: undefined = void someValue;

class Foo {
  prop: number = 5;
}

function fn(s: number = 5, t: boolean = true) {}
```

**有效的例子：**

```typescript
const a = 10n;
const b = BigInt(10);
const c = true;
const d = !0;
const e = 10;
const f = Number("1");
const g = Infinity;
const h = NaN;
const i = null;
const j = /a/;
const k = RegExp("a");
const l = new RegExp("a");
const m = "str";
const n = `str`;
const o = String(1);
const p = Symbol("a");
const q = undefined;
const r = void someValue;

class Foo {
  prop = 5;
}

function fn(s = 5, t = true) {}
```