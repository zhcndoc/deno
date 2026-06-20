---
last_modified: 2026-06-16
title: "自动更新"
description: "使用 Deno.autoUpdate() 将二进制差异更新推送到 deno 桌面应用：bsdiff 补丁、清单轮询、在启动失败时自动回滚。"
---

:::info 即将登陆 Deno 2.9

`deno desktop` 将随 Deno v2.9.0 发布，但目前尚未进入稳定版。要立即试用，请运行 `deno upgrade canary` 来安装
[`canary`](/runtime/reference/cli/upgrade/) 构建。该命令、配置键以及 TypeScript API 在功能稳定之前仍可能发生变化。

:::

[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) 会轮询发布服务器以获取新版本，下载二进制差异补丁，将其应用到运行时 dylib，并为下次启动做好暂存。如果下一次启动失败，运行时会自动回滚到之前的版本。更新会以较小的 `bsdiff`
补丁形式发布，而不是完整的二进制下载，并且回滚机制已内置到启动器中。

:::note 平台支持

应用已暂存的更新以及在启动失败时回滚，目前仅在
**macOS 和 Linux** 上运行。在 Windows 上，补丁仍会被下载并暂存，
但启动器尚不会将其替换进去（已加载的 DLL 不能原地替换），因此更新不会生效。请将 Windows 自动更新视为尚未支持。

:::

## 前置条件

需要两项配置：

1. 在你的 `deno.json` 中设置一个 `version`：
   ```jsonc
   { "version": "1.4.0" }
   ```
2. 在你的 `deno.json` 中设置一个 `desktop.release.baseUrl`：
   ```jsonc
   {
     "desktop": {
       "release": { "baseUrl": "https://releases.example.com/my-app" }
     }
   }
   ```

这两项都会被写入编译后的二进制文件。该版本可在运行时通过
[`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion) 获取：

```ts
console.log(Deno.desktopVersion); // "1.4.0"，如果未设置版本则为 null
```

如果 [`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion) 为 `null`，
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) 将不会执行任何操作：运行时会提示一次并返回。这在 `deno run` 下也是如此，因为未编译的程序没有写入内置版本。
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) 在这种情况下不会抛出异常，因此你可以将调用保留在代码中，并在开发期间使用 `deno run` 运行同一个入口点。

## 调用 `autoUpdate()`

```ts
Deno.autoUpdate({
  url: "https://releases.example.com/my-app",
  interval: 60 * 60 * 1000, // 每小时
  onUpdateReady(version) {
    console.log("Update", version, "ready; will apply on next launch");
  },
  onRollback(reason) {
    console.warn("Previous launch failed; rolled back:", reason);
  },
});
```

或者传入一个 URL 字符串，在启动时仅做一次检查：

```ts
Deno.autoUpdate("https://releases.example.com/my-app");
```

