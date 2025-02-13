---
title: "deno test"
oldUrl: /runtime/manual/tools/test/
command: test
---

## 额外信息

它可以在观察模式下执行（`--watch`），支持并行执行（`--parallel`），并且可以配置为以随机顺序运行测试（`--shuffle`）。此外，还内置了代码覆盖率支持（`--coverage`）和泄漏检测（`--trace-leaks`）。

## 示例

运行测试

```bash
deno test
```

在特定文件中运行测试

```bash
deno test src/fetch_test.ts src/signal_test.ts
```

在 glob 匹配的情况下运行测试

```bash
deno test src/*.test.ts
```

运行测试，并跳过类型检查

```bash
deno test --no-check
```

运行测试，在文件更改时重新运行

```bash
deno test --watch
```