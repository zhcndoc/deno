---
title: "deno 沙箱"
command: sandbox
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno 沙箱"
description: "启动一个安全的 Linux 微型虚拟机"
---

`deno sandbox` 命令允许你启动一个安全的 Linux 微型虚拟机，旨在为在沙箱环境中运行不受信任的代码提供支持。请参阅 [沙箱文档](/sandbox/cli/) 获取更详细的使用示例。

## 认证

为了使用 `deno sandbox` 命令，你需要拥有一个 Deno Deploy 账户和有效的认证令牌。请按照 [开始使用 Deno 沙箱](/sandbox/getting_started/) 文档中的说明操作。

## 全局选项

- `-h`, `--help` - 显示帮助信息。
- `--token` <token> - 使用的认证令牌。
- `--config` <config> - 配置文件路径。
- `--org` <name> - 组织名称。

## 子命令

### 创建新沙箱

在组织中创建一个新的沙箱。接受别名 `create` 和 `new`。

```bash
deno sandbox create
```

### 列出你的沙箱

列出组织中的所有沙箱。接受别名 `list` 和 `ls`。

```bash
deno sandbox list
```

### 终止沙箱

立即终止一个正在运行的沙箱。接受别名 `kill`、`remove` 和 `rm`。

```bash
deno sandbox kill <sandbox-id>
```

### 复制文件

在本地机器与运行中的沙箱之间复制文件。使用 `copy` 或其简写别名 `cp`。

```bash
deno sandbox copy <paths...>
```

### 执行命令

在现有沙箱中运行任意命令。

```bash
deno sandbox exec <sandbox-id> <command...>
```

示例：

```bash
deno sandbox exec sbx-1234 uptime
```

### 延长超时

延长沙箱活动时间，避免超时结束。

```bash
deno sandbox extend <sandbox-id> <timeout>
```

接受的时间格式为数字加单位，单位可以是秒（s）、分钟（m）或小时（h）。

示例：

```bash
deno sandbox extend <sandbox-id> 30m
```

### SSH 连接沙箱

打开与沙箱的交互式 SSH 会话。

```bash
deno sandbox ssh <sandbox-id>
```

### 部署沙箱

将正在运行的沙箱的状态转变为 Deno Deploy 应用。

```bash
deno sandbox deploy <sandbox-id> <app>
```

### 管理卷

创建、列出和挂载持久块存储卷。

```bash
deno sandbox volumes --help
```

#### 创建卷

创建一个新卷。接受别名 `volumes create` 或 `volumes new`。

```bash
deno sandbox volumes create <name>
```

#### 列出卷

列出组织中的所有卷。接受别名 `volumes list` 或 `volumes ls`。

```bash
deno sandbox volumes list
```

#### 删除卷

删除一个卷。接受别名 `volumes delete`、`volumes rm` 或 `volumes remove`。

```bash
deno sandbox volumes delete <volume-id-or-slug>
```

或者

```bash
deno sandbox volumes delete <volume-slug>
```

#### 卷快照

创建卷的快照。接受卷 ID 或别名及快照别名。

```bash
deno sandbox volumes snapshot <volume-id-or-slug> <snapshot-slug>
```

或者

```bash
deno sandbox volumes snapshot <volume-slug> <snapshot-slug>
```

### 管理快照

为沙箱创建和恢复文件系统快照。

```bash
deno sandbox snapshots --help
```

#### 创建快照

创建沙箱的新快照。接受别名 `snapshots create` 或 `snapshots new`。需要卷 ID 或别名及快照别名。

```bash
deno sandbox snapshots create <volume-id-or-slug> <snapshot-slug>
```

#### 列出快照

列出组织中的所有快照。接受别名 `snapshots list` 或 `snapshots ls`。

```bash
deno sandbox snapshots list
```

#### 删除快照

删除快照。接受别名 `snapshots delete`、`snapshots rm` 或 `snapshots remove`。需要快照 ID 或别名。

```bash
deno sandbox snapshots delete <id-or-slug>
```

### 切换组织或应用

切换当前 Deploy 组织或应用上下文，沙箱命令将使用此进行认证。

```bash
deno sandbox switch
```
