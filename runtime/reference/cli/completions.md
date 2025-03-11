---
title: "deno completions"
oldUrl: /runtime/manual/tools/completions/
command: completions
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno completions"
description: "Generate shell completions for Deno"
---

您可以使用输出脚本来配置 `deno` 命令的自动补全。

例如：`deno un` -> <kbd>Tab</kbd> -> `deno uninstall`。

## 示例

### 配置 Bash shell 完成

```bash
deno completions bash > deno.bash
sudo mv deno.bash /usr/local/etc/bash_completion.d/
source /usr/local/etc/bash_completion.d/deno.bash
```

### 配置 PowerShell shell 完成

```bash
deno completions powershell | Out-String | Invoke-Expression
```

### 配置 zsh shell 完成

首先将以下内容添加到你的 `.zshrc` 文件中：

```bash
fpath=(~/.zsh/completion $fpath)
autoload -U compinit
compinit
```

然后运行以下命令：

```bash
deno completions zsh > _deno
mv _deno ~/.zsh/completion/_deno
autoload -U compinit && compinit
```

### 配置 fish shell 完成

```bash
deno completions fish > completions.fish
chmod +x ./completions.fish
```