---
last_modified: 2026-06-12
title: "使用 deno.lock 锁定依赖"
description: "使用 deno.lock 实现可复现安装：锁文件记录什么、如何审查锁文件差异、在 CI 中使用 --frozen 和 deno ci 冻结锁文件，以及如何重新生成或移动锁文件。"
url: /examples/dependency_lockfile_tutorial/
---

`deno.lock` 会将每个依赖固定到一个精确解析后的版本，并附带完整性哈希，因此每台机器（以及你的 CI）运行的都是相同的代码。只要存在 `deno.json`（或 `package.json`），Deno 就会自动创建并更新它；你只需要把它提交到仓库，并决定它何时可以变化。

## deno.lock 记录什么

添加一个依赖（例如 `deno add npm:chalk`）后，Deno 会把锁文件写到你的配置文件旁边：

```json title="deno.lock"
{
  "version": "5",
  "specifiers": {
    "npm:chalk@^5.6.2": "5.6.2"
  },
  "npm": {
    "chalk@5.6.2": {
      "integrity": "sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA=="
    }
  },
  "workspace": {
    "dependencies": ["npm:chalk@^5.6.2"]
  }
}
```

配置中的每个 semver 范围都会映射到一个精确版本，而每个包都会得到一个哈希，Deno 会在每次安装时进行验证。将 `deno.lock` 提交到 git；在其他机器和 CI 中，[`deno ci`](/runtime/reference/cli/ci/) 会严格安装锁文件所指定的内容。

## 审查锁文件差异

版本升级会表现为解析结果变化以及哈希变化：

```diff
   "specifiers": {
-    "npm:ms@2.1.2": "2.1.2"
+    "npm:ms@^2.1.3": "2.1.3"
   },
   "npm": {
-    "ms@2.1.2": {
-      "integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4Xqe..."
+    "ms@2.1.3": {
+      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU..."
```

新增依赖则会添加条目，包括其传递依赖，列在 `dependencies` 下：

```diff
   "npm": {
+    "debug@4.4.3": {
+      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru...",
+      "dependencies": ["ms"]
+    },
```

锁文件差异中出现意料之外的新包，值得在审查时进一步关注。

## 为 CI 冻结锁文件

默认情况下，锁文件是增量式的：新的依赖会被记录下来，不会报错。在 CI 中，通常希望相反：如果有任何内容尚未锁定，就直接失败：

```json title="deno.json"
{
  "lock": {
    "frozen": true
  }
}
```

同样也可以通过 `--frozen` 标志临时启用。启用冻结锁文件后，任何会修改 `deno.lock` 的命令都会以错误退出，并显示它想要进行的更改：

```sh
$ deno install
error: 锁文件已过期。请运行 `deno install --frozen=false`，或重新使用 `--frozen=false` 运行以更新它。
changes:
 4 | -    "npm:chalk@^5.6.2": "5.6.2"
 4 | +    "npm:chalk@^5.6.2": "5.6.2",
 5 | +    "npm:ms@^2.1.3": "2.1.3"
```

[`deno ci`](/runtime/reference/cli/ci/) 封装了推荐的 CI 流程：它要求存在 `deno.lock`，删除任何现有的 `node_modules`，严格根据锁文件进行安装，并且在锁文件缺失或过期时会报错。

## 更新和重新生成

要有意更新依赖，只需对一个命令关闭冻结：

```sh
deno install --frozen=false
```

由于锁文件是增量式的，被移除依赖的条目可能会残留。要从头重新生成它，删除后重新安装：

```sh
rm deno.lock
deno install
```

## 自定义路径或禁用

```json title="deno.json"
{
  "lock": { "path": "deps.lock" }
}
```

将 `"lock": false` 设置为完全禁用锁文件（不建议用于应用程序）。如需了解完整情况，包括基于锁文件构建的供应链实践，请参阅 [完整性检查和锁文件](/runtime/packages/#lockfile-and-reproducible-installs)。
