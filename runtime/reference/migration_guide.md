---
title: "Deno 1.x to 2.x Migration Guide"
description: "Comprehensive guide to migrating from Deno 1.x to 2.x. Learn about breaking changes, API updates, Node.js compatibility features, and how to update your codebase to work with Deno 2.x."
oldUrl:
  - /runtime/manual/advanced/migrate_deprecations/
  - /runtime/reference/migrate_deprecations/
---

尽管我们在 Deno 1.x 中取得了大量成就，下一个主要版本旨在
支持 Deno **大规模应用**。这意味着与 Node.js 和
npm JavaScript 基础设施的无缝互操作性，并支持更广泛的项目和
开发团队，所有这些都在不牺牲开发者所喜爱的简单性、安全性和
“内置电池”特性的情况下实现。

## 与 Node.js 和 npm 的向后兼容性

Deno 2 与 Node.js 和 npm 向后兼容。这不仅允许你在当前的 Node.js 项目中运行 Deno，还允许你逐步采用 Deno 的一体化工具链的各个部分。

例如，你可以在 Node.js 项目中使用 `deno install` 来安装
依赖项，运行 `deno fmt` 来格式化代码而无需使用 Prettier，或使用
`deno lint` 来检查常见问题，而不是使用 ESLint。

Deno 2 理解 `package.json`、`node_modules` 目录，甚至支持 npm
工作区，使你能够轻松迁移现有的使用 ESM 的项目。

为了更好地兼容 Node，默认情况下在存在 package.json 时不会自动安装 npm 包，而推荐运行 `deno install`。
要获取 Deno 1.x 中的自动安装行为，请将以下内容添加到你的
deno.json 中：

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

[在 `Node.js 支持` 页面上了解更多](/runtime/fundamentals/node/)

### 长期支持版本

从 Deno v2.1.0（预计在 2024 年 11 月发布）开始，Deno 将提供
LTS（长期支持）通道。

LTS 版本支持 6 个月，接收 bug 修复和关键性能修复，然后将新版本提升为 LTS。

