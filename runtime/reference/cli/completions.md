---
last_modified: 2025-04-24
title: "deno completions"
oldUrl: /runtime/manual/tools/completions/
command: completions
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno 补全"
description: "为 Deno 生成 shell 补全"
---

您可以使用输出脚本来配置 `deno` 命令的自动补全。

例如：`deno un` -> <kbd>Tab</kbd> -> `deno uninstall`。

## 示例

### 配置 Bash shell 补全

```sh
deno completions bash > deno.bash

if [ -d "/usr/local/etc/bash_completion.d/" ]; then
  sudo mv deno.bash /usr/local/etc/bash_completion.d/
  source /usr/local/etc/bash_completion.d/deno.bash
elif [ -d "/usr/share/bash-completion/completions/" ]; then
  sudo mv deno.bash /usr/share/bash-completion/completions/
  source /usr/share/bash-completion/completions/deno.bash
else
  echo "请将 deno.bash 移动到合适的 bash 补全目录"
fi
```

### 配置 PowerShell shell 补全

```sh
deno completions powershell | Out-String | Invoke-Expression
```

### 配置 zsh shell 补全

首先将以下内容添加到你的 `.zshrc` 文件中：

```sh
fpath=(~/.zsh/completion $fpath)
autoload -U compinit
compinit
```

然后运行以下命令：

```sh
deno completions zsh > _deno
mv _deno ~/.zsh/completion/_deno
autoload -U compinit && compinit
```

### 配置 fish shell 补全

```sh
deno completions fish > completions.fish
chmod +x ./completions.fish
```