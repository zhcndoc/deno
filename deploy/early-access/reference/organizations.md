---
title: 组织
description: "在 Deno Deploy 早期访问中创建和管理组织的指南，包括成员、权限和组织管理。"
---

:::info

您正在查看 Deno Deploy<sup>EA</sup> 的文档。想找 Deploy Classic 文档？[点击此处查看](/deploy/)。

:::

组织是一组用户，共同拥有应用和域。注册 Deno Deploy<sup>EA</sup> 后，每个用户可以创建一个组织，或者被其他 Deno Deploy<sup>EA</sup> 用户邀请加入现有组织。

所有用户必须属于某个组织，才能使用 Deno Deploy<sup>EA</sup>，因为所有资源均归组织所有。

组织有名称和标识符（slug）。名称仅对组织成员可见，会显示在 Deno Deploy<sup>EA</sup> 和 Deploy Classic 的组织下拉菜单中。组织标识符用于组织的默认域名。

:::caution

目前组织名称不可更改，创建后组织的 slug 也不可修改。

:::

每个组织都有一个默认域名，用于该组织项目的生产环境、Git 分支和预览 URL。例如，标识符为 `acme-inc` 的组织，其默认组织域名为 `acme-inc.deno.net`。

组织可以拥有多个成员。目前，每个成员都是该组织的所有者，意味着他们可以邀请其他成员、创建和删除应用，以及管理域名。

## 创建组织

Deno Deploy<sup>EA</sup> 的组织通过 Deno Deploy Classic 控制面板创建。创建组织的步骤：

1. 访问 [Deploy Classic 控制面板](https://dash.deno.com)，并使用 GitHub 账号登录。
2. 点击屏幕左上角组织下拉菜单中的 "+" 按钮。
3. 选择“尝试新的 Deno Deploy”选项。
4. 点击“创建早期访问组织”按钮。
5. 输入组织名称和标识符（slug），然后点击“创建”。

:::info

组织的 slug 必须在所有 Deno Deploy<sup>EA</sup> 组织中唯一，且不能与任何 Deno Deploy Classic 项目名称相同。

:::

## 删除组织

目前无法通过控制面板删除组织。如需删除组织，请[联系 Deno 支持](../support)。

## 邀请用户加入组织

邀请用户时，进入组织设置页面，点击“+ 邀请用户”按钮。然后输入用户的 GitHub 账号用户名（例如 `ry`）。您也可以填写一个电子邮件地址，我们会将邀请发送到该邮箱。如果未指定邮箱，我们将尝试发送到用户公开 GitHub 资料上的邮箱（如果有），或者发送到我们已记录的该用户其他邮箱。点击“邀请”发送邀请。

邀请用户后，如果我们记录了对方的邮箱，用户将收到含邀请链接的邮件。他们必须点击链接并接受邀请，才能加入组织。您也可以直接发送个性化邀请链接给被邀请的用户——该链接会在邀请用户后显示于控制面板的成员表中。

用户在接受邀请前可以被取消邀请。取消邀请不会再发送邮件，但会使邀请链接失效。操作方法是在成员表中找到该用户，点击删除按钮，然后确认保存。

## 从组织移除用户

若要移除成员，找到组织设置中成员表里的该用户，点击移除按钮，然后确认“删除”。