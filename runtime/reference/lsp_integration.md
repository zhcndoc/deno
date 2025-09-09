---
title: "Language Server Integration"
description: "Technical guide to integrating Deno's Language Server Protocol (LSP). Learn about LSP implementation details, custom commands, requests, notifications, and testing API integration for editor and tool developers."
oldUrl:
  - /runtime/manual/reference/lsp/
  - /runtime/manual/advanced/language_server/overview/
  - /runtime/manual/advanced/language_server/imports/
  - /runtime/manual/advanced/language_server/testing_api/
  - /runtime/reference/cli/lsp_integration/
---

:::tip

如果您在寻找如何使用 Deno 的 LSP 以及各种编辑器的信息，请访问
[设置您的环境页面](/runtime/getting_started/setup_your_environment/)。

:::

Deno CLI 内置一个语言服务器，可以提供智能的编辑体验，以及一种轻松访问 Deno 中内置的其他工具的方法。对于大多数用户而言，使用语言服务器将通过 [Visual Studio Code](/runtime/reference/vscode/) 或 [其他编辑器](/runtime/getting_started/setup_your_environment/) 来实现。

此页面针对的是创建语言服务器集成或提供与 Deno 智能集成的包注册表的开发者。

Deno 语言服务器提供了 [语言服务器协议](https://microsoft.github.io/language-server-protocol/) 的服务端实现，特别设计为提供代码的 _Deno_ 视图。它集成在命令行中，并可以通过 `lsp` 子命令启动。

## 结构

当语言服务器启动时，会创建一个 `LanguageServer` 实例，该实例持有语言服务器的所有状态。它还定义了客户端通过语言服务器 RPC 协议调用的所有方法。

## 设置

语言服务器支持一系列的工作区设置：

- `deno.enable`
- `deno.enablePaths`
- `deno.cache`
- `deno.certificateStores`
- `deno.config`
- `deno.importMap`
- `deno.internalDebug`
- `deno.codeLens.implementations`
- `deno.codeLens.references`
- `deno.codeLens.referencesAllFunctions`
- `deno.codeLens.test`
- `deno.suggest.completeFunctionCalls`
- `deno.suggest.names`
- `deno.suggest.paths`
- `deno.suggest.autoImports`
- `deno.suggest.imports.autoDiscover`
- `deno.suggest.imports.hosts`
- `deno.lint`
- `deno.tlsCertificate`
- `deno.unsafelyIgnoreCertificateErrors`
- `deno.unstable`

此外，语言服务器还支持按资源的设置：

- `deno.enable`
- `deno.enablePaths`
- `deno.codeLens.test`

Deno 在语言服务器进程的多个点分析这些设置。首先，当来自客户端的 `initialize` 请求到达时，`initializationOptions` 将被视为一个表示 `deno` 命名空间选项的对象。例如，以下值将为该实例的语言服务器启用不稳定 API：

```json
{
  "enable": true,
  "unstable": true
}
```

当语言服务器接收到 `workspace/didChangeConfiguration` 通知时，它将评估客户端是否指示是否具有 `workspaceConfiguration` 功能。如果有，它将发送一个 `workspace/configuration` 请求，其中将包括请求工作区配置以及语言服务器当前跟踪的所有 URI 的配置。

如果客户端具有 `workspaceConfiguration` 功能，语言服务器将在收到 `textDocument/didOpen` 通知时发送一个 URI 的配置请求，以获取特定于资源的设置。

如果客户端没有 `workspaceConfiguration` 功能，语言服务器将假设工作区设置适用于所有资源。

## 命令

语言服务器可能会向客户端发出几条命令，客户端预计将实现这些命令：

### .cache

`deno.cache` 作为解析代码操作发送，当有未缓存的模块说明被导入到模块时发送。它将以包含作为字符串的已解析说明符的参数发送。

### showReferences

`deno.showReferences` 作为某些代码透镜上的命令发送，以显示引用位置。参数包含该命令的主题说明符、目标的起始位置和要显示的引用的位置。

### test

`deno.test` 作为测试代码透镜的一部分发送，客户端应根据参数运行测试，这些参数是测试所在的说明符和用于过滤测试的测试名称。

## 请求

LSP 当前支持以下自定义请求。客户端应实现这些请求，以便拥有一个与 Deno 完美集成的完全功能的客户端：

### /cache

`deno/cache` 将指示 Deno 尝试缓存模块及其所有依赖项。如果仅传递一个 `referrer`，则将加载模块说明符的所有依赖项。如果 `uris` 中有值，则仅缓存那些 `uris`。

它期望参数为：

```ts
interface CacheParams {
  referrer: TextDocumentIdentifier;
  uris: TextDocumentIdentifier[];
}
```

### performance

`deno/performance` 请求返回 Deno 内部仪器化的平均时机。它不期望任何参数。

### reloadImportRegistries

`deno/reloadImportRegistries` 重新加载来自导入注册表的任何缓存响应。它不期望任何参数。

### virtualTextDocument

`deno/virtualTextDocument` 请求从 LSP 生成一个虚拟文本文档，这是一个只读文档，可以在客户端显示。这让客户端能够访问 Deno 缓存中的文档，如远程模块和内置于 Deno 的 TypeScript 库文件。Deno 语言服务器将在自定义架构 `deno:` 下编码所有内部文件，因此客户端应将所有针对 `deno:` 架构的请求路由回 `deno/virtualTextDocument` API。

它还支持一个特殊的 URL `deno:/status.md`，该 URL 提供一个 markdown 格式的文本文档，其中包含有关 LSP 状态的详细信息以供用户显示。

它期望参数为：

```ts
interface VirtualTextDocumentParams {
  textDocument: TextDocumentIdentifier;
}
```

### task

`deno/task` 请求返回可用的 Deno 任务，请参阅 [task_runner](/runtime/reference/cli/task_runner/)。它不期望任何参数。

## 通知

当前有一个自定义通知从服务器发送到客户端，`deno/registryState`。当 `deno.suggest.imports.autoDiscover` 为 `true`，且待添加到文档中的导入的源未在 `deno.suggest.imports.hosts` 中明确设置时，将检查源并向客户端发送状态通知。

接收到通知时，如果参数 `suggestion` 为 `true`，客户端应向用户提供选择，以启用该源并将其添加到 `deno.suggest.imports.hosts` 的配置中。如果 `suggestion` 为 `false`，客户端应将其添加到配置中作为 `false`，以阻止语言服务器尝试检测建议是否被支持。

通知的参数为：

```ts
interface RegistryStatusNotificationParams {
  origin: string;
  suggestions: boolean;
}
```

## 语言 ID

语言服务器支持以下 [文本文档语言 ID](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocumentItem) 的诊断和格式化：

- `"javascript"`
- `"javascriptreact"`
- `"jsx"` _非标准，与 `javascriptreact` 相同_
- `"typescript"`
- `"typescriptreact"`
- `"tsx"` _非标准，与 `typescriptreact` 相同_

语言服务器仅支持以下语言 ID 的格式化：

- `"json"`
- `"jsonc"`
- `"markdown"`

## 测试

Deno 语言服务器支持一组自定义 API 来启用测试。这些 API 基于提供信息以启用 [vscode 的测试 API](https://code.visualstudio.com/api/extension-guides/testing)，但其他语言服务器客户端也可以使用来提供类似的接口。

客户端与服务器都应支持实验性的 `testingApi` 功能：

```ts
interface ClientCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

```ts
interface ServerCapabilities {
  experimental?: {
    testingApi: boolean;
  };
}
```

当支持测试 API 的 Deno 版本遇到支持该功能的客户端时，它将初始化处理测试检测的代码，并开始提供启用它的通知。

还需要注意的是，当启用测试 API 功能时，测试代码透镜将不再发送到客户端。

### 测试设置

有特定的设置可以改变语言服务器的行为：

- `deno.testing.args` - 在执行测试时将提供的字符串数组作为参数。这与 `deno test` 子命令的作用相同。
- `deno.testing.enable` - 一个二进制标志，用于启用或禁用测试服务器

### 测试通知

服务器会在某些条件下向客户端发送通知。

#### deno/testModule

当服务器发现包含测试的模块时，它将通过发送 `deno/testModule` 通知以及 `TestModuleParams` 的有效载荷来通知客户端。

Deno 以这种方式构建：

- 一个模块可以包含 _n_ 个测试。
- 一个测试可以包含 _n_ 个步骤。
- 一个步骤可以包含 _n_ 个步骤。

当 Deno 进行测试模块的静态分析时，它会尝试识别任何测试和测试步骤。由于测试在 Deno 中的声明方式是动态的，因此不能总是静态识别，只有在模块执行时才能识别。当更新客户端时，该通知被设计为处理这两种情况。当静态发现测试时，通知 `kind` 将是 `"replace"`；当在执行时发现测试或步骤时，通知 `kind` 将是 `"insert"`。

当在编辑器中编辑测试文档，并从客户端接收到 `textDocument/didChange` 通知时，该变更的静态分析将在服务器端执行，如果测试已更改，客户端将接收到通知。

当客户端收到 `"replace"` 通知时，它可以安全地“替换”测试模块表示，当收到 `"insert"` 时，应递归尝试添加到现有表示中。

对于测试模块，`textDocument.uri` 应该用作所有表示的唯一 ID（因为它是唯一模块的字符串 URL）。`TestData` 项包含一个唯一的 `id` 字符串。此 `id` 字符串是服务器跟踪的识别信息的 SHA-256 哈希。

```ts
interface TestData {
  /** 此测试/步骤的唯一 ID。 */
  id: string;

  /** 测试/步骤的显示标签。 */
  label: string;

  /** 与此测试/步骤相关的任何测试步骤 */
  steps?: TestData[];

  /** 适用于测试的拥有文本文档的范围。 */
  range?: Range;
}

interface TestModuleParams {
  /** 与测试相关的文本文档标识符。 */
  textDocument: TextDocumentIdentifier;

  /** 如果描述的测试是 _新发现_ 的，并应 _插入_ 或如果相关的测试是现有测试的替代品的指示。 */
  kind: "insert" | "replace";

  /** 测试模块的文本标签。 */
  label: string;

  /** 由此测试模块拥有的一数组测试。 */
  tests: TestData[];
}
```

#### deno/testModuleDelete

当服务器观察到的测试模块被删除时，服务器将发出 `deno/testModuleDelete` 通知。接收到通知时，客户端应删除测试模块及其所有子测试和测试步骤的表示。

```ts
interface TestModuleDeleteParams {
  /** 已被移除的文本文档标识符。 */
  textDocument: TextDocumentIdentifier;
}
```

#### deno/testRunProgress

当从客户端请求 [`deno/testRun`](#denotestrun) 时，服务器将通过 `deno/testRunProgress` 通知支持该测试运行的进度。

客户端应处理这些消息并更新任何 UI 表示。

状态变化在 `TestRunProgressParams` 的 `.message.kind` 属性中表示。状态为：

- `"enqueued"` - 一个测试或测试步骤已经排队等待测试。
- `"skipped"` - 一个测试或测试步骤被跳过。这发生在 Deno 测试中设置了 `ignore` 选项为 `true`。
- `"started"` - 一个测试或测试步骤已开始。
- `"passed"` - 一个测试或测试步骤已通过。
- `"failed"` - 一个测试或测试步骤已失败。这旨在表明测试工具中的错误，而不是测试本身，但目前 Deno 不支持这种区分。
- `"errored"` - 测试或测试步骤出现错误。关于错误的额外信息将位于 `.message.messages` 属性中。
- `"end"` - 测试运行已结束。

```ts
interface TestIdentifier {
  /** 与消息相关的测试模块。 */
  textDocument: TextDocumentIdentifier;

  /** 测试的可选 ID。如果未提供，则消息适用于测试模块中的所有测试。 */
  id?: string;

  /** 步骤的可选 ID。如果未提供，则消息仅适用于测试。 */
  stepId?: string;
}

interface TestMessage {
  /** 消息的内容。 */
  message: MarkupContent;

  /** 表示预期输出的可选字符串。 */
  expectedOutput?: string;

  /** 表示实际输出的可选字符串。 */
  actualOutput?: string;

  /** 与消息相关的可选位置。 */
  location?: Location;
}

interface TestEnqueuedStartedSkipped {
  /** 某个特定测试或测试步骤发生的状态变化。
   *
   * - `"enqueued"` - 测试现在已排队待测试
   * - `"started"` - 测试已开始
   * - `"skipped"` - 测试被跳过
   */
  type: "enqueued" | "started" | "skipped";

  /** 与状态变化相关的测试或测试步骤。 */
  test: TestIdentifier;
}

interface TestFailedErrored {
  /** 某个特定测试或测试步骤发生的状态变化。
   *
   * - `"failed"` - 测试未能正常运行，而是测试出现错误。
   *   当前 Deno 语言服务器不支持此。
   * - `"errored"` - 测试出现错误。
   */
  type: "failed" | "errored";

  /** 与状态变化相关的测试或测试步骤。 */
  test: TestIdentifier;

  /** 与状态变化相关的消息。 */
  messages: TestMessage[];

  /** 从开始到当前状态的可选持续时间，以毫秒为单位。 */
  duration?: number;
}

interface TestPassed {
  /** 某个特定测试或测试步骤发生的状态变化。 */
  type: "passed";

  /** 与状态变化相关的测试或测试步骤。 */
  test: TestIdentifier;

  /** 从开始到当前状态的可选持续时间，以毫秒为单位。 */
  duration?: number;
}

interface TestOutput {
  /** 测试或测试步骤输出信息/记录信息。 */
  type: "output";

  /** 输出的值。 */
  value: string;

  /** 如果有，相关的测试或测试步骤。 */
  test?: TestIdentifier;

  /** 与输出相关的可选位置。 */
  location?: Location;
}

interface TestEnd {
  /** 测试运行已结束。 */
  type: "end";
}

type TestRunProgressMessage =
  | TestEnqueuedStartedSkipped
  | TestFailedErrored
  | TestPassed
  | TestOutput
  | TestEnd;

interface TestRunProgressParams {
  /** 适用的测试运行 ID 的进度消息。 */
  id: number;

  /** 消息 */
  message: TestRunProgressMessage;
}
```

### 测试请求

服务器处理两种不同的请求：

#### deno/testRun

要请求语言服务器执行一组测试，客户端发送 `deno/testRun` 请求，其中包括将用于将来对客户端的响应的测试运行 ID、测试运行的类型，以及要包含或排除的测试模块或测试。

当前 Deno 仅支持 `"run"` 类型的测试运行。`"debug"` 和 `"coverage"` 计划在未来支持。

当没有包含的测试模块或测试时，意味着应该执行所有发现的测试模块和测试。当一个测试模块被包含，但没有任何测试 ID 时，意味着应包含该测试模块中的所有测试。一旦识别出所有测试，将排除的测试将被移除，并在响应中作为 `"enqueued"` 返回解析的测试集。

通过此 API 无法包含或排除测试步骤，因为测试步骤的声明和运行方式是动态的。

```ts
interface TestRunRequestParams {
  /** 用于将来消息的测试运行 ID。 */
  id: number;

  /** 运行类型。目前 Deno 仅支持 `"run"` */
  kind: "run" | "coverage" | "debug";

  /** 要排除的测试模块或测试。 */
  exclude?: TestIdentifier[];

  /** 在测试运行中要包括的测试模块或测试。 */
  include?: TestIdentifier[];
}

interface EnqueuedTestModule {
  /** 与排队的测试 ID 相关的测试模块 */
  textDocument: TextDocumentIdentifier;

  /** 当前已排队等待测试的测试 ID */
  ids: string[];
}

interface TestRunResponseParams {
  /** 当前已排队等待测试的测试模块和测试 ID。 */
  enqueued: EnqueuedTestModule[];
}
```

#### deno/testRunCancel

如果客户端希望取消正在运行的测试运行，则发送 `deno/testRunCancel` 请求以取消测试 ID。返回的响应将是一个布尔值 `true`，表示测试已取消，或 `false`，表示无法取消。适当的测试进度通知仍会在测试取消时发送。

```ts
interface TestRunCancelParams {
  /** 要取消的测试 ID。 */
  id: number;
}
```