[在 `稳定性和发布` 页面上了解更多](/runtime/fundamentals/stability_and_releases/#long-term-support-(lts))

## 管理依赖

Deno 2 大大改善了对 npm 和 JSR 包的依赖管理，提供了以下工具：

- [`deno install`](/runtime/reference/cli/install/)
- [`deno add`](/runtime/reference/cli/add/)
- [`deno remove`](/runtime/reference/cli/remove/)

你可以期待与 Deno 首先的项目（使用 `deno.json`）、Node.js 首先的项目（使用 `package.json`）以及混合项目（使用 `deno.json` 和 `package.json`）之间的无缝体验，从而实现易于迁移的路径。

## Monorepo、工作区和私有注册表支持

Deno 2 是针对在重要项目上工作的开发团队而构建的。这些团队处理复杂的代码库，共享内部代码，通常使用私有注册表。

使用 Deno 2，你的团队可以像使用 Node.js 和 npm 一样利用私有 npm 注册表，使用 `.npmrc` 文件：

```js title=".npmrc"
@mycompany:registry=http://mycompany.com:8111/
mycompany.com:8111/:_authToken=token
```

了解更多关于私有注册表配置
[在 `npm 包` 页面上](/runtime/fundamentals/node/#private-registries)。

Deno 2 具有工作区支持，允许你在同一个 monorepo 中混合 Deno 首先和 Node 首先的包，使增量采用变得快速且易于实现。

阅读更多
[在 `工作区和单一仓库` 页面上](/runtime/fundamentals/workspaces/)。

## 框架支持

随着 Node.js 和 npm 兼容性的提高，Deno 2 支持许多用户喜爱的框架，例如：

- Next.js
- SvelteKit
- Remix
- Nuxt
- TanStack
- Qwik
- 等等

大多数现有项目将需要最小或不需要更改；只需用 `deno task dev` 替换
`npm run dev`，便可以开始工作。

Deno 将提供有用的错误消息，附带建议，以引导你走向工作解决方案。

你还可以使用 `deno lint --fix` 自动修复常见的不兼容性。

---

以下部分概述了 Deno 1.x 与 Deno 2 之间的配置、CLI 和 API 变化。

## 配置更改

- `nodeModulesDir`

对于 `nodeModulesDir` 和 `--node-modules-dir` 配置选项使用布尔值已被弃用，取而代之的是选择多种行为选项。因此，当未设置该选项时，默认值已更改。

```diff
- "nodeModulesDir": false | true
+ "nodeModulesDir": "none" | "auto" | "manual"

- 默认值（无 package.json 时）：false（对应于 "none"）
+ 默认值（无 package.json 时）："none"

- 默认值（有 package.json 时）：true（对应于 "auto"）
+ 默认值（有 package.json 时）："manual"
```

如果你的项目中未包含 `package.json` 文件，则默认行为将保持不变。

如果你的项目中包含 `package.json` 文件且未指定 `nodeModulesDir` 选项，则必须将其设置为 `auto` 以保持 Deno 1.x 中的自动安装行为。Deno 2 中的新默认值为 `manual`，这意味着用户必须手动保持该目录的最新状态。

参见
[Node 模块目录](https://docs.deno.com/runtime/fundamentals/configuration/#node-modules-directory)
以供参考。

## CLI 更改

- `deno bundle`

`deno bundle` 命令已被删除。我们建议结合使用
[`esbuild`](https://esbuild.github.io/) 和
[`esbuild-deno-loader`](https://jsr.io/@luca/esbuild-deno-loader)。

```ts
import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["https://deno.land/std@0.185.0/bytes/mod.ts"],
  outfile: "./dist/bytes.esm.js",
  bundle: true,
  format: "esm",
});

esbuild.stop();
```

- `deno cache`

`deno cache` 命令已合并到 `deno install` 命令中的 `--entrypoint` 选项下。

```diff
- deno cache main.ts
+ deno install --entrypoint main.ts
```

- `deno vendor`

`deno vendor` 命令已被 `deno.json` 中的 `"vendor": true` 配置选项所替代。

```json title="deno.json"
{
  "vendor": true
}
```

- `--allow-none`

请改用 `--permit-no-files` CLI 标志。

```diff
- deno test --allow-none
+ deno test --permit-no-files
```

- `--jobs`

请使用
[`DENO_JOBS`](https://docs.deno.com/runtime/manual/basics/env_variables/#special-environment-variables)
环境变量来替代。

```diff
- deno test --jobs=4 --parallel
+ DENO_JOBS=4 deno test --parallel
```

- `--ts`

请改用 `--ext=ts` CLI 标志。

```diff
- deno run --ts script.ts
+ deno run --ext=ts script.ts
```

```diff
- deno run -T script.ts
+ deno run --ext=ts script.ts
```

- `--trace-ops`

请改用 `--trace-leaks` CLI 标志。

```diff
- deno test --trace-ops
+ deno test --trace-leaks
```

- `--unstable`

请使用更细化的不稳定标志（`--unstable-*`）或配置选项。
参见
[不稳定特性标志](https://docs.deno.com/runtime/reference/cli/unstable_flags/)
以供参考。

```ts
// kv.ts
const kv = await Deno.openKv();

// ...
```

```diff
- deno run --unstable kv.ts
+ deno run --unstable-kv kv.ts
```

或

```diff
{
+ "unstable": ["kv"]
}
```

有关详细信息，请参见
[Deno 1.40 博客文章](https://deno.com/blog/v1.40#changes-to-how-we-handle-unstable-features)。

## API 更改

- `Deno.Buffer`

请改用来自标准库的 [`Buffer`](https://jsr.io/@std/io/doc/buffer/~/Buffer)。

```diff
+ import { Buffer } from "jsr:@std/io/buffer";

- const buffer = new Deno.Buffer();
+ const buffer = new Buffer();

  // ...
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.Closer`

请改用来自标准库的 [`Closer`](https://jsr.io/@std/io/doc/types/~/Closer)。

```diff
+ import type { Closer } from "jsr:@std/io/types";

- function foo(closer: Deno.Closer) {
+ function foo(closer: Closer) {
  // ...
}
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.close()`

请改用资源的 `.close()` 方法。

<a href="#" id="rid">测试</a>

```diff
  const conn = await Deno.connect({ port: 80 });

  // ...

- Deno.close(conn.rid);
+ conn.close();
```

```diff
  const file = await Deno.open("/foo/bar.txt");

  // ...

- Deno.close(file.rid);
+ file.close();
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.Conn.prototype.rid`

请改用 [`Deno.Conn`](https://docs.deno.com/api/deno/~/Deno.Conn) 实例方法。

```diff
  const conn = await Deno.connect({ port: 80 });

  const buffer = new Uint8Array(1_024);
- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(conn.rid, data);
+ await conn.write(data);

- await Deno.shutdown(conn.rid);
+ await conn.closeWrite();

- Deno.close(conn.rid);
+ conn.close();
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.ConnectTlsOptions.certChain`

请改用
[`cert`](https://docs.deno.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_cert)
选项。

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
- certChain: Deno.readTextFileSync("./server.crt"),
+ cert: Deno.readTextFileSync("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

有关详细信息，请参阅 [deno#22274](https://github.com/denoland/deno/pull/22274)。

- `Deno.ConnectTlsOptions.certFile`

请改用
[`cert`](https://docs.deno.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_cert)
选项。

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
- certFile: "./server.crt",
+ cert: Deno.readTextFileSync("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

有关详细信息，请参阅 [deno#22274](https://github.com/denoland/deno/pull/22274)。

- `Deno.ConnectTlsOptions.privateKey`

请改用
[`key`](https://docs.deno.com/api/deno/~/Deno.TlsCertifiedKeyPem#property_key)
选项。

```diff
const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
using conn = await Deno.connectTls({
  hostname: "192.0.2.1",
  port: 80,
  caCerts: [caCert],
  cert: Deno.readTextFileSync("./server.crt"),
- keyFile: "./server.key",
+ key: Deno.readTextFileSync("./server.key"),
});
```

有关详细信息，请参阅 [deno#22274](https://github.com/denoland/deno/pull/22274)。

- `Deno.copy()`

请改用来自标准库的 [`copy()`](https://jsr.io/@std/io/doc/copy/~/copy)。

```diff
+ import { copy } from "jsr:@std/io/copy";

  using file = await Deno.open("/foo/bar.txt");

- await Deno.copy(file, Deno.stdout);
+ await copy(file, Deno.stdout);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.customInspect`

请改用 `Symbol.for("Deno.customInspect")`。

```diff
class Foo {
- [Deno.customInspect]() {
+ [Symbol.for("Deno.customInspect")] {
  }
}
```

有关更多详细信息，请参阅 [deno#9294](https://github.com/denoland/deno/issues/9294)。

- `Deno.fdatasync()`

请改用
[`Deno.FsFile.prototype.syncData()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.syncData)。

```diff
  using file = await Deno.open("/foo/bar.txt", { read: true, write: true });

  await file.write(new TextEncoder().encode("Hello, world!"));
- await Deno.fdatasync(file.rid);
+ await file.syncData();
```

- `Deno.fdatasyncSync()`

请改用
[`Deno.FsFile.prototype.syncDataSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.syncDataSync)。

```diff
  using file = Deno.openSync("/foo/bar.txt", { read: true, write: true });

  file.writeSync(new TextEncoder().encode("Hello, world!"));
- Deno.fdatasyncSync(file.rid);
+ file.syncDataSync();
```

- `Deno.File`

请改用 [`Deno.FsFile`](https://docs.deno.com/api/deno/~/Deno.FsFile)。

```diff
- function foo(file: Deno.File) {
+ function foo(file: Deno.FsFile) {
  // ...
}
```

有关详细信息，请参阅 [deno#13661](https://github.com/denoland/deno/issues/13661)。

- `Deno.flock()`

请改用
[`Deno.FsFile.prototype.lock()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.lock)。

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.flock(file.rid);
+ await file.lock();
```

有关详细信息，请参阅 [deno#22178](https://github.com/denoland/deno/issues/22178)。

- `Deno.flockSync()`

请改用
[`Deno.FsFile.prototype.lockSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.lockSync)。

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.flockSync(file.rid);
+ file.lockSync();
```

有关详细信息，请参阅 [deno#22178](https://github.com/denoland/deno/issues/22178)。

- `Deno.FsFile.prototype.rid`

请改用 [`Deno.FsFile`](https://docs.deno.com/api/deno/~/Deno.FsFile) 实例方法。

```diff
  const file = await Deno.open("/foo/bar.txt");

  const buffer = new Uint8Array(1_024);
- await Deno.read(file.rid, buffer);
+ await file.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(file.rid, data);
+ await file.write(data);

- Deno.close(file.rid);
+ file.close();
```

- `Deno.fstatSync()`

请改用
[`Deno.FsFile.prototype.statSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.statSync)。

```diff
  using file = Deno.openSync("/foo/bar.txt");

- const fileInfo = Deno.fstatSync(file.rid);
+ const fileInfo = file.statSync();
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.fstat()`

请改用
[`Deno.FsFile.prototype.stat()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.stat)。

```diff
  using file = await Deno.open("/foo/bar.txt");

- const fileInfo = await Deno.fstat(file.rid);
+ const fileInfo = await file.stat();
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.FsWatcher.prototype.rid`

请改用 [`Deno.FsWatcher`](https://docs.deno.com/api/deno/~/Deno.FsWatcher) 实例方法。

```diff
  using watcher = Deno.watchFs("/dir");

  // ...

- Deno.close(watcher.rid);
+ watcher.close();
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.fsync()`

请改用
[`Deno.FsFile.prototype.sync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.sync)。

```diff
  using file = await Deno.open("/foo/bar.txt", { read: true, write: true });

  await file.write(new TextEncoder().encode("Hello, world!"));
  await file.truncate(1);
- await Deno.fsync(file.rid);
+ await file.sync();
```

- `Deno.fsyncSync()`

请改用
[`Deno.FsFile.prototype.syncSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.syncSync)。

```diff
  using file = Deno.openSync("/foo/bar.txt", { read: true, write: true });

  file.writeSync(new TextEncoder().encode("Hello, world!"));
  file.truncateSync(1);
- Deno.fsyncSync(file.rid);
+ file.syncSync();
```

- `Deno.ftruncateSync()`

请改用
[`Deno.FsFile.prototype.truncateSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.truncateSync)。

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.ftruncateSync(file.rid, 7);
+ file.truncateSync(7);
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.ftruncate()`

请改用
[`Deno.FsFile.prototype.truncate()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.truncate)。

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.ftruncate(file.rid, 7);
+ await file.truncate(7);
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.funlock()`

请改用
[`Deno.FsFile.prototype.unlock()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.unlock)。

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.funlock(file.rid);
+ await file.unlock();
```

有关详细信息，请参阅 [deno#22178](https://github.com/denoland/deno/issues/22178)。

- `Deno.funlockSync()`

请改用
[`Deno.FsFile.prototype.unlockSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.unlockSync)。

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.funlockSync(file.rid);
+ file.unlockSync();
```

有关详细信息，请参阅 [deno#22178](https://github.com/denoland/deno/issues/22178)。

- `Deno.futimeSync()`

请改用
[`Deno.FsFile.prototype.utimeSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.utimeSync)。

```diff
  using file = Deno.openSync("/foo/bar.txt");

- Deno.futimeSync(file.rid, 1556495550, new Date());
+ file.utimeSync(1556495550, new Date());
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.futime()`

请改用
[`Deno.FsFile.prototype.utime()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.utime)。

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.futime(file.rid, 1556495550, new Date());
+ await file.utime(1556495550, new Date());
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.isatty()`

请改用 `Deno.FsFile.prototype.isTerminal()`、`Deno.stdin.prototype.isTerminal()`、
`Deno.stdout.prototype.isTerminal()` 或 `Deno.stderr.prototype.isTerminal()`。

```diff
  using file = await Deno.open("/dev/tty6");

- Deno.isatty(file.rid);
+ file.isTerminal();
```

```diff
- Deno.isatty(Deno.stdin.rid);
+ Deno.stdin.isTerminal();
```

```diff
- Deno.isatty(Deno.stdout.rid);
+ Deno.stdout.isTerminal();
```

```diff
- Deno.isatty(Deno.stderr.rid);
+ Deno.stderr.isTerminal();
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.iter()`

请改用来自标准库的
[`iterateReader()`](https://jsr.io/@std/io/doc/iterate-reader/~/iterateReader)。

```diff
+ import { iterateReader } from "jsr:@std/io/iterate-reader";

- for await (const chunk of Deno.iter(Deno.stdout)) {
+ for await (const chunk of iterateReader(Deno.stdout)) {
  // ...
}
```

```diff
+ import { iterateReaderSync } from "jsr:@std/io/iterate-reader";

  using file = await Deno.open("/foo/bar.txt");

- for await (const chunk of Deno.iter(file)) {
+ for await (const chunk of iterateReader(file)) {
  // ...
}
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.iterSync()`

请改用来自标准库的
[`iterateReaderSync()`](https://jsr.io/@std/io/doc/iterate-reader/~/iterateReaderSync)。

```diff
+ import { iterateReaderSync } from "jsr:@std/io/iterate-reader";

- for (const chunk of Deno.iterSync(Deno.stdout)) {
+ for (const chunk of iterateReaderSync(Deno.stdout)) {
  // ...
}
```

```diff
+ import { iterateReaderSync } from "jsr:@std/io/iterate-reader";

  using file = await Deno.open("/foo/bar.txt");

- for (const chunk of Deno.iterSync(file)) {
+ for (const chunk of iterateReaderSync(file)) {
  // ...
}
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.Listener.prototype.rid`

请改用 [`Deno.Listener`](https://docs.deno.com/api/deno/~/Deno.Listener) 实例方法。

```diff
  const listener = Deno.listen({ port: 80 })

- Deno.close(listener.rid);
+ listener.close();
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.ListenTlsOptions.certChain`

请改用
[`cert`](https://docs.deno.com/api/deno/~/Deno.ListenTlsOptions#property_cert)
选项。

```diff
using listener = Deno.listenTls({
  port: 443,
- certChain: Deno.readTextFile("./server.crt"),
+ cert: Deno.readTextFile("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

- `Deno.ListenTlsOptions.certFile`

将证书文件内容传递给
[`cert`](https://docs.deno.com/api/deno/~/Deno.ListenTlsOptions#property_cert)
选项。

```diff
using listener = Deno.listenTls({
  port: 443,
- certFile: "./server.crt",
+ cert: Deno.readTextFile("./server.crt"),
  key: Deno.readTextFileSync("./server.key"),
});
```

有关详细信息，请参阅 [deno#12639](https://github.com/denoland/deno/issues/12639)。

- `Deno.ListenTlsOptions.keyFile`

将密钥文件内容传递给
[`key`](https://docs.deno.com/api/deno/~/Deno.ListenTlsOptions#property_key)
选项。

```diff
using listener = Deno.listenTls({
  port: 443,
  cert: Deno.readTextFile("./server.crt"),
- keyFile: "./server.key",
+ key: Deno.readTextFileSync("./server.key"),
});
```

有关详细信息，请参阅 [deno#12639](https://github.com/denoland/deno/issues/12639)。

- `Deno.metrics()`

此符号没有替代 API。

- `Deno.readAllSync()`

请改用来自标准库的 [`readAllSync()`](https://jsr.io/@std/io/doc/read-all/~/readAllSync)。

```diff
+ import { readAllSync } from "jsr:@std/io/read-all";

- const data = Deno.readAllSync(Deno.stdin);
+ const data = readAllSync(Deno.stdin);
```

```diff
+ import { readAllSync } from "jsr:@std/io/read-all";

  using file = Deno.openSync("/foo/bar.txt", { read: true });

- const data = Deno.readAllSync(file);
+ const data = readAllSync(file);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.readAll()`

请改用来自标准库的 [`readAll()`](https://jsr.io/@std/io/doc/read-all/~/readAll)。

```diff
+ import { readAll } from "jsr:@std/io/read-all";

- const data = await Deno.readAll(Deno.stdin);
+ const data = await readAll(Deno.stdin);
```

```diff
+ import { readAll } from "jsr:@std/io/read-all";

  using file = await Deno.open("/foo/bar.txt", { read: true });

- const data = await Deno.readAll(file);
+ const data = await readAll(file);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.Reader`

请改用来自标准库的 [`Reader`](https://jsr.io/@std/io/doc/~/Reader)。

```diff
+ import type { Reader } from "jsr:@std/io/types";

- function foo(closer: Deno.Reader) {
+ function foo(closer: Reader) {
  // ...  
}
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.ReaderSync`

请改用来自标准库的 [`ReaderSync`](https://jsr.io/@std/io/doc/~/ReaderSync)。

```diff
+ import type { ReaderSync } from "jsr:@std/io/types";

- function foo(reader: Deno.ReaderSync) {
+ function foo(reader: ReaderSync) {
  // ...  
}
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.readSync()`

请改用资源的 `.readSync()` 方法。

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new Uint8Array(1_024);

- Deno.readSync(conn.rid, buffer);
+ conn.readSync(buffer);
```

```diff
  using file = Deno.openSync("/foo/bar.txt");
  const buffer = new Uint8Array(1_024);

- Deno.readSync(file.rid, buffer);
+ file.readSync(buffer);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.read()`

请改用资源的 `.read()` 方法。

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new Uint8Array(1_024);

- await Deno.read(conn.rid, buffer);
+ await conn.read(buffer);
```

```diff
  using file = await Deno.open("/foo/bar.txt");
  const buffer = new Uint8Array(1_024);

- await Deno.read(file.rid, buffer);
+ await file.read(buffer);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.resources()`

此符号没有替代 API，因为资源 ID（RID）正在逐渐被淘汰。

- `Deno.run()`

请改用 [`new Deno.Command()`](https://docs.deno.com/api/deno/~/Deno.Command)。

```diff
- const process = Deno.run({ cmd: [ "echo", "hello world" ], stdout: "piped" });
- const [{ success }, stdout] = await Promise.all([
-   process.status(),
-   process.output(),
- ]);
- process.close();
+ const command = new Deno.Command("echo", {
+   args: ["hello world"]
+ });
+ const { success, stdout } = await command.output();
  console.log(success);
  console.log(new TextDecoder().decode(stdout));
```

注意：这个符号在 Deno 2 中被软删除。它的类型已被删除，但其实现仍然存在以减少断裂性变化。你可以通过使用
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
指令来忽略 “属性不存在” 的 TypeScript 错误。

```diff
+ // @ts-ignore `Deno.run()` is soft-removed as of Deno 2.
  const process = Deno.run({ cmd: [ "echo", "hello world" ], stdout: "piped" });
  const [{ success }, stdout] = await Promise.all([
    process.status(),
    process.output(),
  ]);
  process.close();
  console.log(success);
  console.log(new TextDecoder().decode(stdout));
```

有关详细信息，请参阅 [deno#16516](https://github.com/denoland/deno/pull/16516)。

- `Deno.Seeker`

请改用来自标准库的 [`Seeker`](https://jsr.io/@std/io/doc/types/~/Seeker)。

```diff
+ import type { Seeker } from "jsr:@std/io/types";

- function foo(seeker: Deno.Seeker) {
+ function foo(seeker: Seeker) {
  // ...  
}
```

- `Deno.SeekerSync`

请改用来自标准库的 [`SeekerSync`](https://jsr.io/@std/io/doc/types/~/SeekerSync)。

```diff
+ import type { SeekerSync } from "jsr:@std/io/types";

- function foo(seeker: Deno.SeekerSync) {
+ function foo(seeker: SeekerSync) {
  // ...  
}
```

- `Deno.seekSync()`

请改用
[`Deno.FsFile.prototype.seekSync()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.seekSync)。

```diff
  using file = await Deno.open("/foo/bar.txt");

- Deno.seekSync(file.rid, 6, Deno.SeekMode.Start);
+ file.seekSync(6, Deno.SeekMode.Start);
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.seek()`

请改用
[`Deno.FsFile.prototype.seek()`](https://docs.deno.com/api/deno/~/Deno.FsFile.prototype.seek)。

```diff
  using file = await Deno.open("/foo/bar.txt");

- await Deno.seek(file.rid, 6, Deno.SeekMode.Start);
+ await file.seek(6, Deno.SeekMode.Start);
```

有关详细信息，请参阅 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.serveHttp()`

请改用 [`Deno.serve()`](https://docs.deno.com/api/deno/~/Deno.serve)。

```diff
- const conn = Deno.listen({ port: 80 });
- const httpConn = Deno.serveHttp(await conn.accept());
- const e = await httpConn.nextRequest();
- if (e) {
-  e.respondWith(new Response("Hello World"));
- }
+ Deno.serve({ port: 80 }, () => new Response("Hello World"));
```

注意：这个符号在 Deno 2 中被软删除。它的类型已被删除，但其实现仍然存在以减少断裂性变化。你可以通过使用
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
指令来忽略 “属性不存在” 的 TypeScript 错误。

```diff
  const conn = Deno.listen({ port: 80 });
+ // @ts-ignore `Deno.serveHttp()` is soft-removed as of Deno 2.
  const httpConn = Deno.serveHttp(await conn.accept());
  const e = await httpConn.nextRequest();
  if (e) {
   e.respondWith(new Response("Hello World"));
  }
```

有关详细信息，请参见
[Deno 1.35 博客文章](https://deno.com/blog/v1.35#denoserve-is-now-stable)。

- `Deno.Server`

请改用 [`Deno.HttpServer`](https://docs.deno.com/api/deno/~/Deno.HttpServer)。

```diff
- function foo(server: Deno.Server) {
+ function foo(server: Deno.HttpServer) {
  // ...  
}
```

有关详细信息，请参阅 [deno#20840](https://github.com/denoland/deno/issues/20840)。

- `Deno.shutdown()`

请改用
[`Deno.Conn.closeWrite()`](https://docs.deno.com/api/deno/~/Deno.Conn#method_closeWrite_0)。

```diff
  using conn = await Deno.connect({ port: 80 });

- await Deno.shutdown(conn.rid);
+ await conn.closeWrite();
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.stderr.prototype.rid`

请改用 [`Deno.stderr`](https://docs.deno.com/api/deno/~/Deno.stderr) 实例方法。

```diff
- if (Deno.isatty(Deno.stderr.rid)) {
+ if (Deno.stderr.isTerminal()) {
    console.log("`Deno.stderr` is a terminal");
  }

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(Deno.stderr.rid, data);
+ await Deno.stderr.write(data);

- Deno.close(Deno.stderr.rid);
+ Deno.stderr.close();
```

注意：这个符号在 Deno 2 中被软删除。它的类型已被删除，但其实现仍然存在以减少断裂性变化。你可以通过使用
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
指令来忽略 “属性不存在” 的 TypeScript 错误。

```diff
+ // @ts-ignore `Deno.stderr.rid` is soft-removed as of Deno 2.
  Deno.isatty(Deno.stderr.rid);
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.stdin.prototype.rid`

请改用 [`Deno.stdin`](https://docs.deno.com/api/deno/~/Deno.stdin) 实例方法。

```diff
- if (Deno.isatty(Deno.stdin.rid)) {
+ if (Deno.stdin.isTerminal()) {
    console.log("`Deno.stdout` is a terminal");
  }

  const buffer = new Uint8Array(1_024);
- await Deno.write(Deno.stdin.rid, buffer);
+ await Deno.stdin.write(buffer);

- Deno.close(Deno.stdin.rid);
+ Deno.stdin.close();
```

注意：这个符号在 Deno 2 中被软删除。它的类型已被删除，但其实现仍然存在以减少断裂性变化。你可以通过使用
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
指令来忽略 “属性不存在” 的 TypeScript 错误。

```diff
+ // @ts-ignore `Deno.stdin.rid` is soft-removed as of Deno 2.
  Deno.isatty(Deno.stdin.rid);
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.stdout.prototype.rid`

请改用 [`Deno.stdout`](https://docs.deno.com/api/deno/~/Deno.stdout) 实例方法。

```diff
- if (Deno.isatty(Deno.stdout.rid)) {
+ if (Deno.stdout.isTerminal()) {
    console.log("`Deno.stdout` is a terminal");
  }

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(Deno.stdout.rid, data);
+ await Deno.stdout.write(data);

- Deno.close(Deno.stdout.rid);
+ Deno.stdout.close();
```

注意：这个符号在 Deno 2 中被软删除。它的类型已被删除，但其实现仍然存在以减少断裂性变化。你可以通过使用
[`@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#suppress-errors-in-ts-files-using--ts-ignore-comments)
指令来忽略 “属性不存在” 的 TypeScript 错误。

```diff
+ // @ts-ignore `Deno.stdout.rid` is soft-removed as of Deno 2.
  Deno.isatty(Deno.stdout.rid);
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.TcpConn.prototype.rid`

请改用 [`Deno.TcpConn`](https://docs.deno.com/api/deno/~/Deno.TcpConn) 实例方法。

```diff
  using tcpConn = await Deno.connect({ port: 80 });

  const buffer = new Uint8Array(1_024);
- await Deno.read(tcpConn.rid, buffer);
+ await tcpConn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(tcpConn.rid, data);
+ await tcpConn.write(data);

- await Deno.shutdown(tcpConn.rid);
+ await tcpConn.closeWrite();

- Deno.close(tcpConn.rid);
+ tcpConn.close();
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.TlsConn.prototype.rid`

请改用 [`Deno.TlsConn`](https://docs.deno.com/api/deno/~/Deno.TlsConn) 实例方法。

```diff
  const caCert = await Deno.readTextFile("./certs/my_custom_root_CA.pem");
  using tlsConn = await Deno.connectTls({ caCerts: [caCert], hostname: "192.0.2.1", port: 80 });

  const buffer = new Uint8Array(1_024);
- await Deno.read(tlsConn.rid, buffer);
+ await tlsConn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(tlsConn.rid, data);
+ await tlsConn.write(data);

- await Deno.shutdown(tlsConn.rid);
+ await tlsConn.closeWrite();

- Deno.close(tlsConn.rid);
+ tlsConn.close();
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.TlsListener.prototype.rid`

请改用 [`Deno.TlsListener`](https://docs.deno.com/api/deno/~/Deno.TlsListener)
实例方法。

```diff
  const listener = Deno.listenTls({
    port: 443,
    cert: Deno.readTextFileSync("./server.crt"),
    key: Deno.readTextFileSync("./server.key"),
  });

  // ...

- Deno.close(listener.rid);
+ listener.close();
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.UnixConn.prototype.rid`

请改用 [`Deno.UnixConn`](https://docs.deno.com/api/deno/~/Deno.UnixConn) 实例方法。

```diff
  using unixConn = await Deno.connect({ path: "/foo/bar.sock", transport: "unix" });

  const buffer = new Uint8Array(1_024);
- await Deno.read(unixConn.rid, buffer);
+ await unixConn.read(buffer);

  const data = new TextEncoder().encode("Hello, world!");
- await Deno.write(unixConn.rid, data);
+ await unixConn.write(data);

- await Deno.shutdown(unixConn.rid);
+ await unixConn.closeWrite();

- Deno.close(unixConn.rid);
+ unixConn.close();
```

有关详细信息，请参见 [Deno 1.40 博客文章][Deno 1.40 博客文章]。

- `Deno.writeAllSync()`

请改用来自标准库的 [`writeAllSync()`](https://jsr.io/@std/io/doc/~/writeAllSync)。

```diff
+ import { writeAllSync } from "jsr:@std/io/write-all";

  const data = new TextEncoder().encode("Hello, world!");

- Deno.writeAllSync(Deno.stdout, data);
+ writeAllSync(Deno.stdout, data);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.writeAll()`

请改用来自标准库的 [`writeAll()`](https://jsr.io/@std/io/doc/~/writeAll)。

```diff
+ import { writeAll } from "jsr:@std/io/write-all";

  const data = new TextEncoder().encode("Hello, world!");

- await Deno.writeAll(Deno.stdout, data);
+ await writeAll(Deno.stdout, data);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.Writer`

请改用来自标准库的 [Writer](https://jsr.io/@std/io/doc/~/Writer)。

```diff
+ import type { Writer } from "jsr:@std/io/types";

- function foo(writer: Deno.Writer) {
+ function foo(writer: Writer) {
  // ...  
}
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.WriterSync`

请改用来自标准库的 [WriterSync](https://jsr.io/@std/io/doc/~/WriterSync)。

```diff
+ import type { WriterSync } from "jsr:@std/io/types";

- function foo(writer: Deno.WriterSync) {
+ function foo(writer: WriterSync) {
  // ...  
}
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.writeSync()`

请改用资源的 `.writeSync()` 方法。

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new TextEncoder().encode("My message");

- Deno.writeSync(conn.rid, buffer);
+ conn.writeSync(buffer);
```

```diff
  using file = Deno.openSync("/foo/bar.txt", { write: true });
  const buffer = new TextEncoder().encode("My message");

- Deno.writeSync(file.rid, buffer);
+ file.writeSync(buffer);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `Deno.write()`

请改用资源的 `.write()` 方法。

```diff
  using conn = await Deno.connect({ port: 80 });
  const buffer = new TextEncoder().encode("My message");

- await Deno.write(conn.rid, buffer);
+ await conn.write(buffer);
```

```diff
  using file = await Deno.open("/foo/bar.txt", { write: true });
  const buffer = new TextEncoder().encode("My message");

- await Deno.write(file.rid, buffer);
+ await file.write(buffer);
```

有关详细信息，请参阅 [deno#9795][deno#9795]。

- `new Deno.FsFile()`

请改用 [`Deno.openSync()`](https://docs.deno.com/api/deno/~/Deno.openSync) 或
[`Deno.open()`](https://docs.deno.com/api/deno/~/Deno.open)。

```diff
- const file = new Deno.FsFile(3);
+ using file = await Deno.open("/foo/bar.txt");
```

- `window`

请改用 `globalThis`。

```diff
  const messageBuffer = new TextEncoder().encode("Hello, world!");
  
- const hashBuffer = await window.crypto.subtle.digest("SHA-256", messageBuffer);
+ const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", messageBuffer);
```

请参见 [deno#9795][deno#9795]。

[deno#9795]: https://github.com/denoland/deno/issues/9795
[Deno 1.40 博客文章]: https://deno.com/blog/v1.40#deprecations-stabilizations-and-removals