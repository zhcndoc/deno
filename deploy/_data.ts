import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "Deno Deploy",
    items: [
      { title: "关于", href: "/deploy/" },
      {
        title: "快速入门",
        href: "/deploy/getting_started/",
      },
      {
        title: "从 Deploy Classic 迁移",
        href: "/deploy/migration_guide/",
      },
    ],
  },
  {
    title: "参考",
    items: [
      {
        title: "REST API",
        href: "https://api.deno.com/v2/docs",
      },
      {
        title: "账户",
        href: "/deploy/reference/accounts/",
      },
      {
        title: "组织",
        href: "/deploy/reference/organizations/",
      },
      {
        title: "应用",
        href: "/deploy/reference/apps/",
      },
      {
        title: "构建",
        href: "/deploy/reference/builds/",
      },
      {
        title: "环境变量与上下文",
        href: "/deploy/reference/env_vars_and_contexts/",
      },
      {
        title: "时间线",
        href: "/deploy/reference/timelines/",
      },
      {
        title: "隧道",
        href: "/deploy/reference/tunnel/",
      },
      {
        title: "可观测性",
        href: "/deploy/reference/observability/",
      },
      {
        title: "域名",
        href: "/deploy/reference/domains/",
      },
      {
        title: "Cron",
        href: "/deploy/reference/cron/",
      },
      {
        title: "Deno KV",
        href: "/deploy/reference/deno_kv/",
      },
      {
        title: "数据库",
        href: "/deploy/reference/databases/",
      },
      {
        title: "云连接",
        href: "/deploy/reference/cloud_connections/",
      },
      {
        title: "OIDC",
        href: "/deploy/reference/oidc/",
      },
      {
        title: "运行时",
        href: "/deploy/reference/runtime/",
      },
      {
        title: "框架支持",
        href: "/deploy/reference/frameworks/",
      },
      {
        title: "CDN 与缓存",
        href: "/deploy/reference/caching/",
      },
      {
        title: "游乐场",
        href: "/deploy/reference/playgrounds/",
      },
      {
        title: "部署按钮",
        href: "/deploy/reference/button/",
      },
    ],
  },
  {
    title: "KV",
    items: [
      { title: "概览", href: "/deploy/kv/" },
      { title: "键空间", href: "/deploy/kv/key_space/" },
      { title: "操作", href: "/deploy/kv/operations/" },
      {
        title: "键过期",
        href: "/deploy/kv/key_expiration/",
      },
      {
        title: "二级索引",
        href: "/deploy/kv/secondary_indexes/",
      },
      { title: "事务", href: "/deploy/kv/transactions/" },
      { title: "Node", href: "/deploy/kv/node/" },
      {
        title: "数据建模",
        href: "/deploy/kv/data_modeling_typescript/",
      },
      { title: "备份", href: "/deploy/kv/backup/" },
    ],
  },
  {
    title: "政策和限制",
    items: [
      {
        title: "使用与限制",
        href: "/deploy/usage/",
      },
      {
        title: "可接受使用政策",
        href: "/deploy/acceptable_use_policy/",
      },
      {
        title: "履约政策",
        href: "/deploy/fulfillment_policy/",
      },
      { title: "隐私政策", href: "/deploy/privacy_policy/" },
      { title: "安全性", href: "/deploy/security/" },
      {
        title: "条款和条件",
        href: "/deploy/terms_and_conditions/",
      },
    ],
  },
  {
    title: "支持与反馈",
    items: [
      {
        title: "更新日志",
        href: "/deploy/changelog/",
      },
      { title: "支持", href: "/deploy/support/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deno Deploy";
export const sectionHref = "/deploy/";
export const SidebarNav = [
  {
    title: "Deno Deploy",
    href: "/deploy/",
  },
  {
    title: "Deno 沙箱",
    href: "/sandbox/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/classic/",
  },
  {
    title: "子托管",
    href: "/subhosting/manual/",
  },
] satisfies SidebarNav;
