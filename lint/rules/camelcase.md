---
tags: []
---

强制在变量名中使用 camelCase。

代码库中的一致性是可读性和可维护性的关键。此规则强制要求您创建的变量声明和对象属性名使用 camelCase。

值得注意的是：

- `_` 可以出现在变量的开头或结尾
- 所有大写变量名（例如常量）可以在其名称中包含 `_`
- 如果由于某些原因必须在对象中使用 snake_case 键，请将其用引号括起来
- 此规则也适用于通过 ES 模块导入或导出的变量，但不适用于这些变量的对象属性

**无效：**

```typescript
let first_name = "Ichigo";
const obj1 = { last_name: "Hoshimiya" };
const obj2 = { first_name };
const { last_name } = obj1;

function do_something() {}
function foo({ snake_case = "default value" }) {}

class snake_case_class {}
class Also_Not_Valid_Class {}

import { not_camelCased } from "external-module.js";
export * as not_camelCased from "mod.ts";

enum snake_case_enum {
  snake_case_variant,
}

type snake_case_type = { some_property: number };

interface snake_case_interface {
  some_property: number;
}
```

**有效：**

```typescript
let firstName = "Ichigo";
const FIRST_NAME = "Ichigo";
const __myPrivateVariable = "Hoshimiya";
const myPrivateVariable_ = "Hoshimiya";
const obj1 = { "last_name": "Hoshimiya" }; // 如果对象键被引号括起来，则有效
const obj2 = { "first_name": first_name };
const { last_name: lastName } = obj;

function doSomething() {} // 函数声明必须是 camelCase 但是...
do_something(); // ...允许 snake_case 的函数调用
function foo({ snake_case: camelCase = "default value" }) {}

class PascalCaseClass {}

import { not_camelCased as camelCased } from "external-module.js";
export * as camelCased from "mod.ts";

enum PascalCaseEnum {
  PascalCaseVariant,
}

type PascalCaseType = { someProperty: number };

interface PascalCaseInterface {
  someProperty: number;
}
```