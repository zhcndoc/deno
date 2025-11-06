---
title: "在命令行中使用 deployctl"
---

:::info Legacy Documentation

你正在查看 Deno Deploy Classic 的遗留文档。我们建议迁移到新的
<a href="/deploy/">Deno Deploy</a> 平台。

:::

`deployctl` 是一个命令行工具 (CLI)，允许你在不离开终端的情况下操作 Deno Deploy 平台。使用它，你可以部署代码、创建和管理项目及其部署，并监控使用情况和日志。

## 依赖项

`deployctl` 的唯一依赖是 Deno 运行时。你可以通过运行以下命令进行安装：

```sh
curl -fsSL https://deno.land/install.sh | sh
```

你无需在部署你的第一个项目之前先设置 Deno Deploy Classic 账户。账户将在你部署第一个项目的过程中自动创建。

## 安装 `deployctl`

安装 Deno 运行时后，你可以使用以下命令安装 `deployctl` 工具：

```sh
deno install -gArf jsr:@deno/deployctl
```

在 deno install 命令中，`-A` 选项赋予已安装脚本所有权限。你可以选择不使用它，在这种情况下，当工具执行时，会提示你授予必要的权限。

## 部署

要对你的代码进行新部署，请导航到项目的根目录并执行：

```shell
deployctl deploy
```

### 项目和入口点

如果这是项目的第一次部署，`deployctl` 将根据其所在的 Git 仓库或目录推断项目名称。同样，它会通过查找具有常见入口点名称的文件（如 `main.ts`、`src/main.ts` 等）来推断入口点。在首次部署之后，使用的设置将存储在配置文件中（默认是 deno.json）。

你可以分别使用 `--project` 和 `--entrypoint` 参数指定项目名称和/或入口点。如果项目不存在，将自动创建。默认情况下，它是在用户的个人组织中创建，但也可以通过指定 `--org` 参数在自定义组织中创建。如果组织尚不存在，也会自动创建。

```shell
deployctl deploy --project=helloworld --entrypoint=src/entrypoint.ts --org=my-team
```

### 包含和排除文件

默认情况下，deployctl 会递归部署当前目录下的所有文件（除了 `node_modules` 目录）。你可以使用 `--include` 和 `--exclude` 参数自定义此行为（这些参数在配置文件中也支持）。这些参数接受特定文件、整个目录和通配符。以下是一些示例：

- 仅包括源文件和静态文件：

  ```shell
  deployctl deploy --include=./src --include=./static
  ```

- 仅包括 Typescript 文件：

  ```shell
  deployctl deploy --include=**/*.ts
  ```

- 排除本地工具和工件

  ```shell
  deployctl deploy --exclude=./tools --exclude=./benches
  ```

一个常见的陷阱是未包括需要运行的源代码模块（入口点和依赖项）。以下示例将失败，因为未包括 `main.ts`：

```shell
deployctl deploy --include=./static --entrypoint=./main.ts
```