| 选项            | 类型                         | 说明                                                                                                            |
| --------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `url`           | `string`                     | 如果 `deno.json` 中未设置 `desktop.release.baseUrl`，则为必需项。                                               |
| `interval`      | `number`（毫秒）             | 轮询间隔。如果省略，则只执行一次检查。                                                                          |
| `onUpdateReady` | `(version: string) => void`  | 当补丁被应用并暂存以供下次启动时调用一次。                                                                      |
| `onRollback`    | `(reason: string) => void`   | 如果上一次启动失败，则会在本次调用后不久触发。                                                                  |
| `publicKey`     | `string`                     | Base64 编码的 Ed25519 公钥。设置后，清单必须经过签名（参见 [签名清单](#signed-manifests)）。                   |

## 清单格式

运行时会获取 `<url>/latest.json` 并将其解析为 JSON。每个补丁条目都是一个对象，包含补丁文件名及其 **SHA-256 哈希**：

```json
{
  "version": "1.5.0",
  "patches": {
    "1.4.0": { "name": "patch-1.4.0-to-1.5.0.bin", "sha256": "<64-hex-chars>" },
    "1.4.1": { "name": "patch-1.4.1-to-1.5.0.bin", "sha256": "<64-hex-chars>" },
    "1.3.9": { "name": "patch-1.3.9-to-1.5.0.bin", "sha256": "<64-hex-chars>" }
  }
}
```

| 字段      | 含义                                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version` | 可用的最新版本。会与 [`Deno.desktopVersion`](/api/deno/~/Deno.desktopVersion) 进行比较。                                                                     |
| `patches` | 从版本到 `{ name, sha256 }` 的映射。`name` 是相对于清单 URL 的补丁文件名；`sha256` 是补丁字节的十六进制小写 SHA-256 值。 |

`sha256` 是**必需的**：运行时不会应用其字节哈希值与声明值不符的补丁，因此被篡改或被截断的下载内容绝不会被应用。

如果某些旧版本不再需要支持，可以从 `patches` 中移除。使用这些版本的用户会看到“没有可用的 X 补丁”的消息，并继续停留在当前版本。

更新 URL **必须**使用 `https://`：运行时拒绝轮询明文端点。

### 签名清单

为了获得超出 TLS 的防篡改保护，请使用 Ed25519 密钥对清单签名，并将公钥传递给
[`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate)。当配置了 `publicKey` 时，清单必须是一个封装结构：

```json
{
  "signed": "{\"version\":\"1.5.0\",\"patches\":{ … }}",
  "signature": "<针对 `signed` 字符串的 base64 Ed25519 签名>"
}
```

运行时会使用你的 `publicKey` 对 `signed` 字符串的精确字节验证 `signature`，然后将 `signed` 解析为受信任的清单。为避免依赖规范化 JSON 实现，真实清单会原样嵌入为 `signed` 字符串，其内容才被信任。

```ts
Deno.autoUpdate({
  url: "https://releases.example.com/my-app",
  publicKey: "<base64 编码的 32 字节 Ed25519 公钥>",
});
```

## 更新流程

1. **获取清单。** `GET <url>/latest.json`。如果返回非 2xx 响应，本次检查会静默返回，并等待下一次间隔。
2. **比较版本。** 如果 `manifest.version === Deno.desktopVersion`，则无需操作。
3. **查找补丁。** `manifest.patches[Deno.desktopVersion]` →
   `{ name, sha256 }`。
4. **下载补丁。** `GET <url>/<name>`。整个补丁会缓冲到内存中；对于典型的 bsdiff 输出（几 MB）来说这没问题。
5. **验证并应用。** 运行时会将下载字节与清单中的 `sha256` 进行校验，若不匹配则拒绝继续，然后使用
   [`qbsdiff`](https://crates.io/crates/qbsdiff) crate 将二进制差异应用到应用的运行时 dylib 上。补丁后的字节在暂存之前会经过完整性检查，以确认其看起来像一个原生二进制文件。
6. **暂存结果。** 将补丁后的 dylib 写为 `<dylib>.update`，放在原文件旁边。正在运行的 dylib 保持不变。
7. **触发 `onUpdateReady`。**

在下一次启动前，正在运行的 dylib 都不会被修改。当应用重启时，启动器会在其他任何代码运行之前，把已暂存的更新替换到位。

## 启动失败时回滚

启动器会在启动时、任何其他代码运行之前，解析已暂存更新和回滚状态，使用运行时 dylib 旁边的三个文件：
`<dylib>.update`（已暂存补丁）、`<dylib>.backup`（之前的 dylib）以及
`<dylib>.update-ok`（成功标记）。

- 如果 `<dylib>.update` 存在，启动器会先将当前 dylib 复制一份到
  `<dylib>.backup`（原文件仍保留在原处），再把已暂存更新替换到 dylib 路径中，并启动新版本。一旦成功启动，运行时会调用一个内部的“确认更新”操作，写入 `<dylib>.update-ok`。
- 在之后的某次启动中，如果 `<dylib>.backup` 和 `<dylib>.update-ok` 都存在，
  则说明上一次更新已被确认成功，这两个文件都会被清理。
- 如果 `<dylib>.backup` 存在但 `<dylib>.update-ok` 不存在，则说明上一次更新已启动但从未被确认，意味着它在启动过程中崩溃了。启动器会用 `<dylib>.backup` 恢复 dylib，执行回滚。下一次
  [`Deno.autoUpdate()`](/api/deno/~/Deno.autoUpdate) 调用随后会触发带有原因的 `onRollback`。

这使得损坏的更新能够自我修复。用户无需知道发生了什么，只会看到自己回到了之前的版本。

## 生成补丁

补丁是应用运行时 dylib 在两个版本之间的 `bsdiff` 差异文件，即更新器会打补丁的那个文件，它位于你构建后的应用内部。`qbsdiff` 读取 `bsdiff` 4.x 格式，因此经典的 `bsdiff` CLI 会产生兼容的输出：

```sh
bsdiff old-dylib new-dylib patch-1.4.0-to-1.5.0.bin
shasum -a 256 patch-1.4.0-to-1.5.0.bin # 清单条目的 sha256
```

然后将补丁的 `name` 和 `sha256` 添加到 `latest.json`，并把补丁和清单都上传到你的发布服务器。

如果要发布多个架构（macOS arm64、x86_64；Windows x86_64；Linux
arm64、x86_64），请按架构生成补丁。你可以根据 user-agent 提供正确的清单，或者将所有补丁按架构专属键包含进去，并在客户端选择：

```jsonc
// release/macos-arm64/latest.json
{
  "version": "1.5.0",
  "patches": {
    "1.4.0": { "name": "patch-1.4.0-to-1.5.0.bin", "sha256": "<64-hex-chars>" }
  }
}
```

```ts
const arch = Deno.build.os + "-" + Deno.build.arch;
Deno.autoUpdate({
  url: "https://releases.example.com/" + arch,
  interval: 60 * 60 * 1000,
});
```

## 最佳实践

- **为清单签名。** TLS 加上每个补丁所需的 `sha256` 已经可以阻止被篡改的补丁被应用，但任何能够从你的 URL 提供内容的人，仍然可以推送一个哈希有效的恶意补丁。为了纵深防御，请使用 Ed25519 密钥对清单签名并配置 `publicKey`（参见
  [签名清单](#signed-manifests)）。将私钥保存在发布主机之外。
- **在真实安装环境上测试补丁。** 一个能够顺利应用但会生成无法启动二进制文件的补丁会触发回滚，但这发生在启动失败之后，因此用户会先看到一次短暂的启动失败。请在发布清单之前于 CI 中运行打过补丁的二进制文件。
- **选择合理的间隔。** 对大多数应用而言，每小时检查一次就足够了。比每隔几分钟更频繁地轮询，对你和你的用户来说都是浪费。
- **处理 `onRollback`。** 回滚表示最近的某个发布在至少一台机器上存在问题。请将其记录到遥测系统中，以便尽快发现有问题的发布。
