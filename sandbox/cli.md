---
title: "通过 CLI 管理"
description: "如何使用 Deno CLI 管理 Deno Sandbox。"
---

Deno CLI 包含了内置命令用于管理你的 Deno Sandbox 实例，允许你从终端创建、控制并与它们交互。

这种集成使 Deno Sandbox 的管理在你现有的 Deno 工作流程中显得自然流畅。

## 创建你的第一个沙箱

最简单的入门方法是使用 `deno sandbox create`。默认情况下，这会创建一个交互式会话沙箱，准备好时会自动打开 SSH 连接：

```bash
deno sandbox create
```

如果你的系统没有可用的 SSH，则会显示连接信息。退出会话时，沙箱会自动清理自身。

在开发工作中，你通常会想把项目文件复制到沙箱里。`--copy` 选项会上传文件到沙箱内部的 `/app` 目录：

```bash
deno sandbox create --copy ./my-project
```

你可以在创建时复制多个目录：

```bash
deno sandbox create --copy ./src --copy ./config
```

如果你需要沙箱运行时间超过单次会话，可以用 `--timeout` 指定超时时间：

```bash
deno sandbox create --timeout 2m
```

你也可以用自定义的内存限制创建沙箱：

```bash
deno sandbox create --memory 2gib
```

若要公开 HTTP 端口以供 Web 应用访问：

```bash
deno sandbox create --expose-http 3000
```

你可以使用 `--volume` 标志挂载持久卷到沙箱：

```bash
deno sandbox create --volume my-volume:/data
```

创建沙箱并立即运行命令：

```bash
deno sandbox create ls /
```

这在构建和测试项目时非常有用。你可以一条命令复制文件并运行构建流程：

```bash
deno sandbox create --copy ./app --cwd /app "npm i && npm start"
```

对于网页应用，你可以公开端口以访问运行服务：

```bash
deno sandbox create --expose-http 3000 --copy ./web-app --cwd /app "npm i && npm run dev"
```

复杂的工作流可以写成带引号的命令链：

```bash
deno sandbox create --copy ./app --cwd /app "npm install && npm test && npm run build"
```

## 查看你的 Deno Sandbox

使用 `deno sandbox list`（或 `deno sandbox ls`）查看组织中所有的沙箱：

```bash
$ deno sandbox list
ID                             CREATED                  REGION   STATUS    UPTIME
sbx_ord_1at5nn58e77rtd11e3k3   2026-01-30 18:33:40.79   ord      running   26.9s
sbx_ord_fwnygdsnszfe5ghafyx8   2026-01-30 18:31:40.90   ord      stopped   5.1s
sbx_ord_4xqcyahb8ye2r5a643de   2026-01-30 18:29:59.10   ord      stopped   9.4s
```

这显示了每个沙箱的唯一 ID（你用它来配合其他命令），创建时间，区域，当前状态，和运行时长。

## 远程运行命令

`deno sandbox exec` 命令让你在任意运行中的沙箱里执行单条命令，而无需打开交互式会话。非常适合自动化、CI/CD 管道或快速一次性任务：

```bash
deno sandbox exec sbx_ord_abc123def456 ls -la
```

大多数时候，你会想在你所复制文件所在的 `/app` 目录操作。用 `--cwd` 指定工作目录：

```bash
deno sandbox exec sbx_ord_abc123def456 --cwd /app npm install
```

用于脚本或自动化时，用 `--quiet` 抑制命令输出：

```bash
deno sandbox exec sbx_ord_abc123def456 --quiet --cwd /app npm test
```

你也可以通过引号把整条复杂命令链传入：

```bash
deno sandbox exec sbx_ord_abc123def456 --cwd /app "npm install && npm test"
```

exec 命令自然支持 Unix 管道及标准输入/输出。你可以将沙箱命令输出接入本地工具：

```bash
deno sandbox exec sbx_ord_abc123def456 'ls -lh /' | wc -l
```

或将本地数据通过管道输入沙箱进程用于处理：

```bash
cat large-dataset.csv | deno sandbox exec sbx_ord_abc123def456 --cwd /app "deno run -A main.ts"
```

这样方便你将沙箱处理集成至更大规模的 Unix 工作流和数据管道中。

## 传输文件

虽然你可以在创建沙箱时复制文件，但后续你可能需要更新或检索文件。`deno sandbox copy` 命令（也能用 `deno sandbox cp`）支持双向文件传输：从本机到沙箱，从沙箱到本机，甚至沙箱之间。

将文件从本地复制到沙箱：

```bash
deno sandbox copy ./app.js sbx_ord_abc123def456:/app/
```

从沙箱检索文件到本地：

```bash
deno sandbox copy sbx_ord_abc123def456:/app/results.json ./output/
```

在不同沙箱间复制文件：

```bash
deno sandbox copy sbx_ord_abc123def456:/app/data.csv sbx_ord_xyz789uvw012:/app/input/
```

你可以用通配符从沙箱复制多个文件：

```bash
deno sandbox copy sbx_ord_abc123def456:/app/*.json ./config/
deno sandbox copy sbx_ord_abc123def456:/app/logs/*.log ./logs/
```

还能一次复制多个文件和目录：

```bash
deno sandbox copy ./src/ ./package.json sbx_ord_abc123def456:/app/
```

目标路径可定制，用以在沙箱中合理安排文件：

```bash
deno sandbox copy ./frontend sbx_ord_abc123def456:/app/web/
```