入口点也可以是远程脚本。一个常见的用例是使用 `std/http/file_server.ts` 部署一个静态网站（更多细节请参考 [静态网站教程](https://docs.deno.com/deploy/tutorials/static-site)）：

```shell
deployctl deploy --include=dist --entrypoint=jsr:@std/http/file-server
```

### 环境变量

你可以使用 `--env` 设置环境变量（设置单个环境变量）或使用 `--env-file` 加载一个或多个环境文件。可以组合这些选项并多次使用：

```shell
deployctl deploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

部署将通过 `Deno.env.get()` 获取这些变量。请注意，使用 `--env` 和 `--env-file` 设置的环境变量特定于正在创建的部署，不会添加到 [为项目配置的环境变量列表](./environment-variables.md)。

### 生产部署

你创建的每个部署都有一个唯一的 URL。此外，项目有一个“生产 URL”和指向其“生产”部署的自定义域名。部署可以随时晋升为生产，或者使用 `--prod` 标志直接创建为生产：

```shell
deployctl deploy --prod
```

在 [部署](./deployments) 文档中了解有关生产部署的更多信息。

## 部署命令组

部署子命令将所有与部署相关的操作分组。

### 列出

你可以列出一个项目的部署：

```shell
deployctl deployments list
```

输出：

```
✔ 项目 'my-project' 的部署列表第 1 页已经准备好
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  部署        │               日期               │   状态   │  数据库  │                       域                       │ 入口点   │  分支   │  提交   │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ kcbxc4xwe4mc │ 2024年12月3日 13:21:40 CET (2天) │ 预览     │ 预览     │ https://my-project-kcbxc4xwe4mc.deno.dev │ main.ts   │ main    │ 4b6c506  │
│ c0ph5xa9exb3 │ 2024年12月3日 13:21:25 CET (2天) │ 生产     │ 生产     │ https://my-project-c0ph5xa9exb3.deno.dev │ main.ts   │ main    │ 4b6c506  │
│ kwkbev9er4h2 │ 2024年12月3日 13:21:12 CET (2天) │ 预览     │ 预览     │ https://my-project-kwkbev9er4h2.deno.dev │ main.ts   │ main    │ 4b6c506  │
│ dxseq0jc8402 │ 2024年6月3日 23:16:51 CET (8天)  │ 预览     │ 生产     │ https://my-project-dxseq0jc8402.deno.dev │ main.ts   │ main    │ 099359b  │
│ 7xr5thz8yjbz │ 2024年6月3日 22:58:32 CET (8天)  │ 预览     │ 预览     │ https://my-project-7xr5thz8yjbz.deno.dev │ main.ts   │ another  │ a4d2953  │
│ 4qr4h5ac3rfn │ 2024年6月3日 22:57:05 CET (8天)  │ 失败     │ 预览     │ n/a                                               │ main.ts   │ another  │ 56d2c88  │
│ 25wryhcqmb9q │ 2024年6月3日 22:56:41 CET (8天)  │ 预览     │ 预览     │ https://my-project-25wryhcqmb9q.deno.dev │ main.ts   │ another  │ 4b6c506  │
│ 64tbrn8jre9n │ 2024年6月3日 8:21:33 CET (8天)   │ 预览     │ 生产     │ https://my-project-64tbrn8jre9n.deno.dev │ main.ts   │ main    │ 4b6c506  │
│ hgqgccnmzg04 │ 2024年6月3日 8:17:40 CET (8天)   │ 失败     │ 生产     │ n/a                                               │ main.ts   │ main    │ 8071902  │
│ rxkh1w3g74e8 │ 2024年6月3日 8:17:28 CET (8天)   │ 失败     │ 生产     │ n/a                                               │ main.ts   │ main    │ b142a59  │
│ wx6cw9aya64c │ 2024年6月3日 8:02:29 CET (8天)   │ 预览     │ 生产     │ https://my-project-wx6cw9aya64c.deno.dev │ main.ts   │ main    │ b803784  │
│ a1qh5fmew2yf │ 2024年5月3日 16:25:29 CET (9天)  │ 预览     │ 生产     │ https://my-project-a1qh5fmew2yf.deno.dev │ main.ts   │ main    │ 4bb1f0f  │
│ w6pf4r0rrdkb │ 2024年5月3日 16:07:35 CET (9天)  │ 预览     │ 生产     │ https://my-project-w6pf4r0rrdkb.deno.dev │ main.ts   │ main    │ 6e487fc  │
│ nn700gexgdzq │ 2024年5月3日 13:37:11 CET (9天)  │ 预览     │ 生产     │ https://my-project-nn700gexgdzq.deno.dev │ main.ts   │ main    │ c5b1d1f  │
│ 98crfqxa6vvf │ 2024年5月3日 13:33:52 CET (9天)  │ 预览     │ 生产     │ https://my-project-98crfqxa6vvf.deno.dev │ main.ts   │ main    │ 090146e  │
│ xcdcs014yc5p │ 2024年5月3日 13:30:58 CET (9天)  │ 预览     │ 生产     │ https://my-project-xcdcs014yc5p.deno.dev │ main.ts   │ main    │ 5b78c0f  │
│ btw43kx89ws1 │ 2024年5月3日 13:27:31 CET (9天)  │ 预览     │ 生产     │ https://my-project-btw43kx89ws1.deno.dev │ main.ts   │ main    │ 663452a  │
│ 62tg1ketkjx7 │ 2024年5月3日 13:27:03 CET (9天)  │ 预览     │ 生产     │ https://my-project-62tg1ketkjx7.deno.dev │ main.ts   │ main    │ 24d1618  │
│ 07ag6pt6kjex │ 2024年5月3日 13:19:11 CET (9天)  │ 预览     │ 生产     │ https://my-project-07ag6pt6kjex.deno.dev │ main.ts   │ main    │ 4944545  │
│ 4msyne1rvwj1 │ 2024年5月3日 13:17:16 CET (9天)  │ 预览     │ 生产     │ https://my-project-4msyne1rvwj1.deno.dev │ main.ts   │ main    │ dda85e1  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
按回车获取下一页 [Enter]
```

该命令默认输出每页 20 个部署。你可以使用回车键迭代查看页面，并使用 `--page` 和 `--limit` 选项查询特定页面和页面大小。

与其余命令一样，如果你不在项目目录中或想列出其他项目的部署，可以使用 `--project` 选项指定项目。

### 显示

使用以下命令获取特定部署的所有详细信息：

```shell
deployctl deployments show
```

输出：

```
✔ 项目 'my-project' 的生产部署为 'c0ph5xa9exb3'
✔ 部署 'c0ph5xa9exb3' 的详细信息已准备好：

c0ph5xa9exb3
------------
状态:         生产
日期:         2天前，12小时，29分钟，46秒 (2024年12月3日 13:21:25 CET)
项目:        my-project (e54f23b5-828d-4b7f-af12-706d4591062b)
组织:        my-team (d97822ac-ee20-4ce9-b942-5389330b57ee)
域名:        https://my-project.deno.dev
              https://my-project-c0ph5xa9exb3.deno.dev
数据库:      生产 (0efa985f-3793-48bc-8c05-f740ffab4ca0)
入口点:      main.ts
环境变量:    HOME
Git
  引用:      main [4b6c506]
  消息:      change name
  作者:      John Doe @johndoe [mailto:johndoe@deno.com]
  URL:       https://github.com/arnauorriols/my-project/commit/4b6c50629ceeeb86601347732d01dc7ed63bf34f
定时任务:    另一个定时任务 [*/10 * * * *] 于 2024年3月15日 1:50:00 CET 成功，耗时 2 秒 (下一个在 2024年3月15日 2:00:00 CET)
              最新定时任务 [*/10 * * * *] n/a
              又一个定时任务 [*/10 * * * *] 于 2024年3月15日 1:40:00 CET 失败，耗时 2 秒 (下一个在 2024年3月15日 1:51:54 CET)
```

如果未指定部署，命令将显示当前项目的生产部署的详细信息。要查看最后一次部署的详细信息，请使用 `--last`，要查看特定部署的详细信息，请使用 `--id`（或位置参数）。你还可以使用 `--next` 或 `--prev` 按时间顺序浏览部署。

例如，要查看倒数第二次部署的详细信息，你可以这样做：

```shell
deployctl deployments show --last --prev
```

要查看特定部署后 2 次部署的详细信息：

```shell
deployctl deployments show 64tbrn8jre9n --next=2
```

### 重新部署

重新部署命令创建一个新的部署，重用现有部署的构建，目的是更改与之关联的资源。这包括生产域、环境变量和 KV 数据库。

:::info

选择要重新部署的部署的语义与 [show 子命令](#显示) 相同，包括 `--last`、`--id`、`--next` 和 `--prev`。

:::

#### 生产域

如果你想将项目的生产域路由到特定部署，可以使用 `--prod` 选项重新部署它：

```shell
deployctl deployments redeploy --prod 64tbrn8jre9n
```

这将创建一个新的部署，具有与指定部署相同的代码和环境变量，但项目的生产域名将指向它。对于具有预览/生产数据库的项目（即链接到 GitHub 的项目），这也将为新的部署设置生产数据库。

:::note

此功能类似于 Deno Deploy Web 应用程序中找到的“推广到生产”按钮，唯一的区别是“推广到生产”按钮不创建新的部署。相反，“推广到生产”按钮在原地更改域名路由，但仅限于已使用生产数据库的部署。

:::

#### KV 数据库

如果这是一个 GitHub 部署，它将拥有 2 个数据库，一个用于生产部署，一个用于预览部署。你可以通过使用 `--db` 选项重新部署来更改部署的数据库：

```shell
deployctl deployments redeploy --db=prod --id=64tbrn8jre9n
```

:::note

将部署重新部署到生产时，默认情况下，它将自动配置为使用生产数据库。你可以同时使用 `--prod` 和 `--db` 选项以选择不采用此行为。例如，以下命令将重新部署当前的生产部署（由于缺少位置参数，`--id` 或 `--last`）。新的部署将成为新的生产部署，但将使用预览数据库而不是生产数据库：

```shell
deployctl deployments redeploy --prod --db=preview
```

:::

如果你的组织有自定义数据库，你也可以通过 UUID 设置它们：

```shell
deployctl deployments redeploy --last --db=5261e096-f9aa-4b72-8440-1c2b5b553def
```

#### 环境变量

创建部署时，它会继承项目的环境变量。由于部署是不可变的，因此永远不能更改其环境变量。要在部署中设置新的环境变量，你需要使用 `--env`（设置单个变量）和 `--env-file`（加载一个或多个环境文件）重新部署它。

以下命令使用 `.env` 和 `.other-env` 文件中定义的环境变量重新部署当前的生产部署，并将 `DEPLOYMENT_TS` 变量设置为当前时间戳。生成的部署将是一个预览部署（即生产域将不路由流量到它，因为缺少 `--prod`）。

```shell
deployctl deployments redeploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

:::note

请注意，在更改环境变量时，仅在重新部署命令中设置的环境变量将被新部署使用。项目环境变量和正在重新部署的部署的环境变量将被忽略。如果这不符合你的需求，请在 https://github.com/denoland/deploy_feedback/issues/ 报告你的反馈。

:::

:::note

当你在 Deno Deploy Web 应用程序中更改项目环境变量时，当前的生产部署将使用新的环境变量重新部署，并且新部署将成为新的生产部署。

:::

### 删除

你可以使用 `delete` 子命令删除一个部署：

```shell
deployctl deployments delete 64tbrn8jre9n
```

与 `show` 和 `redeploy` 一样，`delete` 也可以使用 `--last`、`--next` 和 `--prev` 选择要删除的部署。以下是删除项目中所有部署（除了最后一个）的示例命令（使用时请谨慎！）：

```shell
while deployctl deployments delete --project=my-project --last --prev; do :; done
```

## 项目

`projects` 子命令将所有与项目整体相关的操作分组。这包括 `list`、`show`、`rename`、`create` 和 `delete`。

### 列出

`deployctl projects list` 输出你用户可以访问的所有项目，按组织分组：

```
个人组织:
    blog
    url-shortener

'my-team' 组织:
    admin-site
    main-site
    analytics
```

你可以使用 `--org` 通过组织进行过滤：

```shell
deployctl projects list --org=my-team
```

### 显示

要查看特定项目的详细信息，请使用 `projects show`。如果你在项目内，它将从配置文件中获取项目 ID。你也可以使用 `--project` 或位置参数指定项目：

```shell
deployctl projects show main-site
```

输出：

```
main-site
---------
组织:        my-team (5261e096-f9aa-4b72-8440-1c2b5b553def)
域名:       https://my-team.com
              https://main-site.deno.dev
仪表盘 URL:  https://dash.deno.com/projects/8422c515-f68f-49b2-89f3-157f4b144611
代码库:      https://github.com/my-team/main-site
数据库:      [main] dd28e63e-f495-416b-909a-183380e3a232
              [*] e061c76e-4445-409a-bc36-a1a9040c83b3
定时任务:    另一个定时任务 [*/10 * * * *] 于 2024年3月12日 14:40:00 CET 成功，耗时 2 秒 (下一个在 2024年3月12日 14:50:00 CET)
              最新定时任务 [*/10 * * * *] n/a
              又一个定时任务 [*/10 * * * *] 于 2024年3月12日 14:40:00 CET 失败，耗时 2 秒 (下一个在 2024年3月12日 14:50:00 CET)
部署:        kcbxc4xwe4mc c0ph5xa9exb3* kwkbev9er4h2 dxseq0jc8402 7xr5thz8yjbz
              4qr4h5ac3rfn 25wryhcqmb9q 64tbrn8jre9n hgqgccnmzg04 rxkh1w3g74e8
              wx6cw9aya64c a1qh5fmew2yf w6pf4r0rrdkb nn700gexgdzq 98crfqxa6vvf
              xcdcs014yc5p btw43kx89ws1 62tg1ketkjx7 07ag6pt6kjex 4msyne1rvwj1
```

### 重命名

项目可以通过 `rename` 子命令轻松重命名。与其他命令类似，如果你在项目的目录中运行命令，则无需指定项目的当前名称：

```shell
deployctl projects rename my-personal-blog
```

输出：

```
ℹ 使用配置文件 '/private/tmp/blog/deno.json'
✔ 找到项目 'blog' (8422c515-f68f-49b2-89f3-157f4b144611)
✔ 项目 'blog' 重命名为 'my-personal-blog'
```

:::note

请记住，项目名称是预览域名的一部分 (https://my-personal-blog-kcbxc4xwe4mc.deno.dev) 和默认生产域名 (https://my-personal-blog.deno.dev)。因此，在更改项目名称时，之前名称的 URL 将不再路由到项目的相应部署。

:::

### 创建

你可以创建一个空项目：

```shell
deployctl projects create my-new-project
```

### 删除

你可以删除一个项目：

```shell
deployctl projects delete my-new-project
```

## 监控资源使用情况

`top` 子命令用于实时监控项目的资源使用情况：

```shell
deployctl top
```

输出：

```
┌────────┬────────────────┬────────────────────────┬─────────┬───────┬─────────┬──────────┬─────────────┬────────────┬─────────┬─────────┬───────────┬───────────┐
│ (idx)  │ 部署           │ 区域                  │ 每分钟请求 │ CPU%  │ 每请求 CPU │ RSS/5分钟 │ 每分钟流入  │ 每分钟流出 │ KV 读/分钟 │ KV 写/分钟 │ 队列入队/分钟 │ 队列出队/分钟 │
├────────┼────────────────┼────────────────────────┼─────────┼───────┼─────────┼──────────┼─────────────┼────────────┼─────────┼─────────┼───────────┼───────────┤
│ 6b80e8 │ "kcbxc4xwe4mc" │ "亚洲-东北1"          │      80 │ 0.61  │ 4.56    │ 165.908  │ 11.657      │ 490.847    │       0 │       0 │         0 │         0 │
│ 08312f │ "kcbxc4xwe4mc" │ "亚洲-东北1"          │      76 │ 3.49  │ 27.58   │ 186.278  │ 19.041      │ 3195.288   │       0 │       0 │         0 │         0 │
│ 77c10b │ "kcbxc4xwe4mc" │ "亚洲-南部1"          │      28 │ 0.13  │ 2.86    │ 166.806  │ 7.354       │ 111.478    │       0 │       0 │         0 │         0 │
│ 15e356 │ "kcbxc4xwe4mc" │ "亚洲-南部1"          │      66 │ 0.97  │ 8.93    │ 162.288  │ 17.56       │ 4538.371   │       0 │       0 │         0 │         0 │
│ a06817 │ "kcbxc4xwe4mc" │ "亚洲-东南部1"        │     126 │ 0.44  │ 2.11    │ 140.087  │ 16.504      │ 968.794    │       0 │       0 │         0 │         0 │
│ d012b6 │ "kcbxc4xwe4mc" │ "亚洲-东南部1"        │     119 │ 2.32  │ 11.72   │ 193.704  │ 23.44       │ 8359.829   │       0 │       0 │         0 │         0 │
│ 7d9a3d │ "kcbxc4xwe4mc" │ "澳大利亚-东南部1"    │       8 │ 0.97  │ 75      │ 158.872  │ 10.538      │ 3.027      │       0 │       0 │         0 │         0 │
│ 3c21be │ "kcbxc4xwe4mc" │ "澳大利亚-东南部1"    │       1 │ 0.04  │ 90      │ 105.292  │ 0.08        │ 1.642      │       0 │       0 │         0 │         0 │
│ b75dc7 │ "kcbxc4xwe4mc" │ "欧洲-西部2"          │     461 │ 5.43  │ 7.08    │ 200.573  │ 63.842      │ 9832.936   │       0 │       0 │         0 │         0 │
│ 33607e │ "kcbxc4xwe4mc" │ "欧洲-西部2"          │      35 │ 0.21  │ 3.69    │ 141.98   │ 9.438       │ 275.788    │       0 │       0 │         0 │         0 │
│ 9be3d2 │ "kcbxc4xwe4mc" │ "欧洲-西部2"          │     132 │ 0.92  │ 4.19    │ 180.654  │ 15.959      │ 820.513    │       0 │       0 │         0 │         0 │
│ 33a859 │ "kcbxc4xwe4mc" │ "欧洲-西部3"          │    1335 │ 7.57  │ 3.4     │ 172.032  │ 178.064     │ 10967.918  │       0 │       0 │         0 │         0 │
│ 3f54ce │ "kcbxc4xwe4mc" │ "欧洲-西部4"          │     683 │ 4.76  │ 4.19    │ 187.802  │ 74.696      │ 7565.017   │       0 │       0 │         0 │         0 │
│ cf881c │ "kcbxc4xwe4mc" │ "欧洲-西部4"          │     743 │ 3.95  │ 3.19    │ 177.213  │ 86.974      │ 6087.454   │       0 │       0 │         0 │         0 │
│ b4565b │ "kcbxc4xwe4mc" │ "美洲-西部1"          │       3 │ 0.21  │ 55      │ 155.46   │ 2.181       │ 0.622      │       0 │       0 │         0 │         0 │
│ b97970 │ "kcbxc4xwe4mc" │ "南美-东部1"          │       3 │ 0.08  │ 25      │ 186.049  │ 1.938       │ 0.555      │       0 │       0 │         0 │         0 │
│ fd7a08 │ "kcbxc4xwe4mc" │ "美国-东部4"          │       3 │ 0.32  │ 80      │ 201.101  │ 0.975       │ 58.495     │       0 │       0 │         0 │         0 │
│ 95d68a │ "kcbxc4xwe4mc" │ "美国-东部4"          │     133 │ 1.05  │ 4.77    │ 166.052  │ 28.107      │ 651.737    │       0 │       0 │         0 │         0 │
│ c473e7 │ "kcbxc4xwe4mc" │ "美国-东部4"          │       0 │ 0     │ 0       │ 174.154  │ 0.021       │ 0          │       0 │       0 │         0 │         0 │
│ ebabfb │ "kcbxc4xwe4mc" │ "美国-东部4"          │      19 │ 0.15  │ 4.78    │ 115.732  │ 7.764       │ 67.054     │       0 │       0 │         0 │         0 │
│ eac700 │ "kcbxc4xwe4mc" │ "美国-南部1"          │     114 │ 2.37  │ 12.54   │ 183.001  │ 18.401      │ 22417.397  │       0 │       0 │         0 │         0 │
│ cd2194 │ "kcbxc4xwe4mc" │ "美国-南部1"          │      35 │ 0.33  │ 5.68    │ 145.871  │ 8.142       │ 91.236     │       0 │       0 │         0 │         0 │
│ 140fec │ "kcbxc4xwe4mc" │ "美国-西部2"          │     110 │ 1.43  │ 7.84    │ 115.298  │ 18.093      │ 977.993    │       0 │       0 │         0 │         0 │
│ 51689f │ "kcbxc4xwe4mc" │ "美国-西部2"          │    1105 │ 7.66  │ 4.16    │ 187.277  │ 154.876     │ 14648.383  │       0 │       0 │         0 │         0 │
│ c5806e │ "kcbxc4xwe4mc" │ "美国-西部2"          │     620 │ 4.38  │ 4.24    │ 192.291  │ 109.086     │ 9685.688   │       0 │       0 │         0 │         0 │
└────────┴────────────────┴────────────────────────┴─────────┴───────┴─────────┴──────────┴─────────────┴────────────┴─────────┴─────────┴───────────┴───────────┘
⠼ 正在流媒体...
```

列的定义如下：

| 列         | 描述                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------- |
| idx         | 实例区分符。用于区分在同一区域运行的不同执行的不透明 ID。                                        |
| 部署        | 正在执行的实例中运行的部署的 ID。                                                               |
| 每分钟请求  | 项目每分钟接收的请求数。                                                                        |
| CPU%        | 项目使用的 CPU 百分比。                                                                         |
| 每请求 CPU   | 每个请求的 CPU 时间，以毫秒为单位。                                                               |
| RSS/5分钟  | 项目在最近 5 分钟内使用的最大 RSS，单位为 MB。                                                  |
| 每分钟流入  | 项目每分钟接收的数据，单位为 KB。                                                                  |
| 每分钟流出  | 项目每分钟输出的数据，单位为 KB。                                                                  |
| KV 读/分钟  | 项目每分钟执行的 KV 读取。                                                                        |
| KV 写/分钟  | 项目每分钟执行的 KV 写入。                                                                        |
| 队列入队/分钟 | 项目每分钟执行的队列入队。                                                                      |
| 队列出队/分钟 | 项目每分钟执行的队列出队。                                                                      |

你可以使用 `--region` 按区域过滤，该选项接受子字符串并可以多次使用：

```shell
deployctl top --region=asia --region=southamerica
```

## 日志

你可以使用 `deployctl logs` 获取你的部署的日志。它支持实时日志（日志生成时流式传输到控制台）和查询已保存的日志（获取过去生成的日志）。

要显示项目当前生产部署的实时日志：

```shell
deployctl logs
```

:::note

与 Deno Deploy Web 应用程序不同，目前日志子命令在更改时不会自动切换到新的生产部署。

:::

要显示特定部署的实时日志：

```shell
deployctl logs --deployment=1234567890ab
```

日志可以使用 `--levels`、`--regions` 和 `--grep` 选项按级别、区域和文本过滤：

```shell
deployctl logs --levels=error,info --regions=region1,region2 --grep='unexpected'
```

要显示已保存的日志，可以使用 `--since` 和/或 `--until` 选项：

<deno-tabs groupId="operating-systems">
  <deno-tab value="mac" label="macOS" default>

```sh
deployctl logs --since=$(date -Iseconds -v-2H) --until=$(date -Iseconds -v-30M)
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
deployctl logs --since=$(date -Iseconds --date='2 hours ago') --until=$(date -Iseconds --date='30 minutes ago')
```

</deno-tab>
</deno-tabs>

## API

如果你使用 [子托管 API](../../subhosting/manual/index.md)，`deployctl api` 将帮助你与 API 交互，同时处理身份验证和头信息：

```shell
deployctl api /projects/my-personal-blog/deployments
```

使用 `--method` 和 `--body` 指定 HTTP 方法和请求体：

```shell
deployctl api --method=POST --body='{"name": "main-site"}' organizations/5261e096-f9aa-4b72-8440-1c2b5b553def/projects
```

## 本地开发

对于本地开发，你可以使用 `deno` CLI。要安装 `deno`，请遵循 [Deno 手册](https://deno.land/manual/getting_started/installation) 中的说明。

安装完成后，你可以在本地运行你的脚本：

```shell
$ deno run --allow-net=:8000 ./main.ts
Listening on http://localhost:8000
```

要监视文件更改，请添加 `--watch` 标志：

```shell
$ deno run --allow-net=:8000 --watch ./main.ts
Listening on http://localhost:8000
```

有关 Deno CLI 的更多信息，以及如何配置你的开发环境和 IDE，请访问 Deno 手册的 [入门][manual-gs] 部分。

[manual-gs]: https://deno.land/manual/getting_started

## JSON 输出

所有输出数据的命令都有一个 `--format=json` 选项，将数据以 JSON 对象的形式输出。当 stdout 不是 TTY 时，这种输出模式是默认的，尤其是当以管道输入到其他命令时。与 `jq` 一起使用时，这种模式使得对 `deployctl` 提供的所有数据进行编程使用：

获取当前生产部署的 ID：

```shell
deployctl deployments show | jq .build.deploymentId
```

获取每个区域每个隔离的 CPU 时间流的 csv：

```shell
deployctl top | jq -r '[.id,.region,.cpuTimePerRequest] | @csv'
```