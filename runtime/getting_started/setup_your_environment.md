---
title: "Set up your environment"
description: "A guide to setting up your development environment for Deno. Learn how to configure popular editors like VS Code, set up language server support, and enable shell completions for better productivity."
oldUrl: /runtime/manual/getting_started/setup_your_environment/
---

Deno 带有很多开发应用程序时常用的工具，包括一个完整的
[语言服务 (LSP)](/runtime/reference/cli/lsp/) 来支持你选择的 IDE。本页面将帮助你设置环境，以便在开发时充分利用 Deno。

我们将涵盖：

- 如何在你喜欢的编辑器/IDE 中使用 Deno
- 如何生成 shell 自动补全

## 设置你的编辑器/IDE

### Visual Studio Code

如果你还没有安装，请从 [官方网站](https://code.visualstudio.com/) 下载并安装 Visual Studio Code。

在扩展选项卡中，搜索 "Deno" 并安装
[Denoland 的扩展](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)。

接下来，按 `Ctrl+Shift+P` 打开命令面板并输入
`Deno: Initialize Workspace Configuration`。选择该选项以配置 Deno
用于你的工作区。

![VSCode 命令面板，选中 Deno: Initialize Workspace Configuration 选项。](./images/vscode-setup.png)

一个名为 `.vscode/settings.json` 的文件将会在你的工作区中创建，包含以下配置：

```json
{
  "deno.enable": true
}
```

就这样！你已经成功设置了使用 VSCode 的 Deno 开发环境。现在你将获得 Deno LSP 所提供的所有好处，包括 IntelliSense、代码格式化、代码检查等。

### JetBrains IDEs

要安装 Deno 插件，打开你的 IDE 并转到 **File** > **Settings**。
导航到 **Plugins** 并搜索 `Deno`。安装官方的 Deno 插件。

![WebStorm 插件设置](./images/webstorm_setup.png)

要配置插件，再次转到 **File** > **Settings**。导航到
**Languages & Frameworks** > **Deno**。勾选 **Enable Deno for your project**
并指定 Deno 可执行文件的路径（如果没有自动检测到）。

查看
[这篇博客文章](https://blog.jetbrains.com/webstorm/2020/06/deno-support-in-jetbrains-ides/)
了解更多关于如何在 Jetbrains IDEs 中开始使用 Deno 的信息。

### Vim/Neovim 通过插件

Deno 在 [Vim](https://www.vim.org/) 和 [Neovim](https://neovim.io/) 上获得良好的支持，可以通过
[coc.nvim](https://github.com/neoclide/coc.nvim)、[vim-easycomplete](https://github.com/jayli/vim-easycomplete)、[ALE](https://github.com/dense-analysis/ale) 和 [vim-lsp](https://github.com/prabirshrestha/vim-lsp) 来实现。coc.nvim 提供了与 Deno 语言服务器集成的插件，而 ALE 则是开箱即用地支持 Deno。

### Neovim 0.6+ 使用内置语言服务器

要使用 Deno 语言服务器，请安装
[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/) 并遵循说明以启用
[提供的 Deno 配置](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#denols)。

请注意，如果你还有 `ts_ls` 作为 LSP 客户端，可能会遇到 `ts_ls` 和 `denols` 都附加到当前缓冲区的问题。为解决此问题，请确保为 `ts_ls` 和 `denols` 设置一些唯一的 `root_dir`。你可能还需要将 `ts_ls` 的 `single_file_support` 设置为 `false`，以防止它在 `single file mode` 下运行。以下是一个这样的配置示例：

```lua
local nvim_lsp = require('lspconfig')
nvim_lsp.denols.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("deno.json", "deno.jsonc"),
}

nvim_lsp.ts_ls.setup {
  on_attach = on_attach,
  root_dir = nvim_lsp.util.root_pattern("package.json"),
  single_file_support = false
}
```

对于 Deno，上面的示例假设在项目根目录下存在 `deno.json` 或 `deno.jsonc` 文件。

##### Kickstart.nvim and Mason LSP

If you are using [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim)
add the above configuration like this inside the servers table in your
configuration `init.lua`.

```lua
local servers = {
        -- ... some configuration
        ts_ls = {
            root_dir = require("lspconfig").util.root_pattern({ "package.json", "tsconfig.json" }),
            single_file_support = false,
            settings = {},
        },
        denols = {
            root_dir = require("lspconfig").util.root_pattern({"deno.json", "deno.jsonc"}),
            single_file_support = false,
            settings = {},
        },
    }
```

#### coc.nvim

一旦你安装了
[coc.nvim](https://github.com/neoclide/coc.nvim/wiki/Install-coc.nvim)，你需要通过 `:CocInstall coc-deno` 安装所需的
[coc-deno](https://github.com/fannheyward/coc-deno)。

插件安装完毕后，如果想要在某个工作区启用 Deno，请运行命令 `:CocCommand deno.initializeWorkspace`，你将能够使用 `gd`（跳转到定义）和 `gr`（查找引用）等命令。

#### ALE

ALE 通过 Deno 语言服务器开箱即用地支持 Deno，在许多使用场景下不需要额外配置。一旦你安装了
[ALE](https://github.com/dense-analysis/ale#installation)，可以执行
[`:help ale-typescript-deno`](https://github.com/dense-analysis/ale/blob/master/doc/ale-typescript.txt)
以获取可用的配置选项信息。

有关如何设置 ALE（如键绑定）的更多信息，请参阅
[官方文档](https://github.com/dense-analysis/ale#usage)。

#### Vim-EasyComplete

Vim-EasyComplete 在没有任何其他配置的情况下支持 Deno。一旦你安装了
[vim-easycomplete](https://github.com/jayli/vim-easycomplete#installation)，如果尚未安装 Deno，则需要通过 `:InstallLspServer deno` 安装 Deno。你可以从
[官方文档](https://github.com/jayli/vim-easycomplete) 获取更多信息。

#### Vim-Lsp

通过
[vim-plug](https://github.com/prabirshrestha/vim-lsp?tab=readme-ov-file#installing)
或 vim 包安装 Vim-Lsp 后，将以下代码添加到你的 `.vimrc` 配置中：

```vim
if executable('deno')
  let server_config = {
    \ 'name': 'deno',
    \ 'cmd': {server_info->['deno', 'lsp']},
    \ 'allowlist': ['typescript', 'javascript', 'javascriptreact', 'typescriptreact'],
    \ }

  if exists('$DENO_ENABLE') 
    let deno_enabled = $DENO_ENABLE == '1' 
    let server_config['workspace_config'] = { 'deno': { 'enable': deno_enabled ? v:true : v:false } } 
  endif

  au User lsp_setup call lsp#register_server(server_config)
endif
```

你将有两种方式来启用 LSP 服务器。一种是在当前工作目录下有一个 `deno.json` 或 `deno.jsonc` 文件，另一种是通过 `DENO_ENABLE=1` 强制启用。如果你想在 IntelliSense 工具提示中高亮语法，也可以在 `.vimrc` 配置中添加以下代码：

```vim
let g:markdown_fenced_languages = ["ts=typescript"]
```

### Emacs

#### lsp-mode

Emacs 通过 Deno 语言服务器使用
[lsp-mode](https://emacs-lsp.github.io/lsp-mode/) 支持 Deno。一旦
[lsp-mode 安装](https://emacs-lsp.github.io/lsp-mode/page/installation/)，它应当支持 Deno，可以
[进行配置](https://emacs-lsp.github.io/lsp-mode/page/lsp-deno/)以支持各种设置。

#### eglot

你也可以通过使用 [`eglot`](https://github.com/joaotavora/eglot) 使用内置的 Deno 语言服务器。

以下是通过 eglot 的 Deno 示例配置：

```elisp
(add-to-list 'eglot-server-programs '((js-mode typescript-mode) . (eglot-deno "deno" "lsp")))

  (defclass eglot-deno (eglot-lsp-server) ()
    :documentation "Deno LSP 的自定义类。")

  (cl-defmethod eglot-initialization-options ((server eglot-deno))
    "通过所需的 Deno 初始化选项"
    (list :enable t
    :lint t))
```

### Pulsar

[Pulsar 编辑器，之前称为 Atom](https://pulsar-edit.dev/) 支持通过
[atom-ide-deno](https://web.pulsar-edit.dev/packages/atom-ide-deno) 包与 Deno 语言服务器集成。
`atom-ide-deno` 要求安装 Deno CLI，并且还需安装
[atom-ide-base](https://web.pulsar-edit.dev/packages/atom-ide-base) 包。

### Sublime Text

[Sublime Text](https://www.sublimetext.com/) 通过 [LSP 包](https://packagecontrol.io/packages/LSP) 支持连接到 Deno 语言服务器。你还可能希望安装
[TypeScript 包](https://packagecontrol.io/packages/TypeScript) 以获得完整的语法高亮。

安装 LSP 包后，你需要在 `.sublime-project` 配置中添加如下配置：

```jsonc
{
  "settings": {
    "LSP": {
      "deno": {
        "command": ["deno", "lsp"],
        "initializationOptions": {
          // "config": "", // 设置项目中配置文件的路径
          "enable": true,
          // "importMap": "", // 设置项目中导入映射的路径
          "lint": true,
          "unstable": false
        },
        "enabled": true,
        "languages": [
          {
            "languageId": "javascript",
            "scopes": ["source.js"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "javascriptreact",
            "scopes": ["source.jsx"],
            "syntaxes": [
              "Packages/Babel/JavaScript (Babel).sublime-syntax",
              "Packages/JavaScript/JavaScript.sublime-syntax"
            ]
          },
          {
            "languageId": "typescript",
            "scopes": ["source.ts"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScript.tmLanguage",
              "Packages/TypeScript Syntax/TypeScript.tmLanguage"
            ]
          },
          {
            "languageId": "typescriptreact",
            "scopes": ["source.tsx"],
            "syntaxes": [
              "Packages/TypeScript-TmLanguage/TypeScriptReact.tmLanguage",
              "Packages/TypeScript Syntax/TypeScriptReact.tmLanguage"
            ]
          }
        ]
      }
    }
  }
}
```

### Nova

[Nova 编辑器](https://nova.app) 可以通过
[Deno 扩展](https://extensions.panic.com/extensions/jaydenseric/jaydenseric.deno) 集成 Deno 语言服务器。

### GitHub Codespaces

[GitHub Codespaces](https://github.com/features/codespaces) 允许你完全在线或远程在本地机器上开发，而无需配置或安装 Deno。它目前处于早期访问阶段。

如果一个项目是启用了 Deno 的项目，并且包含 `.devcontainer` 配置作为库的一部分，则在 GitHub Codespaces 中打开该项目应该可以“正常工作”。如果你正在开始一个新项目，或者想要为现有代码空间添加 Deno 支持，可以通过从命令面板中选择 `Codespaces: Add Development Container Configuration Files...` 进行添加，然后选择 `Show All Definitions...` 并搜索 `Deno` 定义。

一旦选择后，你需要重建你的容器，以便将 Deno CLI 添加到容器中。容器重建后，代码空间将支持 Deno。

### Kakoune

[Kakoune](https://kakoune.org/) 通过 [kak-lsp](https://github.com/kak-lsp/kak-lsp) 客户端支持连接到 Deno 语言服务器。一旦 [kak-lsp 安装](https://github.com/kak-lsp/kak-lsp#installation)，配置连接到 Deno 语言服务器的示例是在 `kak-lsp.toml` 中添加以下内容：

```toml
[language.typescript]
filetypes = ["typescript", "javascript"]
roots = [".git"]
command = "deno"
args = ["lsp"]
[language.typescript.settings.deno]
enable = true
lint = true
```

### Helix

[Helix](https://helix-editor.com) 自带语言服务器支持。启用连接到 Deno 语言服务器需要在 `languages.toml` 配置文件中进行更改。

```toml
[[language]]
name = "typescript"
roots = ["deno.json", "deno.jsonc", "package.json"]
auto-format = true
language-servers = ["deno-lsp"]

[[language]]
name = "javascript"
roots = ["deno.json", "deno.jsonc", "package.json"]
auto-format = true
language-servers = ["deno-lsp"]

[language-server.deno-lsp]
command = "deno"
args = ["lsp"]
config.deno.enable = true
```

## Shell 自动补全

Deno CLI 内置支持为 CLI 自身生成 shell 补全信息。通过使用 `deno completions <shell>`，Deno CLI 将输出补全到 stdout。当前支持的 shell 有：

- bash
- elvish
- fish
- powershell
- zsh

### bash 示例

输出补全并添加到环境中：

```shell
> deno completions bash > /usr/local/etc/bash_completion.d/deno.bash
> source /usr/local/etc/bash_completion.d/deno.bash
```

### PowerShell 示例

输出补全：

```shell
> deno completions powershell >> $profile
> .$profile
```

这将创建一个 Powershell 配置文件在 `$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`，并且每次你启动 PowerShell 时将运行该文件。

### zsh 示例

你应该有一个目录来保存补全的内容：

```shell
> mkdir ~/.zsh
```

然后输出补全：

```shell
> deno completions zsh > ~/.zsh/_deno
```

并确保在你的 `~/.zshrc` 中加载补全：

```shell
fpath=(~/.zsh $fpath)
autoload -Uz compinit
compinit -u
```

如果在重新加载 shell 后补全仍然未加载，你可能需要删除 `~/.zcompdump/` 来移除以前生成的补全，然后再次运行 `compinit` 来重新生成。

### 使用 ohmyzsh 和 antigen 的 zsh 示例

[ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) 是一个 zsh 配置框架，可以更简单地管理你的 shell 配置。
[antigen](https://github.com/zsh-users/antigen) 是一个 zsh 插件管理器。

创建目录以存储补全并输出补全：

```shell
> mkdir ~/.oh-my-zsh/custom/plugins/deno
> deno completions zsh > ~/.oh-my-zsh/custom/plugins/deno/_deno
```

然后你的 `.zshrc` 可能看起来像这样：

```shell
source /path-to-antigen/antigen.zsh

# 加载 oh-my-zsh 库。
antigen use oh-my-zsh

antigen bundle deno
```

### fish 示例

将补全输出到 fish 配置文件夹中的 `deno.fish` 文件：

```shell
> deno completions fish > ~/.config/fish/completions/deno.fish
```

## 其他工具

如果你正在编写或支持使用 Deno 语言服务器的社区集成，请阅读关于
[与 Deno LSP 集成的更多信息](/runtime/reference/lsp_integration/)，同时也可以随时加入我们的 [Discord 社区](https://discord.gg/deno) 中的 `#dev-lsp` 频道。