## 部署沙箱

你可以使用 `deno sandbox deploy` 命令，将正在运行的沙箱部署为 Deno Deploy 应用：

```bash
deno sandbox deploy sbx_ord_abc123def456 my-app
```

默认部署到预览版本。若要直接部署到生产：

```bash
deno sandbox deploy --prod sbx_ord_abc123def456 my-app
```

可指定自定义工作目录和入口点：

```bash
deno sandbox deploy --cwd /app --entrypoint main.ts sbx_ord_abc123def456 my-app
```

给入口脚本传递参数：

```bash
deno sandbox deploy --args --port 8080 sbx_ord_abc123def456 my-app
```

## 管理卷

沙箱系统支持持久卷，用于存储需要跨沙箱实例保存的数据。使用 `deno sandbox volumes` 命令进行管理。

### 创建卷

创建带有名称、容量及区域的卷：

```bash
deno sandbox volumes create my-volume --capacity 10gb --region ord
```

### 列出卷

列出组织内所有卷：

```bash
deno sandbox volumes list
```

你也可以搜索特定的卷：

```bash
deno sandbox volumes list my-volume
```

### 删除卷

不再需要某卷时删除它：

```bash
deno sandbox volumes delete my-volume
```

## 管理快照

快照是从卷创建的只读镜像。你可以用它们预装软件一次，然后让新沙箱迅速启动并拥有准备好的环境。完整工作流请参考[卷与快照](./volumes/)。

### 创建快照

从已有卷创建快照：

```bash
deno sandbox snapshots create my-volume my-snapshot
```

你也可以用 `volumes snapshot` 命令：

```bash
deno sandbox volumes snapshot my-volume my-snapshot
```

### 列出快照

列出组织内所有快照：

```bash
$ deno sandbox snapshots list
ID                             SLUG          REGION   ALLOCATED    BOOTABLE
snp_ord_spmbe47dysccpy277ma6   my-snapshot   ord      217.05 MiB   TRUE
```

可以搜索特定快照：

```bash
deno sandbox snapshots list my-snapshot
```

### 删除快照

不再需要快照时删除它：

```bash
deno sandbox snapshots delete my-snapshot
```

## 切换组织

`deno sandbox switch` 命令允许你在配置中切换不同的组织：

```bash
deno sandbox switch
```

这在管理多个组织时非常实用。

## 交互式访问

当你需要在沙箱内交互式工作，比如编辑文件、调试问题或探索环境时，可以用 `deno sandbox ssh`：

```bash
deno sandbox ssh sbx_ord_abc123def456
```

这给你一个沙箱内部的完整 Linux shell，可以使用任何命令行工具，用 vim 或 nano 编辑文件，监视进程，安装额外软件等。断开连接后沙箱仍会继续运行，你可以稍后重新连接，或用其他命令远程操作。

## 管理沙箱超时

### 延长沙箱时长

有时你可能需要更多时间来完成当前沙箱中的工作。`deno sandbox extend` 命令允许你在不中断正在运行的进程的情况下延长沙箱超时：

```bash
deno sandbox extend sbx_ord_abc123def456 30m
```

extend 命令与沙箱的任何状态无缝配合；无论你是 SSH 登录中、运行远程命令，还是有后台进程，都能保证所有活动连接和进程不中断，同时更新沙箱的过期时间。

### 清理与终止

当完成沙箱工作时，使用 `deno sandbox kill`（或 `deno sandbox rm`）终止它并释放资源：

```bash
deno sandbox kill sbx_ord_abc123def456
```

这会立即停止沙箱内所有进程并释放资源。务必在终止沙箱前保存所有重要工作，因为沙箱内的所有数据都会丢失。

## 常见工作流程

### 开发与测试

典型的开发流程是创建一个包含你的代码的沙箱，设置依赖，然后运行测试：

```bash
deno sandbox create --copy ./my-app
```

创建后，使用返回的沙箱 ID 来设置并测试项目：

```bash
deno sandbox exec sbx_ord_abc123def456 --cwd /app npm install
deno sandbox exec sbx_ord_abc123def456 --cwd /app npm test
```

当你在本地有修改时，可以更新沙箱，完成后再取回生成文件：

```bash
deno sandbox copy ./src/ sbx_ord_abc123def456:/app/src/
deno sandbox copy sbx_ord_abc123def456:/app/build/ ./dist/
deno sandbox kill sbx_ord_abc123def456
```

### 数据处理

针对需要获取结果的数据处理工作流，结合远程执行和 SSH 访问使用：

```bash
SANDBOX_ID=$(deno sandbox create --timeout 20m --copy ./data)
deno sandbox exec $SANDBOX_ID --cwd /app "deno run -A main.ts"
```

你也可以利用管道直接将数据流输入沙箱进程，适合大数据集或实时处理：

```bash
SANDBOX_ID=$(deno sandbox create --timeout 20m --copy ./processing-scripts)
curl -s https://api.example.com/data.json | deno sandbox exec $SANDBOX_ID --cwd /app jq '.items[] | select(.active)'
```

或者在管道中结合本地和远程处理：

```bash
grep "ERROR" /var/log/app.log | deno sandbox exec $SANDBOX_ID --cwd /app "deno run -A main.ts" | sort | uniq -c
```

要获取结果，复制生成文件回本地，再清理沙箱：

```bash
deno sandbox copy $SANDBOX_ID:/app/results/*.csv ./output/
deno sandbox kill $SANDBOX_ID
```