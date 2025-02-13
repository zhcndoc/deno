---
tags: []
---

禁止在 ["环境" 命名空间] 中使用隐式导出。

TypeScript 隐式导出所有成员的 ["环境" 命名空间]，除非存在命名导出。

["环境" 命名空间]: https://www.typescriptlang.org/docs/handbook/namespaces.html#ambient-namespaces

**无效：**

```ts
// foo.ts 或 foo.d.ts
declare namespace ns {
  interface ImplicitlyExported {}
  export type Exported = true;
}
```

**有效：**

```ts
// foo.ts 或 foo.d.ts
declare namespace ns {
  interface NonExported {}
  export {};
}

declare namespace ns {
  interface Exported {}
  export { Exported };
}

declare namespace ns {
  export interface Exported {}
}
```